import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SesionService, PeticionesAPIService, CalculosService } from 'src/app/servicios';
import { Cuestionario } from 'src/app/clases';
import Swal from 'sweetalert2';
import { AgregarPreguntasDialogComponent } from './agregar-preguntas-dialog/agregar-preguntas-dialog.component';
import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-crear-cuestionario',
  templateUrl: './crear-cuestionario.component.html',
  styleUrls: ['./crear-cuestionario.component.scss']
})
export class CrearCuestionarioComponent implements OnInit {

  // ID del Profesor
  profesorId: number;

  // Cuestionario que hemos creado
  cuestionario: Cuestionario;

  // Para el stepper
  myForm: FormGroup;

  // URL del inicio
  URLVueltaInicio: string;

  // Para saber si el botón está habilitado o no
  // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;

  // Ver el estado de si el cuestionario esta creado o aun no
  cuestionarioYaCreado: Boolean = false;

  finalizar: Boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog,
              public sesion: SesionService,
              public peticionesAPI: PeticionesAPIService,
              private _formBuilder: FormBuilder,
              public calculos: CalculosService) { }

  ngOnInit() {

    // Cogemos el ID del Profesor de la URL
    this.profesorId = this.sesion.DameProfesor().id;

    this.URLVueltaInicio = this.route.snapshot.queryParams.URLVueltaInicio || '/inicio';

    this.myForm = this._formBuilder.group({
      tituloCuestionario: ['', Validators.required],
      descripcionCuestionario: ['', Validators.required]
    });

    this.peticionesAPI.DameTodosMisCuestionarios (this.profesorId)
    .subscribe (lista => this.sesion.TomaListaCuestionarios(lista));
  }

  // MIRO SI HAY ALGO SIMULTÁNEAMENTE EN EL NOMBRE Y LA DESCRIPCIÓN
  Disabled() {
    if (this.myForm.value.tituloCuestionario === '' || this.myForm.value.descripcionCuestionario === '') {
      // Si alguno de los valores es igual a nada, entonces estará desactivado
      this.isDisabled = true;
    } else {
      // Si ambos son diferentes a nulo, estará activado.
      this.isDisabled = false;
    }
  }

  // CREACION DEL GRUPO CON EL TITULO Y LA DESCRIPCION QUE HAYAMOS ESTABLECIDO
  CrearCuestionario() {
    let tituloCuestionario: string;
    let descripcionCuestionario: string;

    tituloCuestionario = this.myForm.value.tituloCuestionario;
    descripcionCuestionario = this.myForm.value.descripcionCuestionario;

    this.peticionesAPI.CreaCuestionario(new Cuestionario(tituloCuestionario, descripcionCuestionario), this.profesorId)
    .subscribe((res) => {
      if (res != null) {
        this.cuestionarioYaCreado = true;
        this.cuestionario = res;
      } else {
        Swal.fire('Se ha producido un error creando el cuestionario', 'ERROR', 'error');
      }
    });
  }

  // NOS PERMITE HACER MODIFICACIONES EN LAS CARACTERISTICAS DEL CUESTIONARIO
  EditarCuestionario() {
    let tituloCuestionario: string;
    let descripcionCuestionario: string;

    tituloCuestionario = this.myForm.value.tituloCuestionario;
    descripcionCuestionario = this.myForm.value.descripcionCuestionario;

    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.ModificaCuestionario(new Cuestionario(tituloCuestionario, descripcionCuestionario), this.profesorId, this.cuestionario.id)
    .subscribe((res) => {
      if (res != null) {
        this.cuestionario = res;
      } else {
        Swal.fire('Se ha producido un error editando el cuestionario', 'ERROR', 'error');
      }

    });
  }

  AbrirDialogoAgregarPreguntas(): void {
    const dialogRef = this.dialog.open(AgregarPreguntasDialogComponent, {
      width: '80%',
      height: '80%',
      position: {
        top: '0%'
      },
      // Pasamos los parametros necesarios
      data: {
        cuestionarioId: this.cuestionario.id,
        profesorId: this.profesorId
      }
    });
  }

  // VUELTA AL INICIO
  VueltaInicio() {
    this.router.navigate([this.URLVueltaInicio, this.profesorId]);
  }

  goBack() {
    this.router.navigate(['/inicio/' + this.profesorId]);
  }
  aceptarGoBack() {
    Swal.fire('El cuestionario se ha creado correctamente', 'Enhorabuena', 'success');
    this.finalizar = true;
    this.goBack();
  }

  // Aqui establecemos la guarda por si el usuario quiere abandonar la creacion del
  // cuestionario antes de tiempo
  canExit(): Observable <boolean> {
    if (!this.cuestionarioYaCreado || this.finalizar) {
      return of (true);
    } else {


      const confirmacionObservable = new Observable <boolean>(obs =>  {Swal.fire({
        title: 'Abandonar',
        text: "Confirma que quieres abandonar el proceso de creación de cuestionario",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
  
      }).then((result: any) => {
        if (result.value) {
          this.sesion.TomaCuestionario (this.cuestionario);
         this.calculos.EliminarCuestionario().subscribe ( () => obs.next(result.value));
        }else{obs.next(result.value);}
      })
    });
      return confirmacionObservable;

    }
  }
}

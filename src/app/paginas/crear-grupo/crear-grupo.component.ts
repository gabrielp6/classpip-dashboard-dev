import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgregarAlumnoDialogComponent } from './agregar-alumno-dialog/agregar-alumno-dialog.component';
import { MatDialog, MatTabGroup } from '@angular/material';

// Servicios
import { SesionService, PeticionesAPIService, CalculosService } from '../../servicios/index';

// Clases
import { Grupo } from '../../clases/index';
import { Location } from '@angular/common';
import { Observable} from 'rxjs';
import { of } from 'rxjs';
import 'rxjs';

import Swal from 'sweetalert2';
import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';





@Component({
  selector: 'app-crear-grupo',
  templateUrl: './crear-grupo.component.html',
  styleUrls: ['./crear-grupo.component.scss']
})
export class CrearGrupoComponent implements OnInit {

  // Identificador del profesor
  profesorId: number;

  // Grupo que hemos creado
  grupo: Grupo;

  // Para el stepper
  myForm: FormGroup;

  // URL del inicio
  URLVueltaInicio: string;

  // Para saber si el botón está habilitado o no
  // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;

  // AL PRINCIPIO EL GRUPO NO ESTA CREADO
  // tslint:disable-next-line:ban-types
  grupoYaCreado: Boolean = false;
  // tslint:disable-next-line:ban-types
  finalizar: Boolean = false;


  constructor(private route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog,
              public sesion: SesionService,
              public peticionesAPI: PeticionesAPIService,
              public calculos: CalculosService,
              // tslint:disable-next-line:variable-name
              private _formBuilder: FormBuilder,
              private location: Location ) { }


  ngOnInit() {

    // REALMENTE LA APP FUNCIONARÁ COGIENDO AL PROFESOR DEL SERVICIO, NO OBSTANTE AHORA LO RECOGEMOS DE LA URL
    // this.profesorId = this.profesorService.RecibirProfesorIdDelServicio();
    this.profesorId = this.sesion.DameProfesor().id;

    // tslint:disable-next-line:no-string-literal
    this.URLVueltaInicio = this.route.snapshot.queryParams['URLVueltaInicio'] || '/inicio';

    this.myForm = this._formBuilder.group({
      nombreGrupo: ['', Validators.required],
      descripcionGrupo: ['', Validators.required]
    });

    this.peticionesAPI.DameGruposProfesor (this.profesorId)
    .subscribe (lista => this.sesion.TomaListaGrupos(lista));
  }

  // CREAMOS UN GRUPO DÁNDOLE UN NOMBRE Y UNA DESCRIPCIÓN
  CrearGrupo() {

    let nombreGrupo: string;
    let descripcionGrupo: string;

    nombreGrupo = this.myForm.value.nombreGrupo;
    descripcionGrupo = this.myForm.value.descripcionGrupo;

    console.log('Entro a crear el grupo ' + nombreGrupo);

    this.peticionesAPI.CreaGrupo(new Grupo(nombreGrupo, descripcionGrupo), this.profesorId)
    .subscribe((res) => {
      if (res != null) {
        console.log('Ya se ha creado el grupo ' + res);
        this.grupoYaCreado = true; // Si tiro atrás y cambio algo se hará un PUT y no otro POST
        this.grupo = res;
      } else {
        console.log('Fallo en la creación');
        Swal.fire('Se ha producido un error creando el grupo', 'ERROR', 'error');
      }
    });
  }

  // NOS PERMITE MODIFICAR EL NOMBRE Y LA DESCRIPCIÓN DEL GRUPO QUE ESTAMOS CREANDO
  EditarGrupo() {

    console.log('Entro a editar');
    let nombreGrupo: string;
    let descripcionGrupo: string;

    nombreGrupo = this.myForm.value.nombreGrupo;
    descripcionGrupo = this.myForm.value.descripcionGrupo;

    this.peticionesAPI.ModificaGrupo(new Grupo(nombreGrupo, descripcionGrupo), this.profesorId, this.grupo.id)
    .subscribe((res) => {
      if (res != null) {
        console.log('Voy a editar el equipo con id ' + this.grupo.id);
        this.grupo = res;
      } else {
        console.log('fallo editando');
      }
    });
  }

  // SI QUEREMOS AÑADIR ALUMNOS MANUALMENTE LO HAREMOS A TRAVÉS DE UN DIÁLOGO
  AbrirDialogoAgregarAlumnos(): void {
    const dialogRef = this.dialog.open(AgregarAlumnoDialogComponent, {
      width: '50%',
      height: '80%',
      position: {
        top: '0%'
      },
      // Le pasamos solo los id del grupo y profesor ya que es lo único que hace falta para vincular los alumnos
      data: {
        grupoId: this.grupo.id,
        profesorId: this.profesorId
      }
    });
  }

  // VUELTA AL INICIO
  VueltaInicio() {
    this.router.navigate([this.URLVueltaInicio, this.profesorId]);
    console.log(this.URLVueltaInicio);
  }

  goBack() {
    this.router.navigate(['/inicio/' + this.profesorId]);
  }
  aceptarGoBack() {
    Swal.fire('El grupo se ha creado correctamente', 'Enhorabuena', 'success');
    this.finalizar = true;
    this.goBack();
  }

  // MIRO SI HAY ALGO SIMULTÁNEAMENTE EN EL NOMBRE Y LA DESCRIPCIÓN
  Disabled() {
    if (this.myForm.value.nombreGrupo === '' || this.myForm.value.descripcionGrupo === '') {
      // Si alguno de los valores es igual a nada, entonces estará desactivado
      this.isDisabled = true;
    } else {
      // Si ambos son diferentes a nulo, estará activado.
      this.isDisabled = false;
    }
  }
  // Esta es la función a la que llama la guarda
  // Pedimos al usuario confirmación de que quiere abandonar a medias
  // la creación de grupo.

  canExit(): Observable <boolean> {
    if (!this.grupoYaCreado || this.finalizar) {
      return of (true);
    } else {
      
   const confirmacionObservable = new Observable <boolean>(obs =>  {Swal.fire({
        title: 'Abandonar',
        text: "Confirma que quieres abandonar el proceso de creación de grupo",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
  
      }).then((result : any) => {
        if (result.value) {
          this.sesion.TomaGrupo (this.grupo);
          this.calculos.EliminarGrupo().then ( () => obs.next(result.value));
        } else {obs.next(result.value);}
      })
    });
      return confirmacionObservable;
    }
  }
}

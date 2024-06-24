import { Component, OnInit } from '@angular/core';
import { Cuestionario, CuestionarioSatisfaccion, Pregunta } from 'src/app/clases';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import { Location } from '@angular/common';
import { MatDialog, MatTableDataSource } from '@angular/material';
import Swal from 'sweetalert2';
import { AgregarPreguntasDialogComponent } from '../crear-cuestionario/agregar-preguntas-dialog/agregar-preguntas-dialog.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-editar-cuestionario-satisfaccion',
  templateUrl: './editar-cuestionario-satisfaccion.component.html',
  styleUrls: ['./editar-cuestionario-satisfaccion.component.scss']
})
export class EditarCuestionarioSatisfaccionComponent implements OnInit {
  cuestionarioSeleccionado: CuestionarioSatisfaccion;
  profesorId: number;
  titulo: string;
  descripcion: string;
  cuestionarioModificado = false;

  constructor(public dialog: MatDialog,
              public sesion: SesionService,
              public peticionesAPI: PeticionesAPIService,
              private location: Location) { }

  ngOnInit() {
    // Recogemos la informacion de la sesion
    this.cuestionarioSeleccionado = this.sesion.DameCuestionarioSatisfaccion();
    this.profesorId = this.sesion.DameProfesor().id;
    // this.peticionesAPI.DamePreguntasCuestionario(this.cuestinarioSeleccionado.id)
    // .subscribe((res) => {
    //   this.preguntasCuestionarioSeleccionado = res;
    //   this.dataSource = new MatTableDataSource(this.preguntasCuestionarioSeleccionado);
    // });

    //Establecemos el valor que le corresponde a los inputs
    // this.titulo = this.cuestionarioSeleccionado.Titulo;
    // this.descripcion = this.cuestionarioSeleccionado.Descripcion;
  }

  dropAfirmacion(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.cuestionarioSeleccionado.Afirmaciones, event.previousIndex, event.currentIndex);
    this.cuestionarioModificado = true;
  }

  EliminarAfirmacion(i) {
    this.cuestionarioSeleccionado.Afirmaciones.splice (i, 1);
    this.cuestionarioModificado = true;
  }

  EditarAfirmacion(i) {
    Swal.fire({
      title: "Modifica la afirmación",
      input: 'text',
      inputValue: this.cuestionarioSeleccionado.Afirmaciones[i],
      showCancelButton: true
    }).then((result: any) => {
      if (result.value) {
        this.cuestionarioSeleccionado.Afirmaciones[i] = result.value;
        this.cuestionarioModificado = true;
      }
    });
  }
  NuevaAfirmacion() {
    Swal.fire({
      title: "Introduce la nueva afirmación",
      input: 'text',
      showCancelButton: true
    }).then((result:any) => {
      if (result.value) {
        this.cuestionarioSeleccionado.Afirmaciones.push (result.value);
        this.cuestionarioModificado = true;
      }
    });
  }


  dropPregunta(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.cuestionarioSeleccionado.PreguntasAbiertas, event.previousIndex, event.currentIndex);
    this.cuestionarioModificado = true;
  }

  EliminarPregunta(i) {
    this.cuestionarioSeleccionado.PreguntasAbiertas.splice (i, 1);
    this.cuestionarioModificado = true;
  }

  EditarPregunta(i) {
    Swal.fire({
      title: "Modifica lapregunta",
      input: 'text',
      inputValue: this.cuestionarioSeleccionado.PreguntasAbiertas[i],
      showCancelButton: true
    }).then((result : any) => {
      if (result.value) {
        this.cuestionarioSeleccionado.PreguntasAbiertas[i] = result.value;
        this.cuestionarioModificado = true;
      }
    });

  }

  NuevaPregunta() {
    Swal.fire({
      title: "Introduce la nueva pregunta",
      input: 'text',
      showCancelButton: true
    }).then((result : any) => {
      if (result.value) {
        this.cuestionarioSeleccionado.PreguntasAbiertas.push (result.value);
        this.cuestionarioModificado = true;
      }
    });
  }



  ModificarCuestionario() {
    Swal.fire({
      title: '¿Seguro que quieres hacer los cambios en el cuestionario de satisfacción?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {
        // tslint:disable-next-line:max-line-length
        this.peticionesAPI.ModificaCuestionarioSatisfaccion(this.cuestionarioSeleccionado)
        .subscribe((res) => {
          if(res != null) {
            Swal.fire('Ok', 'Cuestionario modificado correctamente', 'success');
            this.goBack();
            this.cuestionarioModificado = false;
          } else {
            console.log('Error guardando los cambios en el cuestionario');
          }
        });
      }
    });
  }

  // Nos devolvera a mis cuestionarios
  goBack() {
    if (this.cuestionarioModificado) {
      Swal.fire({
        title: '¿Seguro que quieres salir?',
        text: 'Has hecho cambios en el cuestionario y no los has salvado',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, estoy seguro'
      }).then((result) => {
        if (result.value) {
          this.location.back();
        }
      });

    } else {
      this.location.back();
    }
  }

  GenerarFichero() {
    delete this.cuestionarioSeleccionado.id;
    delete this.cuestionarioSeleccionado.profesorId;

    const theJSON = JSON.stringify(this.cuestionarioSeleccionado);
    console.log (theJSON);

    const uri = "data:application/json;charset=UTF-8," + encodeURIComponent(theJSON);

    const a = document.getElementById('generarJSON');
    a.setAttribute ('href', uri);
    a.setAttribute ('download', this.cuestionarioSeleccionado.Titulo);
    a.innerHTML = "Botón derecho aquí y selecciona 'deja el enlace como...'";

  }
}

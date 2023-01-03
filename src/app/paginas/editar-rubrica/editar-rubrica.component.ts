import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import { Location } from '@angular/common';
import { Rubrica } from 'src/app/clases';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';
import { BeforeAutoFillEventArgs, editReset } from '@syncfusion/ej2-grids';

@Component({
  selector: 'app-editar-rubrica',
  templateUrl: './editar-rubrica.component.html',
  styleUrls: ['./editar-rubrica.component.scss']
})
export class EditarRubricaComponent implements OnInit {

  rubricaSeleccionada: Rubrica;
  profesorId: number;
  rubricaModificada = false;
  rubricaNueva = false;
  editarRubrica: boolean;

  constructor(public dialog: MatDialog,
              public sesion: SesionService,
              public peticionesAPI: PeticionesAPIService,
              private location: Location) { }

  ngOnInit() {
    // Recogemos la informacion de la sesion
    this.profesorId = this.sesion.DameProfesor().id;
    this.rubricaSeleccionada = this.sesion.DameRubrica();
    // averiguo si la rubrica es para editar o solo para verla
    this.editarRubrica = this.sesion.RubricaParaEditar();
    if (!this.rubricaSeleccionada) {
      this.rubricaSeleccionada = new Rubrica ();
      this.rubricaSeleccionada.profesorId = this.profesorId;
      this.rubricaSeleccionada.Criterios = [];
      this.rubricaNueva = true;
    }
    console.log ('Rubrica seleccionada ', this.rubricaSeleccionada);
    console.log ('Editable ', this.editarRubrica);
   

  }

  dropCriterio(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.rubricaSeleccionada.Criterios, event.previousIndex, event.currentIndex);
    this.rubricaModificada = true;
  }
  

  EliminarCriterio(i) {
    Swal.fire({
      title: '¿Seguro que quieres eliminar el criterio?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.rubricaSeleccionada.Criterios.splice (i, 1);
        this.rubricaModificada = true;
      }
    });
  }

  EditarCriterio(i) {
    Swal.fire({
      title: 'Modifica el criterio',
      input: 'text',
      inputValue: this.rubricaSeleccionada.Criterios[i].Nombre ,
      showCancelButton: true
    }).then((result:any) => {
      if (result.value) {
        this.rubricaSeleccionada.Criterios[i].Nombre = result.value;
        this.rubricaModificada = true;
      }
    });
  }

  NuevoCriterio() {
    Swal.fire({
      title: 'Introduce el nuevo criterio',
      input: 'text',
      showCancelButton: true
    }).then((result:any) => {
      if (result.value) {
        this.rubricaSeleccionada.Criterios.push ({
          Nombre: result.value,
          Elementos: []
        });
        this.rubricaModificada = true;
      }
    });
  }


  dropElemento(i: number, event: CdkDragDrop<string[]>) {
    moveItemInArray(this.rubricaSeleccionada.Criterios[i].Elementos, event.previousIndex, event.currentIndex);
    this.rubricaModificada = true;
  }

  EliminarElemento(i,j) {
    Swal.fire({
      title: '¿Seguro que quieres eliminar el elemento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.rubricaSeleccionada.Criterios[i].Elementos.splice (j, 1);
        this.rubricaModificada = true;
      }
    });
 
  }

  EditarElemento(i, j) {
    Swal.fire({
      title: 'Modifica el elemento',
      input: 'text',
      inputValue: this.rubricaSeleccionada.Criterios[i].Elementos[j],
      showCancelButton: true
    }).then((result: any) => {
      if (result.value) {
        this.rubricaSeleccionada.Criterios[i].Elementos[j] = result.value;
        this.rubricaModificada = true;
      }
    });

  }

  NuevoElemento(i) {
    Swal.fire({
      title: 'Introduce el nuevo elemento',
      input: 'text',
      showCancelButton: true
    }).then((result : any) => {
      if (result.value) {
        this.rubricaSeleccionada.Criterios[i].Elementos.push (result.value);
        this.rubricaModificada = true;
      }
    });
  }
  
  ModificarRubrica() {
    if (this.rubricaNueva) {
      Swal.fire({
        title: '¿Seguro que quieres crear la rúbrica?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, estoy seguro',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          if (!this.rubricaSeleccionada.Nombre || !this.rubricaSeleccionada.Descripcion || !this.rubricaSeleccionada.Criterios) {
            Swal.fire('Error', 'Faltan datos por introducir', 'error');
          } else {
            this.peticionesAPI.CreaRubrica (this.rubricaSeleccionada, this.profesorId).subscribe();
            Swal.fire('OK', 'Rúbrica creada con éxito', 'success');
            this.rubricaModificada = false;
          }
        }
      });
    } else {
      Swal.fire({
        title: '¿Seguro que quieres guardar la rúbrica modificada?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, estoy seguro',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          this.peticionesAPI.ModificaRubrica  (this.rubricaSeleccionada).subscribe();
          Swal.fire('OK', 'Rúbrica modificada con éxito', 'success');
          this.rubricaModificada = false;
        }
      });

    }
 
  }
  goBack() {
    if (!this.editarRubrica) {
      this.location.back();
    } else {
      if (this.rubricaModificada) {
        Swal.fire({
          title: '¿Seguro que quieres salir?',
          text: 'Has hecho cambios en la rúbrica y no los has salvado',
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
  }


}

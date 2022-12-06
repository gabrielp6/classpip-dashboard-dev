import { MatDialog } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

// Clases
import { Cromo, Coleccion } from '../../../clases/index';

// Servicios
import { SesionService, PeticionesAPIService } from '../../../servicios/index';

import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';


import * as URL from '../../../URLs/urls';

export interface OpcionSeleccionada {
  nombre: string;
  id: string;
}

@Component({
  selector: 'app-editar-cromo-dialog',
  templateUrl: './editar-cromo-dialog.component.html',
  styleUrls: ['./editar-cromo-dialog.component.scss']
})
export class EditarCromoDialogComponent implements OnInit {

  cromo: Cromo;
  coleccion: Coleccion;
  cromosColeccion: Cromo[];
  cromosEditados: Cromo [] = [];
  cromosAMostrar: Cromo[];


  nombreCromo: string;
  nivelCromo: string;
  probabilidadCromo: string;


  // imagen cromo
  imagenCromoDelante: string;
  imagenCromoDetras: string;
  nombreImagenCromoDelante: string;
  nombreImagenCromoDetras: string;
  fileCromoDelante: File;
  fileCromoDetras: File;

  // tslint:disable-next-line:ban-types
  imagenDelanteCargada: Boolean = false;
  // tslint:disable-next-line:ban-types
  imagenDetrasCargada: Boolean = false;

  // tslint:disable-next-line:ban-types
  cambios: Boolean = false;

    // Opciones para mostrar en la lista desplegable para seleccionar el tipo de juego que listar
    opcionesProbabilidad: OpcionSeleccionada[] = [
      {nombre: 'Muy Baja', id: 'Muy Baja'},
      {nombre: 'Baja', id: 'Baja'},
      {nombre: 'Media', id: 'Media'},
      {nombre: 'Alta', id: 'Alta'},
      {nombre: 'Muy Alta', id: 'Muy Alta'},

    ];

    opcionSeleccionadaProbabilidad: string;

      // Opciones para mostrar en la lista desplegable para seleccionar el tipo de juego que listar
    opcionesNivel: OpcionSeleccionada[] = [
        {nombre: 'Diamante', id: 'Diamante'},
        {nombre: 'Platino', id: 'Platino'},
        {nombre: 'Oro', id: 'Oro'},
        {nombre: 'Plata', id: 'Plata'},
        {nombre: 'Bronce', id: 'Bronce'},
    ];
    opcionSeleccionadaNivel: string;



  constructor(
              public dialog: MatDialog,
              // private location: Location,
              private sesion: SesionService,
              private peticionesAPI: PeticionesAPIService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<EditarCromoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.cromo = this.data.cr;
    this.coleccion = this.data.coleccion;

    this.nombreCromo = this.cromo.Nombre;
    this.nivelCromo = this.cromo.Nivel;
    this.probabilidadCromo = this.cromo.Probabilidad;
    this.cromosColeccion = this.sesion.DameCromos();

    this.opcionSeleccionadaNivel = this.cromo.Nivel;
    // this.opcionSeleccionadaProbabilidad = this.cromo.Probabilidad;
    console.log(this.cromo);
    // Cargo el imagen del cromo
    this.TraeImagenCromo();
  }

  EditarCromo() {
    console.log('Entro a editar');
    console.log(this.probabilidadCromo);
    const ImagenAntiguaDelante = this.data.cr.ImagenDelante;
    const ImagenAntiguaDetras = this.data.cr.ImagenDetras;
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.ModificaCromoColeccion(new Cromo(this.nombreCromo,  this.probabilidadCromo, this.nivelCromo, this.nombreImagenCromoDelante, this.nombreImagenCromoDetras), this.cromo.coleccionId, this.cromo.id)
    .subscribe((res) => {
      if (res != null) {
        this.cromo = res;
        // this.cromosEditados.push (res);
        // console.log('nombre del cromo + nivel' + this.cromosEditados[0].Nombre + this.cromosEditados[0].Nivel);
        if (this.imagenDelanteCargada === true) {
          // HACEMOS EL POST DE LA NUEVA IMAGEN EN LA BASE DE DATOS
          console.log ('Nueva imagen');
          const formData: FormData = new FormData();
          formData.append(this.nombreImagenCromoDelante, this.fileCromoDelante);
          this.peticionesAPI.PonImagenCromo(formData)
          .subscribe(() => console.log('Imagen cargado'));
          this.peticionesAPI.BorrarImagenCromo(ImagenAntiguaDelante).subscribe();
        }

        if (this.imagenDetrasCargada === true) {
          // HACEMOS EL POST DE LA NUEVA IMAGEN EN LA BASE DE DATOS
          console.log ('Nueva imagen');
          const formData: FormData = new FormData();
          formData.append(this.nombreImagenCromoDetras, this.fileCromoDetras);
          this.peticionesAPI.PonImagenCromo(formData)
          .subscribe(() => console.log('Imagen cargado'));
          this.peticionesAPI.BorrarImagenCromo(ImagenAntiguaDetras).subscribe();
        }
      } else {
        console.log('fallo editando');
      }
    });
    // this.dialogRef.close(this.cromosEditados);
    this.cambios = false;
 }

  TraeImagenCromo() {

    if (this.cromo.ImagenDelante !== undefined ) {

      this.imagenCromoDelante = URL.ImagenesCromo + this.cromo.ImagenDelante;

      // Busca en la base de datos la imágen con el nombre registrado en cromo.Imagen y la recupera

        // this.peticionesAPI.DameImagenCromo (this.cromo.ImagenDelante)
        // .subscribe(response => {
        //   const blob = new Blob([response.blob()], { type: 'image/jpg'});

        //   const reader = new FileReader();
        //   reader.addEventListener('load', () => {
        //     this.imagenCromoDelante = reader.result.toString();
        //   }, false);

        //   if (blob) {
        //     reader.readAsDataURL(blob);
        //   }
        // });
    }

    if (this.cromo.ImagenDetras !== undefined ) {
      this.imagenCromoDetras = URL.ImagenesCromo + this.cromo.ImagenDetras;
      // Busca en la base de datos la imágen con el nombre registrado en cromo.Imagen y la recupera
      // this.peticionesAPI.DameImagenCromo (this.cromo.ImagenDetras)
      // .subscribe(response => {
      //   const blob = new Blob([response.blob()], { type: 'image/jpg'});

      //   const reader = new FileReader();
      //   reader.addEventListener('load', () => {
      //     this.imagenCromoDetras = reader.result.toString();
      //   }, false);

      //   if (blob) {
      //     reader.readAsDataURL(blob);
      //   }
      // });
  }
  }
    // AL CLICAR EN AGREGAR LOGO NOS ACTIVARÁ LA FUNCIÓN MOSTRAR DE ABAJO
  ActivarInputCromoDelante() {
      document.getElementById('inputCromoDelante').click();
  }

  ActivarInputCromoDetras() {
    document.getElementById('inputCromoDetras').click();
}
    // Buscaremos la imagen en nuestro ordenador y después se mostrará en el form con la variable "imagen" y guarda el
    // nombre de la foto en la variable nombreImagen
  ExaminarImagenCromoDelante($event) {
    this.fileCromoDelante = $event.target.files[0];
    this.nombreImagenCromoDelante = this.fileCromoDelante.name;
    const reader = new FileReader();
    reader.readAsDataURL(this.fileCromoDelante);
    reader.onload = () => {
      console.log('ya Cromo');
      this.imagenDelanteCargada = true;
      this.imagenCromoDelante = reader.result.toString();
      this.cambios = true;
      };
  }

  ExaminarImagenCromoDetras($event) {
    this.fileCromoDetras = $event.target.files[0];
    this.nombreImagenCromoDetras = this.fileCromoDetras.name;
    const reader = new FileReader();
    reader.readAsDataURL(this.fileCromoDetras);
    reader.onload = () => {
      console.log('ya Cromo');
      this.imagenDetrasCargada = true;
      this.imagenCromoDetras = reader.result.toString();
      this.cambios = true;
      };
  }

  OpcionNivelSeleccionado() {
    console.log('AAAA' + this.opcionSeleccionadaNivel);
    // Opcion selecionada para nivel
    if (this.opcionSeleccionadaNivel === 'Diamante') {
      this.nivelCromo = 'Diamante';
      this.probabilidadCromo = 'Muy Baja';
     // this.opcionSeleccionadaProbabilidad = 'Muy Baja';

    }
    if (this.opcionSeleccionadaNivel === 'Platino') {
      this.nivelCromo = 'Platino';
      this.probabilidadCromo = 'Baja';
      // this.opcionSeleccionadaProbabilidad = 'Baja';
    }

    if (this.opcionSeleccionadaNivel === 'Oro') {
      this.nivelCromo = 'Oro';
      this.probabilidadCromo = 'Media';
      // this.opcionSeleccionadaProbabilidad = 'Media';
    }

    if (this.opcionSeleccionadaNivel === 'Plata') {
      this.nivelCromo = 'Plata';
      this.probabilidadCromo = 'Alta';
      // this.opcionSeleccionadaProbabilidad = 'Alta';
    }

    if (this.opcionSeleccionadaNivel === 'Bronce') {
      this.nivelCromo = 'Bronce';
      this.probabilidadCromo = 'Muy Alta';
      // this.opcionSeleccionadaProbabilidad = 'Muy Alta';
    }
    this.cambios = true;
  }
  Cerrar(): void {

    if (this.cambios) {
      const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
        height: '150px',
        data: {
          mensaje: 'Dale a Aceptar si NO quieres que se hagan los cambios'
        }
      });

      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.dialogRef.close(this.cromo);
        }
      });
    } else {
      this.dialogRef.close(this.cromo);
    }
  }

}

import { Component, OnInit } from '@angular/core';
import {Sort} from '@angular/material/sort';

import { Alumno, Equipo, Juego, AlumnoJuegoDeColeccion, EquipoJuegoDeColeccion,
  Album, AlbumEquipo, Coleccion, Cromo } from '../../../../clases/index';

import { SesionService, PeticionesAPIService, CalculosService } from '../../../../servicios/index';
import { Location } from '@angular/common';
import { DialogoConfirmacionComponent } from '../../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { MatDialog } from '@angular/material';
import Swal from 'sweetalert2';

import * as URL from '../../../../URLs/urls';


@Component({
  selector: 'app-alumno-seleccionado-juego-de-coleccion',
  templateUrl: './alumno-seleccionado-juego-de-coleccion.component.html',
  styleUrls: ['./alumno-seleccionado-juego-de-coleccion.component.scss']
})
export class AlumnoSeleccionadoJuegoDeColeccionComponent implements OnInit {

  inscripcionAlumno: AlumnoJuegoDeColeccion;

  alumno: Alumno;

  juegoSeleccionado: Juego;

  listaCromos: Cromo[];
  listaCromosSinRepetidos: any[];
  cromo: Cromo;

  imagenCromoDelante: string[] = [];
  imagenCromoDetras: string[] = [];

  // imagen
  imagenPerfil: string;
  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Confirma que quieres eliminar el cromo: ';
  coleccion: Coleccion;
  tieneCromos: boolean;

  constructor(
               private sesion: SesionService,
               private peticionesAPI: PeticionesAPIService,
               private calculos: CalculosService,
               private location: Location,
               public dialog: MatDialog

  ) {}

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.coleccion = this.sesion.DameColeccion();

    this.inscripcionAlumno = this.sesion.DameInscripcionAlumno();
    this.alumno = this.sesion.DameAlumno();
    this.CromosDelAlumno();
    this.DameImagenPerfil();


  }

  // Busca el logo que tiene el nombre del alumno.ImagenPerfil y lo carga en imagenPerfil
  DameImagenPerfil() {

    if (this.alumno.ImagenPerfil !== undefined ) {
      this.imagenPerfil = URL.ImagenesAlumno + this.alumno.ImagenPerfil;
    }
    //   this.http.get('http://localhost:3000/api/imagenes/imagenAlumno/download/' + this.alumno.ImagenPerfil,
    //   { responseType: ResponseContentType.Blob })
    //   .subscribe(response => {

    //     const blob = new Blob([response.blob()], { type: 'image/jpg'});

    //     const reader = new FileReader();
    //     reader.addEventListener('load', () => {
    //       this.imagenPerfil = reader.result.toString();
    //     }, false);

    //     if (blob) {
    //       reader.readAsDataURL(blob);
    //     }
    //   });
    // }

  }


  CromosDelAlumno() {
    this.peticionesAPI.DameCromosAlumno(this.inscripcionAlumno.id)
    .subscribe(cromos => {
      if (cromos.length === 0) {
        this.tieneCromos = false;
      } else {
        this.tieneCromos = true;
      }
      this.listaCromos = cromos;
      console.log ('temgo los cromos del alumno');
      console.log (this.listaCromos);

      // esta es la lista que se mostrará al usuario, sin cromos repetidos y con una
      // indicación de cuantas veces se repite cada cromo
      this.listaCromosSinRepetidos = this.calculos.GeneraListaSinRepetidos(this.listaCromos);
      this.listaCromosSinRepetidos.sort((a, b) => a.cromo.Nombre.localeCompare(b.cromo.Nombre));
      console.log ('temgo los cromos sin repeticiones');
      console.log (this.listaCromosSinRepetidos);
      this.sesion.TomaCromos(this.listaCromos);
      this.listaCromos.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
      this.DameImagenesCromos();

    });
  }

  DameImagenesCromos() {
    console.log ('Voy a por las imagenes de los cromos');

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.listaCromosSinRepetidos.length; i++) {

      const elem  = this.listaCromosSinRepetidos[i];
      console.log ('Voy a pedir imagen cromo');
      if (elem.cromo.ImagenDelante !== undefined ) {
        // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
        this.imagenCromoDelante[i] = URL.ImagenesCromo + elem.cromo.ImagenDelante;
        // this.peticionesAPI.DameImagenCromo (elem.cromo.ImagenDelante)
        // .subscribe(response => {
        //   const blob = new Blob([response.blob()], { type: 'image/jpg'});

        //   const reader = new FileReader();
        //   reader.addEventListener('load', () => {
        //     console.log ('tengo imagen');
        //     this.imagenCromoDelante[i] = reader.result.toString();
        //     console.log (this.imagenCromoDelante);
        //   }, false);

        //   if (blob) {
        //     reader.readAsDataURL(blob);
        //   }
        // });
      }

      if (elem.cromo.ImagenDetras !== undefined ) {
        this.imagenCromoDetras[i] = URL.ImagenesCromo + elem.cromo.ImagenDetras;

        // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
        // this.peticionesAPI.DameImagenCromo (elem.cromo.ImagenDetras)
        // .subscribe(response => {
        //   const blob = new Blob([response.blob()], { type: 'image/jpg'});

        //   const reader = new FileReader();
        //   reader.addEventListener('load', () => {
        //     this.imagenCromoDetras[i] = reader.result.toString();
        //   }, false);

        //   if (blob) {
        //     reader.readAsDataURL(blob);
        //   }
        // });
      }
    }
  }


  // GET_ImagenesCromos() {

  //   // Me traigo la lista de imagenes de los cromos sin repetición
  //   // tslint:disable-next-line:prefer-for-of
  //   for (let i = 0; i < this.listaCromosSinRepetidos.length; i++) {

  //     this.cromo = this.listaCromosSinRepetidos[i].cromo;

  //     if (this.cromo.Imagen !== undefined ) {

  //       // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
  //       this.http.get('http://localhost:3000/api/imagenes/ImagenCromo/download/' + this.cromo.Imagen,
  //       { responseType: ResponseContentType.Blob })
  //       .subscribe(response => {
  //         const blob = new Blob([response.blob()], { type: 'image/jpg'});

  //         const reader = new FileReader();
  //         reader.addEventListener('load', () => {
  //           this.imagenCromoArray[i] = reader.result.toString();
  //         }, false);

  //         if (blob) {
  //           reader.readAsDataURL(blob);
  //         }

  //       });
  //     }
  //   }
  // }

  AbrirDialogoConfirmacionBorrarCromo(cromo: Cromo): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: cromo.Nombre,
      }
    });

    // Antes de cerrar recogeremos el resultado del diálogo: Borrar (true) o cancelar (false). Si confirmamos, borraremos
    // el punto (función BorrarPunto) y mostraremos un Swal con el mensaje de que se ha eliminado correctamente.
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.BorrarCromo(cromo);
        Swal.fire('Eliminado', cromo.Nombre + ' eliminado correctamente', 'success');
      }
    });
  }

   // Utilizamos esta función para eliminar un cromo de la base de datos y actualiza la lista de cromos
   BorrarCromo(cromo: Cromo) {
    // primero obtengo todas las asignaciones del cromo al alumno
    this.peticionesAPI.DameAsignacionesCromoConcretoAlumno (this.inscripcionAlumno.id, cromo.id)
    .subscribe((res) => {
      // Y ahora elimino la primera de ellas (una cualquiera)
      this.peticionesAPI.BorrarAsignacionCromoAlumno (res[0].id)
      .subscribe ( () => this.CromosDelAlumno());
    });
  }


  goBack() {
    console.log ('***************');
    console.log (this.imagenCromoDelante);
    this.location.back();
  }

}

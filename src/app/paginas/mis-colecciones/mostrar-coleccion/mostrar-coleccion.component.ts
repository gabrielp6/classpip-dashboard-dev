import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';
import { AgregarCromoDialogComponent } from '../agregar-cromo-dialog/agregar-cromo-dialog.component';
import { EditarCromoDialogComponent } from '../editar-cromo-dialog/editar-cromo-dialog.component' ;
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';

// Clases
import { Cromo, Coleccion } from '../../../clases/index';


// Servicios
import { SesionService, PeticionesAPIService } from '../../../servicios/index';

import * as URL from '../../../URLs/urls';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-mostrar-coleccion',
  templateUrl: './mostrar-coleccion.component.html',
  styleUrls: ['./mostrar-coleccion.component.scss']
})
export class MostrarColeccionComponent implements OnInit {

  coleccion: Coleccion;
  cromosColeccion: Cromo[];

  cromo: Cromo;
  imagenCromo: string;
  imagenesCromosDelante: string[] = [];
  imagenesCromosDetras: string[] = [];

  nombreColeccion: string;
  // imagen coleccion
  imagenColeccion: string;
  nombreImagenColeccion: string;
  file: File;

  // tslint:disable-next-line:ban-types
  imagenCambiada: Boolean = false;

  // PARA DIÁLOGO DE CONFIRMACIÓN
  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Confirma que quieres eliminar el equipo llamado: ';

  // tslint:disable-next-line:ban-types
  cambios: Boolean = false;
  // tslint:disable-next-line:ban-types
  voltear: Boolean = false;
  // tslint:disable-next-line:ban-types
  mostrarTextoGuardar: Boolean = false;

  interval;


  constructor(
              public dialog: MatDialog,
              private location: Location,
              private sesion: SesionService,
              private peticionesAPI: PeticionesAPIService
  ) { }

  ngOnInit() {
    this.coleccion = this.sesion.DameColeccion();
    this.nombreColeccion = this.coleccion.Nombre;

    if (this.coleccion.ImagenColeccion !== undefined) {
      this.imagenColeccion = URL.ImagenesColeccion + this.coleccion.ImagenColeccion ;
    } else {
      this.imagenColeccion = undefined;
    }

    this.peticionesAPI.DameCromosColeccion (this.coleccion.id)
    .subscribe ( cromos => {
      this.cromosColeccion = cromos;
      // Ahora preparo las imagenes de los cromos
         // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.cromosColeccion.length; i++) {

        this.cromo = this.cromosColeccion[i];
        this.imagenesCromosDelante[i] = URL.ImagenesCromo + this.cromo.ImagenDelante;
        this.imagenesCromosDetras[i] = URL.ImagenesCromo + this.cromo.ImagenDetras;

      }

    });

  }

  // Busca la imagen que tiene el nombre del cromo.Imagen y lo carga en imagenCromo
  TraeImagenesCromos() {

      // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.cromosColeccion.length; i++) {

      this.cromo = this.cromosColeccion[i];
      this.imagenesCromosDelante[i] = URL.ImagenesCromo + this.cromo.ImagenDelante;
      this.imagenesCromosDetras[i] = URL.ImagenesCromo + this.cromo.ImagenDetras;

    }
  }

  // Le pasamos la coleccion y buscamos la imagen que tiene y las imagenes de sus cromos
 TraeImagenColeccion(coleccion: Coleccion) {

  console.log('entro a buscar cromos y foto');
  console.log(coleccion.ImagenColeccion);
  // Si la coleccion tiene una foto (recordemos que la foto no es obligatoria)
  if (coleccion.ImagenColeccion !== undefined) {

    this.imagenColeccion = URL.ImagenesColeccion + coleccion.ImagenColeccion ;

    // Sino la imagenColeccion será undefined para que no nos pinte la foto de otro equipo préviamente seleccionado
  } else {
    this.imagenColeccion = undefined;
  }


  // Una vez tenemos el logo del equipo seleccionado, buscamos sus alumnos
  console.log('voy a mostrar los cromos de la coleccion ' + coleccion.id);

  // Ordena los cromos por nombre. Asi si tengo algun cromo repetido, salen juntos
  this.cromosColeccion.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
  this.TraeImagenesCromos();

  }
  goBack() {
      this.location.back();
  }
  Voltear() {
    this.voltear = !this.voltear;
  }

}

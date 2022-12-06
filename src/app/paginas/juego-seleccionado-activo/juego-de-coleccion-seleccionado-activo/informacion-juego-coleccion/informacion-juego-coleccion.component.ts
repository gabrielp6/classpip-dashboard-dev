import { Component, OnInit } from '@angular/core';

// Clases
import { Cromo, Coleccion } from '../../../../clases/index';

// Servicios
import { SesionService, PeticionesAPIService } from '../../../../servicios/index';
import { Location } from '@angular/common';
import * as URL from '../../../../URLs/urls';


@Component({
  selector: 'app-informacion-juego-coleccion',
  templateUrl: './informacion-juego-coleccion.component.html',
  styleUrls: ['./informacion-juego-coleccion.component.scss']
})
export class InformacionJuegoColeccionComponent implements OnInit {

  coleccion: Coleccion;
  cromosColeccion: Cromo[];

  cromo: Cromo;
  imagenCromoDelante: string[] = [];
  imagenCromoDetras: string[] = [];

  nombreColeccion: string;
  // imagen coleccion
  imagenColeccion: string;
  nombreImagenColeccion: string;
  file: File;

  // tslint:disable-next-line:ban-types
  imagenCambiada: Boolean = false;

  // PARA DIÁLOGO DE CONFIRMACIÓN
  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres eliminar el equipo llamado: ';

  constructor(
                private sesion: SesionService,
                private peticionesAPI: PeticionesAPIService,
                public location: Location) { }

  ngOnInit() {
    this.coleccion = this.sesion.DameColeccion();

    this.nombreColeccion = this.coleccion.Nombre;

    this.CromosEImagenDeLaColeccion(this.coleccion);

  }



  // Le pasamos la coleccion y buscamos la imagen que tiene y sus cromos
 CromosEImagenDeLaColeccion(coleccion: Coleccion) {

  console.log('entro a buscar cromos y foto');
  console.log(coleccion.ImagenColeccion);
  // Si la coleccion tiene una foto (recordemos que la foto no es obligatoria)
  if (coleccion.ImagenColeccion !== undefined) {
    this.imagenColeccion = URL.ImagenesColeccion + this.coleccion.ImagenColeccion;

    // Sino la imagenColeccion será undefined para que no nos pinte la foto de otro equipo préviamente seleccionado
  } else {
    this.imagenColeccion = undefined;
  }


  // Una vez tenemos el logo del equipo seleccionado, buscamos sus alumnos
  console.log('voy a mostrar los cromos de la coleccion ' + coleccion.id);

  // Busca los cromos dela coleccion en la base de datos
  this.peticionesAPI.DameCromosColeccion(coleccion.id)
  .subscribe(res => {
    if (res[0] !== undefined) {
      this.cromosColeccion = res;
      this.GET_ImagenCromo();
      console.log(res);
    } else {
      console.log('No hay cromos en esta coleccion');
      this.cromosColeccion = undefined;
    }
  });
}

 // Busca la imagen que tiene el nombre del cromo.Imagen y lo carga en imagenCromo
 GET_ImagenCromo() {

  // tslint:disable-next-line:prefer-for-of
for (let i = 0; i < this.cromosColeccion.length; i++) {

  this.cromo = this.cromosColeccion[i];

  if (this.cromo.ImagenDelante !== undefined ) {
    this.imagenCromoDelante[i] = URL.ImagenesCromo + this.cromo.ImagenDelante;
  }

  if (this.cromo.ImagenDetras !== undefined ) {
    this.imagenCromoDetras[i] = URL.ImagenesCromo + this.cromo.ImagenDetras;
  }
}
}
goBack() {
  this.location.back();
}


}

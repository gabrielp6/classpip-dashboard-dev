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
  selector: 'app-guardar-coleccion',
  templateUrl: './guardar-coleccion.component.html',
  styleUrls: ['./guardar-coleccion.component.scss']
})
export class GuardarColeccionComponent implements OnInit {

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
    console.log ('ya tengo coleccion');
    console.log (this.coleccion);
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
      console.log ('imagenes');
      console.log (this.imagenesCromosDelante);
      this.GuardarColeccion();
    });


  }







  // Si queremos borrar un cromo, antes nos saldrá un aviso para confirmar la acción como medida de seguridad. Esto se
  // hará mediante un diálogo al cual pasaremos el mensaje y el nombre del equipo
  AbrirDialogoConfirmacionBorrarCromo(cromo: Cromo): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: cromo.Nombre,
      }
    });

    // Antes de cerrar recogeremos el resultado del diálogo: Borrar (true) o cancelar (false). Si confirmamos, borraremos
    // el punto (función BorrarPunto) y mostraremos un swal con el mensaje de que se ha eliminado correctamente.
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.BorrarCromo(cromo);
        Swal.fire('Eliminado', cromo.Nombre + ' eliminado correctamente', 'success');

      }
    });
  }

  // Utilizamos esta función para eliminar un cromo de la base de datos y actualiza la lista de cromos
  BorrarCromo(cromo: Cromo) {
    const posicion = this.cromosColeccion.indexOf (cromo);
    console.log ('voy a borrar el cromo ' + cromo.id +  ' de la posición ' + posicion);

    this.peticionesAPI.BorrarCromo (cromo.id).subscribe( () => {
        const nueva = this.cromosColeccion.slice(0, posicion).concat(this.cromosColeccion.slice(posicion + 1, this.cromosColeccion.length))
        this.cromosColeccion = nueva;
        console.log ('ya esta borrado');
        console.log (this.cromosColeccion);
      }
    );
    console.log (this.cromosColeccion);
    this.peticionesAPI.BorrarImagenCromo(cromo.ImagenDelante).subscribe( () => {
        // tslint:disable-next-line:max-line-length
        const nueva = this.imagenesCromosDelante.slice(0, posicion).concat(this.imagenesCromosDelante.slice(posicion + 1, this.imagenesCromosDelante.length));
        this.imagenesCromosDelante = nueva;
      }
    );
    if (cromo.ImagenDetras !== undefined) {
      this.peticionesAPI.BorrarImagenCromo(cromo.ImagenDelante).subscribe( () => {
        // tslint:disable-next-line:max-line-length
        const nueva = this.imagenesCromosDetras.slice(0, posicion).concat(this.imagenesCromosDetras.slice(posicion + 1, this.imagenesCromosDetras.length));
        this.imagenesCromosDelante = nueva;
      }
      );
    }



  }


  goBack() {
      this.location.back();
  }

  Voltear() {
    this.voltear = !this.voltear;
  }

  GuardarColeccion() {
    this.mostrarTextoGuardar = true;
    // delete this.familiaElegida.id;
    // delete this.familiaElegida.profesorId;

    // creamos un objeto con los datos de la colección tal y como se necesitan
    // para generar el JSON
    const coleccion = {
      Nombre:  this.coleccion.Nombre,
      ImagenColeccion: this.coleccion.ImagenColeccion,
      DosCaras: this.coleccion.DosCaras,
      cromos: []
    };
    this.cromosColeccion.forEach (cromo => {
      const c = {
        nombreCromo: cromo.Nombre,
        nombreImagenCromoDelante: cromo.ImagenDelante,
        nombreImagenCromoDetras: cromo.ImagenDetras,
        nivelCromo: cromo.Nivel,
        probabilidadCromo: cromo.Probabilidad,
      };
      coleccion.cromos.push(c);
    });

    console.log ('asi queda la colección');
    console.log (coleccion);




    const theJSON = JSON.stringify(coleccion);
    console.log ('asi queda el JSON');
    console.log (theJSON);

    const uri = "data:application/json;charset=UTF-8," + encodeURIComponent(theJSON);

    // Este es un nuevo caso en el que tenemos que obtener de la vista html un elemento
    // que está protegido por un *ngIf. El sistema primero intenta obtener el elemento y puede
    // encontrar que el elemento aún no existe. Para invertir el orden ponemos un temporizador,
    // con lo que primero creará el elemento y luego lo obtendrá. Un tiempo 0 es suficiente.

    this.interval = setInterval(() => {
      const a = document.getElementById('generarJSON');
      a.setAttribute ('href', uri);
      a.setAttribute ('download', this.coleccion.Nombre);
      a.innerHTML = "Botón derecho y selecciona 'deja el enlace como...'";
      clearInterval(this.interval);
    }, 0);





  }
}

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';

import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';


// Servicios
import { SesionService, PeticionesAPIService } from '../../../servicios/index';
import { Escenario } from 'src/app/clases/Escenario';
import { PuntoGeolocalizable } from 'src/app/clases/PuntoGeolocalizable';
import { EditarPuntoGeolocalizableDialogComponent } from '../editar-puntogeolocalizable-dialog/editar-puntogeolocalizable-dialog.component';
import { AgregarPuntoGeolocalizableDialogComponent } from '../agregar-puntogeolocalizable-dialog/agregar-puntogeolocalizable-dialog.component';


@Component({
  selector: 'app-editar-escenario',
  templateUrl: './editar-escenario.component.html',
  styleUrls: ['./editar-escenario.component.scss']
})
export class EditarEscenarioComponent implements OnInit {

  escenario: Escenario;
  puntosgeolocalizablesEscenario: PuntoGeolocalizable[];

  puntogeolocalizable: PuntoGeolocalizable;

  mapaEscenario: string;
  // imagen coleccion
  descripcionEscenario: string;

  file: File;


  mensaje: string = 'Confirma que quieres eliminar el escenario llamado: ';
  displayedColumns: string[] = ['nombrePuntoGeolocalizable', 'edit',  ' '];
  cambios: Boolean = false;

  constructor(
              public dialog: MatDialog,
              private location: Location,
              private sesion: SesionService,
              private peticionesAPI: PeticionesAPIService
  ) { }

  ngOnInit() {
    this.escenario = this.sesion.DameEscenario();
    this.DamePuntosGeolocalizablesDelEscenario();
    this.mapaEscenario = this.escenario.Mapa;
    this.descripcionEscenario = this.escenario.Descripcion;

    // Me traigo la imagen de la colección y las imagenes de cada cromo
    // Cargo el imagen de la coleccion
    // this.GET_Imagen();
  }


  Cambio() {
    this.cambios = true;
  }

 DamePuntosGeolocalizablesDelEscenario() {

  console.log('voy a mostrar los puntosgeolocalizables del escenario ' + this.escenario.id);

  this.peticionesAPI.DamePuntosGeolocalizablesEscenario(this.escenario.id)
  .subscribe(res => {
    if (res[0] !== undefined) {
      this.puntosgeolocalizablesEscenario = res;
      console.log(res);
    } else {
      console.log('No hay puntosgeolocalizables en el escenario');
      this.puntosgeolocalizablesEscenario = undefined;
    }
  });
  }


  // Se hace un PUT de la coleccion seleccionada para editar
  EditarEscenario() {
    console.log('Entro a editar');
    // Borramos la imagen anterior
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.ModificaEscenario(new Escenario(this.mapaEscenario, this.descripcionEscenario), this.escenario.profesorId, this.escenario.id)
    .subscribe((res) => {
      if (res != null) {
        console.log('Voy a editar el escenario con id ' + this.escenario.id);
        this.escenario = res;
      } else {
        console.log('fallo editando');
      }
    });
    this.cambios = false;

  }


  // AL CLICAR EN AGREGAR LOGO NOS ACTIVARÁ LA FUNCIÓN MOSTRAR DE ABAJO
  ActivarInput() {
    console.log('Activar input');
    document.getElementById('input').click();
  }


  AbrirDialogoAgregarPuntoGeolocalizableEscenario(): void {
    const dialogRef = this.dialog.open(AgregarPuntoGeolocalizableDialogComponent, {
      width: '900px',
      maxHeight: '600px',
      data: {
        idescenario: this.escenario.id,
      }
    });

    dialogRef.afterClosed().subscribe(puntosgeolocalizablesAgregados => {
      console.log ('volvemos de agregar cromos ' + puntosgeolocalizablesAgregados.length);
      for (let i = 0 ; i < puntosgeolocalizablesAgregados.length; i++) {
        this.puntosgeolocalizablesEscenario.push (puntosgeolocalizablesAgregados[i]);
      }

     });
  }

  AbrirDialogoEditarPuntoGeolocalizable(puntogeolocalizable: PuntoGeolocalizable): void {

    const dialogRef = this.dialog.open ( EditarPuntoGeolocalizableDialogComponent , {
      width: '900px',
      maxHeight: '600px',
      data: {
        pg : puntogeolocalizable,
        idescenario: this.escenario.id,
      }
    });

    dialogRef.afterClosed().subscribe( puntogeolocalizable => {
      this.puntosgeolocalizablesEscenario = this.puntosgeolocalizablesEscenario.filter(c => c.id !== puntogeolocalizable.id);
      this.puntosgeolocalizablesEscenario.push (puntogeolocalizable);

    });
  }

  // Guardo cromo en sesión, porque lo necesitará el componente de editar cromo
  GuardarPuntoGeolocalizable(puntogeolocalizable: PuntoGeolocalizable) {
    console.log('voy a enviar');
    this.sesion.TomaPuntoGeolocalizable(puntogeolocalizable);

  }

  AbrirDialogoConfirmacionBorrarPuntoGeolocalizable(puntogeolocalizable: PuntoGeolocalizable): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: puntogeolocalizable.Nombre,
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.BorrarPuntoGeolocalizable(puntogeolocalizable);
        Swal.fire('Eliminado', puntogeolocalizable.Nombre + ' eliminado correctamente', 'success');

      }
    });
  }

  // Utilizamos esta función para eliminar un cromo de la base de datos y actualiza la lista de cromos
  BorrarPuntoGeolocalizable(puntogeolocalizable: PuntoGeolocalizable) {
    this.peticionesAPI.BorrarPuntoGeolocalizable(puntogeolocalizable.id, this.escenario.id)
    .subscribe(() => {
      // Eliminamos el cromo de la colección
      console.log ('escenario:' + this.escenario);
      const i = this.puntosgeolocalizablesEscenario.indexOf(puntogeolocalizable);
      console.log ('posicion ' + i);
      this.puntosgeolocalizablesEscenario = this.puntosgeolocalizablesEscenario.filter(c => c.id !== puntogeolocalizable.id);

    });
  }



  goBack() {
    if (this.cambios) {
      const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
        height: '150px',
        data: {
          mensaje: 'Dale a Aceptar si no quieres que se hagan los cambios en el nombre o en la descripcion del escenario'
        }
      });

      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.location.back();
        }
      });
    } else {
      this.location.back();
    }
  }
}

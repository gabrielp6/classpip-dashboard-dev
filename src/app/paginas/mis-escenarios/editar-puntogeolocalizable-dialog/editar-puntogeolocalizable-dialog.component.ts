import { MatDialog } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';


// Servicios
import { SesionService, PeticionesAPIService } from '../../../servicios/index';

import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { PuntoGeolocalizable } from 'src/app/clases/PuntoGeolocalizable';
import { Escenario } from 'src/app/clases/Escenario';


export interface OpcionSeleccionada {
  nombre: string;
  id: string;
}

@Component({
  selector: 'app-editar-puntogeolocalizable-dialog',
  templateUrl: './editar-puntogeolocalizable-dialog.component.html',
  styleUrls: ['./editar-puntogeolocalizable-dialog.component.scss']
})
export class EditarPuntoGeolocalizableDialogComponent implements OnInit {

  puntogeolocalizable: PuntoGeolocalizable;
  escenario: Escenario;
  puntosgeolocalizablesEscenario: PuntoGeolocalizable[];
  puntosgeolocalizablesEditados: PuntoGeolocalizable [] = [];
  puntosgeolocalizablesAMostrar: PuntoGeolocalizable[];

  nombrePuntoGeolocalizable: string;
  latitudPuntoGeolocalizable: string;
  longitudPuntoGeolocalizable: string;
  pistafacilPuntoGeolocalizable: string;
  pistadificilPuntoGeolocalizable: string;



  // tslint:disable-next-line:ban-types
  cambios: Boolean = false;


  constructor(
              public dialog: MatDialog,
              private sesion: SesionService,
              private peticionesAPI: PeticionesAPIService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<EditarPuntoGeolocalizableDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.puntogeolocalizable = this.data.pg;
    console.log(this.puntogeolocalizable);
    this.nombrePuntoGeolocalizable = this.puntogeolocalizable.Nombre;
    this.latitudPuntoGeolocalizable = this.puntogeolocalizable.Latitud;
    this.longitudPuntoGeolocalizable = this.puntogeolocalizable.Longitud;
    this.pistafacilPuntoGeolocalizable = this.puntogeolocalizable.PistaFacil;
    this.pistadificilPuntoGeolocalizable = this.puntogeolocalizable.PistaDificil;
    this.puntosgeolocalizablesEscenario = this.sesion.DamePuntosGeolocalizables();

    console.log(this.puntogeolocalizable);
  }

  EditarPuntoGeolocalizable() {

    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.ModificaPuntoGeolocalizableEscenario(new PuntoGeolocalizable(this.nombrePuntoGeolocalizable, this.latitudPuntoGeolocalizable, this.longitudPuntoGeolocalizable, this.pistafacilPuntoGeolocalizable, this.pistadificilPuntoGeolocalizable), this.puntogeolocalizable.idescenario, this.puntogeolocalizable.id)
    .subscribe((res) => {
      if (res != null) {
        this.puntogeolocalizable = res;
      }
    });

    this.cambios = false;
 }

  ActivarInputCromo() {
      console.log('Activar input 2');
      document.getElementById('inputCromo').click();
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
          this.dialogRef.close(this.puntogeolocalizable);
        }
      });
    } else {
      this.dialogRef.close(this.puntogeolocalizable);
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';


// Imports para abrir diálogo confirmar eliminar equipo
import { MatDialog, MatTableDataSource } from '@angular/material';
import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';


// Servicios
import { SesionService, PeticionesAPIService } from '../../servicios/index';

// Clases

import { Escenario } from 'src/app/clases/Escenario';
import { PuntoGeolocalizable } from 'src/app/clases/PuntoGeolocalizable';


@Component({
  selector: 'app-mis-escenarios',
  templateUrl: './mis-escenarios.component.html',
  styleUrls: ['./mis-escenarios.component.scss']
})
export class MisEscenariosComponent implements OnInit {

  profesorId: number;


  escenariosProfesor: Escenario[];
  puntosgeolocalizablesEscenario: PuntoGeolocalizable[];
  numeroDePuntosGeolocalizables: number;

  file: File;

  dataSource;

  displayedColumns: string[] = ['mapa', 'descripcion', 'edit', 'delete', 'copy'];

  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres eliminar el escenario llamado: ';

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public sesion: SesionService,
    public peticionesAPI: PeticionesAPIService,
  ) { }

  ngOnInit() {

    this.profesorId = this.sesion.DameProfesor().id;

    console.log(this.profesorId);

    this.TraeEscenariosDelProfesor();
    console.log(this.escenariosProfesor);


  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  TraeEscenariosDelProfesor() {

    this.peticionesAPI.DameEscenariosDelProfesor(this.profesorId)
    .subscribe(escenario => {
      if (escenario[0] !== undefined) {
        console.log('Voy a dar la lista de escenarios');
        this.escenariosProfesor = escenario;
        this.dataSource = new MatTableDataSource(this.escenariosProfesor);
        console.log(this.escenariosProfesor);
      } else {
        this.escenariosProfesor = undefined;
      }

    });
  }

//  GuardaPuntosGeolocalizablesDelEscenario(escenario: Escenario) {

//   console.log('voy a mostrar los puntosgeolocalizables del escenario ' + escenario.id);

//   this.peticionesAPI.DamePuntosGeolocalizablesEscenario(escenario.id)
//   .subscribe(res => {
//     if (res[0] !== undefined) {
//       this.puntosgeolocalizablesEscenario = res;
//       console.log(res);
//       this.numeroDePuntosGeolocalizables = this.puntosgeolocalizablesEscenario.length;
//     } else {
//       console.log('No hay puntosgeolocalizables en el escenario');
//       this.puntosgeolocalizablesEscenario = undefined;
//       this.numeroDePuntosGeolocalizables = 0;
//     }
//     this.sesion.TomaPuntosGeolocalizables (this.puntosgeolocalizablesEscenario);
//   });
//   }

  GuardarEscenario(escenario: Escenario) {
    this.sesion.TomaEscenario(escenario);
  }

  BorrarEscenario(escenario: Escenario) {

    console.log ('Vamos a eliminar la colección');
    this.peticionesAPI.BorraEscenario(escenario.id, escenario.profesorId)
    .subscribe();

    console.log ('La saco de la lista');
    this.escenariosProfesor = this.escenariosProfesor.filter(res => res.id !== escenario.id);
  }

  AbrirDialogoConfirmacionBorrarEscenario(escenario: Escenario): void {
    Swal.fire({
      title: 'Eliminar',
      text: "Estas segura/o de que quieres eliminar el escenario llamado: " +escenario.Mapa,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'

    }).then((result) => {
      if (result.value) {
        this.BorrarEscenario(escenario);
        Swal.fire('Eliminado', escenario.Mapa + ' eliminado correctamente', 'success');

      }
    })

  }


  CrearCopia(escenario: Escenario) {
    console.log ('vamos a crear copia');

    let puntosGeolocalizables: PuntoGeolocalizable[];
    // primero traigo las preguntas del cuestionario que voy a copiar
    this.peticionesAPI.DamePuntosGeolocalizablesEscenario (escenario.id)
    .subscribe ( puntos => {
      puntosGeolocalizables = puntos;
      // Ahora creo el escenario

      this.peticionesAPI.CreaEscenario (new Escenario(escenario.Mapa + '(copia)', escenario.Descripcion), this.profesorId)
      .subscribe (copia => {
        // ahora tengo que crear copias de los puntos geolocalizables
        puntosGeolocalizables.forEach (punto => {
          this.peticionesAPI.PonPuntoGeolocalizableEscenario(
            new PuntoGeolocalizable (punto.Nombre, punto.Latitud, punto.Longitud, punto.PistaFacil, punto.PistaDificil),
            copia.id)
            .subscribe();
        });
        // Añado el escenario creado a la lista que se muestra
        this.escenariosProfesor.push (copia);
        this.dataSource = new MatTableDataSource(this.escenariosProfesor);
      });
    });

  }
}

import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

// Clases
import { Alumno, Equipo, Juego, AlumnoJuegoDeColeccion, EquipoJuegoDeColeccion, Coleccion } from '../../../clases/index';

// Services

import { SesionService, CalculosService, PeticionesAPIService, ComServerService } from '../../../servicios/index';

// Imports para abrir diálogo y swal
import { MatDialog } from '@angular/material';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';
import { reActivarJuego } from './../../ventana-re-activar-juego/reActivarJuego';

@Component({
  selector: 'app-juego-de-coleccion-seleccionado-inactivo',
  templateUrl: './juego-de-coleccion-seleccionado-inactivo.component.html',
  styleUrls: ['./juego-de-coleccion-seleccionado-inactivo.component.scss']
})
export class JuegoDeColeccionSeleccionadoInactivoComponent implements OnInit {

  // Juego De Puntos seleccionado
  juegoSeleccionado: Juego;

  // Recupera la informacion del juego, los alumnos o los equipos, los puntos y los niveles del juego
  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];

  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres desactivar el ';

  // tslint:disable-next-line:no-inferrable-types
  mensajeBorrar: string = 'Estás seguro/a de que quieres borrar el ';

  datasourceAlumno;
  datasourceEquipo;

  displayedColumnsAlumnos: string[] = ['nombreAlumno', 'primerApellido', 'segundoApellido', ' '];

  displayedColumnsEquipos: string[] = ['nombreEquipo', 'miembros', ' '];

  alumnosEquipo: Alumno[];

  inscripcionesAlumnos: AlumnoJuegoDeColeccion[];
  inscripcionesEquipos: EquipoJuegoDeColeccion[];
  coleccion: Coleccion;

  constructor(
              private sesion: SesionService,
              private peticionesAPI: PeticionesAPIService,
              private calculos: CalculosService,
              public dialog: MatDialog,
              private router: Router,
              private location: Location,
              public comServerService: ComServerService) { }

  ngOnInit() {


    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log ('juego de coleccion ');
    console.log (this.juegoSeleccionado);

    this.ColeccionDelJuego();

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.PrepararInformacionJuegoIndividual();
    } else if (this.juegoSeleccionado.Asignacion === 'Individual') {
      this.PrepararInformacionJuegoEquipoAsignacionIndividual();
    } else {
      this.PrepararInformacionJuegoEquipoAsignacionEquipo();
    }


  }

  applyFilter(filterValue: string) {
    this.datasourceAlumno.filter = filterValue.trim().toLowerCase();
  }

  applyFilterEquipo(filterValue: string) {
    this.datasourceEquipo.filter = filterValue.trim().toLowerCase();
  }


  HayQueMostrarAlumnos(): boolean {
    // tslint:disable-next-line:max-line-length
    const res = ((this.juegoSeleccionado.Modo === 'Individual') || (this.juegoSeleccionado.Asignacion === 'Individual')) && (this.alumnosDelJuego !== undefined);
    return res;
  }
  HayQueMostrarEquipos(): boolean {
    const res = (this.juegoSeleccionado.Asignacion === 'Equipo') && this.equiposDelJuego !== undefined;
    return res;
  }


  // Recupera los alumnos que pertenecen al juego y sus inscripciones
  // Prepara el data source
  PrepararInformacionJuegoIndividual() {
    // traemos las inscripciones
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeColeccion(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.inscripcionesAlumnos = inscripciones;
    });

    // traemos los alumnos del juego para mostrar sus datos en la lista
    this.peticionesAPI.DameAlumnosJuegoDeColeccion(this.juegoSeleccionado.id)
    .subscribe(alumnosJuego => {
      this.alumnosDelJuego = alumnosJuego;
      this.datasourceAlumno = new MatTableDataSource(this.alumnosDelJuego);
    });
  }

  PrepararInformacionJuegoEquipoAsignacionIndividual() {
    // Traigo los equipos del juego
    this.peticionesAPI.DameEquiposJuegoDeColeccion(this.juegoSeleccionado.id)
    .subscribe(equiposJuego => {
      this.equiposDelJuego = equiposJuego;
    });
    // Traigo las inscripciones de los equipos
    this.peticionesAPI.DameInscripcionesEquipoJuegoDeColeccion(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.inscripcionesEquipos = inscripciones;
    });

    // necesito los alumnos del grupo, para poder hacer asignacion individual
    this.peticionesAPI.DameAlumnosGrupo(this.juegoSeleccionado.grupoId)
    .subscribe(alumnosJuego => {
      this.alumnosDelJuego = alumnosJuego;
      this.datasourceAlumno = new MatTableDataSource(this.alumnosDelJuego);
    });

  }


  PrepararInformacionJuegoEquipoAsignacionEquipo() {
    // Traigo los equipos del juego
    this.peticionesAPI.DameEquiposJuegoDeColeccion(this.juegoSeleccionado.id)
    .subscribe(equiposJuego => {
      this.equiposDelJuego = equiposJuego;
      this.datasourceEquipo = new MatTableDataSource(this.equiposDelJuego);
    });
    // Traigo las inscripciones de los equipos
    this.peticionesAPI.DameInscripcionesEquipoJuegoDeColeccion(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.inscripcionesEquipos = inscripciones;
    });
  }



  // Recupera los alumnos que pertenecen al juego
  AlumnosDelJuego() {
    this.peticionesAPI. DameAlumnosJuegoDeColeccion(this.juegoSeleccionado.id)
    .subscribe(alumnosJuego => {
      console.log(alumnosJuego);
      this.alumnosDelJuego = alumnosJuego;
      this.RecuperarInscripcionesAlumnoJuego();
      this.ColeccionDelJuego();
      this.sesion.TomaAlumnosDelJuego (this.alumnosDelJuego);
      this.datasourceAlumno = new MatTableDataSource(this.alumnosDelJuego);
    });
  }

  // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
  RecuperarInscripcionesAlumnoJuego() {
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeColeccion(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.inscripcionesAlumnos = inscripciones;
      console.log(this.inscripcionesAlumnos);
    });
  }

  // Recupera los equipos que pertenecen al juego
  EquiposDelJuego() {
    this.peticionesAPI.DameEquiposJuegoDeColeccion(this.juegoSeleccionado.id)
    .subscribe(equiposJuego => {
      this.equiposDelJuego = equiposJuego;
      console.log(equiposJuego);
      this.RecuperarInscripcionesEquiposJuego();
      this.ColeccionDelJuego();
      this.sesion.TomaEquiposDelJuego (this.equiposDelJuego);
    });
  }


    // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
  RecuperarInscripcionesEquiposJuego() {

    this.peticionesAPI.DameInscripcionesEquipoJuegoDeColeccion(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.inscripcionesEquipos = inscripciones;
      console.log(this.inscripcionesEquipos);
      this.datasourceEquipo = new MatTableDataSource(this.equiposDelJuego);
    });
  }


  AlumnosDelEquipo(equipo: Equipo) {
    console.log(equipo);

    this.peticionesAPI.DameAlumnosEquipo(equipo.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.alumnosEquipo = res;
        console.log(res);
      } else {
        // Mensaje al usuario
        console.log('No hay alumnos en este equipo');
        this.alumnosEquipo = undefined;
      }
    });
  }

  AccederAlumno(alumno: Alumno) {
    if ((this.juegoSeleccionado.Modo === 'Equipos') && (this.juegoSeleccionado.Asignacion === 'Individual')) {
      // Hay que mostrar el album del equipo al que pertenece el alumno
      // por tanto primero busco el equipo del alumno
      this.peticionesAPI.DameEquiposDelAlumno (alumno.id)
      .subscribe (equiposDelAlumno => {
        // Busco el equipo que esta tanto en la lista de equipos del juego como en la lista de equipso del
        // alumno
        const equipo = equiposDelAlumno.filter(e => this.equiposDelJuego.some(a => a.id === e.id))[0];
        this.AccederEquipo (equipo);
      });
    } else {
      this.sesion.TomaColeccion(this.coleccion);
      this.sesion.TomaJuego(this.juegoSeleccionado);
      this.sesion.TomaAlumno (alumno);
      this.sesion.TomaInscripcionAlumno (this.inscripcionesAlumnos.filter(res => res.alumnoId === alumno.id)[0]);
      // tslint:disable-next-line:max-line-length
      this.router.navigate (['/grupo/' + this.juegoSeleccionado.grupoId + '/juegos/juegoSeleccionadoActivo/informacionAlumnoJuegoColeccion']);

    }
  }


  AccederEquipo(equipo: Equipo) {

    this.sesion.TomaEquipo(equipo);
    this.sesion.TomaInscripcionEquipo(this.inscripcionesEquipos.filter(res => res.equipoId === equipo.id)[0]);
    this.sesion.TomaColeccion(this.coleccion);
    this.sesion.TomaJuego(this.juegoSeleccionado);
    this.router.navigate (['/grupo/' + this.juegoSeleccionado.grupoId + '/juegos/juegoSeleccionadoActivo/informacionEquipoJuegoColeccion']);

  }

  ColeccionDelJuego() {
    this.peticionesAPI.DameColeccion(this.juegoSeleccionado.coleccionId)
    .subscribe(coleccion => {
      console.log('voy a enviar la coleccion');
      this.coleccion = coleccion;
    });
  }

  // ReactivarJuego() {
  //   console.log ('voy a reactivar');
  //   console.log(this.juegoSeleccionado);
  //   this.peticionesAPI.CambiaEstadoJuegoDeColeccion(new Juego (this.juegoSeleccionado.Tipo, this.juegoSeleccionado.Modo,
  //     this.juegoSeleccionado.Asignacion,
  //     undefined, true, this.juegoSeleccionado.NumeroTotalJornadas, this.juegoSeleccionado.TipoJuegoCompeticion,
  //     this.juegoSeleccionado.NumeroParticipantesPuntuan, this.juegoSeleccionado.Puntos, this.juegoSeleccionado.NombreJuego),
  //     this.juegoSeleccionado.id, this.juegoSeleccionado.grupoId).subscribe(res => {
  //       if (res !== undefined) {
  //         console.log(res);
  //         console.log('juego reactivado');
  //         this.location.back();
  //       }
  //     });
  // }

  // AbrirDialogoConfirmacionReactivar(): void {

  //   const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
  //     height: '150px',
  //     data: {
  //       mensaje: this.mensaje,
  //       nombre: this.juegoSeleccionado.Tipo,
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe((confirmed: boolean) => {
  //     if (confirmed) {
  //       this.ReactivarJuego();
  //       Swal.fire('Reactivado', this.juegoSeleccionado.Tipo + ' reactivado correctamente', 'success');
  //     }
  //   });
  // }

  // EliminarJuego() {
  //   this.peticionesAPI.BorraJuegoDeColeccion(this.juegoSeleccionado.id)
  //   .subscribe(res => {
  //     console.log('Juego eliminado');
  //     this.location.back();
  //   });
  // }

  // AbrirDialogoConfirmacionEliminar(): void {

  //   const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
  //     height: '150px',
  //     data: {
  //       mensaje: this.mensajeBorrar,
  //       nombre: this.juegoSeleccionado.Tipo,
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe((confirmed: boolean) => {
  //     if (confirmed) {
  //       this.EliminarJuego();
  //       Swal.fire('Eliminado', this.juegoSeleccionado.Tipo + ' eliminado correctamente', 'success');
  //     }
  //   });
  // }

   
  Eliminar() {
    Swal.fire({
      title: '¿Seguro que quieres eliminar el juego?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then( async (result) => {
      if (result.value) {
        await this.calculos.EliminarJuegoDeColeccion(this.juegoSeleccionado);
        Swal.fire('El juego se ha eliminado correctamente');
        this.location.back();
      }
    });
  }
  Reactivar() {
    reActivarJuego().then((result) => {
      if (result.value) {

        this.juegoSeleccionado.JuegoActivo = true;
        this.peticionesAPI.CambiaEstadoJuegoDeColeccion (this.juegoSeleccionado)
        .subscribe(res => {
            if (res !== undefined) {
              this.comServerService.enviarInfoGrupoJuegoStatus(this.juegoSeleccionado.grupoId);
              Swal.fire('El juego se ha activado correctamente');
              this.location.back();
            }
        });
      }
    });
  }




  MostrarInformacion() {
    this.sesion.TomaColeccion (this.coleccion);
    this.router.navigate (['/grupo/' + this.juegoSeleccionado.grupoId + '/juegos/juegoSeleccionadoActivo/informacionJuegoColeccion']);
  }

  goBack() {
    this.location.back();
  }


}

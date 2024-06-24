import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

// Clases
import { Alumno, Equipo, Juego, AlumnoJuegoDeColeccion, EquipoJuegoDeColeccion, Coleccion } from '../../../clases/index';

// Services
import { SesionService, PeticionesAPIService, CalculosService, ComServerService } from '../../../servicios/index';

// Imports para abrir diálogo y Swal
import { MatDialog } from '@angular/material';
import Swal from 'sweetalert2';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';

@Component({
  selector: 'app-juego-de-coleccion-seleccionado-activo',
  templateUrl: './juego-de-coleccion-seleccionado-activo.component.html',
  styleUrls: ['./juego-de-coleccion-seleccionado-activo.component.scss']
})
export class JuegoDeColeccionSeleccionadoActivoComponent implements OnInit {

  // Juego De Puntos seleccionado
  juegoSeleccionado: Juego;

  // Recupera la informacion del juego, los alumnos o los equipos, los puntos y los niveles del juego
  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];

  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres desactivar el ';

  datasourceAlumno;
  datasourceEquipo;

  displayedColumnsAlumnos: string[] = ['nombreAlumno', 'primerApellido', 'segundoApellido', ' '];

  displayedColumnsEquipos: string[] = ['nombreEquipo', 'miembros', ' '];

  alumnosEquipo: Alumno[];

  inscripcionesAlumnos: AlumnoJuegoDeColeccion[];
  inscripcionesEquipos: EquipoJuegoDeColeccion[];
  coleccion: Coleccion;

  constructor(
               public dialog: MatDialog,
               public sesion: SesionService,
               public peticionesAPI: PeticionesAPIService,
               public calculos: CalculosService,
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




  AlumnosDelEquipo(equipo: Equipo) {
    console.log(equipo);

    this.peticionesAPI.DameAlumnosEquipo(equipo.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.alumnosEquipo = res;
        console.log(res);
      } else {
        console.log('No hay alumnos en este equipo');
        this.alumnosEquipo = undefined;
      }
    });
  }

  // EquipoDelAlumno(alumno: Alumno): Equipo {
  //   // devuelve el equipo al que pertenece el alumno de los inscritos
  //   // en el juego
  //   this.peticionesAPI.DameEquiposDelAlumno (alumno.id)
  //   .subscribe (equiposDelAlumno => {
  //     // Busco el equipo que esta tanto en la lista de equipos del juego como en la lista de equipso del
  //     // alumno
  //     const equipo = equiposDelAlumno.filter(e => this.equiposDelJuego.some(a => a.id === e.id))[0];

  //     return equipo;
  //   });
  // }


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

  DesactivarJuego() {
    console.log(this.juegoSeleccionado);
    this.juegoSeleccionado.JuegoActivo = false;
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.CambiaEstadoJuegoDeColeccion(this.juegoSeleccionado).subscribe(res => {
        if (res !== undefined) {
          this.comServerService.enviarInfoGrupoJuegoStatus(this.juegoSeleccionado.grupoId);
          this.location.back();
        }
      });
  }

  AbrirDialogoConfirmacionDesactivar(): void {

    Swal.fire({
      title: 'Desactivar',
      text: "Estas segura/o de que quieres desactivar: " + this.juegoSeleccionado.Tipo,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'

    }).then((result) => {
      if (result.value) {
        this.DesactivarJuego();
        Swal.fire('Desactivado', this.juegoSeleccionado.Tipo + ' Desactivado correctamente', 'success');
      }
    })
  }

  MostrarInformacion() {
    this.sesion.TomaColeccion (this.coleccion);
    this.router.navigate (['/grupo/' + this.juegoSeleccionado.grupoId + '/juegos/juegoSeleccionadoActivo/informacionJuegoColeccion']);
  }
  AsignarCromos() {
    this.sesion.TomaAlumnosDelJuego (this.alumnosDelJuego);
    this.sesion.TomaEquiposDelJuego (this.equiposDelJuego);
    this.sesion.TomaColeccion (this.coleccion);
    this.sesion.TomaJuego (this.juegoSeleccionado);
    this.router.navigate (['/grupo/' + this.juegoSeleccionado.grupoId + '/juegos/juegoSeleccionadoActivo/asignarCromos']);
  }
}

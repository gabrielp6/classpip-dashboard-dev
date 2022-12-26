import { Component, OnInit } from '@angular/core';
// Servicio
import { SesionService, PeticionesAPIService, CalculosService, ComServerService } from '../../../servicios/index';
import Swal from 'sweetalert2';
// Clases
import { TablaAlumnoJuegoDeVotacionTodosAUno} from '../../../clases/index';
import {JuegoDeVotacionTodosAUno, Alumno, AlumnoJuegoDeVotacionTodosAUno} from '../../../clases/index';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { Howl } from 'howler';
import { desactivarJuego } from '../../ventana-activar-desactivar/activarDesactivarJuego';

@Component({
  selector: 'app-juego-de-votacion-todos-auno-seleccionado-activo',
  templateUrl: './juego-de-votacion-todos-auno-seleccionado-activo.component.html',
  styleUrls: ['./juego-de-votacion-todos-auno-seleccionado-activo.component.scss']
})
export class JuegoDeVotacionTodosAUnoSeleccionadoActivoComponent implements OnInit {
  juegoSeleccionado: any;
  alumnosDelJuego: Alumno[];
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeVotacionTodosAUno[];
  rankingIndividualJuegoDeVotacionTodosAUno: TablaAlumnoJuegoDeVotacionTodosAUno[] = [];
  datasourceAlumno;

  // tslint:disable-next-line:max-line-length
  displayedColumnsAlumnos: string[] = ['posicion', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'votos',  'nota'];
  columnasListas = false;

  //  /** Table columns */
  //  columns = [
  //   { columnDef: 'posicion',    header: 'Posición',       cell: (row: TablaAlumnoJuegoDeVotacionTodosAUno) => `${row.posicion}`        },
  //   { columnDef: 'nombreAlumno',  header: 'Nombre',     cell: (row: TablaAlumnoJuegoDeVotacionTodosAUno) => `${row.nombre}`      },
  //   // tslint:disable-next-line:max-line-length
  //   { columnDef: 'primerApellido',  header: 'Primer Apellido', cell: (row: TablaAlumnoJuegoDeVotacionTodosAUno) => `${row.primerApellido}` },
  //   // tslint:disable-next-line:max-line-length
  //   { columnDef: 'segundoApellido',  header: 'Segundo Apellido', cell: (row: TablaAlumnoJuegoDeVotacionTodosAUno) => `${row.segundoApellido}` },
  //   { columnDef: 'nota',  header: 'Nota', cell: (row: TablaAlumnoJuegoDeVotacionTodosAUno) => `${row.nota}` },
  //   { columnDef: 'votos',  header: 'Votos recibidos', cell: (row: TablaAlumnoJuegoDeVotacionTodosAUno) => `${row.votosRecibidos}` },
  //   { columnDef: 'C1',  header: 'C1', cell: (row: TablaAlumnoJuegoDeVotacionTodosAUno) => `${row.conceptos[0]}` }
  //   // { columnDef: ' ',  header: ' ', cell: (row: TablaAlumnoJuegoDeVotacionTodosAUno) => `${row.votado}` }
  // ];

  // /** Column definitions in order */
  // displayedColumnsAlumnos = this.columns.map(x => x.columnDef);

  constructor(
    public sesion: SesionService,
    public peticionesAPI: PeticionesAPIService,
    public calculos: CalculosService,
    private comServer: ComServerService,
    private location: Location) { }

  ngOnInit() {
    const sound = new Howl({
      src: ['/assets/got-it-done.mp3']
    });
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log(this.juegoSeleccionado);
    if (this.juegoSeleccionado.Conceptos.length > 1) {
      // Si solo hay un concepto entonces no añado nuevas columnas porque en la tabla solo se mostrará
      // la nota final y no la nota del concepto, que es la misma que la nota final.
      this.juegoSeleccionado.Conceptos.forEach (concepto => this.displayedColumnsAlumnos.push (concepto));
    }
    this.displayedColumnsAlumnos.push (' ');
    this.columnasListas = true;
    console.log ('columnas');
    console.log (this.displayedColumnsAlumnos);
    console.log ('conceptos');
    console.log (this.juegoSeleccionado.Conceptos);


    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.AlumnosDelJuego();
    } else {
      console.log ('aun no funciona la modalidad por equipos');
    }
    this.comServer.EsperoVotaciones()
    .subscribe((res: any) => {
        sound.play();
        // Recupero las inscripciones de la base de datos para actualizar la tabla
        this.RecuperarInscripcionesAlumnoJuego();
    });
  }

    // Recupera los alumnos que pertenecen al juego
    AlumnosDelJuego() {
      console.log ('Vamos a pos los alumnos');
      this.peticionesAPI.DameAlumnosJuegoDeVotacionTodosAUno(this.juegoSeleccionado.id)
      .subscribe(alumnosJuego => {
        console.log ('Ya tengo los alumnos');
        console.log(alumnosJuego);
        this.alumnosDelJuego = alumnosJuego;
        this.RecuperarInscripcionesAlumnoJuego();
      });

  }

  RecuperarInscripcionesAlumnoJuego() {
    console.log ('vamos por las inscripciones ' + this.juegoSeleccionado.id);
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeVotacionTodosAUno(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntos = inscripciones;
      this.TablaClasificacionTotal();
    });
  }

  TablaClasificacionTotal() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      // tslint:disable-next-line:max-line-length
      this.rankingIndividualJuegoDeVotacionTodosAUno = this.calculos.PrepararTablaRankingIndividualVotacionTodosAUno (
        this.listaAlumnosOrdenadaPorPuntos,
        this.alumnosDelJuego,
        this.juegoSeleccionado);
      // tslint:disable-next-line:only-arrow-functions
      this.rankingIndividualJuegoDeVotacionTodosAUno = this.rankingIndividualJuegoDeVotacionTodosAUno.sort(function(obj1, obj2) {
        return obj2.nota - obj1.nota;
      });
      console.log ('inscripciones');
      console.log (this.listaAlumnosOrdenadaPorPuntos);
      console.log ('ranking');
      console.log (this.rankingIndividualJuegoDeVotacionTodosAUno);
      this.datasourceAlumno = new MatTableDataSource(this.rankingIndividualJuegoDeVotacionTodosAUno);

    } else {
      console.log ('la modalidad en equipo aun no está operativa');

    }
  }


  VotacionFinalizada() {
    // Miro si todos han votado
   return false;
  }

  DesactivarJuego() {
    desactivarJuego().then((result) => {
      if (result.value) {
        // Primero registro las puntuaciones definitivas de cada alumno
        this.listaAlumnosOrdenadaPorPuntos.forEach (alumno => {
          alumno.PuntosTotales = this.rankingIndividualJuegoDeVotacionTodosAUno.filter (al => al.id === alumno.alumnoId)[0].nota;
          console.log ('actualizo');
          console.log (alumno);
          this.peticionesAPI.ModificaInscripcionAlumnoJuegoDeVotacionTodosAUno (alumno).subscribe();
        });

        this.juegoSeleccionado.JuegoActivo = false;
        this.peticionesAPI.CambiaEstadoJuegoDeVotacionTodosAUno (this.juegoSeleccionado)
        .subscribe(res => {
            if (res !== undefined) {
              this.comServer.enviarInfoGrupoJuegoStatus(this.juegoSeleccionado.grupoId);
              console.log(res);
              console.log('juego desactivado');
              Swal.fire('El juego se ha desactivado correctamente');
              this.location.back();
            }
        });
      }
    });
  }

  applyFilter(filterValue: string) {
    this.datasourceAlumno.filter = filterValue.trim().toLowerCase();
  }

}

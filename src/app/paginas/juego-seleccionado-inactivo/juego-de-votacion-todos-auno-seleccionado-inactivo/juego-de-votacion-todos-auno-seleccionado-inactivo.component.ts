import { Component, OnInit } from '@angular/core';

import { SesionService, PeticionesAPIService, CalculosService, ComServerService } from '../../../servicios/index';
import Swal from 'sweetalert2';
import {JuegoDeVotacionTodosAUno, Alumno, AlumnoJuegoDeVotacionTodosAUno, TablaAlumnoJuegoDeVotacionTodosAUno} from '../../../clases/index';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { reActivarJuego } from '../../ventana-re-activar-juego/reActivarJuego';

@Component({
  selector: 'app-juego-de-votacion-todos-auno-seleccionado-inactivo',
  templateUrl: './juego-de-votacion-todos-auno-seleccionado-inactivo.component.html',
  styleUrls: ['./juego-de-votacion-todos-auno-seleccionado-inactivo.component.scss']
})
export class JuegoDeVotacionTodosAUnoSeleccionadoInactivoComponent implements OnInit {
  juegoSeleccionado: any;
  alumnosDelJuego: Alumno[];
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeVotacionTodosAUno[];
  rankingIndividualJuegoDeVotacionTodosAUno: TablaAlumnoJuegoDeVotacionTodosAUno[] = [];
  dataSourceAlumno;

  // tslint:disable-next-line:max-line-length
  displayedColumnsAlumnos: string[] = ['posicion', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'votos',  'nota'];

  constructor(
    public sesion: SesionService,
    public peticionesAPI: PeticionesAPIService,
    public calculos: CalculosService,
    private location: Location,
    public comServerService: ComServerService
  ) { }


  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log(this.juegoSeleccionado);
    if (this.juegoSeleccionado.Conceptos.length > 1) {
      // Si solo hay un concepto entonces no añado nuevas columnas porque en la tabla solo se mostrará
      // la nota final y no la nota del concepto, que es la misma que la nota final.
      this.juegoSeleccionado.Conceptos.forEach (concepto => this.displayedColumnsAlumnos.push (concepto));
    }

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.AlumnosDelJuego();
    } else {
      console.log ('aun no funciona la modalidad por equipos');
    }
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
      console.log ('inscripciones');
      console.log (this.listaAlumnosOrdenadaPorPuntos);
      // ordena la lista por puntos
      // tslint:disable-next-line:only-arrow-functions
      // this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
      //   return obj2.puntosTotales - obj1.puntosTotales;
      // });
      this.TablaClasificacionTotal();
    });
  }



  TablaClasificacionTotal() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      // tslint:disable-next-line:max-line-length
      this.rankingIndividualJuegoDeVotacionTodosAUno = this.calculos.PrepararTablaRankingIndividualVotacionTodosAUnoAcabado (
        this.listaAlumnosOrdenadaPorPuntos,
        this.alumnosDelJuego,
        this.juegoSeleccionado);
      // tslint:disable-next-line:only-arrow-functions
      this.rankingIndividualJuegoDeVotacionTodosAUno = this.rankingIndividualJuegoDeVotacionTodosAUno.sort(function(obj1, obj2) {
        return obj2.nota - obj1.nota;
      });
      this.dataSourceAlumno = new MatTableDataSource(this.rankingIndividualJuegoDeVotacionTodosAUno);

    } else {
      console.log ('la modalidad en equipo aun no está operativa');

    }
  }

  Eliminar() {
    Swal.fire({
      title: '¿Seguro que quieres eliminar el juego de votación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then(async (result) => {
      if (result.value) {
        await this.calculos.EliminarJuegoDeVotacionTodosAUno(this.juegoSeleccionado);
        Swal.fire('El juego se ha eliminado correctamente');
        this.location.back();
      }
    });
  }

  Reactivar() {
    reActivarJuego().then((result) => {
      if (result.value) {

        this.juegoSeleccionado.JuegoActivo = true;
        this.peticionesAPI.CambiaEstadoJuegoDeVotacionTodosAUno (this.juegoSeleccionado)
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


  applyFilter(filterValue: string) {
    this.dataSourceAlumno.filter = filterValue.trim().toLowerCase();
  }


}

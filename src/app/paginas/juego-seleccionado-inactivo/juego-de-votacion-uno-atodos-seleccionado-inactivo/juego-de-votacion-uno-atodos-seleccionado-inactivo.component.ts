import { Component, OnInit } from '@angular/core';
import { SesionService, PeticionesAPIService, CalculosService, ComServerService } from '../../../servicios/index';
import Swal from 'sweetalert2';
import {JuegoDeVotacionUnoATodos, Alumno, AlumnoJuegoDeVotacionUnoATodos, TablaAlumnoJuegoDeVotacionUnoATodos, Equipo} from '../../../clases/index';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { EquipoJuegoDeVotacionUnoATodos } from 'src/app/clases/EquipoJuegoDeVotacionUnoATodos';
import { TablaEquipoJuegoDeVotacionUnoATodos } from 'src/app/clases/TablaEquipoJuegoDeVotacionUnoATodos';
import { reActivarJuego } from '../../ventana-re-activar-juego/reActivarJuego';

@Component({
  selector: 'app-juego-de-votacion-uno-atodos-seleccionado-inactivo',
  templateUrl: './juego-de-votacion-uno-atodos-seleccionado-inactivo.component.html',
  styleUrls: ['./juego-de-votacion-uno-atodos-seleccionado-inactivo.component.scss']
})
export class JuegoDeVotacionUnoATodosSeleccionadoInactivoComponent implements OnInit {
  juegoSeleccionado: any;
  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];
  alumnosEquipo: Alumno[];
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeVotacionUnoATodos[];
  listaEquiposOrdenadaPorPuntos: EquipoJuegoDeVotacionUnoATodos[];
  rankingIndividualJuegoDeVotacionUnoATodos: TablaAlumnoJuegoDeVotacionUnoATodos[] = [];
  rankingEquipoJuegoDeVotacionUnoATodos: TablaEquipoJuegoDeVotacionUnoATodos[] = [];

  dataSourceAlumno;
  dataSourceEquipo;

  displayedColumnsAlumnos: string[] = ['posicion', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'puntos'];
  displayedColumnsEquipos: string[] = ['posicion', 'nombreEquipo', 'miembros', 'puntos'];

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

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.AlumnosDelJuego();
    } else {
      this.EquiposDelJuego();
    }
  }

  // Recupera los alumnos que pertenecen al juego
  AlumnosDelJuego() {
      console.log ('Vamos a pos los alumnos');
      this.peticionesAPI.DameAlumnosJuegoDeVotacionUnoATodos(this.juegoSeleccionado.id)
      .subscribe(alumnosJuego => {
        console.log ('Ya tengo los alumnos');
        console.log(alumnosJuego);
        this.alumnosDelJuego = alumnosJuego;
        this.RecuperarInscripcionesAlumnoJuego();
      });
  }

  EquiposDelJuego() {
    console.log ('Vamos a pos los equipos');
    this.peticionesAPI.DameEquiposJuegoDeVotacionUnoATodos(this.juegoSeleccionado.id)
    .subscribe(equiposJuego => {
      console.log ('Ya tengo los equipos');
      console.log(equiposJuego);
      this.equiposDelJuego = equiposJuego;
      this.RecuperarInscripcionesEquipoJuego();
    });
  }

  RecuperarInscripcionesAlumnoJuego() {
    console.log ('vamos por las inscripciones ' + this.juegoSeleccionado.id);
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeVotacionUnoATodos(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntos = inscripciones;
      // ordena la lista por puntos
      // tslint:disable-next-line:only-arrow-functions
      this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
        return obj2.puntosTotales - obj1.puntosTotales;
      });
      this.TablaClasificacionTotal();
    });
  }
  RecuperarInscripcionesEquipoJuego() {
    console.log ('vamos por las inscripciones de equipos ' + this.juegoSeleccionado.id);
    this.peticionesAPI.DameInscripcionesEquipoJuegoDeVotacionUnoATodos(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaEquiposOrdenadaPorPuntos = inscripciones;
      // ordena la lista por puntos
      // tslint:disable-next-line:only-arrow-functions
      this.listaEquiposOrdenadaPorPuntos = this.listaEquiposOrdenadaPorPuntos.sort(function(obj1, obj2) {
        return obj2.puntosTotales - obj1.puntosTotales;
      });
      this.TablaClasificacionTotal();
    });
  }


  TablaClasificacionTotal() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      // tslint:disable-next-line:max-line-length
      this.rankingIndividualJuegoDeVotacionUnoATodos = this.calculos.PrepararTablaRankingIndividualVotacionUnoATodosAcabado (
        this.listaAlumnosOrdenadaPorPuntos,
        this.alumnosDelJuego);
      // tslint:disable-next-line:only-arrow-functions
      this.rankingIndividualJuegoDeVotacionUnoATodos = this.rankingIndividualJuegoDeVotacionUnoATodos.sort(function(obj1, obj2) {
        return obj2.puntos - obj1.puntos;
      });
      this.dataSourceAlumno = new MatTableDataSource(this.rankingIndividualJuegoDeVotacionUnoATodos);

    } else {
    
      // tslint:disable-next-line:max-line-length
      this.rankingEquipoJuegoDeVotacionUnoATodos = this.calculos.PrepararTablaRankingEquipoVotacionUnoATodosAcabado (
        this.listaEquiposOrdenadaPorPuntos,
        this.equiposDelJuego);
      // tslint:disable-next-line:only-arrow-functions
      this.rankingEquipoJuegoDeVotacionUnoATodos = this.rankingEquipoJuegoDeVotacionUnoATodos.sort(function(obj1, obj2) {
        return obj2.puntos - obj1.puntos;
      });

      this.dataSourceEquipo = new MatTableDataSource(this.rankingEquipoJuegoDeVotacionUnoATodos);

    }
  }

   
  Eliminar(): void {

    Swal.fire({
      title: 'Confirma que quieres eliminar el juego <b>' + this.juegoSeleccionado.NombreJuego + '</b>',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
    }).then(async (result) => {
      if (result.value) {
        await this.calculos.EliminarJuegoDeVotacionUnoATodos(this.juegoSeleccionado);
        Swal.fire('El juego ha sido eliminado correctamente', ' ', 'success');
        this.location.back();
      }
    });
  }

  Reactivar() {
    reActivarJuego().then((result) => {
      if (result.value) {

        this.juegoSeleccionado.JuegoActivo = true;
        this.peticionesAPI.CambiaEstadoJuegoDeVotacionUnaATodos (this.juegoSeleccionado)
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
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.dataSourceAlumno.filter = filterValue.trim().toLowerCase();
    } else {
      this.dataSourceEquipo.filter = filterValue.trim().toLowerCase();
    }
  }
  AlumnosDelEquipo(equipo: Equipo) {
    console.log(equipo);

    this.peticionesAPI.DameAlumnosEquipo (equipo.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.alumnosEquipo = res;
        console.log(res);
      } else {
        console.log('No hay alumnos en este equipo');
        // Informar al usuario
        this.alumnosEquipo = undefined;
      }
    });
  }


}

import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

// Clases
import { Juego, Jornada, TablaJornadas, EnfrentamientoLiga, TablaAlumnoJuegoDeCompeticion,
  TablaEquipoJuegoDeCompeticion,
  AlumnoJuegoDeCompeticionLiga,
  EquipoJuegoDeCompeticionLiga} from '../../../../clases/index';

// Services
import { SesionService, CalculosService, PeticionesAPIService } from '../../../../servicios/index';
import {MatTableDataSource} from '@angular/material/table';

import { Location } from '@angular/common';
import swal from 'sweetalert';


@Component({
  selector: 'app-ganador-juego-de-competicion-liga',
  templateUrl: './ganador-juego-de-competicion-liga.component.html',
  styleUrls: ['./ganador-juego-de-competicion-liga.component.scss']
})
export class GanadorJuegoDeCompeticionLigaComponent implements OnInit {

  /* Estructura necesaria para determinar que filas son las que se han seleccionado */
  selectionUno = new SelectionModel<any>(true, []);
  selectionDos = new SelectionModel<any>(true, []);
  selectionTres = new SelectionModel<any>(true, []);
  botonAsignarAleatorioDesactivado = true;
  botonAsignarManualDesactivado = true;

  enfrentamientosSeleccionadosColumnaUno: EnfrentamientoLiga[] = [];
  enfrentamientosSeleccionadosColumnaDos: EnfrentamientoLiga[] = [];
  enfrentamientosSeleccionadosColumnaTres: EnfrentamientoLiga[] = [];
  equiposSeleccionadosUno: any[] = [];
  equiposSeleccionadosDos: any[] = [];
  equiposSeleccionadosTres: any[] = [];

  avisoMasDeUnGanadorMarcadoUnoDos = false;
  avisoMasDeUnGanadorMarcadoUnoEmpate = false;
  avisoMasDeUnGanadorMarcadoDosEmpate = false;

  // Juego De CompeticionLiga seleccionado
  juegoSeleccionado: Juego;
  numeroTotalJornadas: number;
  jornadasDelJuego: Jornada[];
  JornadasCompeticion: TablaJornadas[] = [];
  jornadaId: number;

  // Información de la tabla: Muestra el JugadorUno, JugadorDos, Ganador, JornadaDeCompeticionLigaId y id
  EnfrentamientosJornadaSeleccionada: EnfrentamientoLiga[] = [];

  // Alumnos y Equipos del Juego
  listaAlumnosClasificacion: TablaAlumnoJuegoDeCompeticion[] = [];
  listaEquiposClasificacion: TablaEquipoJuegoDeCompeticion[] = [];
  alumnosJuegoDeCompeticionLiga: AlumnoJuegoDeCompeticionLiga[] = [];
  equiposJuegoDeCompeticionLiga: EquipoJuegoDeCompeticionLiga[] = [];

  AlumnoJuegoDeCompeticionLigaId: number;

  dataSourceTablaGanadorIndividual;
  dataSourceTablaGanadorEquipo;

  // displayedColumnsAlumno: string[] = ['select1', 'nombreJugadorUno', 'select2', 'nombreJugadorDos', 'select3', 'Empate'];
  displayedColumnsAlumno: string[] = ['select1', 'nombreJugadorUno', 'select2', 'nombreJugadorDos', 'select3', 'Empate'];

  constructor( public sesion: SesionService,
               public location: Location,
               public calculos: CalculosService,
               public peticionesAPI: PeticionesAPIService) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.numeroTotalJornadas = this.juegoSeleccionado.NumeroTotalJornadas;
    console.log('Juego seleccionado: ');
    console.log(this.juegoSeleccionado);
    console.log('Número total de jornadas: ');
    console.log(this.numeroTotalJornadas);
    const datos = this.sesion.DameDatosJornadas();
    this.JornadasCompeticion = datos.JornadasCompeticion;
    console.log('Jornadas Competicion: ');
    // Teniendo la tabla de Jornadas puedo sacar los enfrentamientos de cada jornada accediendo a la api
    console.log(this.JornadasCompeticion);
    this.listaAlumnosClasificacion = this.sesion.DameTablaAlumnoJuegoDeCompeticion();
    this.listaEquiposClasificacion = this.sesion.DameTablaEquipoJuegoDeCompeticion();
    console.log(this.listaAlumnosClasificacion);
    this.alumnosJuegoDeCompeticionLiga = this.sesion.DameInscripcionAlumno();
    this.equiposJuegoDeCompeticionLiga = this.sesion.DameInscripcionEquipo();
  }

  /* Esta función decide si los botones deben estar activos (si se ha seleccionado la jornada)
     o si debe estar desactivado (si no se ha seleccionado la jornada) */
  ActualizarBotonAleatorio() {
    console.log('Estoy en actualizar botón');
    // Lo primero borramos las listas de ganadores:
    console.log('Voy a borrar las listas de ganadores');
    this.enfrentamientosSeleccionadosColumnaUno = [];
    this.enfrentamientosSeleccionadosColumnaDos = [];
    this.enfrentamientosSeleccionadosColumnaTres = [];
    console.log(this.jornadaId);
    // if ((this.selection.selected.length === 0) || this.jornadaId === undefined) {
    if (this.jornadaId === undefined) {
      this.botonAsignarAleatorioDesactivado = true;
    } else {
      this.botonAsignarAleatorioDesactivado = false;
      this.ObtenerEnfrentamientosDeCadaJornada(this.jornadaId);
    }
    console.log('botonAsignarAleatorioDesactivado = ' + this.botonAsignarAleatorioDesactivado);
  }

  ActualizarBotonManual() {
    console.log('Estoy en actualizar botón');
    console.log(this.jornadaId);
    // if ((this.selection.selected.length === 0) || this.jornadaId === undefined) {
    if (this.jornadaId === undefined) {
      this.botonAsignarManualDesactivado = true;
    } else {
      this.botonAsignarManualDesactivado = false;
      this.ObtenerEnfrentamientosDeCadaJornada(this.jornadaId);
    }
    console.log(this.botonAsignarAleatorioDesactivado);
  }

  ObtenerEnfrentamientosDeCadaJornada(jornadaId: number) {
    console.log('Estoy en ObtenerEnfrentamientosDeCadaJornada()');
    console.log('El id de la jornada seleccionada es: ' + jornadaId);
    this.peticionesAPI.DameEnfrentamientosDeCadaJornadaLiga(jornadaId)
    .subscribe(enfrentamientos => {
      this.EnfrentamientosJornadaSeleccionada = enfrentamientos;
      console.log('Los enfrentamientos de esta jornada son: ');
      console.log(this.EnfrentamientosJornadaSeleccionada);
      console.log('Ya tengo los enfrentamientos de la jornada, ahora tengo que mostrarlos en una tabla');
      this.ConstruirTablaElegirGanador();
    });
  }

  ConstruirTablaElegirGanador() {
    console.log ('Estoy en ConstruitTablaElegirGanador(), los enfrentamientos son:');
    console.log(this.EnfrentamientosJornadaSeleccionada);
    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('Estoy en ConstruirTablaElegirGanador() alumnos');
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.listaAlumnosClasificacion.length; j++) {
          if (this.EnfrentamientosJornadaSeleccionada[i].JugadorUno === this.listaAlumnosClasificacion[j].id) {
            this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno = this.listaAlumnosClasificacion[j].nombre + ' ' +
                                                                          this.listaAlumnosClasificacion[j].primerApellido + ' ' +
                                                                          this.listaAlumnosClasificacion[j].segundoApellido;
            if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === this.listaAlumnosClasificacion[j].id) {
              this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = this.listaAlumnosClasificacion[j].nombre + ' ' +
                                                                                  this.listaAlumnosClasificacion[j].primerApellido + ' ' +
                                                                                  this.listaAlumnosClasificacion[j].segundoApellido;
            } else if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === 0) {
                this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = 'Empate';
            } else if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === undefined) {
                this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = '-';
            }
          } else if (this.EnfrentamientosJornadaSeleccionada[i].JugadorDos === this.listaAlumnosClasificacion[j].id) {
              this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos = this.listaAlumnosClasificacion[j].nombre + ' ' +
                                                                            this.listaAlumnosClasificacion[j].primerApellido + ' ' +
                                                                            this.listaAlumnosClasificacion[j].segundoApellido;
              if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === this.listaAlumnosClasificacion[j].id) {
                this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = this.listaAlumnosClasificacion[j].nombre + ' ' +
                                                                                    this.listaAlumnosClasificacion[j].primerApellido + ' ' +
                                                                                    this.listaAlumnosClasificacion[j].segundoApellido;
              } else if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === 0) {
                  this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = 'Empate';
              } else if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === undefined) {
                  this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = '-';
              }
          }
        }
      }
      console.log(this.EnfrentamientosJornadaSeleccionada);
      this.dataSourceTablaGanadorIndividual = new MatTableDataSource(this.EnfrentamientosJornadaSeleccionada);
      console.log('El dataSource es:');
      console.log(this.dataSourceTablaGanadorIndividual.data);

    } else {
      console.log('Estoy en ConstruirTablaElegirGanador() equipos');
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.listaEquiposClasificacion.length; j++) {
          if (this.EnfrentamientosJornadaSeleccionada[i].JugadorUno === this.listaEquiposClasificacion[j].id) {
            this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno = this.listaEquiposClasificacion[j].nombre;
            if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === this.listaEquiposClasificacion[j].id) {
              this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = this.listaEquiposClasificacion[j].nombre;
            } else if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === 0) {
                this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = 'Empate';
            } else if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === undefined) {
              this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = '-';
          }
          } else if (this.EnfrentamientosJornadaSeleccionada[i].JugadorDos === this.listaEquiposClasificacion[j].id) {
              this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos = this.listaEquiposClasificacion[j].nombre;
              if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === this.listaEquiposClasificacion[j].id) {
                this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = this.listaEquiposClasificacion[j].nombre;
              } else if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === 0) {
                this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = 'Empate';
              } else if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === undefined) {
                this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = '-';
            }
          }
        }
      }
      console.log(this.EnfrentamientosJornadaSeleccionada);
      this.dataSourceTablaGanadorEquipo = new MatTableDataSource(this.EnfrentamientosJornadaSeleccionada);
      console.log('El dataSource es:');
      console.log(this.dataSourceTablaGanadorEquipo.data);
    }
  }

  AsignarGanadorAleatoriamente() {
    console.log('Estoy en AsignarGanadorAleatoriamente()');
    console.log('La lista de enfrentamientos de esta Jornada es: ');
    console.log(this.EnfrentamientosJornadaSeleccionada);
    const listaEnfrentamientosActualizados: EnfrentamientoLiga[] = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {
      const Random = Math.random();
      console.log('Random ' + i + ' = ' + Random);
      if (Random < 0.33) {
        this.EnfrentamientosJornadaSeleccionada[i].Ganador = this.EnfrentamientosJornadaSeleccionada[i].JugadorUno;
        this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno;
        console.log('El ganador del enfrentamiento ' + this.EnfrentamientosJornadaSeleccionada[i].id + ' es: '
                    + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno);
        console.log(this.EnfrentamientosJornadaSeleccionada[i]);
        listaEnfrentamientosActualizados.push(this.EnfrentamientosJornadaSeleccionada[i]);
      } else if (Random > 0.33 && Random < 0.66) {
        this.EnfrentamientosJornadaSeleccionada[i].Ganador = this.EnfrentamientosJornadaSeleccionada[i].JugadorDos;
        this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos;
        console.log('El ganador del enfrentamiento ' + this.EnfrentamientosJornadaSeleccionada[i].id + ' es: '
                    + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos);
        console.log(this.EnfrentamientosJornadaSeleccionada[i]);
        listaEnfrentamientosActualizados.push(this.EnfrentamientosJornadaSeleccionada[i]);
      } else if (Random > 0.66) {
        this.EnfrentamientosJornadaSeleccionada[i].Ganador = 0;
        this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = 'Empate';
        console.log('El enfrentamiento ' + this.EnfrentamientosJornadaSeleccionada[i].id + ' ha quedado en empate: ');
        console.log(this.EnfrentamientosJornadaSeleccionada[i]);
        listaEnfrentamientosActualizados.push(this.EnfrentamientosJornadaSeleccionada[i]);
      }
      this.peticionesAPI.PonGanadorDelEnfrentamiento(this.EnfrentamientosJornadaSeleccionada[i]).subscribe();
    }
    console.log('La lista de enfrentamientos actualizados queda: ');
    console.log(listaEnfrentamientosActualizados);

    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('Este Juego es Individual');
      this.AsignarPuntosAlumnosGanadorAleatoriamente(listaEnfrentamientosActualizados, this.alumnosJuegoDeCompeticionLiga);
    } else {
      console.log('Este Juego es por Equipos');
      this.AsignarPuntosEquiposGanadorAleatoriamente(listaEnfrentamientosActualizados, this.equiposJuegoDeCompeticionLiga);
    }
  }

  AsignarPuntosAlumnosGanadorAleatoriamente(listaEnfrentamientosActualizados: EnfrentamientoLiga[],
                                            alumnosJuegoDeCompeticionLiga: AlumnoJuegoDeCompeticionLiga[]) {
    console.log('Estoy en AsignarGanadorAlumnosAleatoriamente()');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < listaEnfrentamientosActualizados.length; i++) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < alumnosJuegoDeCompeticionLiga.length; j++) {
        if (listaEnfrentamientosActualizados[i].Ganador === alumnosJuegoDeCompeticionLiga[j].AlumnoId) {
          alumnosJuegoDeCompeticionLiga[j].PuntosTotalesAlumno = alumnosJuegoDeCompeticionLiga[j].PuntosTotalesAlumno + 3;
          console.log('El alumno ganador actualizado queda: ');
          console.log(alumnosJuegoDeCompeticionLiga[j]);
        } else if (listaEnfrentamientosActualizados[i].Ganador === 0) {
          if (listaEnfrentamientosActualizados[i].JugadorUno === alumnosJuegoDeCompeticionLiga[j].AlumnoId) {
            console.log('Ya tengo el JugadorUno del enfrentamiento ' + listaEnfrentamientosActualizados[i].id
                         + ', voy a sumarle un punto y actualizar la BD');
            alumnosJuegoDeCompeticionLiga[j].PuntosTotalesAlumno = alumnosJuegoDeCompeticionLiga[j].PuntosTotalesAlumno + 1;
          } else if (listaEnfrentamientosActualizados[i].JugadorDos === alumnosJuegoDeCompeticionLiga[j].AlumnoId) {
            console.log('Ya tengo el JugadorDos del enfrentamiento ' + listaEnfrentamientosActualizados[i].id
                          + ', voy a sumarle un punto y actualizar la BD');
            alumnosJuegoDeCompeticionLiga[j].PuntosTotalesAlumno = alumnosJuegoDeCompeticionLiga[j].PuntosTotalesAlumno + 1;
          }
        }
        this.peticionesAPI.PonPuntosAlumnoGanadorJuegoDeCompeticionLiga(alumnosJuegoDeCompeticionLiga[j])
        .subscribe();
      }
    }
  }

  AsignarPuntosEquiposGanadorAleatoriamente(listaEnfrentamientosActualizados: EnfrentamientoLiga[],
                                            equiposJuegoDeCompeticionLiga: EquipoJuegoDeCompeticionLiga[]) {
    console.log('Estoy en AsignarGanadorAlumnosAleatoriamente()');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < listaEnfrentamientosActualizados.length; i++) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < equiposJuegoDeCompeticionLiga.length; j++) {
        if (listaEnfrentamientosActualizados[i].Ganador === equiposJuegoDeCompeticionLiga[j].EquipoId) {
          equiposJuegoDeCompeticionLiga[j].PuntosTotalesEquipo = equiposJuegoDeCompeticionLiga[j].PuntosTotalesEquipo + 3;
          console.log('El alumno ganador actualizado queda: ');
          console.log(equiposJuegoDeCompeticionLiga[j]);
        } else if (listaEnfrentamientosActualizados[i].Ganador === 0) {
          if (listaEnfrentamientosActualizados[i].JugadorUno === equiposJuegoDeCompeticionLiga[j].EquipoId) {
            console.log('Ya tengo el JugadorUno del enfrentamiento ' + listaEnfrentamientosActualizados[i].id
                         + ', voy a sumarle un punto y actualizar la BD');
            equiposJuegoDeCompeticionLiga[j].PuntosTotalesEquipo = equiposJuegoDeCompeticionLiga[j].PuntosTotalesEquipo + 1;
          } else if (listaEnfrentamientosActualizados[i].JugadorDos === equiposJuegoDeCompeticionLiga[j].EquipoId) {
            console.log('Ya tengo el JugadorDos del enfrentamiento ' + listaEnfrentamientosActualizados[i].id
                          + ', voy a sumarle un punto y actualizar la BD');
            equiposJuegoDeCompeticionLiga[j].PuntosTotalesEquipo = equiposJuegoDeCompeticionLiga[j].PuntosTotalesEquipo + 1;
          }
        }
        this.peticionesAPI.PonPuntosEquipoGanadorJuegoDeCompeticionLiga(equiposJuegoDeCompeticionLiga[j])
        .subscribe();
      }
    }
  }

  AsignarGanadorManualmente() {
    /////////////////////////////////////////////////////   INDIVIDUAL   //////////////////////////////////////////////////
    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('La lista de alumnos ganadoresUno es:');
      console.log(this.enfrentamientosSeleccionadosColumnaUno);
      console.log('La lista de alumnos ganadoresDos es:');
      console.log(this.enfrentamientosSeleccionadosColumnaDos);
      console.log('La lista de alumnos ganadoresTres es:');
      console.log(this.enfrentamientosSeleccionadosColumnaTres);

      this.avisoMasDeUnGanadorMarcadoDosEmpate = false;
      this.avisoMasDeUnGanadorMarcadoUnoDos = false;
      this.avisoMasDeUnGanadorMarcadoUnoEmpate = false;

      // Segundo miramos si solo hay una selección por enfrentamiento
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.enfrentamientosSeleccionadosColumnaUno.length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.enfrentamientosSeleccionadosColumnaDos.length; j++) {
          if (this.enfrentamientosSeleccionadosColumnaUno[i].id === this.enfrentamientosSeleccionadosColumnaDos[j].id) {
            this.avisoMasDeUnGanadorMarcadoUnoDos = true;
            console.log('Hay alguna selección con ganadorUno y ganadorDos, poner el sweatalert');
            console.log(this.enfrentamientosSeleccionadosColumnaDos[j]);
            console.log(this.enfrentamientosSeleccionadosColumnaUno[i].id);
          }
        }
        // tslint:disable-next-line:prefer-for-of
        for (let k = 0; k < this.enfrentamientosSeleccionadosColumnaTres.length; k++) {
          if (this.enfrentamientosSeleccionadosColumnaUno[i].id === this.enfrentamientosSeleccionadosColumnaTres[k].id) {
            this.avisoMasDeUnGanadorMarcadoUnoEmpate = true;
            console.log('Hay alguna selección con ganadorUno y Empate, poner el sweatalert');
            console.log(this.enfrentamientosSeleccionadosColumnaUno[i]);
            console.log(this.enfrentamientosSeleccionadosColumnaTres[k].id);
          }
        }
      }

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.enfrentamientosSeleccionadosColumnaDos.length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.enfrentamientosSeleccionadosColumnaTres.length; j++) {
          if (this.enfrentamientosSeleccionadosColumnaDos[i].id === this.enfrentamientosSeleccionadosColumnaTres[j].id) {
            this.avisoMasDeUnGanadorMarcadoUnoEmpate = true;
            console.log('Hay alguna selección con ganadorDos y Empate, poner sweatalert');
            console.log(this.enfrentamientosSeleccionadosColumnaDos[i]);
            console.log(this.enfrentamientosSeleccionadosColumnaTres[j].id);
          }
        }
      }

      // tslint:disable-next-line:max-line-length
      console.log(this.avisoMasDeUnGanadorMarcadoUnoEmpate);
      console.log(this.avisoMasDeUnGanadorMarcadoDosEmpate);
      console.log(this.avisoMasDeUnGanadorMarcadoUnoDos);

      if (this.avisoMasDeUnGanadorMarcadoDosEmpate === false && this.avisoMasDeUnGanadorMarcadoUnoDos === false
          && this.avisoMasDeUnGanadorMarcadoUnoEmpate === false) {
            console.log('Ahora tenemos que coger el alumno, sumar los puntos y asignar ganador');
            console.log(this.enfrentamientosSeleccionadosColumnaUno);
            console.log(this.enfrentamientosSeleccionadosColumnaDos);
            console.log(this.enfrentamientosSeleccionadosColumnaTres);
            // -------------------------------- GANADOR UNO ----------------------------------- //
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.enfrentamientosSeleccionadosColumnaUno.length; i++) {
              // tslint:disable-next-line:prefer-for-of
              for (let j = 0; j < this.listaAlumnosClasificacion.length; j++) {
                const nombreCompleto = this.listaAlumnosClasificacion[j].nombre + ' ' + this.listaAlumnosClasificacion[j].primerApellido
                                     + ' ' + this.listaAlumnosClasificacion[j].segundoApellido;
                if (nombreCompleto === this.enfrentamientosSeleccionadosColumnaUno[i].nombreJugadorUno) {
                  console.log('He encontrado el alumno: ' + this.enfrentamientosSeleccionadosColumnaUno[i].nombreJugadorUno);
                  console.log('Los puntos antes de registrar el partido ganado: ' + this.listaAlumnosClasificacion[j].puntos);

                  // Miramos en la base de datos si para este enfrentamiento ya se había seleccionado un ganador.
                  // Si ya estaba asignado que aparezca un mensaje avisando (Si da a aceptar se reasigna el ganador seleccionado, si da a
                  // cancelar no se sobreescribe en la base de datos, se queda tal cual)
                  // tslint:disable-next-line:prefer-for-of
                  for (let k = 0; k < this.EnfrentamientosJornadaSeleccionada.length; k++) {
                    // tslint:disable-next-line:max-line-length
                    if (this.EnfrentamientosJornadaSeleccionada[k].nombreJugadorUno === this.enfrentamientosSeleccionadosColumnaUno[i].nombreJugadorUno &&
                        // tslint:disable-next-line:max-line-length
                        this.EnfrentamientosJornadaSeleccionada[k].nombreJugadorDos === this.enfrentamientosSeleccionadosColumnaUno[i].nombreJugadorDos) {
                      console.log('Ya estoy en el el enfrentamiento que quiero');
                      if (this.EnfrentamientosJornadaSeleccionada[k].Ganador === undefined) {
                        // Después tengo que actualizar el ganador en EnfrentamientoLiga
                        this.EnfrentamientosJornadaSeleccionada[k].Ganador = this.enfrentamientosSeleccionadosColumnaUno[i].JugadorUno;
                        console.log(this.EnfrentamientosJornadaSeleccionada[k]);
                        const enfrentamiento = new EnfrentamientoLiga(this.EnfrentamientosJornadaSeleccionada[k].id,
                                                                      this.EnfrentamientosJornadaSeleccionada[k].JugadorUno,
                                                                      this.EnfrentamientosJornadaSeleccionada[k].JugadorDos,
                                                                      this.EnfrentamientosJornadaSeleccionada[k].Ganador,
                                                                      // tslint:disable-next-line:max-line-length
                                                                      this.EnfrentamientosJornadaSeleccionada[k].JornadaDeCompeticionLigaId);
                        this.peticionesAPI.PonGanadorDelEnfrentamiento(enfrentamiento).
                        subscribe(res => console.log(res));

                        // Ahora tengo que actualizar el AlumnoJuegoDeCompeticionLiga con los nuevos puntos
                        this.listaAlumnosClasificacion[j].puntos = this.listaAlumnosClasificacion[j].puntos + 3;
                        console.log('Los puntos actualizados después de registrar el partido ganado: '
                                    + this.listaAlumnosClasificacion[j].puntos);
                        console.log(this.listaAlumnosClasificacion[j]);
                        // mirar porque listaAlumnosClasificados.id no lo coge ne alumnoGanador
                        console.log('el id del alumno es: ' + this.listaAlumnosClasificacion[j].id);
                        const AlumnoId = this.listaAlumnosClasificacion[j].id;
                        // tslint:disable-next-line:prefer-for-of
                        for (let m = 0; m < this.alumnosJuegoDeCompeticionLiga.length; m++) {
                          if (this.alumnosJuegoDeCompeticionLiga[m].AlumnoId === AlumnoId) {
                            this.AlumnoJuegoDeCompeticionLigaId = this.alumnosJuegoDeCompeticionLiga[m].id;
                          }
                        }
                        const alumnoGanador = new AlumnoJuegoDeCompeticionLiga(AlumnoId,
                                                                               this.juegoSeleccionado.id,
                                                                               this.listaAlumnosClasificacion[j].puntos,
                                                                               this.AlumnoJuegoDeCompeticionLigaId);
                        console.log(alumnoGanador);
                        console.log('El id del alumno es: ' + alumnoGanador.AlumnoId + ' y los puntos son: '
                                    + alumnoGanador.PuntosTotalesAlumno);
                        this.peticionesAPI.PonPuntosAlumnoGanadorJuegoDeCompeticionLiga(alumnoGanador).
                        subscribe(res => console.log(res));
                      } else {
                        console.log('Este enfrentamiento ya tiene asignado un ganador: ');
                        console.log(this.EnfrentamientosJornadaSeleccionada[k]);
                      }
                    }
                  }

                }
              }
            }

            // -------------------------------- GANADOR DOS ----------------------------------- //
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.enfrentamientosSeleccionadosColumnaDos.length; i++) {
              // tslint:disable-next-line:prefer-for-of
              for (let j = 0; j < this.listaAlumnosClasificacion.length; j++) {
                const nombreCompleto = this.listaAlumnosClasificacion[j].nombre + ' ' + this.listaAlumnosClasificacion[j].primerApellido
                                     + ' ' + this.listaAlumnosClasificacion[j].segundoApellido;
                if (nombreCompleto === this.enfrentamientosSeleccionadosColumnaDos[i].nombreJugadorDos) {
                  console.log('He encontrado el alumno: ' + this.enfrentamientosSeleccionadosColumnaDos[i].nombreJugadorDos);
                  console.log('Los puntos antes de registrar el partido ganado: ' + this.listaAlumnosClasificacion[j].puntos);

                  // Miramos en la base de datos si para este enfrentamiento ya se había seleccionado un ganador.
                  // Si ya estaba asignado que aparezca un mensaje avisando (Si da a aceptar se reasigna el ganador seleccionado, si da a
                  // cancelar no se sobreescribe en la base de datos, se queda tal cual)
                  // tslint:disable-next-line:prefer-for-of
                  for (let k = 0; k < this.EnfrentamientosJornadaSeleccionada.length; k++) {
                    // tslint:disable-next-line:max-line-length
                    if (this.EnfrentamientosJornadaSeleccionada[k].nombreJugadorUno === this.enfrentamientosSeleccionadosColumnaDos[i].nombreJugadorUno &&
                        // tslint:disable-next-line:max-line-length
                        this.EnfrentamientosJornadaSeleccionada[k].nombreJugadorDos === this.enfrentamientosSeleccionadosColumnaDos[i].nombreJugadorDos) {
                      console.log('Ya estoy en el el enfrentamiento que quiero');
                      if (this.EnfrentamientosJornadaSeleccionada[k].Ganador === undefined) {
                        // Después tengo que actualizar el ganador en EnfrentamientoLiga
                        this.EnfrentamientosJornadaSeleccionada[k].Ganador = this.enfrentamientosSeleccionadosColumnaDos[i].JugadorDos;
                        console.log(this.EnfrentamientosJornadaSeleccionada[k]);
                        const enfrentamiento = new EnfrentamientoLiga(this.EnfrentamientosJornadaSeleccionada[k].id,
                                                                      this.EnfrentamientosJornadaSeleccionada[k].JugadorUno,
                                                                      this.EnfrentamientosJornadaSeleccionada[k].JugadorDos,
                                                                      this.EnfrentamientosJornadaSeleccionada[k].Ganador,
                                                                      // tslint:disable-next-line:max-line-length
                                                                      this.EnfrentamientosJornadaSeleccionada[k].JornadaDeCompeticionLigaId);
                        this.peticionesAPI.PonGanadorDelEnfrentamiento(enfrentamiento).
                        subscribe(res => console.log(res));

                        // Ahora tengo que actualizar el AlumnoJuegoDeCompeticionLiga con los nuevos puntos
                        this.listaAlumnosClasificacion[j].puntos = this.listaAlumnosClasificacion[j].puntos + 3;
                        console.log('Los puntos actualizados después de registrar el partido ganado: '
                                    + this.listaAlumnosClasificacion[j].puntos);
                        console.log(this.listaAlumnosClasificacion[j]);
                        // mirar porque listaAlumnosClasificados.id no lo coge ne alumnoGanador
                        console.log('el id del alumno es: ' + this.listaAlumnosClasificacion[j].id);
                        const AlumnoId = this.listaAlumnosClasificacion[j].id;
                        // tslint:disable-next-line:prefer-for-of
                        for (let m = 0; m < this.alumnosJuegoDeCompeticionLiga.length; m++) {
                          if (this.alumnosJuegoDeCompeticionLiga[m].AlumnoId === AlumnoId) {
                            this.AlumnoJuegoDeCompeticionLigaId = this.alumnosJuegoDeCompeticionLiga[m].id;
                          }
                        }
                        const alumnoGanador = new AlumnoJuegoDeCompeticionLiga(AlumnoId,
                                                                               this.juegoSeleccionado.id,
                                                                               this.listaAlumnosClasificacion[j].puntos,
                                                                               this.AlumnoJuegoDeCompeticionLigaId);
                        console.log(alumnoGanador);
                        console.log('El id del alumno es: ' + alumnoGanador.AlumnoId + ' y los puntos son: '
                                    + alumnoGanador.PuntosTotalesAlumno);
                        this.peticionesAPI.PonPuntosAlumnoGanadorJuegoDeCompeticionLiga(alumnoGanador).
                        subscribe(res => console.log(res));
                      } else {
                        console.log('Este enfrentamiento ya tiene asignado un ganador: ');
                        console.log(this.EnfrentamientosJornadaSeleccionada[k]);
                      }
                    }
                  }

                }
              }
            }

            // ----------------------------------- EMPATE ------------------------------------- //
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.enfrentamientosSeleccionadosColumnaTres.length; i++) {
              let enfrentamientoEmpateRegistrado = false;
              // tslint:disable-next-line:prefer-for-of
              for (let j = 0; j < this.listaAlumnosClasificacion.length; j++) {
                const nombreCompleto = this.listaAlumnosClasificacion[j].nombre + ' ' + this.listaAlumnosClasificacion[j].primerApellido
                                     + ' ' + this.listaAlumnosClasificacion[j].segundoApellido;
                if (nombreCompleto === this.enfrentamientosSeleccionadosColumnaTres[i].nombreJugadorDos ||
                    nombreCompleto === this.enfrentamientosSeleccionadosColumnaTres[i].nombreJugadorUno) {
                  console.log('He encontrado el alumno: ' + this.enfrentamientosSeleccionadosColumnaTres[i].nombreJugadorDos);
                  console.log('Los puntos antes de registrar el partido ganado: ' + this.listaAlumnosClasificacion[j].puntos);

                  // Miramos en la base de datos si para este enfrentamiento ya se había seleccionado un ganador.
                  // Si ya estaba asignado que aparezca un mensaje avisando (Si da a aceptar se reasigna el ganador seleccionado, si da a
                  // cancelar no se sobreescribe en la base de datos, se queda tal cual)
                  // tslint:disable-next-line:prefer-for-of
                  for (let k = 0; k < this.EnfrentamientosJornadaSeleccionada.length; k++) {
                    // tslint:disable-next-line:max-line-length
                    if (this.EnfrentamientosJornadaSeleccionada[k].nombreJugadorUno === this.enfrentamientosSeleccionadosColumnaTres[i].nombreJugadorUno &&
                        // tslint:disable-next-line:max-line-length
                        this.EnfrentamientosJornadaSeleccionada[k].nombreJugadorDos === this.enfrentamientosSeleccionadosColumnaTres[i].nombreJugadorDos) {
                      console.log('Ya estoy en el el enfrentamiento que quiero');
                      // Ahora tengo que actualizar los dos AlumnoJuegoDeCompeticionLiga del enfrentamiento con los nuevos puntos
                      this.listaAlumnosClasificacion[j].puntos = this.listaAlumnosClasificacion[j].puntos + 1;
                      console.log('Los puntos actualizados después de registrar el partido ganado: '
                                  + this.listaAlumnosClasificacion[j].puntos);
                      console.log(this.listaAlumnosClasificacion[j]);
                      console.log('el id del alumno es: ' + this.listaAlumnosClasificacion[j].id);
                      const AlumnoId = this.listaAlumnosClasificacion[j].id;
                      // tslint:disable-next-line:prefer-for-of
                      for (let m = 0; m < this.alumnosJuegoDeCompeticionLiga.length; m++) {
                        if (this.alumnosJuegoDeCompeticionLiga[m].AlumnoId === AlumnoId) {
                          this.AlumnoJuegoDeCompeticionLigaId = this.alumnosJuegoDeCompeticionLiga[m].id;
                        }
                      }
                      const alumnoGanador = new AlumnoJuegoDeCompeticionLiga(AlumnoId,
                                                                             this.juegoSeleccionado.id,
                                                                             this.listaAlumnosClasificacion[j].puntos,
                                                                             this.AlumnoJuegoDeCompeticionLigaId);
                      console.log(alumnoGanador);
                      console.log('El id del alumno es: ' + alumnoGanador.AlumnoId + ' y los puntos son: '
                                  + alumnoGanador.PuntosTotalesAlumno);
                      this.peticionesAPI.PonPuntosAlumnoGanadorJuegoDeCompeticionLiga(alumnoGanador).
                      subscribe(res => console.log(res));
                      if (this.EnfrentamientosJornadaSeleccionada[k].Ganador === undefined) {
                        if (enfrentamientoEmpateRegistrado === false) {
                          // Después tengo que actualizar el ganador en EnfrentamientoLiga
                          enfrentamientoEmpateRegistrado = true;
                          this.EnfrentamientosJornadaSeleccionada[k].Ganador = 0;
                          console.log(this.EnfrentamientosJornadaSeleccionada[k]);
                          const enfrentamiento = new EnfrentamientoLiga(this.EnfrentamientosJornadaSeleccionada[k].id,
                                                                        this.EnfrentamientosJornadaSeleccionada[k].JugadorUno,
                                                                        this.EnfrentamientosJornadaSeleccionada[k].JugadorDos,
                                                                        this.EnfrentamientosJornadaSeleccionada[k].Ganador,
                                                                        // tslint:disable-next-line:max-line-length
                                                                        this.EnfrentamientosJornadaSeleccionada[k].JornadaDeCompeticionLigaId);
                          this.peticionesAPI.PonGanadorDelEnfrentamiento(enfrentamiento).
                          subscribe(res => console.log(res));
                        }
                      } else if (this.EnfrentamientosJornadaSeleccionada[k].Ganador === undefined) {
                        console.log('Este enfrentamiento ya tiene asignado un ganador: ');
                        console.log(this.EnfrentamientosJornadaSeleccionada[k]);
                      } else if (enfrentamientoEmpateRegistrado === true) {
                        console.log('El enfrentamiento se ha registrado cuando hemos porcesado el otro alumno del enfrentamiento');
                      }
                    }
                  }

                }
              }
            }
      }
      ///////////////////////////////////////////////////////   EQUIPOS   ////////////////////////////////////////////////////
    }  else {
        this.AsignarGanadorEquipos();
    }
  }

  AsignarGanadorAlumnos() {
    console.log('Estoy en AsignarGanadorAlumnos()');
    console.log(this.dataSourceTablaGanadorIndividual.data);
    // tslint:disable-next-line:prefer-for-of
    for ( let i = 0; i < this.dataSourceTablaGanadorIndividual.data.length; i++) {
      console.log('hola');
      if (this.selectionUno.isSelected(this.dataSourceTablaGanadorIndividual.data[i])) {
        console.log(this.dataSourceTablaGanadorIndividual.data[i]);
        console.log('Se ha seleccionado el jugadorUno como ganador');
      }
    }
  }

  AsignarGanadorEquipos() {
      console.log('Estoy en AsignarGanadorEquipos()');

      // -------- HACER UNA FUNCIÓN PARA REVISAR SI HAY MÁS DE UNA SELECCIÓN POR ENFRENTAMIETNO -------- //
      console.log('La lista de equipos ganadoresUno es:');
      console.log(this.enfrentamientosSeleccionadosColumnaUno);
      console.log('La lista de equipos ganadoresDos es:');
      console.log(this.enfrentamientosSeleccionadosColumnaDos);
      console.log('La lista de equipos ganadoresTres es:');
      console.log(this.enfrentamientosSeleccionadosColumnaTres);

      this.avisoMasDeUnGanadorMarcadoDosEmpate = false;
      this.avisoMasDeUnGanadorMarcadoUnoDos = false;
      this.avisoMasDeUnGanadorMarcadoUnoEmpate = false;

      // Segundo miramos si solo hay una selección por enfrentamiento
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.enfrentamientosSeleccionadosColumnaUno.length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.enfrentamientosSeleccionadosColumnaDos.length; j++) {
          if (this.enfrentamientosSeleccionadosColumnaUno[i].id === this.enfrentamientosSeleccionadosColumnaDos[j].id) {
            this.avisoMasDeUnGanadorMarcadoUnoDos = true;
            console.log('Hay alguna selección con ganadorUno y ganadorDos, poner el sweatalert');
            console.log(this.enfrentamientosSeleccionadosColumnaDos[j]);
            console.log(this.enfrentamientosSeleccionadosColumnaUno[i].id);
          }
        }
        // tslint:disable-next-line:prefer-for-of
        for (let k = 0; k < this.enfrentamientosSeleccionadosColumnaTres.length; k++) {
          if (this.enfrentamientosSeleccionadosColumnaUno[i].id === this.enfrentamientosSeleccionadosColumnaTres[k].id) {
            this.avisoMasDeUnGanadorMarcadoUnoEmpate = true;
            console.log('Hay alguna selección con ganadorUno y Empate, poner el sweatalert');
            console.log(this.enfrentamientosSeleccionadosColumnaUno[i]);
            console.log(this.enfrentamientosSeleccionadosColumnaTres[k].id);
          }
        }
      }

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.enfrentamientosSeleccionadosColumnaDos.length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.enfrentamientosSeleccionadosColumnaTres.length; j++) {
          if (this.enfrentamientosSeleccionadosColumnaDos[i].id === this.enfrentamientosSeleccionadosColumnaTres[j].id) {
            this.avisoMasDeUnGanadorMarcadoDosEmpate = true;
            console.log('Hay alguna selección con ganadorDos y Empate, poner sweatalert');
            console.log(this.enfrentamientosSeleccionadosColumnaDos[i]);
            console.log(this.enfrentamientosSeleccionadosColumnaTres[j].id);
          }
        }
      }

      // tslint:disable-next-line:max-line-length
      console.log('avisoMasDeUnGanadorMarcadoUnoEmpate: ' + this.avisoMasDeUnGanadorMarcadoUnoEmpate);
      console.log('avisoMasDeUnGanadorMarcadoDosEmpate: ' + this.avisoMasDeUnGanadorMarcadoDosEmpate);
      console.log('avisoMasDeUnGanadorMarcadoUnoDos: ' + this.avisoMasDeUnGanadorMarcadoUnoDos);
      // ----------------------------------------------------------------------------------------------------//

      if (this.avisoMasDeUnGanadorMarcadoDosEmpate === false && this.avisoMasDeUnGanadorMarcadoUnoDos === false
        && this.avisoMasDeUnGanadorMarcadoUnoEmpate === false) {

          console.log('Los enfrentamientos con selección en la columna uno son: ');
          console.log(this.enfrentamientosSeleccionadosColumnaUno);
          console.log('Los enfrentamientos con selección en la columna dos son: ');
          console.log(this.enfrentamientosSeleccionadosColumnaDos);
          console.log('Los enfrentamientos con selección en la columna tres son: ');
          console.log(this.enfrentamientosSeleccionadosColumnaTres);
          console.log('Los equipos de este juego son: ');
          console.log(this.equiposJuegoDeCompeticionLiga);
          console.log('La lista de los equipos de este juego son: ');
          console.log(this.listaEquiposClasificacion);

          if (this.enfrentamientosSeleccionadosColumnaUno.length > 0) {
            // GANADOR UNO
            console.log('Estoy en la condición de GANADOR UNO');
            this.calculos.AsignarPuntosGanadorEquipos(this.enfrentamientosSeleccionadosColumnaUno, this.listaEquiposClasificacion,
                                                      this.juegoSeleccionado, this.equiposJuegoDeCompeticionLiga, 1);
          }
          if (this.enfrentamientosSeleccionadosColumnaDos.length > 0) {
            // GANADOR DOS
            console.log('Estoy en la condición de GANADOR DOS');
            this.calculos.AsignarPuntosGanadorEquipos(this.enfrentamientosSeleccionadosColumnaDos, this.listaEquiposClasificacion,
                                                      this.juegoSeleccionado, this.equiposJuegoDeCompeticionLiga, 2);
          }
          if (this.enfrentamientosSeleccionadosColumnaTres.length > 0) {
            // EMPATE
            console.log('Estoy en la condición de EMPATE');
            this.calculos.AsignarPuntosGanadorEquipos(this.enfrentamientosSeleccionadosColumnaTres, this.listaEquiposClasificacion,
                                                      this.juegoSeleccionado, this.equiposJuegoDeCompeticionLiga, 3);
          }
        }

  }

  AddToListGanadorUno() {
    if (this.juegoSeleccionado.Modo === 'Individual') {
      // tslint:disable-next-line:prefer-for-of
      for ( let i = 0; i < this.dataSourceTablaGanadorIndividual.data.length; i++) {
        if (this.selectionUno.isSelected(this.dataSourceTablaGanadorIndividual.data[i]))  {
          const indexOfUnselected = this.enfrentamientosSeleccionadosColumnaUno.indexOf(this.dataSourceTablaGanadorIndividual.data[i]);
          if (indexOfUnselected === -1) {
            this.enfrentamientosSeleccionadosColumnaUno.push(this.dataSourceTablaGanadorIndividual.data[i]);
          } else {
            this.enfrentamientosSeleccionadosColumnaUno.splice(indexOfUnselected, 1);
          }
          this.selectionUno.deselect(this.dataSourceTablaGanadorIndividual.data[i]);
        }
      }
    } else {
      // tslint:disable-next-line:prefer-for-of
      for ( let j = 0; j < this.dataSourceTablaGanadorEquipo.data.length; j++) {
        if (this.selectionUno.isSelected(this.dataSourceTablaGanadorEquipo.data[j])) {
          const indexOfUnselected = this.enfrentamientosSeleccionadosColumnaUno.indexOf(this.dataSourceTablaGanadorEquipo.data[j]);
          if (indexOfUnselected === -1) {
            this.enfrentamientosSeleccionadosColumnaUno.push(this.dataSourceTablaGanadorEquipo.data[j]);
          } else {
            this.enfrentamientosSeleccionadosColumnaUno.splice(indexOfUnselected, 1);
          }
          this.selectionUno.deselect(this.dataSourceTablaGanadorEquipo.data[j]);
        }
      }
    }
  }

  AddToListGanadorDos() {
    if (this.juegoSeleccionado.Modo === 'Individual') {
      // tslint:disable-next-line:prefer-for-of
      for ( let i = 0; i < this.dataSourceTablaGanadorIndividual.data.length; i++) {
        if (this.selectionDos.isSelected(this.dataSourceTablaGanadorIndividual.data[i]))  {
          const indexOfUnselected = this.enfrentamientosSeleccionadosColumnaDos.indexOf(this.dataSourceTablaGanadorIndividual.data[i]);
          if (indexOfUnselected === -1) {
            this.enfrentamientosSeleccionadosColumnaDos.push(this.dataSourceTablaGanadorIndividual.data[i]);
          } else {
            this.enfrentamientosSeleccionadosColumnaDos.splice(indexOfUnselected, 1);
          }
          this.selectionDos.deselect(this.dataSourceTablaGanadorIndividual.data[i]);
        }
      }
    } else {
      // tslint:disable-next-line:prefer-for-of
      for ( let i = 0; i < this.dataSourceTablaGanadorEquipo.data.length; i++) {
        if (this.selectionDos.isSelected(this.dataSourceTablaGanadorEquipo.data[i]))  {
          const indexOfUnselected = this.enfrentamientosSeleccionadosColumnaDos.indexOf(this.dataSourceTablaGanadorEquipo.data[i]);
          if (indexOfUnselected === -1) {
            this.enfrentamientosSeleccionadosColumnaDos.push(this.dataSourceTablaGanadorEquipo.data[i]);
          } else {
            this.enfrentamientosSeleccionadosColumnaDos.splice(indexOfUnselected, 1);
          }
          this.selectionDos.deselect(this.dataSourceTablaGanadorEquipo.data[i]);
        }
      }
    }
  }

  AddToListGanadorTres() {
    if (this.juegoSeleccionado.Modo === 'Individual') {
      // tslint:disable-next-line:prefer-for-of
      for ( let i = 0; i < this.dataSourceTablaGanadorIndividual.data.length; i++) {
        if (this.selectionTres.isSelected(this.dataSourceTablaGanadorIndividual.data[i]))  {
          const indexOfUnselected = this.enfrentamientosSeleccionadosColumnaTres.indexOf(this.dataSourceTablaGanadorIndividual.data[i]);
          if (indexOfUnselected === -1) {
            this.enfrentamientosSeleccionadosColumnaTres.push(this.dataSourceTablaGanadorIndividual.data[i]);
          } else {
            this.enfrentamientosSeleccionadosColumnaTres.splice(indexOfUnselected, 1);
          }
          this.selectionTres.deselect(this.dataSourceTablaGanadorIndividual.data[i]);
        }
      }
    } else {
      // tslint:disable-next-line:prefer-for-of
      for ( let i = 0; i < this.dataSourceTablaGanadorEquipo.data.length; i++) {
        if (this.selectionTres.isSelected(this.dataSourceTablaGanadorEquipo.data[i]))  {
          const indexOfUnselected = this.enfrentamientosSeleccionadosColumnaTres.indexOf(this.dataSourceTablaGanadorEquipo.data[i]);
          if (indexOfUnselected === -1) {
            this.enfrentamientosSeleccionadosColumnaTres.push(this.dataSourceTablaGanadorEquipo.data[i]);
          } else {
            this.enfrentamientosSeleccionadosColumnaTres.splice(indexOfUnselected, 1);
          }
          this.selectionTres.deselect(this.dataSourceTablaGanadorEquipo.data[i]);
        }
      }
    }
  }


  /* Para averiguar si todas las filas están seleccionadas */
  IsAllSelectedUno() {
    // console.log('Estoy en IsAllSelectedUno()');
    const numSelected = this.selectionUno.selected.length;
    const numRows = this.dataSourceTablaGanadorIndividual.data.length;
    // console.log('this.selectionUno es:');
    // console.log(this.selectionUno);
    return numSelected === numRows;
  }

  /* Cuando se clica en el checkbox de cabecera hay que ver si todos los
    * checkbox estan acivados, en cuyo caso se desactivan todos, o si hay alguno
    * desactivado, en cuyo caso se activan todos */

  MasterToggleUno() {
    if (this.IsAllSelectedUno()) {
      this.selectionUno.clear(); // Desactivamos todos
    } else {
      // activamos todos
      this.dataSourceTablaGanadorIndividual.data.forEach(row => this.selectionUno.select(row));
    }
  }

  IsAllSelectedDos() {
    // console.log('Estoy en IsAllSelectedDos()');
    const numSelected = this.selectionDos.selected.length;
    const numRows = this.dataSourceTablaGanadorIndividual.data.length;
    // console.log('this.selectionDos es:');
    // console.log(this.selectionDos);
    return numSelected === numRows;
  }

  /* Cuando se clica en el checkbox de cabecera hay que ver si todos los
    * checkbox estan acivados, en cuyo caso se desactivan todos, o si hay alguno
    * desactivado, en cuyo caso se activan todos */

  MasterToggleDos() {
    if (this.IsAllSelectedDos()) {
      this.selectionDos.clear(); // Desactivamos todos
    } else {
      // activamos todos
      this.dataSourceTablaGanadorIndividual.data.forEach(row => this.selectionDos.select(row));
    }
  }

  /* Para averiguar si todas las filas están seleccionadas */
  IsAllSelectedTres() {
    // console.log('Estoy en IsAllSelectedTres()');
    const numSelected = this.selectionTres.selected.length;
    const numRows = this.dataSourceTablaGanadorIndividual.data.length;
    // console.log('this.selectionTres es:');
    // console.log(this.selectionTres);
    return numSelected === numRows;
  }

  /* Cuando se clica en el checkbox de cabecera hay que ver si todos los
    * checkbox estan acivados, en cuyo caso se desactivan todos, o si hay alguno
    * desactivado, en cuyo caso se activan todos */

  MasterToggleTres() {
    if (this.IsAllSelectedTres()) {
      this.selectionTres.clear(); // Desactivamos todos
    } else {
      // activamos todos
      this.dataSourceTablaGanadorIndividual.data.forEach(row => this.selectionTres.select(row));
    }
  }


  goBack() {
    this.location.back();
  }

}

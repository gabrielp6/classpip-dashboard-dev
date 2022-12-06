import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

// Clases
import { Juego, Jornada,Alumno,Equipo,  EnfrentamientoTorneo, TablaJornadas, AlumnoJuegoDeCompeticionTorneo, EquipoJuegoDeCompeticionTorneo} from '../../../../clases/index';

// Servicio
import { SesionService , CalculosService, PeticionesAPIService } from '../../../../servicios/index';
import { MatTableDataSource } from '@angular/material';
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: 'app-informacion-juego-de-competicion-torneo',
  templateUrl: './informacion-juego-de-competicion-torneo.component.html',
  styleUrls: ['./informacion-juego-de-competicion-torneo.component.scss']
})
export class InformacionJuegoDeCompeticionTorneoComponent implements OnInit {

  // Juego De CompeticionTorneo seleccionado
  juegoSeleccionado: Juego;
  numeroTotalJornadas: number;
  jornadasDelJuego: Jornada[];
  JornadasCompeticion: TablaJornadas[] = [];
  jornadas: Jornada[];
  // Información de la tabla: Muestra el JugadorUno, JugadorDos, Ganador, JornadaDeCompeticionTorneoId y id
  EnfrentamientosJornadaSeleccionada: EnfrentamientoTorneo[] = [];

  juegosActivosPuntos: Juego[] = [];

  // Columnas Tabla
  displayedColumnsEnfrentamientos: string[] = ['nombreJugadorUno', 'nombreJugadorDos', 'nombreGanador'];

  listaAlumnos: Alumno[] = [];
  listaEquipos: Equipo[] = [];
  dataSourceEnfrentamientoIndividual;
  dataSourceEnfrentamientoEquipo;

  botonResultadosDesactivado: boolean;

  constructor( public sesion: SesionService,
               public location: Location,
               public calculos: CalculosService,
               public peticionesAPI: PeticionesAPIService) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log('Juego seleccionado: ');
    console.log(this.juegoSeleccionado);
    const datos = this.sesion.DameDatosJornadas();
    this.JornadasCompeticion = datos.JornadasCompeticion;
    this.jornadas = datos.jornadas;
    console.log( this.jornadas);
    this.numeroTotalJornadas = this.jornadas.length;
    console.log('Número total de jornadas: ');
    console.log( this.numeroTotalJornadas);
    console.log('Jornadas Competicion: ');
    // Teniendo la tabla de Jornadas puedo sacar los enfrentamientos de cada jornada accediendo a la api
    console.log(this.JornadasCompeticion);
    this.listaAlumnos = this.sesion.DameAlumnoJuegoDeCompeticionTorneo();
    console.log(this.listaAlumnos);
    this.listaEquipos = this.sesion.DameEquipoJuegoDeCompeticionTorneo();
    
  }

  ObtenerEnfrentamientosDeCadaJornada(jornadaSeleccionada: TablaJornadas) {
    console.log('El id de la jornada seleccionada es: ' + jornadaSeleccionada.id);
    this.peticionesAPI.DameEnfrentamientosDeCadaJornadaTorneo(jornadaSeleccionada.id)
    .subscribe(enfrentamientos => {
      this.EnfrentamientosJornadaSeleccionada = enfrentamientos;
      console.log('Los enfrentamientos de esta jornada son: ');
      console.log(this.EnfrentamientosJornadaSeleccionada);
      console.log('Ya tengo los enfrentamientos de la jornada, ahora tengo que mostrarlos en una tabla');
      this.ConstruirTablaEnfrentamientos();
    });
  }

  ConstruirTablaEnfrentamientos() {
    console.log ('Aquí tendré la tabla de enfrentamientos, los enfrentamientos son:');
    console.log(this.EnfrentamientosJornadaSeleccionada);
    console.log('Distinción entre Individual y equipos');
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.EnfrentamientosJornadaSeleccionada = this.calculos.ConstruirTablaEnfrentamientosTorneo(this.EnfrentamientosJornadaSeleccionada,
                                                                                            this.listaAlumnos,
                                                                                            this.listaEquipos,
                                                                                            this.juegoSeleccionado);
      this.dataSourceEnfrentamientoIndividual = new MatTableDataSource(this.EnfrentamientosJornadaSeleccionada);
      console.log('La tabla de enfrentamientos individual queda: ');
      console.log(this.dataSourceEnfrentamientoIndividual.data);

    } else {
      this.EnfrentamientosJornadaSeleccionada = this.calculos.ConstruirTablaEnfrentamientosTorneo(this.EnfrentamientosJornadaSeleccionada,
                                                                                            this.listaAlumnos,
                                                                                            this.listaEquipos,
                                                                                            this.juegoSeleccionado);
      this.dataSourceEnfrentamientoEquipo = new MatTableDataSource(this.EnfrentamientosJornadaSeleccionada);
      console.log('La tabla de enfrentamientos por equipos queda: ');
      console.log(this.dataSourceEnfrentamientoEquipo.data);

    }
  }

  JornadaFinalizada(jornadaSeleccionada: TablaJornadas) {
    const jornadaFinalizada = this.calculos.JornadaFinalizada(this.juegoSeleccionado, jornadaSeleccionada);
    if (jornadaFinalizada === true) {
      this.botonResultadosDesactivado = true;
    } else {
      this.botonResultadosDesactivado = false;
    }
    return jornadaFinalizada;
  }

  goBack() {
    this.location.back();
  }

}

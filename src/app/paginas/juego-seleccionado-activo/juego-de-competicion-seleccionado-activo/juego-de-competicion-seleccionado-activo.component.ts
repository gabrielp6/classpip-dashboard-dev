import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
// Clases
import { Alumno, Equipo, Juego, TablaJornadas, AlumnoJuegoDeCompeticionLiga, EquipoJuegoDeCompeticionLiga,
         TablaAlumnoJuegoDeCompeticion, TablaEquipoJuegoDeCompeticion, Jornada, EnfrentamientoLiga } from '../../../clases/index';

// Servicio
import { SesionService, PeticionesAPIService, CalculosService, ComServerService } from '../../../servicios/index';

// Imports para abrir diálogo y swal
import { MatDialog } from '@angular/material';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';
import { desactivarJuego } from '../../ventana-activar-desactivar/activarDesactivarJuego';


@Component({
  selector: 'app-juego-de-competicion-seleccionado-activo',
  templateUrl: './juego-de-competicion-seleccionado-activo.component.html',
  styleUrls: ['./juego-de-competicion-seleccionado-activo.component.scss']
})
export class JuegoDeCompeticionSeleccionadoActivoComponent implements OnInit {

  // Juego De CompeticionLiga seleccionado
  juegoSeleccionado: Juego;

  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres desactivar el ';
  // Recupera la informacion del juego, los alumnos o los equipos del juego
  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];
  alumnosDelEquipo: Alumno[];

  // Recoge la inscripción de un alumno en el juego ordenada por puntos
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionLiga[];
  listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionLiga[];

  // Muestra la posición del alumno, el nombre y los apellidos del alumno y los puntos
  rankingAlumnoJuegoDeCompeticion: TablaAlumnoJuegoDeCompeticion[] = [];
  rankingEquiposJuegoDeCompeticion: TablaEquipoJuegoDeCompeticion[] = [];

  // Columnas Tabla
  // displayedColumnsAlumnos: string[] = ['posicion', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'partidosTotales',
  //                                      'partidosJugados', 'partidosGanados', 'partidosEmpatados', 'partidosPerdidos', 'puntos', ' '];
  displayedColumnsAlumnos: string[] = ['posicion', 'nombreAlumno', 'partidosTotales',
                                       // tslint:disable-next-line:max-line-length
                                       'partidosJugados', 'partidosGanados', 'partidosEmpatados', 'partidosPerdidos', 'puntos', ' '];
  displayedColumnsEquipos: string[] = ['posicion', 'nombreEquipo', 'miembros', 'partidosTotales', 'partidosJugados',
                                       'partidosGanados', 'partidosEmpatados', 'partidosPerdidos', 'puntos', ' '];

  datasourceAlumno;
  datasourceEquipo;

  jornadas: Jornada[];
  JornadasCompeticion: TablaJornadas[] = [];
  // enfrentamientosDelJuego: EnfrentamientoLiga[] = [];
  enfrentamientosDelJuego: Array<Array<EnfrentamientoLiga>>;
  juegosPuntos: Juego[] = [];
  juegosCuestionariosTerminados: Juego[] = [];
  juegosDeVotacionUnoATodosTerminados: any[] = [];

  constructor(  public dialog: MatDialog,
                public sesion: SesionService,
                public peticionesAPI: PeticionesAPIService,
                public calculos: CalculosService,
                private location: Location,
                private comServerService: ComServerService) {}

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log ('juego de liga que estamos probando');
    console.log(this.juegoSeleccionado);
    this.DameJornadasDelJuegoDeCompeticionSeleccionado();
    this.DameJuegosDePuntos();
    this.DameJuegosDeCuestionariosAcabados();
    this.DameJuegosdeVotacionUnoATodosAcabados();
  }


  DameJornadasDelJuegoDeCompeticionSeleccionado() {
    console.log ('voy a por las jornadas');
    this.peticionesAPI.DameJornadasDeCompeticionLiga(this.juegoSeleccionado.id)
      .subscribe(inscripciones => {
        this.jornadas = inscripciones;
        console.log('Las jornadas son: ');
        console.log(this.jornadas);
        console.log('Vamos a por los enfrentamientos de cada jornada');
        this.DameEnfrentamientosDelJuego();
      });
  }

  DameEnfrentamientosDelJuego() {
    console.log('Estoy en DameEnfrentamientosDeLasJornadas()');
    let jornadasCounter = 0;
    this.enfrentamientosDelJuego = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.jornadas.length; i++) {
      console.log ('siguiente jornada');
      this.enfrentamientosDelJuego[i] = [];
      this.peticionesAPI.DameEnfrentamientosDeCadaJornadaLiga(this.jornadas[i].id)
      .subscribe((enfrentamientosDeLaJornada: Array<EnfrentamientoLiga>) => {
        jornadasCounter++;
        console.log('Los enfrentamiendos de la jornadaId ' + this.jornadas[i].id + ' son: ');
        console.log(enfrentamientosDeLaJornada);
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < enfrentamientosDeLaJornada.length; j++) {
          this.enfrentamientosDelJuego[i][j] = new EnfrentamientoLiga();
          this.enfrentamientosDelJuego[i][j] = enfrentamientosDeLaJornada[j];
        }
        if (jornadasCounter === this.jornadas.length) {
          console.log('La lista final de enfrentamientos del juego es: ');
          console.log(this.enfrentamientosDelJuego);
          if (this.juegoSeleccionado.Modo === 'Individual') {
            this.AlumnosDelJuego();
          } else {
            this.EquiposDelJuego();
          }
        }
      });
    }
  }

  AlumnosDelJuego() {
    console.log ('Vamos a por los alumnos');
    console.log('Id juegoSeleccionado: ' + this.juegoSeleccionado.id);
    this.peticionesAPI.DameAlumnosJuegoDeCompeticionLiga(this.juegoSeleccionado.id)
    .subscribe(alumnosJuego => {
      console.log ('Ya tengo los alumnos: ' );
      console.log (alumnosJuego);
      this.alumnosDelJuego = alumnosJuego;
      this.RecuperarInscripcionesAlumnoJuego();
    });
  }

  EquiposDelJuego() {
    console.log ('Vamos a por los equipos');
    console.log('Id juegoSeleccionado: ' + this.juegoSeleccionado.id);
    this.peticionesAPI.DameEquiposJuegoDeCompeticionLiga(this.juegoSeleccionado.id)
    .subscribe(equiposJuego => {
      console.log ('ya tengo los equipos');
      console.log (equiposJuego);
      this.equiposDelJuego = equiposJuego;
      this.RecuperarInscripcionesEquiposJuego();
    });
  }

  AlumnosDelEquipo(equipo: Equipo) {
    console.log(equipo);

    this.peticionesAPI.DameAlumnosEquipo (equipo.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.alumnosDelEquipo = res;
        console.log('Los alumnos del equipo ' + equipo.id + ' son: ');
        console.log(res);
      } else {
        console.log('No hay alumnos en este equipo');
        // Informar al usuario
        this.alumnosDelEquipo = undefined;
      }
    });
  }

  AccederAlumno(alumno: TablaAlumnoJuegoDeCompeticion) {

    const alumnoSeleccionado = this.alumnosDelJuego.filter(res => res.Nombre === alumno.nombre &&
      res.PrimerApellido === alumno.primerApellido && res.SegundoApellido === alumno.segundoApellido)[0];

    const posicion = this.rankingAlumnoJuegoDeCompeticion.filter(res => res.nombre === alumno.nombre &&
      res.primerApellido === alumno.primerApellido && res.segundoApellido === alumno.segundoApellido)[0].posicion;

      // Informacion que se necesitara para ver la evolución del alumno, faltará la función DameDatosEvolucionAlumno..
    this.sesion.TomaDatosEvolucionAlumnoJuegoCompeticionLiga (
      posicion,
      alumnoSeleccionado,
      this.listaAlumnosOrdenadaPorPuntos.filter(res => res.AlumnoId === alumnoSeleccionado.id)[0]
    );
  }

  // Recupera los AlumnoJuegoDeCompeticionLiga del juegoSeleccionado.id ordenados por puntos de mayor a menor
  RecuperarInscripcionesAlumnoJuego() {
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCompeticionLiga(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntos = inscripciones;
      console.log ('AlumnosJuegoDeCompeticionLiga: ');
      console.log (this.listaAlumnosOrdenadaPorPuntos);
      // ordena la lista por puntos
      // tslint:disable-next-line:only-arrow-functions
      this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
        console.log (obj2.PuntosTotalesAlumno + ' ; ' + obj1.PuntosTotalesAlumno);
        return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
      });
      console.log(this.listaAlumnosOrdenadaPorPuntos);
      this.TablaClasificacionTotal();
    });
  }

  // Recupera los EquipoJuegoDeCompeticionLiga del juegoSeleccionado.id ordenados por puntos de mayor a menor
  RecuperarInscripcionesEquiposJuego() {
    this.peticionesAPI.DameInscripcionesEquipoJuegoDeCompeticionLiga(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaEquiposOrdenadaPorPuntos = inscripciones;
      // ordena la lista por puntos
      // tslint:disable-next-line:only-arrow-functions
      this.listaEquiposOrdenadaPorPuntos = this.listaEquiposOrdenadaPorPuntos.sort(function(obj1, obj2) {
        console.log (obj2.PuntosTotalesEquipo + ' ; ' + obj1.PuntosTotalesEquipo);
        return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
      });
      console.log(this.listaEquiposOrdenadaPorPuntos);
      this.TablaClasificacionTotal();
    });
  }

  // En función del modo (Individual/Equipos), recorremos la lisa de Alumnos o de Equipos y vamos rellenando el rankingJuegoDePuntos
  // ESTO DEBERIA IR AL SERVICIO DE CALCULO, PERO DE MOMENTO NO LO HAGO PORQUE SE GENERAN DOS TABLAS
  // Y NO COMPRENDO BIEN LA NECESIDAD DE LAS DOS

  TablaClasificacionTotal() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.rankingAlumnoJuegoDeCompeticion = this.calculos.PrepararTablaRankingIndividualLiga (this.listaAlumnosOrdenadaPorPuntos,
                                                                                               this.alumnosDelJuego, this.jornadas,
                                                                                               this.enfrentamientosDelJuego);
      console.log ('Estoy en TablaClasificacionTotal(), la tabla que recibo desde calculos es:');
      console.log (this.rankingAlumnoJuegoDeCompeticion);
      this.datasourceAlumno = new MatTableDataSource(this.rankingAlumnoJuegoDeCompeticion);

    } else {
      this.rankingEquiposJuegoDeCompeticion = this.calculos.PrepararTablaRankingEquipoLiga (this.listaEquiposOrdenadaPorPuntos,
                                                                                            this.equiposDelJuego, this.jornadas,
                                                                                            this.enfrentamientosDelJuego);
      this.datasourceEquipo = new MatTableDataSource(this.rankingEquiposJuegoDeCompeticion);
      console.log('Estoy en TablaClasificacionTotal(), la tabla que recibo desde calculos es:');
      console.log (this.rankingEquiposJuegoDeCompeticion);
    }
  }

  applyFilter(filterValue: string) {
    this.datasourceAlumno.filter = filterValue.trim().toLowerCase();
  }

  applyFilterEquipo(filterValue: string) {
    this.datasourceEquipo.filter = filterValue.trim().toLowerCase();
  }

  editarjornadas() {

    console.log('Tomo las jornadas' + this.jornadas);
    console.log ('Aquí estará la información del juego');
    this.sesion.TomaJuego (this.juegoSeleccionado);
    this.JornadasCompeticion = this.calculos.GenerarTablaJornadasLiga(this.juegoSeleccionado, this.jornadas, this.enfrentamientosDelJuego);
    console.log('Juego activo' + this.JornadasCompeticion);
    this.sesion.TomaDatosJornadas(
      this.jornadas,
      this.JornadasCompeticion);
  }


    
  Desactivar() {
    desactivarJuego().then((result) => {
      if (result.value) {
        this.juegoSeleccionado.JuegoActivo = false;
        this.peticionesAPI.CambiaEstadoJuegoDeCompeticionLiga (this.juegoSeleccionado)
        .subscribe(res => {
            if (res !== undefined) {
              this.comServerService.enviarInfoGrupoJuegoStatus(this.juegoSeleccionado.grupoId)
              Swal.fire('El juego se ha desactivado correctamente');
              this.location.back();
            }
        });
      }
    });
  }
  // DesactivarJuego() {
  //   console.log(this.juegoSeleccionado);
  //   this.peticionesAPI.CambiaEstadoJuegoDeCompeticionLiga(new Juego (this.juegoSeleccionado.Tipo, this.juegoSeleccionado.Modo,
  //     this.juegoSeleccionado.Asignacion,
  //     undefined, false, this.juegoSeleccionado.NumeroTotalJornadas, this.juegoSeleccionado.TipoJuegoCompeticion,
  //     this.juegoSeleccionado.NumeroParticipantesPuntuan, this.juegoSeleccionado.Puntos, this.juegoSeleccionado.NombreJuego),
  //     this.juegoSeleccionado.id, this.juegoSeleccionado.grupoId).subscribe(res => {
  //       if (res !== undefined) {
  //         console.log(res);
  //         console.log('juego desactivado');
  //         this.location.back();
  //       }
  //     });
  // }

  // AbrirDialogoConfirmacionDesactivar(): void {

  //   Swal.fire({
  //     title: 'Desactivar',
  //     text: "Estas segura/o de que quieres desactivar: " + this.juegoSeleccionado.Tipo,
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Aceptar',
  //     cancelButtonText: 'Cancelar'

  //   }).then((result) => {
  //     if (result.value) {
  //       this.DesactivarJuego();
  //       Swal.fire('Desactivado', this.juegoSeleccionado.Tipo + ' Desactivado correctamente', 'success');
  //     }
  //   })
  // }

  Informacion(): void {

    console.log ('Aquí estará la información del juego');
    console.log ('Voy a por la información del juego seleccionado');
    this.sesion.TomaJuego (this.juegoSeleccionado);
    console.log('Tomo las jornadas' + this.jornadas);
    console.log('Los enfrentamientos del juego son: ');
    console.log(this.enfrentamientosDelJuego);
    this.JornadasCompeticion = this.calculos.GenerarTablaJornadasLiga(this.juegoSeleccionado, this.jornadas, this.enfrentamientosDelJuego);
    console.log('Las tablas JornadasCompeticionLiga son: ');
    console.log(this.JornadasCompeticion);
    console.log ('Voy a por la información de las jornadas del juego');
    this.sesion.TomaDatosJornadas(this.jornadas,
                                      this.JornadasCompeticion);
    this.sesion.TomaTablaAlumnoJuegoDeCompeticion(this.rankingAlumnoJuegoDeCompeticion);
    this.sesion.TomaTablaEquipoJuegoDeCompeticion(this.rankingEquiposJuegoDeCompeticion);
  }

  seleccionarGanadorLiga(): void {
    console.log('Aquí estará el proceso para elegir el ganador');
    console.log ('Voy a por la información del juego seleccionado');
    this.sesion.TomaJuego (this.juegoSeleccionado);
    console.log('Tomo las jornadas' + this.jornadas);
    this.JornadasCompeticion = this.calculos.GenerarTablaJornadasLiga( this.juegoSeleccionado, this.jornadas, this.enfrentamientosDelJuego);
    console.log ('Voy a por la información de las jornadas del juego');
    this.sesion.TomaDatosJornadas(this.jornadas,
                                  this.JornadasCompeticion);
    this.sesion.TomaTablaAlumnoJuegoDeCompeticion(this.rankingAlumnoJuegoDeCompeticion);
    this.sesion.TomaTablaEquipoJuegoDeCompeticion(this.rankingEquiposJuegoDeCompeticion);
    this.sesion.TomaInscripcionAlumno(this.listaAlumnosOrdenadaPorPuntos);
    this.sesion.TomaInscripcionEquipo(this.listaEquiposOrdenadaPorPuntos);
    this.sesion.TomaJuegosDePuntos(this.juegosPuntos);
    this.sesion.TomaJuegosDeCuestionario (this.juegosCuestionariosTerminados);
    this.sesion.TomaJuegosDeVotacionUnoATodos (this.juegosDeVotacionUnoATodosTerminados);
  }


  DameJuegosDePuntos() {
    this.peticionesAPI.DameJuegoDePuntosGrupo(this.juegoSeleccionado.grupoId)
    .subscribe(juegosPuntos => {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < juegosPuntos.length; i++) {
          this.juegosPuntos.push(juegosPuntos[i]);
      }
    });

  }

  DameJuegosDeCuestionariosAcabados() {
    console.log ('vamos a por los juegos de cuestionarios del grupo ' + this.juegoSeleccionado.grupoId);
    this.peticionesAPI.DameJuegoDeCuestionario(this.juegoSeleccionado.grupoId)
    .subscribe(juegosCuestionarios => {
      console.log ('Ya tengo los juegos cuestionarios');
      console.log (juegosCuestionarios);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < juegosCuestionarios.length; i++) {
        if (juegosCuestionarios[i].JuegoTerminado === true) {
          this.juegosCuestionariosTerminados.push(juegosCuestionarios[i]);
        }
      }
      console.log('Juegos de cuestionario disponibles');
      console.log(this.juegosCuestionariosTerminados);
    });
  }

  DameJuegosdeVotacionUnoATodosAcabados() {
    console.log ('vamos a por los juegos de votacion Uno A Todos ' + this.juegoSeleccionado.grupoId);
    this.peticionesAPI.DameJuegosDeVotacionUnoATodos(this.juegoSeleccionado.grupoId)
    .subscribe(juegos => {
      console.log ('Ya tengo los juegos de votacion Uno A Todos');
      console.log (juegos);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < juegos.length; i++) {
        if (juegos[i].JuegoActivo === false) {
          this.juegosDeVotacionUnoATodosTerminados.push(juegos[i]);
        }
      }
      console.log('Juegos de  votacion Uno A Todos disponibles');
      console.log(this.juegosDeVotacionUnoATodosTerminados);
    });


  }

  // const jornadaFinalizada = this.calculos.JornadaFinalizada(this.juegoSeleccionado, jornadaSeleccionada);
// La uso para señalar en la clasificacion general al ganador cuando la competición ha finalizado

CompeticionFinalizada(): boolean {
      // tslint:disable-next-line:max-line-length
      this.JornadasCompeticion = this.calculos.GenerarTablaJornadasLiga(this.juegoSeleccionado, this.jornadas, this.enfrentamientosDelJuego);
  // tslint:disable-next-line:no-inferrable-types
      let finalizada: boolean = true;
      this.JornadasCompeticion.forEach (jornada => {
                console.log (jornada);
                if (!this.calculos.JornadaFinalizada (this.juegoSeleccionado, jornada)) {
                  console.log ('La jornada ' + jornada.id + 'no se ha disputado');
                  finalizada = false;
                }
      });
      return finalizada;
  }

}

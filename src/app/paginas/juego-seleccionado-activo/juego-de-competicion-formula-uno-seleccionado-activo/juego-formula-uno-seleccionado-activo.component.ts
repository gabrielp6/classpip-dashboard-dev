import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';

// Clases
import {Juego, Alumno, Equipo, AlumnoJuegoDeCompeticionFormulaUno, Jornada, TablaJornadas,
        EquipoJuegoDeCompeticionFormulaUno, TablaAlumnoJuegoDeCompeticion, TablaEquipoJuegoDeCompeticion,
        TablaPuntosFormulaUno} from '../../../clases/index';

// Servicio
import { SesionService, PeticionesAPIService, CalculosService, ComServerService } from '../../../servicios/index';

// Imports para abrir diálogo y swal
import { MatDialog } from '@angular/material';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';
import { desactivarJuego } from '../../ventana-activar-desactivar/activarDesactivarJuego';

@Component({
  selector: 'app-juego-formula-uno-seleccionado-activo',
  templateUrl: './juego-formula-uno-seleccionado-activo.component.html',
  styleUrls: ['./juego-formula-uno-seleccionado-activo.component.scss']
})
export class JuegoDeCompeticionFormulaUnoSeleccionadoActivoComponent implements OnInit {
  // Juego De Competicion Formula Uno seleccionado
  juegoSeleccionado: Juego;

  // Recupera la informacion del juego, los alumnos o los equipos
  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];

  alumnosDelEquipo: Alumno[];

  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionFormulaUno[];
  listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionFormulaUno[];

  rankingIndividualFormulaUno: TablaAlumnoJuegoDeCompeticion[] = [];
  rankingEquiposFormulaUno: TablaEquipoJuegoDeCompeticion[] = [];

  jornadas: Jornada[];
  JornadasCompeticion: TablaJornadas[];
  TablaeditarPuntos: TablaPuntosFormulaUno[];

  juegosPuntos: Juego[] = [];
  juegosCuestionariosTerminados: Juego[] = [];
  juegosDeVotacionUnoATodosTerminados: any[] = [];
  juegosDeEvaluacionTerminados: any[] = [];
  botoneditarPuntosDesactivado = true;
  datasourceAlumno;
  datasourceEquipo;

  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres desactivar el ';

  displayedColumnsAlumnos: string[] = ['posicion', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'puntos', ' '];

  displayedColumnsEquipos: string[] = ['posicion', 'nombreEquipo', 'miembros', 'puntos', ' '];

  constructor(public dialog: MatDialog,
              public sesion: SesionService,
              public peticionesAPI: PeticionesAPIService,
              public calculos: CalculosService,
              private location: Location,
              public comServerService: ComServerService) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log(this.juegoSeleccionado);

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.AlumnosDelJuego();
    } else {
      this.EquiposDelJuego();
    }
    this.DameJornadasDelJuegoDeCompeticionSeleccionado();
    this.DameJuegosdePuntos();
    this.DameJuegosdeCuestionariosAcabados();
    this.DameJuegosdeVotacionUnoATodosAcabados();
    this.DameJuegosdeEvaluacionAcabados();
  }

  // Recupera los alumnos que pertenecen al juego
  AlumnosDelJuego() {
    console.log ('Vamos a pos los alumnos');
    this.peticionesAPI.DameAlumnosJuegoDeCompeticionFormulaUno(this.juegoSeleccionado.id)
    .subscribe(alumnosJuego => {
      console.log ('Ya tengo los alumnos');
      console.log(alumnosJuego);
      this.alumnosDelJuego = alumnosJuego;
      this.RecuperarInscripcionesAlumnoJuego();
    });
  }

  // Recupera los equipos que pertenecen al juego
  EquiposDelJuego() {
    console.log ('Vamos a pos los equipos');
    this.peticionesAPI.DameEquiposJuegoDeCompeticionFormulaUno(this.juegoSeleccionado.id)
    .subscribe(equiposJuego => {
      console.log ('ya tengo los equipos');
      this.equiposDelJuego = equiposJuego;
      this.RecuperarInscripcionesEquiposJuego();
    });
  }

  RecuperarInscripcionesAlumnoJuego() {
    console.log ('vamos por las inscripciones ' + this.juegoSeleccionado.id);
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCompeticionFormulaUno(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntos = inscripciones;
      // ordena la lista por puntos
      // tslint:disable-next-line:only-arrow-functions
      this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
        return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
      });
      console.log ('ya tengo las inscripciones: ');
      this.TablaClasificacionTotal();
    });
  }

  RecuperarInscripcionesEquiposJuego() {
    console.log ('vamos por las inscripciones ' + this.juegoSeleccionado.id);
    this.peticionesAPI.DameInscripcionesEquipoJuegoDeCompeticionFormulaUno(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaEquiposOrdenadaPorPuntos = inscripciones;
      console.log(this.listaEquiposOrdenadaPorPuntos);

      // ordenamos por puntos
      // tslint:disable-next-line:only-arrow-functions
      this.listaEquiposOrdenadaPorPuntos = this.listaEquiposOrdenadaPorPuntos.sort(function(obj1, obj2) {
        return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
      });
      console.log ('ya tengo las inscripciones');
      this.TablaClasificacionTotal();
    });
  }

  // La uso para señalar en la clasificacion general al ganador cuando la competición ha finalizado

  CompeticionFinalizada(): boolean {
  // tslint:disable-next-line:no-inferrable-types
      let finalizada: boolean = true;
      this.jornadas.forEach (jornada => {
                if (!this.calculos.JornadaF1TieneGanadores (jornada.id, this.jornadas)) {
                  finalizada = false;
                }
      });
      return finalizada;
  }

  TablaClasificacionTotal() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.rankingIndividualFormulaUno = this.calculos.PrepararTablaRankingIndividualFormulaUno (this.listaAlumnosOrdenadaPorPuntos,
                                                                                                 this.alumnosDelJuego);
      this.datasourceAlumno = new MatTableDataSource(this.rankingIndividualFormulaUno);
      console.log ('Ya tengo la tabla');
      console.log(this.datasourceAlumno.data);

    } else {

      this.rankingEquiposFormulaUno = this.calculos.PrepararTablaRankingEquipoFormulaUno (this.listaEquiposOrdenadaPorPuntos,
                                                                                          this.equiposDelJuego);
      this.datasourceEquipo = new MatTableDataSource(this.rankingEquiposFormulaUno);
      console.log('Ya tengo la tabla');
      console.log(this.datasourceEquipo);

    }
    this.BotonEditarDesactivado();
  }

  BotonEditarDesactivado() {
    console.log(this.rankingIndividualFormulaUno);
    console.log(this.rankingEquiposFormulaUno);
    let SumatorioPuntos: number;
    SumatorioPuntos = 0;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.rankingIndividualFormulaUno.length; i++) {
      SumatorioPuntos = SumatorioPuntos + this.rankingIndividualFormulaUno[i].puntos;
    }
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.rankingEquiposFormulaUno.length; i++) {
      SumatorioPuntos = SumatorioPuntos + this.rankingEquiposFormulaUno[i].puntos;
    }
    console.log('Sumatorio');
    console.log(SumatorioPuntos);
    if (SumatorioPuntos === 0) {
      this.botoneditarPuntosDesactivado = false;
    } else {
      this.botoneditarPuntosDesactivado = true;
    }
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

  DameJornadasDelJuegoDeCompeticionSeleccionado() {
    this.peticionesAPI.DameJornadasDeCompeticionFormulaUno(this.juegoSeleccionado.id)
      .subscribe(inscripciones => {
        this.jornadas = inscripciones;
        console.log('Las jornadas son: ');
        console.log(this.jornadas);
      });
  }

  Informacion(): void {

    console.log ('Aquí estará la información del juego');
    console.log ('Voy a pasar la información del juego seleccionado');
    this.sesion.TomaJuego (this.juegoSeleccionado);
    this.JornadasCompeticion = this.calculos.GenerarTablaJornadasF1(this.juegoSeleccionado, this.jornadas,
                                                                          this.rankingIndividualFormulaUno, this.rankingEquiposFormulaUno);
    console.log ('Voy a pasar la información de las jornadas del juego');
    this.sesion.TomaDatosJornadas(this.jornadas,
                                  this.JornadasCompeticion);
    this.sesion.TomaTablaAlumnoJuegoDeCompeticion(this.rankingIndividualFormulaUno);
    this.sesion.TomaTablaEquipoJuegoDeCompeticion(this.rankingEquiposFormulaUno);
  }

  seleccionarGanadorLiga(): void {
    console.log('Aquí estará el proceso para elegir el ganador');
    console.log ('Voy a por la información del juego seleccionado');
    this.sesion.TomaJuego (this.juegoSeleccionado);
    this.JornadasCompeticion = this.calculos.GenerarTablaJornadasF1(this.juegoSeleccionado, this.jornadas,
                                                                          this.rankingIndividualFormulaUno, this.rankingEquiposFormulaUno);
    console.log ('Voy a por la información de las jornadas del juego');
    this.sesion.TomaDatosJornadas(this.jornadas,
                                  this.JornadasCompeticion);
    this.sesion.TomaTablaAlumnoJuegoDeCompeticion(this.rankingIndividualFormulaUno);
    this.sesion.TomaTablaEquipoJuegoDeCompeticion(this.rankingEquiposFormulaUno);
    this.sesion.TomaInscripcionAlumno(this.listaAlumnosOrdenadaPorPuntos);
    this.sesion.TomaInscripcionEquipo(this.listaEquiposOrdenadaPorPuntos);
    this.sesion.TomaJuegosDePuntos(this.juegosPuntos);
    this.sesion.TomaJuegosDeCuestionario (this.juegosCuestionariosTerminados);
    this.sesion.TomaJuegosDeVotacionUnoATodos (this.juegosDeVotacionUnoATodosTerminados);
    this.sesion.TomaJuegosDeEvaluacion (this.juegosDeEvaluacionTerminados);
  }

  editarjornadas() {

    console.log('Tomo las jornadas' + this.jornadas);
    console.log(this.jornadas);
    console.log ('Aquí estará la información del juego');
    this.sesion.TomaJuego (this.juegoSeleccionado);
    this.JornadasCompeticion = this.calculos.GenerarTablaJornadasF1(this.juegoSeleccionado, this.jornadas,
                                this.rankingIndividualFormulaUno, this.rankingEquiposFormulaUno);
    console.log('Juego activo' + this.JornadasCompeticion);
    this.sesion.TomaDatosJornadas(
      this.jornadas,
      this.JornadasCompeticion);
    // Necesario para Editar Puntos:
    this.TablaeditarPuntos = this.calculos.DameTablaeditarPuntos(this.juegoSeleccionado);
    console.log(this.TablaeditarPuntos);
    this.sesion.TomaJuego (this.juegoSeleccionado);
    this.sesion.TomaTablaeditarPuntos(this.TablaeditarPuntos);
    this.sesion.TomaTablaAlumnoJuegoDeCompeticion(this.rankingIndividualFormulaUno);
    this.sesion.TomaTablaEquipoJuegoDeCompeticion(this.rankingEquiposFormulaUno);
  }

  editarpuntos() {
    this.TablaeditarPuntos = this.calculos.DameTablaeditarPuntos(this.juegoSeleccionado);
    console.log(this.TablaeditarPuntos);
    this.sesion.TomaJuego (this.juegoSeleccionado);
    this.sesion.TomaTablaeditarPuntos(this.TablaeditarPuntos);
    this.sesion.TomaTablaAlumnoJuegoDeCompeticion(this.rankingIndividualFormulaUno);
    this.sesion.TomaTablaEquipoJuegoDeCompeticion(this.rankingEquiposFormulaUno);
  }


  // DesactivarJuego() {
  //   console.log(this.juegoSeleccionado);
  //   this.peticionesAPI.CambiaEstadoJuegoDeCompeticionFormulaUno(new Juego (this.juegoSeleccionado.Tipo, this.juegoSeleccionado.Modo,
  //     this.juegoSeleccionado.Asignacion,
  //     undefined, false), this.juegoSeleccionado.id, this.juegoSeleccionado.grupoId).subscribe(res => {
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

    
  Desactivar() {
    desactivarJuego().then((result) => {
      if (result.value) {
        this.juegoSeleccionado.JuegoActivo = false;
        this.peticionesAPI.CambiaEstadoJuegoDeCompeticionFormulaUno (this.juegoSeleccionado)
        .subscribe(res => {
            if (res !== undefined) {
              this.comServerService.enviarInfoGrupoJuegoStatus(this.juegoSeleccionado.grupoId);
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

  applyFilterEquipo(filterValue: string) {
    this.datasourceEquipo.filter = filterValue.trim().toLowerCase();
  }

  DameJuegosdePuntos() {
    this.peticionesAPI.DameJuegoDePuntosGrupo(this.juegoSeleccionado.grupoId)
    .subscribe(juegosPuntos => {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < juegosPuntos.length; i++) {
          this.juegosPuntos.push(juegosPuntos[i]);
      }
    });

  }

  DameJuegosdeCuestionariosAcabados() {
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

  
  DameJuegosdeEvaluacionAcabados() {
    console.log ('vamos a por los juegos de evaluacion acabados' + this.juegoSeleccionado.grupoId);
    this.peticionesAPI.DameJuegosDeEvaluacion(this.juegoSeleccionado.grupoId)
    .subscribe(juegos => {
      console.log ('Ya tengo los juegos de evaluacion');
      console.log (juegos);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < juegos.length; i++) {
        if ((juegos[i].JuegoActivo === false) && (juegos[i].rubricaId > 0)) {
          this.juegosDeEvaluacionTerminados.push(juegos[i]);
        }
      }
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
}

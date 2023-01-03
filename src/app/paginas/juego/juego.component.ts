import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatTabGroup } from '@angular/material';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';





// tslint:disable-next-line:max-line-length
import {
  Nivel, Alumno, Equipo, Juego, JuegoDeCompeticion, Punto, TablaPuntosFormulaUno,

  AlumnoJuegoDePuntos, EquipoJuegoDePuntos, Grupo, AlumnoJuegoDeCompeticionLiga,
  EquipoJuegoDeCompeticionLiga, Jornada, AlumnoJuegoDeCompeticionFormulaUno,
  EquipoJuegoDeCompeticionFormulaUno, AlumnoJuegoDeCompeticionTorneo,
  EquipoJuegoDeCompeticionTorneo, Cuestionario, JuegoDeAvatar, FamiliaAvatares,
  AlumnoJuegoDeAvatar, AsignacionPuntosJuego, Coleccion, AlumnoJuegoDeColeccion,
  EquipoJuegoDeColeccion, Escenario, JuegoDeGeocaching, AlumnoJuegoDeGeocaching, PuntoGeolocalizable,
  JuegoDeVotacionUnoATodos, AlumnoJuegoDeVotacionUnoATodos,
  JuegoDeVotacionTodosAUno, AlumnoJuegoDeVotacionTodosAUno, CuestionarioSatisfaccion,
  JuegoDeCuestionarioSatisfaccion, AlumnoJuegoDeCuestionarioSatisfaccion, Rubrica,
  JuegoDeControlDeTrabajoEnEquipo, AlumnoJuegoDeControlDeTrabajoEnEquipo, EquipoJuegoDeCuestionario, Evento, AlumnoJuegoDeCuento, JuegoDeCuento, RecursoCuento, RecursoCuentoJuego, JuegoDeVotacionAOpciones, AlumnoJuegoDeVotacionAOpciones
} from '../../clases/index';


import { JuegoMEMORAMA } from 'src/app/clases/JuegoMemorama';

// Services
import { SesionService, CalculosService, PeticionesAPIService, ComServerService } from '../../servicios/index';

import { Observable } from 'rxjs';
import { of } from 'rxjs';
import 'rxjs';

import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';

import { AsignaCuestionarioComponent } from './asigna-cuestionario/asigna-cuestionario.component';
import { JuegoDeCuestionario } from 'src/app/clases/JuegoDeCuestionario';
import { AlumnoJuegoDeCuestionario } from 'src/app/clases/AlumnoJuegoDeCuestionario';
import { Router } from '@angular/router';

import {AsignaEscenarioComponent} from './asigna-escenario/asigna-escenario.component';
import {AsignaPreguntasComponent} from './asigna-preguntas/asigna-preguntas.component';
import {JuegoDeEvaluacion} from '../../clases/JuegoDeEvaluacion';
import {log} from 'util';
import {EquipoJuegoDeEvaluacion} from '../../clases/EquipoJuegoDeEvaluacion';
import {AlumnoJuegoDeEvaluacion} from '../../clases/AlumnoJuegoDeEvaluacion';
import { EquipoJuegoDeVotacionUnoATodos } from 'src/app/clases/EquipoJuegoDeVotacionUnoATodos';
import { concursoLibro } from 'src/app/clases/clasesParaLibros/concursoLibro';
import { RecursoLibroJuego } from 'src/app/clases/clasesParaLibros/recurosLibroJuego';
import { RecursoLibro } from 'src/app/clases/clasesParaLibros/recursoLibro';
import { AlumnoJuegoDeMemorama } from 'src/app/clases/AlumnoJuegoDeMemorama';
import { EquipoJuegoDeMemorama } from 'src/app/clases/EquipoJuegoDeMemorama';
import * as URL from '../../URLs/urls';

export interface OpcionSeleccionada {
  nombre: string;
  id: string;
}

export interface ChipColor {
  nombre: string;
  color: ThemePalette;
}



@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.scss']
})

export class JuegoComponent implements OnInit {



  ///////////////////////////////////// VARIABLE GENERALES PARA EL COMPONENTE ///////////////////////////////////

  profesorId: number;
  grupo: Grupo;
  alumnosGrupo: Alumno[];

  rangePicker: any;

  equiposGrupo: Equipo[];
  @ViewChild('stepper', {static: false}) stepper;
  @ViewChild('tabs', {static: false}) tabGroup: MatTabGroup;

  // tslint:disable-next-line:ban-types
  juegoCreado: Boolean = false;

  // Usaré esta variable para determinar si debo advertir al usuario de
  // que está abandonando el proceso de creación del juego
  creandoJuego = false;

  // añadido classpipkids//

  inscribirtemporada;
  nivel1 = false;
  nivel2 = false;
  nivel3 = false;
  pesoc1;
  pesoc2;
  pesoc3;
  permisoparaver = false;

  avanzo1 = false;
  avanzo2 = false;
  // classpipkids//

  juego: any;

  juegoDeCuestionario: JuegoDeCuestionario;
  juegoDeCompeticion: JuegoDeCompeticion;
  juegoDeAvatar: JuegoDeAvatar;
  juegoDeGeocaching: JuegoDeGeocaching;

  juegoDeCuento: JuegoDeCuento;


  // Informacion para todos los juegos
  myForm: FormGroup;
  nombreDelJuego: string;
  tipoDeJuegoSeleccionado: string;
  modoDeJuegoSeleccionado: string;
  tengoNombre = false;
  tengoTipo = false;
  tengoModo = false;
  seleccionTipoJuego: ChipColor[] = [

    { nombre: 'Juego De Cuentos', color: 'primary' },
     { nombre: 'Juego De Competición', color: 'warn' },
    { nombre: 'Juego De Avatar', color: 'primary' },
    { nombre: 'Juego De Cuestionario', color: 'accent' },
    { nombre: 'Juego De Geocaching', color: 'warn' },
    { nombre: 'Juego De Votación', color: 'primary' },
    { nombre: 'Juego De Cuestionario de Satisfacción', color: 'accent' },
    {nombre: 'Juego De Puntos', color: 'primary'},
    {nombre: 'Juego De Colección', color: 'accent'},
    {nombre: 'Juego De Evaluación', color: 'accent'},
    {nombre: 'Juego De Cuentos', color: 'primary'},
    {nombre: 'Control de trabajo en equipo', color: 'primary'},
  ];
  seleccionModoJuego: ChipColor[] = [
    { nombre: 'Individual', color: 'primary' },
    { nombre: 'Equipos', color: 'accent' }
  ];


  // información para crear un juego de puntos
  puntosDelJuego: Punto[] = [];
  nivelesDelJuego: Nivel[] = [];
  logosNiveles: FormData[] = [];

  // información para crear un juego de colección
  coleccionSeleccionada: Coleccion;
  familiaSeleccionada: any;

  tengoColeccion = false;
  tengoFamilia = false;

  startDate = new Date(2019, 0, 1);
  startatpicker;
  modoAsignacion;


  // información para crear un juego de cuestionario
  cuestionario: Cuestionario;
  tengoCuestionario = false;
  // tslint:disable-next-line:max-line-length
  puntuacionCorrecta = 0; // le doy un valor porque si elojo kahoot esto no entre en juego pero debe estar definido para que se cree el juego
  puntuacionIncorrecta = 0;
  TiempoDuracion = 0;
  modoPresentacion = ' '; // Le pongo algo porque en caso de clasico en equipo no pongo nada aqui y el campo es obligatorio
  tengoModoPresentacion = false;
  seleccionModoPresentacion: string[] = ['Mismo orden para todos',
    'Preguntas desordenadas',
    'Preguntas y respuestas desordenadas'];
  tiempoLimite: number;
  tipoDeJuegoDeCuestionarioSeleccionado: string;
  tengoTipoJuegoCuestionario = false;
  seleccionModalidadJuegoCuestionario: ChipColor[] = [
    {nombre: 'Clásico', color: 'primary'},
    {nombre: 'Kahoot', color: 'warn'}
  ];
  modalidadSeleccionada: string;
  tengoModalidad = false;

  seleccionModoPresentacionKahoot: string[] = ['Mostrar pregunta',
  'No mostrar pregunta'];

  puntuaLaMedia: boolean;


  // información para crear juego de avatares
  familiasElegidas: number[];
  tengoFamilias = false;


  // info para juego de libros

  // recursoElegido: number[];
  // tengoRecurso = false;
  // showConcurso: any = false;
  // concursoLibro: concursoLibro;
  // siConcurso: any = false;
  // tengoRecursoCargadoParaGuardar: any = false;
  // recursoCargadoParaGuardar: RecursoLibro;
  // recursoParaLibro: RecursoLibroJuego;

  // Información para crear juego de evaluación
  descripcionJuegoEvaluacion = '';
  seleccionTipoDeEvaluacion: ChipColor[] = [
    {nombre: '1 a N', color: 'primary'},
    {nombre: 'Todos con todos', color: 'warn'}
  ];
  tipoDeEvaluacionSeleccionado: string;
  tengoTipoDeEvaluacion = false;
  //
  seleccionRelacionesEvaluacion: ChipColor[] = [
    {nombre: 'A elegir', color: 'primary'},
    {nombre: 'Aleatorio', color: 'warn'}
  ];
  relacionesEvaluacionSeleccionado: string;
  tengoRelacionEvaluacion = false;
  relacionesMap = new Map();
  numeroDeMiembros = 1;
  //
  profesorEvalua = false;
  profesorEvaluaModo = 'normal';
  autoevaluacion = false;
  //
  tengoRubrica = false;
  rubricaElegida: Rubrica;
  rubricas: Rubrica[];
  //
  seleccionCriterioEvaluacion: ChipColor[] = [
    {nombre: 'Por pesos', color: 'primary'},
    {nombre: 'Por penalización', color: 'warn'}
  ];
  criterioEvaluacionSeleccionado: string;
  tengoCriterioEvaluacion = false;
  //
  parentPesos = [];
  pesosArray = [];
  pesosSuman100 = true;
  penalizacionArray = [];
  //
  seleccionEquiposEvaluacion: ChipColor[] = [
    {nombre: 'Individualmente', color: 'primary'},
    {nombre: 'Por Equipos', color: 'warn'}
  ];
  equiposEvaluacionSeleccionado: string;
  tengoEquipoEvaluacion = false;
  //
  relacionAlumnosEquipos = [];
  comprobacionDeN = false;
  todosTienenEvaluador = false;

  formatoEvaluacion: string;
  tengoFormatoEvaluacion = false;

  listaPreguntasAbiertas = [];
  dataSourcePreguntasAbiertas;
  preguntasAbiertasAsignadas = false;
  displayedColumnsPreguntasAbiertas: string[] = ['pregunta', ' '];
  modoVistaEvaluado: string;
  tengoVistaEvaluado = false;


  // Información para crear juego de competicion

  tipoDeCompeticionSeleccionado: string;
  seleccionTipoDeCompeticion: ChipColor[] = [
    { nombre: 'Liga', color: 'primary' },
    { nombre: 'Fórmula Uno', color: 'warn' },
    { nombre: 'Torneo', color: 'accent' }
  ];
  tipoDeTorneoSeleccionado: string;
  seleccionModeloTorneo: ChipColor[] = [
    {nombre: 'Clásico', color: 'primary'},
    {nombre: 'Doble Eliminación', color: 'warn'},
    {nombre: 'Suizo', color: 'accent'}
  ];
  ParticipantesTorneo: Alumno[];
  CuadroModificado = false;
  tengoTipoDeCompeticion = false;
  tengoTipoDeTorneo = false;
  numeroDeJornadas: number;
  tengoNumeroDeJornadas = false;
  jornadasLiga: Jornada[];
  jornadasFormulaUno: Jornada[];
  jornadasTorneo: Jornada[];

  nuevaPuntuacion: number;
  tengoNuevaPuntuacion = false;
  Puntuacion: number[] = [];
  selection = new SelectionModel<any>(true, []);
  dataSource: any;
  TablaPuntuacion: TablaPuntosFormulaUno[];
  displayedColumnsTablaPuntuacion: string[] = ['select', 'Posicion', 'Puntos'];




  // Informacion para juego de geocatching

  escenario: Escenario;
  tengoEscenario = false;
  puntosgeolocalizablesEscenario: PuntoGeolocalizable[];
  numeroDePuntosGeolocalizables: number;

  idescenario: number;
  PreguntasBasicas: number[];
  PreguntasBonus: number[];
  tengoPreguntas = false;

  puntuacionCorrectaGeo: number;
  puntuacionIncorrectaGeo: number;
  puntuacionCorrectaGeoBonus: number;
  puntuacionIncorrectaGeoBonus: number;



   // info para juego de cuentos

   recursoElegido: number[];
   tengoRecurso = false;
   tengoRecursoCargadoParaGuardar: any = false;
   recursoCargadoParaGuardar: RecursoCuento;
   recursoParaCuento: RecursoCuentoJuego;


  // información para crear juego de votación

  tipoDeVotacionSeleccionado: string;
  seleccionTipoDeVotacion: ChipColor[] = [
    { nombre: 'Uno A Todos', color: 'primary' },
    { nombre: 'Todos A Uno', color: 'warn' },
    { nombre: 'Votar opciones', color: 'accent' },
  ];

  modoDeRepartoSeleccionado: string;
  seleccionModoReparto: ChipColor[] = [
    { nombre: 'Reparto fijo según posición', color: 'primary' },
    { nombre: 'Reparto libre', color: 'warn' }
  ];
  tengoModoReparto = false;
  puntosARepartir = 0;

  tengoTipoDeVotacion = false;
  conceptos: string[];
  opciones: string[];
  listaConceptos: any[] = [];
  listaOpciones: any[] = [];
  dataSourceConceptos;
  dataSourceOpciones;
  nombreConcepto;
  pesoConcepto;
  pesos: number[];
  totalPesos: number;
  conceptosAsignados = false;
  opcionesAsignadas = false;
  displayedColumnsConceptos: string[] = ['nombreConcepto', 'pesoConcepto', ' '];
  displayedColumnsOpciones: string[] = ['opcion', 'iconos'];
  autovotacion: boolean;
  votanEquipos: boolean;

  // Información para el juego de cuestionario de satisfacción
  cuestionarioSatisfaccion: CuestionarioSatisfaccion;
  tengoCuestionarioSatisfaccion = false;
  descripcionCuestionarioSatisfaccion: string;


  final = false;

  // HACEMOS DOS LISTAS CON LOS JUEGOS ACTIVOS, INACTIVOS Y PREPARADOS
  // Lo logico seria que fuesen listas de tipo Juego, pero meteremos objetos
  // de varios tipos (por ejemplo, de tipo Juego y de tipo JuegoDeCuestionario)
  juegosActivos: any[];
  juegosInactivos: any[];
  juegosPreparados: any[];


  // tslint:disable-next-line:no-inferrable-types
  opcionSeleccionada: string = 'todosLosJuegos';


  // Controles de trabajo en equipo
  numeroDeControles: number;
  tengoNumeroDeControles = false;
  verRespuestasControl = false;
  tengoModoRespuestas = false;

  Mododificultad: string;
  numerocartas: any;
  vectorimagen: any[] = [];
  vectorcartas: any[] = [];
  vectorcartaseleccionadas: any[] = [];
  cartaseleccionada1: any;
  cartaseleccionada2: any;

  idcartas: any[] = [];


  constructor(
    public dialog: MatDialog,
    private calculos: CalculosService,
    private sesion: SesionService,
    private location: Location,
    private peticionesAPI: PeticionesAPIService,
    // tslint:disable-next-line:variable-name
    private _formBuilder: FormBuilder,
    private router: Router,
    private comService: ComServerService,
  ) { }



  ngOnInit() {

    this.grupo = this.sesion.DameGrupo();
    console.log(' Grupo ' + this.grupo);
    this.alumnosGrupo = this.sesion.DameAlumnosGrupo();
    this.profesorId = this.sesion.DameProfesor().id;
    // La lista de equipos del grupo no esta en el servicio sesión. Asi que hay que
    // ir a buscarla
    this.peticionesAPI.DameEquiposDelGrupo(this.grupo.id)
    .subscribe(equipos => {
      if (equipos[0] !== undefined) {
        console.log('Hay equipos');
        this.equiposGrupo = equipos;
        console.log(this.equiposGrupo);
        for (const equipo of equipos) {
          this.peticionesAPI.DameAlumnosEquipo(equipo.id).subscribe((alumnos: Alumno[]) => {
            this.relacionAlumnosEquipos.push({equipoId: equipo.id, alumnos});
            console.log('relacion alumnos equipos', this.relacionAlumnosEquipos);
          });
        }
      } else {
        // mensaje al usuario
        console.log('Este grupo aun no tiene equipos');
        this.equiposGrupo = undefined;
      }
    });

    // Ahora traemos la lista de juegos
    // esta operacion es complicada. Por eso está en calculos
    // this.calculos.DameListaJuegos(this.grupo.id)
    //   .subscribe(listas => {
    //     console.log('He recibido los juegos');
    //     console.log(listas);
    //     this.juegosActivos = listas.activos;
    //     // Si la lista aun esta vacia la dejo como indefinida para que me
    //     // salga el mensaje de que aun no hay juegos
    //     if (listas.activos[0] === undefined) {
    //       this.juegosActivos = undefined;
    //       console.log('No hay inactivos');
    //     } else {
    //       this.juegosActivos = listas.activos;
    //       console.log('hay activos');
    //     }
    //     if (listas.inactivos[0] === undefined) {
    //       this.juegosInactivos = undefined;
    //       console.log('No hay inactivos');
    //     } else {
    //       this.juegosInactivos = listas.inactivos;
    //       console.log('hay inactivos');
    //     }
    //     if (listas.preparados[0] === undefined) {
    //       this.juegosPreparados = undefined;
    //     } else {
    //       this.juegosPreparados = listas.preparados;
    //     }

    //   });

    this.DameListaJuegos();

    // Peticion API Juego de Evaluacion
    this.peticionesAPI.DameRubricasProfesor(this.profesorId).subscribe(rubricas => {
      console.log('Tengo rubricas', rubricas);
      this.rubricas = rubricas;
    });
    // Fin Peticion API Juego de Evaluacion
    //
    // Es este formulario recogeremos la información que vaya introduciendo
    // el usuario segun el tipo de juego
    this.myForm = this._formBuilder.group({
      NombreDelJuego: ['', Validators.required],
      DescripcionJuegoEvaluacion: ['', Validators.required],
      PuntuacionCorrecta: ['', Validators.required],
      PuntuacionIncorrecta: ['', Validators.required],
      TiempoDuracion: ['', Validators.required],
      NumeroDeJornadas: ['', Validators.required],
      criterioPrivilegioComplemento1: ['', Validators.required],
      criterioPrivilegioComplemento2: ['', Validators.required],
      criterioPrivilegioComplemento3: ['', Validators.required],
      criterioPrivilegioComplemento4: ['', Validators.required],
      criterioPrivilegioVoz: ['', Validators.required],
      criterioPrivilegioVerTodos: ['', Validators.required],
      NuevaPuntuacion: ['', Validators.required],
      PuntuacionCorrectaGeo: ['', Validators.required],
      PuntuacionIncorrectaGeo: ['', Validators.required],
      PuntuacionCorrectaGeoBonus: ['', Validators.required],
      PuntuacionIncorrectaGeoBonus: ['', Validators.required],
      descripcionlibro: ['', Validators.required],
      concursoTematica: ['', Validators.required],
      dateFinInscripcion: ['', Validators.required],
      dateFinVotacion: ['', Validators.required],
      concursoRequisitos: ['', Validators.required],
      concursoPrimerCriterio: ['', Validators.required],
      concursoSegundoCriterio: ['', Validators.required],
      concursoTercerCriterio: ['', Validators.required],
      criterioprivilegio1: ['', Validators.required],
      criterioprivilegio2: ['', Validators.required],
      criterioprivilegio3: ['', Validators.required],
      c1: ['', Validators.required],
      c2: ['', Validators.required],
      c3: ['', Validators.required],
      NombreDelConcepto: ['', Validators.required],
      PesoDelConcepto: ['', Validators.required],
      Opcion: ['', Validators.required],
      TiempoLimite: ['', Validators.required],
      descripcionCuento: ['', Validators.required],
      PreguntaAbierta:  ['', Validators.required],
      NumeroDeControles: ['', Validators.required]
    });



    this.TablaPuntuacion = [];
    this.TablaPuntuacion[0] = new TablaPuntosFormulaUno(1, 10);
    this.dataSource = new MatTableDataSource(this.TablaPuntuacion);
    this.Puntuacion[0] = 10;




    this.listaConceptos = [];
    this.totalPesos = 0;

  }

  async DameListaJuegos() {

    const listas =  await this.calculos.DameListaJuegos(this.grupo.id);
    this.juegosActivos = listas.activos;
    // Si la lista aun esta vacia la dejo como indefinida para que me
    // salga el mensaje de que aun no hay juegos
    if (listas.activos[0] === undefined) {
          this.juegosActivos = undefined;
          console.log('No hay inactivos');
    } else {
          this.juegosActivos = listas.activos;
          console.log('hay activos', this.juegosActivos);
    }
    if (listas.inactivos[0] === undefined) {
          this.juegosInactivos = undefined;
          console.log('No hay inactivos');
    } else {
          this.juegosInactivos = listas.inactivos;
          console.log('hay inactivos');
    }
    if (listas.preparados[0] === undefined) {
          this.juegosPreparados = undefined;
    } else {
          this.juegosPreparados = listas.preparados;
    }
  }

  //////////////////////////////////////// FUNCIONES PARA LISTAR JUEGOS ///////////////////////////////////////////////


  // Busca la lista de juego de puntos y la clasifica entre activo e inactivo, y activa la función ListaJuegosDeColeccion

  // Función que usaremos para clicar en un juego y entrar en él,
  // Enviamos juego a la sesión
  JuegoSeleccionado(juego: Juego) {
    console.log('**************guardo juego en la sesion');
    console.log(juego);
    this.sesion.TomaJuego(juego);
    // if (juego.Tipo === 'Juego De Geocaching') {
    //   this.router.navigateByUrl ('juegoSeleccionadoPreparado');
    // }
  }


  ///////////////////////////////////////// FUNCIONES PARA CREAR JUEGO ///////////////////////////////////////////////

  // RECUPERA LOS EQUIPOS DEL GRUPO
  TraeEquiposDelGrupo() {
    this.peticionesAPI.DameEquiposDelGrupo(this.grupo.id)
      .subscribe(equipos => {
        if (equipos[0] !== undefined) {
          console.log('Hay equipos');
          this.equiposGrupo = equipos;
          console.log(this.equiposGrupo);
        } else {
          // mensaje al usuario
          console.log('Este grupo aun no tiene equipos');
        }

      });
  }

  GuardaNombreDelJuego() {
    this.nombreDelJuego = this.myForm.value.NombreDelJuego;
    console.log('Entro en guardar nombre');
    console.log(this.nombreDelJuego);
    if (this.nombreDelJuego === undefined) {
      this.tengoNombre = false;
    } else {
      this.tengoNombre = true;
      this.creandoJuego = true; // empiezo el proceso de creacion del juego
      console.log('tengo nombre ' + this.nombreDelJuego);
    }
  }


  // TipoDeJuegoSeleccionado(tipo: ChipColor) {
  //   if ((tipo.nombre === 'Control de trabajo en equipo') && (!this.equiposGrupo)) {
  //     Swal.fire('Alerta', 'No ha equipos en este grupo', 'warning');
  //   } else {
  //     this.tipoDeJuegoSeleccionado = tipo.nombre;
  //     console.log(' tengo tipo ' + this.tipoDeJuegoSeleccionado);
  //     this.tengoTipo = true;
  //     // if (this.tipoDeJuegoSeleccionado === 'Juego De Competición') {
  //     //     this.NumeroDeVueltas();
  //     // }
  //   }
  // }


  TipoDeJuegoSeleccionado(tipo: string) {
    if ((tipo === 'Control de trabajo en equipo') && (!this.equiposGrupo)) {
      Swal.fire('Alerta', 'No ha equipos en este grupo', 'warning');
    } else {
      this.tipoDeJuegoSeleccionado = tipo;
      console.log(' tengo tipo ' + tipo);
      this.tengoTipo = true;
      // if (this.tipoDeJuegoSeleccionado === 'Juego De Competición') {
      //     this.NumeroDeVueltas();
      // }
    }
  }


  // Recoge el modo de juego seleccionado y lo mete en la variable (modoDeJuegoSeleccionado), la cual se usará después
  // para el POST del juego
  ModoDeJuegoSeleccionado(modo: ChipColor) {
    this.modoDeJuegoSeleccionado = modo.nombre;
    console.log(' tengo modo ' + this.modoDeJuegoSeleccionado);
    console.log(' tengo tipo ' + this.tipoDeJuegoSeleccionado);
    // if ((this.tipoDeJuegoSeleccionado === 'Juego De Cuestionario') && (this.modoDeJuegoSeleccionado === 'Equipos')) {
    //   Swal.fire('Alerta', 'Aún no es posible el juego de cuestionario en equipo', 'warning');
    // } else

    if ((this.tipoDeJuegoSeleccionado === 'Juego De Avatar') && (this.modoDeJuegoSeleccionado === 'Equipos')) {
      Swal.fire('Alerta', 'Aún no es posible el juego de avatares en equipo', 'warning');
    } else if ((this.tipoDeJuegoSeleccionado === 'Juego De Cuentos') && (this.modoDeJuegoSeleccionado === 'Equipos')) {
      Swal.fire('Alerta', 'Aún no es posible el juego de libros en equipo', 'warning');

    } else if ((this.tipoDeJuegoSeleccionado === 'Juego De Geocaching') && (this.modoDeJuegoSeleccionado === 'Equipos')) {
      Swal.fire('Alerta', 'Aún no es posible el juego de geocaching en equipo', 'warning');
   // } else if ((this.tipoDeJuegoSeleccionado === 'Juego De Votación') && (this.modoDeJuegoSeleccionado === 'Equipos')) {
     // Swal.fire('Alerta', 'Aún no es posible el juego de votación en equipo', 'warning');
    } else if ((this.tipoDeJuegoSeleccionado === 'Juego De Cuestionario de Satisfacción') && (this.modoDeJuegoSeleccionado === 'Equipos')) {
      Swal.fire('Alerta', 'No existe el juego de cuestionario de satisfacción en equipo', 'warning');
    } else {
      if (this.modoDeJuegoSeleccionado === 'Individual') {
        if (this.alumnosGrupo === undefined) {
          Swal.fire('Alerta', 'No hay ningún alumno en este grupo', 'warning');
          console.log('No Hay alumnos, no puedo crear el juego');
        } else {
          console.log('Hay alumnos, puedo crear');
          this.tengoModo = true;
        }

      } else {
        if (this.equiposGrupo === undefined) {
          Swal.fire('Alerta', 'No hay ningún equipo en este grupo', 'warning');
          console.log('No se puede crear juego pq no hay equipos');
        } else {
          this.tengoModo = true;
          console.log('Hay equipos, puedo crear');
        }
      }
    }
  }

  // FUNCIONES PARA LA CREACION DE JUEGO DE EVALUACION
  TipoDeEvaluacionSeleccionado(tipoEvaluacion: ChipColor) {
    this.tipoDeEvaluacionSeleccionado = tipoEvaluacion.nombre;
    if (this.tipoDeEvaluacionSeleccionado === 'Todos con todos') {
      this.numeroDeMiembros = this.DameMaxSlider();
      this.HacerRelaciones(true);
    }
    this.tengoTipoDeEvaluacion = true;
  }
  RecibeRubricaElegida($event) {
    this.rubricaElegida = $event;
    this.tengoRubrica = true;
    this.parentPesos = [];
    this.rubricaElegida.Criterios.forEach(() => {
      this.parentPesos.push(this.PesoPorDefecto(this.rubricaElegida.Criterios.length));
    });
  }
  // RubricaSeleccionChange(index: number) {
  //   console.log('Rubrica seleccionada', this.rubricas[index]);
  //   this.rubricaElegida = this.rubricas[index];
  //   this.tengoRubrica = true;
  //   this.parentPesos = [];
  //   this.rubricaElegida.Criterios.forEach(() => {
  //     this.parentPesos.push(this.PesoPorDefecto(this.rubricaElegida.Criterios.length));
  //   });
  //   console.log(this.parentPesos);
  // }

  RelacionDeEvaluacionSeleccionado(relacionEvaluacion: ChipColor) {
    this.relacionesEvaluacionSeleccionado = relacionEvaluacion.nombre;
    if (relacionEvaluacion.nombre === 'Aleatorio') {
      this.HacerRelaciones(true);
    } else {
      this.HacerRelaciones(false);
    }
    this.tengoRelacionEvaluacion = true;
  }
  Shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }
  HacerRelaciones(fill: boolean) {
    if (this.modoDeJuegoSeleccionado === 'Equipos' && this.equiposEvaluacionSeleccionado === 'Individualmente') {
      console.log ('evaluación de grupos por individuos');
      const evaluadores = this.DameEvaluadores().map(item => item.id);
      const evaluadoresDesordenados = this.Shuffle (evaluadores);
      console.log ('evaluadores desodenados');
      console.log (evaluadoresDesordenados);
      const evaluados = this.DameEvaluados().map(item => item.id);
      console.log ('evaluados');
      console.log (evaluados);
      console.log ('relacionAlumnosEquipos');
      console.log (this.relacionAlumnosEquipos);

      this.relacionesMap = new Map();
      let j = 0;
      for (let i = 0; i < evaluados.length; i++) {
          if (!fill) {
            this.relacionesMap.set(evaluados[i], []);
          } else {
            console.log ('vamos a buscar evaluadores para el equipo ' + evaluados[i] );
            const equipoEvaluado = this.relacionAlumnosEquipos.find (equipo => equipo.equipoId === evaluados[i]);
            console.log ('equipo evaluado');
            console.log (equipoEvaluado);
            const evaluadoresElegidos = [];
            let cont = 0;
            // let j = i;
            while ( cont < this.numeroDeMiembros) {
              console.log ('veamos que pasa con ' + evaluadoresDesordenados[j]);
              // Si el posible evaluador pertenece al equipo evaluado entonces no lo cogemos
              if (equipoEvaluado.alumnos.some (alumno  => alumno.id === evaluadoresDesordenados[j])) {
                console.log ('va a ser que no');
                j = (j + 1) % evaluadoresDesordenados.length;
              } else {
                console.log ('pues si');
                evaluadoresElegidos.push (evaluadoresDesordenados[j]);
                cont ++;
                j = (j + 1) % evaluadoresDesordenados.length;
              }
            }
            console.log ('ya tengo los 5');
            console.log (evaluadoresElegidos);
            this.relacionesMap.set(evaluados[i], evaluadoresElegidos);
          }
      }



    } else {
      const evaluados = this.DameEvaluados().map(item => item.id);
      const evaluadoresDesordenados = this.Shuffle (evaluados);
      console.log ('evaluados');
      console.log (evaluados);
      console.log ('evaluadores desordenados');
      console.log (evaluadoresDesordenados);


      this.relacionesMap = new Map();

      for (let i = 0; i < evaluados.length; i++) {
          if (!fill) {
            this.relacionesMap.set(evaluados[i], []);
          } else {
            const evaluadoresElegidos = [];
            let cont = 0;
            let j = i;
            while ( cont < this.numeroDeMiembros) {
              // Si el posible evaluador es el propio evaluado no lo cogemos
              if (evaluados[i] === evaluadoresDesordenados[j]) {
                j = (j + 1) % evaluados.length;
              } else {
                evaluadoresElegidos.push (evaluadoresDesordenados[j]);
                cont ++;
                j = (j + 1) % evaluados.length;
              }
            }
            this.relacionesMap.set(evaluados[i], evaluadoresElegidos);
          }
      }
    }
    //       let evaluadores = [];
    //       if (this.modoDeJuegoSeleccionado === 'Equipos' && this.equiposEvaluacionSeleccionado === 'Individualmente') {
    //         for (const equipo of this.relacionAlumnosEquipos) {
    //           if (equipo.equipoId === evaluados[i]) {
    //             evaluadores = this.DameEvaluadores()
    //               .filter(({id: id1}) => !equipo.alumnos.some(({id: id2}) => id1 === id2))
    //               .map(item => item.id);
    //           }
    //         }
    //       } else {
    //         evaluadores = this.DameEvaluadores().filter(item => item.id !== evaluados[i]).map(item => item.id);
    //       }
    //       evaluadores = this.Shuffle(evaluadores);
    //       if (this.modoDeJuegoSeleccionado === 'Equipos'
    //         && this.equiposEvaluacionSeleccionado === 'Individualmente'
    //         && this.tipoDeEvaluacionSeleccionado === 'Todos con todos') {
    //         evaluadores.length = this.alumnosGrupo.length;
    //       } else {
    //         evaluadores.length = this.numeroDeMiembros;
    //       }
    //       this.relacionesMap.set(evaluados[i], evaluadores.filter(item => !isNaN(item)));
    //     }
    // }

    console.log('Relaciones object', this.relacionesMap);
    this.tengoRelacionEvaluacion = true;
    this.todosTienenEvaluador = true;
    this.comprobacionDeN = true;
  }
  HacerRelaciones_old(fill: boolean) {
    const evaluados = this.DameEvaluados().map(item => item.id);
    this.relacionesMap = new Map();
    do {
      for (let i = 0; i < evaluados.length; i++) {
        if (!fill) {
          this.relacionesMap.set(evaluados[i], []);
        } else {
          let evaluadores = [];
          if (this.modoDeJuegoSeleccionado === 'Equipos' && this.equiposEvaluacionSeleccionado === 'Individualmente') {
            for (const equipo of this.relacionAlumnosEquipos) {
              if (equipo.equipoId === evaluados[i]) {
                evaluadores = this.DameEvaluadores()
                  .filter(({id: id1}) => !equipo.alumnos.some(({id: id2}) => id1 === id2))
                  .map(item => item.id);
              }
            }
          } else {
            evaluadores = this.DameEvaluadores().filter(item => item.id !== evaluados[i]).map(item => item.id);
          }
          evaluadores = this.Shuffle(evaluadores);
          if (this.modoDeJuegoSeleccionado === 'Equipos'
            && this.equiposEvaluacionSeleccionado === 'Individualmente'
            && this.tipoDeEvaluacionSeleccionado === 'Todos con todos') {
            evaluadores.length = this.alumnosGrupo.length;
          } else {
            evaluadores.length = this.numeroDeMiembros;
          }
          this.relacionesMap.set(evaluados[i], evaluadores.filter(item => !isNaN(item)));
        }
      }
    } while (this.ComprobarSiTodosTienenEvaluadores() === false && fill === true);
    console.log('Relaciones object', this.relacionesMap);
    console.log('Todos tienen evaluadores', this.todosTienenEvaluador);
  }
  RelacionChanged(id: number, value: string[]) {
    console.log('Relaciones changed', id, value);
    this.relacionesMap.set(id, value);
    console.log('Relaciones object', this.relacionesMap);
    this.ComprobarSiTodosTienenEvaluadores();
  }
  ComprobarSiTodosTienenEvaluadores() {
    let encontrado1 = false;
    let encontrado2 = false;
    if (this.modoDeJuegoSeleccionado === 'Equipos' && this.equiposEvaluacionSeleccionado === 'Individualmente') {
      this.relacionesMap.forEach((value, key) => {
        if (value.length < this.numeroDeMiembros) {
          this.comprobacionDeN = false;
          encontrado2 = true;
        }
        value.forEach(item => {
          if (this.ContarEvaluadores(item) === 0) {
            this.todosTienenEvaluador = false;
            encontrado1 = true;
          }
        });
      });
    } else {
      this.relacionesMap.forEach((value, key) => {
        if (this.ContarEvaluadores(key) === 0) {
          this.todosTienenEvaluador = false;
          encontrado1 = true;
        }
        if (value.length < this.numeroDeMiembros) {
          this.comprobacionDeN = false;
          encontrado2 = true;
        }
      });
    }
    if (!encontrado1) {
      this.todosTienenEvaluador = true;
    }
    if (!encontrado2) {
      this.comprobacionDeN = true;
    }
    return this.todosTienenEvaluador;
  }
    ContarEvaluadores(idEvaluado: number): number {
    let suma = 0;
    this.relacionesMap.forEach((value, key) => {
      if (value.includes(idEvaluado)) {
        suma++;
      }
    });
    return suma;
  }
    CriterioDeEvaluacionSeleccionado(criterioEvaluacion: ChipColor) {
    this.criterioEvaluacionSeleccionado = criterioEvaluacion.nombre;
    this.tengoCriterioEvaluacion = true;
    if (this.criterioEvaluacionSeleccionado === 'Por pesos') {
      this.pesosArray = [];
      for (let i = 0; i < this.rubricaElegida.Criterios.length; i++) {
        this.pesosArray.push([]);
        this.pesosArray[i].push(this.parentPesos[i]);
        for (let j = 0; j < this.rubricaElegida.Criterios[i].Elementos.length; j++) {
          this.pesosArray[i].push(this.PesoPorDefecto(this.rubricaElegida.Criterios[i].Elementos.length));
        }
      }
      console.log('pesos array', this.pesosArray);
    } else {
      this.penalizacionArray = [];
      for (let i = 0; i < this.rubricaElegida.Criterios.length; i++) {
        this.penalizacionArray.push([]);
        if (this.rubricaElegida.Criterios[i].Elementos.length >= 1) {
          this.penalizacionArray[i].push({num: 1, p: 75});
        }
        if (this.rubricaElegida.Criterios[i].Elementos.length >= 2) {
          this.penalizacionArray[i].push({num: 2, p: 50});
        }
        if (this.rubricaElegida.Criterios[i].Elementos.length >= 3) {
          this.penalizacionArray[i].push({num: 3, p: 0});
        }
      }
      this.penalizacionArray.push(this.parentPesos);
      console.log('penalizacion array', this.penalizacionArray);
    }
  }
    EquipoDeEvaluacionSeleccionado(equipoEvaluacion: ChipColor) {
    this.equiposEvaluacionSeleccionado = equipoEvaluacion.nombre;
    this.tengoEquipoEvaluacion = true;
  }
    AutoevaluacionChange(isChecked: boolean) {
    this.autoevaluacion = isChecked;
  }
    ProfesorEvaluaChange(isChecked: boolean) {
    this.profesorEvalua = isChecked;
    if (this.formatoEvaluacion === 'solo preguntas abiertas') {
      this.profesorEvaluaModo = 'normal';
    }
  }
    ProfesorEvaluaModoChange(value: string) {
    this.profesorEvaluaModo = value;
  }

  ModoVistaEvaluadoChange(value: string) {
    this.modoVistaEvaluado = value;
    this.tengoVistaEvaluado = true;
  }



  PonPreguntaAbierta() {

    this.listaPreguntasAbiertas.push(this.myForm.value.PreguntaAbierta);
    this.dataSourcePreguntasAbiertas = new MatTableDataSource(this.listaPreguntasAbiertas);
    this.myForm.reset();

  }


  BorraPreguntaAbierta(preguntaAbierta) {
    this.listaPreguntasAbiertas = this.listaPreguntasAbiertas.filter (pregunta => pregunta !== preguntaAbierta);
    this.dataSourcePreguntasAbiertas = new MatTableDataSource(this.listaPreguntasAbiertas);
  }



  AsignarPreguntasAbiertas() {

    if (this.listaPreguntasAbiertas.length === 0) {
      Swal.fire('No hay preguntas abiertas', ' ', 'error');
    } else {
      this.preguntasAbiertasAsignadas = true;
    }
  }


    DameMaxSlider(): number {
    if (this.modoDeJuegoSeleccionado === 'Individual') {
      return this.alumnosGrupo.length - 1;
    } else if (this.modoDeJuegoSeleccionado === 'Equipos') {
      if (this.equiposEvaluacionSeleccionado === 'Por Equipos') {
        return this.equiposGrupo.length - 1;
      } else if (this.equiposEvaluacionSeleccionado === 'Individualmente') {
        const max = this.alumnosGrupo.length;
        let tamañoEquipoMayor = 0;
        for (let i = 0; i < this.relacionAlumnosEquipos.length; i++) {
          if (this.relacionAlumnosEquipos[i].alumnos.length > tamañoEquipoMayor) {
            tamañoEquipoMayor = this.relacionAlumnosEquipos[i].alumnos.length;
          }
        }
        return max - tamañoEquipoMayor;
      }
    }
  }

    DameEvaluados(): any {
    if (this.modoDeJuegoSeleccionado === 'Individual') {
      return this.alumnosGrupo;
    } else {
      return this.equiposGrupo;
    }
  }
    DameEvaluadores(): any {
    if (this.equiposEvaluacionSeleccionado === 'Por Equipos') {
      return this.equiposGrupo;
    } else {
      return this.alumnosGrupo;
    }
  }
  public DameRelacionesAlumnoEquipos() {
    return this.relacionAlumnosEquipos;
  }
  SliderChanged(value: number) {
    console.log('Slider changed to', value);
    this.numeroDeMiembros = value;
  }

  GuardarDescripcionEvaluacion() {
    this.descripcionJuegoEvaluacion = this.myForm.value.DescripcionJuegoEvaluacion;
  }
  PesoPorDefecto(total: number): number {
    return parseFloat((100 / total).toFixed(2));
  }
  PesosChanged(name: string, value: string): void {
    console.log('Pesos changed', name, value);
    const criterio = name.split('-')[0];
    const elemento = name.split('-')[1];
    this.pesosArray[criterio][elemento] = parseFloat(value);
    console.log('pesos array changed', this.pesosArray);
    this.pesosSuman100 = this.PesosSuman100();
  }
  PesosParentChanged(name: string, value: string): void {
    /*
    console.log('Pesos parent changed', name, value);
    this.pesosArray[name][0] = parseFloat(value);
    console.log('pesos array changed', this.pesosArray);
    this.pesosSuman100 = this.PesosSuman100();
    */
    this.parentPesos[name] = parseFloat(value);
    console.log(this.parentPesos);
  }
  ParentPesosSuman100(): boolean {
    let c = 0;
    for (let i = 0; i < this.parentPesos.length; i++) {
      c += this.parentPesos[i];
    }
    return Math.round((c + Number.EPSILON) * 10) / 10 === 100;
  }
  PesosSuman100(): boolean {
    let c = 0;
    for (let i = 0; i < this.pesosArray.length; i++) {
      let p = 0;
      for (let j = 0; j < this.pesosArray[i].length; j++) {
        if  (j === 0) {
          c += this.pesosArray[i][j];
        } else {
          p += this.pesosArray[i][j];
        }
      }
      if (Math.round((p + Number.EPSILON) * 10) / 10 !== 100) {
        return false;
      }
    }
    return Math.round((c + Number.EPSILON) * 10) / 10 === 100;
  }
  PenalizacionChanged(name: string, value: string): void {
    console.log('Penalizacion changed', name, value);
    const criterio = name.split('-')[0];
    const elemento = name.split('-')[1];
    const tipo = name.split('-')[2];
    if (tipo === 'num') {
      const tmp = this.penalizacionArray[criterio][elemento].p;
      this.penalizacionArray[criterio][elemento] = {num: parseInt(value, 10), p: tmp};
    } else if (tipo === 'p') {
      const tmp = this.penalizacionArray[criterio][elemento].num;
      this.penalizacionArray[criterio][elemento] = {num: tmp, p: parseInt(value, 10)};
    }
    console.log('penalizacion array', this.penalizacionArray);
  }
  CrearJuegoEvaluacion() {
    let evaluadores: number;
    if (this.tipoDeEvaluacionSeleccionado === 'Todos con todos') {
      evaluadores = 0;
    } else {
      evaluadores = this.numeroDeMiembros;
    }
    let rubrica;
    if (this.formatoEvaluacion === 'con rúbrica') {
      rubrica = this.rubricaElegida.id;
    } else {
      rubrica = 0; // asi indico que el juego no tiene rubrica y por tanto es de preguntas abiertas
    }

    const juego: JuegoDeEvaluacion = new JuegoDeEvaluacion(
      null,
      this.nombreDelJuego,
      this.descripcionJuegoEvaluacion,
      'Evaluacion',
      this.modoDeJuegoSeleccionado,
      true,
      false,
      this.profesorEvalua,
      this.profesorEvaluaModo === 'normal',
      this.autoevaluacion,
      evaluadores,
      this.pesosArray,
      this.criterioEvaluacionSeleccionado === 'Por pesos',
      this.penalizacionArray,
      rubrica,
      this.listaPreguntasAbiertas,
      this.modoVistaEvaluado,
      this.profesorId,
      this.grupo.id
    );
    console.log('Creando Juego de Evaluacion', juego);
    console.log('Vista evaluado', this.modoVistaEvaluado);
    this.peticionesAPI.CrearJuegoDeEvaluacion(juego).subscribe(res => {
      this.juego = res;
      this.sesion.TomaJuego(this.juego);
      this.juegoCreado = true;

      // Registrar la Creación del Juego
      // tslint:disable-next-line:max-line-length
      const evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juego.id, this.nombreDelJuego, 'Juego De Evaluación');
      this.calculos.RegistrarEvento(evento);

      // Notificar a los Alumnos del Grupo
      // tslint:disable-next-line:max-line-length
      this.comService.EnviarNotificacionGrupo(1, this.grupo.id, `Nuevo Juego de Evaluación para el Grupo ${this.grupo.Nombre}: ${this.nombreDelJuego}`);

      Swal.fire('Juego de Evaluación creado correctamente', ' ', 'success');

      this.relacionesMap.forEach( (value: number[], key: number) => {
        if (this.modoDeJuegoSeleccionado === 'Equipos' && this.equiposEvaluacionSeleccionado === 'Por Equipos') {
          const equipo: EquipoJuegoDeEvaluacion = new EquipoJuegoDeEvaluacion(
            null,
            res.id,
            key,
            value,
            null,
            null,
            null
          );
          this.peticionesAPI.CrearEquipoJuegoDeEvaluacion(equipo).subscribe(equipores => console.log('EquipoJuegoEvaluado', equipores));
        } else if (this.modoDeJuegoSeleccionado === 'Equipos' && this.equiposEvaluacionSeleccionado === 'Individualmente') {
          const equipo: EquipoJuegoDeEvaluacion = new EquipoJuegoDeEvaluacion(
            null,
            res.id,
            key,
            null,
            value,
            null,
            null
          );
          this.peticionesAPI.CrearEquipoJuegoDeEvaluacion(equipo).subscribe(equipores => console.log('EquipoJuegoEvaluado', equipores));
        } else if (this.modoDeJuegoSeleccionado === 'Individual') {
          const alumno: AlumnoJuegoDeEvaluacion = new AlumnoJuegoDeEvaluacion(
            null,
            res.id,
            key,
            value,
            null,
            null
          );
          this.peticionesAPI.CrearAlumnoJuegoDeEvaluacion(alumno).subscribe(alumnosres => console.log('AlumnoJuegoEvaluado', alumnosres));
        }
      });

      // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
      if (this.juegosActivos === undefined) {
        // Si la lista aun no se ha creado no podre hacer el push
        this.juegosActivos = [];
      }
      this.juegosActivos.push(this.juego);
      this.Limpiar();
      // Regresamos a la lista de equipos (mat-tab con índice 0)
      this.tabGroup.selectedIndex = 0;
    });
  }

  // FUNCIONES PARA LA CREACION DE JUEGO DE PUNTOS
  RecibeTiposDePuntos($event) {
    this.puntosDelJuego = $event;
    console.log('ya tengo los puntos');
    console.log(this.puntosDelJuego);
  }

  RecibeNivel($event) {
    this.nivelesDelJuego.push($event.n);
    if ($event.l !== undefined) {
      this.logosNiveles.push($event.l);
    }
    console.log('ya tengo los niveles');
    console.log(this.nivelesDelJuego);
    console.log(this.logosNiveles);
  }


  // Función que usaremos para crear un juego de puntos.

  CrearJuegoDePuntos() {
    // primero creamos el juego
    this.peticionesAPI.CreaJuegoDePuntos(new Juego (this.tipoDeJuegoSeleccionado, this.modoDeJuegoSeleccionado,
      undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, this.nombreDelJuego), this.grupo.id)
    .subscribe(juegoCreado => {
      this.juego = juegoCreado;
      this.sesion.TomaJuego(this.juego);
      this.juegoCreado = true;

      // Registrar la Creación del Juego
      // tslint:disable-next-line:max-line-length
      const evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juego.id, this.nombreDelJuego, 'Juego De Puntos');
      this.calculos.RegistrarEvento(evento);
      // let evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juego.id, this.nombreDelJuego, "Juego De Puntos");
      // this.peticionesAPI.CreaEvento(evento).subscribe((res) => {
      //   console.log("Registrado evento: ", res);
      // }, (err) => {
      //   console.log(err);
      // });

      // Notificar a los Alumnos del Grupo
      // tslint:disable-next-line:max-line-length
      this.comService.EnviarNotificacionGrupo(1, this.grupo.id, `Nuevo Juego de Puntos para el Grupo ${this.grupo.Nombre}: ${this.nombreDelJuego}`);

      // Ahora asignamos los puntos
      // tslint:disable-next-line:max-line-length
      this.puntosDelJuego.forEach (punto =>
        this.peticionesAPI.AsignaPuntoJuego(new AsignacionPuntosJuego(punto.id, this.juego.id))
        .subscribe()
      );
      // asignamos los niveles
      if (this.nivelesDelJuego !== undefined) {
        this.nivelesDelJuego.forEach (nivel =>
          this.peticionesAPI.CreaNivel(nivel, this.juego.id)
          .subscribe()
        );
        // Guardamos los logos de los niveles
        this.logosNiveles.forEach (logo =>
          this.peticionesAPI.PonImagenNivel(logo)
          .subscribe()
        );
      }

      // Inscribo los participantes en el juego
      if (this.modoDeJuegoSeleccionado === 'Individual') {
        console.log('Voy a inscribir a los alumnos del grupo 1');

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.alumnosGrupo.length; i++) {
          console.log(this.alumnosGrupo[i]);
          this.peticionesAPI.InscribeAlumnoJuegoDePuntos(new AlumnoJuegoDePuntos(this.alumnosGrupo[i].id, this.juego.id))
          .subscribe();
        }
      } else {
        console.log('Voy a inscribir los equipos del grupo');

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.equiposGrupo.length; i++) {
          console.log(this.equiposGrupo[i]);
          this.peticionesAPI.InscribeEquipoJuegoDePuntos(new EquipoJuegoDePuntos(this.equiposGrupo[i].id, this.juego.id))
          .subscribe();
        }
      }
      Swal.fire('Juego de puntos creado correctamente', ' ', 'success');

    // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
      if (this.juegosActivos === undefined) {
      // Si la lista aun no se ha creado no podre hacer el push
          this.juegosActivos = [];
      }
      this.juegosActivos.push (this.juego);
      this.Limpiar();
      // Regresamos a la lista de equipos (mat-tab con índice 0)
      this.tabGroup.selectedIndex = 0;
    });
  }
  /// Funciones PARA LA CREACION DE JUEGO DE FAMILIA

  RecibeFamilia($event) {
    console.log('EVENTO', $event);
    this.familiaSeleccionada = $event;
    this.tengoFamilia = true;
  }




  RegistraDificultad() {
    console.log('Seleccion de Dificultad');
    // const dif = document.getElementsByName('dificultad') as HTMLElement;

    const radio1 = document.getElementById('radio1') as HTMLInputElement;
    const radio2 = document.getElementById('radio2') as HTMLInputElement;
    const radio3 = document.getElementById('radio3') as HTMLInputElement;

    if (radio1.checked) {

      console.log('FACIL');
      this.numerocartas = '4';
      this.Mododificultad = 'facil';
   } else if (radio2.checked) {
     console.log('MEDIA');
     this.numerocartas = '5';
     this.Mododificultad = 'media';

  } else {
    console.log('DIFICIL');
    this.numerocartas = '6';
    this.Mododificultad = 'dificil';


   }
    if (this.familiaSeleccionada.relacion === true) {
     this.numerocartas = this.numerocartas * 2;
     console.log('POOR 2');
   } else {this.numerocartas = this.numerocartas; }

    console.log('MODO DIFICULTAD', this.Mododificultad);
    console.log('Familia SELECCIONADA', this.familiaSeleccionada.Nombre);

    this.seleccionarcartas();

  }

  async seleccionarcartas() {

    this.vectorcartas = await this.peticionesAPI.DameCartasFamilia(this.familiaSeleccionada.id).toPromise();
    console.log(this.vectorcartas, this.vectorcartas.length);

    this.preparaimagenes();

  }

  preparaimagenes() {

    console.log('VECTORCRTAS:', this.vectorcartas);
    console.log('LONGITUD VECTORCRTAS:', this.vectorcartas.length);

    for (let i = 0; i < this.vectorcartas.length; i++) {

      const elem = this.vectorcartas[i];
      this.vectorimagen[i] = URL.ImagenesCartas + elem.imagenDelante;

    }
    console.log(this.vectorimagen);

  }

  CartaSeleccionada(i) {

    console.log('CARTA SELECCIONADA', i);
    const carta = document.getElementById('carta' + i);
    console.log(this.vectorcartas[i]);
    this.vectorcartaseleccionadas.push(this.vectorcartas[i]);
    console.log('CARTAS SIN SELECCIONAR:', this.cartaseleccionada1, this.cartaseleccionada2);

    if (this.cartaseleccionada1 === undefined) {
      carta.style.border = '5px solid red';
      this.cartaseleccionada1 = carta;
      console.log('CARTA1', this.cartaseleccionada1);

    } else {
      this.cartaseleccionada2 = carta;
      console.log('CARTA2', this.cartaseleccionada2);


    }

    console.log('CARTAS SELECCIONADAS:', this.cartaseleccionada1, this.cartaseleccionada2);


    if (this.cartaseleccionada2 !== undefined) {



      if (this.cartaseleccionada1 === this.cartaseleccionada2) {

      console.log('MISMA CARTA');
      carta.style.border = '';

      } else {
        console.log('DIFERENTE CARTA');
        carta.style.border = '5px solid red';
      }

      this.cartaseleccionada1 = undefined;
      this.cartaseleccionada2 = undefined;
      console.log('CARTAS UNDEFINED:', this.cartaseleccionada1, this.cartaseleccionada2);


    }



    console.log(this.vectorcartaseleccionadas);


  }

  GuardarPuntuacionMemorama() {
    this.puntuacionCorrecta = this.myForm.value.PuntuacionCorrecta;
    this.puntuacionIncorrecta = this.myForm.value.PuntuacionIncorrecta;
    this.TiempoDuracion = this.myForm.value.TiempoDuracion;
  }
  RegistraCartas() {

    console.log('CARTAS QUE VAN A SER USADAS EN EL JUEGO:', this.vectorcartaseleccionadas);
    for (let i = 0; this.vectorcartaseleccionadas.length > i; i++) {
       this.idcartas.push(this.vectorcartaseleccionadas[i].id);
     }

    console.log(this.idcartas);

  }

  CrearJuegoDeMemorama() {

    let JuegoMemoramaaentrtrar: JuegoMEMORAMA;

    // tslint:disable-next-line:max-line-length
    JuegoMemoramaaentrtrar = new JuegoMEMORAMA(this.tipoDeJuegoSeleccionado, this.modoDeJuegoSeleccionado, this.familiaSeleccionada.id, true, this.nombreDelJuego, this.idcartas, this.puntuacionCorrecta, this.puntuacionIncorrecta, this.Mododificultad, this.TiempoDuracion);

    console.log('JuegoMemoramaaentrtrar:');
    console.log('JuegoMemoramaaentrtrar:', JuegoMemoramaaentrtrar);

    this.peticionesAPI.CreaJuegoDeMemorama(JuegoMemoramaaentrtrar, this.grupo.id)
      .subscribe(juegoCreado => {
                                this.juego = juegoCreado;
                                console.log(juegoCreado);
                                console.log('Juego creado correctamente');
                                this.sesion.TomaJuego(this.juego);
                                this.juegoCreado = true;

                                // Registrar la Creación del Juego
                                const evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juego.id, this.nombreDelJuego, 'Juego De Memorama');
                                this.calculos.RegistrarEvento(evento);
                                this.comService.EnviarNotificacionGrupo(1, this.grupo.id, `Nuevo Juego de Memorama para el Grupo ${this.grupo.Nombre}: ${this.nombreDelJuego}`);

                                // Asignamos a los participantes en el juego
                                if (this.modoDeJuegoSeleccionado === 'Individual') {
                                  for (let i = 0; i < this.alumnosGrupo.length; i++) {
                                    this.peticionesAPI.InscribeAlumnoJuegoDeMemorama(new AlumnoJuegoDeMemorama(this.alumnosGrupo[i].id, this.juego.id, 0, '00:00'))
                                      .subscribe();

                                    }
                                  } else {
                                    for (let i = 0; i < this.equiposGrupo.length; i++) {
                                      this.peticionesAPI.InscribeEquipoJuegoDeMemorama(new EquipoJuegoDeMemorama(this.equiposGrupo[i].id, this.juego.id))
                                        .subscribe();
                                      }
                                    }
                                Swal.fire('Juego de Memorama creado correctamente', ' ', 'success');

                                // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
                                if (this.juegosActivos === undefined) {
                                  // Si la lista aun no se ha creado no podre hacer el push
                                  this.juegosActivos = [];
                                }
                                this.juegosActivos.push(this.juego);
                                this.Limpiar();
                                // Regresamos a la lista de equipos (mat-tab con índice 0)
                                this.tabGroup.selectedIndex = 0;
    });
  }



  /// FUNCIONES PARA LA CREACION DE JUEGO DE COLECCIÓN

  // Recibo el nombre de la colección elegida en el componente hijo
  RecibeColeccion($event) {
    this.coleccionSeleccionada = $event;
    this.tengoColeccion = true;
  }

  CrearJuegoDeColeccion() {
    this.peticionesAPI.CreaJuegoDeColeccion(new Juego(this.tipoDeJuegoSeleccionado, this.modoDeJuegoSeleccionado, this.modoAsignacion,
      this.coleccionSeleccionada.id, undefined, undefined, undefined, undefined, undefined, undefined, this.nombreDelJuego), this.grupo.id)
      .subscribe(juegoCreado => {
        this.juego = juegoCreado;
        console.log(juegoCreado);
        console.log('Juego creado correctamente');
        this.sesion.TomaJuego(this.juego);
        this.juegoCreado = true;
          // Registrar la Creación del Juego
        // tslint:disable-next-line:max-line-length
        const evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juego.id, this.nombreDelJuego, 'Juego De Colección');

        this.calculos.RegistrarEvento(evento);
        // let evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juego.id, this.nombreDelJuego, "Juego De Colección");
        // this.peticionesAPI.CreaEvento(evento).subscribe((res) => {
        //   console.log("Registrado evento: ", res);
        // }, (err) => {
        //   console.log(err);
        // });

        // Notificar a los Alumnos del Grupo
        // tslint:disable-next-line:max-line-length
        this.comService.EnviarNotificacionGrupo(1, this.grupo.id, `Nuevo Juego de Colección para el Grupo ${this.grupo.Nombre}: ${this.nombreDelJuego}`);


        // Asignamos a los participantes en el juego
        if (this.modoDeJuegoSeleccionado === 'Individual') {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.alumnosGrupo.length; i++) {
            this.peticionesAPI.InscribeAlumnoJuegoDeColeccion(new AlumnoJuegoDeColeccion(this.alumnosGrupo[i].id, this.juego.id))
              .subscribe();
          }
        } else {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.equiposGrupo.length; i++) {
            this.peticionesAPI.InscribeEquipoJuegoDeColeccion(new EquipoJuegoDeColeccion(this.equiposGrupo[i].id, this.juego.id))
              .subscribe();
          }
        }
        Swal.fire('Juego de colección creado correctamente', ' ', 'success');

        // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
        if (this.juegosActivos === undefined) {
          // Si la lista aun no se ha creado no podre hacer el push
          this.juegosActivos = [];
        }
        this.juegosActivos.push(this.juego);
        this.Limpiar();
        // Regresamos a la lista de equipos (mat-tab con índice 0)
        this.tabGroup.selectedIndex = 0;
    });

  }

  //// FUNCIONES PARA LA CREACION DE JUEGO DE CUESTIONARIO

  RecibeCuestionarioElegido($event) {
    this.cuestionario = $event;
    this.tengoCuestionario = true;
  }
  // AbrirDialogoAgregarCuestionario(): void {
  //   const dialogRef = this.dialog.open(AsignaCuestionarioComponent, {
  //     width: '70%',
  //     height: '80%',
  //     position: {
  //       top: '0%'
  //     },
  //     // Pasamos los parametros necesarios
  //     data: {
  //       profesorId: this.profesorId
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(() => {
  //     this.cuestionario = this.sesion.DameCuestionario();
  //     this.tengoCuestionario = true;
  //     console.log('CUESTIONARIO SELECCIONADO --->' + this.cuestionario.Titulo);
  //   });
  // }

  // Para habilitar el boton de guardar puntuaciones

  TengoPuntuaciones() {
    if (this.myForm.value.PuntuacionCorrecta === '' || this.myForm.value.PuntuacionIncorrecta === '') {
      return false;
    } else {
      return true;
    }
  }

  GuardarPuntuacion() {
    this.puntuacionCorrecta = this.myForm.value.PuntuacionCorrecta;
    this.puntuacionIncorrecta = this.myForm.value.PuntuacionIncorrecta;
  }
  GuardarModoPresentacion(modoPresentacion) {
    this.modoPresentacion = modoPresentacion;
    this.tengoModoPresentacion = true;
  }

  // El modo de puntuación solo se aplica en el caso de juego en equipo clasico.
  // En ese caso hay dos opciones: puntua el primero del equipo que responde o puntua la media de todos los del equipo
  // En el primer caso ya  no hay que especificar nada mas porque todos los participantes van a recibir las
  // preguntas y respuestas en el mismo orden. En el campo Presentacion del modelo del juego pondremos "Primero"
  // En el segundo caso, todos los alumnos deben responder y entonces pueden pantearse los tres modos habituales
  // de presentación de las preguntas/respuestas:
  //      'Mismo orden para todos',
  //      'Preguntas desordenadas',
  //      'Preguntas y respuestas desordenadas'];
  //


  GuardarFormaDePuntuacion() {
    // Si hemos elegido que puntua el primero entonces hay que indicarlo en la variable modoPresentacion
    // En caso contrario, ya está bien lo que haya en esa variable
    if (!this.puntuaLaMedia) {
      this.modoPresentacion = 'Primero';
    }

  }

  GuardarTiempoLimite() {
    this.tiempoLimite = this.myForm.value.TiempoLimite;
    if (this.tiempoLimite === undefined) {
      this.tiempoLimite = 0;
    }
  }
  ModalidadDeJuegoSeleccionada(modalidad: ChipColor) {
    if (this.modoDeJuegoSeleccionado === 'Equipos' && modalidad.nombre === 'Kahoot') {
      Swal.fire('Atención', 'La modalidad Kahoot no está implementada para los juegos de cuestionario en equipo', 'error');
    } else {
      this.modalidadSeleccionada = modalidad.nombre;
      this.tengoModalidad = true;
    }
  }

  TipoDeJuegoDeCuestionarioSeleccionado(tipoJuegoCuestionario: ChipColor) {
    this.tipoDeJuegoDeCuestionarioSeleccionado = tipoJuegoCuestionario.nombre;
    this.tengoTipoJuegoCuestionario = true;
  }

  CrearJuegoDeCuestionario() {

    // Tengo que crear un juego de tipo JuegoDeCuestionario y no uno de tipo Juego, como en los casos
    // anteriores. La razón es que no están bien organizado el tema de que los modelos de los diferentes juegos
    // tomen como base el modelo Juego genérico. De momento se queda así.


    // tslint:disable-next-line:max-line-length

    // tslint:disable-next-line:max-line-length
    const juego = new JuegoDeCuestionario (this.nombreDelJuego, this.tipoDeJuegoSeleccionado, this.modoDeJuegoSeleccionado, this.modalidadSeleccionada, this.puntuacionCorrecta,
      this.puntuacionIncorrecta, this.modoPresentacion,
      false, false, this.profesorId, this.grupo.id, this.cuestionario.id, this.tiempoLimite);
    console.log ('voy a crear juego ', juego);
    this.peticionesAPI.CreaJuegoDeCuestionario(juego, this.grupo.id)
      .subscribe(juegoCreado => {
        this.juegoDeCuestionario = juegoCreado;
        console.log ('Modo de juego ', this.modoDeJuegoSeleccionado);
        // Registrar la Creación del Juego
        // tslint:disable-next-line:max-line-length
        const evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juegoDeCuestionario.id, this.nombreDelJuego, 'Juego De Cuestionario');
        this.calculos.RegistrarEvento(evento);
        // let evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juego.id, this.nombreDelJuego, "Juego De Cuestionario");
        // this.peticionesAPI.CreaEvento(evento).subscribe((res) => {
        //   console.log("Registrado evento: ", res);
        // }, (err) => {
        //   console.log(err);
        // });

        // Notificar a los Alumnos del Grupo
        // tslint:disable-next-line:max-line-length
        this.comService.EnviarNotificacionGrupo(1, this.grupo.id, `Nuevo Juego de Cuestionario para el Grupo ${this.grupo.Nombre}: ${this.nombreDelJuego}`);

        // tslint:disable-next-line:max-line-length
        if ((this.modoDeJuegoSeleccionado === 'Individual') || ((this.modoDeJuegoSeleccionado === 'Equipos') && (this.modoPresentacion !== 'Primero'))) {
          // Aunque el juego sea en equipo, si la modalidad es que todos los del equipo responden y puntua la media entonces necesito
          // inscripciones individuales
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.alumnosGrupo.length; i++) {
            // tslint:disable-next-line:max-line-length
            this.peticionesAPI.InscribeAlumnoJuegoDeCuestionario(new AlumnoJuegoDeCuestionario(0, false, this.juegoDeCuestionario.id, this.alumnosGrupo[i].id))
              .subscribe();
          }
        } else {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.equiposGrupo.length; i++) {
            // tslint:disable-next-line:max-line-length
            this.peticionesAPI.InscribeEquipoJuegoDeCuestionario(new EquipoJuegoDeCuestionario(0, false, this.juegoDeCuestionario.id, this.equiposGrupo[i].id))
              .subscribe();
          }

        }
        Swal.fire('Juego de cuestionario creado correctamente', ' ', 'success');

        // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
        if (this.juegosPreparados === undefined) {
          // Si la lista aun no se ha creado no podre hacer el push
          this.juegosPreparados = [];
        }
        this.juegosPreparados.push(this.juegoDeCuestionario);
        this.Limpiar();
        // Regresamos a la lista de equipos (mat-tab con índice 0)
        this.tabGroup.selectedIndex = 0;

      });
  }


  // CrearJuegoLibro() {

  //   const juego = new JuegoDeLibros(this.nombreDelJuego,
  //     this.tipoDeJuegoSeleccionado,
  //     this.modoDeJuegoSeleccionado,
  //     true);
  //   juego.descripcion = this.myForm.value.descripcionlibro;
  //   juego.Temporada = 'SI';
  //   juego.criterioprivilegio1 = this.myForm.value.criterioprivilegio1;
  //   juego.criterioprivilegio2 = this.myForm.value.criterioprivilegio2;
  //   juego.criterioprivilegio3 = this.myForm.value.criterioprivilegio3;



  //   this.peticionesAPI.crearjuegolibro(juego, this.grupo.id)
  //     .subscribe(juego => {

  //       if (this.siConcurso == true) {
  //         this.crearConcurso(juego.id);
  //       }

  //       this.crearRecursoJuegoLibro(juego.id);

  //       this.juegoDeLibro = juego;


  //       if (this.modoDeJuegoSeleccionado === 'Individual') {

  //         console.log('Voy a inscribir a los alumnos del grupo');
  //         // tslint:disable-next-line:max-line-length
  //         if (this.modoDeJuegoSeleccionado === 'Individual') {
  //           console.log('Voy a inscribir a los alumnos del grupo');
  //           // tslint:disable-next-line:prefer-for-of
  //           for (let i = 0; i < this.alumnosGrupo.length; i++) {
  //             // tslint:disable-next-line:max-line-length
  //             console.log('inscribo');

  //             var alumno = new AlumnoJuegoDeLibro;
  //             alumno.nivel1 = this.nivel1;
  //             alumno.nivel2 = this.nivel2;
  //             alumno.nivel3 = this.nivel3;
  //             alumno.permisoparaver = this.permisoparaver;
  //             alumno.permisoparavotar = this.permisoparavotar;
  //             alumno.alumnoID = this.alumnosGrupo[i].id;
  //             alumno.Nombre = this.alumnosGrupo[i].Nombre;



  //             var id = this.juegoDeLibro.id;

  //             this.peticionesAPI.InscribeAlumnojuegoDelibro(alumno, id)
  //               .subscribe((res) => {
  //                 console.log(res);
  //               }
  //                 , (err) => {
  //                   console.log(err);

  //                 });
  //           }
  //         } else {

  //         }
  //         Swal.fire('Juego de libro creado correctamente', ' ', 'success');


  //         if (this.juegosActivos === undefined) {

  //           this.juegosActivos = [];
  //         }
  //         this.juegosActivos.push(this.juegoDeLibro);
  //         this.Limpiar();

  //         this.tabGroup.selectedIndex = 0;
  //       }
  //     });
  // }

  // public onDate(event): void {
  //   var e = event;
  //   console.log(event);
  // }

  // crearConcurso(idLibro: any) {
  //   this.concursoLibro.acabado = false;
  //   this.peticionesAPI.crearConcurso(idLibro, this.concursoLibro)
  //     .subscribe((res) => {
  //       this.siConcurso = false;

  //     }, (err) => {
  //       console.log(err);
  //     })
  // }

  // crearRecursoJuegoLibro(idLibro: any) {
  //   this.peticionesAPI.crearRecursosJuegoLibro(idLibro, this.recursoParaLibro)
  //     .subscribe((res) => {
  //       this.siConcurso = false;

  //     }, (err) => {
  //       console.log(err);
  //     })
  // }

  // guardarConcurso() {
  //   this.concursoLibro = new concursoLibro();

  //   this.concursoLibro.concursoTematica = this.myForm.value.concursoTematica;
  //   this.concursoLibro.dateFinInscripcion = this.myForm.value.dateFinInscripcion;
  //   this.concursoLibro.dateFinVotacion = this.myForm.value.dateFinVotacion;
  //   this.concursoLibro.concursoRequisitos = this.myForm.value.concursoRequisitos;
  //   this.concursoLibro.concursoPrimerCriterio = this.myForm.value.concursoPrimerCriterio;
  //   this.concursoLibro.concursoSegundoCriterio = this.myForm.value.concursoSegundoCriterio;
  //   this.concursoLibro.concursoTercerCriterio = this.myForm.value.concursoTercerCriterio;
  //   this.concursoLibro.listaLibrosParticipantes = [];
  //   this.siConcurso = true;
  //   this.concursoLibro.peso1 = this.myForm.value.c1;
  //   this.concursoLibro.peso2 = this.myForm.value.c2;
  //   this.concursoLibro.peso3 = this.myForm.value.c3;

  // }




  // inscribir(inscribirt) {
  //   console.log(inscribirt);
  //   this.inscribirtemporada = inscribirt;
  // }


  // RecibeRecursos($event) {
  //   this.recursoElegido = $event;
  //   this.tengoRecurso = true;
  //   localStorage.setItem("idRecursoLibros", this.recursoElegido[0].toString());
  // }

  // cargaRecursos($event) {
  //   this.recursoCargadoParaGuardar = $event;


  //   this.recursoParaLibro = new RecursoLibroJuego;
  //   this.recursoParaLibro.nombre = this.recursoCargadoParaGuardar.nombre;
  //   this.recursoParaLibro.carpeta = this.recursoCargadoParaGuardar.carpeta;
  //   this.recursoParaLibro.imagenes = this.recursoCargadoParaGuardar.imagenes;
  //   this.recursoParaLibro.juegoId = 0;


  //   this.tengoRecursoCargadoParaGuardar = true;
  // }



  //// FUNCIONES PARA LA CREACION DE UN JUEGO DE AVATARES

  RecibeFamiliasElegidas($event) {
    this.familiasElegidas = $event;
    this.tengoFamilias = true;
  }


  CrearJuegoDeAvatar() {

    const juego = new JuegoDeAvatar(this.nombreDelJuego,
      this.tipoDeJuegoSeleccionado,
      this.modoDeJuegoSeleccionado,
      true);
    juego.Familias = this.familiasElegidas;
    juego.CriteriosPrivilegioComplemento1 = this.myForm.value.criterioPrivilegioComplemento1;
    juego.CriteriosPrivilegioComplemento2 = this.myForm.value.criterioPrivilegioComplemento2;
    juego.CriteriosPrivilegioComplemento3 = this.myForm.value.criterioPrivilegioComplemento3;
    juego.CriteriosPrivilegioComplemento4 = this.myForm.value.criterioPrivilegioComplemento4;
    juego.CriteriosPrivilegioVoz = this.myForm.value.criterioPrivilegioVoz;
    juego.CriteriosPrivilegioVerTodos = this.myForm.value.criterioPrivilegioVerTodos;

    this.peticionesAPI.CreaJuegoDeAvatar(juego, this.grupo.id)
      .subscribe(nuevoJuego => {
        this.juegoDeAvatar = nuevoJuego;

        // Registrar la Creación del Juego
        // tslint:disable-next-line:max-line-length
        const evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juegoDeAvatar.id, this.nombreDelJuego, 'Juego De Avatar');
        this.calculos.RegistrarEvento(evento);

        // let evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juegoDeAvatar.id, this.nombreDelJuego, "Juego De Avatar");
        // this.peticionesAPI.CreaEvento(evento).subscribe((res) => {
        //    console.log("Registrado evento: ", res);
        //  }, (err) => {
        //    console.log(err);
        //  });

        // Notificar a los Alumnos del Grupo
        // tslint:disable-next-line:max-line-length
        this.comService.EnviarNotificacionGrupo(1, this.grupo.id, `Nuevo Juego de Avatar para el Grupo ${this.grupo.Nombre}: ${this.juegoDeAvatar.NombreJuego}`);

        // Ahora inscribimos en el juego a los participantes
        if (this.modoDeJuegoSeleccionado === 'Individual') {

          console.log('Voy a inscribir a los alumnos del grupo');
          // tslint:disable-next-line:max-line-length
          if (this.modoDeJuegoSeleccionado === 'Individual') {
            console.log('Voy a inscribir a los alumnos del grupo');
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.alumnosGrupo.length; i++) {
              // tslint:disable-next-line:max-line-length
              console.log('inscribo');
              this.peticionesAPI.InscribeAlumnoJuegoDeAvatar(new AlumnoJuegoDeAvatar(this.alumnosGrupo[i].id, this.juegoDeAvatar.id))
                .subscribe();
            }
          } else {
            // Inscribo a los equipos
          }
          Swal.fire('Juego de avatares creado correctamente', ' ', 'success');

          // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
          if (this.juegosActivos === undefined) {
            // Si la lista aun no se ha creado no podre hacer el push
            this.juegosActivos = [];
          }
          this.juegosActivos.push(this.juegoDeAvatar);
          this.Limpiar();
          // Regresamos a la lista de equipos (mat-tab con índice 0)
          this.tabGroup.selectedIndex = 0;
        }
      });
  }

  // FUNCIONES PARA CREAR JUEGO DE COMPETICION
  TipoDeCompeticionSeleccionado(tipoCompeticion: ChipColor) {
    this.tipoDeCompeticionSeleccionado = tipoCompeticion.nombre;
    this.tengoTipoDeCompeticion = true;
  }
  TipoDeTorneoSeleccionado(tipoTorneo: ChipColor) {
    if (tipoTorneo.nombre === 'Doble Eliminación') {
      Swal.fire('Error', 'Tipo de torneo no disponible aún', 'error');
    }
    if (tipoTorneo.nombre === 'Suizo') {
      Swal.fire('Error', 'Tipo de torneo no disponible aún', 'error');
    }
    if (tipoTorneo.nombre === 'Clásico') {
      this.tipoDeTorneoSeleccionado = tipoTorneo.nombre;
      this.tengoTipoDeTorneo = true;
    }

  }
  dropParticipantes(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.ParticipantesTorneo, event.previousIndex, event.currentIndex);
    this.CuadroModificado = true;
  }
  GuardarNumeroDeJornadas() {
    this.numeroDeJornadas = this.myForm.value.NumeroDeJornadas;
    if (this.numeroDeJornadas === undefined || isNaN(this.numeroDeJornadas)) {
      this.tengoNumeroDeJornadas = false;
      Swal.fire('Introduzca un número de jornadas válido', 'Le recordamos que debe ser un número', 'error');
    } else {
      console.log('tengo numero');
      this.tengoNumeroDeJornadas = true;
    }
  }

  GuardarNuevaPuntuacion() {
    this.nuevaPuntuacion = this.myForm.value.NuevaPuntuacion;
    console.log('tengo nueva puntuacion ' + this.nuevaPuntuacion);
    this.tengoNuevaPuntuacion = true;

  }

  Preparado() {
    if ((this.tengoNuevaPuntuacion) && (this.selection.selected.length > 0)) {
      return true;
    } else {
      return false;
    }
  }

  AnadirPuntos() {
    console.log('nueva puntuiacion');
    console.log(this.nuevaPuntuacion);
    if (!isNaN(this.nuevaPuntuacion)) {
      for (let i = 0; i < this.dataSource.data.length; i++) {
        // Buscamos los alumnos que hemos seleccionado
        if (this.selection.isSelected(this.dataSource.data[i])) {
          this.Puntuacion[i] = Number(this.nuevaPuntuacion);
          this.TablaPuntuacion[i].Puntuacion = this.nuevaPuntuacion;
        }
      }
    } else {
      Swal.fire('Introduzca una puntuación válida', 'Le recordamos que debe ser un Número', 'error');
    }
    this.dataSource = new MatTableDataSource(this.TablaPuntuacion);
    this.selection.clear();
    this.tengoNuevaPuntuacion = false;
  }

  AnadirFila() {

    let i: number;
    let NumeroParticipantes: number;
    i = this.Puntuacion.length;
    console.log(i);
    console.log(this.Puntuacion);
    if (this.modoDeJuegoSeleccionado === 'Individual') {
      NumeroParticipantes = this.alumnosGrupo.length;
    } else {
      NumeroParticipantes = this.equiposGrupo.length;
    }

    if (i < NumeroParticipantes) {
      this.TablaPuntuacion[i] = new TablaPuntosFormulaUno(i + 1, 1);
      this.Puntuacion[i] = this.TablaPuntuacion[i].Puntuacion;
      console.log(this.TablaPuntuacion[i]);

      this.dataSource = new MatTableDataSource(this.TablaPuntuacion);
    } else {
      Swal.fire('No es posible añadir otra fila', 'Ya puntuan todos los participantes', 'error');
    }

  }

  EliminarFila() {

    let i: number;
    i = this.Puntuacion.length;
    console.log(i);
    console.log(this.Puntuacion);
    if (i > 1) {
      this.TablaPuntuacion = this.TablaPuntuacion.splice(0, i - 1);
      this.Puntuacion = this.Puntuacion.slice(0, i - 1);
      console.log(this.TablaPuntuacion);
      console.log(this.Puntuacion);

      this.dataSource = new MatTableDataSource(this.TablaPuntuacion);
    } else {
      Swal.fire('No es posible eliminar otra fila', 'Como mínimo debe puntuar un participante', 'error');
    }

  }


  CrearJuegoDeCompeticionLiga() {

    // tslint:disable-next-line:max-line-lengtholean)

    this.peticionesAPI.CreaJuegoDeCompeticionLiga(new Juego(this.tipoDeJuegoSeleccionado + ' ' + this.tipoDeCompeticionSeleccionado,
      this.modoDeJuegoSeleccionado, undefined, undefined, true, this.numeroDeJornadas,
      this.tipoDeCompeticionSeleccionado, undefined,
      undefined, undefined, this.nombreDelJuego), this.grupo.id)
      .subscribe(juegoCreado => {
        this.juego = juegoCreado;
        this.sesion.TomaJuego(this.juego);
        this.juegoCreado = true;
        // Registrar la Creación del Juego
        // tslint:disable-next-line:max-line-length
        const evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juego.id, this.nombreDelJuego, 'Juego De Competición Liga');
        this.calculos.RegistrarEvento (evento);

        // let evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juego.id, this.nombreDelJuego, "Juego De Competición Liga");
        // this.peticionesAPI.CreaEvento(evento).subscribe((res) => {
        //   console.log("Registrado evento: ", res);
        // }, (err) => {
        //   console.log(err);
        // });

        // Notificar a los Alumnos del Grupo
        // tslint:disable-next-line:max-line-length
        this.comService.EnviarNotificacionGrupo(1, this.grupo.id, `Nuevo Juego De Competición Liga para el Grupo ${this.grupo.Nombre}: ${this.nombreDelJuego}`);

        // Creamos las jornadas
        console.log('voy a crear jornadas');
        this.calculos.CrearJornadasLiga(this.numeroDeJornadas, this.juego.id)
          .subscribe(jornadas => {
            this.jornadasLiga = jornadas;
            console.log('Jornadas creadas correctamente');
            console.log(this.jornadasLiga);
            console.log(this.jornadasLiga.length);

            if (this.modoDeJuegoSeleccionado === 'Individual') {
              // tslint:disable-next-line:max-line-length
              this.calculos.calcularLiga(this.alumnosGrupo.length, this.jornadasLiga.length, this.alumnosGrupo, this.grupo.id, this.jornadasLiga);
              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < this.alumnosGrupo.length; i++) {
                // tslint:disable-next-line:max-line-length
                this.peticionesAPI.InscribeAlumnoJuegoDeCompeticionLiga(new AlumnoJuegoDeCompeticionLiga(this.alumnosGrupo[i].id, this.juego.id))
                  .subscribe();
              }
            } else {

              // tslint:disable-next-line:max-line-length
              this.calculos.calcularLiga(this.equiposGrupo.length, this.jornadasLiga.length, this.equiposGrupo, this.grupo.id, this.jornadasLiga);

              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < this.equiposGrupo.length; i++) {
                // tslint:disable-next-line:max-line-length
                this.peticionesAPI.InscribeEquipoJuegoDeCompeticionLiga(new EquipoJuegoDeCompeticionLiga(this.equiposGrupo[i].id, this.juego.id))
                  .subscribe();
              }
            }
            Swal.fire('Juego de competición tipo liga creado correctamente', ' ', 'success');
            // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
            if (this.juegosActivos === undefined) {
              // Si la lista aun no se ha creado no podre hacer el push
              this.juegosActivos = [];
            }
            this.juegosActivos.push(this.juego);
            this.Limpiar();
            // Regresamos a la lista de equipos (mat-tab con índice 0)
            this.tabGroup.selectedIndex = 0;
          });
      });
  }


  CrearJuegoDeCompeticionFormulaUno() {
    // tslint:disable-next-line:max-line-length

    this.peticionesAPI.CreaJuegoDeCompeticionFormulaUno(new Juego(this.tipoDeJuegoSeleccionado + ' ' + this.tipoDeCompeticionSeleccionado,
      this.modoDeJuegoSeleccionado, undefined, undefined, true, this.numeroDeJornadas,
      undefined, undefined, this.Puntuacion.length,
      this.Puntuacion, this.nombreDelJuego), this.grupo.id)
      .subscribe(juegoCreado => {
        this.juego = juegoCreado;
        this.sesion.TomaJuego(this.juego);
        this.juegoCreado = true;
        // Registrar la Creación del Juego
        // tslint:disable-next-line:max-line-length
        const evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juego.id, this.nombreDelJuego, 'Juego De Competición Fórmula Uno');

        this.calculos.RegistrarEvento (evento);

        // let evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juego.id, this.nombreDelJuego, "Juego De Competición Fórmula Uno");
        // this.peticionesAPI.CreaEvento(evento).subscribe((res) => {
        //   console.log("Registrado evento: ", res);
        // }, (err) => {
        //   console.log(err);
        // });

        // Notificar a los Alumnos del Grupo
        // tslint:disable-next-line:max-line-length
        this.comService.EnviarNotificacionGrupo(1, this.grupo.id, `Nuevo Juego De Competición Fórmula Uno para el Grupo ${this.grupo.Nombre}: ${this.nombreDelJuego}`);

        this.calculos.CrearJornadasFormulaUno(this.numeroDeJornadas, this.juego.id)
          .subscribe(jornadas => {
            this.jornadasFormulaUno = jornadas;
            this.sesion.TomaDatosJornadasJuegoComponent(this.jornadasFormulaUno);

            // inscribo a los participantes
            if (this.modoDeJuegoSeleccionado === 'Individual') {
              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < this.alumnosGrupo.length; i++) {
                // tslint:disable-next-line:max-line-length
                this.peticionesAPI.InscribeAlumnoJuegoDeCompeticionFormulaUno(new AlumnoJuegoDeCompeticionFormulaUno(this.alumnosGrupo[i].id, this.juego.id))
                  .subscribe();
              }
            } else {
              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < this.equiposGrupo.length; i++) {
                // tslint:disable-next-line:max-line-length
                this.peticionesAPI.InscribeEquipoJuegoDeCompeticionFormulaUno(new EquipoJuegoDeCompeticionFormulaUno(this.equiposGrupo[i].id, this.juego.id))
                  .subscribe();
              }
            }
            Swal.fire('Juego de competición tipo fórmula uno creado correctamente', ' ', 'success');

            // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
            if (this.juegosActivos === undefined) {
              // Si la lista aun no se ha creado no podre hacer el push
              this.juegosActivos = [];
            }
            this.juegosActivos.push(this.juego);
            // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
            this.Limpiar();
            // Regresamos a la lista de equipos (mat-tab con índice 0)
            this.tabGroup.selectedIndex = 0;

          });
      });
  }

  CrearCuadroTorneo() {

    console.log('Voy a calcular el cuadro del torneo');
    if (this.modoDeJuegoSeleccionado === 'Individual') {

        this.ParticipantesTorneo = this.calculos.calcularCuadro(this.alumnosGrupo);
    } else {
        this.ParticipantesTorneo = this.calculos.calcularCuadro(this.equiposGrupo);
    }
    console.log('CUADRO', this.ParticipantesTorneo);
  }

  EsEmparejamientoPar(n: number): boolean {
    const res = Math.floor (n / 2) % 2;
    if (res  === 0) {
      return true;
    } else {
      return false;
    }
  }

  HayEnfrentamientoEntreFantasmas(): boolean {
    for (let i = 0; i < this.ParticipantesTorneo.length; i = i + 2) {
        if ((this.ParticipantesTorneo[i] === undefined) && (this.ParticipantesTorneo[i + 1] === undefined)) {
          return true;
        }
    }
    return false;
  }

  CrearJuegoDeCompeticionTorneo() {

    // tslint:disable-next-line:max-line-lengtholean)
    console.log('voy a crear torneo');
    console.log ('participantes ', this.ParticipantesTorneo);
    const nuevojuego = new Juego (this.tipoDeJuegoSeleccionado + ' ' + this.tipoDeCompeticionSeleccionado,
    this.modoDeJuegoSeleccionado, undefined, undefined, true, 3,
    this.tipoDeCompeticionSeleccionado, this.tipoDeTorneoSeleccionado,
    undefined, undefined, this.nombreDelJuego, undefined , undefined, undefined, undefined, this.profesorId, undefined);
    console.log(nuevojuego);
    this.peticionesAPI.CreaJuegoDeCompeticionTorneo(nuevojuego, this.grupo.id)
    .subscribe(juegoCreado => {
      this.juego = juegoCreado;
      this.sesion.TomaJuego(this.juego);
      this.juegoCreado = true;
      const evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juego.id, this.nombreDelJuego, 'Juego De Competición Torneo');
      this.calculos.RegistrarEvento (evento);
      this.comService.EnviarNotificacionGrupo(1, this.grupo.id, `Nuevo Juego De Competición Torneo para el Grupo ${this.grupo.Nombre}: ${this.nombreDelJuego}`);
      // Creamos las jornadas
      console.log ('voy a crear jornadas');
      this.calculos.CrearJornadasTorneo(this.ParticipantesTorneo, this.juego.id, this.juego.ModeloTorneo)
      .subscribe ( jornadas => {
        this.jornadasTorneo = jornadas;
        console.log('Jornadas creadas correctamente');
        // Creamos Enfrentamientos
        this.calculos.CrearEnfrentamientosTorneo(this.ParticipantesTorneo, this.jornadasTorneo);
        console.log('Enfrentamientos creados correctamente');
        if (this.modoDeJuegoSeleccionado === 'Individual') {

          // tslint:disable-next-line:prefer-for-of
           for (let i = 0; i < this.alumnosGrupo.length; i++) {
            // tslint:disable-next-line:max-line-length
            if (this.alumnosGrupo[i] !== undefined) {
              this.peticionesAPI.InscribeAlumnoJuegoDeCompeticionTorneo(new AlumnoJuegoDeCompeticionTorneo(this.alumnosGrupo[i].id, this.juego.id))
              .subscribe();
            }
          }
        } else {

          // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.equiposGrupo.length; i++) {
            // tslint:disable-next-line:max-line-length
              if (this.equiposGrupo[i] !== undefined) {
                console.log('Equipo: ' + this.equiposGrupo[i].id);
                this.peticionesAPI.InscribeEquipoJuegoDeCompeticionTorneo(new EquipoJuegoDeCompeticionTorneo(this.equiposGrupo[i].id, this.juego.id))
                .subscribe();
                console.log('Equipo añadido');
              }
          }
        }
        Swal.fire('Juego de competición tipo Torneo creado correctamente', ' ', 'success');
        // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
        if (this.juegosActivos === undefined) {
        // Si la lista aun no se ha creado no podre hacer el push
              this.juegosActivos = [];
          }
        this.juegosActivos.push (this.juego);
        this.Limpiar();
        // Regresamos a la lista de equipos (mat-tab con índice 0)
        this.tabGroup.selectedIndex = 0;
      });
    });

  }

  /// Funciones para craar juego de Geocatching
  // Geocaching
  // AbrirDialogoAgregarEscenario(): void {
  //   const dialogRef = this.dialog.open(AsignaEscenarioComponent, {
  //     width: '70%',
  //     height: '80%',
  //     position: {
  //       top: '0%'
  //     },
  //     // Pasamos los parametros necesarios
  //     data: {
  //       profesorId: this.profesorId
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(() => {
  //     this.escenario = this.sesion.DameEscenario();

  //     console.log('ESCENARIO SELECCIONADO --->' + this.escenario.Mapa);
  //     this.DamePuntosGeolocalizablesDelEscenario(this.escenario);
  //     console.log(this.numeroDePuntosGeolocalizables);
  //     console.log(this.puntosgeolocalizablesEscenario);
  //   });
  // }

  RecibeEscenario($event) {
    this.escenario = $event;
    this.tengoEscenario = true;
    console.log ('he recibido escenario');
    this.DamePuntosGeolocalizablesDelEscenario(this.escenario);
  }

  DamePuntosGeolocalizablesDelEscenario(escenario: Escenario) {

    console.log('voy a mostrar los puntosgeolocalizables del escenario ' + escenario.id);
    this.peticionesAPI.DamePuntosGeolocalizablesEscenario(escenario.id)
      .subscribe(res => {
        if (res[0] !== undefined) {
          this.puntosgeolocalizablesEscenario = res;
          console.log(res);
          this.numeroDePuntosGeolocalizables = this.puntosgeolocalizablesEscenario.length;
          console.log(this.numeroDePuntosGeolocalizables);
          this.tengoEscenario = true;
        } else {
          console.log('No hay puntosgeolocalizables en el escenario');
          this.puntosgeolocalizablesEscenario = undefined;
          this.numeroDePuntosGeolocalizables = 0;
        }
      });
  }

  AbrirDialogoAgregarPreguntas(): void {
    const dialogRef = this.dialog.open(AsignaPreguntasComponent, {
      width: '70%',
      height: '80%',
      position: {
        top: '0%'
      },
      // Pasamos los parametros necesarios
      data: {
        profesorId: this.profesorId,
        numeroDePuntosGeolocalizables: this.numeroDePuntosGeolocalizables

      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.PreguntasBasicas = this.sesion.DameIdPreguntasBasicas();
      this.PreguntasBonus = this.sesion.DameIdPreguntasBonus();
      this.tengoPreguntas = true;
      console.log('comprobacion de que se reciben los id de las preguntas');
      console.log(this.PreguntasBasicas);
      console.log(this.PreguntasBonus);

    });
  }


  // Para habilitar el boton de guardar puntuaciones
  TengoPuntuacionesGeocatching() {
    if (this.myForm.value.PuntuacionCorrectaGeo === '' ||
      this.myForm.value.PuntuacionIncorrectaGeo === '' ||
      this.myForm.value.PuntuacionCorrectaGeoBonus === '' ||
      this.myForm.value.PuntuacionIncorrectaGeoBonus === '') {
      return false;
    } else {
      return true;
    }
  }
  GuardarPuntuacionGeocaching() {
    this.puntuacionCorrectaGeo = this.myForm.value.PuntuacionCorrectaGeo;
    this.puntuacionIncorrectaGeo = this.myForm.value.PuntuacionIncorrectaGeo;
    this.puntuacionCorrectaGeoBonus = this.myForm.value.PuntuacionCorrectaGeoBonus;
    this.puntuacionIncorrectaGeoBonus = this.myForm.value.PuntuacionIncorrectaGeoBonus;
  }

  CrearJuegoDeGeocaching() {
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.CreaJuegoDeGeocaching(new JuegoDeGeocaching(this.nombreDelJuego, this.tipoDeJuegoSeleccionado, this.puntuacionCorrectaGeo, this.puntuacionIncorrectaGeo, this.puntuacionCorrectaGeoBonus, this.puntuacionIncorrectaGeoBonus, this.PreguntasBasicas, this.PreguntasBonus,
      false, false, this.profesorId, this.grupo.id, this.escenario.id), this.grupo.id)
      .subscribe(juegoCreado => {
        this.juegoDeGeocaching = juegoCreado;
        this.juegoCreado = true;

        // Registrar la Creación del Juego
        // tslint:disable-next-line:max-line-length
        const evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, juegoCreado.id, this.nombreDelJuego, 'Juego De Geocaching');
        this.calculos.RegistrarEvento(evento);

        // let evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juego.id, this.nombreDelJuego, "Juego De Geocaching");
        // this.peticionesAPI.CreaEvento(evento).subscribe((res) => {
        //   console.log("Registrado evento: ", res);
        // }, (err) => {
        //   console.log(err);
        // });

        // Notificar a los Alumnos del Grupo
        // tslint:disable-next-line:max-line-length
        this.comService.EnviarNotificacionGrupo(1, this.grupo.id, `Nuevo Juego De Geocaching para el Grupo ${this.grupo.Nombre}: ${this.nombreDelJuego}`);

        // Inscribimos a los alumnos en el juego
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.alumnosGrupo.length; i++) {
          // tslint:disable-next-line:max-line-length
          this.peticionesAPI.InscribeAlumnoJuegoDeGeocaching(new AlumnoJuegoDeGeocaching(0, 0, this.alumnosGrupo[i].id, this.juegoDeGeocaching.id))
            .subscribe();
        }
        Swal.fire('Juego de geocaching creado correctamente', ' ', 'success');

        // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
        if (this.juegosPreparados === undefined) {
          // Si la lista aun no se ha creado no podre hacer el push
          this.juegosPreparados = [];
        }
        this.juegosPreparados.push(this.juegoDeGeocaching);
        // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
        this.Limpiar();
        // Regresamos a la lista de equipos (mat-tab con índice 0)
        this.tabGroup.selectedIndex = 0;
      });
  }

  // Funciones para crear juego de votación
  // Para crear el juego de votación de tipo Uno A Todos se usa la tabla
  // de asignación de puntuaciones que ya se usa en la competición de Formula Uno
  // junto con las funciones asociadas, porque lo que hay que hacer es exactamente lo mismo

  TipoDeVotacionSeleccionado(tipoVotacion: ChipColor) {
    // tslint:disable-next-line:max-line-length
    if ((this.modoDeJuegoSeleccionado === 'Equipos') && ((tipoVotacion.nombre === 'Todos A Uno') || (tipoVotacion.nombre === 'Votar opciones'))) {
      Swal.fire('Alerta', 'Aún no es posible ete tipo de juego de votación en EQUIPO', 'warning');
    } else {
      this.tipoDeVotacionSeleccionado = tipoVotacion.nombre;
      this.tengoTipoDeVotacion = true;
    }
  }

  ModoDeRepartoSeleccionado(modoReparto: ChipColor) {
    this.modoDeRepartoSeleccionado = modoReparto.nombre;
    this.tengoModoReparto = true;
  }
  // formatLabel(value: number) {
  //   // if (value >= 1000) {
  //   //   return Math.round(value / 1000) + 'k';
  //   // }

  //   this.puntosARepartir = value;
  //   console.log ('aaaa: ' + value);
  //   console.log ('bbb: ' + this.puntosARepartir);
  //   return value;
  // }
  GuardaValor(event) {
    this.puntosARepartir = event.value;
    this.Puntuacion[0] = this.puntosARepartir;
  }
  GuardarQuienVota() {
    let radio = document.getElementsByName('autovotacion')[0] as HTMLInputElement;
    if (radio.checked ) {
      this.autovotacion = true;
    } else {
      this.autovotacion = false;
    }
    if (this.modoDeJuegoSeleccionado === 'Equipos') {
      radio = document.getElementsByName('quien')[0] as HTMLInputElement;
      if (radio.checked ) {
        this.votanEquipos = true;
      } else {
        this.votanEquipos = false;
      }
    }
  }

  CrearJuegoDeVotacionUnoATodos() {
    const jjj = new JuegoDeVotacionUnoATodos ();
    const juegoDeVotacion = new JuegoDeVotacionUnoATodos(
      this.tipoDeJuegoSeleccionado + ' ' + this.tipoDeVotacionSeleccionado,
      this.modoDeJuegoSeleccionado,
      this.modoDeRepartoSeleccionado,
      this.autoevaluacion,
      true,
      this.Puntuacion,
      this.nombreDelJuego,
      false,
      this.grupo.id,
      this.votanEquipos);
    console.log ('creo juego ', juegoDeVotacion);
    this.peticionesAPI.CreaJuegoDeVotacionUnoATodos(juegoDeVotacion, this.grupo.id)
      .subscribe((juegoCreado) => {
        this.juego = juegoCreado;
        this.sesion.TomaJuego(this.juego);
        this.juegoCreado = true;
        console.log ('juego creado ', this.juego);

        // tslint:disable-next-line:max-line-length
        const evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juego.id, this.nombreDelJuego, 'Juego De Votación Uno A Todos');
        this.calculos.RegistrarEvento(evento);


        //     //Registrar la Creación del Juego
        // let evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juego.id, this.nombreDelJuego, "Juego De Votación Uno A Todos");
        // this.peticionesAPI.CreaEvento(evento).subscribe((res) => {
        //   console.log("Registrado evento: ", res);
        // }, (err) => {
        //   console.log(err);
        // });

        // Notificar a los Alumnos del Grupo
        // tslint:disable-next-line:max-line-length
        this.comService.EnviarNotificacionGrupo(1, this.grupo.id, `Nuevo Juego De Votación Uno A Todos para el Grupo ${this.grupo.Nombre}: ${this.nombreDelJuego}`);


        if (this.modoDeJuegoSeleccionado === 'Individual') {

          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.alumnosGrupo.length; i++) {
            // tslint:disable-next-line:max-line-length
            this.peticionesAPI.InscribeAlumnoJuegoDeVotacionUnoATodos(
              // tslint:disable-next-line:indent
                new AlumnoJuegoDeVotacionUnoATodos(this.alumnosGrupo[i].id, this.juego.id))
            .subscribe();
          }
        } else {
            console.log ('voy a inscribir a los equipos ', this.equiposGrupo);
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.equiposGrupo.length; i++) {
              // tslint:disable-next-line:max-line-length
              this.peticionesAPI.InscribeEquipoJuegoDeVotacionUnoATodos(
                // tslint:disable-next-line:indent
                  new EquipoJuegoDeVotacionUnoATodos(this.equiposGrupo[i].id, this.juego.id))
              .subscribe();
            }
        }

        Swal.fire('Juego de votación tipo Uno A Todos creado correctamente', ' ', 'success');

        // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
        if (this.juegosActivos === undefined) {
          // Si la lista aun no se ha creado no podre hacer el push
          this.juegosActivos = [];
        }
        this.juegosActivos.push(this.juego);
        // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
        this.Limpiar();
        // Regresamos a la lista de equipos (mat-tab con índice 0)
        this.tabGroup.selectedIndex = 0;

      });

  }

  PonConcepto() {

    this.listaConceptos.push({ nombre: this.myForm.value.NombreDelConcepto, peso: this.myForm.value.PesoDelConcepto });
    this.dataSourceConceptos = new MatTableDataSource(this.listaConceptos);
    let peso: number;
    peso = Number(this.myForm.value.PesoDelConcepto);
    this.totalPesos = this.totalPesos + peso;
    console.log('total ' + this.totalPesos);

    this.myForm.reset();

  }


  BorraConcepto(nombre) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.listaConceptos.length; i++) {
      if (this.listaConceptos[i].nombre === nombre) {
        this.totalPesos = this.totalPesos - this.listaConceptos[i].peso;
        this.listaConceptos.splice(i, 1);
      }
    }
    this.dataSourceConceptos = new MatTableDataSource(this.listaConceptos);

  }



  AsignarConceptos() {
    this.conceptos = [];
    this.pesos = [];


    if (this.totalPesos !== 100) {
      Swal.fire('Los pesos no suman el 100%', ' ', 'error');
    } else {
      this.listaConceptos.forEach(concepto => {
        this.conceptos.push(concepto.nombre);
        this.pesos.push(concepto.peso);
      });
      this.conceptosAsignados = true;
    }
  }



  CrearJuegoDeVotacionTodosAUno() {
    const juegoDeVotacion = new JuegoDeVotacionTodosAUno(
      this.tipoDeJuegoSeleccionado + ' ' + this.tipoDeVotacionSeleccionado,
      this.modoDeJuegoSeleccionado,
      true,
      this.conceptos,
      this.pesos,
      this.nombreDelJuego,
      false,
      this.grupo.id);
    console.log('voy a crear juego');
    console.log(juegoDeVotacion);
    this.peticionesAPI.CreaJuegoDeVotacionTodosAUno(juegoDeVotacion, this.grupo.id)
      .subscribe(juegoCreado => {
        this.juego = juegoCreado;
        this.sesion.TomaJuego(this.juego);
        this.juegoCreado = true;
        // Registrar la Creación del Juego
        // tslint:disable-next-line:max-line-length
        const evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juego.id, this.nombreDelJuego, 'Juego De Votación Todos A Uno');
        this.calculos.RegistrarEvento(evento);


        // let evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juego.id, this.nombreDelJuego, "Juego De Votación Todos A Uno");
        // this.peticionesAPI.CreaEvento(evento).subscribe((res) => {
        //   console.log("Registrado evento: ", res);
        // }, (err) => {
        //   console.log(err);
        // });

        // Notificar a los Alumnos del Grupo
        // tslint:disable-next-line:max-line-length
        this.comService.EnviarNotificacionGrupo(1, this.grupo.id, `Nuevo Juego De Votación Todos A Uno para el Grupo ${this.grupo.Nombre}: ${this.nombreDelJuego}`);


        if (this.modoDeJuegoSeleccionado === 'Individual') {

          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.alumnosGrupo.length; i++) {
            // tslint:disable-next-line:max-line-length
            this.peticionesAPI.InscribeAlumnoJuegoDeVotacionTodosAUno(
              new AlumnoJuegoDeVotacionTodosAUno(this.alumnosGrupo[i].id, this.juego.id))
              .subscribe();
          }
        }

        Swal.fire('Juego de votación tipo Todos A Uno creado correctamente', ' ', 'success');

        // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
        if (this.juegosActivos === undefined) {
          // Si la lista aun no se ha creado no podre hacer el push
          this.juegosActivos = [];
        }
        this.juegosActivos.push(this.juego);
        // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
        this.Limpiar();
        // Regresamos a la lista de equipos (mat-tab con índice 0)
        this.tabGroup.selectedIndex = 0;

      });
  }



  PonOpcion() {

    this.listaOpciones.push(this.myForm.value.Opcion);
    this.dataSourceOpciones = new MatTableDataSource(this.listaOpciones);

    this.myForm.reset();

  }


  BorraOpcion(nombre) {
    // tslint:disable-next-line:prefer-for-of
    const pos = this.listaOpciones.indexOf (nombre);
    this.listaOpciones.splice(pos, 1);

    this.dataSourceOpciones = new MatTableDataSource(this.listaOpciones);

  }



  AsignarOpciones() {
    this.opciones = this.listaOpciones;
    this.opcionesAsignadas = true;
  }



  CrearJuegoDeVotacionAOpciones() {
    const juegoDeVotacion = new JuegoDeVotacionAOpciones(
      this.tipoDeJuegoSeleccionado + ' ' + this.tipoDeVotacionSeleccionado,
      this.modoDeJuegoSeleccionado,
      true,
      this.opciones,
      this.Puntuacion,
      this.nombreDelJuego,
      this.modoDeRepartoSeleccionado,
      false,
      this.grupo.id);
    console.log('voy a crear juego: ');
    console.log(juegoDeVotacion);
    this.peticionesAPI.CreaJuegoDeVotacionAOpciones(juegoDeVotacion, this.grupo.id)
      .subscribe(juegoCreado => {
        this.juego = juegoCreado;
        this.sesion.TomaJuego(this.juego);
        this.juegoCreado = true;
        // Registrar la Creación del Juego
        // tslint:disable-next-line:max-line-length
        const evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juego.id, this.nombreDelJuego, 'Juego De Votación A Opciones');
        this.calculos.RegistrarEvento(evento);


        // let evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juego.id, this.nombreDelJuego, "Juego De Votación Todos A Uno");
        // this.peticionesAPI.CreaEvento(evento).subscribe((res) => {
        //   console.log("Registrado evento: ", res);
        // }, (err) => {
        //   console.log(err);
        // });

        // Notificar a los Alumnos del Grupo
        // tslint:disable-next-line:max-line-length
        this.comService.EnviarNotificacionGrupo(1, this.grupo.id, `Nuevo Juego De Votación A Opciones para el Grupo ${this.grupo.Nombre}: ${this.nombreDelJuego}`);


        if (this.modoDeJuegoSeleccionado === 'Individual') {

          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.alumnosGrupo.length; i++) {
            // tslint:disable-next-line:max-line-length
            this.peticionesAPI.InscribeAlumnoJuegoDeVotacionAOpciones(
              new AlumnoJuegoDeVotacionAOpciones(this.alumnosGrupo[i].id, this.juego.id))
              .subscribe();
          }
        }

        Swal.fire('Juego de votación A Opciones creado correctamente', ' ', 'success');

        // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
        if (this.juegosActivos === undefined) {
          // Si la lista aun no se ha creado no podre hacer el push
          this.juegosActivos = [];
        }
        this.juegosActivos.push(this.juego);
        // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
        this.Limpiar();
        // Regresamos a la lista de equipos (mat-tab con índice 0)
        this.tabGroup.selectedIndex = 0;

      });
  }
  /////////////// FUNCIONES PARA CREAR JUEGO DE CUESTIONARIO DE SATISFACCION /////////////

  RecibeCuestionarioSatisfaccionElegido($event) {
    this.cuestionarioSatisfaccion = $event;
    this.tengoCuestionarioSatisfaccion = true;
    console.log('tengo cuestionario: ' + this.cuestionarioSatisfaccion.Titulo);
  }
  GuardaDescripcionCuestionarioSatisfaccion(ev) {
    this.cuestionarioSatisfaccion.Descripcion = ev.target.value;
  }


  CrearJuegoDeCuestionarioDeSatisfaccion() {
    console.log('voy a crear el juego');
    console.log('cuestionario: ' + this.cuestionarioSatisfaccion.Titulo);
    console.log('Descripcion: ' + this.cuestionarioSatisfaccion.Descripcion);
    const juegoDeCuestionarioSatisfaccion = new JuegoDeCuestionarioSatisfaccion(
      this.nombreDelJuego,
      this.tipoDeJuegoSeleccionado,
      this.cuestionarioSatisfaccion.Descripcion,
      true,
      false,
      this.profesorId,
      this.grupo.id,
      this.cuestionarioSatisfaccion.id);


    console.log('voy a crear juego');
    console.log(juegoDeCuestionarioSatisfaccion);
    this.peticionesAPI.CreaJuegoDeCuestionarioSatisfaccion(juegoDeCuestionarioSatisfaccion, this.grupo.id)
      .subscribe(juegoCreado => {
        this.juego = juegoCreado;
        this.sesion.TomaJuego(this.juego);
        this.juegoCreado = true;

        // tslint:disable-next-line:max-line-length
        const evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juego.id, this.nombreDelJuego, 'Juego De Cuestionario de Satisfacción');
        this.calculos.RegistrarEvento(evento);



        // //Registrar la Creación del Juego
        // let evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juego.id, this.nombreDelJuego, "Juego De Cuestionario de Satisfacción");
        // this.peticionesAPI.CreaEvento(evento).subscribe((res) => {
        //   console.log("Registrado evento: ", res);
        // }, (err) => {
        //   console.log(err);
        // });

        // Notificar a los Alumnos del Grupo
        // tslint:disable-next-line:max-line-length
        this.comService.EnviarNotificacionGrupo(1, this.grupo.id, `Nuevo Juego De Cuestionario de Satisfacción para el Grupo ${this.grupo.Nombre}: ${this.nombreDelJuego}`);


        if (this.modoDeJuegoSeleccionado === 'Individual') {

          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.alumnosGrupo.length; i++) {
            // tslint:disable-next-line:max-line-length
            this.peticionesAPI.InscribeAlumnoJuegoDeCuestionarioSatisfaccion(
              new AlumnoJuegoDeCuestionarioSatisfaccion(false, this.juego.id, this.alumnosGrupo[i].id))
              .subscribe();
          }
        }

        Swal.fire('Juego de cuestionario de satisfacción creado correctamente', ' ', 'success');

        // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
        if (this.juegosActivos === undefined) {
          // Si la lista aun no se ha creado no podre hacer el push
          this.juegosActivos = [];
        }
        this.juegosActivos.push(this.juego);
        // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
        this.Limpiar();
        // Regresamos a la lista de equipos (mat-tab con índice 0)
        this.tabGroup.selectedIndex = 0;

      });

  }

  goBack() {
    this.location.back();
  }

  canExit(): Observable<boolean> {
    console.log('voy a salir');
    console.log(this.creandoJuego);
    if (!this.creandoJuego) {
      return of(true);
    } else {
      const confirmacionObservable = new Observable<boolean>(obs => {
        // const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
        //   height: '150px',
        //   data: {
        //     mensaje: 'Confirma que quieres abandonar el proceso de creación del juego',
        //   }
        // });

        // dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        //   if (confirmed) {
        //     this.Limpiar();
        //   }
        //   obs.next(confirmed);
        // });



        Swal.fire({
          title: '¿Seguro que quieres abandonar el proceso de creación del juego?',
          text: 'La operación no podrá deshaceerse',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, estoy seguro',
          cancelButtonText: 'Cancelar'
        }).then((result : any) => {
          if (result.value) {
            this.Limpiar();
          }
          obs.next(result.value);
        });

      });
      return confirmacionObservable;



    }
  }

  // Funciones Para creacion de Competicion Formula Uno
  // Para averiguar si todas las filas están seleccionadas */
  IsAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /* Cuando se clica en el checkbox de cabecera hay que ver si todos los
    * checkbox estan acivados, en cuyo caso se desactivan todos, o si hay alguno
    * desactivado, en cuyo caso se activan todos */

  MasterToggle() {
    if (this.IsAllSelected()) {
      this.selection.clear(); // Desactivamos todos
    } else {
      // activamos todos
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  Limpiar() {
    // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
    this.stepper.reset();
    this.myForm.reset();
    this.tengoNombre = false;
    this.tengoTipo = false;
    this.tengoModo = false;

    this.puntosDelJuego = [];
    this.nivelesDelJuego = [];
    this.logosNiveles = [];


    this.coleccionSeleccionada = undefined;
    this.tengoColeccion = false;

    this.creandoJuego = false;
    this.juegoCreado = false;

    this.modoPresentacion = undefined;
    this.puntuacionCorrecta = undefined;
    this.puntuacionIncorrecta = undefined;
    this.cuestionario = undefined;
    this.tengoCuestionario = false;
    this.tengoModoPresentacion = false;
    this.puntuaLaMedia = undefined;

    this.familiasElegidas = undefined;
    this.tengoFamilias = false;



    this.tengoNumeroDeJornadas = false;
    this.tengoTipoDeCompeticion = false;
    this.tengoTipoDeTorneo = false;
    this.tengoNuevaPuntuacion = false;

    this.puntuacionCorrectaGeo = undefined;
    this.puntuacionIncorrectaGeo = undefined;
    this.puntuacionCorrectaGeoBonus = undefined;
    this.puntuacionIncorrectaGeoBonus = undefined;
    this.escenario = undefined;
    this.tengoEscenario = false;

    this.puntosgeolocalizablesEscenario = undefined;
    this.PreguntasBasicas = undefined;
    this.PreguntasBonus = undefined;
    this.tengoPreguntas = false;


    this.recursoElegido = undefined;
    this.tengoRecurso = false;
  }





  ///////////////// FUNCIONES PARA CREAR JUEGO DE CUENTO /////////////

  CrearJuegoCuento() {

    const juego = new JuegoDeCuento(this.nombreDelJuego,
      this.tipoDeJuegoSeleccionado,
      this.modoDeJuegoSeleccionado,
      true);
    juego.descripcion = this.myForm.value.descripcionCuento;
    // juego.Temporada = 'SI';
    juego.criterioprivilegio1 = this.myForm.value.criterioprivilegio1;
    juego.criterioprivilegio2 = this.myForm.value.criterioprivilegio2;
    juego.criterioprivilegio3 = this.myForm.value.criterioprivilegio3;


    this.peticionesAPI.CrearJuegoCuento(juego, this.grupo.id)
      .subscribe(juego => {

        this.crearRecursoJuegoCuento(juego.id);

        this.juegoDeCuento = juego;

        if (this.modoDeJuegoSeleccionado === 'Individual') {

          console.log('Voy a inscribir a los alumnos del grupo');
          // tslint:disable-next-line:max-line-length
          if (this.modoDeJuegoSeleccionado === 'Individual') {
            console.log('Voy a inscribir a los alumnos del grupo');
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.alumnosGrupo.length; i++) {
              // tslint:disable-next-line:max-line-length
              console.log('inscribo');

              const alumno = new AlumnoJuegoDeCuento;
              alumno.nivel1 = this.nivel1;
              alumno.nivel2 = this.nivel2;
              alumno.nivel3 = this.nivel3;
              alumno.permisoparaver = this.permisoparaver;
              alumno.alumnoID = this.alumnosGrupo[i].id;
              alumno.Nombre = this.alumnosGrupo[i].Nombre;



              const id = this.juegoDeCuento.id;

              this.peticionesAPI.InscribeAlumnojuegoDeCuento(alumno, id)
                .subscribe((res) => {
                  console.log(res);
                }
                  , (err) => {
                    console.log(err);

                  });
            }
          } else {

          }
          Swal.fire('Juego de cuento creado correctamente', ' ', 'success');


          if (this.juegosActivos === undefined) {

            this.juegosActivos = [];
          }
          this.juegosActivos.push(this.juegoDeCuento);
          this.Limpiar();

          this.tabGroup.selectedIndex = 0;
        }
      });
  }

  public onDate(event): void {
    const e = event;
    console.log(event);
  }

  crearRecursoJuegoCuento(idCuento: any) {
    this.peticionesAPI.crearRecursosJuegoCuento(idCuento, this.recursoParaCuento)
      .subscribe((res) => {

      }, (err) => {
        console.log(err);
      });
  }

  inscribir(inscribirt) {
    console.log(inscribirt);
    this.inscribirtemporada = inscribirt;
  }


  RecibeRecursos($event) {
    this.recursoElegido = $event;
    this.tengoRecurso = true;
    localStorage.setItem('idRecursoLibros', this.recursoElegido[0].toString());
  }

  cargaRecursos($event) {
    this.recursoCargadoParaGuardar = $event;


    this.recursoParaCuento = new RecursoCuentoJuego;
    this.recursoParaCuento.nombre = this.recursoCargadoParaGuardar.nombre;
    this.recursoParaCuento.carpeta = this.recursoCargadoParaGuardar.carpeta;
    this.recursoParaCuento.imagenes = this.recursoCargadoParaGuardar.imagenes;
    this.recursoParaCuento.juegoId = 0;


    this.tengoRecursoCargadoParaGuardar = true;
  }

  avanzoElegirRecursos() {
    if (!this.avanzo1) {
    this.avanzo1 = true;
    } else {
    this.avanzo1 = false;
    }
  }

  avanzoElegirEspeciales() {
    if (!this.avanzo2) {
    this.avanzo2 = true;
    } else {
    this.avanzo2 = false;
    }
  }






  /// Para los controles de trabajo en equipo
  GuardarNumeroDeControles() {
    this.numeroDeControles = this.myForm.value.NumeroDeControles;
    if (this.numeroDeControles === undefined || isNaN(this.numeroDeControles)) {
      this.tengoNumeroDeControles = false;
      Swal.fire('Introduzca un número de controles válido', 'Le recordamos que debe ser un número', 'error');
    } else {
      this.tengoNumeroDeControles = true;
    }
  }
  CrearJuegoDeControlDeTrabajoEnEquipo() {
    const juegoDeControlDeTrabajoEnEquipo = new JuegoDeControlDeTrabajoEnEquipo(
      this.nombreDelJuego,
      this.tipoDeJuegoSeleccionado,
      this.numeroDeControles,
      this.verRespuestasControl,
      true,
      false,
      this.grupo.id,
      this.profesorId
    );
    this.peticionesAPI.CreaJuegoDeControlDeTrabajoEnEquipo(juegoDeControlDeTrabajoEnEquipo, this.grupo.id)
    .subscribe((juegoCreado) => {
      this.juego = juegoCreado;
      this.sesion.TomaJuego(this.juego);
      this.juegoCreado = true;
      // Registrar la Creación del Juego
      // tslint:disable-next-line:max-line-length
      const evento: Evento = new Evento(1, new Date(), this.profesorId, undefined, undefined, this.juego.id, this.nombreDelJuego, 'Juego De Control De Trabajo En Equipo');
      this.calculos.RegistrarEvento(evento);

      // Notificar a los Alumnos del Grupo
      // tslint:disable-next-line:max-line-length
      this.comService.EnviarNotificacionGrupo(1, this.grupo.id, `Nuevo Juego de Control De Trabajo En Equipo para el Grupo ${this.grupo.Nombre}: ${this.nombreDelJuego}`);


      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.alumnosGrupo.length; i++) {
            // tslint:disable-next-line:max-line-length
            this.peticionesAPI.InscribeAlumnoJuegoDeControlDeTrabajoEnEquipo(
              // tslint:disable-next-line:indent
                new AlumnoJuegoDeControlDeTrabajoEnEquipo(this.alumnosGrupo[i].id, this.juego.id))
            .subscribe();
      }

      Swal.fire('Juego de control de trabajo en equipo creado correctamente', ' ', 'success');

      // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
      if (this.juegosActivos === undefined) {
        // Si la lista aun no se ha creado no podre hacer el push
        this.juegosActivos = [];
      }
      this.juegosActivos.push(this.juego);
      // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
      this.Limpiar();
      // Regresamos a la lista de equipos (mat-tab con índice 0)
      this.tabGroup.selectedIndex = 0;

    });


  }

}

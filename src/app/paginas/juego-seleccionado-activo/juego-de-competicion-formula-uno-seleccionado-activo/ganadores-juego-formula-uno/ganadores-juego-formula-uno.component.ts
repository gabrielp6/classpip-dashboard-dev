import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

// Clases
import { Juego, Jornada, TablaJornadas, TablaAlumnoJuegoDeCompeticion,
         TablaEquipoJuegoDeCompeticion, TablaClasificacionJornada, AlumnoJuegoDeCompeticionFormulaUno,
         EquipoJuegoDeCompeticionFormulaUno, AlumnoJuegoDePuntos, EquipoJuegoDePuntos,
         Alumno, AlumnoJuegoDeCuestionario, AlumnoJuegoDeVotacionUnoATodos} from '../../../../clases/index';

// Servicio
import { SesionService , CalculosService, PeticionesAPIService } from '../../../../servicios/index';
import { MatTableDataSource } from '@angular/material';

import Swal from 'sweetalert2';
import { AlumnoJuegoDeEvaluacion } from 'src/app/clases/AlumnoJuegoDeEvaluacion';
import { EquipoJuegoDeEvaluacion } from 'src/app/clases/EquipoJuegoDeEvaluacion';
import { EquipoJuegoDeVotacionUnoATodos } from 'src/app/clases/EquipoJuegoDeVotacionUnoATodos';



export interface Asignacion {
  modo: string;
  id: number;
}
// Se usará para el selector de modo de asignación de ganadores
const ModoAsignacion: Asignacion[] = [
  {modo: 'Manualmente', id: 1},
  {modo: 'Aleatoriamente', id: 2},
  {modo: 'Según resultados de un juego', id: 3},
];

@Component({
  selector: 'app-ganadores-juego-formula-uno',
  templateUrl: './ganadores-juego-formula-uno.component.html',
  styleUrls: ['./ganadores-juego-formula-uno.component.scss']
})
export class GanadoresJuegoDeCompeticionFormulaUnoComponent implements OnInit {
  [x: string]: any;

  equiposRelacion;

  juegoSeleccionado: Juego;
  numeroTotalJornadas: number;
  jornadasDelJuego: Jornada[];

  tablaJornada: any [] = [];
  alumnosParticipantes: any [] = [];
  equiposParticipantes: any [] = [];
  ganadoresElegidos: any[] = [];
  dataSourceJornada;
  dataSourceParticipantes;
  dataSourceElegidos;
  columnasJornadaAlumnos: string[] = ['nombre', 'primer', 'segundo', 'puntos'];
  columnasJornadaEquipos: string[] = ['nombre', 'puntos'];
  columnasAlumnosParticipantes: string[] = ['nombre', 'primer', 'segundo', 'pon'];
  columnasAlumnosElegidos: string[] = ['posicion', 'nombre', 'primer', 'segundo', 'quita'];
  columnasEquiposParticipantes: string[] = ['nombre', 'pon'];
  columnasEquiposElegidos: string[] = ['posicion', 'nombre', 'quita'];

  jornadaId: number;

  textoParticipantesPuntuan: string;
  isDisabledAnadirGanadores = true; // Activa/Desactiva botón añadir masivamente ganadores

  modoAsignacion: Asignacion[] = ModoAsignacion;
  modoAsignacionId: number;
  botonAsignarAleatorioDesactivado = true;
  botonAsignarManualDesactivado = true;
  botonAsignarPuntosDesactivado = true;


  juegosDisponibles: Juego[];

  juegoDisponibleSeleccionadoID: number;
  juegoDisponibleSeleccionado: Juego;
  listaAlumnosOrdenadaPorPuntosJuegoDePuntos: AlumnoJuegoDePuntos[];
  listaEquiposOrdenadaPorPuntosJuegoDePuntos: EquipoJuegoDePuntos[];

  listaAlumnosOrdenadaPorPuntosJuegoDeCuestionario: AlumnoJuegoDeCuestionario[];
  listaAlumnosOrdenadaPorPuntosJuegoDeVotacionUnoATodos: AlumnoJuegoDeVotacionUnoATodos[];
  listaEquiposOrdenadaPorPuntosJuegoDeVotacionUnoATodos: EquipoJuegoDeVotacionUnoATodos[];
  listaAlumnosOrdenadaPorPuntosJuegoDeEvaluacion: AlumnoJuegoDeEvaluacion[];
  listaEquiposOrdenadaPorPuntosJuegoDeEvaluacion: EquipoJuegoDeEvaluacion[];

  listaAlumnosClasificacion: TablaAlumnoJuegoDeCompeticion[] = [];
  listaEquiposClasificacion: TablaEquipoJuegoDeCompeticion[] = [];
  asignados: boolean;


  constructor(public sesion: SesionService,
              public location: Location,
              public calculos: CalculosService,
              public peticionesAPI: PeticionesAPIService) { }


  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.numeroTotalJornadas = this.juegoSeleccionado.NumeroTotalJornadas;
    const datos = this.sesion.DameDatosJornadas();

    this.jornadasDelJuego = datos.jornadas;
    console.log ('Jornadas');
    console.log (this.jornadasDelJuego);
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.listaAlumnosClasificacion = this.sesion.DameTablaAlumnoJuegoDeCompeticion();
    } else {
      this.listaEquiposClasificacion = this.sesion.DameTablaEquipoJuegoDeCompeticion();
    }
    // Selecciono los juegos entre los que puedo elegir para decidir resultados
    // Son los juegos de puntos (tanto activos como acabados) y los juegos de cuestionario acabados
    this.juegosDisponibles = this.sesion.DameJuegosDePuntos().filter (juego => juego.Modo === this.juegoSeleccionado.Modo);
    // tslint:disable-next-line:max-line-length
    this.juegosDisponibles = this.juegosDisponibles.concat (this.sesion.DameJuegosDeCuestionariosAcabados());
    this.juegosDisponibles = this.juegosDisponibles.concat (this.sesion.DameJuegosDeVotacionUnoATodosAcabados());
    this.juegosDisponibles = this.juegosDisponibles.concat (this.sesion.DameJuegosDeEvaluacionTerminados());
    console.log ('Juegos para elegir ganadores ');
    console.log (this.juegosDisponibles);
    this.asignados = false;
  }

  /////////////// FUNCIONES PARA RECUPERAR INSCRIPCIONES DE JUEGOS DISPOBIBLES PARA ASIGNAR GANADORES //////////////////////////////////

  RecuperarInscripcionesAlumnosJuegoPuntos() {
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDePuntos(this.juegoDisponibleSeleccionadoID)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntosJuegoDePuntos = inscripciones;
      // ordena la lista por puntos
      // tslint:disable-next-line:only-arrow-functions
      this.listaAlumnosOrdenadaPorPuntosJuegoDePuntos = this.listaAlumnosOrdenadaPorPuntosJuegoDePuntos.sort(function(obj1, obj2) {
        return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
      });
    });
  }

  RecuperarInscripcionesEquiposJuegoPuntos() {
    this.peticionesAPI.DameInscripcionesEquipoJuegoDePuntos(this.juegoDisponibleSeleccionadoID)
    .subscribe(inscripciones => {
      this.listaEquiposOrdenadaPorPuntosJuegoDePuntos = inscripciones;
      console.log(this.listaEquiposOrdenadaPorPuntosJuegoDePuntos);
      // tslint:disable-next-line:only-arrow-functions
      this.listaEquiposOrdenadaPorPuntosJuegoDePuntos = this.listaEquiposOrdenadaPorPuntosJuegoDePuntos.sort(function(obj1, obj2) {
        return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
      });
    });

  }

  RecuperarInscripcionesAlumnosJuegoCuestionario() {
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCuestionario(this.juegoDisponibleSeleccionadoID)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntosJuegoDeCuestionario = inscripciones;
      // ordena la lista por puntos
      // tslint:disable-next-line:only-arrow-functions
      // tslint:disable-next-line:max-line-length
      this.listaAlumnosOrdenadaPorPuntosJuegoDeCuestionario = this.listaAlumnosOrdenadaPorPuntosJuegoDeCuestionario.sort(function(obj1, obj2) {
        if (obj1.Nota !== obj2.Nota) {
          return obj2.Nota - obj1.Nota;
        } else {
          // en caso de empate en la nota, gana el que empleó menos tiempo
          return obj1.TiempoEmpleado - obj2.TiempoEmpleado;
        }
      });

    });
  }

  RecuperarInscripcionesAlumnosJuegoDeVotacionUnoATodos() {
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeVotacionUnoATodos(this.juegoDisponibleSeleccionadoID)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntosJuegoDeVotacionUnoATodos = inscripciones;
      // ordena la lista por puntos
      // tslint:disable-next-line:only-arrow-functions
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:only-arrow-functions
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:only-arrow-functions
      // tslint:disable-next-line:max-line-length
      this.listaAlumnosOrdenadaPorPuntosJuegoDeVotacionUnoATodos = this.listaAlumnosOrdenadaPorPuntosJuegoDeVotacionUnoATodos.sort(function(obj1, obj2) {
        return obj2.puntosTotales - obj1.puntosTotales;
      });
    });

  }

  RecuperarInscripcionesEquiposJuegoDeVotacionUnoATodos() {
    this.peticionesAPI.DameInscripcionesEquipoJuegoDeVotacionUnoATodos(this.juegoDisponibleSeleccionadoID)
    .subscribe(inscripciones => {
      this.listaEquiposOrdenadaPorPuntosJuegoDeVotacionUnoATodos = inscripciones;
      // ordena la lista por puntos
      // tslint:disable-next-line:only-arrow-functions
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:only-arrow-functions
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:only-arrow-functions
      // tslint:disable-next-line:max-line-length
      this.listaEquiposOrdenadaPorPuntosJuegoDeVotacionUnoATodos = this.listaEquiposOrdenadaPorPuntosJuegoDeVotacionUnoATodos.sort(function(obj1, obj2) {
        return obj2.puntosTotales - obj1.puntosTotales;
      });
    });

  }
  RecuperarInscripcionesEquiposJuegoEvaluacion() {
    this.peticionesAPI.DameRelacionEquiposJuegoDeEvaluacion(this.juegoDisponibleSeleccionadoID)
    .subscribe((res: EquipoJuegoDeEvaluacion[]) => {
      this.equiposRelacion = res;
      this.equiposRelacion = this.equiposRelacion.sort(function(obj1, obj2) {
        return obj2.notaFinal - obj1.notaFinal;
      });
    });

  }

  RecuperarInscripcionesAlumnosJuegoEvaluacion() {
    this.peticionesAPI.DameRelacionAlumnosJuegoDeEvaluacion(this.juegoDisponibleSeleccionadoID)
      .subscribe((res: AlumnoJuegoDeEvaluacion[]) => {
        console.log ('ya tengo las inscripcuones ', res);
        this.listaAlumnosOrdenadaPorPuntosJuegoDeEvaluacion = res;
        // tslint:disable-next-line:max-line-length
        this.listaAlumnosOrdenadaPorPuntosJuegoDeEvaluacion = this.listaAlumnosOrdenadaPorPuntosJuegoDeEvaluacion.sort(function(obj1, obj2) {
          return obj2.notaFinal - obj1.notaFinal;
        });
      });
  }

  Disputada(jornadaId): boolean {
    return this.calculos.JornadaF1TieneGanadores(jornadaId, this.jornadasDelJuego);
  }

  // Construye la tabla que muestra los resultados de la jornada
  ConstruirTabla() {
    this.tablaJornada = [];
    let i;
    if (this.juegoSeleccionado.Modo === 'Individual') {
      for (i = 0; i < this.listaAlumnosClasificacion.length; i++) {
        const participante: any = [];
        participante.nombre = this.listaAlumnosClasificacion[i].nombre;
        participante.primerApellido = this.listaAlumnosClasificacion[i].primerApellido;
        participante.segundoApellido = this.listaAlumnosClasificacion[i].segundoApellido;
        participante.puntos = 0;
        participante.id = this.listaAlumnosClasificacion[i].id;
        this.tablaJornada.push (participante);
      }
    } else {
      for (i = 0; i < this.listaEquiposClasificacion.length; i++) {
        const participante: any = [];
        participante.nombre = this.listaEquiposClasificacion[i].nombre;
        participante.puntos = 0;
        participante.id = this.listaEquiposClasificacion[i].id;
        this.tablaJornada.push (participante);

      }
    }
  }

  // Añado los puntos correspondientes a los ganadores de la jornada)
  AñadirResultados(ganadores) {
    // ganadores es un vector con los id de los ganadores de la jornada
    // Los puntos que hay que asignar a cada uno de los ganadores, segun su posición, estan en juegoSeleccionado.Puntos

    if (ganadores !== undefined) {
      let i;
      for (i = 0; i < ganadores.length ; i++) {
        this.tablaJornada.filter (participante => participante.id === ganadores[i])[0].puntos = this.juegoSeleccionado.Puntos[i];
      }
      this.tablaJornada.sort ((a , b) => b.puntos - a.puntos);
    }
  }

  // Esta función se ejecuta al seleccionar una jornada
  SeleccionaJornada() {
    let jornadaAnterior : number;
    jornadaAnterior = this.jornadaId -1;
    console.log (this.jornadaId);
    console.log (jornadaAnterior);
    console.log (this.jornadasDelJuego[0].id);
    if (this.jornadaId == this.jornadasDelJuego[0].id) {
          this.ConstruirTabla();
          if (this.Disputada(this.jornadaId)) {
            // Si ya se ha disputado, los ganadores están en la información de la jornada
            const ganadores = this.jornadasDelJuego.filter (jornada => jornada.id === Number (this.jornadaId))[0].GanadoresFormulaUno;
            // Añadimos los ganadores a la tabla
            this.AñadirResultados ( ganadores);
          }
          this.dataSourceJornada = new MatTableDataSource (this.tablaJornada);
    } else if (!this.Disputada(jornadaAnterior)){
      Swal.fire('Cuidado, no se ha jugado la jornada anterior');
      this.location.back();
    } else {
      this.ConstruirTabla();
      if (this.Disputada(this.jornadaId)) {
        // Si ya se ha disputado, los ganadores están en la información de la jornada
        const ganadores = this.jornadasDelJuego.filter (jornada => jornada.id === Number (this.jornadaId))[0].GanadoresFormulaUno;
        // Añadimos los ganadores a la tabla
        this.AñadirResultados ( ganadores);
      }
      this.dataSourceJornada = new MatTableDataSource (this.tablaJornada);
    }
  }

  // Esta función se ejecuta al seleccionar el modo de asignación
  SeleccionaModo() {
    console.log ('SeleccionaModo');
    // activamos el boton correspondiente si se eligió manual ao aleatorio
    if (Number(this.modoAsignacionId) === 1) { // Manual
        this.botonAsignarAleatorioDesactivado = true;
        this.botonAsignarManualDesactivado = false;
        this.botonAsignarPuntosDesactivado = true;
    } else if (Number(this.modoAsignacionId) === 2) { // Aleatorio
        this.botonAsignarManualDesactivado = true;
        this.botonAsignarAleatorioDesactivado = false;
        this.botonAsignarPuntosDesactivado = true;
    // Si se elijió asignación por juego de puntos y no hay juego de puntos para elegir se muestra una alarma
    // Si  hay juego de puntos no se hace nada porque ya aparecerá automáticamente el selector del juego
      } else if ((Number(this.modoAsignacionId) === 3) && (this.juegosDisponibles.length === 0)) { // JuegoPuntos
        this.botonAsignarManualDesactivado = true;
        this.botonAsignarAleatorioDesactivado = true;
        this.botonAsignarPuntosDesactivado = true;
        console.log ('Aviso');
        Swal.fire('Cuidado', 'No hay juegos finalizados disponibles para este grupo', 'warning');
      }
  }

  // Me traigo el juego elegido para decidir los resultados de la jornada
  TraerJuegoDisponibleSeleccionado() {
    this.botonAsignarManualDesactivado = true;
    this.botonAsignarAleatorioDesactivado = true;
    this.botonAsignarPuntosDesactivado = false;
    console.log ('ID del juego seleccionado ' + this.juegoDisponibleSeleccionadoID);
    console.log (this.juegosDisponibles);
    this.juegoDisponibleSeleccionado = this.juegosDisponibles.filter (juego => juego.id === Number (this.juegoDisponibleSeleccionadoID))[0];
    console.log ('ya he seleccionado el juego');
    console.log (this.juegoDisponibleSeleccionado);
    if ( this.juegoDisponibleSeleccionado.Tipo === 'Juego De Puntos') {
      if (this.juegoSeleccionado.Modo === 'Individual') {
        this.RecuperarInscripcionesAlumnosJuegoPuntos();
      } else {
        this.RecuperarInscripcionesEquiposJuegoPuntos();
      }
    } else if ( this.juegoDisponibleSeleccionado.Tipo === 'Juego De Cuestionario') {
      // De momento solo hay individual
      this.RecuperarInscripcionesAlumnosJuegoCuestionario();
    } else if ( this.juegoDisponibleSeleccionado.Tipo === 'Juego De Votación Uno A Todos') {
      if (this.juegoSeleccionado.Modo === 'Individual') {
        this.RecuperarInscripcionesAlumnosJuegoDeVotacionUnoATodos();
      } else {
        this.RecuperarInscripcionesEquiposJuegoDeVotacionUnoATodos();
      }
    } else if ( this.juegoDisponibleSeleccionado.Tipo === 'Evaluacion') {
      if (this.juegoSeleccionado.Modo === 'Individual') {
        console.log ('vamos a por las inscripciones de los alumnos');
        this.RecuperarInscripcionesAlumnosJuegoEvaluacion();
      } else {
        this.RecuperarInscripcionesEquiposJuegoEvaluacion();
      }
    } 
  }

  AsignarGanadoresAleatoriamente() {
    const ganadores: any[] = [];
    const participantes: any[] = [];
    // Preparo la lista de participantes de la que iré eligiendo aleatoriamente
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.listaAlumnosClasificacion.forEach(alumno => participantes.push(alumno));
    } else {
      this.listaEquiposClasificacion.forEach(equipo => participantes.push(equipo));
    }
    let i = 0;
    while (i < this.juegoSeleccionado.NumeroParticipantesPuntuan) {
      const numeroParticipantes = participantes.length;
      const elegido = Math.floor(Math.random() * numeroParticipantes);
      // guardo el id del elegido
      ganadores.push(participantes[elegido].id);
      // Lo elimino de los participantes para seguir eligiendo
      participantes.splice(elegido, 1);
      i++;
    }
    // Añado puntos de elegidos a la tabla
    this.AñadirResultados ( ganadores);
    this.dataSourceJornada = new MatTableDataSource (this.tablaJornada);
    // Selecciono la jornada implicada
    const jornadaSeleccionada = this.jornadasDelJuego.filter (jornada => jornada.id === Number(this.jornadaId))[0];
    // Asigno los resultados a la jornada
    this.calculos.AsignarResultadosJornadaF1(this.juegoSeleccionado, jornadaSeleccionada, ganadores);
    Swal.fire('Enhorabuena', 'Resutados asignados aleatoriamente', 'success');
    this.asignados = true;
  }
  AsignarGanadoresJuegoDisponibleSeleccionado() {
    const ganadores: any[] = [];

    // Selecciono los ganadores a partir del ranking del juego de puntos
    if (this.juegoSeleccionado.Modo === 'Individual') {
      if (this.juegoDisponibleSeleccionado.Tipo === 'Juego De Puntos') {
        let i = 0;
        while (i < this.juegoSeleccionado.NumeroParticipantesPuntuan) {
          ganadores.push(this.listaAlumnosOrdenadaPorPuntosJuegoDePuntos[i].alumnoId);
          i++;
        }
      } else if (this.juegoDisponibleSeleccionado.Tipo === 'Juego De Cuestionario') {
        let i = 0;
        while (i < this.juegoSeleccionado.NumeroParticipantesPuntuan) {
          ganadores.push(this.listaAlumnosOrdenadaPorPuntosJuegoDeCuestionario[i].alumnoId);
          i++;
        }
      } else if (this.juegoDisponibleSeleccionado.Tipo === 'Juego De Votación Uno A Todos') {
        let i = 0;
        while (i < this.juegoSeleccionado.NumeroParticipantesPuntuan) {
          ganadores.push(this.listaAlumnosOrdenadaPorPuntosJuegoDeVotacionUnoATodos[i].alumnoId);
          i++;
        }
      } else if (this.juegoDisponibleSeleccionado.Tipo === 'Evaluacion') {
        console.log ('lista juego evaluacion ' , this.listaAlumnosOrdenadaPorPuntosJuegoDeEvaluacion);
        let i = 0;
        while (i < this.juegoSeleccionado.NumeroParticipantesPuntuan) {
          ganadores.push(this.listaAlumnosOrdenadaPorPuntosJuegoDeEvaluacion[i].alumnoId);
          i++;
        }
      }
    // Juego en equipo
    } else {
      
      if (this.juegoDisponibleSeleccionado.Tipo === 'Juego De Puntos') {
        let i = 0;
        while (i < this.juegoSeleccionado.NumeroParticipantesPuntuan) {
          ganadores.push(this.listaEquiposOrdenadaPorPuntosJuegoDePuntos[i].equipoId);
          i++;
        }
      } else if (this.juegoDisponibleSeleccionado.Tipo === 'Evaluacion') {
        let i = 0;
        while (i < this.juegoSeleccionado.NumeroParticipantesPuntuan) {
          ganadores.push(this.listaEquiposOrdenadaPorPuntosJuegoDeEvaluacion[i].equipoId);
          i++;
        }
      } else if (this.juegoDisponibleSeleccionado.Tipo === 'Juego De Votación Uno A Todos') {
        let i = 0;
        while (i < this.juegoSeleccionado.NumeroParticipantesPuntuan) {
          ganadores.push(this.listaEquiposOrdenadaPorPuntosJuegoDeVotacionUnoATodos[i].equipoId);
          i++;
        }
      }
    }
    // Añado puntos de elegidos a la tabla
    this.AñadirResultados ( ganadores);
    this.dataSourceJornada = new MatTableDataSource (this.tablaJornada);
    // Selecciono la jornada implicada
    const jornadaSeleccionada = this.jornadasDelJuego.filter (jornada => jornada.id === Number(this.jornadaId))[0];
    // Asigno los resultados a la jornada
    this.calculos.AsignarResultadosJornadaF1(this.juegoSeleccionado, jornadaSeleccionada, ganadores);
    Swal.fire('Enhorabuena', 'Resutados asignados mediante juego de puntos', 'success');
    this.asignados = true;
  }

  // Funciones para AsignarMasivoManualmente
  LimpiarCamposTexto() {
    this.textoParticipantesPuntuan = undefined;
    this.isDisabledAnadirGanadores = true;
  }

  DisabledTexto() {

    if (this.textoParticipantesPuntuan === undefined) {
      this.isDisabledAnadirGanadores = true;
    } else {
      this.isDisabledAnadirGanadores = false;
    }
  }



  AsignarMasivoManualmente() {
    const lineas: string[] = this.textoParticipantesPuntuan.split('\n');
    console.log ('Numero de lineas ' + lineas.length);
    console.log(lineas.length + ' === ' + this.juegoSeleccionado.NumeroParticipantesPuntuan);
    if (lineas.length !== this.juegoSeleccionado.NumeroParticipantesPuntuan) {
      Swal.fire('Cuidado', 'Esta jornada tiene ' + this.juegoSeleccionado.NumeroParticipantesPuntuan +
      ' participantes que puntúan, pero se han introducido ' + lineas.length, 'warning');
    } else {
      let ganadores;
      if (this.juegoSeleccionado.Modo === 'Individual') {
        ganadores = this.calculos.DameIdAlumnos(lineas, this.listaAlumnosClasificacion);
      } else {
        ganadores = this.calculos.DameIdEquipos(lineas, this.listaEquiposClasificacion);
      }
       // Añado puntos de elegidos a la tabla
      this.AñadirResultados ( ganadores);
      this.dataSourceJornada = new MatTableDataSource (this.tablaJornada);
      // Selecciono la jornada implicada
      const jornadaSeleccionada = this.jornadasDelJuego.filter (jornada => jornada.id === Number(this.jornadaId))[0];
      // Asigno los resultados a la jornada
      if (ganadores !== undefined) {
        this.calculos.AsignarResultadosJornadaF1(this.juegoSeleccionado, jornadaSeleccionada, ganadores);
        Swal.fire('Enhorabuena', 'Resutados asignados manualmente', 'success');
      }
      this.asignados = true;

    }
  }


  cambioTab(tabChangeEvent) {
    if (tabChangeEvent.index === 1) {
      // preparamos las tablas para elegir a los ganadores manualmente a partir de la lista de participantes

      this.ganadoresElegidos = [];
      this.dataSourceElegidos = new MatTableDataSource (this.ganadoresElegidos);

      if (this.juegoSeleccionado.Modo === 'Individual') {
        this.alumnosParticipantes = [];
        this.listaAlumnosClasificacion.forEach (alumno => this.alumnosParticipantes.push(alumno));
        this.alumnosParticipantes.sort((a, b) => a.primerApellido.localeCompare(b.primerApellido));
        this.dataSourceParticipantes = new MatTableDataSource (this.alumnosParticipantes);
      } else {
        this.equiposParticipantes = [];
        this.listaEquiposClasificacion.forEach (equipo => this.equiposParticipantes.push(equipo));
        this.equiposParticipantes.sort((a, b) => a.nombre.localeCompare(b.nombre));
        this.dataSourceParticipantes = new MatTableDataSource (this.equiposParticipantes);
      }
    } else {
      // Para el método manualmente masivo no necesitamos cargar nada
    }
  }

  // Si elegimos un ganador lo cambiamos de tabla
  AgregarGanador(participante) {
    if (this.ganadoresElegidos.length === this.juegoSeleccionado.NumeroParticipantesPuntuan) {
      Swal.fire('Cuidado', 'Ya has asignado a todos los participantes que puntuan', 'warning');
    } else {

      this.ganadoresElegidos.push (participante);
      this.dataSourceElegidos = new MatTableDataSource (this.ganadoresElegidos);
      if (this.juegoSeleccionado.Modo === 'Individual') {
        // tslint:disable-next-line:max-line-length
        this.alumnosParticipantes = this.alumnosParticipantes.filter(alumno => alumno.id !== participante.id);
        this.dataSourceParticipantes = new MatTableDataSource (this.alumnosParticipantes);
       } else {
         // tslint:disable-next-line:max-line-length
        this.equiposParticipantes = this.equiposParticipantes.filter(equipo => equipo.id !== participante.id);
        this.dataSourceParticipantes = new MatTableDataSource (this.equiposParticipantes);
      }
    }
  }

  // Si quito un ganador también tengo que cambiar de tabla
  QuitarGanador(participante) {
    this.ganadoresElegidos = this.ganadoresElegidos.filter (elegido => elegido.id !== participante.id);
    this.dataSourceElegidos = new MatTableDataSource (this.ganadoresElegidos);
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.alumnosParticipantes.push (participante);
      this.alumnosParticipantes.sort((a, b) => a.primerApellido.localeCompare(b.primerApellido));
      this.dataSourceParticipantes = new MatTableDataSource (this.alumnosParticipantes);
    } else {
      this.equiposParticipantes.push (participante);
      this.equiposParticipantes.sort((a, b) => a.nombre.localeCompare(b.nombre));
      this.dataSourceParticipantes = new MatTableDataSource (this.equiposParticipantes);
    }
  }


  // Para asignar los elegidos mediante selección de la lista
  AsignarGanadoresElegidos() {
    if (this.ganadoresElegidos.length < this.juegoSeleccionado.NumeroParticipantesPuntuan) {
      Swal.fire('Cuidado', 'Aún falta seleccionar algún participante que puntúa', 'warning');
    } else {
      // Preparo el vector con los identificadores de los ganadores
      const ganadores: any[] = [];
      let i = 0;
      while (i < this.juegoSeleccionado.NumeroParticipantesPuntuan) {
        ganadores.push(this.ganadoresElegidos[i].id);
        i++;
      }
     // Añado puntos de elegidos a la tabla
      this.AñadirResultados ( ganadores);
      this.dataSourceJornada = new MatTableDataSource (this.tablaJornada);
    // Selecciono la jornada implicada
      const jornadaSeleccionada = this.jornadasDelJuego.filter (jornada => jornada.id === Number(this.jornadaId))[0];
    // Asigno los resultados a la jornada
      this.calculos.AsignarResultadosJornadaF1(this.juegoSeleccionado, jornadaSeleccionada, ganadores);
      Swal.fire('Enhorabuena', 'Resutados asignados manualmente', 'success');
      this.asignados = true;
    }
  }

  goBack() {
    if (!this.asignados && !this.Disputada(this.jornadaId)) {
      Swal.fire({
        title: '¿Estas seguro?',
        text: 'No has realizado la asignación',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, estoy seguro'
      }).then((result) => {
        if (result.value) {
          this.location.back();
        }
      });
    } else {
      this.location.back();
    }
  }

}

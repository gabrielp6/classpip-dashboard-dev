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
import { reActivarJuego } from '../../ventana-activar-desactivar/activarDesactivarJuego';

@Component({
  selector: 'app-juego-de-competicion-seleccionado-inactivo',
  templateUrl: './juego-de-competicion-seleccionado-inactivo.component.html',
  styleUrls: ['./juego-de-competicion-seleccionado-inactivo.component.scss']
})
export class JuegoDeCompeticionSeleccionadoInactivoComponent implements OnInit {

  // Juego De CompeticionLiga seleccionado
  juegoSeleccionado: Juego;


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

  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres reactivar el ';

  // tslint:disable-next-line:no-inferrable-types
  mensajeBorrar: string = 'Estás seguro/a de que quieres borrar el ';
  // Columnas Tabla
  // displayedColumnsAlumnos: string[] = ['posicion', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'partidosTotales',
  //                                      'partidosJugados', 'partidosGanados', 'partidosEmpatados', 'partidosPerdidos', 'puntos', ' '];
  displayedColumnsAlumnos: string[] = ['posicion', 'nombreAlumno', 'primerApellido', 'partidosTotales',
                                       'partidosJugados', 'partidosGanados', 'partidosEmpatados', 'partidosPerdidos', 'puntos'];
  displayedColumnsEquipos: string[] = ['posicion', 'nombreEquipo', 'miembros', 'partidosTotales', 'partidosJugados',
                                       'partidosGanados', 'partidosEmpatados', 'partidosPerdidos', 'puntos'];

  datasourceAlumno;
  datasourceEquipo;

  jornadas: Jornada[];
  JornadasCompeticion: TablaJornadas[] = [];
  // enfrentamientosDelJuego: EnfrentamientoLiga[] = [];
  enfrentamientosDelJuego: Array<Array<EnfrentamientoLiga>>;

  constructor(  public dialog: MatDialog,
                public sesion: SesionService,
                public peticionesAPI: PeticionesAPIService,
                public calculos: CalculosService,
                private location: Location,
                public comServerService: ComServerService) {}

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log(this.juegoSeleccionado);
    this.DameJornadasDelJuegoDeCompeticionSeleccionado();
  }

  DameJornadasDelJuegoDeCompeticionSeleccionado() {
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


   
  Reactivar() {
    reActivarJuego().then((result) => {
      if (result.value) {

        this.juegoSeleccionado.JuegoActivo = true;
        this.peticionesAPI.CambiaEstadoJuegoDeCompeticionLiga (this.juegoSeleccionado)
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



    
  Eliminar(): void {

    Swal.fire({
      title: 'Confirma que quieres eliminar el juego <b>' + this.juegoSeleccionado.NombreJuego + '</b>',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
    }).then(async (result) => {
      if (result.value) {
        await this.calculos.EliminarJuegoDeCompeticionLiga(this.juegoSeleccionado);
        Swal.fire('El juego ha sido eliminado correctamente', ' ', 'success');
        this.location.back();
      }
    });
  }

  // ReactivarJuego() {
  //   console.log(this.juegoSeleccionado);
  //   this.peticionesAPI.CambiaEstadoJuegoDeCompeticionLiga(new Juego (this.juegoSeleccionado.Tipo, this.juegoSeleccionado.Modo,
  //     this.juegoSeleccionado.Asignacion,
  //     undefined, true, this.juegoSeleccionado.NumeroTotalJornadas, this.juegoSeleccionado.TipoJuegoCompeticion,
  //     this.juegoSeleccionado.NumeroParticipantesPuntuan, this.juegoSeleccionado.Puntos, this.juegoSeleccionado.NombreJuego),
  //     this.juegoSeleccionado.id, this.juegoSeleccionado.grupoId).subscribe(res => {
  //       if (res !== undefined) {
  //         console.log(res);
  //         console.log('juego reactivado');
  //         this.location.back();
  //       }
  //     });
  // }

  // AbrirDialogoConfirmacionReactivar(): void {

  //   const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
  //     height: '150px',
  //     data: {
  //       mensaje: this.mensaje,
  //       nombre: this.juegoSeleccionado.Tipo,
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe((confirmed: boolean) => {
  //     if (confirmed) {
  //       this.ReactivarJuego();
  //       Swal.fire('Reactivado', this.juegoSeleccionado.Tipo + ' reactivado correctamente', 'success');
  //     }
  //   });
  // }

  // EliminarJuego() {
  //   this.calculos.BorraJuegoCompeticionLiga (this.juegoSeleccionado);
  //   this.location.back();
  // }

  // AbrirDialogoConfirmacionEliminar(): void {

  //   const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
  //     height: '150px',
  //     data: {
  //       mensaje: this.mensajeBorrar,
  //       nombre: this.juegoSeleccionado.Tipo,
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe((confirmed: boolean) => {
  //     if (confirmed) {
  //       this.EliminarJuego();
  //       Swal.fire('Eliminado', this.juegoSeleccionado.Tipo + ' eliminado correctamente', 'success');

  //     }
  //   });
  // }
  goBack() {
    this.location.back();
  }



}

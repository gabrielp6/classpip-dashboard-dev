import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';

// Clases
import { Alumno, Equipo, Juego, Punto, Nivel, AlumnoJuegoDePuntos, EquipoJuegoDePuntos,
  TablaAlumnoJuegoDePuntos, TablaEquipoJuegoDePuntos } from '../../../clases/index';

// Services
import { SesionService, PeticionesAPIService, CalculosService, ComServerService } from '../../../servicios/index';


// Imports para abrir diálogo agregar alumno/confirmar eliminar grupo
import { MatDialog } from '@angular/material';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';
import { reActivarJuego } from '../../ventana-activar-desactivar/activarDesactivarJuego';

@Component({
  selector: 'app-juego-de-puntos-seleccionado-inactivo',
  templateUrl: './juego-de-puntos-seleccionado-inactivo.component.html',
  styleUrls: ['./juego-de-puntos-seleccionado-inactivo.component.scss']
})
export class JuegoDePuntosSeleccionadoInactivoComponent implements OnInit {

  // Juego De Puntos seleccionado
  juegoSeleccionado: Juego;

  // Recupera la informacion del juego, los alumnos o los equipos, los puntos y los niveles del juego
  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];
  tiposPuntosDelJuego: Punto[];
  nivelesDelJuego: Nivel[];

  listaSeleccionable: Punto[] = [];


  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres reactivar el ';

  // tslint:disable-next-line:no-inferrable-types
  mensajeBorrar: string = 'Estás seguro/a de que quieres borrar el ';

  // Recoge la inscripción de un alumno en el juego ordenada por puntos
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDePuntos[];

  listaEquiposOrdenadaPorPuntos: EquipoJuegoDePuntos[];

  datasourceAlumno;
  datasourceEquipo;

  // Muestra la posición del alumno, el nombre y los apellidos del alumno, los puntos y el nivel
  rankingJuegoDePuntos: TablaAlumnoJuegoDePuntos[] = [];
  rankingJuegoDePuntosTotal: TablaAlumnoJuegoDePuntos[] = [];

  rankingEquiposJuegoDePuntos: TablaEquipoJuegoDePuntos[] = [];
  rankingEquiposJuegoDePuntosTotal: TablaEquipoJuegoDePuntos[] = [];

  puntoSeleccionadoId: number;

  displayedColumnsAlumnos: string[] = ['posicion', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'puntos', 'nivel', ' '];

  displayedColumnsEquipos: string[] = ['posicion', 'nombreEquipo', 'miembros', 'puntos', 'nivel', ' '];

  alumnosEquipo: Alumno[];

  constructor(
               public dialog: MatDialog,
               private sesion: SesionService,
               private peticionesAPI: PeticionesAPIService,
               private calculos: CalculosService,
               private location: Location,
               public comServerService: ComServerService ) { }

  ngOnInit() {

    this.juegoSeleccionado = this.sesion.DameJuego();
    this.listaSeleccionable[0] =  new Punto('Totales');

    this.TraeTiposPuntosDelJuego();
    this.NivelesDelJuego();

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.AlumnosDelJuego();
    } else {
      this.EquiposDelJuego();
    }
  }


  applyFilter(filterValue: string) {
    this.datasourceAlumno.filter = filterValue.trim().toLowerCase();
  }

  applyFilterEquipo(filterValue: string) {
    this.datasourceEquipo.filter = filterValue.trim().toLowerCase();
  }

  // Recupera los alumnos que pertenecen al juego
  AlumnosDelJuego() {
    this.peticionesAPI.DameAlumnosJuegoDePuntos(this.juegoSeleccionado.id)
    .subscribe(alumnosJuego => {
      console.log(alumnosJuego);
      this.alumnosDelJuego = alumnosJuego;
      this.RecuperarInscripcionesAlumnoJuego();
    });
  }


  // Recupera los equipos que pertenecen al juego
  EquiposDelJuego() {
    this.peticionesAPI.DameEquiposJuegoDePuntos(this.juegoSeleccionado.id)
    .subscribe(equiposJuego => {
      this.equiposDelJuego = equiposJuego;
      this.RecuperarInscripcionesEquiposJuego();
    });
  }


  // Recupera los puntos que se pueden asignar en el juego
  TraeTiposPuntosDelJuego() {
    this.peticionesAPI.DamePuntosJuegoDePuntos(this.juegoSeleccionado.id)
    .subscribe(puntos => {
      this.tiposPuntosDelJuego = puntos;
      this.listaSeleccionable = [];
      this.listaSeleccionable[0] =  new Punto('Totales');
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.tiposPuntosDelJuego.length; i ++) {
        this.listaSeleccionable.push(this.tiposPuntosDelJuego[i]);
      }
    });
  }


  // Recupera los niveles de los que dispone el juego
  NivelesDelJuego() {
    this.peticionesAPI.DameNivelesJuegoDePuntos(this.juegoSeleccionado.id)
    .subscribe(niveles => {
      this.nivelesDelJuego = niveles;
      console.log(this.nivelesDelJuego);
    });
  }


  // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
  RecuperarInscripcionesAlumnoJuego() {
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDePuntos(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntos = inscripciones;
      // Ordenamos por puntos
      // tslint:disable-next-line:only-arrow-functions
      this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
        return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
      });
      this.TablaClasificacionTotal();
    });
  }


    // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
  RecuperarInscripcionesEquiposJuego() {

    this.peticionesAPI.DameInscripcionesEquipoJuegoDePuntos(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaEquiposOrdenadaPorPuntos = inscripciones;
      console.log(this.listaEquiposOrdenadaPorPuntos);

      // Ordenamos por puntos
      // tslint:disable-next-line:only-arrow-functions
      this.listaEquiposOrdenadaPorPuntos = this.listaEquiposOrdenadaPorPuntos.sort(function(obj1, obj2) {
        return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
      });
      this.TablaClasificacionTotal();
    });
  }
// En función del modo, recorremos la lisa de Alumnos o de Equipos y vamos rellenando el rankingJuegoDePuntos
  // ESTO DEBERIA IR AL SERVICIO DE CALCULO, PERO DE MOMENTO NO LO HAGO PORQUE SE GENERAN DOS TABLAS
  // Y NO COMPRENDO BIEN LA NECESIDAD DE LAS DOS
  TablaClasificacionTotal() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.rankingJuegoDePuntos = this.calculos.PrepararTablaRankingIndividual (
        this.listaAlumnosOrdenadaPorPuntos,
        this.alumnosDelJuego,
        this.nivelesDelJuego
      );
      console.log ('Ya tengo la tabla');
      // tslint:disable-next-line:max-line-length
     // this.rankingJuegoDePuntosTotal = this.calculos.DameRanking (this.listaAlumnosOrdenadaPorPuntos, this.alumnosDelJuego, this.nivelesDelJuego);
      this.datasourceAlumno = new MatTableDataSource(this.rankingJuegoDePuntos);

    } else {

      this.rankingEquiposJuegoDePuntos = this.calculos.PrepararTablaRankingEquipos (
        this.listaEquiposOrdenadaPorPuntos, this.equiposDelJuego, this.nivelesDelJuego
      );
      console.log ('ranking ' + this.rankingEquiposJuegoDePuntos);
      this.datasourceEquipo = new MatTableDataSource(this.rankingEquiposJuegoDePuntos);

    }
  }

  // BuscarAlumno(alumnoId: number): Alumno {

  //   let alumno: Alumno;
  //   // tslint:disable-next-line:no-unused-expression
  //   alumno = this.alumnosDelJuego.filter(res => res.id === alumnoId)[0];
  //   return alumno;
  // }

  // BuscarEquipo(equipoId: number): Equipo {

  //   let equipo: Equipo;
  //   // tslint:disable-next-line:no-unused-expression
  //   equipo = this.equiposDelJuego.filter(res => res.id === equipoId)[0];
  //   return equipo;
  // }

  // BuscarNivel(nivelId: number): Nivel {

  //   let nivel: Nivel;
  //   console.log(this.nivelesDelJuego.filter(res => res.id === nivelId)[0]);

  //   nivel = this.nivelesDelJuego.filter(res => res.id === nivelId)[0];

  //   return nivel;
  // }

  Informacion() {
    this.sesion.TomaInformacionJuego (this.nivelesDelJuego, this.tiposPuntosDelJuego);

  }
  AccederAlumno(alumno: TablaAlumnoJuegoDePuntos) {

    const alumnoSeleccionado = this.alumnosDelJuego.filter(res => res.Nombre === alumno.nombre &&
      res.PrimerApellido === alumno.primerApellido && res.SegundoApellido === alumno.segundoApellido)[0];

    const posicion = this.rankingJuegoDePuntos.filter(res => res.nombre === alumno.nombre &&
      res.primerApellido === alumno.primerApellido && res.segundoApellido === alumno.segundoApellido)[0].posicion;

      // Informacion que se necesitara para ver la evolución del alumno
    this.sesion.TomaDatosEvolucionAlumnoJuegoPuntos (
      posicion,
      this.tiposPuntosDelJuego,
      this.nivelesDelJuego,
      alumnoSeleccionado,
      this.listaAlumnosOrdenadaPorPuntos.filter(res => res.alumnoId === alumnoSeleccionado.id)[0]
    );
  }

  AccederEquipo(equipo: TablaEquipoJuegoDePuntos) {

    const equipoSeleccionado = this.equiposDelJuego.filter(res => res.Nombre === equipo.nombre)[0];


    const posicion = this.rankingEquiposJuegoDePuntos.filter(res => res.nombre === equipo.nombre)[0].posicion;
    console.log(posicion);
    // Informacion que se necesitara para ver la evolución del equipo

    this.sesion.TomaDatosEvolucionEquipoJuegoPuntos (
      posicion,
      equipoSeleccionado,
      this.listaEquiposOrdenadaPorPuntos.filter(res => res.equipoId === equipoSeleccionado.id)[0],
      this.nivelesDelJuego,
      this.tiposPuntosDelJuego
    );
  }

  MostrarRankingSeleccionado() {

    // Si es indefinido muestro la tabla del total de puntos
    if (this.tiposPuntosDelJuego.filter(res => res.id === Number(this.puntoSeleccionadoId))[0] === undefined) {

      console.log('Tabla del principio');
      this.TablaClasificacionTotal();

    } else {
      console.log('Voy a por la clasficiacion del punto');
      this.ClasificacionPorTipoDePunto();

    }
  }

  ClasificacionPorTipoDePunto() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      // tslint:disable-next-line:max-line-length
      console.log('Voy a por la clasficiacion del punto de tipo ' + this.puntoSeleccionadoId);
      // tslint:disable-next-line:max-line-length
      this.calculos.DameRankingPuntoSeleccionadoAlumnos (this.listaAlumnosOrdenadaPorPuntos, this.alumnosDelJuego, this.nivelesDelJuego, this.puntoSeleccionadoId).
      subscribe ( res => this.datasourceAlumno = new MatTableDataSource(res));
    } else {
      // tslint:disable-next-line:max-line-length
      this.calculos.DameRankingPuntoSeleccionadoEquipos (this.listaEquiposOrdenadaPorPuntos, this.equiposDelJuego, this.nivelesDelJuego, this.puntoSeleccionadoId).
      subscribe ( res => this.datasourceEquipo = new MatTableDataSource(res));
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

  // ReactivarJuego() {
  //   console.log(this.juegoSeleccionado);
  //   this.peticionesAPI.CambiaEstadoJuegoDePuntos(new Juego (this.juegoSeleccionado.Tipo, this.juegoSeleccionado.Modo,
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



  Reactivar() {
    reActivarJuego().then((result) => {
      if (result.value) {

        this.juegoSeleccionado.JuegoActivo = true;
        this.peticionesAPI.CambiaEstadoJuegoDePuntos (this.juegoSeleccionado)
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
  //   this.peticionesAPI.BorraJuegoDePuntos(this.juegoSeleccionado.id)
  //   .subscribe(res => {
  //     console.log('Juego eliminado');
  //     this.location.back();
  //   });
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

   
  Eliminar() {
    Swal.fire({
      title: '¿Seguro que quieres eliminar el juego?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then( async (result) => {
      if (result.value) {
        await this.calculos.EliminarJuegoDePuntos(this.juegoSeleccionado);
        Swal.fire('El juego se ha eliminado correctamente');
        this.location.back();
      }
    });
  }


  goBack() {
    this.location.back();
  }

}

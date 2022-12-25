import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
// Clases
import { Alumno, Equipo, Juego, TablaJornadas, AlumnoJuegoDeCompeticionFormulaUno, EquipoJuegoDeCompeticionFormulaUno,
         TablaAlumnoJuegoDeCompeticion, TablaEquipoJuegoDeCompeticion, Jornada, EnfrentamientoLiga } from '../../../clases/index';

// Servicio
import { SesionService, PeticionesAPIService, CalculosService, ComServerService } from '../../../servicios/index';

// Imports para abrir diálogo y swal
import { MatDialog } from '@angular/material';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';
import { reActivarJuego } from './../../ventana-re-activar-juego/reActivarJuego';

@Component({
  selector: 'app-juego-formula-uno-seleccionado-inactivo',
  templateUrl: './juego-formula-uno-seleccionado-inactivo.component.html',
  styleUrls: ['./juego-formula-uno-seleccionado-inactivo.component.scss']
})
export class JuegoDeCompeticionFormulaUnoSeleccionadoInactivoComponent implements OnInit {

  // Juego De CompeticionLiga seleccionado
  juegoSeleccionado: Juego;


  // Recupera la informacion del juego, los alumnos o los equipos del juego
  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];
  alumnosDelEquipo: Alumno[];

  // Recoge la inscripción de un alumno en el juego ordenada por puntos
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionFormulaUno[];
  listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionFormulaUno[];

  // Muestra la posición del alumno, el nombre y los apellidos del alumno y los puntos
  rankingIndividualFormulaUno: TablaAlumnoJuegoDeCompeticion[] = [];
  rankingEquiposFormulaUno: TablaEquipoJuegoDeCompeticion[] = [];

  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres reactivar el ';

  // tslint:disable-next-line:no-inferrable-types
  mensajeBorrar: string = 'Estás seguro/a de que quieres borrar el ';
  // Columnas Tabla
  displayedColumnsAlumnos: string[] = ['posicion', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'puntos'];

  displayedColumnsEquipos: string[] = ['posicion', 'nombreEquipo', 'miembros', 'puntos'];

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
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.AlumnosDelJuego();
    } else {
      this.EquiposDelJuego();
    }
    this.DameJornadasDelJuegoDeCompeticionSeleccionado();
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

  // ReactivarJuego() {
  //   console.log(this.juegoSeleccionado);
  //   this.peticionesAPI.CambiaEstadoJuegoDeCompeticionFormulaUno(new Juego (this.juegoSeleccionado.Tipo, this.juegoSeleccionado.Modo,
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

  
  Reactivar() {
    
    reActivarJuego().then((result) => {
      if (result.value) {

        this.juegoSeleccionado.JuegoActivo = true;
        this.peticionesAPI.CambiaEstadoJuegoDeCompeticionFormulaUno (this.juegoSeleccionado)
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
        await this.calculos.EliminarJuegoDeCompeticionFormulaUno(this.juegoSeleccionado);
        Swal.fire('El juego ha sido eliminado correctamente', ' ', 'success');
        this.location.back();
      }
    });
  }


  // EliminarJuego() {
  //     this.calculos.BorraJuegoCompeticionFormulaUno (this.juegoSeleccionado);
  //     this.location.back();
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

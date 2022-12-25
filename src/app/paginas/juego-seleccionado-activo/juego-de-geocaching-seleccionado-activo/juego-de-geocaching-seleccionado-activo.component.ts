import { Component, OnInit } from '@angular/core';
import { Juego, Alumno } from 'src/app/clases';
import { AlumnoJuegoDeCuestionario } from 'src/app/clases/AlumnoJuegoDeCuestionario';
import { TablaAlumnoJuegoDeCuestionario } from 'src/app/clases/TablaAlumnoJuegoDeCuestionario';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { SesionService, PeticionesAPIService, CalculosService, ComServerService } from 'src/app/servicios';
import { JuegoDeCuestionario } from 'src/app/clases/JuegoDeCuestionario';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
// tslint:disable-next-line:max-line-length
import { InformacionJuegoDeGeocachingDialogComponent } from './informacion-juego-de-geocaching-dialog/informacion-juego-de-geocaching-dialog.component';
import { AlumnoJuegoDeGeocaching } from 'src/app/clases/AlumnoJuegoDeGeocaching';
import { TablaAlumnoJuegoDeGeocaching } from 'src/app/clases/TablaAlumnoJuegoDeGeocaching';
import { JuegoDeGeocaching } from 'src/app/clases/JuegoDeGeocaching';

@Component({
  selector: 'app-juego-de-geocaching-seleccionado-activo',
  templateUrl: './juego-de-geocaching-seleccionado-activo.component.html',
  styleUrls: ['./juego-de-geocaching-seleccionado-activo.component.scss']
})
export class JuegoDeGeocachingSeleccionadoActivoComponent implements OnInit {

  // Juego de Cuestionario saleccionado
  juegoSeleccionado: Juego;

  // Recuperamos la informacion del juego
  alumnosDelJuego: Alumno[];

  // Lista de los alumnos ordenada segun su nota
  listaAlumnosOrdenadaPorPuntuacion: AlumnoJuegoDeGeocaching[];
  rankingAlumnosPorPuntuacion: TablaAlumnoJuegoDeGeocaching[];

  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estas segura/o que quieres desactivar: ';

  // tslint:disable-next-line:no-inferrable-types
  mensajeFinalizar: string = 'Estas segura/o de que quieres finalizar: ';

  // Orden conlumnas de la tabla
  displayedColumnsAlumnos: string[] = ['nombreAlumno', 'primerApellido', 'segundoApellido', 'puntuacion', 'etapas'];

  dataSourceAlumno;


  constructor(  public dialog: MatDialog,
                public sesion: SesionService,
                public peticionesAPI: PeticionesAPIService,
                public calculos: CalculosService,
                private location: Location,
                private comServerService: ComServerService) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.AlumnosDelJuego();
  }

  AlumnosDelJuego() {
    this.peticionesAPI.DameAlumnosJuegoDeGeocaching(this.juegoSeleccionado.id)
    .subscribe(alumnosJuego => {
      this.alumnosDelJuego = alumnosJuego;
      this.RecuperarInscripcionesAlumnoJuego();
    });
  }

  RecuperarInscripcionesAlumnoJuego() {
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeGeocaching(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntuacion = inscripciones;
      // tslint:disable-next-line:only-arrow-functions
      this.listaAlumnosOrdenadaPorPuntuacion = this.listaAlumnosOrdenadaPorPuntuacion.sort(function(a, b) {
        return b.Puntuacion - a.Puntuacion;
      });
      this.TablaClasificacionTotal();
    });
  }

  TablaClasificacionTotal() {
    this.rankingAlumnosPorPuntuacion = this.calculos.PrepararTablaRankingGeocaching(this.listaAlumnosOrdenadaPorPuntuacion,
      this.alumnosDelJuego);
    this.dataSourceAlumno = new MatTableDataSource(this.rankingAlumnosPorPuntuacion);
  }

  DesactivarJuego() {
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.ModificaJuegoDeGeocaching(new JuegoDeGeocaching(this.juegoSeleccionado.NombreJuego, this.juegoSeleccionado.Tipo, this.juegoSeleccionado.PuntuacionCorrecta,
      // tslint:disable-next-line:max-line-length
      this.juegoSeleccionado.PuntuacionIncorrecta, this.juegoSeleccionado.PuntuacionCorrectaBonus, this.juegoSeleccionado.PuntuacionIncorrectaBonus, this.juegoSeleccionado.PreguntasBasicas, this.juegoSeleccionado.PreguntasBonus, false, this.juegoSeleccionado.JuegoTerminado,
      // tslint:disable-next-line:max-line-length
      this.juegoSeleccionado.profesorId, this.juegoSeleccionado.grupoId, this.juegoSeleccionado.idescenario), this.juegoSeleccionado.id, this.juegoSeleccionado.grupoId)
      .subscribe(res => {
        this.comServerService.enviarInfoGrupoJuegoStatus(this.juegoSeleccionado.grupoId);
        this.location.back();
      });
  }

  AbrirDialogoConfirmacionDesactivar(): void {


    Swal.fire({
      title: 'Desactivar',
      text: "Estas segura/o de que quieres desactivar: " + this.juegoSeleccionado.Tipo,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'

    }).then((result) => {
      if (result.value) {
        this.DesactivarJuego();
        Swal.fire('Desactivado', this.juegoSeleccionado.Tipo + ' Desactivado correctamente', 'success');
      }
    })

  }

  FinalizarJuego() {
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.ModificaJuegoDeGeocaching(new JuegoDeGeocaching(this.juegoSeleccionado.NombreJuego, this.juegoSeleccionado.Tipo, this.juegoSeleccionado.PuntuacionCorrecta,
      // tslint:disable-next-line:max-line-length
      this.juegoSeleccionado.PuntuacionIncorrecta, this.juegoSeleccionado.PuntuacionCorrectaBonus, this.juegoSeleccionado.PuntuacionIncorrectaBonus, this.juegoSeleccionado.PreguntasBasicas, this.juegoSeleccionado.PreguntasBonus, false, true,
      // tslint:disable-next-line:max-line-length
      this.juegoSeleccionado.profesorId, this.juegoSeleccionado.grupoId, this.juegoSeleccionado.idescenario), this.juegoSeleccionado.id, this.juegoSeleccionado.grupoId)
      .subscribe(res => {
        this.location.back();
      });
  }

  AbrirDialogoConfirmacionFinalizar(): void {

    Swal.fire({
      title: 'Finalizar',
      text: "Estas segura/o de que quieres finalizar: " + this.juegoSeleccionado.Tipo,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'

    }).then((result) => {
      if (result.value) {
        this.FinalizarJuego();
        Swal.fire('Finalizar', this.juegoSeleccionado.Tipo + ' Finalizar correctamente', 'success');
      }
    })
  }

  AbrirDialogoInformacionJuego(): void {
    const dialogRef = this.dialog.open(InformacionJuegoDeGeocachingDialogComponent, {
      width: '45%',
      height: '60%',
      position: {
        top: '0%'
      }
    });
  }
  applyFilter(filterValue: string) {
    this.dataSourceAlumno.filter = filterValue.trim().toLowerCase();
  }

}

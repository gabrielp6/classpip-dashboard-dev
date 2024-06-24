import { Component, OnInit } from '@angular/core';
import { Alumno, Equipo, Juego, Punto, Nivel, AlumnoJuegoDePuntos, EquipoJuegoDePuntos,
  TablaAlumnoJuegoDePuntos, HistorialPuntosAlumno, TablaHistorialPuntosAlumno } from '../../../../clases/index';

import { Location } from '@angular/common';
// Services
import { SesionService, CalculosService, PeticionesAPIService } from '../../../../servicios/index';

// Imports para abrir diálogo
import { MatDialog } from '@angular/material';
import { DialogoConfirmacionComponent } from '../../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alumno-seleccionado-juego-de-puntos',
  templateUrl: './alumno-seleccionado-juego-de-puntos.component.html',
  styleUrls: ['./alumno-seleccionado-juego-de-puntos.component.scss']
})
export class AlumnoSeleccionadoJuegoDePuntosComponent implements OnInit {

  juegoSeleccionado: Juego;
  alumnoSeleccionado: Alumno;
  alumnoJuegoDePuntos: AlumnoJuegoDePuntos;

  // Recupera la informacion del juego, los alumnos o los equipos, los puntos y los niveles del juego
  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];
  puntosDelJuego: Punto[];
  nivelesDelJuego: Nivel[];

  nivel: Nivel;
  siguienteNivel: Nivel;

  // imagen
  imagenPerfil: string;

  listaSeleccionable: Punto[] = [];

  puntoSeleccionadoId: number;

  historial: TablaHistorialPuntosAlumno[] = [];
  historialTotal: TablaHistorialPuntosAlumno[] = [];

  displayedColumnsAlumnos: string[] = ['nombre', 'descripcion', 'valorPunto', 'fecha', ' '];

  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres borrar estos puntos a ';

  posicion: number;


  constructor(
               public dialog: MatDialog,
               public sesion: SesionService,
               public calculos: CalculosService,
               public peticionesAPI: PeticionesAPIService,
               public location: Location,
                ) { }


  ngOnInit() {

    const datos = this.sesion.DameDatosEvolucionAlumnoJuegoPuntos();
    this.posicion = datos.posicion;
    this.puntosDelJuego = datos.tiposPuntosDelJuego;

    this.nivelesDelJuego = datos.nivelesDelJuego;
    this.alumnoSeleccionado = datos.alumnoSeleccionado;
    this.alumnoJuegoDePuntos = datos.inscripcionAlumnoJuego;
    console.log ('Alumno ' + this.alumnoSeleccionado.id);
    console.log ('Alumno juego' + this.alumnoJuegoDePuntos.alumnoId);
    console.log ('Puntos totales juego' + this.alumnoJuegoDePuntos.PuntosTotalesAlumno);

    this.juegoSeleccionado = this.sesion.DameJuego();
    this.listaSeleccionable[0] =  new Punto('Totales');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.puntosDelJuego.length; i ++) {
      this.listaSeleccionable.push(this.puntosDelJuego[i]);
    }

    console.log ('lista seleccionable ' + this.listaSeleccionable.length);
    console.log('muestro la posicion ' + this.posicion);
    console.log(this.posicion);

    if (this.nivelesDelJuego !== undefined) {

        // Busco el nivel del alumno
        this.nivel = this.nivelesDelJuego.filter (nivel => nivel.id === this.alumnoJuegoDePuntos.nivelId)[0];
        // Y el nivel siguiente

        this.siguienteNivel = this.calculos.DameSiguienteNivel (this.nivelesDelJuego, this.nivel);
      }
    // this.Nivel();
    this.GET_ImagenPerfil();


    this.MostrarHistorialSeleccionado();

  }

  // Busca el logo que tiene el nombre del equipo.FotoEquipo y lo carga en imagenLogo
  GET_ImagenPerfil() {

    if (this.alumnoSeleccionado.ImagenPerfil !== undefined ) {
      this.peticionesAPI.DameImagenAlumno (this.alumnoSeleccionado.ImagenPerfil)
      .subscribe(response => {

        const blob = new Blob([response.blob()], { type: 'image/jpg'});

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          this.imagenPerfil = reader.result.toString();
        }, false);

        if (blob) {
          reader.readAsDataURL(blob);
        }
      });
    }

  }

  // Porcentaje(): any {
  //   //return this.calculos.Porcentaje (this.nivel, this.siguienteNivel, this.alumnoJuegoDePuntos, this.nivelesDelJuego);
  //   return 0;
  // }
  MostrarHistorialSeleccionado() {

    // Si es indefinido muestro la tabla del total de puntos
    if (this.puntosDelJuego.filter(res => res.id === Number(this.puntoSeleccionadoId))[0] === undefined) {

      console.log('Tabla historial de todos los puntos');
      this.HistorialTotal();

    } else {
      console.log('Tabla historial de un punto concreto');

      this.HistorialPorPunto();

    }
  }

  HistorialTotal() {
    console.log('Voy a por el historial');
    this.historial = [];

    this.peticionesAPI.DameHistorialPuntosAlumno(this.alumnoJuegoDePuntos.id)
    .subscribe(historial => {
      console.log ('Historial ' + historial );


      if (historial[0] !== null) {
        for (let i = 0; i < historial.length; i++) {
          console.log ('Historial ' + i);
          console.log (historial[i] );
          let punto: Punto;
          punto = this.puntosDelJuego.filter(res => res.id === historial[i].puntoId)[0];

          this.historial[i] = new TablaHistorialPuntosAlumno (punto.Nombre,
          punto.Descripcion, historial[i].ValorPunto, historial[i].fecha,
          historial[i].alumnoJuegoDePuntosId, historial[i].id, historial[i].puntoId);
        }
      } else {
        this.historial = undefined;
      }
    });


    this.historial = this.historial.filter(res => res.nombre !== '');
    this.historialTotal = this.historial;
    return this.historial;
  }

  HistorialPorPunto() {

    this.historial = this.historialTotal;
    this.historial = this.historial.filter(historial => historial.puntoId === Number(this.puntoSeleccionadoId));
    return this.historial;
  }
  BorrarPunto(punto: TablaHistorialPuntosAlumno) {
    // tslint:disable-next-line:max-line-length
    this.calculos.BorrarPunto (punto, this.alumnoJuegoDePuntos, this.nivelesDelJuego);
    this.historial = this.historial.filter(historial => historial.historialId !== punto.historialId);
    if (this.nivelesDelJuego !== undefined) {
        // Busco el nivel del alumno
        this.nivel = this.nivelesDelJuego.filter (nivel => nivel.id === this.alumnoJuegoDePuntos.nivelId)[0];
        // Y el nivel siguiente
        this.siguienteNivel = this.calculos.DameSiguienteNivel (this.nivelesDelJuego, this.nivel);
    }

  }

  AbrirDialogoConfirmacionBorrarPunto(punto: TablaHistorialPuntosAlumno): void {


    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: this.alumnoSeleccionado.Nombre,
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.BorrarPunto(punto);
        Swal.fire('Eliminados', 'Puntos eliminados correctamente', 'success');
      }
    });
  }
  goBack() {
    this.location.back();
  }

}

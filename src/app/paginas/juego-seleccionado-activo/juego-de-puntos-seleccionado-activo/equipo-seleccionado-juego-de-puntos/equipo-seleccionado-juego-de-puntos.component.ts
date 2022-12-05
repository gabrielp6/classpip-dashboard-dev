import { Component, OnInit } from '@angular/core';

import { Alumno, Equipo, Juego, Punto, Nivel, AlumnoJuegoDePuntos, EquipoJuegoDePuntos,
  TablaAlumnoJuegoDePuntos, HistorialPuntosAlumno, TablaHistorialPuntosEquipo } from '../../../../clases/index';


import { Location } from '@angular/common';

// Services
import { SesionService, CalculosService, PeticionesAPIService } from '../../../../servicios/index';


// Imports para abrir diálogo
import { MatDialog } from '@angular/material';
import { DialogoConfirmacionComponent } from '../../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-equipo-seleccionado-juego-de-puntos',
  templateUrl: './equipo-seleccionado-juego-de-puntos.component.html',
  styleUrls: ['./equipo-seleccionado-juego-de-puntos.component.scss']
})
export class EquipoSeleccionadoJuegoDePuntosComponent implements OnInit {

  juegoSeleccionado: Juego;
  equipoSeleccionado: Equipo;
  equipoJuegoDePuntos: EquipoJuegoDePuntos;

  // Recupera la informacion del juego, los alumnos o los equipos, los puntos y los niveles del juego
  equiposDelJuego: Equipo[];
  tiposPuntosDelJuego: Punto[];
  nivelesDelJuego: Nivel[];

  nivel: Nivel;
  siguienteNivel: Nivel;

  // imagen
  imagenPerfil: string;

  alumnosEquipo: Alumno[];

  listaSeleccionable: Punto[] = [];

  puntoSeleccionadoId: number;

  historial: TablaHistorialPuntosEquipo[] = [];

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

    const res = this.sesion.DameDatosEvolucionEquipoJuegoPuntos ();
    this.posicion = res.posicion;
    this.equipoSeleccionado = res.equipoSeleccionado;
    this.equipoJuegoDePuntos = res.inscripcionEquipoJuego;
    this.nivelesDelJuego = res.nivelesDelJuego;
    this.tiposPuntosDelJuego = res.tiposPuntosDelJuego;
    this.juegoSeleccionado = this.sesion.DameJuego();
    if (this.nivelesDelJuego !== undefined) {

      // Busco el nivel del alumno
      this.nivel = this.nivelesDelJuego.filter (nivel => nivel.id === this.equipoJuegoDePuntos.nivelId)[0];
      // Y el nivel siguiente

      this.siguienteNivel = this.calculos.DameSiguienteNivel (this.nivelesDelJuego, this.nivel);
    }
    this.listaSeleccionable[0] =  new Punto('Totales');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.tiposPuntosDelJuego.length; i ++) {
          this.listaSeleccionable.push(this.tiposPuntosDelJuego[i]);
    }
    console.log ('lista seleccionable ' + this.listaSeleccionable.length);

    this.GET_ImagenPerfil();


    this.AlumnosDelEquipo(this.equipoSeleccionado);

    this.MostrarHistorialSeleccionado();
  }

  AlumnosDelEquipo(equipo: Equipo) {

    this.peticionesAPI.DameAlumnosEquipo (equipo.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.alumnosEquipo = res;
        console.log(res);
      } else {
        // Mensaje al usuario
        console.log('No hay alumnos en este equipo');
        this.alumnosEquipo = undefined;
      }
    });
  }

  // Busca el logo que tiene el nombre del equipo.FotoEquipo y lo carga en imagenLogo
  GET_ImagenPerfil() {

    if (this.equipoSeleccionado.FotoEquipo !== undefined ) {
      this.peticionesAPI.DameLogoEquipo (this.equipoSeleccionado.FotoEquipo)
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

  // porcentaje(): number {
  //  // return this.calculos.PorcentajeEquipo (this.nivel, this.equipoJuegoDePuntos, this.nivelesDelJuego, this.siguienteNivel);
  //   return 0;
  // }

  MostrarHistorialSeleccionado() {

    // traigo el historial
    this.calculos.PreparaHistorialEquipo (this.equipoJuegoDePuntos, this.tiposPuntosDelJuego).
      subscribe ( res => {
                            console.log ('historial ' + res);
                            this.historial = res;
                            if (this.tiposPuntosDelJuego.filter(r => r.id === Number(this.puntoSeleccionadoId))[0] !== undefined) {
                              // filtro el historial segun el tipo de punto elegido
                              // tslint:disable-next-line:max-line-length
                              this.historial = this.historial.filter(historial => historial.puntoId === Number(this.puntoSeleccionadoId));
                            }
                          }


        );

  }
  BorrarPunto(punto: TablaHistorialPuntosEquipo) {
    // tslint:disable-next-line:max-line-length
    this.calculos.BorrarPuntoEquipo (punto, this.equipoJuegoDePuntos, this.nivelesDelJuego);
    this.historial = this.historial.filter(historial => historial.historialId !== punto.historialId);

    if (this.nivelesDelJuego !== undefined) {

      // Busco el nivel del alumno
      this.nivel = this.nivelesDelJuego.filter (nivel => nivel.id === this.equipoJuegoDePuntos.nivelId)[0];
      // Y el nivel siguiente

      this.siguienteNivel = this.calculos.DameSiguienteNivel (this.nivelesDelJuego, this.nivel);
    }

  }


  // BorrarPunto2(punto: TablaHistorialPuntosEquipo) {
  //   console.log(punto);
  //   this.calculos.BorrarPuntoEquipo (
  //             this.equipoJuegoDePuntos, punto, this.nivel,
  //             this.siguienteNivel, this.juegoSeleccionado,
  //             this.equipoSeleccionado, this.nivelesDelJuego).
  //   subscribe ( res => {
  //                         this.equipoJuegoDePuntos = res.equipo;
  //                         this.nivel = res.n;
  //                         this.siguienteNivel = res.sn;
  //                         this.MostrarHistorialSeleccionado();

  //   });
  // }



  AbrirDialogoConfirmacionBorrarPunto(punto: TablaHistorialPuntosEquipo): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: this.equipoSeleccionado.Nombre,
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

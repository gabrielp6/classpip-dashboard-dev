import { Component, OnInit } from '@angular/core';
import { SesionService, PeticionesAPIService, CalculosService, ComServerService } from '../../../servicios/index';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { AlumnoJuegoDeVotacionAOpciones } from 'src/app/clases';
import { MatTableDataSource } from '@angular/material/table';

import { Howl } from 'howler';
import { desactivarJuego } from '../../ventana-activar-desactivar/activarDesactivarJuego';

@Component({
  selector: 'app-juego-de-votacion-aopciones-seleccionado-activo',
  templateUrl: './juego-de-votacion-aopciones-seleccionado-activo.component.html',
  styleUrls: ['./juego-de-votacion-aopciones-seleccionado-activo.component.scss']
})
export class JuegoDeVotacionAOpcionesSeleccionadoActivoComponent implements OnInit {
  juegoSeleccionado: any;
  alumnosInscritos: AlumnoJuegoDeVotacionAOpciones[];
  datos: any[];
  dataSource;
  displayedColumns: string[] = ['opcion', 'incremento', 'puntos'];
  numeroRespuestas = 0;
  numeroParticipantes: number;
  ficheroGenerado = false;
  sonido = true;
 
  constructor(
    public sesion: SesionService,
    public peticionesAPI: PeticionesAPIService,
    public calculos: CalculosService,
    private comServer: ComServerService,
    private location: Location) { }

  ngOnInit() {
    const sound = new Howl({
      src: ['/assets/got-it-done.mp3']
    });
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log(this.juegoSeleccionado);
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.RecuperarInscripcionesAlumnoJuego();
    } else {
      console.log ('aun no funciona la modalidad por equipos');
    }
    this.comServer.EsperoRespuestasVotacionAOpciones()
    .subscribe((respuesta) => {
        if (this.sonido) {
          sound.volume (0.1);
          sound.play();
        }
        console.log ('recibo respuesta');
        console.log (respuesta);
        if (respuesta.votos) {
          this.numeroRespuestas++;
          let i;
          for (i = 0; i < respuesta.votos.length; i++) {
            const index = this.datos.findIndex (entrada => entrada.opcion === respuesta.votos[i].opcion );
            this.datos [index].incremento =  respuesta.votos[i].puntos;
            this.datos [index].puntos =  this.datos [index].puntos + respuesta.votos[i].puntos ;
          }
          this.datos.sort((a, b) => b.puntos - a.puntos);
          this.dataSource = new MatTableDataSource(this.datos);
        }
    });
  }


  RecuperarInscripcionesAlumnoJuego() {
    console.log ('vamos por las inscripciones ' + this.juegoSeleccionado.id);
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeVotacionAOpciones(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.alumnosInscritos = inscripciones;
      this.numeroParticipantes = this.alumnosInscritos.length;
      this.PrepararTabla();
    });
  }


  PrepararTabla() {
    // preparamos la tabla para guardar los votos
    this.datos = [];
    let i;
    for (i = 0; i < this.juegoSeleccionado.Opciones.length; i++) {
      this.datos.push ({
        opcion:  this.juegoSeleccionado.Opciones[i],
        incremento: 0,
        puntos: 0
      });
    }
    this.alumnosInscritos.forEach (respuesta => {
      if (respuesta.Votos) {
        this.numeroRespuestas++;
        for (i = 0; i < respuesta.Votos.length; i++) {
          const index = this.datos.findIndex (entrada => entrada.opcion === respuesta.Votos[i].opcion );
          this.datos [index].puntos =  this.datos [index].puntos + respuesta.Votos[i].puntos ;
        }
      }
    });
    this.datos.sort((a, b) => b.puntos - a.puntos);
    this.dataSource = new MatTableDataSource(this.datos);

  }


  DesactivarJuego() {
    desactivarJuego().then((result) => {
      if (result.value) {

        this.juegoSeleccionado.JuegoActivo = false;
        this.peticionesAPI.CambiaEstadoJuegoDeVotacionAOpciones (this.juegoSeleccionado)
        .subscribe(res => {
            if (res !== undefined) {
              this.comServer.enviarInfoGrupoJuegoStatus(this.juegoSeleccionado.grupoId);
              console.log(res);
              console.log('juego desactivado');
              Swal.fire('El juego se ha desactivado correctamente');
              this.location.back();
            }
        });
      }
    });
  }


}

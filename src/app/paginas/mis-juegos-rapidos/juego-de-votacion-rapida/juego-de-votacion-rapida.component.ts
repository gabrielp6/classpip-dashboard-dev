import { Component, OnInit } from '@angular/core';
import {SesionService, PeticionesAPIService, CalculosService, ComServerService} from '../../../servicios/index';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { Howl } from 'howler';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Observable} from 'rxjs';
import { of } from 'rxjs';
import 'rxjs';

import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';


@Component({
  selector: 'app-juego-de-votacion-rapida',
  templateUrl: './juego-de-votacion-rapida.component.html',
  styleUrls: ['./juego-de-votacion-rapida.component.scss']
})
export class JuegoDeVotacionRapidaComponent implements OnInit {
  juegoSeleccionado: any;
  participantes: any[];
  respuestas: any[];

  mostrarParticipantes = true;
  puntos: number[];
  numeroRespuestas = 0;
  numeroParticipantes = 0;
  informacionPreparada = false;
  datos: any[];
  dataSource;
  displayedColumns: string[] = ['concepto', 'incremento', 'puntos'];
  profesorId: number;
  sonido = true;
  ficheroGenerado = false;

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = '147.83.118.92:8100/home';

  constructor(
    private calculos: CalculosService,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    public comServer: ComServerService,
    private router: Router ) { }



    ngOnInit() {
      const sound = new Howl({
        src: ['../assets/got-it-done.mp3']
      });
      this.participantes = [];
      this.profesorId = this.sesion.DameProfesor().id;
      this.juegoSeleccionado = this.sesion.DameJuego();
      this.puntos = Array (this.juegoSeleccionado.Conceptos.length).fill (0);
      this.respuestas = this.juegoSeleccionado.Respuestas;
      if (this.respuestas === undefined) {
        this.respuestas = [];
        this.numeroParticipantes = 0;
        this.numeroRespuestas = 0;
      } else {
        this.numeroParticipantes = this.respuestas.length;
        this.numeroRespuestas = this.respuestas.length;
      }
      this.PrepararTabla();

      console.log ('tengo juego');
      this.comServer.EsperoNickNames()
      .subscribe((nick) => {
          this.numeroParticipantes++;
          if (this.sonido) {
            sound.volume (0.1);
            sound.play();
          }
          console.log ('se ha conectado ' + nick);
          this.participantes.push ({
            nickName: nick,
            contestado: false
          });
      });


      this.comServer.EsperoRespuestasVotacionRapida()
      .subscribe((respuesta) => {
          if (this.sonido) {
            sound.volume (0.1);
            sound.play();
          }
          this.respuestas.push (respuesta);
          this.numeroRespuestas++;
          // tslint:disable-next-line:no-shadowed-variable
          this.datos.forEach (concepto => concepto.incremento = 0);
          let i;
          for (i = 0; i < respuesta.votos.length; i++) {
            const index = this.datos.findIndex (entrada => entrada.concepto === respuesta.votos[i].c );
            this.datos [index].incremento =  respuesta.votos[i].puntos;
            this.datos [index].puntos =  this.datos [index].puntos + respuesta.votos[i].puntos;
          }
          this.datos.sort((a, b) => b.puntos - a.puntos);
          this.dataSource = new MatTableDataSource(this.datos);

          this.participantes.filter (participante => participante.nickName === respuesta.nick)[0].contestado = true;
      });
    }

  Toogle() {
    this.mostrarParticipantes = !this.mostrarParticipantes;
  }

  PrepararTabla() {
      // preparamos la tabla para guardar los votos
      this.datos = [];
      let i;
      for (i = 0; i < this.juegoSeleccionado.Conceptos.length; i++) {
        this.datos.push ({
          concepto:  this.juegoSeleccionado.Conceptos[i],
          incremento: 0,
          puntos: 0
        });
      }
      this.respuestas.forEach (respuesta => {
        for (i = 0; i < respuesta.votos.length; i++) {
          const index = this.datos.findIndex (entrada => entrada.concepto === respuesta.votos[i].c );
          this.datos [index].puntos =  this.datos [index].puntos + respuesta.votos[i].puntos ;
        }
      });
      this.datos.sort((a, b) => b.puntos - a.puntos);
      this.dataSource = new MatTableDataSource(this.datos);

  }

  EliminarJuegoRapido () {
    Swal.fire({
      title: '¿Seguro que quieres eliminar este juego rápido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {
        this.peticionesAPI.BorraJuegoDeVotacionRapida (this.juegoSeleccionado.id)
        .subscribe(res => {
            if (res !== undefined) {
              Swal.fire('El juego se ha eliminado correctamente');
              this.router.navigate(['/inicio/' + this.profesorId]);
            }
        });
      }
    });

  }
  GenerarInforme() {
    const margenIzquierdo = 15;
    const margenSuperior = 20;
    const interlineado = 5;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setFont('arial', 'normal');
    doc.setTextColor("blue");
    doc.text('Resultados de la votación rápida', margenIzquierdo, margenSuperior);
    doc.line(margenIzquierdo, margenSuperior + 5, margenIzquierdo + 150, margenSuperior + 5);
    const fecha = new Date().toLocaleDateString();


    doc.setTextColor("black");
    doc.setFontSize(14);
    const splittedText = doc.splitTextToSize('Titulo de la votación: ' + this.juegoSeleccionado.NombreJuego,  180);
    doc.text (splittedText, margenIzquierdo, margenSuperior + 20);
    doc.text('Fecha: ' + fecha, margenIzquierdo, margenSuperior + 40);
    doc.text('Número de participantes: ' + this.numeroParticipantes, margenIzquierdo,  margenSuperior + 50);
    const porcentaje = ((this.numeroRespuestas / this.numeroParticipantes) * 100 ).toFixed(0);
    doc.text('Número de respuestas: ' + this.numeroRespuestas + ' (' + porcentaje + '%)', margenIzquierdo, margenSuperior + 60);

    autoTable(doc, { html: '#tabla',  startY:  margenSuperior + 80 });


    doc.save('informe.pdf');
    this.ficheroGenerado = true;

  }


canExit(): Observable <boolean> {
  // esta función se llamará cada vez que quedamos salir de la página
    const confirmacionObservable = new Observable <boolean>( obs => {
      let mensaje;
      if (!this.ficheroGenerado) {
        mensaje = 'No has generado el fichero PDF.';
      }

      Swal.fire({
          title: '¿Seguro que quieres salir?',
          html: mensaje,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, estoy seguro'
        }).then((result : any) => {
          if (result.value) {
            this.sonido = false;
            this.comServer.InformarFinJuegoRapido (this.profesorId);
            // this.juegoSeleccionado.Respuestas = this.respuestas;
            // // salvo las respuestas que hay hasta el momento para poder recuperarlas si voilvemos a esta página
            // this.peticionesAPI.ModificarJuegoVotacionRapida (this.juegoSeleccionado).subscribe();
          }
          obs.next (result.value);
      });
    });

    return confirmacionObservable;
}

}

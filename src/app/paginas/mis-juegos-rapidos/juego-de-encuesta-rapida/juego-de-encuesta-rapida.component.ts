import { Component, OnInit } from '@angular/core';
import {SesionService, PeticionesAPIService, CalculosService, ComServerService} from '../../../servicios/index';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { Howl } from 'howler';
import { MatTableDataSource } from '@angular/material/table';
import { CuestionarioSatisfaccion} from '../../../clases/index';
import { Router, ActivatedRoute } from '@angular/router';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { Observable} from 'rxjs';
import { of } from 'rxjs';
import 'rxjs';

import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';



@Component({
  selector: 'app-juego-de-encuesta-rapida',
  templateUrl: './juego-de-encuesta-rapida.component.html',
  styleUrls: ['./juego-de-encuesta-rapida.component.scss']
})
export class JuegoDeEncuestaRapidaComponent implements OnInit {
  juegoSeleccionado: any;
  participantes: any[];
  respuestas: any [];
  mostrarParticipantes = true;
  informacionPreparada = false;


  respuestasAfirmaciones: number[];
  respuestasPreguntasAbiertas: string [][];
  cuestionario: CuestionarioSatisfaccion;
  numeroRespuestas: number;
  numeroParticipantes: number;
  afirmaciones: any[];
  datosGrafico: any[];
  dataSource;
  displayedColumns: string[] = ['afirmacion', 'media'];
  grafico;
  profesorId: number;
  ficheroGenerado = false;
  todoGuardado = true;
  sonido = true;

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
    // puede haber respuestas ya guardadas en el juego
    this.respuestas = this.juegoSeleccionado.Respuestas;
    if (this.respuestas === undefined) {
      this.respuestas = [];
      this.numeroParticipantes = 0;
      this.numeroRespuestas = 0;
    } else {
      console.log ('ya hay respuestas');
      console.log (this.respuestas);
      this.numeroParticipantes = this.respuestas.length;
      this.numeroRespuestas = this.respuestas.length;
    }
    this.peticionesAPI.DameCuestionarioSatisfaccion (this.juegoSeleccionado.cuestionarioSatisfaccionId)
    .subscribe (cuestionario => {
      this.cuestionario = cuestionario;
    });
    this.comServer.EsperoNickNames()
    .subscribe((nick) => {
        if (this.sonido) {
          sound.volume (0.1);
          sound.play();
        }
        this.numeroParticipantes++;
        this.participantes.push ({
          nickName: nick,
          contestado: false
        });
    });
    this.comServer.EsperoRespuestasEncuestaRapida()
    .subscribe((respuesta) => {
        console.log ('respuesta nueva');
        console.log (respuesta);
        if (this.sonido) {
          sound.volume (0.1);
          sound.play();
        }
        if (!respuesta.respuestas.RespuestasAfirmaciones.some (elemento => elemento === null)) {
          // tomo nota de que hay respuestas sin guardar en el pdf
          this.todoGuardado = false;
          this.numeroRespuestas++;
          console.log ('recibo respuesta');
          console.log (respuesta);
          this.respuestas.push (respuesta.respuestas);
          this.participantes.filter (participante => participante.nickName === respuesta.nick)[0].contestado = true;
          // Esto lo hago para que la información se actualice en la página en tiempo real
          this.PreparaInformacion();
        }
    });
  }
  tabChanged(event) {
    if (event.index === 1) {
      // hay que preparar resultados si pasamos a la página de resultados
      this.PreparaInformacion ();
    }
  }


  PreparaInformacion() {

    this.respuestasAfirmaciones = Array(this.cuestionario.Afirmaciones.length).fill (0);
    this.respuestasPreguntasAbiertas = Array(this.cuestionario.PreguntasAbiertas.length);
    let i: number;
    for ( i = 0; i < this.respuestasPreguntasAbiertas.length; i++) {
      this.respuestasPreguntasAbiertas[i] = [];
    }


    // Eliminamos las respuestas con alguna respuesta a afirmaciones que sea null
    this.respuestas = this.respuestas.filter (respuesta => !respuesta.RespuestasAfirmaciones.some (elemento => elemento === null));
    this.numeroRespuestas = this.respuestas.length;
    console.log ('Numero de respuestas ', this.numeroRespuestas);
    console.log ('repsutestas ', this.respuestas);
    this.respuestas.forEach (respuesta => {
        for ( i = 0; i < this.respuestasAfirmaciones.length; i++) {
          this.respuestasAfirmaciones[i] =  this.respuestasAfirmaciones[i]  + respuesta.RespuestasAfirmaciones[i];
        }
        for ( i = 0; i < this.respuestasPreguntasAbiertas.length; i++) {
          if (respuesta.RespuestasPreguntasAbiertas[i]) {
            // La respuesta podría estsr vacia
            this.respuestasPreguntasAbiertas[i].push (respuesta.RespuestasPreguntasAbiertas[i]);
          }
        }

    });
    this.afirmaciones = [];
    this.datosGrafico = [];


    for ( i = 0; i < this.respuestasAfirmaciones.length; i++) {
      const media =  this.respuestasAfirmaciones[i] / this.numeroRespuestas;
      this.afirmaciones.push ({
        Texto: this.cuestionario.Afirmaciones[i],
        Media: media
      });
      this.datosGrafico.push ( [this.cuestionario.Afirmaciones[i], media]);
    }


    this.datosGrafico = [['afirmaciones', 'media']].concat(this.datosGrafico.reverse());
    this.dataSource = new MatTableDataSource(this.afirmaciones);

    this.grafico = {
      dataset: {
          source: this.datosGrafico,
      },
      grid: {containLabel: true},
      xAxis: {name: 'media', min: 0, max: 5},
      yAxis: {type: 'category'},
      visualMap: {
          orient: 'horizontal',
          left: 'center',
          min: 1,
          max: 5,
          text: ['High Score', 'Low Score'],
          // Map the score column to color
          dimension: 1,
          inRange: {
              color: ['#FFF633', '#33FF49']
          }
      },
      series: [
          {
              type: 'bar',
              encode: {
                  // Map the "amount" column to X axis.
                  x: 'media',
                  // Map the "product" column to Y axis
                  y: 'afirmacion'
              }
          }
      ]
    };


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
        this.peticionesAPI.BorraJuegoDeEncuestaRapida (this.juegoSeleccionado.id)
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
    doc.text('Resultados del cuestionario de satisfacción', margenIzquierdo, margenSuperior);
    doc.line(margenIzquierdo, margenSuperior + 5, margenIzquierdo + 150, margenSuperior + 5);
    const fecha = new Date().toLocaleDateString();


    doc.setTextColor("black");
    doc.setFontSize(14);
    const splittedText = doc.splitTextToSize('Titulo de la encuesta: ' + this.juegoSeleccionado.NombreJuego,  180);
    doc.text (splittedText, margenIzquierdo, margenSuperior + 20);
    doc.text('Fecha: ' + fecha, margenIzquierdo, margenSuperior + 40);
    doc.text('Número de participantes: ' + this.numeroParticipantes, margenIzquierdo,  margenSuperior + 50);
    const porcentaje = ((this.numeroRespuestas / this.numeroParticipantes) * 100 ).toFixed(0);
    doc.text('Número de respuestas: ' + this.numeroRespuestas + ' (' + porcentaje + '%)', margenIzquierdo, margenSuperior + 60);

    autoTable(doc, { html: '#tabla',  startY:  margenSuperior + 70 });

    const pageHeight = doc.internal.pageSize.height;
    let i;
    for (i = 0; i < this.respuestasPreguntasAbiertas.length; i++) {
      doc.addPage("a4", "p");
      doc.setFontSize(18);
      doc.setTextColor("blue");

      doc.text(this.cuestionario.PreguntasAbiertas [i], margenIzquierdo,  margenSuperior);
      doc.line(margenIzquierdo, margenSuperior + 5, margenIzquierdo + 150, margenSuperior + 5);
      let cont = interlineado * 4;
      let j;
      doc.setFontSize(12);
      doc.setTextColor("black");
     

      for (j = 0; j < this.respuestasPreguntasAbiertas[i].length; j++) {
        const splittedText = doc.splitTextToSize(this.respuestasPreguntasAbiertas[i][j],  160);

        doc.text(splittedText, margenIzquierdo,  margenSuperior + cont);
        cont = cont + interlineado * (splittedText.length);
        doc.line(margenIzquierdo, margenSuperior + cont, margenIzquierdo + 150, margenSuperior + cont);
        cont = cont + interlineado;
        if (cont > pageHeight) {
          doc.addPage();
          cont = 0;
        }
      }
    }

    const pageCount = doc.getNumberOfPages(); //Total Page Number
    for (i = 0; i < pageCount; i++) {
      doc.setPage(i);
      const pageCurrent = doc.getCurrentPageInfo().pageNumber; //Current Page
      doc.setFontSize(12);
      doc.text('página: ' + pageCurrent + '/' + pageCount, 180,  margenSuperior);
    }

    // Este código es para generar los gráficos en pdf
    // pero tiene el problema de el tamaño con el que genera el gráfico
    // depende de los que se vea en ese momento en el navegador
    // De momento no se cómo hacer que salga con un tamaño fijo siempre igual
    // con independencia de cómo se vea en ese momento en el navegador
    // tslint:disable-next-line:only-arrow-functions
    // html2canvas(document.getElementById ('grafico')).then(function(canvas) {

    //   console.log ('CANVAS');
    //   console.log (canvas);
    //   const img = new Image();
    //   img.src = canvas.toDataURL();
    //   console.log ('&&&&&&&&&&&&&&&&&');
    //   console.log (img);
    //   // console.log (img.);
    //   // const ratio = img.height / img.width;
    //   // console.log (ratio);
    //   // console.log ((ratio * 160).toFixed(0));
    //   // const alto = Number((ratio * 160).toFixed(0));
    //   // const ancho = 160;

    //   doc.addPage("a4", "p");

    //   doc.addImage(canvas, 'JPEG', 0, 0, 200, 200);

    //   doc.addPage("a4", "p");
    //   doc.addImage(canvas, 'JPEG', 10, 10, 160, 180);

    //   doc.save('informe.pdf');

    // });

    doc.save('informe.pdf');
    this.ficheroGenerado = true;
    this.todoGuardado = true;
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
            // this.peticionesAPI.ModificarJuegoDeEncuestaRapida (this.juegoSeleccionado).subscribe();
          }
          obs.next (result.value);
      });
    });

    return confirmacionObservable;
}


}

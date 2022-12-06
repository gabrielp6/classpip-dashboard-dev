import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import {SesionService, PeticionesAPIService, CalculosService} from '../../../servicios/index';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import {AlumnoJuegoDeCuestionarioSatisfaccion, CuestionarioSatisfaccion } from '../../../clases/index';
import { MatTableDataSource } from '@angular/material/table';

import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-juego-de-cuestionario-satisfaccion-activo',
  templateUrl: './juego-de-cuestionario-satisfaccion-activo.component.html',
  styleUrls: ['./juego-de-cuestionario-satisfaccion-activo.component.scss']
})
export class JuegoDeCuestionarioSatisfaccionActivoComponent implements OnInit {
  @ViewChild('htmlData', {static: false}) htmlData: ElementRef;

  juegoSeleccionado: any;
  inscripciones: AlumnoJuegoDeCuestionarioSatisfaccion[];
  respuestasAfirmaciones: number[];
  respuestasPreguntasAbiertas: string [][];
  cuestionario: CuestionarioSatisfaccion;
  numeroRespuestas: number;
  informacionPreparada = false;
  afirmaciones: any[];
  datosGrafico: any[];
  dataSource;
  displayedColumns: string[] = ['afirmacion', 'media'];
  grafico;


  constructor(
    private calculos: CalculosService,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private location: Location
  ) { }

  ngOnInit() {


    this.juegoSeleccionado = this.sesion.DameJuego();
    this.peticionesAPI.DameCuestionarioSatisfaccion (this.juegoSeleccionado.cuestionarioSatisfaccionId)
    .subscribe (cuestionario => {
      this.cuestionario = cuestionario;
      this.RecuperarInscripcionesAlumnoJuego();
    });

  }

  RecuperarInscripcionesAlumnoJuego() {
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCuestionarioSatisfaccion(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.inscripciones = inscripciones;
      // tslint:disable-next-line:only-arrow-functions
      this.PreparaInformacion();
      this.informacionPreparada = true;
    });
  }

  PreparaInformacion() {
    this.numeroRespuestas = 0;
    this.respuestasAfirmaciones = Array(this.cuestionario.Afirmaciones.length).fill (0);
    this.respuestasPreguntasAbiertas = Array(this.cuestionario.PreguntasAbiertas.length);
    let i: number;
    for ( i = 0; i < this.respuestasPreguntasAbiertas.length; i++) {
      this.respuestasPreguntasAbiertas[i] = [];
    }
    this.inscripciones.forEach (inscripcion => {
      if (inscripcion.Contestado) {
        this.numeroRespuestas++;
        for ( i = 0; i < this.respuestasAfirmaciones.length; i++) {
          this.respuestasAfirmaciones[i] =  this.respuestasAfirmaciones[i]  + inscripcion.RespuestasAfirmaciones[i];
        }
        for ( i = 0; i < this.respuestasPreguntasAbiertas.length; i++) {
          this.respuestasPreguntasAbiertas[i].push (inscripcion.RespuestasPreguntasAbiertas[i]);
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

    console.log ('datos para grafico');
    console.log (this.datosGrafico);

    this.dataSource = new MatTableDataSource(this.afirmaciones);

    this.grafico = {
      dataset: {
          source: this.datosGrafico,
      },
      grid: {containLabel: true},
      xAxis: {name: 'media', min: 1, max: 5},
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

  DesactivarJuego() {
    Swal.fire({
      title: '¿Seguro que quieres desactivar el juego?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {

        this.juegoSeleccionado.JuegoActivo = false;
        this.peticionesAPI.CambiaEstadoJuegoDeCuestionarioSatisfaccion (this.juegoSeleccionado)
        .subscribe(res => {
            if (res !== undefined) {
              console.log(res);
              console.log('juego desactivado');
              Swal.fire('El juego se ha desactivado correctamente');
              this.location.back();
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
    doc.setTextColor('blue');
    doc.text('Resultados del cuestionario de satisfacción', margenIzquierdo, margenSuperior);
    doc.line(margenIzquierdo, margenSuperior + 5, margenIzquierdo + 150, margenSuperior + 5);
    const fecha = new Date().toLocaleDateString();

    doc.setTextColor('black');
    doc.setFontSize(14);
    doc.text('Titulo del cuestionario: ' + this.juegoSeleccionado.NombreJuego, margenIzquierdo, margenSuperior + 20);
    doc.text('Fecha: ' + fecha, margenIzquierdo, margenSuperior + 30);
    doc.text('Número de participantes: ' + this.inscripciones.length, margenIzquierdo,  margenSuperior + 40);
    const porcentaje = ((this.numeroRespuestas / this.inscripciones.length) * 100 ).toFixed(0);
    doc.text('Número de respuestas: ' + this.numeroRespuestas + ' (' + porcentaje + '%)', margenIzquierdo, margenSuperior + 50);

    autoTable(doc, { html: '#tabla',  startY:  margenSuperior + 70 });

    const pageHeight = doc.internal.pageSize.height;
    let i;
    for (i = 0; i < this.respuestasPreguntasAbiertas.length; i++) {
      doc.addPage('a4', 'p');
      doc.setFontSize(18);
      doc.setTextColor('blue');
      let splittedText = doc.splitTextToSize(this.cuestionario.PreguntasAbiertas [i],  160);
      doc.text(splittedText, margenIzquierdo,  margenSuperior);
      doc.line(margenIzquierdo, margenSuperior + 5, margenIzquierdo + 150, margenSuperior + 5);
      let cont = interlineado * (splittedText.length) * 4;
      let j;
      doc.setFontSize(12);
      doc.setTextColor('black');
      for (j = 0; j < this.respuestasPreguntasAbiertas[i].length; j++) {
        splittedText = doc.splitTextToSize(this.respuestasPreguntasAbiertas[i][j],  160);

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

    const pageCount = doc.getNumberOfPages(); // Total Page Number
    for (i = 0; i < pageCount; i++) {
      doc.setPage(i);
      const pageCurrent = doc.getCurrentPageInfo().pageNumber; // Current Page
      doc.setFontSize(12);
      doc.text('página: ' + pageCurrent + '/' + pageCount, 180,  margenSuperior);
    }

    doc.save('informe.pdf');


  }
}

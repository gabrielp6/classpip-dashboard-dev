import { Component, OnInit } from '@angular/core';
import { SesionService, PeticionesAPIService, CalculosService, ComServerService } from '../../../servicios/index';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { AlumnoJuegoDeVotacionAOpciones } from 'src/app/clases';
import { MatTableDataSource } from '@angular/material/table';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import { reActivarJuego } from './../../ventana-re-activar-juego/reActivarJuego';


@Component({
  selector: 'app-juego-de-votacion-aopciones-seleccionado-inactivo',
  templateUrl: './juego-de-votacion-aopciones-seleccionado-inactivo.component.html',
  styleUrls: ['./juego-de-votacion-aopciones-seleccionado-inactivo.component.scss']
})
export class JuegoDeVotacionAOpcionesSeleccionadoInactivoComponent implements OnInit {
  juegoSeleccionado: any;
  alumnosInscritos: AlumnoJuegoDeVotacionAOpciones[];
  datos: any[];
  dataSource;
  displayedColumns: string[] = ['opcion', 'puntos'];
  numeroRespuestas = 0;
  numeroParticipantes: number;
  ficheroGenerado = false;
  sonido = true;

  constructor(
    public sesion: SesionService,
    public peticionesAPI: PeticionesAPIService,
    public calculos: CalculosService,
    private location: Location,
    public comServerService: ComServerService
  ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log(this.juegoSeleccionado);
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.RecuperarInscripcionesAlumnoJuego();
    } else {
      console.log ('aun no funciona la modalidad por equipos');
    }
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


  GenerarInforme() {
    const margenIzquierdo = 15;
    const margenSuperior = 20;
    const interlineado = 5;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setFont('arial', 'normal');
    doc.setTextColor("blue");
    doc.text('Resultados de la votación', margenIzquierdo, margenSuperior);
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


  
  Eliminar() {
    Swal.fire({
      title: '¿Seguro que quieres eliminar el juego de votación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then(async (result) => {
      if (result.value) {
        await this.calculos.EliminarJuegoDeVotacionAOpciones(this.juegoSeleccionado);
        Swal.fire('El juego se ha eliminado correctamente');
        this.location.back();
      }
    });
  }

  Reactivar() {
    reActivarJuego().then((result) => {
      if (result.value) {

        this.juegoSeleccionado.JuegoActivo = true;
        this.peticionesAPI.CambiaEstadoJuegoDeVotacionAOpciones (this.juegoSeleccionado)
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

}

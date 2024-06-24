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
import { Observable} from 'rxjs';
import { of } from 'rxjs';
import 'rxjs';


import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';



@Component({
  selector: 'app-juego-de-coger-turno-rapido',
  templateUrl: './juego-de-coger-turno-rapido.component.html',
  styleUrls: ['./juego-de-coger-turno-rapido.component.scss']
})
export class JuegoDeCogerTurnoRapidoComponent implements OnInit {
  juegoSeleccionado: any;
  participantes: any[];
  respuestas: any [];
  mostrarParticipantes = true;
  informacionPreparada = false;
  profesorId: number;
  dataSource;

  nuevoTurno;
  displayedColumns: string[] = ['dia', 'hora', 'nombre', 'iconos'];
  ficheroGenerado = false;
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
      this.respuestas = [];
      console.log ('tengo juego');
      this.profesorId = this.sesion.DameProfesor().id;
      this.juegoSeleccionado = this.sesion.DameJuego();
      // tslint:disable-next-line:only-arrow-functions
      this.juegoSeleccionado.Turnos = this.juegoSeleccionado.Turnos.sort(function(a, b) {

        if (a.dia < b.dia) {
            return -1;
        } else if (a.dia > b.dia) {
            return 1;
        } else if (a.hora < b.hora) {
            return -1;
        } else if ( a.hora > b.hora) {
            return 1;
        } else {
          return 0;
        }
      });

      this.dataSource = new MatTableDataSource(this.juegoSeleccionado.Turnos);

      console.log ('tengo juego');
      this.comServer.EsperoNickNames()
      .subscribe((nick) => {
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
      this.comServer.EsperoTurnos()
      .subscribe((info) => {
          if (this.sonido) {
            sound.play();
            sound.volume (0.1);
          }
          if (info.turno.dia !== '*') {
            // tslint:disable-next-line:max-line-length
            this.juegoSeleccionado.Turnos.filter (turno => (turno.dia === info.turno.dia) && (turno.hora === info.turno.hora))[0].persona = info.nick;
            this.comServer.NotificarTurnoCogido (this.juegoSeleccionado.Clave, info.turno );
          } else {
            this.juegoSeleccionado.Turnos.push ( {
              dia: info.turno.dia,
              hora: info.turno.hora,
              persona: info.nick
            });
          }

          // tslint:disable-next-line:only-arrow-functions
          this.juegoSeleccionado.Turnos = this.juegoSeleccionado.Turnos.sort(function(a, b) {

            if (a.dia < b.dia) {
              return -1;
            } else if (a.dia > b.dia) {
              return 1;
            } else if (a.hora < b.hora) {
              return -1;
            } else if ( a.hora > b.hora) {
              return 1;
            } else {
              return 0;
            }
          });
          console.log ('turnos preparados');
          console.log (this.juegoSeleccionado.Turnos);
          this.dataSource = new MatTableDataSource(this.juegoSeleccionado.Turnos);

          this.participantes.filter (participante => participante.nickName === info.nick)[0].contestado = true;
          this.peticionesAPI.ModificarJuegoDeCogerTurnoRapido (this.juegoSeleccionado).subscribe();
      });

    }
    tabChanged(event) {
      if (event.index === 1) {
        // hay que preparar resultados
        // this.PreparaInformacion ();
      }
    }


    Eliminar(turnoEliminado) {
      Swal.fire({
        title: '¿Seguro que quieres eliminar este turno?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, estoy seguro'
      }).then((result) => {
        if (result.value) {
           // tslint:disable-next-line:max-line-length
            this.juegoSeleccionado.Turnos = this.juegoSeleccionado.Turnos.filter (turno => (turno.dia !== turnoEliminado.dia) || (turno.hora !== turnoEliminado.hora || (turnoEliminado.dia === '*') && (turnoEliminado.persona !== turno.persona)));
                  // tslint:disable-next-line:only-arrow-functions
            this.juegoSeleccionado.Turnos = this.juegoSeleccionado.Turnos.sort(function(a, b) {

              if (a.dia < b.dia) {
                return -1;
              } else if (a.dia > b.dia) {
                return 1;
              } else if (a.hora < b.hora) {
                return -1;
              } else if ( a.hora > b.hora) {
                return 1;
              } else {
                return 0;
              }
          });

            this.dataSource = new MatTableDataSource(this.juegoSeleccionado.Turnos);
            Swal.fire('Turno eliminado');

            // no es que se haya cogido. Se ha eliminado. Pero esto ya vale para que los clientes
            // lo eliminen de sus listas.
            this.comServer.NotificarTurnoCogido (this.juegoSeleccionado.Clave, turnoEliminado );
            this.peticionesAPI.ModificarJuegoDeCogerTurnoRapido (this.juegoSeleccionado).subscribe();
        }
      });
    }

    AgregarTurno() {
      const turno = this.nuevoTurno.toString();
      const diaElegido = turno.split('T')[0];
      const horaElegida = turno.split('T')[1];
      const turnoNuevo = {
        dia: diaElegido,
        hora: horaElegida,
        persona: undefined
      };

      this.juegoSeleccionado.Turnos.push (turnoNuevo);
      this.peticionesAPI.ModificarJuegoDeCogerTurnoRapido (this.juegoSeleccionado).subscribe();


      // tslint:disable-next-line:only-arrow-functions
      this.juegoSeleccionado.Turnos = this.juegoSeleccionado.Turnos.sort(function(a, b) {

          if (a.dia < b.dia) {
            return -1;
          } else if (a.dia > b.dia) {
            return 1;
          } else if (a.hora < b.hora) {
            return -1;
          } else if ( a.hora > b.hora) {
            return 1;
          } else {
            return 0;
          }
      });

      this.dataSource = new MatTableDataSource(this.juegoSeleccionado.Turnos);
      this.comServer.NotificarTurnoNuevo (this.juegoSeleccionado.Clave, turnoNuevo );

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
          this.peticionesAPI.BorraJuegoDeCogerTurnoRapido (this.juegoSeleccionado.id)
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
      doc.text('Resultado de la asignación de turnos', margenIzquierdo, margenSuperior);
      doc.line(margenIzquierdo, margenSuperior + 5, margenIzquierdo + 150, margenSuperior + 5);
      const fecha = new Date().toLocaleDateString();


      doc.setTextColor("black");
      doc.setFontSize(14);
      const splittedText = doc.splitTextToSize('Presentación: ' + this.juegoSeleccionado.Presentacion,  180);
      doc.text (splittedText, margenIzquierdo, margenSuperior + 20);
      doc.text('Fecha: ' + fecha, margenIzquierdo, margenSuperior + 40);

      autoTable(doc, { html: '#tabla',  startY:  margenSuperior + 70 });


      const pageCount = doc.getNumberOfPages(); //Total Page Number
      let i;
      for (i = 0; i < pageCount; i++) {
        doc.setPage(i);
        const pageCurrent = doc.getCurrentPageInfo().pageNumber; //Current Page
        doc.setFontSize(12);
        doc.text('página: ' + pageCurrent + '/' + pageCount, 180,  margenSuperior);
      }

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
          }).then((result:any) => {
            if (result.value) {
              this.sonido = false;
              this.comServer.InformarFinJuegoRapido (this.profesorId);
            }
            obs.next (result.value);
        });
      });

      return confirmacionObservable;
  }



}

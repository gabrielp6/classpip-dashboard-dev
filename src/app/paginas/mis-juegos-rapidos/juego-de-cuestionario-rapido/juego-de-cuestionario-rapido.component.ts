import { Component, OnInit } from '@angular/core';
import {SesionService, PeticionesAPIService, CalculosService, ComServerService} from '../../../servicios/index';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { Howl } from 'howler';
import { MatTableDataSource } from '@angular/material/table';
import { Cuestionario, CuestionarioSatisfaccion, Pregunta} from '../../../clases/index';
import { Router, ActivatedRoute } from '@angular/router';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Observable, Subscription} from 'rxjs';
import { of } from 'rxjs';
import 'rxjs';

import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';

import * as URL from '../../../URLs/urls';

@Component({
  selector: 'app-juego-de-cuestionario-rapido',
  templateUrl: './juego-de-cuestionario-rapido.component.html',
  styleUrls: ['./juego-de-cuestionario-rapido.component.scss']
})
export class JuegoDeCuestionarioRapidoComponent implements OnInit {
  juegoSeleccionado: any;
  participantes: any[];
  respuestas: any[];
  cuestionario: Cuestionario;
  preguntas: Pregunta[];
  histogramaAciertos: number[] = [];

  mostrarParticipantes = true;
  informacionPreparada = false;
  profesorId: number;
  numeroRespuestas = 0;
  numeroParticipantes = 0;
  clasificacion: any [];
  dataSource;
  displayedColumns: string[] = ['nick', 'nota'];
  categoriasEjeX;
  grafico;
  donuts: any[] = [];
  misDonuts: any[] = [];
  sonido = true;
  ficheroGenerado = false;

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = '147.83.118.92:8100/home';

  mostrarCuentaAtras = false;
  interval;
  cuentaAtras: number;
  interval2;
  cuentaAtras2: number;
  mostrarSiguientePregunta = false;
  preguntaAMostrar: Pregunta;
  siguientePregunta = 0;
  mostrarBotonLanzarPregunta = true;
  imagenesPreguntas: any[];
  imagenPreguntaAMostrar: string;
  contadorRespuestasKahoot: number;
  subscripcion: Subscription;
  opcionesDesordenadas: any[];
  listaAlumnos: any [] = [];
  displayedColumnsKahoot: string[] = ['nick', 'incremento', 'puntos'];
  dataSourceKahoot;
  finKahoot = false;
  respuestasPreguntaActual: any[];
  donutsKahoot: any[] = [];


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
    this.clasificacion = [];

    this.profesorId = this.sesion.DameProfesor().id;
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.PreparaInfo();

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
          preparado: false, // Se usa para marcar a los participantes listos para empezar un kahoot
          contestado: false
        });
    });
    if (this.juegoSeleccionado.Modalidad === 'Kahoot') {
      this.comServer.EsperoConfirmacionPreparadoKahoot()
      .subscribe((nick) => {
        // el participante etá listo para empezar el kahoot
        this.participantes.filter (participante => participante.nickName === nick)[0].preparado = true;
        this.listaAlumnos.push ( {
          nickName: nick,
          incremento: 0,
          puntos: 0,
          aciertos: 0 // esto es para el histograma
        })
      });
    }
    this.comServer.EsperoRespuestasCuestionarioRapido()
    .subscribe((respuesta) => {
        this.numeroRespuestas++;
        if (this.sonido) {
          sound.volume (0.1);
          sound.play();
        }
        // El objeto que recibo tiene (respuesta) estos campos:
        //  nick
        //  respuestas
        //    Nota
        //    Tiempo
        //    Preguntas (un vector con los id de las preguntas en el orden en que se contestaron )
        //    Respuestas (un vector con las respuestas a las preguntas. Cada una de esas respuestas es también un vector.
        //                En la primera posición de ese vector esta la respuesta en el caso de las preguntas de tipo  "Cuatro opciones",
        //                 "Verdadero o false" o "Respuesta abierta". Si la pregunta es de tipo "Emparejamiento" entonces el vector
        //                contiene las partes derechas de los emparejamientos elegidos. Si la respueta está en blanco el vector
        //                esta undefined).



        this.respuestas.push (respuesta.respuestas);

        // Actualizo el histograma y los donuts


        let aciertos = 0;
        for (let i = 0; i < respuesta.respuestas.Preguntas.length; i++) {
          const pregunta = this.preguntas.filter (p => p.id === respuesta.respuestas.Preguntas[i])[0];
          const indexDonut = this.misDonuts.findIndex (elemento => elemento[0].preguntaId === pregunta.id);
          if (pregunta.Tipo === 'Emparejamiento') {
            // primero actualizamos el histograma
            if (respuesta.respuestas.Respuestas[i] !== undefined) {
              let n = 0;
              for (let j = 0; j < pregunta.Emparejamientos.length; j++) {
                if (pregunta.Emparejamientos[j].r === respuesta.respuestas.Respuestas[i][j]) {
                  n++;
                }
              }
              if (n === pregunta.Emparejamientos.length) {
                aciertos++;
                this.misDonuts[indexDonut][1].cont++; // respuesta correcta
              } else {
                console.log ('voy a modificar el donut de emparejamientos');
                this.misDonuts[indexDonut][2].cont++; // respuesta incorecta
              }
            } else {
              this.misDonuts[indexDonut][3].cont++; // respuesta en blanco
            }

          } else if (pregunta.Tipo === 'Cuatro opciones') {
            // actualizo histograma
            if (pregunta.RespuestaCorrecta === respuesta.respuestas.Respuestas[i][0]) {
              aciertos++;
            }
            this.misDonuts[indexDonut].filter (entrada => entrada.respuesta === respuesta.respuestas.Respuestas[i][0])[0].cont++;
          } else {
            if (pregunta.RespuestaCorrecta === respuesta.respuestas.Respuestas[i][0]) {
              aciertos++;
              this.misDonuts[indexDonut][1].cont++;  // respuesta correcta
            } else if (respuesta.respuestas.Respuestas[i][0] === '-') {
                this.misDonuts[indexDonut][3].cont++;  // respuesta en blanco
              } else {
                this.misDonuts[indexDonut][2].cont++;  // respuesta mal
              }
          }
        }
        this.histogramaAciertos[aciertos]++;


        // // voy a contar los aciertos de este alumno
        // for (let i = 0; i < this.preguntas.length; i++) {
        //   const pregunta = this.preguntas.filter (p => p.id === respuesta.respuestas.Preguntas[i])[0];
        //   console.log ('pregunta ' + i);
        //   console.log (pregunta);
        //   if (pregunta.Tipo === 'Emparejamiento') {
        //     if (respuesta.respuestas.Respuestas[i] !== undefined) {
        //       let n = 0;
        //       for (let j = 0; j < pregunta.Emparejamientos.length; j++) {
        //         if (pregunta.Emparejamientos[j].r === respuesta.respuestas.Respuestas[i][j]) {
        //           n++;
        //         }
        //       }
        //       if (n === pregunta.Emparejamientos.length) {
        //         aciertos++;
        //       }
        //     }

        //   } else {
        //     if (pregunta.RespuestaCorrecta === respuesta.respuestas.Respuestas[i][0]) {
        //       aciertos++;
        //     }
        //   }
        // }
        // this.histogramaAciertos[aciertos]++;
        // console.log ('histograma de aciertos');
        // console.log (this.histogramaAciertos);


        // actualizo los donuts


        // let aciertos = 0;
        // let j;
        // for (j = 0; j < respuesta.respuestas.Preguntas.length; j++) {
        //   // tslint:disable-next-line:max-line-length
        //   const respuestaCorrecta = this.preguntas.filter (pregunta => pregunta.id === respuesta.respuestas.Preguntas[j])[0].RespuestaCorrecta;
        //   if (respuestaCorrecta === respuesta.respuestas.Respuestas[j]) {
        //       aciertos++;
        //   }
        // }
        // this.histogramaAciertos[aciertos]++;


        // // actualizo los donuts
        // console.log ('actualizo donuts');
        // console.log (this.misDonuts);
        // for (j = 0; j < respuesta.respuestas.Preguntas.length; j++) {
        //   const e = this.misDonuts.filter (elemento => elemento.id === respuesta.respuestas.Preguntas[j]);
        //   const donut = e[0].donut;
        //   console.log ('donut ' + j);
        //   console.log (donut);
        //   donut.filter (p => p.respuesta === respuesta.respuestas.Respuestas [j])[0].cont++;

        // }


        this.clasificacion.push ({
          nick: respuesta.nick,
          nota: respuesta.respuestas.Nota,
          tiempo: respuesta.respuestas.Tiempo
        });

        // tslint:disable-next-line:only-arrow-functions
        this.clasificacion = this.clasificacion.sort(function(a, b) {
          if (b.nota !== a.nota) {
            return b.nota - a.nota;
          } else {
            // en caso de empate en la nota, gana el que empleó menos tiempo
            return a.tiempo - b.tiempo;
          }
        });

        this.dataSource = new MatTableDataSource(this.clasificacion);

        this.participantes.filter (participante => participante.nickName === respuesta.nick)[0].contestado = true;
        this.PrepararGraficos();
    });
  }



  PreparaInfo() {
    this.peticionesAPI.DameCuestionario (this.juegoSeleccionado.cuestionarioId)
    .subscribe (cuestionario => {
      this.cuestionario = cuestionario;

      this.peticionesAPI.DamePreguntasCuestionario (this.cuestionario.id)
      .subscribe ( preguntas => {
        this.preguntas = preguntas;
        // preparo el histograma
        this.histogramaAciertos = Array(this.preguntas.length + 1).fill(0);
        // preparo los donuts

        this.imagenesPreguntas = [];

          // preparo un donut para cada pregunta
        this.preguntas.forEach (pregunta => {
          this.imagenesPreguntas.push(URL.ImagenesPregunta + pregunta.Imagen);

          let miDonut: any;
          miDonut = [];
          // preparo los datos del donut
          // primero meto el tipo de pregunta
          miDonut.push ( { preguntaId: pregunta.id, Tipo: pregunta.Tipo});
          if (pregunta.Tipo === 'Cuatro opciones') {
            miDonut.push ( { respuesta: pregunta.RespuestaCorrecta, cont: 0});
            miDonut.push ( { respuesta: pregunta.RespuestaIncorrecta1, cont: 0});
            miDonut.push ( { respuesta: pregunta.RespuestaIncorrecta2, cont: 0});
            miDonut.push ( { respuesta: pregunta.RespuestaIncorrecta3, cont: 0});
            // esto es para el caso de respuesta en blando
            miDonut.push ( { respuesta: '-', cont: 0});

          } else if (pregunta.Tipo === 'Respuesta abierta') {
            miDonut.push ( { respuesta: pregunta.RespuestaCorrecta, cont: 0});
            miDonut.push ( { respuesta: 'Otras respuestas', cont: 0});
            // esto es para el caso de respuesta en blando
            miDonut.push ( { respuesta: '-', cont: 0});
          } else if (pregunta.Tipo === 'Verdadero o falso') {
            miDonut.push ( { respuesta: pregunta.RespuestaCorrecta, cont: 0});
            miDonut.push ( { respuesta: 'Mal', cont: 0});
            // esto es para el caso de respuesta en blando
            miDonut.push ( { respuesta: '-', cont: 0});
          } else {
            miDonut.push ( { respuesta: 'Emparejamientos correctos', cont: 0});
            miDonut.push ( { respuesta: 'Otros emparejamientos incorrectos', cont: 0});
            // esto es para el caso de respuesta en blando
            miDonut.push ( { respuesta: '-', cont: 0});
          }

          this.misDonuts.push (miDonut);
        });

        this.respuestas = this.juegoSeleccionado.Respuestas;

        this.numeroRespuestas = this.respuestas.length;
        this.numeroParticipantes = this.numeroRespuestas;

        if (this.numeroRespuestas !== 0) {
          this.PrepararHitogramaYDonutsIniciales();
          this.PrepararGraficos();
        }
      });
    });

  }
  EliminarJuegoRapido() {
    Swal.fire({
      title: '¿Seguro que quieres eliminar este juego rápido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {
        this.peticionesAPI.BorraJuegoDeCuestionarioRapido (this.juegoSeleccionado.id)
        .subscribe(res => {
            if (res !== undefined) {
              Swal.fire('El juego se ha eliminado correctamente');
              this.router.navigate(['/inicio/' + this.profesorId]);
            }
        });
      }
    });

  }
  // Esto es para cuando el juego ya tenia respuestas de otras sesiones

  PrepararHitogramaYDonutsIniciales() {



    this.respuestas.forEach (respuesta => {

      let aciertos = 0;
      for (let i = 0; i < respuesta.respuestas.Preguntas.length; i++) {
        const pregunta = this.preguntas.filter (p => p.id === respuesta.respuestas.Preguntas[i])[0];
        const donut = this.misDonuts.filter (elemento => elemento[0].preguntaId === pregunta.id)[0];
        if (pregunta.Tipo === 'Emparejamiento') {
          // primero actualizamos el histograma
          if (respuesta.respuestas.Respuestas[i] !== undefined) {
            let n = 0;
            for (let j = 0; j < pregunta.Emparejamientos.length; j++) {
              if (pregunta.Emparejamientos[j].r === respuesta.respuestas.Respuestas[i][j]) {
                n++;
              }
            }
            if (n === pregunta.Emparejamientos.length) {
              aciertos++;
              donut[1].cont++; // respuesta correcta
            } else {
              donut[2].cont++; // respuesta incorecta
            }
          } else {
            donut[3].cont++; // respuesta en blanco
          }

        } else if (pregunta.Tipo === 'Cuatro opciones') {
          // actualizo histograma
          if (pregunta.RespuestaCorrecta === respuesta.respuestas.Respuestas[i][0]) {
            aciertos++;
          }
          donut.filter (entrada => entrada.respuesta === respuesta.respuestas.Respuestas[i][0])[0].cont++;
        } else {
          console.log ('pregunta de respuesta abierta o verdadero o falso');
          if (pregunta.RespuestaCorrecta === respuesta.respuestas.Respuestas[i][0]) {
            aciertos++;
            donut[1].cont++;  // respuesta correcta
          } else if (respuesta.respuestas.Respuestas[i][0] === '-') {
              donut[3].cont++;  // respuesta en blanco
            } else {
              donut[2].cont++;  // respuesta mal
            }
        }
      }
      this.histogramaAciertos[aciertos]++;
      this.clasificacion.push ({
        nick: respuesta.nick,
        nota: respuesta.respuestas.Nota,
        tiempo: respuesta.respuestas.Tiempo
      });

      // tslint:disable-next-line:only-arrow-functions
      this.clasificacion = this.clasificacion.sort(function(a, b) {
        if (b.nota !== a.nota) {
          return b.nota - a.nota;
        } else {
          // en caso de empate en la nota, gana el que empleó menos tiempo
          return a.tiempo - b.tiempo;
        }
      });
    });


    this.dataSource = new MatTableDataSource(this.clasificacion);


  }


  PrepararGraficos() {

    // Histograda de número de aciertos
    this.categoriasEjeX = [];
    for (let n = 0; n < this.histogramaAciertos.length ; n++) {
      this.categoriasEjeX.push (n.toString());
    }


    this.grafico = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: 'aciertos: {b}  <br/>{c}'
      },
      grid: {
        left: '20%',
        right: '20%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          name: 'Número de aciertos',
          data: this.categoriasEjeX,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [{
        type: 'value',
        name: 'Número de alumnos'
      }],
      series: [{
        type: 'bar',
        barWidth: '60%',
        data: this.histogramaAciertos,
      }]
    };

    // ahora los donuts
    this.donuts = [];
    let i = 1;
    this.misDonuts.forEach (miDonut => {
      if (miDonut[0].Tipo === 'Cuatro opciones') {
        const datos = [
          // las respuestas correctas siempre en verde
          {value: miDonut[1].cont, name: miDonut[1].respuesta, itemStyle: {color: 'green'}},
          {value: miDonut[2].cont, name: miDonut[2].respuesta, itemStyle: {color: 'rgb(50,50,50)'}},
          {value: miDonut[3].cont, name: miDonut[3].respuesta, itemStyle: {color: 'rgb(100,100,100)'}},
          {value: miDonut[4].cont, name: miDonut[4].respuesta, itemStyle: {color: 'rgb(125,125,125)'}},
          {value: miDonut[5].cont, name: 'No contesta ' , itemStyle: {color: 'rgb(150,150,150)'}}
        ];
        const  donut = {
          title: {
            text: 'Pregunta ' + i++,
            subtext: 'Respuesta correcta: ' + miDonut[1].respuesta ,
            left: 'center'
          },
          tooltip: {
              trigger: 'item',
              formatter: '{c} alumnos <br/> ({d}%)'
          },
          series: [
              {
                  name: '',
                  type: 'pie',
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: false,
                  label: {
                      show: false,
                      position: 'center'
                  },
                  emphasis: {
                      label: {
                          show: true,
                          fontSize: '30',
                          fontWeight: 'bold'
                      }
                  },
                  labelLine: {
                      show: false
                  },
                  data: datos
              }
          ]
        };
        this.donuts.push (donut);
      } else if (miDonut[0].Tipo === 'Respuesta abierta') {
        const datos = [
          // las respuestas correctas siempre en verde
          {value: miDonut[1].cont, name: miDonut[1].respuesta, itemStyle: {color: 'green'}},
          {value: miDonut[2].cont, name: 'Otras respuestas', itemStyle: {color: 'rgb(50,50,50)'}},
          {value: miDonut[3].cont, name: 'No contesta ' , itemStyle: {color: 'rgb(150,150,150)'}}
        ];
        const  donut = {
          title: {
            text: 'Pregunta ' + i++,
            subtext: 'Respuesta correcta: ' + miDonut[1].respuesta ,
            left: 'center'
          },
          tooltip: {
              trigger: 'item',
              formatter: '{c} alumnos <br/> ({d}%)'
          },
          series: [
              {
                  name: '',
                  type: 'pie',
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: false,
                  label: {
                      show: false,
                      position: 'center'
                  },
                  emphasis: {
                      label: {
                          show: true,
                          fontSize: '30',
                          fontWeight: 'bold'
                      }
                  },
                  labelLine: {
                      show: false
                  },
                  data: datos
              }
          ]
        };
        this.donuts.push (donut);
      } else if (miDonut[0].Tipo === 'Verdadero o falso') {
        const datos = [
          // las respuestas correctas siempre en verde
          {value: miDonut[1].cont, name: miDonut[1].respuesta, itemStyle: {color: 'green'}},
          {value: miDonut[2].cont, name: 'Mal', itemStyle: {color: 'rgb(50,50,50)'}},
          {value: miDonut[3].cont, name: 'No contesta ' , itemStyle: {color: 'rgb(150,150,150)'}}
        ];
        const  donut = {
          title: {
            text: 'Pregunta ' + i++,
            subtext: 'Respuesta correcta: ' + miDonut[1].respuesta ,
            left: 'center'
          },
          tooltip: {
              trigger: 'item',
              formatter: '{c} alumnos <br/> ({d}%)'
          },
          series: [
              {
                  name: '',
                  type: 'pie',
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: false,
                  label: {
                      show: false,
                      position: 'center'
                  },
                  emphasis: {
                      label: {
                          show: true,
                          fontSize: '30',
                          fontWeight: 'bold'
                      }
                  },
                  labelLine: {
                      show: false
                  },
                  data: datos
              }
          ]
        };
        this.donuts.push (donut);
      } else {
        const datos = [
          // las respuestas correctas siempre en verde
          {value: miDonut[1].cont, name: 'Emparejamientos correctos', itemStyle: {color: 'green'}},
          {value: miDonut[2].cont, name: 'Otros emparejamientos incorrectos', itemStyle: {color: 'rgb(50,50,50)'}},
          {value: miDonut[3].cont, name: 'No contesta ' , itemStyle: {color: 'rgb(150,150,150)'}}
        ];
        const  donut = {
          title: {
            text: 'Pregunta ' + i++,
            subtext: 'Respuesta correcta: ' + miDonut[1].respuesta ,
            left: 'center'
          },
          tooltip: {
              trigger: 'item',
              formatter: '{c} alumnos <br/> ({d}%)'
          },
          series: [
              {
                  name: '',
                  type: 'pie',
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: false,
                  label: {
                      show: false,
                      position: 'center'
                  },
                  emphasis: {
                      label: {
                          show: true,
                          fontSize: '30',
                          fontWeight: 'bold'
                      }
                  },
                  labelLine: {
                      show: false
                  },
                  data: datos
              }
          ]
        };
        this.donuts.push (donut);
      }
      i++;
    });

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
          }
          obs.next (result.value);
      });
    });

    return confirmacionObservable;
}


GenerarInforme() {
  Swal.fire ('Atención', 'Esta funcionalidad aún no está operativa' , 'error');

  // const margenIzquierdo = 15;
  // const margenSuperior = 20;
  // const interlineado = 5;
  // const doc = new jsPDF();


  // doc.setFontSize(20);
  // doc.setFont('arial', 'normal');
  // doc.setTextColor("blue");
  // doc.text('Resultado de la asignación de turnos', margenIzquierdo, margenSuperior);
  // doc.line(margenIzquierdo, margenSuperior + 5, margenIzquierdo + 150, margenSuperior + 5);
  // const fecha = new Date().toLocaleDateString();


  // doc.setTextColor("black");
  // doc.setFontSize(14);
  // const splittedText = doc.splitTextToSize('Presentación: ' + this.juegoSeleccionado.Presentacion,  180);
  // doc.text (splittedText, margenIzquierdo, margenSuperior + 20);
  // doc.text('Fecha: ' + fecha, margenIzquierdo, margenSuperior + 40);

  // autoTable(doc, { html: '#tabla',  startY:  margenSuperior + 70 });


  // const pageCount = doc.getNumberOfPages(); //Total Page Number
  // let i;
  // for (i = 0; i < pageCount; i++) {
  //   doc.setPage(i);
  //   const pageCurrent = doc.getCurrentPageInfo().pageNumber; //Current Page
  //   doc.setFontSize(12);
  //   doc.text('página: ' + pageCurrent + '/' + pageCount, 180,  margenSuperior);
  // }

  // doc.save('informe.pdf');
  // this.ficheroGenerado = true;
}


// para el juego de Kahoot
LanzarPregunta() {
  this.mostrarBotonLanzarPregunta = false;
  this.mostrarCuentaAtras = true;

  this.preguntaAMostrar = this.preguntas [this.siguientePregunta];
  this.imagenPreguntaAMostrar = this.imagenesPreguntas[this.siguientePregunta];
  this.opcionesDesordenadas = [];
  // El el caso de 'Cuatro opciones' o 'Emparejamiento' desordeno las opciones y se las envio a todos
  // los alumnos. En el resto de casos la info es irrelevante
  if (this.preguntaAMostrar.Tipo === 'Cuatro opciones') {
    this.opcionesDesordenadas.push (this.preguntaAMostrar.RespuestaCorrecta);
    this.opcionesDesordenadas.push (this.preguntaAMostrar.RespuestaIncorrecta1);
    this.opcionesDesordenadas.push (this.preguntaAMostrar.RespuestaIncorrecta2);
    this.opcionesDesordenadas.push (this.preguntaAMostrar.RespuestaIncorrecta3);
    this.DesordenarVector (this.opcionesDesordenadas);
  } else if (this.preguntaAMostrar.Tipo === 'Emparejamiento') {
    this.preguntaAMostrar.Emparejamientos.forEach (pareja => {
      this.opcionesDesordenadas.push (pareja.r);
    });
    this.DesordenarVector (this.opcionesDesordenadas);
  }


  this.comServer.NotificarLanzarSiguientePregunta (this.juegoSeleccionado.Clave, this.opcionesDesordenadas);
  this.cuentaAtras = 3;
  this.interval = setInterval(() => {
    this.cuentaAtras--;
    if (this.cuentaAtras === 0) {
      clearInterval(this.interval);


      this.mostrarSiguientePregunta = true;
      this.mostrarCuentaAtras = false;
      this.contadorRespuestasKahoot = 0;
      this.respuestasPreguntaActual = [];
      this.listaAlumnos.forEach (alumno => alumno.incremento = 0);
      this.subscripcion = this.comServer.EsperoRespuestasCuestionarioKahootRapido ()
      .subscribe( respuesta => {
        // La respuesta es undefined si respondió en blanco. En caso contrario la estructura es la siguiente siguiente:
        //    nick
        //    puntosObtenidos
        //    respuesta (Es un vector que contiene en la primera posición la respuesta en el caso de "Cuatro opciones", "Verdadero o
        //    falso" o "Respuesta abierta". En el caso de "Emparejamientos" contiene las partes derecha de las parejas. Está undefined
        //    su el participante la dejó sin contestar).
        //
        this.respuestasPreguntaActual.push (respuesta);
        const alumno = this.listaAlumnos.find (a => a.nickName === respuesta.nick);
        if (respuesta !== undefined) {
          alumno.incremento = respuesta.puntosObtenidos;
          alumno.puntos = alumno.puntos + respuesta.puntosObtenidos;
        }
        this.contadorRespuestasKahoot++;

      });
      this.cuentaAtras2 = this.juegoSeleccionado.TiempoLimite;
      this.interval2 = setInterval(() => {
      this.cuentaAtras2--;
      if (this.cuentaAtras2 === 0) {
            clearInterval(this.interval2);
            // Se acabó el tiempo. Ya no recibo más respuesas
            this.subscripcion.unsubscribe();
            this.listaAlumnos = this.listaAlumnos.sort(function(a, b) {
              return b.puntos - a.puntos;
            });
            this.dataSourceKahoot =  new MatTableDataSource (this.listaAlumnos);

             // se acabo el tiempo
            // voy a ver cuántos no han respondido
            const sinRespuesta = this.listaAlumnos.length - this.contadorRespuestasKahoot;
            // ahora introduzco tantas respuestas en blanco como gente sin responder
            for (let i = 0; i < sinRespuesta; i++) {
              this.respuestasPreguntaActual.push (undefined);
            }
            this.MostrarDonut (this.preguntaAMostrar, this.respuestasPreguntaActual );
            this.respuestas.push (this.respuestasPreguntaActual);
            this.mostrarSiguientePregunta = false;
            this.mostrarBotonLanzarPregunta = true;
            this.siguientePregunta++;
            if (this.siguientePregunta === this.preguntas.length) {
              Swal.fire('Ya no hay más preguntas', '', 'success');
              this.finKahoot = true;
              this.comServer.NotificarResultadoFinalKahoot (this.juegoSeleccionado.Clave, this.listaAlumnos);
              this.PrepararHistogramaKahoot ();
            }

          }
        }, 1000);
    }
  }, 1000);
}




DesordenarVector(vector: any[]) {
  // genera una permutación aleatoria de los elementos del vector

  let currentIndex = vector.length;
  let temporaryValue;
  let randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = vector[currentIndex];
    vector[currentIndex] = vector[randomIndex];
    vector[randomIndex] = temporaryValue;
  }
  console.log ('he terminado');
}

MostrarDonut (pregunta: Pregunta,  respuestas: any[]) {
  const miDonut = this.misDonuts.find (elemento => elemento[0].preguntaId === pregunta.id);
  if (pregunta.Tipo === 'Emparejamiento') {
    respuestas.forEach (r => {
      if (r === undefined || r.respuesta === undefined) {
        // respuesta en blanco
        miDonut[3].cont++;
      } else if (r.puntosObtenidos > 0) {
        // acierto
        miDonut[1].cont++; // respuesta correcta
      } else {
        // fallo
        miDonut[2].cont++; // fallo
      }
    });
  } else if (pregunta.Tipo === 'Cuatro opciones') {
    respuestas.forEach (r => {
      if (r === undefined) {
        miDonut[5].cont++; // respuesta en blanco
      } else {miDonut.filter (entrada => entrada.respuesta === r.respuesta[0])[0].cont++;
       }
    });
  } else {
    respuestas.forEach (r => {
      if (r === undefined) {
        miDonut[3].cont++;  // respuesta en blanco
      } else if (pregunta.RespuestaCorrecta === r.respuesta[0]) {
        miDonut[1].cont++;  // respuesta correcta
      } else if (r.respuesta[0] === '-') {
        miDonut[3].cont++;  // respuesta en blanco
      } else {
        miDonut[2].cont++;  // respuesta mal
      }
    });
  }

  if (miDonut[0].Tipo === 'Cuatro opciones') {
      const datos = [
        // las respuestas correctas siempre en verde
        {value: miDonut[1].cont, name: miDonut[1].respuesta, itemStyle: {color: 'green'}},
        {value: miDonut[2].cont, name: miDonut[2].respuesta, itemStyle: {color: 'rgb(50,50,50)'}},
        {value: miDonut[3].cont, name: miDonut[3].respuesta, itemStyle: {color: 'rgb(100,100,100)'}},
        {value: miDonut[4].cont, name: miDonut[4].respuesta, itemStyle: {color: 'rgb(125,125,125)'}},
        {value: miDonut[5].cont, name: 'No contesta ' , itemStyle: {color: 'rgb(150,150,150)'}}
      ];
      const  donut = {
        title: {
          // text: 'Respuesta correcta',
          // subtext: miDonut[1].respuesta ,
          // left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{c} alumnos <br/> ({d}%)'
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: datos
            }
        ]
      };
      this.donuts.push (donut);
    } else if (miDonut[0].Tipo === 'Respuesta abierta') {
      const datos = [
        // las respuestas correctas siempre en verde
        {value: miDonut[1].cont, name: miDonut[1].respuesta, itemStyle: {color: 'green'}},
        {value: miDonut[2].cont, name: 'Otras respuestas', itemStyle: {color: 'rgb(50,50,50)'}},
        {value: miDonut[3].cont, name: 'No contesta ' , itemStyle: {color: 'rgb(150,150,150)'}}
      ];
      const  donut = {
        title: {
          // text: 'Respuesta correcta',
          // subtext: miDonut[1].respuesta ,
          // left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{c} alumnos <br/> ({d}%)'
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: datos
            }
        ]
      };
      this.donuts.push (donut);
    } else if (miDonut[0].Tipo === 'Verdadero o falso') {
      const datos = [
        // las respuestas correctas siempre en verde
        {value: miDonut[1].cont, name: miDonut[1].respuesta, itemStyle: {color: 'green'}},
        {value: miDonut[2].cont, name: 'Mal', itemStyle: {color: 'rgb(50,50,50)'}},
        {value: miDonut[3].cont, name: 'No contesta ' , itemStyle: {color: 'rgb(150,150,150)'}}
      ];
      const  donut = {
        title: {
          // text: 'Respuesta correcta',
          // subtext: 'Respuesta correcta: ' + miDonut[1].respuesta ,
          // left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{c} alumnos <br/> ({d}%)'
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: datos
            }
        ]
      };
      this.donuts.push (donut);
    } else {
      const datos = [
        // las respuestas correctas siempre en verde
        {value: miDonut[1].cont, name: 'Emparejamientos correctos', itemStyle: {color: 'green'}},
        {value: miDonut[2].cont, name: 'Otros emparejamientos incorrectos', itemStyle: {color: 'rgb(50,50,50)'}},
        {value: miDonut[3].cont, name: 'No contesta ' , itemStyle: {color: 'rgb(150,150,150)'}}
      ];
      const  donut = {
        title: {
          // text: 'Respuesta correcta',
          // subtext: miDonut[1].respuesta ,
          // left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{c} alumnos <br/> ({d}%)'
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: datos
            }
        ]
      };
      this.donuts.push (donut);

    }
}

PrepararHistogramaKahoot () {
  console.log ('voy a preparar histograma');
  console.log (this.respuestas);

  for (let i = 0; i < this.preguntas.length; i++) {
    const pregunta = this.preguntas[i];
    const respuestasPregunta = this.respuestas [i];

    if (pregunta.Tipo === 'Emparejamiento') {
      // Recorro todas las respuestas a esa pregunta y computo el posible acierto al
      // nick correspondiente
      respuestasPregunta.forEach (r => {
        if (r !== undefined && r.respuesta !== undefined) {
          let n = 0;
          for (let j = 0; j < pregunta.Emparejamientos.length; j++) {
            if (pregunta.Emparejamientos[j].r === r.respuesta[j]) {
              n++;
            }
          }
          if (n === pregunta.Emparejamientos.length) {
            this.listaAlumnos.find (alumno => alumno.nickName === r.nick).aciertos++;
          }
        }
      });

    } else {
      // Para cualquier otro tipo de pregunta
      respuestasPregunta.forEach (r => {
        if (r !== undefined && pregunta.RespuestaCorrecta === r.respuesta[0]) {
          this.listaAlumnos.find (alumno => alumno.nickName === r.nick).aciertos++;
        }
      });
    }
  }
  this.histogramaAciertos = Array(this.preguntas.length + 1).fill (0);

  this.listaAlumnos.forEach (alumno => {
    this.histogramaAciertos[alumno.aciertos]++;
  });
  // Histograda de número de aciertos
  this.categoriasEjeX = [];
  for (let n = 0; n < this.histogramaAciertos.length ; n++) {
    this.categoriasEjeX.push (n.toString());
  }


  this.grafico = {
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: 'aciertos: {b}  <br/>{c}'
    },
    grid: {
      left: '20%',
      right: '20%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        name: '# aciertos',
        data: this.categoriasEjeX,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [{
      type: 'value',
      name: '# alumnos'
    }],
    series: [{
      type: 'bar',
      barWidth: '60%',
      data: this.histogramaAciertos,
    }]
  };




}
MostrarBotonSiguientePregunta (): boolean {
  if ((this.siguientePregunta > 0) && (this.siguientePregunta < this.preguntas.length)) {
    return true;
  } else {
    return false;
  }
}

}

import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

// Imports para abrir diálogo y swal
import { MatDialog, MatTabChangeEvent} from '@angular/material';
import { DialogoConfirmacionComponent } from '../../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';

import { Alumno, Equipo, Juego, AlumnoJuegoDeColeccion, EquipoJuegoDeColeccion,
 Album, AlbumEquipo, Coleccion, Cromo, AlumnoJuegoDePuntos, Evento, Profesor } from '../../../../clases/index';


import {SesionService, PeticionesAPIService, CalculosService, ComServerService} from '../../../../servicios/index';

import { Location } from '@angular/common';

import * as URL from '../../../../URLs/urls';

@Component({
  selector: 'app-asignar-cromos',
  templateUrl: './asignar-cromos.component.html',
  styleUrls: ['./asignar-cromos.component.scss']
})
export class AsignarCromosComponent implements OnInit {

  fechaAsignacionCromo: Date;
  fechaString: string;

  juegoSeleccionado: Juego;

  datasourceAlumno;
  datasourceEquipo;
  dataSource;

  alumnosDelJuego: Alumno[];
  alumnoElegido: Alumno;
  equiposDelJuego: Equipo[];
  equipoElegido: Equipo;

  coleccion: Coleccion;
  cromosColeccion: Cromo[];

  displayedColumnsAlumno: string[] = ['select', 'nombreAlumno', 'primerApellido', 'segundoApellido', ' '];
  selection = new SelectionModel<Alumno>(true, []);

  displayedColumnsEquipos: string[] = ['select', 'nombreEquipo', 'miembros', 'info', ' '];
  selectionEquipos = new SelectionModel<Equipo>(true, []);

  seleccionados: boolean[];
  seleccionadosEquipos: boolean[];

  cromoSeleccionadoId: number;
  cromoSeleccionado: Cromo;
  imagenDelanteCromoSeleccionado: string;
  imagenDetrasCromoSeleccionado: string;

  alumnosEquipo: Alumno[];

  inscripcionesAlumnos: AlumnoJuegoDeColeccion[];

  inscripcionesEquipos: EquipoJuegoDeColeccion[];



  // // tslint:disable-next-line:no-inferrable-types
  // mensaje: string = 'Confirma que quieres asignar este cromo';

  // // tslint:disable-next-line:no-inferrable-types
  // mensajeAleatorio: string = 'Confirma que quieres asignar este sobre de cromos aleatorios';

  // // tslint:disable-next-line:no-inferrable-types
  // mensajeAsignacionAleatoria: string = 'Confirma que quieres asignar aleatoriamente este sobre de cromos aleatorios';
  // // tslint:disable-next-line:no-inferrable-types
  // mensajeAsignacionMejoresRanking: string = 'Confirma que quieres asignar cromos a los tres mejores del ranking';
  // // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;


  // Para asignar cromos random
  probabilidadCromos: number[] = [];
  indexCromo: number;
  // tslint:disable-next-line:no-inferrable-types
  numeroCromosRandom: number = 1;
  botonTablaDesactivado = true;
  juegosPuntos: Juego[] = [];
  juegoPuntosSeleccionadoId: number;

  // tslint:disable-next-line:no-inferrable-types
  cromosParaPrimero: number = 3;
  // tslint:disable-next-line:no-inferrable-types
  cromosParaSegundo: number = 2;
    // tslint:disable-next-line:no-inferrable-types
  cromosParaTercero: number = 1;

  // tslint:disable-next-line:no-inferrable-types
  botonAsignacionDesactivado: boolean = true;

  primerAlumno: Alumno;
  segundoAlumno: Alumno;
  tercerAlumno: Alumno;

  primerEquipo: Equipo;
  segundoEquipo: Equipo;
  tercerEquipo: Equipo;
  mostrarLista = true;
  profesor: Profesor;

  constructor(
               private sesion: SesionService,
               private peticionesAPI: PeticionesAPIService,
               private calculos: CalculosService,
               private comService: ComServerService,
               public dialog: MatDialog,
               public location: Location) { }

  ngOnInit() {
    this.coleccion = this.sesion.DameColeccion();
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.profesor = this.sesion.DameProfesor();
    console.log ('Ya estamos ' + this.coleccion);
    this.CromosColeccion();
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.alumnosDelJuego = this.sesion.DameAlumnosDelJuego();
      this.RecuperarInscripcionesAlumnoJuego();
      this.dataSource = new MatTableDataSource(this.alumnosDelJuego);
    } else if (this.juegoSeleccionado.Modo === 'Equipos') {
      this.equiposDelJuego = this.sesion.DameEquiposDelJuego();
      this.RecuperarInscripcionesEquiposJuego();
      if (this.juegoSeleccionado.Asignacion === 'Individual') {
        this.alumnosDelJuego = this.sesion.DameAlumnosDelJuego();
        this.dataSource = new MatTableDataSource(this.alumnosDelJuego);
      } else {
        this.dataSource = new MatTableDataSource(this.equiposDelJuego);
      }
    }
    // Necesitaré los juegos de puntos de este grupo por si quiere
    // asignar cromos segun los puntos
    this.DameJuegosPuntos ();
  }


  HayQueMostrarAlumnos(): boolean {
    // tslint:disable-next-line:max-line-length
    const res = ((this.juegoSeleccionado.Modo === 'Individual') || (this.juegoSeleccionado.Asignacion === 'Individual')) && (this.alumnosDelJuego !== undefined);
    return res;
  }
  HayQueMostrarEquipos(): boolean {
    const res = (this.juegoSeleccionado.Asignacion === 'Equipo') && this.equiposDelJuego !== undefined;
    return res;
  }


  CambioTab(event: MatTabChangeEvent) {
    // Se ejecuta cuando cambio de tab
    console.log ('Cambio a tab ' + event.index);
    this.mostrarLista = true;
    this.primerAlumno = undefined;
    this.segundoAlumno = undefined;
    this.tercerAlumno = undefined;
    this.primerEquipo = undefined;
    this.segundoEquipo = undefined;
    this.tercerEquipo = undefined;
    this.alumnoElegido = undefined;
    this.equipoElegido = undefined;
    if (event.index === 2) {
      console.log ('Entro');
      console.log (this.juegosPuntos.length);
      // En el caso de que no esté habilitada la opción de asignar cromos
      // según ranking de puntos entonces no muestro la lista de jugadores
      if (this.juegosPuntos.length === 0) {
        this.mostrarLista = false;
        console.log ('No mostrare la lista');
      }

    }


  }
  /* Para averiguar si todas las filas están seleccionadas */
  IsAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /* Cuando se clica en el checkbox de cabecera hay que ver si todos los
    * checkbox estan acivados, en cuyo caso se desactivan todos, o si hay alguno
    * desactivado, en cuyo caso se activan todos */

  MasterToggle() {
    if (this.IsAllSelected()) {
      this.selection.clear(); // Desactivamos todos
    } else {
      // activamos todos
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  // Me traigo los juegos de puntos, pero seleccion solo los que tienen el mismo modo
  // (individual o equipos)
  DameJuegosPuntos() {
    this.peticionesAPI.DameJuegoDePuntosGrupo (this.sesion.DameGrupo().id)
    .subscribe ( juegos => {
      this.juegosPuntos = [];
      console.log ('juegos de puntos');
      console.log (juegos);
      juegos.forEach (juego => {
        if ((juego.Modo === 'Individual') && juego.JuegoActivo) {
          console.log ('juego individual');
          if ((this.juegoSeleccionado.Modo === 'Individual') || (this.juegoSeleccionado.Asignacion === 'Individual')) {
            this.juegosPuntos.push (juego);
          }
        } else if ((juego.Modo === 'Equipos') && juego.JuegoActivo) {
          console.log ('juego equipos');
          if ((this.juegoSeleccionado.Modo === 'Equipos') && (this.juegoSeleccionado.Asignacion === 'Equipo')) {
            this.juegosPuntos.push (juego);
          }
        }
      });


      console.log ('juegos seleccionados');
      console.log (this.juegosPuntos);
      console.log ('mi juego es');
      console.log (this.juegoSeleccionado);

    });
  }

  /* Esta función decide si el boton debe estar activo (si hay al menos
  una fila seleccionada) o si debe estar desactivado (si no hay ninguna fila seleccionada) */
  ActualizarBotonTabla() {
    if (this.selection.selected.length === 0) {
      this.botonTablaDesactivado = true;
    } else {
      this.botonTablaDesactivado = false;
    }
  }



  applyFilter(filterValue: string) {

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterEquipo(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  CromosColeccion() {
    // Busca los cromos dela coleccion en la base de datos
    this.peticionesAPI.DameCromosColeccion(this.coleccion.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.cromosColeccion = res;
        this.cromoSeleccionadoId = this.cromosColeccion[0].id;
        this.cromoSeleccionado = this.cromosColeccion[0];
        this.GET_ImagenCromo();

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.cromosColeccion.length; i ++) {
          if (this.cromosColeccion[i].Probabilidad === 'Muy Baja') {
            this.probabilidadCromos[i] = 3;

          } else if (this.cromosColeccion[i].Probabilidad === 'Baja') {

            this.probabilidadCromos[i] = 7;

          } else if (this.cromosColeccion[i].Probabilidad === 'Media') {

            this.probabilidadCromos[i] = 20;

          } else if (this.cromosColeccion[i].Probabilidad === 'Alta') {

            this.probabilidadCromos[i] = 30;

          } else {

            this.probabilidadCromos[i] = 40;

          }
        }

        console.log(res);
      } else {
        console.log('No hay cromos en esta coleccion');
        this.cromosColeccion = undefined;
      }
    });
  }

  TraeCromo() {
    // Cuando el usuario selecciona el cromo a asignar llamamos a esta función
    console.log(this.cromoSeleccionadoId);
    this.cromoSeleccionado = this.cromosColeccion.filter(res => res.id === Number(this.cromoSeleccionadoId))[0];
    console.log(this.cromosColeccion.filter(res => res.id === Number(this.cromoSeleccionadoId))[0]);
    this.GET_ImagenCromo();
  }

  // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
  RecuperarInscripcionesAlumnoJuego() {
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeColeccion(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.inscripcionesAlumnos = inscripciones;
    });
  }

      // Recupera las inscripciones de los equipos en el juego y los puntos que tienen y los ordena de mayor a menor valor
  RecuperarInscripcionesEquiposJuego() {

    this.peticionesAPI.DameInscripcionesEquipoJuegoDeColeccion(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.inscripcionesEquipos = inscripciones;
    });
  }

  AsignarCromo() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.AsignarCromoAlumnos(this.cromoSeleccionadoId);

    } else if (this.juegoSeleccionado.Asignacion === 'Equipo') {
      this.AsignarCromoEquipos(this.cromoSeleccionadoId);
    } else {
      this.AsignarCromoEquiposDeAlumnosElegidos (this.cromoSeleccionadoId);
    }


  }


  AsignarCromoAlumnos(cromoSeleccionado) {
    this.dataSource.data.forEach(row => {
      if (this.selection.isSelected(row)) {
        let alumno: Alumno;
        alumno = row;
        console.log(alumno.Nombre + ' seleccionado');

        let alumnoJuegoDeColeccion: AlumnoJuegoDeColeccion;
        alumnoJuegoDeColeccion = this.inscripcionesAlumnos.filter(res => res.alumnoId === alumno.id)[0];
        console.log(alumnoJuegoDeColeccion);

        // Comprobamos si se ha completado la Colección antes de haber asignado el/los Cromo/s
        // tslint:disable-next-line:max-line-length
        this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, alumnoJuegoDeColeccion.id, undefined).subscribe((finalizacionAntes) => {

          this.peticionesAPI.AsignarCromoAlumno(new Album (alumnoJuegoDeColeccion.id, cromoSeleccionado))
          .subscribe(res => {
            console.log(res);
            Swal.fire('OK', 'Cromo asignado a los alumnos elegidos', 'success');

            // tslint:disable-next-line:max-line-length
            const eventoAsignarCromos: Evento = new Evento(20, new Date(), this.profesor.id, alumno.id, undefined, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección', undefined, undefined, undefined, 1);
            this.calculos.RegistrarEvento (eventoAsignarCromos);

           
            // Notificar al Alumno
            // tslint:disable-next-line:max-line-length
            this.comService.EnviarNotificacionIndividual(20, alumno.id, `Has obtenido 1 cromo/s en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
            
            // Comprobamos si se ha completado la Colección tras haber asignado el/los Cromo/s
            // tslint:disable-next-line:max-line-length
            this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, alumnoJuegoDeColeccion.id, undefined).subscribe((finalizacionDespues) => {
              if ((finalizacionAntes === false) && (finalizacionDespues === true)) {
                // tslint:disable-next-line:max-line-length
                const eventoFinalizacionColeccion: Evento = new Evento(22, new Date(), this.profesor.id, alumno.id, undefined, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección');
                this.calculos.RegistrarEvento(eventoFinalizacionColeccion);
               
                // tslint:disable-next-line:max-line-length
                this.comService.EnviarNotificacionIndividual(22, alumno.id, `¡Enhorabuena! Has completado la colección de cromos en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
              }
            }, (err) => {
              console.log(err);
            });
          }, (err) => {
            console.log(err);
          });
        }, (err) => {
          console.log(err);
        });
      }
    });
  }


  AsignarCromoEquipos(cromoSeleccionado) {
    this.dataSource.data.forEach(row => {
      if (this.selection.isSelected(row)) {
        let equipo: Equipo;
        equipo = row;
        console.log(equipo.Nombre + ' seleccionado');

        let equipoJuegoDeColeccion: EquipoJuegoDeColeccion;
        equipoJuegoDeColeccion = this.inscripcionesEquipos.filter(res => res.equipoId === equipo.id)[0];
        console.log(equipoJuegoDeColeccion);

        // Comprobamos si se ha completado la Colección antes de haber asignado el/los Cromo/s
        // tslint:disable-next-line:max-line-length
        this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion.id).subscribe((finalizacionAntes) => {

          this.peticionesAPI.AsignarCromoEquipo(new AlbumEquipo (equipoJuegoDeColeccion.id, cromoSeleccionado))
          .subscribe(res => {
            console.log(res);
            Swal.fire('OK', 'Cromo asignado a los equipos elegidos', 'success');
            // Registrar la Asignación de Cromo/s
            // tslint:disable-next-line:max-line-length
            const eventoAsignarCromos: Evento = new Evento(20, new Date(), this.profesor.id, undefined, equipo.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección', undefined, undefined, undefined, 1);
            this.calculos.RegistrarEvento (eventoAsignarCromos);

          
            // Notificar a los Alumnos del Equipo
            // tslint:disable-next-line:max-line-length
            this.comService.EnviarNotificacionEquipo(20, equipo.id, `Tu equipo ${equipo.Nombre} ha obtenido 1 cromo/s en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
       
            // Comprobamos si se ha completado la Colección tras haber asignado el/los Cromo/s
            // tslint:disable-next-line:max-line-length
            this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion.id).subscribe((finalizacionDespues) => {
              if ((finalizacionAntes === false) && (finalizacionDespues === true)) {
                // tslint:disable-next-line:max-line-length
                const eventoFinalizacionColeccion: Evento = new Evento(22, new Date(), this.profesor.id, undefined, equipo.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección');
                this.calculos.RegistrarEvento(eventoFinalizacionColeccion);
     
           

                // Notificar a los Alumnos del Equipo
                // tslint:disable-next-line:max-line-length
                this.comService.EnviarNotificacionEquipo(22, equipo.id, `¡Enhorabuena! Tu equipo ${equipo.Nombre} ha completado la colección de cromos en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
                
              }
            }, (err) => {
              console.log(err);
            });
          }, (err) => {
            console.log(err);
          });
        }, (err) => {
          console.log(err);
        });
      }
    });
  }


  AsignarCromoEquiposDeAlumnosElegidos(cromoSeleccionado) {
    this.dataSource.data.forEach(row => {
      if (this.selection.isSelected(row))  {
        let alumno: Alumno;
        alumno = row;
        // Buscamos el equipo del juego al que pertenece el alumno
        this.peticionesAPI.DameEquiposDelAlumno (alumno.id)
        .subscribe (equiposDelAlumno => {
          // Busco el equipo que esta tanto en la lista de equipos del juego como en la lista de equipso del
          // alumno
          const equipo = equiposDelAlumno.filter(e => this.equiposDelJuego.some(a => a.id === e.id))[0];
          let equipoJuegoDeColeccion: EquipoJuegoDeColeccion;
          equipoJuegoDeColeccion = this.inscripcionesEquipos.filter(res => res.equipoId === equipo.id)[0];
          console.log(equipoJuegoDeColeccion);

          // Comprobamos si se ha completado la Colección antes de haber asignado el/los Cromo/s
          // tslint:disable-next-line:max-line-length
          this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion.id).subscribe((finalizacionAntes) => {

            this.peticionesAPI.AsignarCromoEquipo(new AlbumEquipo (equipoJuegoDeColeccion.id, cromoSeleccionado))
            .subscribe(res => {
              console.log(res);
              Swal.fire('OK', 'Cromo asignado a los equipos de los alumnos elegidos', 'success');
              // tslint:disable-next-line:max-line-length
              const eventoAsignarCromos: Evento = new Evento(20, new Date(), this.profesor.id, undefined, equipo.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección', undefined, undefined, undefined, 1);
              this.calculos.RegistrarEvento(eventoAsignarCromos);

        
              // Notificar a los Alumnos del Equipo
              // tslint:disable-next-line:max-line-length
              this.comService.EnviarNotificacionEquipo(20, equipo.id, `Tu Equipo ${equipo.Nombre} ha obtenido 1 cromo/s en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);

              // Comprobamos si se ha completado la Colección tras haber asignado el/los Cromo/s
              // tslint:disable-next-line:max-line-length
              this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion.id).subscribe((finalizacionDespues) => {
                if ((finalizacionAntes === false) && (finalizacionDespues === true)) {
                  // tslint:disable-next-line:max-line-length
                  const eventoFinalizacionColeccion: Evento = new Evento(22, new Date(), this.profesor.id, undefined, equipo.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección');
                  this.calculos.RegistrarEvento(eventoFinalizacionColeccion);

             
                  // Notificar a los Alumnos del Equipo
                  // tslint:disable-next-line:max-line-length
                  this.comService.EnviarNotificacionEquipo(22, equipo.id, `¡Enhorabuena! Tu equipo ${equipo.Nombre} ha completado la colección de cromos en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
                  
                }
              }, (err) => {
                console.log(err);
              });
            }, (err) => {
              console.log(err);
            });
          }, (err) => {
            console.log(err);
          });
        });
      }
    });
  }


  AsignarCromosAleatorios() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.AsignarCromosAleatoriosAlumno();

    } else if (this.juegoSeleccionado.Asignacion === 'Equipo') {
      this.AsignarCromosAleatoriosEquipo();
    } else {
      this.AsignarCromosAleatoriosEquiposDeAlumnosElegidos ();
    }
  }

  AsignarCromosAleatoriosAlumno() {
    this.dataSource.data.forEach(row => {
      if (this.selection.isSelected(row))  {
        const alumno: Alumno = row;

        // Comprobamos si se ha completado la Colección antes de haber asignado el/los Cromo/s
        const alumnoJuegoDeColeccion: AlumnoJuegoDeColeccion = this.inscripcionesAlumnos.filter(res => res.alumnoId === alumno.id)[0];
        // tslint:disable-next-line:max-line-length
        this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, alumnoJuegoDeColeccion.id, undefined).subscribe((finalizacionAntes) => {

          // tslint:disable-next-line:max-line-length
          this.calculos.AsignarCromosAleatoriosAlumno (alumno, this.inscripcionesAlumnos, this.numeroCromosRandom, this.probabilidadCromos, this.cromosColeccion);
          Swal.fire('OK', 'Cromos aleatorios asignados a los alumnos elegidos', 'success');
          // tslint:disable-next-line:max-line-length
          const eventoAsignarCromos: Evento = new Evento(20, new Date(), this.profesor.id, alumno.id, undefined, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección', undefined, undefined, undefined, this.numeroCromosRandom);
          this.calculos.RegistrarEvento (eventoAsignarCromos);

       
          // Notificar al Alumno
          // tslint:disable-next-line:max-line-length
          this.comService.EnviarNotificacionIndividual(20, alumno.id, `Has obtenido ${this.numeroCromosRandom} cromo/s en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
          
          // Comprobamos si se ha completado la Colección tras haber asignado el/los Cromo/s
          // tslint:disable-next-line:max-line-length
          this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, alumnoJuegoDeColeccion.id, undefined).subscribe((finalizacionDespues) => {
            if ((finalizacionAntes === false) && (finalizacionDespues === true)) {
              // tslint:disable-next-line:max-line-length
              const eventoFinalizacionColeccion: Evento = new Evento(22, new Date(), this.profesor.id, alumno.id, undefined, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección');
              this.calculos.RegistrarEvento(eventoFinalizacionColeccion);
            
        
              // Notificar al Alumno
              // tslint:disable-next-line:max-line-length
              this.comService.EnviarNotificacionIndividual(22, alumno.id, `¡Enhorabuena! Has completado la colección de cromos en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
              
            }
          }, (err) => {
            console.log(err);
          });
        }, (err) => {
          console.log(err);
        });
      }
    });
  }

  AsignarCromosAleatoriosEquipo() {
    this.dataSource.data.forEach(row => {
      if (this.selection.isSelected(row))  {
        const equipo: Equipo = row;

        // Comprobamos si se ha completado la Colección antes de haber asignado el/los Cromo/s
        const equipoJuegoDeColeccion: EquipoJuegoDeColeccion = this.inscripcionesEquipos.filter(res => res.equipoId === equipo.id)[0];
        // tslint:disable-next-line:max-line-length
        this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion.id).subscribe((finalizacionAntes) => {

          // tslint:disable-next-line:max-line-length
          this.calculos.AsignarCromosAleatoriosEquipo (equipo, this.inscripcionesEquipos, this.numeroCromosRandom, this.probabilidadCromos, this.cromosColeccion);
          Swal.fire('OK', 'Cromos aleatorios asignados a los equipos elegidos', 'success');
          // tslint:disable-next-line:max-line-length
          const eventoAsignarCromos: Evento = new Evento(20, new Date(), this.profesor.id, undefined, equipo.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección', undefined, undefined, undefined, this.numeroCromosRandom);
          this.calculos.RegistrarEvento(eventoAsignarCromos);

      
          // Notificar a los Alumnos del Equipo
          // tslint:disable-next-line:max-line-length
          this.comService.EnviarNotificacionEquipo(20, equipo.id, `Tu Equipo ${equipo.Nombre} ha obtenido ${this.numeroCromosRandom} cromo/s en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
          
          // Comprobamos si se ha completado la Colección tras haber asignado el/los Cromo/s
          // tslint:disable-next-line:max-line-length
          this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion.id).subscribe((finalizacionDespues) => {
            if ((finalizacionAntes === false) && (finalizacionDespues === true)) {
              // tslint:disable-next-line:max-line-length
              const eventoFinalizacionColeccion: Evento = new Evento(22, new Date(), this.profesor.id, undefined, equipo.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección');
              this.calculos.RegistrarEvento(eventoFinalizacionColeccion);
            
           
              // Notificar a los Alumnos del Equipo
              // tslint:disable-next-line:max-line-length
              this.comService.EnviarNotificacionEquipo(22, equipo.id, `¡Enhorabuena! Tu equipo ${equipo.Nombre} ha completado la colección de cromos en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
              
            }
          }, (err) => {
            console.log(err);
          });
        }, (err) => {
          console.log(err);
        });
      }
    });
  }

  AsignarCromosAleatoriosEquiposDeAlumnosElegidos() {
    this.dataSource.data.forEach(row =>  {
      if (this.selection.isSelected(row)) {
        let alumno: Alumno;
        alumno = row;
        // Buscamos el equipo del juego al que pertenece el alumno
        this.peticionesAPI.DameEquiposDelAlumno (alumno.id)
        .subscribe (equiposDelAlumno => {
          // Busco el equipo que esta tanto en la lista de equipos del juego como en la lista de equipso del
          // alumno
          const equipo = equiposDelAlumno.filter(e => this.equiposDelJuego.some(a => a.id === e.id))[0];
          let equipoJuegoDeColeccion: EquipoJuegoDeColeccion;
          equipoJuegoDeColeccion = this.inscripcionesEquipos.filter(res => res.equipoId === equipo.id)[0];

          // Comprobamos si se ha completado la Colección antes de haber asignado el/los Cromo/s
          // tslint:disable-next-line:max-line-length
          this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion.id).subscribe((finalizacionAntes) => {

            // tslint:disable-next-line:max-line-length
            this.calculos.AsignarCromosAleatoriosEquipo (equipo, this.inscripcionesEquipos, this.numeroCromosRandom, this.probabilidadCromos, this.cromosColeccion);
            Swal.fire('OK', 'Cromos aleatorios asignados a los equipos de los alumnos elegidos', 'success');
            // tslint:disable-next-line:max-line-length
            const eventoAsignarCromos: Evento = new Evento(20, new Date(), this.profesor.id, undefined, equipo.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección', undefined, undefined, undefined, this.numeroCromosRandom);
            this.calculos.RegistrarEvento(eventoAsignarCromos);

     
            // Notificar a los Alumnos del Equipo
            // tslint:disable-next-line:max-line-length
            this.comService.EnviarNotificacionEquipo(20, equipo.id, `Tu Equipo ${equipo.Nombre} ha obtenido ${this.numeroCromosRandom} cromo/s en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
            
            // Comprobamos si se ha completado la Colección tras haber asignado el/los Cromo/s
            // tslint:disable-next-line:max-line-length
            this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion.id).subscribe((finalizacionDespues) => {
              if ((finalizacionAntes === false) && (finalizacionDespues === true)) {
                // tslint:disable-next-line:max-line-length
                const eventoFinalizacionColeccion: Evento = new Evento(22, new Date(), this.profesor.id, undefined, equipo.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección');
                this.calculos.RegistrarEvento(eventoFinalizacionColeccion);
              
             
                // Notificar a los Alumnos del Equipo
                // tslint:disable-next-line:max-line-length
                this.comService.EnviarNotificacionEquipo(22, equipo.id, `¡Enhorabuena! Tu equipo ${equipo.Nombre} ha completado la colección de cromos en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
                
              }
            }, (err) => {
              console.log(err);
            });
          }, (err) => {
              console.log(err);
          });
        });
      }
    });
  }

  AsignarAleatoriamenteCromosAleatorios() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.AsignarCromosAleatoriosAlumnoAleatorio();

    } else if (this.juegoSeleccionado.Asignacion === 'Equipo') {
      this.AsignarCromosAleatoriosEquipoAleatorio();
    } else {
      this.AsignarCromosAleatoriosEquipoDeAlumnoAleatorio ();
    }
  }

  AsignarCromosAleatoriosAlumnoAleatorio() {
    const numeroAlumnos = this.alumnosDelJuego.length;
    const elegido = Math.floor(Math.random() * numeroAlumnos);
    this.alumnoElegido = this.alumnosDelJuego[elegido];
    Swal.fire({
      title: '¿Seguro que quieres asignar cromos a este alumno?',
      text: this.alumnoElegido.Nombre + ' ' + this.alumnoElegido.PrimerApellido + ' ' + this.alumnoElegido.SegundoApellido,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
           // Comprobamos si se ha completado la Colección antes de haber asignado el/los Cromo/s
          // tslint:disable-next-line:max-line-length
          const alumnoJuegoDeColeccion: AlumnoJuegoDeColeccion = this.inscripcionesAlumnos.filter(res => res.alumnoId === this.alumnoElegido.id)[0];
          // tslint:disable-next-line:max-line-length
          this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, alumnoJuegoDeColeccion.id, undefined).subscribe((finalizacionAntes) => {

            // tslint:disable-next-line:max-line-length
            this.calculos.AsignarCromosAleatoriosAlumno (this.alumnoElegido, this.inscripcionesAlumnos, this.numeroCromosRandom, this.probabilidadCromos, this.cromosColeccion);
            Swal.fire('OK', 'Cromos aleatorios asignados a: ' + this.alumnoElegido.Nombre, 'success');
            // tslint:disable-next-line:max-line-length
            const eventoAsignarCromos: Evento = new Evento(20, new Date(), this.profesor.id, this.alumnoElegido.id, undefined, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección', undefined, undefined, undefined, this.numeroCromosRandom);
            this.calculos.RegistrarEvento (eventoAsignarCromos);

            // Notificar al Alumno
            // tslint:disable-next-line:max-line-length
            this.comService.EnviarNotificacionIndividual(20, this.alumnoElegido.id, `Has obtenido ${this.numeroCromosRandom} cromo/s en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);

              // Comprobamos si se ha completado la Colección tras haber asignado el/los Cromo/s
            // tslint:disable-next-line:max-line-length
            this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, alumnoJuegoDeColeccion.id, undefined).subscribe((finalizacionDespues) => {
              if ((finalizacionAntes === false) && (finalizacionDespues === true)) {
                // tslint:disable-next-line:max-line-length
                const eventoFinalizacionColeccion: Evento = new Evento(22, new Date(), this.profesor.id, this.alumnoElegido.id, undefined, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección');
                this.calculos.RegistrarEvento(eventoFinalizacionColeccion);

                // Notificar al Alumno
                // tslint:disable-next-line:max-line-length
                this.comService.EnviarNotificacionIndividual(22, this.alumnoElegido.id, `¡Enhorabuena! Has completado la colección de cromos en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
              }
            }, (err) => {
              console.log(err);
            });
          }, (err) => {
            console.log(err);
          });
      }
    });
    
  }

  AsignarCromosAleatoriosEquipoAleatorio() {
    const numeroEquipos = this.equiposDelJuego.length;
    const elegido = Math.floor(Math.random() * numeroEquipos);
    this.equipoElegido = this.equiposDelJuego[elegido];

    Swal.fire({
      title: '¿Seguro que quieres asignar cromos a este equipo?',
      text: this.equipoElegido.Nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
         // Comprobamos si se ha completado la Colección antes de haber asignado el/los Cromo/s
        // tslint:disable-next-line:max-line-length
        const equipoJuegoDeColeccion: EquipoJuegoDeColeccion = this.inscripcionesEquipos.filter(res => res.equipoId === this.equipoElegido.id)[0];
        // tslint:disable-next-line:max-line-length
        this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion.id).subscribe((finalizacionAntes) => {

          // tslint:disable-next-line:max-line-length
          this.calculos.AsignarCromosAleatoriosEquipo (this.equipoElegido, this.inscripcionesEquipos, this.numeroCromosRandom, this.probabilidadCromos, this.cromosColeccion);
          Swal.fire('OK', 'Cromos aleatorios asignados al equipo: ' + this.equipoElegido.Nombre, 'success');
          // tslint:disable-next-line:max-line-length
          const eventoAsignarCromos: Evento = new Evento(20, new Date(), this.profesor.id, undefined, this.equipoElegido.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección', undefined, undefined, undefined, this.numeroCromosRandom);
          this.calculos.RegistrarEvento(eventoAsignarCromos);


          // Notificar a los Alumnos del Equipo
          // tslint:disable-next-line:max-line-length
          this.comService.EnviarNotificacionEquipo(20, this.equipoElegido.id, `Tu Equipo ${this.equipoElegido.Nombre} ha obtenido ${this.numeroCromosRandom} cromo/s en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);      
          // Comprobamos si se ha completado la Colección tras haber asignado el/los Cromo/s
          // tslint:disable-next-line:max-line-length
          this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion.id).subscribe((finalizacionDespues) => {
            if ((finalizacionAntes === false) && (finalizacionDespues === true)) {
              // tslint:disable-next-line:max-line-length
              const eventoFinalizacionColeccion: Evento = new Evento(22, new Date(), this.profesor.id, undefined, this.equipoElegido.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección');
              this.calculos.RegistrarEvento(eventoFinalizacionColeccion);
              // Notificar a los Alumnos del Equipo
              // tslint:disable-next-line:max-line-length
              this.comService.EnviarNotificacionEquipo(22, this.equipoElegido.id, `¡Enhorabuena! Tu equipo ${this.equipoElegido.Nombre} ha completado la colección de cromos en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
            }
          }, (err) => {
            console.log(err);
          });
        }, (err) => {
          console.log(err);
        });
      }
    });
  }

  AsignarCromosAleatoriosEquipoDeAlumnoAleatorio() {
    const numeroAlumnos = this.alumnosDelJuego.length;
    const elegido = Math.floor(Math.random() * numeroAlumnos);
    const alumno = this.alumnosDelJuego[elegido];
    Swal.fire({
      title: '¿Seguro que quieres asignar cromos al equipo de este alumno?',
      text: this.alumnoElegido.Nombre + ' ' + this.alumnoElegido.PrimerApellido + ' ' + this.alumnoElegido.SegundoApellido,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
          // Buscamos el equipo del juego al que pertenece el alumno
          this.peticionesAPI.DameEquiposDelAlumno (alumno.id)
          .subscribe (equiposDelAlumno => {
            // Busco el equipo que esta tanto en la lista de equipos del juego como en la lista de equipso del
            // alumno
            const equipo = equiposDelAlumno.filter(e => this.equiposDelJuego.some(a => a.id === e.id))[0];
            let equipoJuegoDeColeccion: EquipoJuegoDeColeccion;
            equipoJuegoDeColeccion = this.inscripcionesEquipos.filter(res => res.equipoId === equipo.id)[0];

            // Comprobamos si se ha completado la Colección antes de haber asignado el/los Cromo/s
            // tslint:disable-next-line:max-line-length
            this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion.id).subscribe((finalizacionAntes) => {

              // tslint:disable-next-line:max-line-length
              this.calculos.AsignarCromosAleatoriosEquipo (equipo, this.inscripcionesEquipos, this.numeroCromosRandom, this.probabilidadCromos, this.cromosColeccion);
              Swal.fire('OK', 'Cromos aleatorios asignados al equipo de: ' + alumno.Nombre, 'success');
              // tslint:disable-next-line:max-line-length
              const eventoAsignarCromos: Evento = new Evento(20, new Date(), this.profesor.id, undefined, equipo.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección', undefined, undefined, undefined, this.numeroCromosRandom);
              this.calculos.RegistrarEvento(eventoAsignarCromos);

            
              // Notificar a los Alumnos del Equipo
              // tslint:disable-next-line:max-line-length
              this.comService.EnviarNotificacionEquipo(20, equipo.id, `Tu Equipo ${equipo.Nombre} ha obtenido ${this.numeroCromosRandom} cromo/s en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
              
              // Comprobamos si se ha completado la Colección tras haber asignado el/los Cromo/s
              // tslint:disable-next-line:max-line-length
              this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion.id).subscribe((finalizacionDespues) => {
                if ((finalizacionAntes === false) && (finalizacionDespues === true)) {

                  // tslint:disable-next-line:max-line-length
                  const eventoFinalizacionColeccion: Evento = new Evento(22, new Date(), this.profesor.id, undefined, equipo.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección');
                  this.calculos.RegistrarEvento(eventoFinalizacionColeccion);
              
          
                  // Notificar a los Alumnos del Equipo
                  // tslint:disable-next-line:max-line-length
                  this.comService.EnviarNotificacionEquipo(22, equipo.id, `¡Enhorabuena! Tu equipo ${equipo.Nombre} ha completado la colección de cromos en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);

                }
              }, (err) => {
                console.log(err);
              });
            }, (err) => {
              console.log(err);
            });
          });
      }
    });
  }

  AlumnosDelEquipo(equipo: Equipo) {
    console.log(equipo);

    this.peticionesAPI.DameAlumnosEquipo(equipo.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.alumnosEquipo = res;
        console.log(res);
      } else {
        console.log('No hay alumnos en este equipo');
        this.alumnosEquipo = undefined;
      }
    });
  }

  AsignarCromosMejoresRanking() {
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.peticionesAPI.DameInscripcionesAlumnoJuegoDePuntos(this.juegoPuntosSeleccionadoId)
      .subscribe(inscripciones => {
        // tslint:disable-next-line:only-arrow-functions
        const ranking = inscripciones.sort(function(obj1, obj2) {
          return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
        });
        // Obtengo los tres primeros alumnos del ranking (atención porque el ranking solo
        // tiene los identificadores de los alumnos y a partir de ellos tengo que conseguir los alumnos)
        this.primerAlumno = this.alumnosDelJuego.filter (a => a.id === ranking[0].alumnoId)[0];
        this.segundoAlumno = this.alumnosDelJuego.filter (a => a.id === ranking[1].alumnoId)[0];
        this.tercerAlumno = this.alumnosDelJuego.filter (a => a.id === ranking[2].alumnoId)[0];



        // Comprobamos si se ha completado la Colección (Del Alumno 1) antes de haber asignado el/los Cromo/s
        // tslint:disable-next-line:max-line-length
        const alumnoJuegoDeColeccion1: AlumnoJuegoDeColeccion = this.inscripcionesAlumnos.filter(res => res.alumnoId === this.primerAlumno.id)[0];
        // tslint:disable-next-line:max-line-length
        this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, alumnoJuegoDeColeccion1.id, undefined).subscribe((finalizacionAntesA1) => {

          // tslint:disable-next-line:max-line-length
          this.calculos.AsignarCromosAleatoriosAlumno (this.primerAlumno, this.inscripcionesAlumnos, this.cromosParaPrimero, this.probabilidadCromos, this.cromosColeccion);
          // tslint:disable-next-line:max-line-length
          const eventoAsignarCromosA1: Evento = new Evento(20, new Date(), this.profesor.id, this.primerAlumno.id, undefined, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección', undefined, undefined, undefined, this.cromosParaPrimero);
          this.calculos.RegistrarEvento(eventoAsignarCromosA1);


          // Notificar al Alumno (1)
          // tslint:disable-next-line:max-line-length
          this.comService.EnviarNotificacionIndividual(20, this.primerAlumno.id, `Has obtenido ${this.cromosParaPrimero} cromo/s en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
          
          // Comprobamos si se ha completado la Colección (Del Alumno 1) tras haber asignado el/los Cromo/s
          // tslint:disable-next-line:max-line-length
          this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, alumnoJuegoDeColeccion1.id, undefined).subscribe((finalizacionDespuesA1) => {
            if ((finalizacionAntesA1 === false) && (finalizacionDespuesA1 === true)) {
              // tslint:disable-next-line:max-line-length
              const eventoFinalizacionColeccionA1: Evento = new Evento(22, new Date(), this.profesor.id, this.primerAlumno.id, undefined, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección');
              this.calculos.RegistrarEvento(eventoFinalizacionColeccionA1);

    
              // Notificar al Alumno (1)
              // tslint:disable-next-line:max-line-length
              this.comService.EnviarNotificacionIndividual(22, this.primerAlumno.id, `¡Enhorabuena! Has completado la colección de cromos en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
              
            }
          }, (err) => {
            console.log(err);
          });
          
        }, (err) => {
          console.log(err);
        });



        // Comprobamos si se ha completado la Colección (Del Alumno 2) antes de haber asignado el/los Cromo/s
        // tslint:disable-next-line:max-line-length
        const alumnoJuegoDeColeccion2: AlumnoJuegoDeColeccion = this.inscripcionesAlumnos.filter(res => res.alumnoId === this.segundoAlumno.id)[0];
        // tslint:disable-next-line:max-line-length
        this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, alumnoJuegoDeColeccion2.id, undefined).subscribe((finalizacionAntesA2) => {

          // tslint:disable-next-line:max-line-length
          this.calculos.AsignarCromosAleatoriosAlumno (this.segundoAlumno, this.inscripcionesAlumnos, this.cromosParaSegundo, this.probabilidadCromos, this.cromosColeccion);
          // tslint:disable-next-line:max-line-length
          const eventoAsignarCromosA2: Evento = new Evento(20, new Date(), this.profesor.id, this.segundoAlumno.id, undefined, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección', undefined, undefined, undefined, this.cromosParaSegundo);
          this.calculos.RegistrarEvento(eventoAsignarCromosA2);

      
          // Notificar al Alumno (2)
          // tslint:disable-next-line:max-line-length
          this.comService.EnviarNotificacionIndividual(20, this.segundoAlumno.id, `Has obtenido ${this.cromosParaSegundo} cromo/s en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
          
          // Comprobamos si se ha completado la Colección (Del Alumno 2) tras haber asignado el/los Cromo/s
          // tslint:disable-next-line:max-line-length
          this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, alumnoJuegoDeColeccion2.id, undefined).subscribe((finalizacionDespuesA2) => {
            if ((finalizacionAntesA2 === false) && (finalizacionDespuesA2 === true)) {
              // tslint:disable-next-line:max-line-length
              const eventoFinalizacionColeccionA2: Evento = new Evento(22, new Date(), this.profesor.id, this.segundoAlumno.id, undefined, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección');
              this.calculos.RegistrarEvento(eventoFinalizacionColeccionA2);
             
            
              // Notificar al Alumno (2)
              // tslint:disable-next-line:max-line-length
              this.comService.EnviarNotificacionIndividual(22, this.segundoAlumno.id, `¡Enhorabuena! Has completado la colección de cromos en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
              
            }
          }, (err) => {
            console.log(err);
          });
        }, (err) => {
          console.log(err);
        });



        // Comprobamos si se ha completado la Colección (Del Alumno 3) antes de haber asignado el/los Cromo/s
        // tslint:disable-next-line:max-line-length
        const alumnoJuegoDeColeccion3: AlumnoJuegoDeColeccion = this.inscripcionesAlumnos.filter(res => res.alumnoId === this.tercerAlumno.id)[0];
        // tslint:disable-next-line:max-line-length
        this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, alumnoJuegoDeColeccion3.id, undefined).subscribe((finalizacionAntesA3) => {

          // tslint:disable-next-line:max-line-length
          this.calculos.AsignarCromosAleatoriosAlumno (this.tercerAlumno, this.inscripcionesAlumnos, this.cromosParaTercero, this.probabilidadCromos, this.cromosColeccion);
          // tslint:disable-next-line:max-line-length
          const eventoAsignarCromosA3: Evento = new Evento(20, new Date(), this.profesor.id, this.tercerAlumno.id, undefined, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección', undefined, undefined, undefined, this.cromosParaTercero);
          this.calculos.RegistrarEvento (eventoAsignarCromosA3);

       
          // Notificar al Alumno (3)
          // tslint:disable-next-line:max-line-length
          this.comService.EnviarNotificacionIndividual(20, this.tercerAlumno.id, `Has obtenido ${this.cromosParaTercero} cromo/s en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
          
          // Comprobamos si se ha completado la Colección (Del Alumno 3) tras haber asignado el/los Cromo/s
          // tslint:disable-next-line:max-line-length
          this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, alumnoJuegoDeColeccion3.id, undefined).subscribe((finalizacionDespuesA3) => {
            if ((finalizacionAntesA3 === false) && (finalizacionDespuesA3 === true)) {
              // tslint:disable-next-line:max-line-length
              const eventoFinalizacionColeccionA3: Evento = new Evento(22, new Date(), this.profesor.id, this.tercerAlumno.id, undefined, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección');
              this.calculos.RegistrarEvento (eventoFinalizacionColeccionA3);

           
              // Notificar al Alumno (3)
              // tslint:disable-next-line:max-line-length
              this.comService.EnviarNotificacionIndividual(22, this.tercerAlumno.id, `¡Enhorabuena! Has completado la colección de cromos en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
              
            }
          }, (err) => {
            console.log(err);
          });
        }, (err) => {
          console.log(err);
        });



        Swal.fire('OK', 'Cromos aleatorios asignados a los tres mejores alumnos en el juego de puntos elegido: ', 'success');
      });

    } else if (this.juegoSeleccionado.Asignacion === 'Equipo') {
      this.peticionesAPI.DameInscripcionesEquipoJuegoDePuntos(this.juegoPuntosSeleccionadoId)
      .subscribe(inscripciones => {
        // tslint:disable-next-line:only-arrow-functions
        const ranking = inscripciones.sort(function(obj1, obj2) {
          return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
        });
        // Obtengo los tres primeros equipos del ranking (atención porque el ranking solo
        // tiene los identificadores de los equipos y a partir de ellos tengo que conseguir los equipos)
        this.primerEquipo = this.equiposDelJuego.filter (a => a.id === ranking[0].equipoId)[0];
        this.segundoEquipo = this.equiposDelJuego.filter (a => a.id === ranking[1].equipoId)[0];
        this.tercerEquipo = this.equiposDelJuego.filter (a => a.id === ranking[2].equipoId)[0];



        // Comprobamos si se ha completado la Colección (Del Equipo 1) antes de haber asignado el/los Cromo/s
        // tslint:disable-next-line:max-line-length
        const equipoJuegoDeColeccion1: EquipoJuegoDeColeccion = this.inscripcionesEquipos.filter(res => res.equipoId === this.primerEquipo.id)[0];
        // tslint:disable-next-line:max-line-length
        this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion1.id).subscribe((finalizacionAntesE1) => {

          // tslint:disable-next-line:max-line-length
          this.calculos.AsignarCromosAleatoriosEquipo (this.primerEquipo, this.inscripcionesEquipos, this.cromosParaPrimero, this.probabilidadCromos, this.cromosColeccion);

          // tslint:disable-next-line:max-line-length
          const eventoAsignarCromosE1: Evento = new Evento(20, new Date(), this.profesor.id, undefined, this.primerEquipo.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección', undefined, undefined, undefined, this.cromosParaPrimero);
          this.calculos.RegistrarEvento (eventoAsignarCromosE1);

          // Notificar a los Alumnos del Equipo (1)
          // tslint:disable-next-line:max-line-length
          this.comService.EnviarNotificacionEquipo(20, this.primerEquipo.id, `Tu Equipo ${this.primerEquipo.Nombre} ha obtenido ${this.cromosParaPrimero} cromo/s en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
          
          // Comprobamos si se ha completado la Colección (Del Equipo 1) tras haber asignado el/los Cromo/s
          // tslint:disable-next-line:max-line-length
          this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion1.id).subscribe((finalizacionDespuesE1) => {
            if ((finalizacionAntesE1 === false) && (finalizacionDespuesE1 === true)) {
                // tslint:disable-next-line:max-line-length
                const eventoFinalizacionColeccionE1: Evento = new Evento(22, new Date(), this.profesor.id, undefined, this.primerEquipo.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección');
                this.calculos.RegistrarEvento(eventoFinalizacionColeccionE1);

                // Notificar a los Alumnos del Equipo (1)
                // tslint:disable-next-line:max-line-length
                this.comService.EnviarNotificacionEquipo(22, this.primerEquipo.id, `¡Enhorabuena! Tu equipo ${this.primerEquipo.Nombre} ha completado la colección de cromos en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
                
              }
            }, (err) => {
              console.log(err);
          });
        }, (err) => {
          console.log(err);
        });



        // Comprobamos si se ha completado la Colección (Del Equipo 2) antes de haber asignado el/los Cromo/s
        // tslint:disable-next-line:max-line-length
        const equipoJuegoDeColeccion2: EquipoJuegoDeColeccion = this.inscripcionesEquipos.filter(res => res.equipoId === this.segundoEquipo.id)[0];
        // tslint:disable-next-line:max-line-length
        this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion2.id).subscribe((finalizacionAntesE2) => {

          // tslint:disable-next-line:max-line-length
          this.calculos.AsignarCromosAleatoriosEquipo (this.segundoEquipo, this.inscripcionesEquipos, this.cromosParaSegundo, this.probabilidadCromos, this.cromosColeccion);
          // tslint:disable-next-line:max-line-length
          const eventoAsignarCromosE2: Evento = new Evento(20, new Date(), this.profesor.id, undefined, this.segundoEquipo.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección', undefined, undefined, undefined, this.cromosParaSegundo);
          this.calculos.RegistrarEvento (eventoAsignarCromosE2);

         
          // Notificar a los Alumnos del Equipo (2)
          // tslint:disable-next-line:max-line-length
          this.comService.EnviarNotificacionEquipo(20, this.segundoEquipo.id, `Tu Equipo ${this.segundoEquipo.Nombre} ha obtenido ${this.cromosParaSegundo} cromo/s en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
          
          // Comprobamos si se ha completado la Colección (Del Equipo 2) tras haber asignado el/los Cromo/s
          // tslint:disable-next-line:max-line-length
          this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion2.id).subscribe((finalizacionDespuesE2) => {
            if ((finalizacionAntesE2 === false) && (finalizacionDespuesE2 === true)) {
                // tslint:disable-next-line:max-line-length
                const eventoFinalizacionColeccionE2: Evento = new Evento(22, new Date(), this.profesor.id, undefined, this.segundoEquipo.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección');
                this.calculos.RegistrarEvento(eventoFinalizacionColeccionE2);

     
                // Notificar a los Alumnos del Equipo (2)
                // tslint:disable-next-line:max-line-length
                this.comService.EnviarNotificacionEquipo(22, this.segundoEquipo.id, `¡Enhorabuena! Tu equipo ${this.segundoEquipo.Nombre} ha completado la colección de cromos en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
                
            }
            }, (err) => {
              console.log(err);
          });
        }, (err) => {
          console.log(err);
        });


        // Comprobamos si se ha completado la Colección (Del Equipo 3) antes de haber asignado el/los Cromo/s
        // tslint:disable-next-line:max-line-length
        const equipoJuegoDeColeccion3: EquipoJuegoDeColeccion = this.inscripcionesEquipos.filter(res => res.equipoId === this.tercerEquipo.id)[0];
        // tslint:disable-next-line:max-line-length
        this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion3.id).subscribe((finalizacionAntesE3) => {

          // tslint:disable-next-line:max-line-length
          this.calculos.AsignarCromosAleatoriosEquipo (this.tercerEquipo, this.inscripcionesEquipos, this.cromosParaTercero, this.probabilidadCromos, this.cromosColeccion);
          // tslint:disable-next-line:quotemark
          // tslint:disable-next-line:max-line-length
          const eventoAsignarCromosE3: Evento = new Evento(20, new Date(), this.profesor.id, undefined, this.tercerEquipo.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección', undefined, undefined, undefined, this.cromosParaTercero);
          this.calculos.RegistrarEvento (eventoAsignarCromosE3);

  
          // Notificar a los Alumnos del Equipo (3)
          // tslint:disable-next-line:max-line-length
          this.comService.EnviarNotificacionEquipo(20, this.tercerEquipo.id, `Tu Equipo ${this.tercerEquipo.Nombre} ha obtenido ${this.cromosParaTercero} cromo/s en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
          
          // Comprobamos si se ha completado la Colección (Del Equipo 3) tras haber asignado el/los Cromo/s
          // tslint:disable-next-line:max-line-length
          this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion3.id).subscribe((finalizacionDespuesE3) => {
            if ((finalizacionAntesE3 === false) && (finalizacionDespuesE3 === true)) {
              // tslint:disable-next-line:max-line-length
              const eventoFinalizacionColeccionE3: Evento = new Evento(22, new Date(), this.profesor.id, undefined, this.tercerEquipo.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección');
              this.calculos.RegistrarEvento(eventoFinalizacionColeccionE3);
          
              // Notificar a los Alumnos del Equipo (3)
              // tslint:disable-next-line:max-line-length
              this.comService.EnviarNotificacionEquipo(22, this.tercerEquipo.id, `¡Enhorabuena! Tu equipo ${this.tercerEquipo.Nombre} ha completado la colección de cromos en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
              
            }
          }, (err) => {
            console.log(err);
          });
        }, (err) => {
          console.log(err);
        });
        Swal.fire('OK', 'Cromos aleatorios asignados a los tres mejores equipos en el juego de puntos elegido: ', 'success');
      });
    } else {
      // el juego es de equipo pero con asignación individual
      this.peticionesAPI.DameInscripcionesAlumnoJuegoDePuntos(this.juegoPuntosSeleccionadoId)
      .subscribe(inscripciones => {
        // tslint:disable-next-line:only-arrow-functions
        const ranking = inscripciones.sort(function(obj1, obj2) {
          return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
        });
        // Obtengo los tres primeros alumnos del ranking (atención porque el ranking solo
        // tiene los identificadores de los alumnos y a partir de ellos tengo que conseguir los alumnos)
        this.primerAlumno = this.alumnosDelJuego.filter (a => a.id === ranking[0].alumnoId)[0];
        this.segundoAlumno = this.alumnosDelJuego.filter (a => a.id === ranking[1].alumnoId)[0];
        this.tercerAlumno = this.alumnosDelJuego.filter (a => a.id === ranking[2].alumnoId)[0];

        // Buscamos el equipo del juego al que pertenece cada uno de los alumnos para asignarle los cromos
        this.peticionesAPI.DameEquiposDelAlumno (this.primerAlumno.id)
        .subscribe (equiposDelAlumno => {
          // Busco el equipo que esta tanto en la lista de equipos del juego como en la lista de equipso de alumno
          const equipoPrimerAlumno = equiposDelAlumno.filter(e => this.equiposDelJuego.some(a => a.id === e.id))[0];

          // Comprobamos si se ha completado la Colección (Del Equipo 1) antes de haber asignado el/los Cromo/s
          // tslint:disable-next-line:max-line-length
          const equipoJuegoDeColeccion1: EquipoJuegoDeColeccion = this.inscripcionesEquipos.filter(res => res.equipoId === equipoPrimerAlumno.id)[0];
          // tslint:disable-next-line:max-line-length
          this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion1.id).subscribe((finalizacionAntesE1) => {

            // tslint:disable-next-line:max-line-length
            this.calculos.AsignarCromosAleatoriosEquipo (equipoPrimerAlumno, this.inscripcionesEquipos, this.cromosParaPrimero, this.probabilidadCromos, this.cromosColeccion);
            // tslint:disable-next-line:max-line-length
            const eventoAsignarCromosE1: Evento = new Evento(20, new Date(), this.profesor.id, undefined, equipoPrimerAlumno.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección', undefined, undefined, undefined, this.cromosParaPrimero);
            this.calculos.RegistrarEvento (eventoAsignarCromosE1);

        
            // Notificar a los Alumnos del Equipo (1)
            // tslint:disable-next-line:max-line-length
            this.comService.EnviarNotificacionEquipo(20, equipoPrimerAlumno.id, `Tu Equipo ${equipoPrimerAlumno.Nombre} ha obtenido ${this.cromosParaPrimero} cromo/s en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
            
            // Comprobamos si se ha completado la Colección (Del Equipo 1) tras haber asignado el/los Cromo/s
            // tslint:disable-next-line:max-line-length
            this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion1.id).subscribe((finalizacionDespuesE1) => {
              if ((finalizacionAntesE1 === false) && (finalizacionDespuesE1 === true)) {
                // tslint:disable-next-line:max-line-length
                const eventoFinalizacionColeccionE1: Evento = new Evento(22, new Date(), this.profesor.id, undefined, equipoPrimerAlumno.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección');
                this.calculos.RegistrarEvento(eventoFinalizacionColeccionE1);
                
               
                // Notificar a los Alumnos del Equipo (1)
                // tslint:disable-next-line:max-line-length
                this.comService.EnviarNotificacionEquipo(22, equipoPrimerAlumno.id, `¡Enhorabuena! Tu equipo ${equipoPrimerAlumno.Nombre} ha completado la colección de cromos en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
                
              }
            }, (err) => {
                console.log(err);
            });
          }, (err) => {
            console.log(err);
          });
        }, (err) => {
          console.log(err);
        });


        this.peticionesAPI.DameEquiposDelAlumno (this.segundoAlumno.id)
        .subscribe (equiposDelAlumno => {
          // Busco el equipo que esta tanto en la lista de equipos del juego como en la lista de equipso de alumno
          const equipoSegundoAlumno = equiposDelAlumno.filter(e => this.equiposDelJuego.some(a => a.id === e.id))[0];

          // Comprobamos si se ha completado la Colección (Del Equipo 2) antes de haber asignado el/los Cromo/s
          // tslint:disable-next-line:max-line-length
          const equipoJuegoDeColeccion2: EquipoJuegoDeColeccion = this.inscripcionesEquipos.filter(res => res.equipoId === equipoSegundoAlumno.id)[0];
          // tslint:disable-next-line:max-line-length
          this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion2.id).subscribe((finalizacionAntesE2) => {
            // tslint:disable-next-line:max-line-length
            this.calculos.AsignarCromosAleatoriosEquipo (equipoSegundoAlumno, this.inscripcionesEquipos, this.cromosParaSegundo, this.probabilidadCromos, this.cromosColeccion);

            // tslint:disable-next-line:max-line-length
            const eventoAsignarCromosE2: Evento = new Evento(20, new Date(), this.profesor.id, undefined, equipoSegundoAlumno.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección', undefined, undefined, undefined, this.cromosParaSegundo);
            this.calculos.RegistrarEvento (eventoAsignarCromosE2);

      

            // Notificar a los Alumnos del Equipo (2)
            // tslint:disable-next-line:max-line-length
            this.comService.EnviarNotificacionEquipo(20, equipoSegundoAlumno.id, `Tu Equipo ${equipoSegundoAlumno.Nombre} ha obtenido ${this.cromosParaSegundo} cromo/s en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
            
            // Comprobamos si se ha completado la Colección (Del Equipo 2) tras haber asignado el/los Cromo/s
            // tslint:disable-next-line:max-line-length
            this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion2.id).subscribe((finalizacionDespuesE2) => {
              if ((finalizacionAntesE2 === false) && (finalizacionDespuesE2 === true)) {
                  // tslint:disable-next-line:max-line-length
                  const eventoFinalizacionColeccionE2: Evento = new Evento(22, new Date(), this.profesor.id, undefined, equipoSegundoAlumno.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección');
                  this.calculos.RegistrarEvento (eventoFinalizacionColeccionE2);
              
            
                  // Notificar a los Alumnos del Equipo (2)
                  // tslint:disable-next-line:max-line-length
                  this.comService.EnviarNotificacionEquipo(22, equipoSegundoAlumno.id, `¡Enhorabuena! Tu equipo ${equipoSegundoAlumno.Nombre} ha completado la colección de cromos en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
                  
              }
            }, (err) => {
                console.log(err);
            });
          }, (err) => {
            console.log(err);
          });
        }, (err) => {
          console.log(err);
        });



        this.peticionesAPI.DameEquiposDelAlumno (this.tercerAlumno.id)
        .subscribe (equiposDelAlumno => {
          // Busco el equipo que esta tanto en la lista de equipos del juego como en la lista de equipso de alumno
          const equipoTercerAlumno = equiposDelAlumno.filter(e => this.equiposDelJuego.some(a => a.id === e.id))[0];

          // Comprobamos si se ha completado la Colección (Del Equipo 3) antes de haber asignado el/los Cromo/s
          // tslint:disable-next-line:max-line-length
          const equipoJuegoDeColeccion3: EquipoJuegoDeColeccion = this.inscripcionesEquipos.filter(res => res.equipoId === equipoTercerAlumno.id)[0];
          // tslint:disable-next-line:max-line-length
          this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion3.id).subscribe((finalizacionAntesE3) => {

            // tslint:disable-next-line:max-line-length
            this.calculos.AsignarCromosAleatoriosEquipo (equipoTercerAlumno, this.inscripcionesEquipos, this.cromosParaTercero, this.probabilidadCromos, this.cromosColeccion);
            // tslint:disable-next-line:max-line-length
            const eventoAsignarCromosE3: Evento = new Evento(20, new Date(), this.profesor.id, undefined, equipoTercerAlumno.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección', undefined, undefined, undefined, this.cromosParaTercero);
            this.calculos.RegistrarEvento (eventoAsignarCromosE3);


            
            // Notificar a los Alumnos del Equipo (3)
            // tslint:disable-next-line:max-line-length
            this.comService.EnviarNotificacionEquipo(20, equipoTercerAlumno.id, `Tu Equipo ${equipoTercerAlumno.Nombre} ha obtenido ${this.cromosParaTercero} cromo/s en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
            
            // Comprobamos si se ha completado la Colección (Del Equipo 3) tras haber asignado el/los Cromo/s
            // tslint:disable-next-line:max-line-length
            this.calculos.CompruebaFinalizacionColeccion(this.juegoSeleccionado.coleccionId, undefined, equipoJuegoDeColeccion3.id).subscribe((finalizacionDespuesE3) => {
              if ((finalizacionAntesE3 === false) && (finalizacionDespuesE3 === true)) {
                // tslint:disable-next-line:max-line-length
                const eventoFinalizacionColeccionE3: Evento = new Evento(22, new Date(), this.profesor.id, undefined, equipoTercerAlumno.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Colección');
                this.calculos.RegistrarEvento(eventoFinalizacionColeccionE3);
         

                // Notificar a los Alumnos del Equipo (3)
                // tslint:disable-next-line:max-line-length
                this.comService.EnviarNotificacionEquipo(22, equipoTercerAlumno.id, `¡Enhorabuena! Tu equipo ${equipoTercerAlumno.Nombre} ha completado la colección de cromos en el Juego de Colección ${this.juegoSeleccionado.NombreJuego}`);
                
              }
            }, (err) => {
              console.log(err);
            });
          }, (err) => {
            console.log(err);
          });
        }, (err) => {
          console.log(err);
        });
        // tslint:disable-next-line:max-line-length
        Swal.fire('OK', 'Cromos aleatorios asignados a los  equipos de los tres mejores alumnos en el juego de puntos elegido: ', 'success');
      });
    }
  }

  AbrirDialogoConfirmacionAsignarCromo(): void {
    let cromo: Cromo;
    cromo = this.cromosColeccion.filter(res => res.id === Number(this.cromoSeleccionadoId))[0];

    Swal.fire({
      title: '¿Seguro que quieres asignar este cromo?',
      text: cromo.Nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.AsignarCromo();
      }
    });
  }

  AbrirDialogoConfirmacionAsignarCromosAleatorios(): void {
    Swal.fire({
      title: '¿Seguro que quieres asignar un sobre de cromos aleatorios?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.AsignarCromosAleatorios();
      }
    });
  }

  AbrirDialogoConfirmacionAsignarCromosAlumnoAleatorio(): void {
    Swal.fire({
      title: '¿Seguro que quieres asignar aleatoriamente un sobre de cromos aleatorios?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.AsignarAleatoriamenteCromosAleatorios();
      }
    });
  }

  AbrirDialogoConfirmacionAsignarCromosMejoresRanking() {
    Swal.fire({
      title: '¿Seguro que quieres asignar cromos a los tres mejores del ranking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.AsignarCromosMejoresRanking();
      }
    });
  }

    // Busca la imagen que tiene el nombre del cromo.Imagen y lo carga en imagenCromo
    GET_ImagenCromo() {

      if (this.cromoSeleccionado.ImagenDelante !== undefined ) {
        this.imagenDelanteCromoSeleccionado = URL.ImagenesCromo + this.cromoSeleccionado.ImagenDelante;

      }

      if (this.cromoSeleccionado.ImagenDetras !== undefined ) {
        this.imagenDetrasCromoSeleccionado = URL.ImagenesCromo + this.cromoSeleccionado.ImagenDetras;

      }
  }
  goBack() {
    this.location.back();
  }

}

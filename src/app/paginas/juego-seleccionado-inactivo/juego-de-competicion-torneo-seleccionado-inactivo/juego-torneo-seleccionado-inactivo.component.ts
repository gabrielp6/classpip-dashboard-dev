import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
// Clases
import { Alumno, Equipo, Juego, Jornada, TablaJornadas,EnfrentamientoTorneo,TablaAlumnoJuegoDeCompeticion,TablaEquipoJuegoDeCompeticion, AlumnoJuegoDeCompeticionTorneo, EquipoJuegoDeCompeticionTorneo,
          } from '../../../clases/index';

// Servicio
import { SesionService, PeticionesAPIService, CalculosService, ComServerService } from '../../../servicios/index';

// Imports para abrir diálogo y swal
import { MatDialog } from '@angular/material';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';
import { reActivarJuego } from './../../ventana-re-activar-juego/reActivarJuego';

@Component({
  selector: 'app-juego-torneo-seleccionado-inactivo',
  templateUrl: './juego-torneo-seleccionado-inactivo.component.html',
  styleUrls: ['./juego-torneo-seleccionado-inactivo.component.scss']
})
export class JuegoDeCompeticionTorneoSeleccionadoInactivoComponent implements OnInit {

 // Juego De CompeticionTorneo seleccionado
 juegoSeleccionado: Juego;
 juegosPuntos: Juego[] = [];
 juegosCuestionariosTerminados: Juego[] = [];
 juegosDeVotacionUnoATodosTerminados: any[] = [];
 jornadas: Jornada[];
 JornadasCompeticion: TablaJornadas[] = [];

 alumnosDelJuego: Alumno[];
 equiposDelJuego: Equipo[];
 alumnosDelEquipo: Alumno[];
 enfrentamientosDelJuego: Array<Array<EnfrentamientoTorneo>>;
 participantestorneo:Array<Array<string>>;
 GanadorTorneo: any;

 listaAlumnosClasificacion: TablaAlumnoJuegoDeCompeticion[] = [];
 listaEquiposClasificacion: TablaEquipoJuegoDeCompeticion[] = [];

 listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionTorneo[];
 listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionTorneo[];
 AlumnoJuegoDeCompeticionTorneo: AlumnoJuegoDeCompeticionTorneo[] = [];
 EquiposJuegoDeCompeticionTorneo: EquipoJuegoDeCompeticionTorneo[] = [];
 ctx;

  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres reactivar el ';

  // tslint:disable-next-line:no-inferrable-types
  mensajeBorrar: string = 'Estás seguro/a de que quieres borrar el ';
  // Columnas Tabla



  constructor(  public dialog: MatDialog,
                public sesion: SesionService,
                public peticionesAPI: PeticionesAPIService,
                public calculos: CalculosService,
                private location: Location,
                public comServerService: ComServerService) {}

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log(this.juegoSeleccionado);
    this.DameJornadasDelJuegoDeCompeticionSeleccionado();
  }
 async DameJornadasDelJuegoDeCompeticionSeleccionado() {
    console.log ('voy a por las jornadas');
    const inscripciones = await this.peticionesAPI.DameJornadasDeCompeticionTorneo(this.juegoSeleccionado.id)
    .toPromise();
        this.jornadas = inscripciones;
        console.log('Las jornadas son: ');
        console.log(this.jornadas);
        console.log('Vamos a por los enfrentamientos de cada jornada');
        this.DameEnfrentamientosDelJuego();
        
        
     
      
  }

 async DameEnfrentamientosDelJuego() {
    console.log('Estoy en DameEnfrentamientosDeLasJornadas()');
    let jornadasCounter = 0;
    this.enfrentamientosDelJuego = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.jornadas.length; i++) {
      console.log ('siguiente jornada');
      this.enfrentamientosDelJuego[i] = [];
      const enfrentamientosDeLaJornada = await this.peticionesAPI.DameEnfrentamientosDeCadaJornadaTorneo(this.jornadas[i].id)
      .toPromise();
        jornadasCounter++;
        console.log('Los enfrentamiendos de la jornadaId ' + this.jornadas[i].id + ' son: ');
        console.log(enfrentamientosDeLaJornada);
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < enfrentamientosDeLaJornada.length; j++) {
          this.enfrentamientosDelJuego[i][j] = new EnfrentamientoTorneo();
          this.enfrentamientosDelJuego[i][j] = enfrentamientosDeLaJornada[j];
        }
        if (jornadasCounter === this.jornadas.length) {
          console.log('La lista final de enfrentamientos del juego es: ');
          console.log(this.enfrentamientosDelJuego);
        
          
          if (this.juegoSeleccionado.Modo === 'Individual') {
            this.AlumnosDelJuego();
          } else {
            this.EquiposDelJuego();
          }
          
          
        }
        
      
    }
  }
  DameNombresDeLosEnfrentamientos() {
    console.log ('voy a por los nombres de los participantes');
    let enfrentamientosjornada: Array<Array<number>>;
    enfrentamientosjornada= [];
    this.participantestorneo= [];
    let rondas: number =this.enfrentamientosDelJuego.length;
    let rondafinal: number;
    rondafinal=rondas-1;
    console.log ('num jornadas: '+this.enfrentamientosDelJuego.length);
    
    for (let i = 0; i < this.enfrentamientosDelJuego.length; i++) {
      if (this.enfrentamientosDelJuego[i].length !== 0) {
        
            enfrentamientosjornada[i] = [];
        for (let a = 0, j=0; j < this.enfrentamientosDelJuego[i].length; a=a+2,j++) {
            
           // console.log ('enfrenta:  ' + enfrentamientosjornada[i][a]);
            enfrentamientosjornada[i][a]=this.enfrentamientosDelJuego[i][j].JugadorUno;
            enfrentamientosjornada[i][a+1]=this.enfrentamientosDelJuego[i][j].JugadorDos;
            console.log ('e1:  ' + enfrentamientosjornada[i][a] + enfrentamientosjornada[i][a+1]);
        }
        console.log ('prueba enfrentamientos  ' + enfrentamientosjornada[i]);
        console.log ('alumnos enfrentamientos  ' + this.alumnosDelJuego);
        console.log ('equipos enfrentamientos  ' + this.equiposDelJuego);
      
        this.participantestorneo[i] = [];
      for (let a = 0; a < enfrentamientosjornada[i].length; a++) {
          
          if (enfrentamientosjornada[i][a] !== 0) {
            if (this.juegoSeleccionado.Modo === 'Individual') {
              
              const alumno = this.alumnosDelJuego.filter (alumno => alumno.id === Number(enfrentamientosjornada[i][a]))[0];
              console.log ('alumno encontrado:  ' + alumno.Nombre);
              this.participantestorneo[i].push(alumno.Nombre + alumno.PrimerApellido);
            } else {
              const equipo = this.equiposDelJuego.filter (equipo => equipo.id === Number(enfrentamientosjornada[i][a]))[0];
              console.log ('equipo encontrado' + equipo);
              this.participantestorneo[i].push(equipo.Nombre);
            }
          } else{
            this.participantestorneo[i].push(undefined);
            
          }
    }
  }
}
if (this.enfrentamientosDelJuego[rondafinal]!== undefined) {
  if (this.enfrentamientosDelJuego[rondafinal][0].Ganador!== undefined) {
  this.DameNombreGanador();
  }
  }
  //console.log ('finales' +  this.participantestorneo[1][0].Nombre);
}
DameNombreGanador() {
  console.log ('voy a por el nombre del ganador');
  let rondas: number =this.enfrentamientosDelJuego.length;
  let rondafinal: number;
  rondafinal=rondas-1;
  let idganador: number;
  console.log ('numRondas: '+ rondafinal);
  if (this.enfrentamientosDelJuego[rondafinal][0] !== undefined) {
    if (this.enfrentamientosDelJuego[rondafinal][0].Ganador!== undefined) {
      idganador = this.enfrentamientosDelJuego[rondafinal][0].Ganador;
      console.log ('idganador: '+ idganador);
      if (this.juegoSeleccionado.Modo === 'Individual') {
      const alumno = this.alumnosDelJuego.filter (alumno => alumno.id === Number(idganador))[0];
      console.log ('alumnoganador: '+ alumno);
      this.GanadorTorneo= alumno.Nombre + ' ' + alumno.PrimerApellido;
      } else{
        const equipo = this.equiposDelJuego.filter (equipo => equipo.id === Number(idganador))[0];
      console.log ('equipoganador: '+ equipo);
      this.GanadorTorneo= equipo.Nombre;
      }
    }
  }
    console.log ('GANADOR: '+   this.GanadorTorneo);
}
async AlumnosDelJuego() {
  console.log ('Vamos a por los alumnos');
  console.log('Id juegoSeleccionado: ' + this.juegoSeleccionado.id);
  const alumnosJuego = await this.peticionesAPI.DameAlumnosJuegoDeCompeticionTorneo(this.juegoSeleccionado.id)
  .toPromise();
  console.log ('Ya tengo los alumnos: ' );
  console.log (alumnosJuego);
  this.alumnosDelJuego = alumnosJuego;
  this.DameNombresDeLosEnfrentamientos();
   // this.RecuperarInscripcionesAlumnoJuego();

  
}
async EquiposDelJuego() {
  console.log ('Vamos a por los equipos');
  console.log('Id juegoSeleccionado: ' + this.juegoSeleccionado.id);
  const equiposJuego = await this.peticionesAPI.DameEquiposJuegoDeCompeticionTorneo(this.juegoSeleccionado.id)
  .toPromise();

  console.log ('ya tengo los equipos');
  console.log (equiposJuego);
  this.equiposDelJuego = equiposJuego;
  //this.RecuperarInscripcionesEquiposJuego();
  this.DameNombresDeLosEnfrentamientos();
  
}

  AlumnosDelEquipo(equipo: Equipo) {
    console.log(equipo);

    this.peticionesAPI.DameAlumnosEquipo (equipo.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.alumnosDelEquipo = res;
        console.log('Los alumnos del equipo ' + equipo.id + ' son: ');
        console.log(res);
      } else {
        console.log('No hay alumnos en este equipo');
        // Informar al usuario
        this.alumnosDelEquipo = undefined;
      }
    });
  }
  Informacion(): void {

    console.log ('Aquí estará la información del juego');
    console.log ('Voy a por la información del juego seleccionado');
    this.sesion.TomaJuego (this.juegoSeleccionado);
    console.log('Tomo las jornadas' + this.jornadas);
    console.log('Los enfrentamientos del juego son: ');
    console.log(this.enfrentamientosDelJuego);
    this.JornadasCompeticion = this.calculos.GenerarTablaJornadasTorneo(this.juegoSeleccionado, this.jornadas, this.enfrentamientosDelJuego);
    console.log('Las tablas JornadasCompeticionTorneo son: ');
    console.log(this.JornadasCompeticion);
    console.log ('Voy a por la información de las jornadas del juego');
    this.sesion.TomaDatosJornadas(this.jornadas,this.JornadasCompeticion);
    this.sesion.TomaAlumnoJuegoDeCompeticionTorneo(this.alumnosDelJuego);
    this.sesion.TomaEquipoJuegoDeCompeticionTorneo(this.equiposDelJuego);
  
  }
  ReactivarJuego() {
    reActivarJuego().then((result) => {
      if (result.value) {

        this.juegoSeleccionado.JuegoActivo = true;
        this.peticionesAPI.CambiaEstadoJuegoDeCompeticionTorneo (this.juegoSeleccionado)
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

  AbrirDialogoConfirmacionReactivar(): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: this.juegoSeleccionado.Tipo,
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.ReactivarJuego();
        Swal.fire('Reactivado', this.juegoSeleccionado.Tipo + ' reactivado correctamente', 'success');
      }
    });
  }
  
  EliminarJuego() {
    Swal.fire({
      title: '¿Seguro que quieres eliminar el juego?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then( async (result) => {
      if (result.value) {
        await this.calculos.EliminarJuegoDeCompeticionTorneo(this.juegoSeleccionado);
        Swal.fire('El juego se ha eliminado correctamente');
        this.location.back();
      }
    });
  }

  AbrirDialogoConfirmacionEliminar(): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensajeBorrar,
        nombre: this.juegoSeleccionado.Tipo,
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.EliminarJuego();
        Swal.fire('Eliminado', this.juegoSeleccionado.Tipo + ' eliminado correctamente', 'success');

      }
    });
  }
  goBack() {
    this.location.back();
  }



}

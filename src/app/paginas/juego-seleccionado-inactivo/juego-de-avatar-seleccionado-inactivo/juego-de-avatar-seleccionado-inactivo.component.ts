import { Component, OnInit } from '@angular/core';
import { SesionService, PeticionesAPIService, CalculosService, ComServerService } from '../../../servicios/index';
import Swal from 'sweetalert2';
import { Juego, Alumno, AlumnoJuegoDeAvatar } from 'src/app/clases';
import { Location } from '@angular/common';
import { reActivarJuego } from './../../ventana-re-activar-juego/reActivarJuego';

@Component({
  selector: 'app-juego-de-avatar-seleccionado-inactivo',
  templateUrl: './juego-de-avatar-seleccionado-inactivo.component.html',
  styleUrls: ['./juego-de-avatar-seleccionado-inactivo.component.scss']
})
export class JuegoDeAvatarSeleccionadoInactivoComponent implements OnInit {

  juegoSeleccionado: Juego;
  alumnosDelJuego: Alumno[];
  inscripcionesAlumnosJuegodeAvatar: AlumnoJuegoDeAvatar[];

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
      this.AlumnosDelJuego();
    } else {
      console.log ('aun no funciona la modalidad por equipos');
    }

  }


  // Recupera los alumnos que pertenecen al juego
  AlumnosDelJuego() {
    console.log ('Vamos a pos los alumnos');
    this.peticionesAPI.DameAlumnosJuegoDeAvatar(this.juegoSeleccionado.id)
    .subscribe(alumnosJuego => {
      console.log ('Ya tengo los alumnos');
      console.log(alumnosJuego);
      this.alumnosDelJuego = alumnosJuego;
      this.RecuperarInscripcionesAlumnoJuego();
    });
}


RecuperarInscripcionesAlumnoJuego() {
  this.peticionesAPI.DameInscripcionesAlumnoJuegoDeAvatar(this.juegoSeleccionado.id)
  .subscribe(inscripciones => {
    this.inscripcionesAlumnosJuegodeAvatar = inscripciones;
  });
}


Eliminar(): void {

  Swal.fire({
    title: 'Confirma que quieres eliminar el juego <b>' + this.juegoSeleccionado.NombreJuego + '</b>',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
  }).then(async (result) => {
    if (result.value) {
      await this.calculos.EliminarJuegoDeAvatar(this.juegoSeleccionado);
      Swal.fire('El juego ha sido eliminado correctamente', ' ', 'success');
      this.location.back();
    }
  });
}


  Reactivar() {
    reActivarJuego().then((result) => {
      if (result.value) {

        this.juegoSeleccionado.JuegoActivo = true;
        this.peticionesAPI.CambiaEstadoJuegoDeAvatar (this.juegoSeleccionado)
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

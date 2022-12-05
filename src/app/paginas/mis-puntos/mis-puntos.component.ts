import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


// Imports para abrir diálogo confirmar eliminar equipo
import { MatDialog, MatTabGroup } from '@angular/material';
import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';

// Servicios
import { PeticionesAPIService, SesionService } from '../../servicios/index';

// Clases
import { Punto, Insignia } from '../../clases/index';

@Component({
  selector: 'app-mis-puntos',
  templateUrl: './mis-puntos.component.html',
  styleUrls: ['./mis-puntos.component.scss']
})
export class MisPuntosComponent implements OnInit {

  profesorId: number;


  tiposPuntos: Punto[];
  insignias: Insignia[];

  imagenInsignia: string;


  // PARA DIÁLOGO DE CONFIRMACIÓN
  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres eliminar el equipo llamado: ';

  constructor(
    private route: ActivatedRoute,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    public dialog: MatDialog) { }

  ngOnInit() {

    // REALMENTE LA APP FUNCIONARÁ COGIENDO AL PROFESOR DEL SERVICIO, NO OBSTANTE AHORA LO RECOGEMOS DE LA URL
    // this.profesorId = this.profesorService.RecibirProfesorIdDelServicio();
    this.profesorId = Number (this.route.snapshot.paramMap.get('id'));

    console.log(this.profesorId);

    this.PuntosDelProfesor();

    this.InsigniasDelProfesor();


  }

  ////////////////////////////////////////////// PARA PUNTOS ////////////////////////////////////////////////
  PuntosDelProfesor() {

    this.peticionesAPI.DameTiposDePuntos(this.profesorId)
    .subscribe(puntos => {
      if (puntos[0] !== undefined) {
        console.log('Voy a dar la lista');
        this.tiposPuntos = puntos;
        //console.log(this.puntosProfesor);
        //this.profesorService.EnviarProfesorIdAlServicio(this.profesorId);
      } else {
        this.tiposPuntos = undefined;
      }

    });
  }

  // Una vez seleccionado un punto, lo podemos editar o eliminar. Esta función se activará si clicamos en editar.
  // Envía el punto específico al componente editar-punto
  EnviarTipoPuntoEditar(punto: Punto) {
    console.log('voy a enviar');
    this.sesion.TomaTipoPunto(punto);
    console.log(punto.Nombre);

  }

  // Si queremos borrar un equipo, antes nos saldrá un aviso para confirmar la acción como medida de seguridad. Esto se
  // hará mediante un diálogo al cual pasaremos el mensaje y el nombre del equipo
  AbrirDialogoConfirmacionBorrarPunto(punto: Punto): void {




    Swal.fire({
      title: 'Eliminar',
      text: "Estas segura/o de que quieres eliminar el equipo llamado: " +punto.Nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'

    }).then((result) => {
      if (result.value) {
        this.BorrarPunto(punto);
        Swal.fire('Eliminado', punto.Nombre + ' eliminado correctamente', 'success');

      }
    })
  }


  // Utilizamos esta función para eliminar un punto de la base de datos y actualiza la lista de puntos
  BorrarPunto(punto: Punto) {
    this.peticionesAPI.BorraTipoDePunto(punto.id, punto.profesorId)
    .subscribe(() => this.tiposPuntos = this.tiposPuntos.filter(res => res.id !== punto.id)
    );
  }



    ////////////////////////////////////////////// PARA INSIGNIAS ////////////////////////////////////////////////
    InsigniasDelProfesor() {

      this.peticionesAPI.DameInsignias(this.profesorId)
      .subscribe(insignas => {
        if (insignas[0] !== undefined) {
          console.log('Voy a dar la lista');
          this.insignias = insignas;
        } else {
          this.insignias = undefined;
        }

      });
    }


    // Lo mismo que con el punto
     EnviarInsigniaEditar(insigna: Insignia) {
      console.log('voy a enviar');
      this.sesion.TomaInsignia(insigna);
      console.log(insigna.Nombre);
    }

    // Lo mismo que con el punto
    AbrirDialogoConfirmacionBorrarInsignia(insigna: Insignia): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: insigna.Nombre,
      }
    });

    // Antes de cerrar recogeremos el resultado del diálogo: Borrar (true) o cancelar (false). Si confirmamos, borraremos
    // el punto (función BorrarPunto) y mostraremos un swal con el mensaje de que se ha eliminado correctamente.
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.BorrarInsignia(insigna);
        Swal.fire('Eliminada', insigna.Nombre + ' eliminada correctamente', 'success');
      }
    });
  }

    // Utilizamos esta función para eliminar una insignia de la base de datos y de la lista de añadidos recientemente
    BorrarInsignia(insignas: Insignia) {
      this.peticionesAPI.BorraInsignia(insignas.id, insignas.profesorId)
      .subscribe(() => this.insignias = this.insignias.filter(res => res.id !== insignas.id)
      );
    }


  ImagenDelaInsignia(insigna: Insignia) {

    console.log('entro a buscar insignia y foto');
    console.log(insigna.Imagen);
    // Si la insignia tiene una foto (recordemos que la foto no es obligatoria)
    if (insigna.Imagen !== undefined) {

      // Busca en la base de datos la imágen con el nombre registrado en insingnia.Imagen y la recupera
      this.peticionesAPI.DameImagenInsignia (insigna.Imagen)
      .subscribe(response => {
        const blob = new Blob([response.blob()], { type: 'image/jpg'});

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          this.imagenInsignia = reader.result.toString();
        }, false);

        if (blob) {
          reader.readAsDataURL(blob);
        }
      });

      // Sino la imagenInsignia será undefined para que no nos pinte la foto de otra insignia préviamente seleccionado
    } else {
      this.imagenInsignia = undefined;
    }
  }

}

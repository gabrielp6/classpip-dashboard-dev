import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

// Servicios
import { PeticionesAPIService, SesionService} from '../../../servicios/index';

// Clases
import { Insignia} from '../../../clases/index';

@Component({
  selector: 'app-editar-insignia',
  templateUrl: './editar-insignia.component.html',
  styleUrls: ['./editar-insignia.component.scss']
})
export class EditarInsigniaComponent implements OnInit {

  insignia: Insignia;
  nombreInsignia: string;
  descripcionInsignia: string;

  // Imagen insignia
  nombreImagen: string;
  imagenInsignia: string;
  file: File;

  // tslint:disable-next-line:ban-types
  imagenCambiada: Boolean = false;


  // tslint:disable-next-line:no-shadowed-variable
  constructor(  private location: Location,
                private sesion: SesionService,
                private peticionesAPI: PeticionesAPIService ) { }

  ngOnInit() {
    this.insignia = this.sesion.DameInsignia();
    this.nombreInsignia = this.insignia.Nombre;
    this.descripcionInsignia = this.insignia.Descripcion;
    // Cargo el logo
    this.GET_Imagen();
  }

  EditarInsignia() {
    console.log('Entro a editar');
    this.insignia.Nombre = this.nombreImagen;
    this.insignia.Descripcion = this.descripcionInsignia;
    this.insignia.Imagen = this.imagenInsignia;

    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.ModificaInsignia(new Insignia(this.nombreInsignia, this.descripcionInsignia, this.nombreImagen), this.insignia.profesorId, this.insignia.id)
    .subscribe((res) => {
      if (res != null) {
        console.log('Voy a editar la insignia con id ' + this.insignia.id);
        this.insignia = res;

        if (this.imagenCambiada === true) {
          // HACEMOS EL POST DE LA NUEVA IMAGEN EN LA BASE DE DATOS
          const formData: FormData = new FormData();
          formData.append(this.nombreImagen, this.file);
          this.peticionesAPI.PonImagenInsignia(formData)
          .subscribe(() => console.log('Logo cargado'));
        }

      } else {
        console.log('fallo editando');
      }
    });
    this.goBack();
  }

  // Busca el logo que tiene el nombre del equipo.FotoEquipo y lo carga en imagenLogo
  GET_Imagen() {

    if (this.insignia.Imagen !== undefined ) {
      // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
      this.peticionesAPI.DameImagenInsignia (this.insignia.Imagen)
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

    }
  }
  // AL CLICAR EN AGREGAR LOGO NOS ACTIVARÁ LA FUNCIÓN MOSTRAR DE ABAJO
  ActivarInput() {
    console.log('Activar input');
    document.getElementById('input').click();
  }


  // Seleccionamos una foto y guarda el nombre de la foto en la variable logo
  Mostrar($event) {
    this.file = $event.target.files[0];

    console.log('fichero ' + this.file.name);
    this.nombreImagen = this.file.name;

    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      console.log('ya');
      this.imagenCambiada = true;
      this.imagenInsignia = reader.result.toString();
    };
  }

  goBack() {
    this.location.back();
  }

}

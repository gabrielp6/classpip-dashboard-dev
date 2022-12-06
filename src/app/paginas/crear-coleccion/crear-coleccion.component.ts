import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Imports para abrir diálogo confirmar eliminar equipo
import { MatDialog, MatTabGroup } from '@angular/material';



// Servicios
import { SesionService, PeticionesAPIService, CalculosService } from '../../servicios/index';

// Clases
import { Coleccion, Cromo } from '../../clases/index';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import 'rxjs';

import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { Observable} from 'rxjs';
import Swal from 'sweetalert2';

export interface OpcionSeleccionada {
  nombre: string;
  id: string;
}

@Component({
  selector: 'app-crear-coleccion',
  templateUrl: './crear-coleccion.component.html',
  styleUrls: ['./crear-coleccion.component.scss']
})
export class CrearColeccionComponent implements OnInit {

  // Para el paso finalizar limpiar las variables y volver al mat-tab de "Lista de equipos"
  @ViewChild('stepper', {static: false}) stepper;
  @ViewChild('tabs', {static: false}) tabGroup: MatTabGroup;
  myForm: FormGroup;
  myForm2: FormGroup;


  // CREAR COLECCION
  imagenColeccion: string;
  coleccionCreada: Coleccion;
  nombreColeccion: string;

  // CREAR CROMO
  nombreCromo: string;
  probabilidadCromo: string;
  nivelCromo: string;
  imagenCromoDelante: string;
  imagenCromoDetras: string;
  cromosAgregados: Cromo [] = [];
  // tslint:disable-next-line:ban-types
  isDisabledCromo: Boolean = true;

  // COMPARTIDO
  profesorId: number;
  nombreImagen: string;
  file: File;

  nombreImagenCromoDelante: string;
  nombreImagenCromoDetras: string;
  fileCromoDelante: File;
  fileCromoDetras: File;

  // Al principio coleccion no creada y imagen no cargada
  // tslint:disable-next-line:ban-types
  coleccionYaCreada: Boolean = false;
  // tslint:disable-next-line:ban-types
  imagenCargado: Boolean = false;
  // tslint:disable-next-line:ban-types
  imagenCargadoCromo: Boolean = false;

  // tslint:disable-next-line:ban-types
  finalizar: Boolean = false;

  dosCaras;
  infoColeccion;
  ficherosColeccion;
  coleccion;
  advertencia = true;

    // Opciones para mostrar en la lista desplegable para seleccionar el tipo de probabilidad que listar
    opcionesProbabilidad: OpcionSeleccionada[] = [
      {nombre: 'Muy Baja', id: 'Muy Baja'},
      {nombre: 'Baja', id: 'Baja'},
      {nombre: 'Media', id: 'Media'},
      {nombre: 'Alta', id: 'Alta'},
      {nombre: 'Muy Alta', id: 'Muy Alta'},

    ];

    // opcionSeleccionadaProbabilidad: string;

      // Opciones para mostrar en la lista desplegable para seleccionar el tipo de nivel que listar
    opcionesNivel: OpcionSeleccionada[] = [
        {nombre: 'Diamante', id: 'Diamante'},
        {nombre: 'Platino', id: 'Platino'},
        {nombre: 'Oro', id: 'Oro'},
        {nombre: 'Plata', id: 'Plata'},
        {nombre: 'Bronce', id: 'Bronce'},
    ];
    opcionSeleccionadaNivel: string;


  // PONEMOS LAS COLUMNAS DE LA TABLA Y LA LISTA QUE TENDRÁ LA INFORMACIÓN QUE QUEREMOS MOSTRAR
  displayedColumns: string[] = ['nombreCromo', 'probabilidadCromo', 'nivelCromo', ' '];

  ficherosRepetidos: string[];
  errorFicheros = false;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public sesion: SesionService,
    public peticionesAPI: PeticionesAPIService,
    public calculos: CalculosService,
    public location: Location,
    private formBuilder: FormBuilder) { }

  ngOnInit() {

    // REALMENTE LA APP FUNCIONARÁ COGIENDO AL PROFESOR DEL SERVICIO, NO OBSTANTE AHORA LO RECOGEMOS DE LA URL
    // this.profesorId = this.profesorService.RecibirProfesorIdDelServicio();
    this.profesorId = this.sesion.DameProfesor().id;


    // Constructor myForm
    this.myForm = this.formBuilder.group({
     nombreColeccion: ['', Validators.required]
    });
    this.myForm2 = this.formBuilder.group({
      nombreCromo : ['', Validators.required]
     });
  }

  pr() {
    console.log('hoo');
  }
  // Creamos una coleccion dandole un nombre y una imagen
  CrearColeccion() {

    let nombreColeccion: string;

    nombreColeccion = this.myForm.value.nombreColeccion;

    console.log('Entro a crear la coleccion ' + nombreColeccion);
    console.log(this.nombreImagen);


    this.peticionesAPI.CreaColeccion (new Coleccion(nombreColeccion, this.nombreImagen, this.dosCaras), this.profesorId)
    // this.peticionesAPI.CreaColeccion(new Coleccion(nombreColeccion, this.nombreImagen), this.profesorId)
    .subscribe((res) => {
      if (res != null) {
        console.log ('COLECCION CREADA: ' + res.id );
        console.log(res);
        this.coleccionYaCreada = true; // Si tiro atrás y cambio algo se hará un PUT y no otro POST
        this.coleccionCreada = res; // Lo metemos en coleccionCreada, y no en coleccion!!
        // Hago el POST de la imagen SOLO si hay algo cargado. Ese boolean se cambiará en la función ExaminarImagen
        if (this.imagenCargado === true) {

          // Hacemos el POST de la nueva imagen en la base de datos recogida de la función ExaminarImagen
          const formData: FormData = new FormData();
          formData.append(this.nombreImagen, this.file);
          this.peticionesAPI.PonImagenColeccion(formData)
          .subscribe(() => console.log('Imagen cargado'));
        }
        console.log ('He creado la colección ' + this.coleccionCreada.id);

      } else {
        console.log('Fallo en la creación');
      }
    });
  }

  // Si estamos creando la coleccion y pasamos al siguiente paso, pero volvemos hacia atrás para modificar el nombre y/o el
  // imagen, entonces no deberemos hacer un POST al darle a siguiente, sino un PUT. Por eso se hace esta función, que funciona
  // de igual manera que la de Crear Equipo pero haciendo un PUT.
  EditarColeccion() {

    console.log('Entro a editar');
    let nombreColeccion: string;

    nombreColeccion = this.myForm.value.nombreColeccion;

    this.peticionesAPI.ModificaColeccion(new Coleccion(nombreColeccion, this.nombreImagen), this.profesorId, this.coleccionCreada.id)
    .subscribe((res) => {
      if (res != null) {
        console.log('Voy a editar la coleccion con id ' + this.coleccionCreada.id);
        this.coleccionCreada = res;

        // Hago el POST de la imagen SOLO si hay algo cargado
        if (this.imagenCargado === true) {
          // HACEMOS EL POST DE LA NUEVA IMAGEN EN LA BASE DE DATOS
          const formData: FormData = new FormData();
          formData.append(this.nombreImagen, this.file);
          this.peticionesAPI.PonImagenColeccion(formData)
          .subscribe(() => console.log('Imagen cargada'));
        }

      } else {
        console.log('fallo editando');
      }
    });
  }

  // Creamos una cromo y lo añadimos a la coleccion dandole un nombre, una probabilidad, un nivel y una imagen
  AgregarCromoColeccion() {

    console.log('Entro a asignar el cromo ' + this.nombreCromo);
    console.log('Entro a asignar el cromo a la coleccionID' + this.coleccionCreada.id);
    console.log(this.nombreImagenCromoDelante );
    console.log(this.nombreImagenCromoDetras );

    this.peticionesAPI.PonCromoColeccion(
      // tslint:disable-next-line:max-line-length
      new Cromo(this.nombreCromo , this.probabilidadCromo, this.nivelCromo, this.nombreImagenCromoDelante, this.nombreImagenCromoDetras), this.coleccionCreada.id)
      .subscribe((res) => {
        if (res != null) {
          console.log('asignado correctamente');
          // Añadimos el cromo a la lista
          this.cromosAgregados.push(res);
          this.cromosAgregados = this.cromosAgregados.filter(result => result.Nombre !== '');
          // this.CromosAgregados(res);

          // Hago el POST de la imagen de delante SOLO si hay algo cargado.
          if (this.imagenCromoDelante !== undefined) {

            // Hacemos el POST de la nueva imagen en la base de datos recogida de la función ExaminarImagenCromo
            const formData: FormData = new FormData();
            formData.append(this.nombreImagenCromoDelante, this.fileCromoDelante);
            this.peticionesAPI.PonImagenCromo(formData)
            .subscribe(() => console.log('Imagen cargado'));
          }

          // Hago el POST de la imagen de detras SOLO si hay algo cargado.
          if (this.imagenCromoDetras !== undefined) {

            // Hacemos el POST de la nueva imagen en la base de datos recogida de la función ExaminarImagenCromo
            const formData: FormData = new FormData();
            formData.append(this.nombreImagenCromoDetras, this.fileCromoDetras);
            this.peticionesAPI.PonImagenCromo(formData)
            .subscribe(() => console.log('Imagen cargado'));
          }

          this.LimpiarCampos();
        } else {
          console.log('fallo en la asignación');
        }
      });
  }


  // Utilizamos esta función para eliminar un cromo de la base de datos y de la lista de añadidos recientemente
  BorrarCromo(cromo: Cromo) {
    console.log('Id cromo ' + this.coleccionCreada.id);
    this.peticionesAPI.BorrarCromo(cromo.id)
    .subscribe(() => {
      // Elimino el cromo de la lista
      this.cromosAgregados = this.cromosAgregados.filter(res => res.id !== cromo.id);
     // this.CromosEliminados(cromo);
      console.log('Cromo borrado correctamente');

    });
    this.peticionesAPI.BorrarImagenCromo (cromo.ImagenDelante).subscribe();
    if (cromo.ImagenDetras !== undefined) {
      this.peticionesAPI.BorrarImagenCromo (cromo.ImagenDetras).subscribe();
    }
  }

  // Activa la función ExaminarImagenColeccion
  ActivarInputColeccion() {
    console.log('Activar input');
    document.getElementById('inputColeccion').click();
  }

  // Activa la función ExaminarImagenCromoDelante
  ActivarInputCromoDelante() {
    console.log('Activar input');
    document.getElementById('inputCromoDelante').click();
  }

    // Activa la función ExaminarImagenCromoDetras
  ActivarInputCromoDetras() {
      console.log('Activar input');
      document.getElementById('inputCromoDetras').click();
  }


  // Buscaremos la imagen en nuestro ordenador y después se mostrará en el form con la variable "imagen" y guarda el
  // nombre de la foto en la variable nombreImagen
  ExaminarImagenColeccion($event) {
    this.file = $event.target.files[0];
    console.log('fichero ' + this.file.name);
    this.nombreImagen = this.file.name;
   // this.nombreImagenCromo = this.file.name;

    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {

      console.log('ya he cargado la imagen de la coleccion');
      this.imagenCargado = true;
      this.imagenColeccion = reader.result.toString();
    };
  }

  ExaminarImagenCromoDelante($event) {
    this.fileCromoDelante = $event.target.files[0];

    console.log('fichero ' + this.fileCromoDelante.name);
    this.nombreImagenCromoDelante = this.fileCromoDelante.name;

    const reader = new FileReader();
    reader.readAsDataURL(this.fileCromoDelante);
    reader.onload = () => {
      console.log('ya Cromo');
      // this.imagenCargadoCromo = true;
      this.imagenCromoDelante = reader.result.toString();
    };
  }

  ExaminarImagenCromoDetras($event) {
    this.fileCromoDetras = $event.target.files[0];

    console.log('fichero ' + this.fileCromoDetras.name);
    this.nombreImagenCromoDetras = this.fileCromoDetras.name;

    const reader = new FileReader();
    reader.readAsDataURL(this.fileCromoDetras);
    reader.onload = () => {
      console.log('ya Cromo');
      // this.imagenCargadoCromo = true;
      this.imagenCromoDetras = reader.result.toString();
    };
  }



  OpcionNivelSeleccionado() {
    console.log('AAAAA' + this.opcionSeleccionadaNivel);
    // Opcion selecionada para nivel
    if (this.opcionSeleccionadaNivel === 'Diamante') {
      this.nivelCromo = 'Diamante';
      this.probabilidadCromo = 'Muy Baja';
     // this.opcionSeleccionadaProbabilidad = 'Muy Baja';

    }
    if (this.opcionSeleccionadaNivel === 'Platino') {
      this.nivelCromo = 'Platino';
      this.probabilidadCromo = 'Baja';
     // this.opcionSeleccionadaProbabilidad = 'Baja';
    }

    if (this.opcionSeleccionadaNivel === 'Oro') {
      this.nivelCromo = 'Oro';
      this.probabilidadCromo = 'Media';
     // this.opcionSeleccionadaProbabilidad = 'Media';
    }

    if (this.opcionSeleccionadaNivel === 'Plata') {
      this.nivelCromo = 'Plata';
      this.probabilidadCromo = 'Alta';
      // this.opcionSeleccionadaProbabilidad = 'Alta';
    }

    if (this.opcionSeleccionadaNivel === 'Bronce') {
      this.nivelCromo = 'Bronce';
      this.probabilidadCromo = 'Muy Alta';
      // this.opcionSeleccionadaProbabilidad = 'Muy Alta';
    }
  }

  // Limpiamos los campos del cromo
  LimpiarCampos() {
      this.nombreCromo = undefined;
      this.probabilidadCromo = undefined;
      this.nivelCromo = null;
      this.isDisabledCromo = true;
      this.imagenCargadoCromo = false;
      this.imagenCromoDelante = undefined;
      this.nombreImagenCromoDelante = undefined;
      this.imagenCromoDetras = undefined;
      this.nombreImagenCromoDetras = undefined;
     // this.opcionSeleccionadaProbabilidad = null;
      this.opcionSeleccionadaNivel = null;
  }

  // Esta función se utiliza para controlar si el botón de siguiente del stepper esta desativado.
  // Si en alguno de los inputs no hay nada, esta disabled. Sino, podremos clicar.
  Disabled() {

  if (this.nombreCromo === undefined || this.probabilidadCromo === undefined || this.nivelCromo === undefined ||
        this.nivelCromo === '' || this.probabilidadCromo === '' || this.nivelCromo === null) {
        this.isDisabledCromo = true;
  } else {
        this.isDisabledCromo = false;
    }
  }
    // Función que se activará al clicar en finalizar el último paso del stepper
  Finalizar() {
      // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
      this.myForm.reset();
      this.myForm2.reset();
      this.stepper.reset();

      // Tambien limpiamos las variables utilizadas para crear el nueva coleccion, por si queremos crear otra.
      this.coleccionYaCreada = false;
      this.imagenCargado = false;
      this.imagenColeccion = undefined;
      this.imagenCargadoCromo = false;
      this.imagenCromoDelante = undefined;
      this.imagenCromoDetras = undefined;
      this.coleccionCreada = undefined;
      this.dosCaras = undefined;
      this.cromosAgregados = [];
      this.finalizar = true;
      Swal.fire('Coleccion creada con éxito', '', 'success');
      this.router.navigate(['/inicio/' + this.profesorId]);


  }

  canExit(): Observable <boolean> {
    if (!this.coleccionYaCreada || this.finalizar) {
      return of (true);
    } else {
      const confirmacionObservable = new Observable <boolean>( obs => {

        Swal.fire({
          title: '¿Seguro que quieres salir?',
          text: 'No has completado el proceso de creación de la colección',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, estoy seguro',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.value) {
             // Si confirma que quiere salir entonces eliminamos el grupo que se ha creado
              // this.sesion.TomaGrupo (this.grupo);
              // this.calculos.EliminarGrupo();
              this.BorrarColeccion (this.coleccionCreada).subscribe ( () => obs.next (true));
          } else {
            obs.next (false);
          }
        });
      });
      return confirmacionObservable;
    }
  }

  // Utilizamos esta función para eliminar una colección de la base de datos y actualiza la lista de colecciones
  // Retornamos un observable para que el que la llame espere hasta que se haya completado la eliminación
  // en la base de datos.
  BorrarColeccion(coleccion: Coleccion): any {
    const eliminaObservable = new Observable ( obs => {


        this.peticionesAPI.BorraColeccion(coleccion.id, coleccion.profesorId)
        .subscribe( () => { console.log ('Ya he borrado la coleccion');
                            this.peticionesAPI.BorrarImagenColeccion(coleccion.ImagenColeccion).subscribe();
                            for (let i = 0; i < (this.cromosAgregados.length); i++) {
                                this.peticionesAPI.BorrarCromo (this.cromosAgregados[i].id).subscribe();
                                this.peticionesAPI.BorrarImagenCromo(this.cromosAgregados[i].ImagenDelante).subscribe();
                                if (this.cromosAgregados[i].ImagenDetras !== undefined) {
                                  this.peticionesAPI.BorrarImagenCromo(this.cromosAgregados[i].ImagenDetras).subscribe();
                                }
                            }
                            obs.next();
        });
    });
    return eliminaObservable;
  }

  RegistraNumeroDeCaras() {
    const radio = document.getElementsByName('caras')[0] as HTMLInputElement;
    if (radio.checked ) {
      this.dosCaras = false;
    } else {
      this.dosCaras = true;
    }
    this.CrearColeccion();
  }

   // Activa la función SeleccionarInfoColeccion
  ActivarInputInfo() {
    console.log('Activar input');
    document.getElementById('inputInfo').click();
  }

  // Par abuscar el fichero JSON que contiene la info de la colección que se va
  // a cargar desde ficheros
  SeleccionarInfoColeccion($event) {
    const fileInfo = $event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(fileInfo, 'ISO-8859-1');
    reader.onload = () => {
      try {
        this.infoColeccion = JSON.parse(reader.result.toString());
        this.calculos.VerificarFicherosColeccion (this.infoColeccion)
        .subscribe (lista => {
          if (lista.length === 0) {
            Swal.fire({
              title: 'Selecciona ahora las imagenes de los cromos',
              text: 'Selecciona todos los ficheros de la carpeta imagenes',
              icon: 'success',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Selecciona'
            }).then((result) => {
              if (result.value) {
                // Activamos la función SeleccionarFicherosCromos
                document.getElementById('inputCromos').click();
              }
            });
          } else {
            this.ficherosRepetidos = lista;
            this.errorFicheros = true;
          }
        });
      } catch (e) {
        Swal.fire('Error en el formato del fichero', '', 'error');
      }
    };
  }

  SeleccionarFicherosCromos($event) {
    this.ficherosColeccion = Array.from($event.target.files);
    // Ya tenemos todos los ficheros de las imagenes
    // Hay que confirmar que no faltan ficheros
    // CONFIRMAR AQUI
    // Cogemos la imagen de la colección para que se muestre
    const fileImagenColeccion = this.ficherosColeccion.filter (f => f.name === this.infoColeccion.ImagenColeccion)[0];

    const reader = new FileReader();
    reader.readAsDataURL(fileImagenColeccion);
    reader.onload = () => {
      this.imagenColeccion = reader.result.toString();
      this.imagenCargado = true;
    };
  }

  RegistrarColeccion() {

    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.CreaColeccion (new Coleccion (this.infoColeccion.Nombre, this.infoColeccion.ImagenColeccion, this.infoColeccion.DosCaras), this.profesorId)
    .subscribe((res) => {
      if (res != null) {
        this.coleccion = res;
        // guardamos la imagen de la colección (si la hay)
        console.log ('miro si registrar imagen colección ' + this.infoColeccion.ImagenColeccion);
        if (this.infoColeccion.ImagenColeccion !== '') {
          console.log ('Si que registro');
          const imagenColeccion = this.ficherosColeccion.filter (f => f.name === this.coleccion.ImagenColeccion)[0];
          const formDataImagen = new FormData();
          formDataImagen.append(this.coleccion.ImagenColeccion, imagenColeccion);
          this.peticionesAPI.PonImagenColeccion (formDataImagen)
          .subscribe(() => console.log('Imagen cargado'));
        }

        // Creamos cada uno de los cromos y guardamos las imagenes delantera (y trasera si la hay)
        this.infoColeccion.cromos.forEach (cromo => {
          this.peticionesAPI.PonCromoColeccion(
            // tslint:disable-next-line:max-line-length
            new Cromo(cromo.nombreCromo , cromo.probabilidadCromo, cromo.nivelCromo, cromo.nombreImagenCromoDelante, cromo.nombreImagenCromoDetras), this.coleccion.id)
            .subscribe((res2) => {
              if (res2 != null) {
                  // Hacemos el POST de la imagen delantera del cromo
                  const formDataDelante: FormData = new FormData();
                  const fileCromoDelante = this.ficherosColeccion.filter (f => f.name === cromo.nombreImagenCromoDelante)[0];
                  formDataDelante.append(cromo.nombreImagenCromoDelante, fileCromoDelante);
                  this.peticionesAPI.PonImagenCromo(formDataDelante)
                  .subscribe(() => console.log('Imagen cargado'));
                 // Hacemos el POST de la imagen trasera del cromo (si la hay)
                  if (this.coleccion.DosCaras) {
                    const formDataDetras = new FormData();
                    const fileCromoDetras = this.ficherosColeccion.filter (f => f.name === cromo.nombreImagenCromoDetras)[0];
                    formDataDetras.append(cromo.nombreImagenCromoDetras, fileCromoDetras);
                    this.peticionesAPI.PonImagenCromo(formDataDetras)
                    .subscribe(() => console.log('Imagen cargado'));
                  }

              } else {
                console.log('fallo en la asignación');
              }
            });

        });
      }
    });
    Swal.fire('Coleccion creada con éxito', '', 'success');
    this.router.navigate(['/inicio/' + this.profesorId + '/misColecciones']);
  }
  Cancelar() {
    this.router.navigate(['/inicio/' + this.profesorId]);
  }


}

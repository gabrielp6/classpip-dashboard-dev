import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as URL from 'src/app/URLs/urls';
// Imports para abrir diálogo confirmar eliminar equipo
import { MatDialog, MatTabGroup, MatTableDataSource } from '@angular/material';
import { MatStepper } from '@angular/material/stepper';




// Servicios
import { SesionService, PeticionesAPIService, CalculosService } from '../../servicios/index';

// Clases
import { Coleccion, Cromo } from '../../clases/index';
import { Familia } from 'src/app/clases/Familia';
import { Carta } from 'src/app/clases/Carta';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import 'rxjs';

import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

export interface OpcionSeleccionada {
  nombre: string;
  id: string;
}


@Component({
  selector: 'app-crear-familiasmemorama',
  templateUrl: './crear-familiasmemorama.component.html',
  styleUrls: ['./crear-familiasmemorama.component.scss']
})

export class CrearFamiliasmemoramaComponent implements OnInit {
  // Para el paso finalizar limpiar las variables y volver al mat-tab de "Lista de equipos"
  // @ViewChild('stepper') stepper;
  @ViewChild('stepper', {static: false}) private stepper: MatStepper;

  @ViewChild('tabs', {static: false}) tabGroup: MatTabGroup;
  myForm: FormGroup;
  myForm2: FormGroup;
  myForm3: FormGroup;



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
  cromosAgregados: Carta[] = [];
  // tslint:disable-next-line:ban-types
  isDisabledCromo: Boolean = true;

  // COMPARTIDO
  profesorId: number;
  nombreImagen: string;
  file: File;

  nombreImagenCromoDelante: string;
  nombreImagenCromoDetras: string;
  fileCromoDelante: File;


  // Al principio coleccion no creada y imagen no cargada
  // tslint:disable-next-line:ban-types


  // tslint:disable-next-line:ban-types
  imagenCargado: Boolean = false;
  // tslint:disable-next-line:ban-types
  imagenCargadoCromo: Boolean = false;

  // tslint:disable-next-line:ban-types
  finalizar: Boolean = false;

  dosCaras = true;
  NecessitaRelacion;
  infoColeccion;
  ficherosColeccion;
  coleccion;
  advertencia = true;
  idfamiliacreada: any;
  unasolavez = true;

  vectorcartas: any[] = [];
  vectorcartas2: any[] = [];

  vectorimagen: any[] = [];

  vectorcartaseleccionadas: any[] = [];
  pasarvectorcartaseleccionadas: any[] = [];

  cartaseleccionada1: any;
  pasarcartaseleccionada1: any;

  cartaseleccionada2: any;
  pasarcartaseleccionada2: any;

  cartasquevoyaagregarafamilia: any[] = [];



  tengoImagenDorso = false;


  // PONEMOS LAS COLUMNAS DE LA TABLA Y LA LISTA QUE TENDRÁ LA INFORMACIÓN QUE QUEREMOS MOSTRAR
  displayedColumns: string[] = ['nombreCarta', ' '];

  ficherosRepetidos: string[];
  errorFicheros = false;
  nombreCarta: string;


  // Variables para la creacion de la familia paso a paso

  infoFamilia: any;
  fileImagenFamilia: File;
  relacion = false;
  familiaYaCreada = false;
  ficherosFamilia: any;
  imagenFamilia: any;
  familia: Familia;
  cartasCreadas: Carta[];
  familiaCreada: Familia;
  fileImagenDorso: File;
  nombreImagenDorso: string;
  imagenDorso: any;
  fileImagenCarta: File;
  nombreImagenCartaDelante: string;
  imagenCartaDelante: any;
  listaCartas: any[] = [];
  dataSource;
  imagenesCartas: any[] = [];;
  cartaSeleccionada1: Carta;
  imagenCartaSeleccionada1: any;
  cartaSeleccionada2: Carta;
  imagenCartaSeleccionada2: any;
  cartasRelacionadas = 0;
  listo = false;
 

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
      nombreFamilia: ['', Validators.required]
    });
    this.myForm2 = this.formBuilder.group({
      nombreCarta: ['', Validators.required]
    });
    this.myForm3 = this.formBuilder.group({
      nombreCarta: ['', Validators.required]
    });
  }

  // Estas son las funciones que necesito para crear la familia paso a paso.
  // Se trata de ir recopilando l ainformación en la estructura infoFamilia para registrar
  // la familia de golpe en el ultimo paso.


  ExaminarImagenFamilia($event) {
    this.fileImagenFamilia = $event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(this.fileImagenFamilia);
    reader.onload = () => {
      this.imagenFamilia = reader.result.toString();
    };
  }


  RegistrarRelacion() {

    const relacion = document.getElementById('relacion') as HTMLInputElement;
    if (relacion.checked) {
      this.relacion = true;
    } else {
      this.relacion = false;
    }
  }

  ExaminarImagenDorso($event) {
    this.fileImagenDorso = $event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.fileImagenDorso);
    reader.onload = () => {
      this.imagenDorso = reader.result.toString();
    };
  }


  ExaminarImagenCartaDelante($event) {
    this.fileImagenCarta = $event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(this.fileImagenCarta);
    reader.onload = () => {
      console.log('ya Cromo');
      // this.imagenCargadoCromo = true;
      this.imagenCartaDelante = reader.result.toString();
    };
  }

  AgregarCartaFamilia() {
    // creo la carta (aunque aun le faltan cosas) y la pongo en la lista

    let nuevaCarta: Carta;
    nuevaCarta = new Carta(this.myForm2.value.nombreCarta, this.fileImagenCarta.name, this.fileImagenDorso.name);
    this.listaCartas.push({
      carta: nuevaCarta,
      file: this.fileImagenCarta
    });
    this.dataSource = new MatTableDataSource (this.listaCartas);
    this.LimpiarCampos();
  }

  LimpiarCampos() {
    this.nombreCarta = undefined;
    this.imagenCartaDelante = undefined;
    this.myForm2.value.nombreCarta = undefined;
  }


  // Utilizamos esta función para eliminar un cromo de la base de datos y de la lista de añadidos recientemente
  BorrarCarta(item: any) {
    this.listaCartas = this.listaCartas.filter(c => c.carta.Nombre !== item.carta.Nombre);
    this.dataSource = new MatTableDataSource (this.listaCartas);

  }

 
  RegistrarFamiliaCreadaPasoAPaso() {
    // Primero tenemos que verificar que no hay en la base de datos ficheros con los mismos nombres que los que tiene esta familia nueva
    // Prepalo la información que necesita la función que va a hacer esta verificación
    const ImagenesCartas = [];
    this.listaCartas.forEach(item => ImagenesCartas.push({ imagenDelante: item.file.name }));
    const infoFamilia = {
      ImagenFamilia: this.fileImagenFamilia.name,
      ImagenDorso: this.fileImagenDorso.name,
      cartas: ImagenesCartas
    };

    this.calculos.VerificarFicherosFamiliaMemorama(infoFamilia)
      .subscribe(lista => {
        // La lista contiene los nombres de ficheros que no puedes usarse porque ya hay otros en la base de datos
        // con el mismo nombre
        if (lista.length > 0) {
          let nombresRepetidos = '';
          lista.forEach (fichero => nombresRepetidos = nombresRepetidos.concat (fichero + '<br>'));

          // tslint:disable-next-line:max-line-length
          Swal.fire('Ficheros con nombres que ya están en la base de datos. Vuelve a intentarlo con nombres de ficheros diferentes', nombresRepetidos, 'error');
        } else {
          // Por fin creamos la familia
          let nombreFamilia: string;

          // Recojemos Nombre
          nombreFamilia = this.myForm.value.nombreFamilia;
          // tslint:disable-next-line:max-line-length
          this.peticionesAPI.CreaFamilia(new Familia(nombreFamilia, this.fileImagenFamilia.name, this.profesorId, this.relacion), this.profesorId)
            .subscribe(async (res) => {
              if (res != null) {
                console.log('Familia creada');
                this.idfamiliacreada = res.id;
                this.familiaYaCreada = true; // Si tiro atrás y cambio algo se hará un PUT y no otro POST
                this.familiaCreada = res; // Lo metemos en coleccionCreada, y no en coleccion!!
                console.log('voy a crear las cartas ', this.listaCartas);
                // ahora creo las cartas
                this.listaCartas.forEach(item => {
                  console.log('voy a crear la carta ', item.carta.Nombre);
                  item.carta.familiaId = this.familiaCreada.id;
                  this.peticionesAPI.PonCartaFamilia(item.carta).subscribe(c => {
                    console.log ('registrada carta ', c.Nombre);
                    item.carta.id = c.id;
                  });
                });
                // guardo la imagen de la familia
                let formData: FormData = new FormData();
                formData.append(this.fileImagenFamilia.name, this.fileImagenFamilia);
                this.peticionesAPI.PonImagenFamiliaMemorama(formData).subscribe();
                // Ahora guardo la imagen del dorso
                formData = new FormData();
                formData.append(this.fileImagenDorso.name, this.fileImagenDorso);
                this.peticionesAPI.PonImagenCarta(formData).subscribe();
                // y finalmente guardo las imagenes de las cartas
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < this.listaCartas.length; i++) {
                  const formData: FormData = new FormData();
                  formData.append(this.listaCartas[i].file.name, this.listaCartas[i].file);
                  await this.peticionesAPI.PonImagenCarta(formData).toPromise();
                } 
                if (this.relacion) {
                  Swal.fire('Familia registrada', 'Establece ahora las relaciones', 'success');
                  // preparamos las imagenes de las cartas para establecer las relaciones
                  this.imagenesCartas = [];
                  this.listaCartas.forEach (item => {
                    this.imagenesCartas.push (URL.ImagenesCartas + item.file.name);
                  });
                  console.log ("imagenes ", this.imagenesCartas);

                } else {
                  Swal.fire('Familia creada con éxito', '', 'success');
                  this.myForm.reset();
                  this.myForm2.reset();
                  // Tambien limpiamos las variables utilizadas para crear el nueva coleccion, por si queremos crear otra.
                  this.familiaYaCreada = false;
                  this.imagenCargado = false;
                  this.imagenColeccion = undefined;
                  this.imagenCargadoCromo = false;
                  this.imagenCromoDelante = undefined;
                  this.imagenCromoDetras = undefined;
                  this.coleccionCreada = undefined;
                  this.dosCaras = undefined;
                  this.finalizar = true;
                  this.router.navigate(['/inicio/' + this.profesorId]);

                }
              } else {
                console.log('Fallo en la creación');
              }
            });
        }
      });
  }


  CartaSeleccionada(i) {

    const carta = document.getElementById('carta' + i);
    if (this.imagenCartaSeleccionada1 === carta) {
      // Elimina la carta seleccionada de la seleccion
      this.imagenCartaSeleccionada1 = undefined;
      this.cartaSeleccionada1 = undefined;
      carta.style.border = '';
    } else if (this.imagenCartaSeleccionada2 === carta) {
      // Elimina la carta seleccionada de la seleccion
      this.imagenCartaSeleccionada2 = undefined;
      this.cartaSeleccionada2 = undefined;
      carta.style.border = '';
    } else {
      // ha seleccionado una carta nueva
      // primero miramos si hay teníamos dos cartas seleccionadas
      if ((this.cartaSeleccionada1 !== undefined) && (this.cartaSeleccionada2 !== undefined)) {
        Swal.fire('Ya tienes dos cartas seleccionadas', 'Registra la relación antes de seleccionar más', 'error');
      } else if (this.cartaSeleccionada1 === undefined) {
        this.cartaSeleccionada1 = this.listaCartas[i].carta;
        this.imagenCartaSeleccionada1 = carta;
        carta.style.border = '5px solid red';
      } else {
        this.cartaSeleccionada2 = this.listaCartas[i].carta;
        this.imagenCartaSeleccionada2 = carta;
        carta.style.border = '5px solid red';
      }
    }
    console.log ('carta seleccionada 1', this.cartaSeleccionada1);
    console.log ('carta seleccionada 2', this.cartaSeleccionada2);
  }

  
  EstableceRelacion() {

     this.imagenCartaSeleccionada1.style.border="";
     this.imagenCartaSeleccionada2.style.border="";

     this.imagenCartaSeleccionada1.style.visibility= "hidden";
     this.imagenCartaSeleccionada2.style.visibility= "hidden";

  
     this.cartasRelacionadas = this.cartasRelacionadas + 2;


     this.cartaSeleccionada1.relacion = this.cartaSeleccionada2.id;
     this.cartaSeleccionada2.relacion = this.cartaSeleccionada1.id;

     this.peticionesAPI.ModificaCarta(this.cartaSeleccionada1, this.cartaSeleccionada1.id).subscribe();
     this.peticionesAPI.ModificaCarta(this.cartaSeleccionada2, this.cartaSeleccionada2.id).subscribe();
     this.imagenCartaSeleccionada1 = undefined;
     this.imagenCartaSeleccionada2 = undefined;
     this.cartaSeleccionada1 = undefined;
     this.cartaSeleccionada2 = undefined;

  }

  FinalizarRelaciones () {
    this.finalizar = true;
    Swal.fire('Relaciones establecidas', 'Famila para memorama con relaciones creada con éxito', 'success');
    this.router.navigate(['/inicio/' + this.profesorId]);

  }

 

  AgregarImagenDorso() {
    this.tengoImagenDorso = true;

  }


  BorrarFamilia() {

    this.peticionesAPI.BorrarImagenFamilia(this.familiaCreada.ImagenFamilia).subscribe();

    this.peticionesAPI.DameCartasFamilia(this.familiaCreada.id)
      .subscribe(res => {
        const cartasFamilia = res;

        // Ya puedo borrar la colección
        this.peticionesAPI.BorraFamiliaMemorama(this.familiaCreada.id, this.profesorId)
          .subscribe();

        cartasFamilia.forEach (carta => {
          this.peticionesAPI.BorrarCarta(carta.id).subscribe();
          this.peticionesAPI.BorrarImagenCarta(carta.imagenDelante).subscribe();
        });
        this.peticionesAPI.BorrarImagenCarta(cartasFamilia[0].imagenDetras).subscribe();
      });
  }

  canExit(): Observable <boolean> {
    if (!this.familiaCreada || this.finalizar) {
      return of(true);
    } else {
    // esta función se llamará cada vez que quedamos salir de la página
      const confirmacionObservable = new Observable <boolean>( obs => {
  
        Swal.fire({
            title: '¿Seguro que quieres abandonar la creación de la familia?',
            text: 'No has acabado de establecer las relaciones',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, estoy seguro'
          }).then((result) => {
            if (result.value) {
                this.BorrarFamilia();
            }
            obs.next (result.value);
        });
      });
      return confirmacionObservable;
    }
  }


  Cancelar() {
    this.router.navigate(['/inicio/' + this.profesorId]);
  }

  //// PARA CREAR LA FAMILIA DESDE FICHEROS ////////////////////////////

  // Activa la función SeleccionarInfoColeccion


  // Par abuscar el fichero JSON que contiene la info de la colección que se va
  // a cargar desde ficheros
  SeleccionarInfoFamilia($event) {
    console.log('ya hemos seleccionado ficheros');
    const fileInfo = $event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(fileInfo, 'ISO-8859-1');
    reader.onload = () => {
      try {
        this.infoFamilia = JSON.parse(reader.result.toString());
        console.log('info familia');
        console.log(this.infoFamilia);


        this.calculos.VerificarFicherosFamiliaMemorama(this.infoFamilia)
          .subscribe(lista => {
            if (lista.length === 0) {
              console.log('No hay fichero repetidos');
              Swal.fire({
                title: 'Selecciona ahora las imagenes de la familia',
                text: 'Selecciona todos los ficheros de la carpeta imagenes',
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Selecciona'
              }).then((result) => {
                if (result.value) {
                  // Activamos la función SeleccionarFicherosCromos
                  document.getElementById('inputImagenes').click();
                }
              });
            } else {
              console.log('SI hay fichero repetidos');
              this.ficherosRepetidos = lista;
              this.errorFicheros = true;
            }
          });
      } catch (e) {
        Swal.fire('Error en el formato del fichero', '', 'error');
      }
    };
  }

  SeleccionarImagenesFamilia($event) {
    this.ficherosFamilia = Array.from($event.target.files);
    // Ya tenemos todos los ficheros de las imagenes
    // Hay que confirmar que no faltan ficheros

    let ficherosQueFaltan = '';
    if (!this.ficherosFamilia.some(f => f.name === this.infoFamilia.ImagenFamilia)) {
      ficherosQueFaltan = ficherosQueFaltan.concat(this.infoFamilia.ImagenFamilia + '<br>');
    }
    if (!this.ficherosFamilia.some(f => f.name === this.infoFamilia.ImagenDorso)) {
      ficherosQueFaltan = ficherosQueFaltan.concat(this.infoFamilia.ImagenDorso + '<br>');
    }
    this.infoFamilia.cartas.forEach(carta => {
      if (!this.ficherosFamilia.some(f => f.name === carta.imagenDelante)) {
        ficherosQueFaltan = ficherosQueFaltan.concat(carta.imagenDelante + '<br>');
      }
    });


    if (ficherosQueFaltan.length > 0) {

      Swal.fire('No has seleccionado los siguientes ficheros', ficherosQueFaltan, 'error');
      this.router.navigate(['/inicio/' + this.profesorId + '/recursos']);

    } else {

      // Cogemos la imagen de la colección para que se muestre
      const fileImagenFamilia = this.ficherosFamilia.filter(f => f.name === this.infoFamilia.ImagenFamilia)[0];

      const reader = new FileReader();
      reader.readAsDataURL(fileImagenFamilia);
      reader.onload = () => {
        this.imagenFamilia = reader.result.toString();
        this.imagenCargado = true;
      };

    }


  }
  public RegistrarCartas(infoFamilia: any, familiaId: number): any {
    const cartasRegistradas = new Observable(obs => {

      const numeroCartas = infoFamilia.cartas.length;
      let cont = 0;

      infoFamilia.cartas.forEach(carta => {
        this.peticionesAPI.PonCartaFamilia(

          // tslint:disable-next-line:max-line-length
          new Carta(carta.Nombre, carta.imagenDelante, infoFamilia.ImagenDorso, familiaId))
          .subscribe((res) => {
            if (res != null) {
              if (infoFamilia.relacion) {
                // necesitaremos la carta creada
                this.cartasCreadas.push(res);
              }
              // Hacemos el POST de la imagen delantera de la carta

              const fileCartaDelante = this.ficherosFamilia.filter(f => f.name === carta.imagenDelante)[0];
              const formDataDelante: FormData = new FormData();
              formDataDelante.append(carta.imagenDelante, fileCartaDelante);
              this.peticionesAPI.PonImagenCarta(formDataDelante)
                .subscribe(() => console.log('Imagen cargado'));
              cont++;
              if (numeroCartas === cont) {
                obs.next();
              }

            } else {
              console.log('fallo en la asignación');
            }
          });

      });
    });
    return cartasRegistradas;
  }


  RegistrarFamilia() {

    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.CreaFamilia(new Familia(this.infoFamilia.Nombre, this.infoFamilia.ImagenFamilia, this.profesorId, this.infoFamilia.relacion), this.profesorId)
      .subscribe((res) => {
        if (res != null) {
          this.familia = res;
          if (this.infoFamilia.ImagenFamilia !== '') {
            console.log('Si que registro');
            const imagenFamilia = this.ficherosFamilia.filter(f => f.name === this.familia.ImagenFamilia)[0];
            const formDataImagen = new FormData();
            formDataImagen.append(this.familia.ImagenFamilia, imagenFamilia);
            this.peticionesAPI.PonImagenFamiliaMemorama(formDataImagen)
              .subscribe(() => console.log('Imagen cargado'));
          }

          // Guardamos la imagen del dorso de las cartas
          const imagenDorso = this.ficherosFamilia.filter(f => f.name === this.infoFamilia.ImagenDorso)[0];
          const formDataImagen = new FormData();
          formDataImagen.append(this.infoFamilia.ImagenDorso, imagenDorso);
          this.peticionesAPI.PonImagenCarta(formDataImagen)
            .subscribe(() => console.log('Imagen cargado'));

          // Si las cartas estan relacionadas, necesitaremos guardar las cartas en una lista a medida que se van creando
          this.cartasCreadas = [];
          this.RegistrarCartas(this.infoFamilia, this.familia.id)
            .subscribe(() => {
              console.log('YA HE REGISTRADO LAS CARTAS');
              console.log(this.cartasCreadas);
              console.log ('familiar ', this.familia)
              // ya estan todas las cartas creadas. Vamoa a establecer la relación, si la hay
              if (this.familia.relacion) {
                console.log ('establecer relaciones')
                this.cartasCreadas.forEach(carta => {
                  // tslint:disable-next-line:max-line-length
                  const cartaRelacionada = this.cartasCreadas.filter(c => carta.imagenDelante.includes(c.imagenDelante.split('_')[0]) && (c.Nombre !== carta.Nombre))[0];
                  carta.relacion = cartaRelacionada.id;
                  console.log('voy a modificar carta ', carta);
                  this.peticionesAPI.ModificaCartaFamilia(carta, carta.familiaId, carta.id).subscribe();
                });
              }
            });
        }
      });
    Swal.fire('Familia de cartas para memorama creada con éxito', '', 'success');
    this.router.navigate(['/inicio/' + this.profesorId + '/misFamiliasmemorama']);
  }


}

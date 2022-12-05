import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

// Imports para abrir diálogo confirmar eliminar equipo
import { MatDialog, MatTabGroup } from '@angular/material';
import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';

// Import para agregar alumnos al equipo
import { AgregarAlumnoEquipoComponent } from './agregar-alumno-equipo/agregar-alumno-equipo.component';

// Clases
import { Equipo, Alumno, AsignacionEquipo } from '../../clases/index';


// Servicios
import { SesionService, PeticionesAPIService, CalculosService } from '../../servicios/index';
import * as URL from '../../URLs/urls';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.scss']
})
export class EquiposComponent implements OnInit {

  // Para el paso finalizar limpiar las variables y volver al mat-tab de "Lista de equipos"
  @ViewChild('stepper') stepper;
  @ViewChild('tabs') tabGroup: MatTabGroup;
  myForm: FormGroup;


  // Como estamos en un mismo controlador y una misma vista,
  // hay que diferenciar las variables de equipo cuando manipulamos
  // la lista y cuando creamos un nuevo equipo

  // LISTAR EQUIPOS
  listaEquipos: Equipo[];
  alumnosEquipo: Alumno[];
  imagenLogo: string;
  equipo: Equipo;

  // CREAR EQUIPO
  alumnosEquipoCreado: Alumno[];
  logo: string;
  equipoCreado: Equipo;

  // Al principio grupo no creado y logo no cargado
  // tslint:disable-next-line:ban-types
  equipoYaCreado: Boolean = false;
  // tslint:disable-next-line:ban-types
  logoCargado: Boolean = false;

  // SEGUNDO PASO (Recupero asignaciones)
  asginacionEquipo: AsignacionEquipo[];

  // Alumnos que ya estan asignados a un equipo. Debemos iniciarlo vacio para que vaya el push
  alumnosConEquipo: Alumno[] = [];

  // Lista con los alumnos del grupo que todavida no tienen equipo. Debemos iniciarlo vacio para que vaya el push
  alumnosSinEquipo: Alumno[] = [];

  // PONEMOS LAS COLUMNAS DE LA TABLA Y LA LISTA QUE TENDRÁ LA INFORMACIÓN QUE QUEREMOS MOSTRAR
  displayedColumns: string[] = ['nombreAlumno', 'primerApellido', 'segundoApellido', 'alumnoId', ' '];


  // COMPARTIDO
  grupoId: number;
  nombreLogo: string;
  file: File;
  alumnosGrupo: Alumno[];
  // tslint:disable-next-line:no-inferrable-types
  tamEquipos: number = 3;


  // PARA DIÁLOGO DE CONFIRMACIÓN
  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres eliminar el equipo llamado: ';


  constructor(
               public dialog: MatDialog,
               private location: Location,
               private formBuilder: FormBuilder,
               private sesion: SesionService,
               private calculos: CalculosService,
               private peticionesAPI: PeticionesAPIService
               ) { }

  ngOnInit() {

    // Recogemos el id, los alumnos y los equipos del grupo
    this.grupoId = this.sesion.DameGrupo().id;
    this.alumnosGrupo = this.sesion.DameAlumnosGrupo();
    this.EquiposDelGrupo();

    // Constructor myForm
    this.myForm = this.formBuilder.group({
      nombreEquipo: ['', Validators.required]
    });
  }



  /////////////////////////////////// FUNCIONES PARA MAT-TAB LISTAR EQUIPOS /////////////////////////////////////////////

  // Coge el identificador del grupo que le pasamos del otro componente a través del servicio y busca los equipos que tiene
  EquiposDelGrupo() {

    this.peticionesAPI.DameEquiposDelGrupo(this.grupoId)
    .subscribe(res => {
      if (res[0] !== undefined) {

        this.listaEquipos = res;
      } else {
        // Informar al usuario
        console.log('Este grupo no tiene equipos');
      }
    });
  }

  // Le pasamos el equipo y buscamos el logo que tiene y sus alumnos
  AlumnosYLogoDelEquipo(equipo: Equipo) {
    this.peticionesAPI.DameAlumnosEquipo(equipo.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.alumnosEquipo = res;

      } else {
        // Mensaje al usuario
        console.log('No hay alumnos en este equipo');
        this.alumnosEquipo = undefined;
      }
    });
  }

  // Metemos en la sesión la información que se necesita para edicar el equipo
  EnviarEquipoEditar(equipo: Equipo, alumnosEquipo: Alumno[]) {

    // Envio el equipo al servicio para posteriormente recuperarlo en el componente editar-equipo
    this.sesion.TomaEquipo(equipo);
    this.sesion.TomaAlumnosEquipo (alumnosEquipo);

  }

  // Si queremos borrar un equipo, antes nos saldrá un aviso para confirmar la acción como medida de seguridad. Esto se
  // hará mediante un diálogo al cual pasaremos el mensaje y el nombre del equipo
  AbrirDialogoConfirmacionBorrar(equipo: Equipo): void {

    Swal.fire({
      title: '¿Seguro que quieres eliminar el equipo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.EliminarEquipo(equipo);
        Swal.fire('Eliminado', equipo.Nombre + ' eliminado correctamente', 'success');
      }
    });
  }

  EliminarEquipo(equipo: Equipo) {

    this.peticionesAPI.BorraEquipoDelGrupo(equipo)
    .subscribe(() => {

      // Borro las asignaicones del equipo ya que no van a servir
      this.EliminarAsignacionesEquipo(equipo);

      // Actualizo la tabla de equipos
      this.listaEquipos = this.listaEquipos.filter (eq => eq.id !== equipo.id);
      if (this.listaEquipos.length === 0 ) {
        this.listaEquipos = undefined;
      }


    });
  }

  EliminarAsignacionesEquipo(equipo: Equipo) {
    this.peticionesAPI.DameAsignacionesDelEquipo(equipo)
    .subscribe(asignaciones => {

      if (asignaciones[0] !== undefined) {

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < asignaciones.length; i++) {
          this.peticionesAPI.BorraAlumnoEquipo(asignaciones[i])
          .subscribe(() => {
            console.log('asginacion borrada');
          });
        }
      } else {
        // Mensaje al usuario
        console.log('No hay asignaciones a equipos');
      }
    });
  }



  ////////////////////////////////////////// FUNCIONES PARA CREAR EQUIPO /////////////////////////////////////////////


  // Para crear un equipo utilizaremos algunos nuevos parámetros para no mezclar con los utilizados para las listas


  ///////////// PRIMER PASO STEPPER


  // Coge lo que introducimos en el input (el controlador del myForm) y el nombreLogo que le pasamos y hace el POST en
  // la base de datos tanto del equipo como del logo
  CrearEquipo() {

    let nombreEquipo: string;
    nombreEquipo = this.myForm.value.nombreEquipo;

    // Hace el POST del equipo
    this.peticionesAPI.CreaEquipo(new Equipo(nombreEquipo, URL.LogosEquipos + this.nombreLogo), this.grupoId)
    .subscribe((res) => {
      if (res != null) {

        this.equipoYaCreado = true; // Si tiro atrás y cambio algo se hará un PUT y no otro POST
        this.equipoCreado = res; // Lo metemos en equipoCreado, y no en equipo!!

        this.calculos.DameListasAlumnosConYSinEquipo (this.equipoCreado, this.alumnosGrupo)
        .subscribe (result => {
                              this.alumnosConEquipo = result.con;
                              console.log ('CON: ' + this.alumnosConEquipo);
                              this.alumnosSinEquipo = result.sin;
                              console.log ('SIN: ' + this.alumnosSinEquipo);
        });

        // Hago el POST de la imagen SOLO si hay algo cargado. Ese boolean se cambiará en la función ExaminarLogo
        if (this.logoCargado === true) {

          console.log ('VAMOS A ENVIAR LA IMAGEN A LA BASE DE DATOS' + this.nombreLogo);
          // Hacemos el POST de la nueva imagen en la base de datos recogida de la función ExaminarLogo
          const formData: FormData = new FormData();
          formData.append(this.nombreLogo, this.file);
          this.peticionesAPI.PonLogoEquipo(formData).subscribe (); // ATENCION: Si no se hace el subscribe no se hace la operacion
        }

      } else {
        console.log('Fallo en la creación');
      }
    });
  }

  // Activa la función ExaminarLogo
  ActivarInput() {
    document.getElementById('input').click();
  }


  // Buscaremos la imagen en nuestro ordenador y después se mostrará en el form con la variable "logo" y guarda el
  // nombre de la foto en la variable nombreLogo
  BuscarLogo($event) {
    this.file = $event.target.files[0];
    this.nombreLogo = this.file.name;

    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {

      this.logoCargado = true;
      this.logo = reader.result.toString();
    };
  }


  // Si estamos creando el equipo y pasamos al siguiente paso, pero volvemos hacia atrás para modificar el nombre y/o el
  // logo, entonces no deberemos hacer un POST al darle a siguiente, sino un PUT. Por eso se hace esta función, que funciona
  // de igual manera que la de Crear Equipo pero haciendo un PUT.
  EditarEquipo() {

    let nombreEquipo: string;

    nombreEquipo = this.myForm.value.nombreEquipo;
    this.equipoCreado.Nombre = this.myForm.value.nombreEquipo;
    this.equipoCreado.FotoEquipo = URL.LogosEquipos + this.nombreLogo;

    this.peticionesAPI.ModificaEquipo(this.equipoCreado)
    .subscribe((res) => {
      if (res != null) {

        this.equipoCreado = res;
        // Modifico el nombre del equipo en la lista que se muestra en pantalla
        this.listaEquipos.filter (eq => eq.id === res.id)[0].Nombre = res.Nombre;

        // Hago el POST de la imagen SOLO si hay algo cargado
        if (this.logoCargado === true) {
          // HACEMOS EL POST DE LA NUEVA IMAGEN EN LA BASE DE DATOS
          const formData: FormData = new FormData();
          formData.append(this.nombreLogo, this.file);
          this.peticionesAPI.PonLogoEquipo(formData)
          // recojo el nuevo logo de la sesión para actualizar la lista que ve el usuario
          .subscribe(() => this.imagenLogo = this.sesion.DameImagenLogoEquipo());
        }

      } else {
        console.log('fallo editando');
      }
    });
  }


  ///////////// SEGUNDO PASO STEPPER

  // SE ABRE EL DIÁLOGO PARA AÑADIR ALUMNOS AL EQUIPO
  AbrirDialogoAgregarAlumnosEquipo(): void {

    const dialogRef = this.dialog.open(AgregarAlumnoEquipoComponent, {
      height: '95%',

      // LE ENVIAMOS LOS ALUMNOS QUE TIENE ACTUALMENTE EL EQUIPO Y LOS QUE PODEMOS AÑADIR, ADEMÁS DEL EQUIPO QUE NOS SERÁ
      // ÚTIL PARA SABER SU ID Y EL ID DEL GRUPO AL QUE PERTENCE
      data: {
        alumnosEquipo: this.alumnosEquipoCreado,
        alumnosSinEquipo: this.alumnosSinEquipo,
        equipo: this.equipoCreado
      }
    });

    // RECUPERAREMOS LA NUEVA LISTA DE LOS ALUMNOS ASIGNABLES Y VOLVEREMOS A BUSCAR LOS ALUMNOS QUE TIENE EL EQUIPO
    dialogRef.afterClosed().subscribe(alumnosEquipo => {

      // Si el usuario clica a aceptar para cerrar el dialogo, se enviarán los alumnos del equipo
      if (alumnosEquipo !== undefined) {
        this.alumnosEquipoCreado = alumnosEquipo;

        // Si clica fuera del diálogo para cerrarlo, recuperaremos la lista de la base de datos
      } else {
        this.AlumnosEquipoCreado();
      }

      // Limpiamos las listas que teniamos antes
      this.alumnosConEquipo = [];
      this.alumnosSinEquipo = [];

      // Pedimos las listas de alumnos con y sin equipo
      this.calculos.DameListasAlumnosConYSinEquipo (this.equipoCreado, this.alumnosGrupo)
      .subscribe (res => {
                            this.alumnosConEquipo = res.con;
                            this.alumnosSinEquipo = res.sin;
      });

    });
  }


  // Utilizaremos esta función para actualizar la lista de alumnosEquipoCreado y, asi, la tabla.
  AlumnosEquipoCreado() {

    // Busca los alumnos del equipo en la base de datos
    this.peticionesAPI.DameAlumnosEquipo(this.equipoCreado.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.alumnosEquipoCreado = res;
        console.log(res);
      } else {
        console.log('No hay alumnos en este equipo');
        // Mensaje al usuario
        this.alumnosEquipoCreado = undefined;
      }
    });
  }





  // Borra al alumno del equipo
  BorrarAlumnoEquipo(alumno: Alumno) {
    console.log('voy a borrar a ' + alumno.id);
    // PRIMERO BUSCO LA ASIGNACIÓN QUE VINCULA EL ALUMNO CON ID QUE PASO COMO PARÁMETRO Y EL EQUIPO EN EL QUE ESTOY
    this.peticionesAPI.DameAsignacionEquipoAlumno(alumno.id, this.equipoCreado.id, this.equipoCreado.grupoId)
    .subscribe(asignacion => {
      console.log(asignacion);

      // UNA VEZ LO TENGO, BORRO ESA ASIGNACIÓN Y, POR TANTO, EL VÍNCULO ENTRE ALUMNO Y EQUIPO
      if (asignacion[0] !== undefined) {
        this.peticionesAPI.BorraAlumnoEquipo(asignacion[0]).subscribe(res => {
          console.log(res);
          // SI SE BORRA CORRECTAMENTE NOS DEVUELVE NULL
          if (res === null) {
            console.log('eliminado correctamente');
            this.AlumnosEquipoCreado(); // Actualizamos los alumnos del equipo
            // Elimino al alumno de la lista de los que tiene equipo
            this.alumnosConEquipo = this.alumnosConEquipo.filter(result => result.id !== alumno.id);
            // Lo añado a la lista de los que no tienen equipo
            this.alumnosSinEquipo.push(alumno);
          } else {
            console.log('No se ha podido eliminar');
          }
        });
      } else {
        console.log('no se ha encontrado la asignación');
        }
      });
  }
 

  CrearEquipos() {
    let ajuste;
    const radio = document.getElementsByName('ajuste')[0] as HTMLInputElement;
    if (radio.checked ) {
      ajuste = '+';
    } else {
      ajuste = '-';
    }

    const equipos = this.calculos.FormarEquiposAleatorios (this.alumnosGrupo, this.tamEquipos, ajuste);
    this.listaEquipos = [];
    for (let i = 0 ; i < equipos.length; i++) {
      this.peticionesAPI.CreaEquipo(new Equipo('Equipo_' + i, undefined), this.grupoId)
      .subscribe((equipo) => {
        if (equipo != null) {
          this.listaEquipos.push (equipo);
          const k = Number(equipo.Nombre.split('_')[1]);
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < equipos[k].length ; j++) {
            this.peticionesAPI.PonAlumnoEquipo(new AsignacionEquipo(equipos[k][j].id, equipo.id), equipo.grupoId)
            .subscribe();
          }
        }});
    }
    Swal.fire ('Guardado', 'Equipos creados. Comprueba la lista de equipos' , 'success');


  }

  ///////////// TERCER PASO STEPPER

  // Función que se activará al clicar en finalizar el último paso del stepper
  Finalizar() {

        // Actualizamos la tabla de equipos con el equipo nuevo
    this.EquiposDelGrupo();

    // Regresamos a la lista de equipos (mat-tab con índice 0)
    this.tabGroup.selectedIndex = 0;

    // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
    this.myForm.reset();
    this.stepper.reset();

    // Tambien limpiamos las variables utilizadas para crear el nuevo equipo, por si queremos crear otro.
    this.equipoYaCreado = false;
    this.logoCargado = false;
    this.logo = undefined;
    this.alumnosEquipoCreado = undefined;
    this.equipoCreado = undefined;
    this.alumnosConEquipo = [];

  }

  // NOS DEVOLVERÁ A LA DE LA QUE VENIMOS
  goBack() {
    this.location.back();
  }
}

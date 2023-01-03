import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Clases
import { Grupo, Alumno, SesionClase, AsistenciaClase, Matricula, Equipo } from '../../clases/index';

// Servicios

import { SesionService, PeticionesAPIService } from '../../servicios/index';
// Imports para abrir diálogo agregar alumno/confirmar eliminar grupo
import { MatDialog } from '@angular/material';
import { SummaryResolver } from '@angular/compiler';

@Component({
  selector: 'app-sesiones-clase',
  templateUrl: './sesiones-clase.component.html',
  styleUrls: ['./sesiones-clase.component.scss']
})
export class SesionesClaseComponent implements OnInit {
  // PARÁMETROS QUE RECOGEMOS DEL COMPONENTE GRUPO
  grupoSeleccionado: Grupo;
  profesorId: number;
  alumnosDelGrupo: Alumno[];
  botonTablaDesactivado = true;
  //
  alumnosSeleccionados: Alumno[];
  alumnosConMarcaTiempo: any [] = [];

  alumnosElegido: Alumno;

  dataSource;
  mensaje: string = null;

  columnasElegirAleatoriamente: string[] = ['nombreAlumno', 'primerApellido', 'segundoApellido'];
  columnasMarcarHora: string[] = ['select', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'marca'];
  selection = new SelectionModel<Alumno>(true, []);

  myForm: FormGroup;
  fecha: string = null;
  horaSesion: string = null;
  descripcionSesion: string = null;
  // tslint:disable-next-line:no-inferrable-types
  sesionCreada: boolean = false;
  sesionClaseId: number;
  matriculasGrupo: Matricula[];
  sesiones: SesionClase[];
  asistencias: any[];
  tiempos: any[][] = [];
  porcentajeAsistenciaAlumnos: any[];
  listaAlumnos: Alumno[];
  datos: any[];
  listaEquipos: Equipo[];
  nuevaSesion: SesionClase;
  marca: any[];

  constructor(
               public dialog: MatDialog,
               public location: Location,
               private sesion: SesionService,
               private peticionesAPI: PeticionesAPIService,
               // tslint:disable-next-line:variable-name
               private _formBuilder: FormBuilder) { }

  ngOnInit() {

    this.grupoSeleccionado = this.sesion.DameGrupo();
    this.profesorId = this.grupoSeleccionado.profesorId;
    this.AlumnosDelGrupo();
    //this.alumnosGrupoSeleccionado = this.sesion.DameAlumnosGrupo();
    // Necesito las matriculas de los alumnos en el grupo porque para crear una asistencia
    // a clase tengo que usar el id de la matricula
    // this.peticionesAPI.DameMatriculasGrupo (this.grupoSeleccionado.id)
    // .subscribe ( res => this.matriculasGrupo = res);

    // if (this.alumnosGrupoSeleccionado !== undefined) {
    //   // Al principio no hay alumnos seleccionados para eliminar
    //   this.alumnosGrupoSeleccionado.forEach (a => this.alumnosConMarcaTiempo.push ({
    //       id: a.id,
    //       Nombre: a.Nombre,
    //       PrimerApellido: a.PrimerApellido,
    //       SegundoApellido: a.SegundoApellido,
    //       marca: undefined
    //   }));
    //   console.log ('Alumnos con marca');
    //   console.log (this.alumnosConMarcaTiempo);
    //   this.dataSource = new MatTableDataSource(this.alumnosConMarcaTiempo);
    // }
    this.myForm = this._formBuilder.group({
      descripcionSesion: ['', Validators.required],
      picker: ['', Validators.required],
      hora:  ['', Validators.required]
    });


  }

  AlumnosDelGrupo() {

    this.peticionesAPI.DameAlumnosGrupo(this.grupoSeleccionado.id)
    .subscribe(res => {

      if (res[0] !== undefined) {
        this.alumnosDelGrupo = res;
        this.dataSource = new MatTableDataSource(this.alumnosDelGrupo);
        this.DameSesionesDeClase();


      } else {
        console.log('No hay alumnos en este grupo');
      }
    });
    // this.peticionesAPI.DameMatriculasGrupo (this.grupo.id)
    // .subscribe ( res => this.matriculasGrupo = res);
  }
  EquiposDelGrupo() {
    this.peticionesAPI.DameEquiposDelGrupo(this.grupoSeleccionado.id)
    .subscribe(res => {
      if (res[0] !== undefined) {

        this.listaEquipos = res;
      } else {
        // Informar al usuario
        console.log('Este grupo no tiene equipos');
      }
    });
  }


  DameSesionesDeClase() {

    this.asistencias = [];
    this.peticionesAPI.DameSesionesClaseGrupo (this.grupoSeleccionado.id).
    subscribe (sesiones => {
      this.sesiones = sesiones;
      console.log ('ya tengo las sesiones');
      console.log (this.sesiones);
      this.sesiones.sort((a, b) => (a.Dia < b.Dia ? -1 : 1));
      this.PrepararDatos();
    });

  }

  PrepararDatos () {
    this.datos = [];
    // La estructura de datos clave para alimentar todas las pantallas es una lista.
    // La lista tiene una posición por cada alumno en la que hay:
    //  Los datos del alumno
    //  Los datos de las asistencias del alumno (un vector con tantas posiciones como sesiones,
    //  en el que en cada posición hay el id de la sesión y el tiempo que se registró)
    console.log ('vamos a preparar datos');
    console.log (this.sesiones);
    this.alumnosDelGrupo.forEach (al => {
      const asis = [];
      this.sesiones.forEach (sesion => {
        // Para cada sesión busco en la lista de asistencias a esa sesión la que corresponde al alumno
        const t = sesion.Asistencia.filter (a => a.alumnoId === al.id)[0].tiempo;
        asis.push ({
          sesionId: sesion.id,
          tiempo: t
        });
      });
      this.datos.push ({
        alumno: al,
        asistencias: asis
      });
    });
    console.log ('datos preparados');
    console.log (this.datos);
    this.PreparaPorcentajesAsistencia();
  }



PreparaPorcentajesAsistencia() {
  this.porcentajeAsistenciaAlumnos = [];
  this.datos.forEach (dato => {
    let cont = 0;
    dato.asistencias.forEach (asistencia => {
      if (asistencia.tiempo !== undefined) {
        cont++;
      }
    });
    const p: number = Math.floor((cont * 100 / this.sesiones.length));
    this.porcentajeAsistenciaAlumnos.push (p);
  });

}
  // si cambiamos de tab saltamos aqui
  // onSelectChange(event) {
  //   if (event.index === 2) {
  //     // Aqui tenemos que preparar la información para la tabla de asistencia
  //     // Recupero las sesiones del grupo
  //     this.asistencias = [];
  //     let cont = 0;
  //     this.peticionesAPI.DameSesionesClaseGrupo (this.grupoSeleccionado.id).
  //     subscribe (sesiones => {
  //       this.sesiones = sesiones;
  //       console.log ('ya tengo las sesiones');
  //       console.log (this.sesiones);
  //       this.sesiones.forEach (sesion => this.peticionesAPI.DameAsistenciasClase (sesion.id).
  //         subscribe ( asistencias => {
  //               console.log ('asistencias a la sesion ' + sesion.Descripcion);
  //               console.log (asistencias);
  //               this.asistencias.push ({s: sesion, a: asistencias});
  //               cont++;
  //               if (cont === this.sesiones.length) {
  //                 // ha llegado toda la información y podemos preparar la tabla
  //                 this.PreparaTabla();
  //               }

  //          })
  //       );
  //     });
  //   }
  // }

  // PreparaTabla() {
  //   // ordeno las sesiones por la fecha
  //   this.asistencias.sort((a, b) => (a.s.Dia < b.s.Dia ? -1 : 1));

  //   this.asistencias.forEach (asistencia => {
  //     asistencia.a.sort((x, y) => (x.matriculaId < y.matriculaId));
  //   });

  //   this.tiempos = [];
  //   // preparo la matriz con los datos de asistencia
  //   this.porcentajeAsistenciaAlumnos = [];
  //   // tslint:disable-next-line:prefer-for-of
  //   for (let i = 0; i < this.alumnosGrupoSeleccionado.length ; i++) {
  //     console.log ('siguiente aluimno');
  //     const tiemposAlumno: any[] = [];
  //     let cont = 0;
  //     // tslint:disable-next-line:prefer-for-of
  //     for (let j = 0; j < this.asistencias.length ; j++) {
  //       console.log ('****');
  //       tiemposAlumno.push (this.asistencias[j].a[i].Hora);
  //       console.log (tiemposAlumno);
  //       if (this.asistencias[j].a[i].Hora !== undefined) {
  //         cont++;
  //       }
  //     }
  //     console.log ('tiempos del alumno');
  //     console.log (tiemposAlumno);
  //     const p: number = Math.floor((cont * 100 / this.asistencias.length));
  //     this.porcentajeAsistenciaAlumnos.push({
  //       matriculaId: this.asistencias[0].a[i].matriculaId,
  //       porcentaje: p,
  //       tiempos: tiemposAlumno
  //     });
  //   }
  //   console.log ('tiempos');
  //   console.log (this.tiempos);
  //   this.listaAlumnos = [];
  //   this.porcentajeAsistenciaAlumnos.forEach (item => {
  //     const alumnoId = this.matriculasGrupo.filter (matricula => matricula.id === item.matriculaId)[0].alumnoId;
  //     const alumno = this.alumnosGrupoSeleccionado.filter (al => alumnoId === al.id)[0];
  //     this.listaAlumnos.push (alumno);
  //   });
  //   console.log ('lista alumnos');
  //   console.log (this.listaAlumnos);
  // }

  GuardarFecha(e): void {
    this.fecha = e.target.value;
  }


  // CreaaSesion() {

  //   if ((!this.fecha) || (!this.descripcion)) {
  //     this.alertCtrl.create({
  //       header: 'Introduce dia/hora y descripción',
  //       buttons: ['OK']
  //     // tslint:disable-next-line:no-shadowed-variable
  //     }).then (res => res.present());

  //   } else {
  //     this.dia = this.fecha.split ('T')[0];
  //     this.diaParaAlerta = this.datePipe.transform(this.dia, 'dd-MM-yyyy');
  //     this.hora = this.fecha.split ('T')[1];

  //     this.alertCtrl.create({
  //       header: '¿Seguro que quieres crear esta sesión?',
  //       message: 'Dia: ' + this.diaParaAlerta + '<br>Hora: ' + this.hora + '<br>Descripcion: ' + this.descripcion,
  //       buttons: [
  //         {
  //           text: 'SI',
  //           handler: () => {
  //             this.marca = [];
  //             const asistenciasNuevaSesion = [];
  //             // Creo la lista de asistencias para esta nueve sesión, indicando que los tiempos aun no han sido registrados
  //             // Tambien preparo el vector de marcas con la misma información del tiempo. De ahí es de donce se mostrará
  //             // en html los tiempos de cada alumno
  //             this.alumnosDelGrupo.forEach (alumno => {
  //               asistenciasNuevaSesion.push ({
  //                 alumnoId: alumno.id,
  //                 tiempo: undefined
  //               });
  //               this.marca.push (undefined);
  //             });
  //             console.log ('ya tengo la asistencia de la nueva sesion');
  //             console.log (asistenciasNuevaSesion);

  //             // tslint:disable-next-line:max-line-length
  //             this.peticionesAPI.CreaSesionClase(new SesionClase (this.dia, this.hora, this.descripcion, asistenciasNuevaSesion), this.grupo.id)
  //             .subscribe((res) => {
  //               if (res != null) {
  //                     console.log ('ya tengo la sesión creada');
  //                     this.sesionCreada = true; // Si tiro atrás y cambio algo se hará un PUT y no otro POST
  //                     this.sesionClaseId = res.id;
  //                     this.nuevaSesion = res;
  //                     console.log (this.nuevaSesion);
  //                     this.asistenciaRegistrada = false;
  //                     this.sesiones.push (this.nuevaSesion);
  //                     this.sesiones.sort((a, b) => (a.Dia < b.Dia ? -1 : 1));
  //                     this.PrepararDatos();
  //                    // this.PreparaSesion (this.nuevaSesion);
  //                     this.alertCtrl.create({
  //                       header: 'Sesión creada',
  //                       buttons: ['OK']
  //                     // tslint:disable-next-line:no-shadowed-variable
  //                     }).then (res => res.present());
  //               } else {
  //                 this.alertCtrl.create({
  //                   header: 'Error al crear la sesión',
  //                   buttons: ['OK']
  //                 // tslint:disable-next-line:no-shadowed-variable
  //                 }).then (res => res.present());

  //               }
  //             });
  //           }
  //         },
  //         {
  //           text: 'NO',
  //           role: 'cancel',
  //           handler: () => {
  //           }
  //         }
  //       ]
  //     }).then (res => res.present());
  //   }

  // }


  CrearSesion() {
    // Verificamos que la hora se ha introducido en el formato hh:mm
    const regex = /([0-2])([0-9]):([0-5])([0-9])/;
    if (regex.test(this.horaSesion)) {
      this.marca = [];
      const asistenciasNuevaSesion = [];
      // Creo la lista de asistencias para esta nueve sesión, indicando que los tiempos aun no han sido registrados
      // Tambien preparo el vector de marcas con la misma información del tiempo. De ahí es de donce se mostrará
      // en html los tiempos de cada alumno
      this.alumnosDelGrupo.forEach (alumno => {
        asistenciasNuevaSesion.push ({
          alumnoId: alumno.id,
          tiempo: undefined
        });
        this.marca.push (undefined);
      });
      console.log ('ya tengo la asistencia de la nueva sesion');
      console.log (asistenciasNuevaSesion);
      // tslint:disable-next-line:max-line-length
      this.peticionesAPI.CreaSesionClase(new SesionClase (this.fecha, this.horaSesion, this.descripcionSesion, asistenciasNuevaSesion), this.grupoSeleccionado.id)
      .subscribe((res) => {
        if (res != null) {
          console.log('Ya se ha creado el grupo ' + res);
          this.sesionCreada = true; // Si tiro atrás y cambio algo se hará un PUT y no otro POST
          this.sesionClaseId = res.id;
          this.nuevaSesion = res;
          Swal.fire('Sesión de clase creada correctamente');
          this.horaSesion = null;
          this.descripcionSesion = null;
          this.sesiones.push (this.nuevaSesion);
          this.sesiones.sort((a, b) => (a.Dia < b.Dia ? -1 : 1));
          this.PrepararDatos();
        } else {
          console.log('Fallo en la creación');
          Swal.fire('Se ha producido un error creando el grupo', 'ERROR', 'error');
        }
      });
    } else {
      Swal.fire('Error en el formato de la hora de inicio', 'ERROR', 'error');
    }

  }
  // Filtro para alumnos
    applyFilter(filterValue: string) {

      console.log ('aplicamos filtro ' + filterValue);
      console.log (this.dataSource);
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }




    /** Whether the number of selected elements matches the total number of rows. */
    IsAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.alumnosDelGrupo.length;
      return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    MasterToggle() {
      if (this.IsAllSelected()) {
        this.selection.clear();
        for (let i = 0; i < this.datos.length; i++) {
          const asistencia = this.datos [i].asistencias.find (a => a.sesionId === this.sesionClaseId);
          asistencia.tiempo = undefined;
          this.marca[i] = undefined;
        }

      } else {

        for (let i = 0; i < this.alumnosDelGrupo.length; i++) {
          if (!this.selection.isSelected( this.alumnosDelGrupo[i])) {

            let marca: string;

            const d = new Date();
            if (d.getMinutes() < 10 ) {
              marca = d.getHours() + ':0' + d.getMinutes();
            } else {
              marca = d.getHours() + ':' + d.getMinutes();
            }

            this.selection.select(this.alumnosDelGrupo[i]);
            const asistencia = this.datos [i].asistencias.find (a => a.sesionId === this.sesionClaseId);
            asistencia.tiempo = marca;
            this.marca[i] = marca;
          }

        }
      }
    }

  /* Esta función decide si el boton debe estar activo (si hay al menos
  una fila seleccionada) o si debe estar desactivado (si no hay ninguna fila seleccionada) */
  ActualizarBotonTabla(i) {
    if (this.selection.selected.length === 0) {
      this.botonTablaDesactivado = true;
    } else {
      this.botonTablaDesactivado = false;
    }
    if (!this.selection.isSelected(this.alumnosDelGrupo[i])) {
      const asistencia = this.datos [i].asistencias.find (a => a.sesionId === this.sesionClaseId);
      asistencia.tiempo = undefined;
      this.marca[i] = undefined;
    } else {
      let marca: string;
      const d = new Date();
      if (d.getMinutes() < 10 ) {
        marca = d.getHours() + ':0' + d.getMinutes();
      } else {
        marca = d.getHours() + ':' + d.getMinutes();
      }

      const asistencia = this.datos [i].asistencias.find (a => a.sesionId === this.sesionClaseId);
      asistencia.tiempo = marca;
      this.marca[i] = marca;
    }
  }




RegistrarAsistencia() {
  // Llamaré aquí cuando haya registrado la asistencia de los alumnos en una sesión recien creada
  // Recogo las asistencias de la sesión tal y como han quedado guardadas en datos para agregarlas
  // a la información de la sesión
  const asistenciasNuevaSesion = [];
  this.datos.forEach (dato => {
    const alId = dato.alumno.id;
    const t =  dato.asistencias.find (a => a.sesionId === this.sesionClaseId).tiempo;
    asistenciasNuevaSesion.push ({
      alumnoId: alId,
      tiempo: t
    });
  });
  let mensaje;
  this.nuevaSesion.Asistencia = asistenciasNuevaSesion;
  console.log ('tengo las nuevas asistencias');
  console.log (asistenciasNuevaSesion);
  if (!this.marca.some (m => m !== undefined)) {
    mensaje = 'No has marcado la hora de llegada de ningún alumno'
  }

  Swal.fire({
        title: '¿Estas seguro de que quieres registrer la asistencia en este momento?',
        text: mensaje,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, estoy seguro'
  }).then((result) => {
        if (result.value) {
          this.peticionesAPI.ModificaSesionClase (this.nuevaSesion)
          .subscribe (sesion => {
                this.PrepararDatos();
          });
          Swal.fire('Asistencia registrada con éxito');
          this.location.back();
        }
  });
}

  ElegirAleatoriamente() {
    console.log ('Entramos');
    const numeroAlumnos = this.alumnosDelGrupo.length;
    const elegido = Math.floor(Math.random() * numeroAlumnos);
    const alumnoElegido = this.alumnosDelGrupo[elegido];
    console.log ('Hemos elegido a ' + elegido);
    Swal.fire(alumnoElegido.Nombre + ' ' + alumnoElegido.PrimerApellido, 'Enhorabuena', 'success');

  }

  goBack() {
    this.location.back();
  }


  // this.peticionesAPI.CreaGrupo(new Grupo(nombreGrupo, descripcionGrupo), this.profesorId)
  //   .subscribe((res) => {
  //     if (res != null) {
  //       console.log('Ya se ha creado el grupo ' + res);
  //       this.grupoYaCreado = true; // Si tiro atrás y cambio algo se hará un PUT y no otro POST
  //       this.grupo = res;
  //     } else {
  //       console.log('Fallo en la creación');
  //       Swal.fire('Se ha producido un error creando el grupo', 'ERROR', 'error');
  //     }
  //   });

  NuevaObservacion(sesion: SesionClase) {
    Swal.fire({
      title: "Introduce la nueva observación",
      input: 'textarea',
      showCancelButton: true
    }).then((result : any) => {
      if (result.value) {
        if (sesion.Observaciones === undefined) {
          sesion.Observaciones = [];
        }
        sesion.Observaciones.push (result.value);
        this.peticionesAPI.ModificaSesionClase (sesion)
        .subscribe ();
      }
    });
  }

  EliminarObservacion(sesion: SesionClase, i: number) {
    Swal.fire({
      title: '¿Estas seguro que quieres eliminar la observación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {
        sesion.Observaciones.splice (i, 1);
        this.peticionesAPI.ModificaSesionClase (sesion)
        .subscribe ();
      }
    });
  }
//   EditarObservacionn(sesion: SesionClase, i: number)  {

//     Swal.fire({
//       title: "Enter your Name!",
//       text: "<textarea id='text'></textarea>",
//       // --------------^-- define html element with id
//       html: true,
//       showCancelButton: true,
//       closeOnConfirm: false,
//       showLoaderOnConfirm: true,
//       animation: "slide-from-top"
//     // tslint:disable-next-line:only-arrow-functions
//     }).then((result) => {
//       if (inputValue === false) {
//         return false;
//       }
//       // get value using textarea id
//       var val = document.getElementById('text').value;

//     });
// }


  EditarObservacion(sesion: SesionClase, i: number)  {
    Swal.fire({
      title: "Modifica la observación",
      inputValue: sesion.Observaciones[i],
      input: 'textarea',
      showCancelButton: true
    }).then((result : any) => {
      if (result.value) {
        sesion.Observaciones[i] = result.value;
        this.peticionesAPI.ModificaSesionClase (sesion)
        .subscribe ();
      }
    });
  }
}

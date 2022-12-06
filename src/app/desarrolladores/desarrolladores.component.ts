import { Component, OnInit, ViewChild } from '@angular/core';

import {MatTableDataSource} from '@angular/material/table';

/* Necesario para controlar qué filas están seleccionadas */
import {SelectionModel} from '@angular/cdk/collections';

/* Imports necesarios para la ordenación y la paginación */
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

/* Necesario para el stepper */
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Elementos necesarios para el diálogo
import { MatDialog, MatTabGroup } from '@angular/material';
import {DialogoComponent} from './dialogo/dialogo.component';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-desarrolladores',
  templateUrl: './desarrolladores.component.html',
  styleUrls: ['./desarrolladores.component.scss']
})
export class DesarrolladoresComponent implements OnInit {

  profesor: any = [];


  elementoSeleccionado: any; // Lo usará el selector
  // Estos son los elementos que mostrará el selector
  listaElementos: string[] = ['uno', 'dos', 'tres', 'cuatro', 'cinco'];
  // Aqui construirá la función AcciónConSeleccionado la frase que se mostrará
  // en pantalla una vez seleccionado el elemento
  resultadoSelector: string;

  /* Esta variable determina si el boton de la tabla está activo o no
    Debe estar activo si hay al menos un elemento de la lista seleccionado */
  botonTablaDesactivado = true;

  // Aquí se construira una frase con los elementos de la tabla elegidos
  elegidosTabla: string;


  /* Estructura necesaria para determinar que filas son las que se han seleccionado */
  selection = new SelectionModel<any>(true, []);
  /* Estos son los identificadores de las columnas de la tabla */
  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
 /* Los datos que se mostrarán en la tabla
 El campo opinion es para el ejemplo del acordeon */
 listaElementosQuimicos = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', opinion: 'No se'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He',  opinion: 'No se'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', opinion: 'No se'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', opinion: 'No se'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B', opinion: 'No se'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', opinion: 'No se'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', opinion: 'No se'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', opinion: 'No se'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', opinion: 'No se'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', opinion: 'No se'},
];

  dataSource = new MatTableDataSource (this.listaElementosQuimicos);
  // Para el stepper necesitamos dos formularios (uno para cada paso)
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  // Cada paso del stepper tiene un botón para avanzar que solo debe estar
  // activo si se han introducido todos los datos del formulario
  // Las siguientes variables controlan si hay que activar o no esos botones

  botonPaso1Desactivado = true;
  botonPaso2Desactivado = true;

  // Persona que crearemos con el stepper
  persona: any;

  // Aquí se construirá la frase para mostrar los datos de la persona creada con el stepper
  resultadoStepper: string;


  // Para el ejemplo de card

  ciudad: string;
  descripcionCiudad: string;
  botonActivo = false;
  fraseCard: string;



  opcion; // opcion elegida para el tipo de grafico


  // Las tres opciones para la demo de graficos

  estratos = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['X-1', 'X-2', 'X-3', 'X-4', 'X-5']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'X-1',
        type: 'line',
        stack: 'counts',
        areaStyle: { normal: {} },
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'X-2',
        type: 'line',
        stack: 'counts',
        areaStyle: { normal: {} },
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'X-3',
        type: 'line',
        stack: 'counts',
        areaStyle: { normal: {} },
        data: [150, 232, 201, 154, 190, 330, 410]
      },
      {
        name: 'X-4',
        type: 'line',
        stack: 'counts',
        areaStyle: { normal: {} },
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: 'X-5',
        type: 'line',
        stack: 'counts',
        label: {
          normal: {
            show: true,
            position: 'top'
          }
        },
        areaStyle: { normal: {} },
        data: [820, 932, 901, 934, 1290, 1330, 1320]
      }
    ]
  };




  barras = {
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [{
      type: 'value'
    }],
    series: [{
      name: 'Counters',
      type: 'bar',
      barWidth: '60%',
      data: [10, 52, 200, 334, 390, 330, 220]
    }]
  };

  donut = {

    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
        orient: 'vertical',
        left: 10,
        data: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes']
    },
    series: [
        {
            name: 'actividad',
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
            data: [
                {value: 335, name: 'lunes'},
                {value: 310, name: 'martes'},
                {value: 234, name: 'miercoles'},
                {value: 135, name: 'jueves'},
                {value: 1548, name: 'viernes'}
            ]
        }
    ]
};


  constructor(
                private formBuilder: FormBuilder,
                public dialog: MatDialog
   ) { }

  /* Anotaciones necesarias para la ordenación y la paginación */
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  ngOnInit() {

    /* Instrucciones necesarias para la ordenación y la paginación */
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // Indico los campos que tendrá cada uno de los dos formularios que se usan en el stepper
    this.firstFormGroup = this.formBuilder.group({
      nombre: ['', Validators.required],
      edad: ['', Validators.required],

    });
    this.secondFormGroup = this.formBuilder.group({
      calle: ['', Validators.required],
      ciudad: ['', Validators.required],
    });
  }


   // Esta es la función que se ejecuta cuando se selecciona un elemento
  // con el selector. Simplemente construimos una frase que se mostrará en pantalla
  AccionConSeleccionado() {
    this.resultadoSelector = 'Has seleccionado: ' + this.elementoSeleccionado;
  }

  /* Esta función se llama cuando se quiere aplicar el filtro al dataSource de la tabla */
  AplicarFiltro(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /* Al clicar el boton de la tabla simplemente preparamos una frase con los
  nombres de las personas seleccionadas */
  ProcesarSeleccionados() {
    this.elegidosTabla = 'Estos son los elegidos: ';
    this.dataSource.data.forEach
      (row => {
                if (this.selection.isSelected(row))  {
                  this.elegidosTabla = this.elegidosTabla + row.name + ', ' ;
                }
            }
      );
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


  /* Esta función decide si el boton debe estar activo (si hay al menos
  una fila seleccionada) o si debe estar desactivado (si no hay ninguna fila seleccionada) */
  ActualizarBotonTabla() {
    if (this.selection.selected.length === 0) {
      this.botonTablaDesactivado = true;
    } else {
      this.botonTablaDesactivado = false;
    }
  }



  // MIRO SI HAY ALGO SIMULTÁNEAMENTE EN EL NOMBRE Y LA EDAD
  BotonPaso1() {
    if (this.firstFormGroup.value.nombre === '' || this.firstFormGroup.value.edad === '') {
      // Si alguno de los valores es igual a nada, entonces estará desactivado
      console.log ('desactivo');
      this.botonPaso1Desactivado = true;
    } else {
      // Si ambos son diferentes a nulo, estará activado.
      this.botonPaso1Desactivado = false;
      console.log ('activo');
    }
  }

  // MIRO SI HAY ALGO SIMULTÁNEAMENTE EN EL NOMBRE Y LA EDAD
  BotonPaso2() {
    if (this.secondFormGroup.value.calle === '' || this.secondFormGroup.value.ciudad === '') {
      // Si alguno de los valores es igual a nada, entonces estará desactivado
      this.botonPaso2Desactivado = true;
    } else {
      // Si ambos son diferentes a nulo, estará activado.
      this.botonPaso2Desactivado = false;
    }
  }
  CrearPersona() {
    this.persona = [];
    this.persona.nombre = this.firstFormGroup.value.nombre;
    this.persona.edad = this.firstFormGroup.value.edad;
  }
  PonDomicilio() {
    this.persona.calle = this.secondFormGroup.value.calle;
    this.persona.ciudad = this.secondFormGroup.value.ciudad;
  }
  Mostrar() {
    this.resultadoStepper = 'Nombre: ' + this.persona.nombre +
                            ', Edad: ' + this.persona.edad +
                            ', Calle: ' + this.persona.calle +
                            ', Ciudad: ' + this.persona.ciudad;
  }

  Reiniciar() {
    this.resultadoStepper = '';
    this.botonPaso1Desactivado = true;
    this.botonPaso2Desactivado = true;
  }


  DialogoParaCambiarOpinion(opinion: string, i: number): void {

    // Abrimos el dialogo y le pasamos como parametro la opinión actual
      const dialogRef = this.dialog.open(DialogoComponent, {
        height: '300px', // Tamaño del diálogo
        data: {
          op: opinion
        }
      });

      // Recogemos el resultado del dialogo, que es la nueva opinión, la guardamos en la
      // lista y mostramos un mensaje informativo que dura 2 segundos
      dialogRef.afterClosed().subscribe((nuevaOpinion: string) => {
        console.log ('Nueva opinion: ' +  nuevaOpinion);
        this.listaElementosQuimicos[i].opinion = nuevaOpinion;
        Swal.fire('Opinion modificada', 'Nueva opinion modificada y guardada correctamente', 'success');
      });
    }

  Disabled() {

    if (this.ciudad !== undefined && this.descripcionCiudad !== undefined) {
      this.botonActivo = true;
    }
  }

  LimpiarCampos() {
    this.ciudad = undefined;
    this.descripcionCiudad = undefined;
    this.botonActivo = false;
    this.fraseCard = undefined;
  }

  Registrar() {
    this.fraseCard = 'Tu ciudad es ' + this.ciudad + 'y tu descripción es ' + this.descripcionCiudad;
  }
}

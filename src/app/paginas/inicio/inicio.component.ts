import { Component, OnInit, Input , ViewChild} from '@angular/core';
import { Grupo, Profesor, Juego } from '../../clases/index';
import { Location } from '@angular/common';

import {MatTableDataSource} from '@angular/material/table';

/* Necesario para controlar qué filas están seleccionadas */
import {SelectionModel} from '@angular/cdk/collections';

/* Imports necesarios para la ordenación y la paginación */
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { Router } from '@angular/router';



// Servicios
import {SesionService, PeticionesAPIService, CalculosService} from '../../servicios/index';



@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'grupo', 'tipo', 'modo', ' '];
  dataSource;
  juegosActivos: Juego[] = [];
  listaGrupos: Grupo[];
  profesor: Profesor;
  tabla: any [] = [];

  date: Date = new Date();
  settings = {
      bigBanner: true,
      timePicker: true,
      format: 'dd-MM-yyyy-hh:mm',
      defaultOpen: true
  }
  alumnos: any[];
 
  constructor(  private peticionesAPI: PeticionesAPIService,
                private sesion: SesionService,
                private calculos: CalculosService,
                private router: Router) { }


  @ViewChild(MatSort, {static: false}) sort: MatSort;

  ngOnInit() {
    this.profesor = this.sesion.DameProfesor();
    this.ObtenJuegosActivosDelProfesor();
  }

  // ObtenJuegosActivosDelProfesor_old() {
  //   this.peticionesAPI.DameGruposProfesor(this.profesor.id)
  //   .subscribe(res => {
  //     this.listaGrupos = res;
  //     if (res[0] !== undefined) {
  //       let cont = 0;
  //       this.listaGrupos.forEach (grupo => {
          
  //         this.calculos.DameListaJuegos(grupo.id)
  //         .subscribe ( listas => {
  //                 this.juegosActivos = this.juegosActivos.concat (listas.activos);
  //                 cont = cont + 1;
  //                 if (cont === this.listaGrupos.length) {
  //                   this.PreparaTabla();
  //                 }
  //         });
  //       });
  //     }
  //   });
  // }


  ObtenJuegosActivosDelProfesor() {
    this.peticionesAPI.DameGruposProfesor(this.profesor.id)
    .subscribe(res => {
      this.listaGrupos = res;
      if (res[0] !== undefined) {
        let cont = 0;
        this.listaGrupos.forEach (async grupo => {
          // Obtenemos la lista de juegos del grupo. La función nos devuelve una Promise y esperamos 
          // el resultado con el await.
          console.log ('voy a por los juegos del grupo ', grupo);
          const listas =  await this.calculos.DameListaJuegos(grupo.id);
          this.juegosActivos = this.juegosActivos.concat (listas.activos);
          cont ++;
          if (cont === this.listaGrupos.length) {
            console.log ('YA LOS TENGO ', this.juegosActivos);
            console.log ('voy a preparar la tabla');
            this.PreparaTabla();
          }

        });
       
      }
    });
  }



PreparaTabla() {
  console.log ('voy a preparar tabla. Esta es la lista de juegos activos');
  console.log (this.juegosActivos);
  this.juegosActivos.forEach ( juego => {
    this.tabla.push ({
                              nombre : juego.NombreJuego,
                              grupo : this.listaGrupos.filter (g => g.id === juego.grupoId)[0].Nombre,
                              tipo : juego.Tipo,
                              modo : juego.Modo,
                              todoElJuego: juego
                    });
  });
  this.dataSource = new MatTableDataSource(this.tabla);
  this.dataSource.sort = this.sort;
}

MostrarJuegoSeleccionado(juego: Juego) {
  console.log (juego);
  const juegoSeleccionado = juego.todoElJuego;
  this.sesion.TomaJuego(juegoSeleccionado);
  this.router.navigate(['/grupo/' + juegoSeleccionado.grupoId + '/juegos/juegoSeleccionadoActivo']);
}


}

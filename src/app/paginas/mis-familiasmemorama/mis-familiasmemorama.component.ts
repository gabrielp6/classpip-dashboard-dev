import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Carta, Coleccion, Familia } from 'src/app/clases';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-familiasmemorama',
  templateUrl: './mis-familiasmemorama.component.html',
  styleUrls: ['./mis-familiasmemorama.component.scss']
})
export class MisFamiliasmemoramaComponent implements OnInit {
  profesorId: number;


  familiasProfesor: Familia[] = [];
  familiasPublicas: Familia[];
  cartasFamilia: Carta[];
  imagenFamilia: string;

  numeroDeCartas: number;

  file: File;
  imagenFamiliaFile: File;
  dataSource;
  dataSourcePublicas;
  propietarios: string[];

  // PARA DIÁLOGO DE CONFIRMACIÓN
  // tslint:disable-next-line:no-inferrable-types

  displayedColumns: string[] = ['nombre', 'iconos'];
  //displayedColumns: string[] = ['nombre', 'edit', 'delete', 'copy', 'publica'];
  displayedColumnsPublica: string[] = ['nombre', 'copy'];

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public sesion: SesionService,
    public peticionesAPI: PeticionesAPIService,
  ) { }

  ngOnInit() {

    // REALMENTE LA APP FUNCIONARÁ COGIENDO AL PROFESOR DEL SERVICIO, NO OBSTANTE AHORA LO RECOGEMOS DE LA URL
    // this.profesorId = this.profesorService.RecibirProfesorIdDelServicio();
    this.profesorId = this.sesion.DameProfesor().id;

    console.log(this.profesorId);

    this.TraeFamiliasDelProfesor();
    this.DameTodasLasFamiliasPublicas();



  }

  TraeFamiliasDelProfesor() {

    this.peticionesAPI.DameFamiliasDelProfesor(this.profesorId)
      .subscribe(familias => {
        if (familias[0] !== undefined) {
          console.log('Voy a dar la lista');
          this.familiasProfesor = familias;
          this.dataSource = new MatTableDataSource(this.familiasProfesor);
          // this.profesorService.EnviarProfesorIdAlServicio(this.profesorId);
        } else {
          this.familiasProfesor = undefined;
        }

      });
  }


  DameTodasLasFamiliasPublicas() {
    // traigo todos los publicos excepto los del profesor
    this.peticionesAPI.DameFamiliasPublicas()
      .subscribe(res => {
        console.log('familias publicas');
        console.log(res);

        if (res[0] !== undefined) {
          this.familiasPublicas = res.filter(familia => familia.profesorId !== this.profesorId);
          if (this.familiasPublicas.length === 0) {
            this.familiasPublicas = undefined;

          } else {
            this.dataSourcePublicas = new MatTableDataSource(this.familiasPublicas);
            this.propietarios = [];
            // Traigo profesores para preparar los nombres de los propietarios
            this.peticionesAPI.DameProfesores()
              .subscribe(profesores => {
                this.familiasPublicas.forEach(familia => {
                  const propietario = profesores.filter(p => p.id === familia.profesorId)[0];
                  this.propietarios.push(propietario.Nombre + ' ' + propietario.PrimerApellido);
                });
              });
          }
        }
      });
  }



  EditarFamilia(familia: Familia) {

    // // Busca los cromos dela coleccion en la base de datos
    // this.peticionesAPI.DameCartasFamilia(familia.id)
    // .subscribe(res => {
    //     this.cartasFamilia = res;
    //     this.sesion.TomaFamilia(familia);
    //     this.sesion.TomaCartas (this.cartasFamilia);
    //     this.router.navigate(['/inicio/' + this.profesorId + '/misColecciones/editarColeccion']);

    // });
  }



  Descargar(familia: Familia) {

    // this.sesion.TomaColeccion(coleccion);
    // this.router.navigate(['/inicio/' + this.profesorId + '/misColecciones/guardarColeccion']);

  }


  Mostrar(familia: Familia) {

    // this.sesion.TomaColeccion(coleccion);
    // this.router.navigate(['/inicio/' + this.profesorId + '/misColecciones/mostrarColeccion']);

  }



  BorrarFamilia(familia: Familia) {


    this.peticionesAPI.BorrarImagenFamilia(familia.ImagenFamilia).subscribe();

    this.peticionesAPI.DameCartasFamilia(familia.id)
      .subscribe(res => {
        this.cartasFamilia = res;

        // Ya puedo borrar la colección
        this.peticionesAPI.BorraFamiliaMemorama(familia.id, familia.profesorId)
          .subscribe();


        if (this.cartasFamilia !== undefined) {
          for (let i = 0; i < (this.cartasFamilia.length); i++) {
            this.peticionesAPI.BorrarCarta(this.cartasFamilia[i].id).subscribe();
            this.peticionesAPI.BorrarImagenCarta(this.cartasFamilia[i].imagenDelante).subscribe();
          }
          // Borro la imagen del dorso. El nombre del fichero aparece en cualquiera de las cartas
          this.peticionesAPI.BorrarImagenCarta(this.cartasFamilia[0].imagenDetras).subscribe();
        }
      });
    console.log('La saco de la lista');
    this.familiasProfesor = this.familiasProfesor.filter(res => res.id !== familia.id);
    this.dataSource = new MatTableDataSource(this.familiasProfesor);
  }




  EliminarFamilia(familia: Familia): void {
    Swal.fire({
      title: 'Eliminar',
      text: "Estas segura/o de que quieres eliminar la familia: " + familia.Nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'

    }).then((result) => {
      if (result.value) {
        this.BorrarFamilia(familia);
        Swal.fire('Eliminada', familia.Nombre + ' eliminada correctamente', 'success');

      }
    });

  }

  HazPublica(familia: Familia) {
    familia.Publica = true;
    this.peticionesAPI.ModificaFamilia(familia).subscribe();
  }


  HazPrivada(familia: Familia) {
    familia.Publica = false;
    this.peticionesAPI.ModificaFamilia(familia).subscribe();
  }
  TraeCartasEImagenesFamilia(familia: Familia) {
    this.peticionesAPI.DameImagenFamiliaMemorama(familia.ImagenFamilia)
      .subscribe(imagen => this.imagenFamiliaFile = imagen);
    this.peticionesAPI.DameCartasFamilia(familia.id)
      .subscribe(cartas => {
        this.cartasFamilia = cartas;
      });
  }

}

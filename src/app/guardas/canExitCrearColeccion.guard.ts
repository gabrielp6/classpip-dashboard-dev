import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CrearColeccionComponent } from '../paginas/crear-coleccion/crear-coleccion.component';

// Esta es la guarda para impedir que se abandone una página a menos que se confirme
@Injectable()
export class DeactivateGuardCrearColeccion {
    // tslint:disable-next-line:ban-types
    component: Object;
    route: ActivatedRouteSnapshot;
   constructor() {
   }

   canDeactivate( component: CrearColeccionComponent,
                  route: ActivatedRouteSnapshot,
                  state: RouterStateSnapshot,
                  nextState: RouterStateSnapshot): Observable <boolean> {
        return component.canExit();
  }
}



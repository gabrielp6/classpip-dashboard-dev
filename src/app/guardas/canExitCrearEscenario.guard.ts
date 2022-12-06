import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CrearEscenarioComponent } from '../paginas/crear-escenario/crear-escenario.component';

// Esta es la guarda para impedir que se abandone una página a menos que se confirme
@Injectable()
export class DeactivateGuardCrearEscenario {
    // tslint:disable-next-line:ban-types
    component: Object;
    route: ActivatedRouteSnapshot;
   constructor() {
   }

   canDeactivate( component: CrearEscenarioComponent,
                  route: ActivatedRouteSnapshot,
                  state: RouterStateSnapshot,
                  nextState: RouterStateSnapshot): Observable <boolean> {
        return component.canExit();
  }
}



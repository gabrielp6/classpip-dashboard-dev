import { Juego } from './../../clases/Juego';
import Swal from 'sweetalert2';
import { PeticionesAPIService, ComServerService } from 'src/app/servicios';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';


const reActivarJuego =  (): any=> {
   
  return Swal.fire({
      title: '¿Seguro que quieres activar el juego ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
  })


}


export { reActivarJuego }


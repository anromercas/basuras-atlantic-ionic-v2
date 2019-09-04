import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';

@Pipe({
  name: 'imagenDetalle',
})
export class ImagenDetallePipe implements PipeTransform {
  
  transform(img: string,  tipo: string = "basuras") {

    let url = URL_SERVICIOS + '/imagen';

    if ( !img ){
      return url + '/basuras/xxx';
    }

    switch (tipo) {
      case 'usuarios':
        url += '/usuarios/' + img;
      break;

      case 'basuras':
        url += '/basuras/' + img;
      break;

      case 'imgcontenedor':
        url += '/imgcontenedor/' + img;
      break;

      case 'imgdetalle':
        url += '/imgdetalle/' + img;
      break;

      case 'imgLocal':
        url = img;
      break;

      default:
      console.log('Tipo de imagen no existe, usuarios, basuras, imgcontenedor, imgdetalle, imgLocal');
      url += '/basuras/xxx';
    }
      return url;
  }
}

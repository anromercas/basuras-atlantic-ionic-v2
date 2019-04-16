import { Injectable } from '@angular/core';
import { Basura } from '../../interfaces/basura.interface';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UsuarioProvider } from '../usuario/usuario';
import { URL_SERVICIOS } from '../../config/config';

@Injectable()
export class CargaArchivoProvider {

  

  constructor(  private usuarioProviver: UsuarioProvider,
                private http: HttpClient ) {
   
  }

  cargar_imagen_basura( basura: Basura, tipo: string ){

    const headers = new HttpHeaders({
      'token': this.usuarioProviver.token
    });

    console.log(basura);

    this.http.put(`${ URL_SERVICIOS }/upload/${ tipo }/${ basura._id }`, 'img', {headers})
              .subscribe( res => {
                console.log(res);
              });

  }



  

}

import { Injectable } from '@angular/core';
import { Basura } from '../../interfaces/basura.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioProvider } from '../usuario/usuario';
import { ToastController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@Injectable()
export class BasuraProvider {

  constructor(private http: HttpClient,
              private usuarioProviver: UsuarioProvider,
              public toastCtrl: ToastController,
              private fileTransfer: FileTransfer
              ) {
  }

  // Crea una basura
  crearBasura( basura: Basura ){

    const headers = new HttpHeaders({
      'token': this.usuarioProviver.token
    });
    let url = URL_SERVICIOS + '/basura';
    return this.http.post( url, basura, {headers} )
                    .map( (resp: any) => {
                      console.log(resp);
                      return resp;
                    });
  }

  subirImagen(img: string, tipo: string = 'basuras', id: string) {

    const options: FileUploadOptions = {
      fileKey: 'img',
      httpMethod: 'put',
      mimeType: 'image/jpeg',
      headers: {
        'token': this.usuarioProviver.token
      }
    };

    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    fileTransfer.upload( img, `${URL_SERVICIOS}/upload/${tipo}/${id}`, options )
                .then( data => {
                  console.log(data);
                }).catch( err => {
                  console.log('Error en carga', err);
                });

  }

  // Devuelve una basura por su id
  obtenerBasura( id: string ) {

    const headers = new HttpHeaders({
      'token': this.usuarioProviver.token
    });
    let url = URL_SERVICIOS + '/basura/' + id;
    return this.http.get( url, {headers})
                    /* .map( (resp: any) => {
                      console.log(resp);
                      return resp;
                    }); */
  }

  // Actualiza una Basura
  actualizarBasura( id: string, basura: Basura ){

    const headers = new HttpHeaders({
      'token': this.usuarioProviver.token
    });
    let url = URL_SERVICIOS + '/basura/' + id;
    return this.http.put( url, basura, {headers} )
                    /* .map( (resp: any) => {
                      console.log(resp);
                      return resp;
                    }); */
  }
 
  // Lista todas las Basuras
  listarBasuras(){

    const headers = new HttpHeaders({
      'token': this.usuarioProviver.token
    });
    let url = URL_SERVICIOS + '/basura';
    return this.http.get( url, {headers} );    
  }

  // Borra una basura
  borrarBasura(id: string){
    const headers = new HttpHeaders({
      'token': this.usuarioProviver.token
    });
    let url = URL_SERVICIOS + '/basura/' + id; 
    return this.http.delete( url, {headers})
                    .map( (resp: any) =>{
                        return resp;
                    });
  }

  // Crea un registro de historico de una basura
  crearHistorico( basura: Basura ) {
    const headers = new HttpHeaders({
      'token': this.usuarioProviver.token
    });
    let url = URL_SERVICIOS + '/historico'; 
    return this.http.post( url, basura, {headers})
                    .map( (resp: any) =>{
                        console.log(resp);
                        return resp;
                    });
  }

  // Devuelve todos los registros de una basura por su codigo de contenedor único
  obtenerHistoricoBasura (codigoContenedor: string) {

    const headers = new HttpHeaders({
      'token': this.usuarioProviver.token
    });
    let url = URL_SERVICIOS + '/historico/' + codigoContenedor; 
    return this.http.get( url, {headers})
                    .map( (resp: any) =>{
                        return resp;
                    });
  }

  mostrar_toast( mensaje: string ){
    const toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }

}

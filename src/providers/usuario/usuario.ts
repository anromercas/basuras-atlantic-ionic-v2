import { Injectable } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { URL_SERVICIOS } from '../../config/config';

import { Storage } from '@ionic/storage';
import { Usuario } from '../../interfaces/usuario.interface';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class UsuarioProvider {

  clave:string;
  usuario: Usuario;
  token: string;

  constructor(private http: HttpClient,
              private platform: Platform,
              private storage: Storage,
              public toastCtrl: ToastController,) {
    
  }

  login( email:string, password:string ){

    let url = URL_SERVICIOS + '/login';
    let usr = {
      email: email,
      password: password
    }

    return new Promise ( resolve => {

      this.http.post( url, usr )
                      .subscribe( (resp: any) => {
                        console.log(resp);
                        if( resp['ok'] ){
                          this.usuario = resp.usuario;
                          this.token = resp.token;
                          this.guardarStorage();
                          resolve(true);
                        } 
                      }, (error:any) => {
                          this.token = null;
                          this.borrarStorage();
                          resolve(false);
                      });
    });
    
  }

  renuevaToken(){
    let url = URL_SERVICIOS + '/login/renuevatoken';

    return this.http.get( url )
                    .map( (resp: any) => {
                      this.token = resp.token;
                      this.guardarStorage();

                      return true;
                    });
  }

  borrarStorage(){
    if(this.platform.is('corodova')){
      this.storage.remove('usuario');
      this.storage.remove('token');
    } else {
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
    }
  }

  guardarStorage(){
    if(this.platform.is('corodova')){
      this.storage.set('usuario', this.usuario);
      this.storage.set('token', this.token);
    } else {
      localStorage.setItem('usuario',JSON.stringify (this.usuario));
      localStorage.setItem('token', this.token);
    }
  }

  cargarStorage() {
    return new Promise( (resolve, reject) =>{
      if(this.platform.is('corodova')){

        this.storage.get('token').then( val => {

          if( val ) {
            this.token = val;
            resolve(true);
          } else {
            resolve(false);
          }

        });
        
      } else {
        if( localStorage.getItem('token') ) {
          this.token = localStorage.getItem('token');
          resolve(true);
        } else {
          resolve(false);
        }
      }
    })
  }

  mostrar_toast( mensaje: string ){
    const toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }

}

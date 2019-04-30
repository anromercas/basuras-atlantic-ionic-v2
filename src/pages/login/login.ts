import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { UsuarioProvider } from '../../providers/usuario/usuario';
import { HomePage } from '../home/home';
import { NgForm } from '@angular/forms';
import { UiProvider } from '../../providers/ui/ui';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

 loginUser = {
   email: '',
   password: ''
 }

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public _usuarioProvider: UsuarioProvider,
    public uiProv: UiProvider) {
  }

  async login( fLogin: NgForm ) {

    if( fLogin.invalid ) { return; }
    const valido = await this._usuarioProvider.login( this.loginUser.email, this.loginUser.password );
   
    if(valido){
      // navegar al HomePage
      this.navCtrl.setRoot(HomePage, {}, {animate: true, animation: 'wp-transition'});
    } else {
      // mostrar alerta de usuario y contraseña no correctas
      this.uiProv.alertaInformativa('Error en el Login','Usuario o contraseña incorrectos');
    }

  }


}

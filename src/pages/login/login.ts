import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { UsuarioProvider } from '../../providers/usuario/usuario';
import { HomePage } from '../home/home';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

 // @ViewChild(Slides) slides: Slides;

 loginUser = {
   email: 'nuria@mail.com',
   password: '1234'
 }

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public _usuarioProvider: UsuarioProvider) {
  }

  login( fLogin: NgForm ) {

    if( fLogin.invalid ) { return; }
    this._usuarioProvider.login( this.loginUser.email, this.loginUser.password )
    .subscribe( resp => {
      this.navCtrl.setRoot(HomePage);
    });

  }


}

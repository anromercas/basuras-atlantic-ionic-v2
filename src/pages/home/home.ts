import { Component } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { ZONAS } from '../../data/data.zonas';
import { Zona } from '../../interfaces/zona.interface';

import { NavController, App } from 'ionic-angular';
import { ZonaPage } from '../index.paginas';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { LoginPage } from '../login/login';
import { NuevaBasuraPage } from '../nueva-basura/nueva-basura';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  zonas: Zona[] = [];
  orientation: string;
  admin: boolean = false;

  constructor( public navCtrl: NavController,
                public _usuarioProv: UsuarioProvider,
                private appCtrl: App,
                private screenOrientation: ScreenOrientation ) {

    this.orientation = this.screenOrientation.type;
    this.screenOrientation.onChange().subscribe(
        ()=>{
        this.orientation = this.screenOrientation.type;
        if(this.navCtrl.getActive().component === HomePage){
            this.appCtrl.getRootNav().setRoot(HomePage);
        }
        });

	this.zonas = ZONAS.slice(0);

	if(_usuarioProv.role == 'ADMIN_ROLE'){
		this.admin = true;
	} else {
		this.admin = false;
	}
  }

  irZona( zona: Zona ) {
    this.navCtrl.push( ZonaPage, { 'zona': zona }, {animate: true, animation: 'ios-transition'} ); // The property 'animation' understands the following values: md-transition, ios-transition and wp-transition.
  }

  cerrar_sesion(){
    this._usuarioProv.borrarStorage();
    this.navCtrl.push(LoginPage, {}, {animate: true, animation: 'wp-transition'});
    this.navCtrl.remove(0);
  }

  nueva_basura(){
    this.navCtrl.push(NuevaBasuraPage, {}, {animate: true, animation: 'ios-transition'});
  }

}




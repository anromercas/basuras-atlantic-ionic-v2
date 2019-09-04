import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Zona } from '../../interfaces/zona.interface';
import { Basura } from '../../interfaces/basura.interface';
import { BasuraPage } from '../basura/basura';
import { CalificaPage } from '../index.paginas';
import { BasuraProvider } from '../../providers/basura/basura';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { LoginPage } from '../login/login';
import { UiProvider } from '../../providers/ui/ui';

@Component({
  selector: 'page-zona',
  templateUrl: 'zona.html',
})
export class ZonaPage {

  zona: Zona;
  basuras: Basura[] = [];
  basurasDeZona: Basura[] = [];
  historicoBasuras: Basura[] = [];
  admin: boolean = false;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public _usuarioProv: UsuarioProvider,
              public _basuraProv:BasuraProvider,              
              public uiProv: UiProvider) {
    this.zona = this.navParams.get("zona");

    if(_usuarioProv.role == 'ADMIN_ROLE'){
      this.admin = true;
    } else {
      this.admin = false;
    }
     
  }

  ionViewDidLoad(){

    this._basuraProv.listarBasuras()
    .subscribe((basuras: any) =>{      
      this.basuras = basuras.basuras;
      this.mostrarBasuras();
    }, (err) => {
      this.uiProv.alertaInformativa('Sesión Caducada', 'La sesión ha caducado, debe iniciar sesión de nuevo.');
      this.navCtrl.setRoot(LoginPage, {}, {animate: true, animation: 'wp-transition'});
      this._usuarioProv.borrarStorage();
    });
  }

  irBasura( basura: Basura ){
    this.navCtrl.push( BasuraPage, { 'basura': basura }, {animate: true, animation: 'ios-transition'} );
  }

  borrarBasura( id: string ) {
    this._basuraProv.borrarBasura(id)
                    .subscribe( res => {
                        console.log(res);
                        this.uiProv.alertaConTiempo('Basura Borrada', 'La basura se ha borrado');
                    }); 
  }

  calificar( basura: Basura ) {
    this.navCtrl.push( CalificaPage, { 'basura': basura }, {animate: true, animation: 'ios-transition'} );
  }

  rellenarHistoricoBasura(){
    this.historicoBasuras.forEach( basura => {
      
    })
  }

  // rellenar el array con la zona pulsada para que se puedan listar los contenedores de esa zona
  mostrarBasuras(){

    this.basuras.forEach( basura => {
      if( basura.zona === this.zona.nombre + ' - ' + this.zona.area ){
        this.basurasDeZona.push(basura);
      }
    });    
  }

  cerrar_sesion(){
    this._usuarioProv.borrarStorage();
    this.navCtrl.setRoot(LoginPage);
  }

}

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Zona } from '../../interfaces/zona.interface';
import { Basura } from '../../interfaces/basura.interface';
import { BasuraPage } from '../basura/basura';
import { CalificaPage } from '../index.paginas';
import { BasuraProvider } from '../../providers/basura/basura';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-zona',
  templateUrl: 'zona.html',
})
export class ZonaPage {

  zona: Zona;
  basuras: Basura[] = [];
  basurasDeZona: Basura[] = [];
  historicoBasuras: Basura[] = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public _usuarioProv: UsuarioProvider,
              public _basuraProv:BasuraProvider) {
    this.zona = this.navParams.get("zona");
     
  }

  ionViewDidLoad(){
    
    this._basuraProv.listarBasuras()
    .subscribe((basuras: any) =>{      
      this.basuras = basuras.basuras;
      this.mostrarBasuras();
    }, (err) => {
      console.log(err);
      this.navCtrl.setRoot(LoginPage);
      this.cerrar_sesion();
    });
  }

  irBasura( basura: Basura ){
    this.navCtrl.push( BasuraPage, { 'basura': basura } );
  }

  calificar( basura: Basura ) {
    this.navCtrl.push( CalificaPage, { 'basura': basura } );
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
    this.navCtrl.push(LoginPage);
    this.navCtrl.remove(0);
  }

}

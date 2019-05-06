import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Basura } from '../../interfaces/basura.interface';
import { CalificaPage } from '../califica/califica';
import { EjemplosPage } from '../ejemplos/ejemplos';
import { BasuraProvider } from '../../providers/basura/basura';
import { ImagenModalPage } from '../imagen-modal/imagen-modal';


@Component({
  selector: 'page-basura',
  templateUrl: 'basura.html',
})
export class BasuraPage {

  basura: Basura;
  basuras: Basura[] = [];


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public _basuraProv: BasuraProvider,
              public modalCtrl: ModalController) {
    this.basura = this.navParams.get("basura");

    this.mostrarBasuras();
  }

  mostrarBasuras(){
    this._basuraProv.obtenerHistoricoBasura(this.basura.codigoContenedor)
                .subscribe( (resp:any) => {
                  console.log(resp);
                    this.basuras = resp.historico;
                });
  }

  verEjemplos(){
    this.navCtrl.push( EjemplosPage );
  }

  calificar() {
    this.navCtrl.push( CalificaPage, { 'basura': this.basura } );
  }

  verImg(basura: Basura){
    let modal = this.modalCtrl.create(ImagenModalPage, {basura: basura});

    modal.present();
  }
}

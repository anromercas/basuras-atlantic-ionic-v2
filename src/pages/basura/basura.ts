import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Basura } from '../../interfaces/basura.interface';
import { CalificaPage } from '../califica/califica';
import { EjemplosPage } from '../ejemplos/ejemplos';
import { BasuraProvider } from '../../providers/basura/basura';
import { ImagenModalPage } from '../imagen-modal/imagen-modal';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { UiProvider } from '../../providers/ui/ui';


@Component({
  selector: 'page-basura',
  templateUrl: 'basura.html',
})
export class BasuraPage {

  basura: Basura;
  basuras: Basura[] = [];

  desde: number = 0;
  limite: number = 5;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public _basuraProv: BasuraProvider,
              public modalCtrl: ModalController,
              public _usuarioProv: UsuarioProvider,
              public uiProv: UiProvider) {
    this.basura = this.navParams.get("basura");

    
    this.siguientes();
  }

  ionViewDidLoad(){
    this._basuraProv.obtenerBasura(this.basura._id)
                    .subscribe( (res: any) => {
                      this.basura = res.basura;
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

  siguientes(event?) {

    this._basuraProv.obtenerHistoricoBasura(this.basura.codigoContenedor, this.desde, this.limite)
                .subscribe( (resp:any) => {
                  console.log(resp);
                    this.basuras.push( ...resp.historicos );
                    this.desde += this.limite;
                    if( event ){
                      event.complete();
                      if(resp.historicos.length === 0){
                        event.state = "disabled";
                      }
                    }
                });
                      

  }
}

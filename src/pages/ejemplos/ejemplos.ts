import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Basura } from '../../interfaces/basura.interface';
import { BasuraProvider } from '../../providers/basura/basura';
import { EJEMPLOS } from '../../data/data.ejemplos';
import { ImagenModalPage } from '../imagen-modal/imagen-modal';

@Component({
  selector: 'page-ejemplos',
  templateUrl: 'ejemplos.html',
})
export class EjemplosPage {

  basuras: Basura[] = [];
  basurasDeEjemplo: Basura[] = [];
  basurasDeEjemplo2: Basura[] = [];
  basurasDeEjemplo3: Basura[] = [];


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public _basuraProv: BasuraProvider,
              public modalCtrl: ModalController,) {

                this.basuras = EJEMPLOS;
                this.mostrarBasuras(); 
  }

  verImg(basura: Basura){
    let modal = this.modalCtrl.create(ImagenModalPage, {basura: basura});

    modal.present();
  }

  mostrarBasuras(){
    let cont = 0;
    this.basuras.forEach( basura => {
      if( basura.img ){
        if(cont < 3) {
          this.basurasDeEjemplo.push(basura);
        } else if (cont > 2 && cont < 6){
          this.basurasDeEjemplo2.push(basura);
        } else if(cont > 5 && cont < 9) {
          this.basurasDeEjemplo3.push(basura);
        }
        cont ++;
      }
    });
  }
}

import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Basura } from '../../interfaces/basura.interface';

@Component({
  selector: 'page-imagen-modal',
  templateUrl: 'imagen-modal.html',
})
export class ImagenModalPage {

  basura: Basura;

  constructor(public viewCtrl: ViewController,
              public navParams: NavParams) {
        this.basura = this.navParams.get('basura');
  }

  cerrarModal(){
    this.viewCtrl.dismiss();
  }

}

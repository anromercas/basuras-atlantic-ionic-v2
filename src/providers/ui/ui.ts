import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController, AlertController } from 'ionic-angular';

@Injectable()
export class UiProvider {

  constructor(public http: HttpClient,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController) {
    
  }

  alertaInformativa(titulo: string, subtitulo: string) {
    const alert = this.alertCtrl.create({
      title: titulo ,
      subTitle: subtitulo,
      buttons: ['OK']
    });
    alert.present();
  }

  alertaConTiempo(titulo: string, subtitulo: string, tiempo: number) {
    const alert = this.alertCtrl.create({
      title: titulo ,
      subTitle: subtitulo,
    //  buttons: ['OK']
    });
    alert.present();
    setTimeout(()=>{
      alert.dismiss();
  }, tiempo);
  }

  mostrar_toast( mensaje: string ){
    const toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }

}

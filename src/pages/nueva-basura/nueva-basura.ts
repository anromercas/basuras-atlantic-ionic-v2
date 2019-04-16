import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

import { ZONAS } from '../../data/data.zonas';
import { Zona } from '../../interfaces/zona.interface';

import { BASURAS } from '../../data/data.basuras';
import { BasuraNueva } from '../../interfaces/basura-nueva.interface';
import { BasuraProvider } from '../../providers/basura/basura';
import { Basura } from '../../interfaces/basura.interface';
import { UsuarioProvider } from '../../providers/usuario/usuario';


@Component({
  selector: 'page-nueva-basura',
  templateUrl: 'nueva-basura.html',
})
export class NuevaBasuraPage {

  myForm: FormGroup;
  zonas: Zona[] = [];
  basuras: BasuraNueva[] = [];
  codigoContenedor: string;

  imagenPreview: any;
  imagen64: string;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public _basuraProvider: BasuraProvider,
              public _usuarioProvider: UsuarioProvider,
              private imagePicker: ImagePicker,
              public toastCtrl: ToastController,) {
      this.myForm = this.createMyForm();
      this.zonas = ZONAS.slice(0);
      this.basuras = BASURAS.slice(0);

  }

  seleccionarIcono( basura ) {
    this.basuras.forEach( img => img.seleccionado = false );

    basura.seleccionado = true;
  }


  saveData(){
    console.log(this.myForm.value);

    let datos = this.myForm.value;

    let basura: Basura = {
      nombre: datos.nombre,
      zona: datos.zona,
      numeroContenedor: parseInt(datos.numeroContenedor),
      codigoContenedor: datos.codigoContenedor,
      imgContenedor: this.imagen64,
    };
    this._basuraProvider.crearBasura(basura)
                        .subscribe(resp => {
                          this.mostrar_toast('Basura Guardada ' + basura.nombre);
                          console.log(resp);
                        });
  }
  
  

  // selecciona imagen de la galería
  subirImagen(){
    let options: ImagePickerOptions = {
        quality: 25,
        outputType: 1,
        maximumImagesCount: 1
    }

    this.imagenPreview = [];
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        this.imagenPreview.push('data:image/jpeg;base64,' + results[i]);
        console.log(this.imagenPreview);
      }

    //  this._basuraProvider.subirImagen(this.imagenPreview);
    }, (err) => {
        console.log('ERROR en selector', JSON.stringify(err));
     });

     if(!this.imagenPreview){
       this.mostrar_toast('Imagen Subida');
     }
  }

  private createMyForm(){
    return this.formBuilder.group({
      nombre: ['', Validators.required],
      codigoContenedor: ['', Validators.required],
      numeroContenedor: ['', Validators.required],
      zona: ['', Validators.required]
    });
  }


  mostrar_toast( mensaje: string ){
    const toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }
}

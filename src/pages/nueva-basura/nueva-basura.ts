import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ZONAS } from '../../data/data.zonas';
import { Zona } from '../../interfaces/zona.interface';

import { BASURAS } from '../../data/data.basuras';
import { BasuraNueva } from '../../interfaces/basura-nueva.interface';
import { BasuraProvider } from '../../providers/basura/basura';
import { Basura } from '../../interfaces/basura.interface';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { UiProvider } from '../../providers/ui/ui';
import { LoginPage } from '../login/login';


@Component({
  selector: 'page-nueva-basura',
  templateUrl: 'nueva-basura.html',
})
export class NuevaBasuraPage {

  @ViewChild('codigoContenedor') codContenedor;

  myForm: FormGroup;
  zonas: Zona[] = [];
  basuras: BasuraNueva[] = [];
  codigoContenedor: string;

  imgContenedor: string;
  codCont: string = '';
  numCont: number = 1;

  imagenPreview: any;
  imagen64: string;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public _basuraProv: BasuraProvider,
              public _usuarioProv: UsuarioProvider,
              public uiProv: UiProvider) {
      this.myForm = this.createMyForm();
      this.zonas = ZONAS.slice(0);
      this.basuras = BASURAS.slice(0);

      // seleccionar la primera opcion por defecto
      this.imgContenedor = this.basuras[0].imgContenedor;

  }

  ionViewDidLoad(){
    
    this._basuraProv.listarBasuras()
    .subscribe((basuras: any) =>{      
    }, (err) => {
      this._usuarioProv.renuevaToken()
                      .subscribe( resp => {
                        if (resp === true) {
                          console.log('Token renovado');
                        } else {
                          console.log('Token no renovado');
                          this.uiProv.alertaInformativa('Sesión Caducada', 'La sesión ha caducado, debe iniciar sesión de nuevo.');
                          this.navCtrl.setRoot(LoginPage);
                          this.cerrar_sesion();
                        }
                      });
    });
  }

  createMyForm(){
    return this.formBuilder.group({
      nombre: ['', Validators.required],
      codigoContenedor: [this.codCont.toUpperCase(), Validators.required],
      numeroContenedor: ['', Validators.required],
      zona: ['', Validators.required]
    });
  }

  siglasZona( evento: EventListener ){
    this.zonas.forEach( zona => {
      if(zona.nombre + ' - ' + zona.area === evento.toString()){
        if(!this.codCont){
          this.codCont += zona.siglas;
        } else {
          this.codCont = '';
          this.codCont += zona.siglas;
        }
      }
    })
  }

  siglasBasura( evento: EventListener ){
    this.basuras.forEach( basura => {
      if(basura.nombre === evento.toString()){
          this.codCont += basura.siglas;
      }
    })
  }

  seleccionarIcono( basura ) {
    this.basuras.forEach( img => img.seleccionado = false );
    this.imgContenedor = basura.imgContenedor;

    basura.seleccionado = true;
  }


  saveData(){
    let datos = this.myForm.value;
    let numContInt = this.numCont;

    let basura: Basura = {
      nombre: datos.nombre,
      zona: datos.zona,
      numeroContenedor: parseInt(datos.numeroContenedor),
      codigoContenedor: datos.codigoContenedor.toString().toUpperCase(),
      imgContenedor: this.imgContenedor,
    };
    this._basuraProv.crearBasura(basura)
                        .subscribe(resp => {
                          this.uiProv.mostrar_toast('Basura Guardada' + basura.nombre);
                          this.myForm.reset();
                          this.codCont = '';
                          this.numCont = numContInt;
                          this.numCont++;
                        });
  }

  cerrar_sesion(){
    this._usuarioProv.borrarStorage();
    this.navCtrl.setRoot(LoginPage);
  }
  
}

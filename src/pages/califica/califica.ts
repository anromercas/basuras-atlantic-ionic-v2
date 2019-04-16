import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// Componentes
import { ToastController } from 'ionic-angular';

// DATA
import { CALIFICACIONES } from '../../data/data.calificaciones';
import { RESIDUOS } from '../../data/data.residuos';
import { masOpciones } from '../../data/data.masopciones';

// INTERFACES
import { Basura } from '../../interfaces/basura.interface';
import { Calificacion } from '../../interfaces/calificacion.interface';
import { MasOpc } from '../../interfaces/masOpc.interface';
import { Residuos } from '../../interfaces/residuos.interface';
// import { SubirPage } from '../subir/subir';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CargaArchivoProvider } from '../../providers/carga-archivo/carga-archivo';
import { BasuraProvider } from '../../providers/basura/basura';

@Component({
  selector: 'page-califica',
  templateUrl: 'califica.html',
})
export class CalificaPage {

  basura: Basura;
 // hayResiduos: boolean = false;
  residuo:string;
  calificacion: number = null;
  observaciones:string = "";
  estado: string;

  // foto principal
  imagenPreview: string = "";
  imagen64: string;

  // foto detalle
  imagenPreviewDetalle: string = "";
  imagen64Detalle: string;

  colorFondo = "";
  fechaHoy = Date();
  imagenNueva = false;

  calificaciones: Calificacion[] = [];
  masOpciones: MasOpc[] = [];
  residuos: Residuos[] = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public toastCtrl: ToastController,
              private camera: Camera,
              public _cap: CargaArchivoProvider,
              public _basuraProv: BasuraProvider) {
    
    this.calificaciones = CALIFICACIONES;
    this.masOpciones = masOpciones;
    this.residuos = RESIDUOS;

    this.basura = this.navParams.get("basura");

    this.calificacion = 5;
    this.estado = '';
    this.residuo = '';

    this.masOpciones.forEach( opc => {
      if (opc.nombre == 'Bueno') {
        opc.seleccionado = true;
        opc.color = 'secondary';
        opc.deshabilitado = false;
      } else {
        opc.deshabilitado = true;
        opc.color = '';
        opc.seleccionado = false;
      }
    });

    this.calificaciones.forEach( calificacion => {
      if (calificacion.puntos == 5) {
        calificacion.seleccionado = true;
        calificacion.color = 'secondary';
      } else {
        calificacion.seleccionado = false;
        calificacion.color = '';
      }
    });

    this.residuos.forEach(residuo => {
      if( residuo.color == 'secondary' ){
        residuo.seleccionado = false;
        residuo.color = "";
      }
    });
  }

  camara(tipo: string){
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation:true,
      sourceType: this.camera.PictureSourceType.CAMERA
    }

    this.camera.getPicture(options).then((imageData) => {

      if(tipo === 'img'){
        this.imagenPreview = 'data:image/jpg;base64,' + imageData;
        this.imagen64 = imageData;
        this.imagenNueva = true;
        this._basuraProv.subirImagen(imageData, 'basuras', this.basura._id);
      } else {
        this.imagenPreviewDetalle = 'data:image/jpg;base64,' + imageData;
        this.imagen64Detalle = imageData;
      }
      
     }, (err) => {
      console.log("ERROR EN CAMARA", JSON.stringify(err));
     });
  }

  guardar_imagen(){

   /*  let fecha = new Date().toISOString();

    let basuraProv: Basura = {
      nombre: this.basura.nombre,
      zona: this.basura.zona,
      numeroContenedor: this.basura.numeroContenedor,
      codigoContenedor: this.basura.codigoContenedor,
      calificacion: this.calificacion,
      observaciones: this.observaciones,
      fecha: fecha,
      img: this.imagen64,
      residuo: this.residuo,
      imgContenedor: this.basura.imgContenedor,
      imgDetalle: this.imagen64Detalle,
      estado: this.estado,
      _id: this.basura._id
    }
 */
  //  this._basuraProv.subirImagen(this.imagen64, 'basuras');
  //  this._cap.cargar_imagen_basura(basuraProv,'basuras');
              

    /* this._cap.cargar_imagen_basura(basuraProv)
              .then(() =>{
                this.mostrar_error('Formulario Guardado con éxito');
                this.navCtrl.pop();
              })
              .catch((err)=>{
                this.mostrar_error(err);
                this.navCtrl.popToRoot();
              }); */

  }

  guardar() {
    if( this.calificacion < 5 && !this.residuo ) {
      console.log('Hay que seleccionar residuos');
      this.mostrar_error('Debe seleccionar los resíduos que no deberían de estar en este contenedor');

    } else if( this.calificacion < 5 && this.estado == '') {
      console.log('el estado es obligatorio');
      this.mostrar_error('El estado es obligatorio, al ser una calificación menor a 5');
    } else {
      this.residuos.forEach(residuo => {
        if( residuo.seleccionado ){
          residuo.seleccionado = false;
        }
      });
      this.guardar_imagen();
      
    }
  }

  calificar(calificacion: Calificacion ) {
    this.calificaciones.forEach( calificacion => {
      if( calificacion.seleccionado && calificacion.color == 'secondary' ){
        calificacion.seleccionado = false;
        calificacion.color = "";
      }
    });

    calificacion.color="secondary";
    calificacion.seleccionado = true;
    
    if( calificacion.puntos < 5 ){
      this.mostrar_error('La calificación es menor a 5, debe seleccionar un ESTADO y un Resíduo');
      this.calificacion = calificacion.puntos;

      this.masOpciones.forEach( opc => {
        if (opc.nombre == 'Bueno') {
          opc.deshabilitado = true;
          opc.seleccionado = false;
          opc.color = '';
        } else {
          opc.deshabilitado = false;
        }
      });
    } else {
      this.calificacion = calificacion.puntos;

      this.masOpciones.forEach( opc => {
        if (opc.nombre == 'Bueno') {
          opc.deshabilitado = false;
          opc.seleccionado = true;
          opc.color = 'secondary';
        } else {
          opc.deshabilitado = true;
          opc.seleccionado = false;
          opc.color = '';
        }
      });
    }
  }

  cambiarEstado( opcion: MasOpc ){
    if( opcion.seleccionado ) {
      this.estado +=  opcion.nombre + ',';
      opcion.color = 'secondary';
    } else {
      this.estado = this.estado.replace(opcion.nombre + ',', '');
      opcion.color = "";
    }
  }

  reiniciar(){
    
    this.calificacion = 5;

    this.residuos.forEach(residuo => {
      if( residuo.seleccionado ){
        residuo.seleccionado = false;
        residuo.color = ""
      }
    });
    this.residuo = "";
  }

  seleccionar( residuo: Residuos ) {
    if( residuo.seleccionado ){
      residuo.seleccionado = false;
      residuo.color = "";
      this.residuo = this.residuo.replace(residuo.nombre + ',', '');  
     // return;
    }else {
      residuo.seleccionado = true;
      residuo.color = "secondary";
      this.residuo += residuo.nombre + ',';
    }    
  }

  mostrar_error( mensaje: string ){
    const toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }

}

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// DATA
import { CALIFICACIONES } from '../../data/data.calificaciones';
import { RESIDUOS } from '../../data/data.residuos';
import { masOpciones } from '../../data/data.masopciones';

// INTERFACES
import { Basura } from '../../interfaces/basura.interface';
import { Calificacion } from '../../interfaces/calificacion.interface';
import { MasOpc } from '../../interfaces/masOpc.interface';
import { Residuos } from '../../interfaces/residuos.interface';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { CargaArchivoProvider } from '../../providers/carga-archivo/carga-archivo';
import { BasuraProvider } from '../../providers/basura/basura';
import { LoginPage } from '../login/login';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { UiProvider } from '../../providers/ui/ui';

declare var window;

@Component({
  selector: 'page-califica',
  templateUrl: 'califica.html',
})
export class CalificaPage {

  basura: Basura;
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
              private camera: Camera,
              public _cap: CargaArchivoProvider,
              public _basuraProv: BasuraProvider,
              public uiProv: UiProvider,
              public _usuarioProv: UsuarioProvider) {

    this.calificaciones = CALIFICACIONES;
    this.masOpciones = masOpciones;
    this.residuos = RESIDUOS;
    
    this.basura = this.navParams.get("basura");
    this.mostrarResiduos();
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

    console.log(this.basura);

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

  camara(tipo: string){
      
      const options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation:true,
        sourceType: this.camera.PictureSourceType.CAMERA
      }
  
      this.camera.getPicture(options).then((imageData) => {
  
        if(tipo === 'img'){
        //  this.imagenPreview = 'data:image/jpg;base64,' + imageData;
          const img = window.Ionic.WebView.convertFileSrc(imageData);
          this.imagenPreview = img;
          this.imagen64 = imageData;
          this.imagenNueva = true;
          this._basuraProv.subirImagen(this.imagen64, 'basuras', this.basura._id);
          this.uiProv.mostrar_toast('Imagen subida');
        } else {
          const img = window.Ionic.WebView.convertFileSrc(imageData);
          this.imagenPreviewDetalle = img;
          this.imagen64Detalle = imageData;
          this._basuraProv.subirImagen(imageData, 'imgdetalle', this.basura._id);
          this.uiProv.mostrar_toast('Imagen subida');
        }
        
       }, (err) => {
        console.log("ERROR EN CAMARA", JSON.stringify(err));
       });
  
  }

    obtenerDatosBasura (){

      let basuraProv: Basura = {
        nombre: this.basura.nombre,
        zona: this.basura.zona,
        numeroContenedor: this.basura.numeroContenedor,
        codigoContenedor: this.basura.codigoContenedor.toUpperCase(),
        calificacion: this.calificacion,
        observaciones: this.observaciones,
        fecha: new Date().toISOString(),
        residuo: this.residuo,
        imgContenedor: this.basura.imgContenedor,
        estado: this.estado
      };

      console.log('BasuraProv '+ basuraProv);
    return basuraProv;

  }

  guardar() {
    if( this.calificacion < 5 && !this.residuo ) {
      console.log('Hay que seleccionar residuos');
      this.uiProv.alertaInformativa('Error','Debe seleccionar los resíduos que no deberían de estar en este contenedor');

    } else if( this.calificacion < 5 && this.estado == '') {
      console.log('el estado es obligatorio');
      this.uiProv.alertaInformativa('Error','El estado es obligatorio, al ser una calificación menor a 5');
    } else {
      this.residuos.forEach(residuo => {
        if( residuo.seleccionado ){
          residuo.seleccionado = false;
        }
      });
    }
    let basuraProv: Basura = {
      nombre: this.basura.nombre,
      zona: this.basura.zona,
      numeroContenedor: this.basura.numeroContenedor,
      codigoContenedor: this.basura.codigoContenedor.toUpperCase(),
      calificacion: this.calificacion,
      observaciones: this.observaciones,
      fecha: new Date().toISOString(),
      residuo: this.residuo,
      imgContenedor: this.basura.imgContenedor,
      estado: this.estado
    };
      // Actualiza la basura
      this._basuraProv.actualizarBasura(this.basura._id, basuraProv)
                      .subscribe((res: any) => {
                        console.log('Basura añadida', res.basura);
                        this.uiProv.alertaConTiempo('Guardado!','La calificación se ha guardado con éxito!', 2000);
                        this.navCtrl.pop();
                      });

      if( this.basura.calificacion ) {
        // Crea un registro en historico
        this._basuraProv.crearHistorico(this.basura)
                        .subscribe(res => console.log('Historico añadido', res));
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
      this.uiProv.alertaConTiempo('Hay más opciones','La calificación es menor a 5, debe seleccionar un ESTADO y un Resíduo', 3000);
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
    this.calificaciones.forEach( calificacion => {
      if (calificacion.puntos == 5) {
        calificacion.seleccionado = true;
        calificacion.color = 'secondary';
      } else {
        calificacion.seleccionado = false;
        calificacion.color = '';
      }
    });


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

  // elimina del array de los residuos el que si deberían estar es el contenedor elegido
  // Si el contenedor es de EPIs el resíduo EPIs no aparece en la lista
  mostrarResiduos(){
    this.residuos.forEach((residuo:any, index) => {
     let nombreBasura = this.basura.nombre;
      if(nombreBasura.includes(residuo.nombre)){
        this.residuos.splice(index, 1);
      }
    });
  }

  cerrar_sesion(){
    this._usuarioProv.borrarStorage();
    this.navCtrl.setRoot(LoginPage);
  }

}

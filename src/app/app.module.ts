import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, AlertController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ScreenOrientation } from '@ionic-native/screen-orientation';


// plugins
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { FileTransfer } from '@ionic-native/file-transfer';

import { MyApp } from './app.component';
import {  HomePage,
  LoginPage,
  ZonaPage,
  BasuraPage,
  CalificaPage,
  EjemplosPage,
  NuevaBasuraPage,
  ImagenModalPage } from '../pages/index.paginas';
  
  // servicios
  import { UsuarioProvider } from '../providers/usuario/usuario';
  import { CalificacionProvider } from '../providers/calificacion/calificacion';
  import { BasuraProvider } from '../providers/basura/basura';
  import { CargaArchivoProvider } from '../providers/carga-archivo/carga-archivo';
  
  
  // modulos 
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';

// fecha
import { LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { UiProvider } from '../providers/ui/ui';
// import { InterceptorProvider } from '../providers/interceptor/interceptor';
registerLocaleData(localeEs);



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ZonaPage,
    BasuraPage,
    CalificaPage,
    EjemplosPage,
    NuevaBasuraPage,
    ImagenModalPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ZonaPage,
    BasuraPage,
    CalificaPage,
    EjemplosPage,
    NuevaBasuraPage,
    ImagenModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    ImagePicker,
    FileTransfer,
    AlertController,
    ScreenOrientation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: LOCALE_ID, useValue:"es" },
  //  { provide: HTTP_INTERCEPTORS, useClass: InterceptorProvider, multi: true },
    // mis providers
    UsuarioProvider,
    CalificacionProvider,
    BasuraProvider,
    CargaArchivoProvider,
    UiProvider,
  ]
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { ImagenDetallePipe } from './imagen-detalle/imagen-detalle';
@NgModule({
	declarations: [ImagenDetallePipe],
	imports: [],
	exports: [
		ImagenDetallePipe
	]
})
export class PipesModule {}

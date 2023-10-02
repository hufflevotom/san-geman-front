import { combineReducers } from '@reduxjs/toolkit';

import ingreso from './almacenTela/ingresos/ingresosTelaSlice';
import ingresos from './almacenTela/ingresos/ingresosTelasSlice';
import kardex from './almacenTela/kardex/kardexTelasSlice';
import salida from './almacenTela/salidas/salidaTelaSlice';
import salidas from './almacenTela/salidas/salidasTelasSlice';
import reporteOp from './almacenTela/reporteOp/reporteOpTelasSlice';

import ingresoAvio from './almacenAvio/ingresos/ingresosAvioSlice';
import ingresosAvio from './almacenAvio/ingresos/ingresosAviosSlice';
import kardexAvio from './almacenAvio/kardex/kardexAviosSlice';
import salidaAvio from './almacenAvio/salidas/salidaAvioSlice';
import salidasAvio from './almacenAvio/salidas/salidasAviosSlice';
import reporteOpAvio from './almacenAvio/reporteOp/reporteOpAviosSlice';

import guia from './guias/guias/guiaSlice';
import guias from './guias/guias/guiasSlice';
import salidasMixtas from './guias/salidasMixtas/salidasMixtasSlice';

const almacenReducer = combineReducers({
	ingresos,
	ingreso,
	kardex,
	salidas,
	salida,
	reporteOp,

	ingresoAvio,
	ingresosAvio,
	kardexAvio,
	salidasAvio,
	salidaAvio,
	reporteOpAvio,

	guias,
	guia,
	salidasMixtas,
});

export default almacenReducer;

import { combineReducers } from '@reduxjs/toolkit';

import unidad from './unidad/unidadSlice';
import unidades from './unidad/unidadesSlice';

import almacen from './almacen/almacenSlice';
import almacenes from './almacen/almacenesSlice';

import metodoPago from './metodoPago/metodoPagoSlice';
import metodosPago from './metodoPago/metodosPagoSlice';

import ubicacionEstampado from './ubicacionEstampado/ubicacionEstampadoSlice';
import ubicacionEstampados from './ubicacionEstampado/ubicacionEstampadosSlice';

import ubicacionBordado from './ubicacionBordado/ubicacionBordadoSlice';
import ubicacionBordados from './ubicacionBordado/ubicacionBordadosSlice';

const configuracionReducer = combineReducers({
	unidad,
	unidades,

	almacen,
	almacenes,

	metodoPago,
	metodosPago,

	ubicacionEstampado,
	ubicacionEstampados,

	ubicacionBordado,
	ubicacionBordados,
});

export default configuracionReducer;

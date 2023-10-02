import { combineReducers } from '@reduxjs/toolkit';

import costo from './costos/costoSlice';
import costos from './costos/costosSlice';

import costoAvios from './costos-avios/costoAviosSlice';
import costosAvios from './costos-avios/costosAviosSlice';

const cotizacionReducer = combineReducers({
	costo,
	costos,

	costoAvios,
	costosAvios,
});

export default cotizacionReducer;

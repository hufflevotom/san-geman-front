import { combineReducers } from '@reduxjs/toolkit';

import ordenesCorte from './orden-corte/ordenesCorteSlice';
import ordenCorte from './orden-corte/ordenCorteSlice';

const maestroReducer = combineReducers({
	ordenesCorte,
	ordenCorte,
});

export default maestroReducer;

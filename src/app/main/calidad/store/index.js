import { combineReducers } from '@reduxjs/toolkit';

import manufacturas from './manufactura/manufacturasSlice';
import manufactura from './manufactura/manufacturaSlice';

import textiles from './textil/textilesSlice';
import textil from './textil/textilSlice';

const calidadReducer = combineReducers({
	manufacturas,
	manufactura,

	textiles,
	textil,
});

export default calidadReducer;

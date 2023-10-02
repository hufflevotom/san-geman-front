import { combineReducers } from '@reduxjs/toolkit';

import estadosOp from './estado-op/estadosOpSlice';

const reporteReducer = combineReducers({
	estadosOp,
});

export default reporteReducer;

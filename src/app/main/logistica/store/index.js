import { combineReducers } from '@reduxjs/toolkit';

import oSCortes from './os-corte/oSCortesSlice';
import oSCorte from './os-corte/oSCorteSlice';

import controlFacturas from './controlFactura/controlFacturasSlice';
import controlFactura from './controlFactura/controlFacturaSlice';

import guiasRemision from './guiaRemision/guiasRemisionSlice';
import guiaRemision from './guiaRemision/guiaRemisionSlice';

import vehiculos from './vehiculo/vehiculosSlice';
import vehiculo from './vehiculo/vehiculoSlice';

const logisticaReducer = combineReducers({
	oSCortes,
	oSCorte,

	controlFacturas,
	controlFactura,

	guiasRemision,
	guiaRemision,

	vehiculos,
	vehiculo,
});

export default logisticaReducer;

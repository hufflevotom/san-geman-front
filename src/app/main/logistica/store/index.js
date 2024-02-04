import { combineReducers } from '@reduxjs/toolkit';

import oSCortes from './os-corte/oSCortesSlice';
import oSCorte from './os-corte/oSCorteSlice';

import ordenServicioGenerales from './ordenServicioGeneral/ordenServicioGeneralesSlice';
import ordenServicioGeneral from './ordenServicioGeneral/ordenServicioGeneralSlice';

import controlFacturas from './controlFactura/controlFacturasSlice';
import controlFactura from './controlFactura/controlFacturaSlice';

import guiasRemision from './guiaRemision/guiasRemisionSlice';
import guiaRemision from './guiaRemision/guiaRemisionSlice';

import vehiculos from './vehiculo/vehiculosSlice';
import vehiculo from './vehiculo/vehiculoSlice';

const logisticaReducer = combineReducers({
	oSCortes,
	oSCorte,

	ordenServicioGenerales,
	ordenServicioGeneral,

	controlFacturas,
	controlFactura,

	guiasRemision,
	guiaRemision,

	vehiculos,
	vehiculo,
});

export default logisticaReducer;

import { rutasDiccionario } from 'app/auth/authRoles';
import ControlFacturas from './controlFacturas';
import ControlFactura from './controlFactura/controlFactura';

const ControlFacturaConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.controlFactura[0],
			element: <ControlFacturas />,
		},
		{
			path: rutasDiccionario.controlFactura[1],
			element: <ControlFactura />,
		},
	],
};

export default ControlFacturaConfig;

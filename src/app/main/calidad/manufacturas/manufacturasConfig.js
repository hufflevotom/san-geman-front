import { rutasDiccionario } from 'app/auth/authRoles';
import Manufactura from './manufactura/manufactura';
import Manufacturas from './manufacturas';

const ManufacturasConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.cmanufactura[0],
			element: <Manufacturas />,
		},
		{
			path: rutasDiccionario.cmanufactura[1],
			element: <Manufactura />,
		},
	],
};

export default ManufacturasConfig;

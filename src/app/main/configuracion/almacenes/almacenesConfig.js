import { rutasDiccionario } from 'app/auth/authRoles';
import Almacen from './almacen/almacen';
import Almacenes from './almacenes';

const AlmacenesConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.almacenes[0],
			element: <Almacenes />,
		},
		{
			path: rutasDiccionario.almacenes[1],
			element: <Almacen />,
		},
	],
};

export default AlmacenesConfig;

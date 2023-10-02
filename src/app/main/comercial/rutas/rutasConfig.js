import { rutasDiccionario } from 'app/auth/authRoles';
import Rutas from './rutas';
import Ruta from './ruta/ruta';

const RutasConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.rutas[0],
			element: <Rutas />,
		},
		{
			path: rutasDiccionario.rutas[1],
			element: <Ruta />,
		},
	],
};

export default RutasConfig;

import { rutasDiccionario } from 'app/auth/authRoles';
import Muestras from './muestras';
import Muestra from './muestra/muestra';

const MuestrasConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.muestras[0],
			element: <Muestras />,
		},
		{
			path: rutasDiccionario.muestras[1],
			element: <Muestra />,
		},
	],
};

export default MuestrasConfig;

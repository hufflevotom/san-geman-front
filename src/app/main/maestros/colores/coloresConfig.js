import { rutasDiccionario } from 'app/auth/authRoles';
import Color from './color/color';
import Colores from './colores';

const ColoresConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.colores[0],
			element: <Colores />,
		},
		{
			path: rutasDiccionario.colores[1],
			element: <Color />,
		},
	],
};

export default ColoresConfig;

import { rutasDiccionario } from 'app/auth/authRoles';
import Unidad from './unidad/unidad';
import Unidades from './unidades';

const UnidadesConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.unidades[0],
			element: <Unidades />,
		},
		{
			path: rutasDiccionario.unidades[1],
			element: <Unidad />,
		},
	],
};

export default UnidadesConfig;

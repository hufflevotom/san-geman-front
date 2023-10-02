import { rutasDiccionario } from 'app/auth/authRoles';
import Lavado from './lavados/lavado';
import Lavados from './lavados';

const LavadosConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.lavados[0],
			element: <Lavados />,
		},
		{
			path: rutasDiccionario.lavados[1],
			element: <Lavado />,
		},
	],
};

export default LavadosConfig;

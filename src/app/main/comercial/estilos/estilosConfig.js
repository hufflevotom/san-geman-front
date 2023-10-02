import { rutasDiccionario } from 'app/auth/authRoles';
import Estilos from './estilos';
import Estilo from './estilo/estilo';

const EstilosConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.estilos[0],
			element: <Estilos />,
		},
		{
			path: rutasDiccionario.estilos[1],
			element: <Estilo />,
		},
	],
};

export default EstilosConfig;

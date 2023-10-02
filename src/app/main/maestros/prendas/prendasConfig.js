import { rutasDiccionario } from 'app/auth/authRoles';
import Prenda from './prenda/prenda';
import Prendas from './prendas';

const PrendasConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.prendas[0],
			element: <Prendas />,
		},
		{
			path: rutasDiccionario.prendas[1],
			element: <Prenda />,
		},
	],
};

export default PrendasConfig;

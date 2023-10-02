import { rutasDiccionario } from 'app/auth/authRoles';
import Costos from './costos';

const CortePanosConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.costos[0],
			element: <Costos />,
		},
	],
};

export default CortePanosConfig;

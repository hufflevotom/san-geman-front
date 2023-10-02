import { rutasDiccionario } from 'app/auth/authRoles';
import Avio from './avio/avio';
import Avios from './avios';

const AviosConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.avios[0],
			element: <Avios />,
		},
		{
			path: rutasDiccionario.avios[1],
			element: <Avio />,
		},
	],
};

export default AviosConfig;

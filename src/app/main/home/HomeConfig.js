import { rutasDiccionario } from 'app/auth/authRoles';
import HomePage from './Home';

const HomeConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.inicio[0],
			element: <HomePage />,
		},
	],
};

export default HomeConfig;

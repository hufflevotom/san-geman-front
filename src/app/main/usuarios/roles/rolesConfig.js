import { rutasDiccionario } from 'app/auth/authRoles';
import Rol from './rol/rol';
import Roles from './roles';

const RolesConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.roles[0],
			element: <Roles />,
		},
		{
			path: rutasDiccionario.roles[1],
			element: <Rol />,
		},
	],
};

export default RolesConfig;

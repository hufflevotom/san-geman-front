import { rutasDiccionario } from 'app/auth/authRoles';
import OrdenCorte from './ordenCorte/ordenCorte';
import OrdenesCorte from './ordenesCorte';

const OrdenesCorteConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.ocorte[0],
			element: <OrdenesCorte />,
		},
		{
			path: rutasDiccionario.ocorte[1],
			element: <OrdenCorte />,
		},
	],
};

export default OrdenesCorteConfig;

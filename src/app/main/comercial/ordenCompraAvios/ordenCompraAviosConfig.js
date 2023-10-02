import { rutasDiccionario } from 'app/auth/authRoles';
import OrdenCompraAvios from './ordenCompraAvios';
import OrdenCompraAvio from './ordenCompraAvio/ordenCompraAvio';

const OrdenCompraAviosConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.ordenCompraAvios[0],
			element: <OrdenCompraAvios />,
		},
		{
			path: rutasDiccionario.ordenCompraAvios[1],
			element: <OrdenCompraAvio />,
		},
	],
};

export default OrdenCompraAviosConfig;

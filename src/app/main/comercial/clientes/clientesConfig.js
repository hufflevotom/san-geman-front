import { rutasDiccionario } from 'app/auth/authRoles';
import Clientes from './clientes';
import Cliente from './cliente/cliente';

const ClientesConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.clientes[0],
			element: <Clientes />,
		},
		{
			path: rutasDiccionario.clientes[1],
			element: <Cliente />,
		},
	],
};

export default ClientesConfig;

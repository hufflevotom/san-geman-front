import { rutasDiccionario } from 'app/auth/authRoles';
import OrdenCompraTelas from './ordenCompraTelas';
import OrdenCompraTela from './ordenCompraTela/ordenCompraTela';

const OrdenCompraTelasConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.ordenCompraTelas[0],
			element: <OrdenCompraTelas />,
		},
		{
			path: rutasDiccionario.ordenCompraTelas[1],
			element: <OrdenCompraTela />,
		},
	],
};

export default OrdenCompraTelasConfig;

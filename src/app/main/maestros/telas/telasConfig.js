import { rutasDiccionario } from 'app/auth/authRoles';
import Tela from './tela/tela';
import Telas from './telas';

const TelasConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.telas[0],
			element: <Telas />,
		},
		{
			path: rutasDiccionario.telas[1],
			element: <Tela />,
		},
	],
};

export default TelasConfig;

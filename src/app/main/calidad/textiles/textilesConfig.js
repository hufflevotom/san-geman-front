import { rutasDiccionario } from 'app/auth/authRoles';
import Textil from './textil/textil';
import Textiles from './textiles';

const TextilesConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.ctextil[0],
			element: <Textiles />,
		},
		{
			path: rutasDiccionario.ctextil[1],
			element: <Textil />,
		},
	],
};

export default TextilesConfig;

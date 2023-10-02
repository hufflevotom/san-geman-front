import { rutasDiccionario } from 'app/auth/authRoles';
import GuiasRemision from './guiasRemision';
import GuiaRemision from './guiaRemision/guiaRemision';

const Config = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.guiaRemision[0],
			element: <GuiasRemision />,
		},
		{
			path: rutasDiccionario.guiaRemision[1],
			element: <GuiaRemision />,
		},
	],
};

export default Config;

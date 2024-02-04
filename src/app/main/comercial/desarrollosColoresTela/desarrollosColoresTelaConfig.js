import { rutasDiccionario } from 'app/auth/authRoles';
import ListaTabla from './desarrollosColoresTela';
import Formulario from './desarrolloColorTela/desarrolloColorTela';

const Config = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.desarrollosColoresTela[0],
			element: <ListaTabla />,
		},
		{
			path: rutasDiccionario.desarrollosColoresTela[1],
			element: <Formulario />,
		},
	],
};

export default Config;

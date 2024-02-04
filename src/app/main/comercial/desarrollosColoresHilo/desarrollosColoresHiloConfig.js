import { rutasDiccionario } from 'app/auth/authRoles';
import ListaTabla from './desarrollosColoresHilo';
import Formulario from './desarrolloColorHilo/desarrolloColorHilo';

const Config = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.desarrollosColoresHilo[0],
			element: <ListaTabla />,
		},
		{
			path: rutasDiccionario.desarrollosColoresHilo[1],
			element: <Formulario />,
		},
	],
};

export default Config;

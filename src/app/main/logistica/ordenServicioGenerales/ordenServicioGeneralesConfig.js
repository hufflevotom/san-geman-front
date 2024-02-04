import { rutasDiccionario } from 'app/auth/authRoles';
import OrdenServicioGenerales from './ordenServicioGenerales';
import OrdenServicioGeneral from './ordenServicioGeneral/ordenServicioGeneral';

export default {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.ordenServicioGeneral[0],
			element: <OrdenServicioGenerales />,
		},
		{
			path: rutasDiccionario.ordenServicioGeneral[1],
			element: <OrdenServicioGeneral />,
		},
	],
};

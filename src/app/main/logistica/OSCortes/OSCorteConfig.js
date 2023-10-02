import { rutasDiccionario } from 'app/auth/authRoles';
// import OrdenServicio from './ordenServicio/ordenServicio';
import OrdenesServicio from './OSCorte';
import OrdenServicio from './OSCorte/OSCorte';

const OrdenesServicioConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.oscorte[0],
			element: <OrdenesServicio />,
		},
		{
			path: rutasDiccionario.oscorte[1],
			element: <OrdenServicio />,
		},
	],
};

export default OrdenesServicioConfig;

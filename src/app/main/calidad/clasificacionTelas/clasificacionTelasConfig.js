import { rutasDiccionario } from 'app/auth/authRoles';
import ClasificacionTelas from './clasificacionTelas';

const ClasificacionTelasConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.clasificacionTela[0],
			element: <ClasificacionTelas />,
		},
	],
};

export default ClasificacionTelasConfig;

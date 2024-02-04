import { rutasDiccionario } from 'app/auth/authRoles';
import UbicacionBordado from './ubicacionBordado/ubicacionBordado';
import UbicacionBordados from './ubicacionBordados';

const UbicacionBordadosConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.ubicacionBordados[0],
			element: <UbicacionBordados />,
		},
		{
			path: rutasDiccionario.ubicacionBordados[1],
			element: <UbicacionBordado />,
		},
	],
};

export default UbicacionBordadosConfig;

import { rutasDiccionario } from 'app/auth/authRoles';
import UbicacionEstampado from './ubicacionEstampado/ubicacionEstampado';
import UbicacionEstampados from './ubicacionEstampados';

const UbicacionEstampadosConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.ubicacionEstampados[0],
			element: <UbicacionEstampados />,
		},
		{
			path: rutasDiccionario.ubicacionEstampados[1],
			element: <UbicacionEstampado />,
		},
	],
};

export default UbicacionEstampadosConfig;

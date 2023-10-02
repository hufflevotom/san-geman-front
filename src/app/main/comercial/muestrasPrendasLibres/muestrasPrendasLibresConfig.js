import { rutasDiccionario } from 'app/auth/authRoles';
import MuestrasPrendasLibres from './muestrasPrendasLibres';
import MuestraPrendaLibre from './muestraPrendaLibre/muestraPrendaLibre';

const MuestrasPrendasLibresConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.muestrasPrendasLibres[0],
			element: <MuestrasPrendasLibres />,
		},
		{
			path: rutasDiccionario.muestrasPrendasLibres[1],
			element: <MuestraPrendaLibre />,
		},
	],
};

export default MuestrasPrendasLibresConfig;

import { rutasDiccionario } from 'app/auth/authRoles';
import MuestrasTelasLibres from './muestrasTelasLibres';
import MuestraTelaLibre from './muestraTelaLibre/muestraTelaLibre';

const MuestrasTelasLibresConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.muestrasTelasLibres[0],
			element: <MuestrasTelasLibres />,
		},
		{
			path: rutasDiccionario.muestrasTelasLibres[1],
			element: <MuestraTelaLibre />,
		},
	],
};

export default MuestrasTelasLibresConfig;

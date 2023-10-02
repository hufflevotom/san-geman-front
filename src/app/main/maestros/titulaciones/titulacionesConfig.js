import { rutasDiccionario } from 'app/auth/authRoles';
import Titulacion from './titulacion/titulacion';
import Titulaciones from './titulaciones';

const TitulacionesConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.titulaciones[0],
			element: <Titulaciones />,
		},
		{
			path: rutasDiccionario.titulaciones[1],
			element: <Titulacion />,
		},
	],
};

export default TitulacionesConfig;

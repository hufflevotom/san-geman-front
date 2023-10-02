import { rutasDiccionario } from 'app/auth/authRoles';
import Producciones from './producciones';
import Produccion from './produccion/produccion';

const ProduccionesConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.producciones[0],
			element: <Producciones />,
		},
		{
			path: rutasDiccionario.producciones[1],
			element: <Produccion />,
		},
	],
};

export default ProduccionesConfig;

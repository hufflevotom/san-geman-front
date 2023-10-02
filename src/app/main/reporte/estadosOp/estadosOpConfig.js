import { rutasDiccionario } from 'app/auth/authRoles';
import Lista from './pages/lista/lista';
import Produccion from './pages/produccion/produccion';

const EstadosOpConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.estadoOp[0],
			element: <Lista />,
		},
		{
			path: rutasDiccionario.estadoOp[1],
			element: <Produccion />,
		},
	],
};

export default EstadosOpConfig;

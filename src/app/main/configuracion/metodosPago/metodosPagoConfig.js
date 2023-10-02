import { rutasDiccionario } from 'app/auth/authRoles';
import MetodoPago from './metodoPago/metodoPago';
import MetodosPago from './metodosPago';

const MetodosPagoConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.metodosPago[0],
			element: <MetodosPago />,
		},
		{
			path: rutasDiccionario.metodosPago[1],
			element: <MetodoPago />,
		},
	],
};

export default MetodosPagoConfig;

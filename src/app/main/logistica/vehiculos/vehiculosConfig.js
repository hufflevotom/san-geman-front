import { rutasDiccionario } from 'app/auth/authRoles';
import Tabla from './vehiculos';
import Formulario from './vehiculo/vehiculo';

const Config = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.vehiculo[0],
			element: <Tabla />,
		},
		{
			path: rutasDiccionario.vehiculo[1],
			element: <Formulario />,
		},
	],
};

export default Config;

import { Navigate } from 'react-router-dom';
import { rutasDiccionario } from 'app/auth/authRoles';
import AlmacenAvios from './almacenAvios';
import AlmacenAvio from './forms/almacenAvio';

const AlmacenAviosConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.almacenAvios[0],
			element: <Navigate to="/almacen/avios/kardex" />,
		},
		{
			path: rutasDiccionario.almacenAvios[1],
			element: <AlmacenAvios />,
		},
		{
			path: rutasDiccionario.almacenAvios[2],
			element: <AlmacenAvio />,
		},
	],
};

export default AlmacenAviosConfig;

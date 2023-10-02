import { Navigate } from 'react-router-dom';
import { rutasDiccionario } from 'app/auth/authRoles';
import Guias from './guias';

const GuiasConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.guias[0],
			element: <Navigate to="/almacen/guias/guias" />,
		},
		{
			path: rutasDiccionario.guias[1],
			element: <Guias />,
		},
		// {
		// 	path: rutasDiccionario.guias[2],
		// 	element: <Guia />,
		// },
	],
};

export default GuiasConfig;

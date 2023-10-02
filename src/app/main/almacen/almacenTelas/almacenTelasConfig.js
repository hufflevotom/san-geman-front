import { Navigate } from 'react-router-dom';
import { rutasDiccionario } from 'app/auth/authRoles';
import AlmacenTelas from './almacenTelas';
import AlmacenTela from './forms/almacenTela';

const AlmacenTelasConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.almacenTelas[0],
			element: <Navigate to="/almacen/telas/kardex" />,
		},
		{
			path: rutasDiccionario.almacenTelas[1],
			element: <AlmacenTelas />,
		},
		{
			path: rutasDiccionario.almacenTelas[2],
			element: <AlmacenTela />,
		},
	],
};

export default AlmacenTelasConfig;

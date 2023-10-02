import { rutasDiccionario } from 'app/auth/authRoles';
import Notificacion from './notificacion/notificacion';
import Notificaciones from './notificaciones';

const NotificacionesConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.notificaciones[0],
			element: <Notificaciones />,
		},
		{
			path: rutasDiccionario.notificaciones[1],
			element: <Notificacion />,
		},
	],
};

export default NotificacionesConfig;

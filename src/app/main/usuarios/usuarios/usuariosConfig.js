import { rutasDiccionario } from 'app/auth/authRoles';
import Usuario from './usuario/usuario';
import Usuarios from './usuarios';

const UsuariosConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.usuarios[0],
			element: <Usuarios />,
		},
		{
			path: rutasDiccionario.usuarios[1],
			element: <Usuario />,
		},
	],
};

export default UsuariosConfig;

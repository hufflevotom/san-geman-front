import { rutasDiccionario } from 'app/auth/authRoles';
import Proveedores from './proveedores';
import Proveedor from './proveedor/proveedor';

const ProveedoresConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.proveedores[0],
			element: <Proveedores />,
		},
		{
			path: rutasDiccionario.proveedores[1],
			element: <Proveedor />,
		},
	],
};

export default ProveedoresConfig;

import { rutasDiccionario } from 'app/auth/authRoles';
import Talla from './talla/talla';
import Tallas from './tallas';

const TallasConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.tallas[0],
			element: <Tallas />,
		},
		{
			path: rutasDiccionario.tallas[1],
			element: <Talla />,
		},
	],
};

export default TallasConfig;

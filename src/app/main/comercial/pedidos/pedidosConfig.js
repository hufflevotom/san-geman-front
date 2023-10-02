import { rutasDiccionario } from 'app/auth/authRoles';
import Pedidos from './pedidos';
import Pedido from './pedido/pedido';

const PedidosConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.pedidos[0],
			element: <Pedidos />,
		},
		{
			path: rutasDiccionario.pedidos[1],
			element: <Pedido />,
		},
	],
};

export default PedidosConfig;

import { rutasDiccionario } from 'app/auth/authRoles';
import CostosAvios from './costosAvios';

const CostosAviosConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.costosAvios[0],
			element: <CostosAvios />,
		},
	],
};

export default CostosAviosConfig;

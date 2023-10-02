import { rutasDiccionario } from 'app/auth/authRoles';
import FamiliaAvios from './familiaAvios/familiaAvios';
import FamiliasAvios from './familiasAvios';

const FamiliasAviosConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.familiasAvios[0],
			element: <FamiliasAvios />,
		},
		{
			path: rutasDiccionario.familiasAvios[1],
			element: <FamiliaAvios />,
		},
	],
};

export default FamiliasAviosConfig;

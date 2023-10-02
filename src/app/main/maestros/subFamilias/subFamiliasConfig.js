import { rutasDiccionario } from 'app/auth/authRoles';
import SubFamilia from './subFamilia/subFamilia';
import SubFamilias from './subFamilias';

const SubFamiliasConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.subFamilias[0],
			element: <SubFamilias />,
		},
		{
			path: rutasDiccionario.subFamilias[1],
			element: <SubFamilia />,
		},
	],
};

export default SubFamiliasConfig;

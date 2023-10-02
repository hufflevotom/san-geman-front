import React from 'react';
import { rutasDiccionario } from 'app/auth/authRoles';
import FamiliasPrendas from './familiasPrendas';
import FamiliaPrenda from './familiaPrenda/familaPrenda';

const FamiliasPrendasConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.familiasPrenda[0],
			element: <FamiliasPrendas />,
		},
		{
			path: rutasDiccionario.familiasPrenda[1],
			element: <FamiliaPrenda />,
		},
	],
};

export default FamiliasPrendasConfig;

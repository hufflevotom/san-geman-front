import { rutasDiccionario } from 'app/auth/authRoles';
import React from 'react';
import FamiliasTela from './familiasTelas';
import FamiliaTela from './familiaTela/familiaTela';

const FamiliasTelaConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: rutasDiccionario.familiasTela[0],
			element: <FamiliasTela />,
		},
		{
			path: rutasDiccionario.familiasTela[1],
			element: <FamiliaTela />,
		},
	],
};

export default FamiliasTelaConfig;

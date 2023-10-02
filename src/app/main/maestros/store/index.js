import { combineReducers } from '@reduxjs/toolkit';

import familiaPrenda from './familia-prenda/familiaPrendaSlice';
import familiasPrenda from './familia-prenda/familiasPrendasSlice';

import familiasTela from './familia-tela/familiasTelasSlice';
import familiaTela from './familia-tela/familiaTelaSlice';

import titulaciones from './titulacion/titulacionesSlice';
import titulacion from './titulacion/titulacionSlice';

import talla from './talla/tallaSlice';
import tallas from './talla/tallasSlice';

import color from './color/colorSlice';
import colores from './color/colorsSlice';

import prenda from './prenda/prendaSlice';
import prendas from './prenda/prendasSlice';

import tela from './tela/telaSlice';
import telas from './tela/telasSlice';

import subfamilias from './sub-familia/SubFamiliasSlice';
import subfamilia from './sub-familia/subFamiliaSlice';

import familiasAvios from './familia-avios/familiasAviosSlice';
import familiaAvios from './familia-avios/familiaAvioSlice';

import avios from './avios/aviosSlice';
import avio from './avios/avioSlice';

import lavados from './lavados/lavadosSlice';
import lavado from './lavados/lavadoSlice';

const maestroReducer = combineReducers({
	familiasPrenda,
	familiaPrenda,

	familiasTela,
	familiaTela,

	talla,
	tallas,

	color,
	colores,

	prenda,
	prendas,

	tela,
	telas,

	subfamilias,
	subfamilia,

	familiasAvios,
	familiaAvios,

	avios,
	avio,

	titulaciones,
	titulacion,

	lavados,
	lavado,
});

export default maestroReducer;

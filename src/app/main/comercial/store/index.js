import { combineReducers } from '@reduxjs/toolkit';

import proveedores from './proveedor/proveedoresSlice';
import proveedor from './proveedor/proveedorSlice';

import estilos from './estilo/estilosSlice';
import estilo from './estilo/estiloSlice';

import producciones from './produccion/produccionesSlice';
import produccion from './produccion/produccionSlice';

import muestras from './muestra/muestrasSlice';
import muestra from './muestra/muestraSlice';

import muestrasTelasLibres from './muestraTelaLibre/muestrasTelasLibresSlice';
import muestraTelaLibre from './muestraTelaLibre/muestraTelaLibreSlice';

import muestrasPrendasLibres from './muestraPrendaLibre/muestrasPrendasLibresSlice';
import muestraPrendaLibre from './muestraPrendaLibre/muestraPrendaLibreSlice';

import pedidos from './pedido/pedidosSlice';
import pedido from './pedido/pedidoSlice';

import clientes from './cliente/clientesSlice';
import cliente from './cliente/clienteSlice';

import rutas from './ruta/rutasSlice';
import ruta from './ruta/rutaSlice';

import ordenCompraTelas from './ordenCompraTela/ordenCompraTelasSlice';
import ordenCompraTela from './ordenCompraTela/ordenCompraTelaSlice';

import ordenCompraAvios from './ordenCompraAvio/ordenCompraAviosSlice';
import ordenCompraAvio from './ordenCompraAvio/ordenCompraAvioSlice';

import infoPedido from './pedido/resumenPedidoSlice';
import helpers from './pedido/helpers';

import desarrollosColoresTela from './desarrolloColorTela/desarrollosColoresTelaSlice';
import desarrolloColorTela from './desarrolloColorTela/desarrolloColorTelaSlice';

import desarrollosColoresHilo from './desarrolloColorHilo/desarrollosColoresHiloSlice';
import desarrolloColorHilo from './desarrolloColorHilo/desarrolloColorHiloSlice';

const comercialReducer = combineReducers({
	proveedores,
	proveedor,

	producciones,
	produccion,

	muestras,
	muestra,

	muestrasTelasLibres,
	muestraTelaLibre,

	muestrasPrendasLibres,
	muestraPrendaLibre,

	estilos,
	estilo,

	pedidos,
	pedido,

	clientes,
	cliente,

	rutas,
	ruta,

	ordenCompraTelas,
	ordenCompraTela,

	ordenCompraAvios,
	ordenCompraAvio,

	infoPedido,

	helpers,

	desarrollosColoresTela,
	desarrolloColorTela,

	desarrollosColoresHilo,
	desarrolloColorHilo,
});

export default comercialReducer;

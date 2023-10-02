import { combineReducers } from '@reduxjs/toolkit';

import usuario from './usuario/usuarioSlice';
import usuarios from './usuario/usuariosSlice';

import notificacion from './notificacion/notificacionSlice';
import notificaciones from './notificacion/notificacionesSlice';

import rol from './rol/rolSlice';
import roles from './rol/rolesSlice';

import modulos from './modulo/modulosSlice';

const usuarioReducer = combineReducers({
	usuario,
	usuarios,

	notificacion,
	notificaciones,

	rol,
	roles,

	modulos,
});

export default usuarioReducer;

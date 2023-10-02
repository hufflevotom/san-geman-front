import { limitCombo, offsetCombo } from 'constants/constantes';
import httpClient from 'utils/Api';

export const getProductosTelasService = async (busqueda, op, tipo) => {
	let base = '';
	switch (tipo) {
		case -1:
			base = 'producto-tela/noPertenecen';
			break;
		case 0:
			base = 'producto-tela/asignados';
			break;
		default:
			base = 'producto-tela/findAllOrdenCorte';
			break;
	}
	let b = '';
	let url = '';
	if (busqueda) {
		b = busqueda.trim();
	}
	if (b !== '' && op?.id !== '') {
		url = `${base}?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}&op=${op.id}`;
	} else if (op?.id !== '') {
		url = `${base}?limit=${limitCombo}&offset=${offsetCombo}&op=${op.id}`;
	} else if (b !== '') {
		url = `${base}?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;
	}
	const response = await httpClient.get(url);
	const data = await response.data.body[0];

	return data;
};

export const getProduccionesService = async busqueda => {
	let b = '';
	if (busqueda) {
		b = busqueda.trim();
	}
	const url = `comercial/producciones?limit=${limitCombo}&offset=${offsetCombo}${
		busqueda !== '' ? `&busqueda=${b}` : ''
	}`;
	const response = await httpClient.get(url);
	const data = await response.data.body[0];
	return data;
};

export const getProduccionService = async id => {
	const url = `comercial/producciones/ordenCorte/${id}`;
	const response = await httpClient.get(url);
	const data = await response.data.body;
	return data;
};

export const getControlCalidadService = async value => {
	const body = value.map(item => item.partida);
	const url = `producto-tela/productos`;
	const response = await httpClient.post(url, { partidas: body });
	return response;
};

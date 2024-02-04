import { limitCombo, offsetCombo } from 'constants/constantes';
import httpClient from 'utils/Api';

export const getOrdenesCorteService = async (op, busqueda) => {
	let b = '';
	let url = '';
	if (busqueda) {
		b = busqueda.trim();
	}
	if (op !== '') {
		url = `orden-corte-panios/op?op=${op}&offset=${offsetCombo}&limit=${limitCombo}&busqueda=${b}`;
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
	// if (b !== '') {
	const url = `comercial/producciones?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;
	const response = await httpClient.get(url);
	const data = await response.data.body[0];
	return data;
	// }
	// return null;
};

export const getProveedoresService = async busqueda => {
	let b = '';
	if (busqueda) {
		b = busqueda.trim();
	}
	// if (b !== '') {
	const url = `comercial/proveedores?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;
	const response = await httpClient.get(url);
	const data = await response.data.body[0];
	return data;
	// }
	// return null;
};

export const getFormaPagosService = async busqueda => {
	let b = '';
	if (busqueda) {
		b = busqueda.trim();
	}
	// if (b !== '') {
	const url = `configuraciones/forma-pagos?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;
	const response = await httpClient.get(url);
	const data = await response.data.body[0];
	return data;
	// }
	// return null;
};

export const getProduccionService = async id => {
	const url = `comercial/producciones/ordenCorte/${id}`;
	const response = await httpClient.get(url);
	const data = await response.data.body;
	return data;
};

export const getControlCalidadServie = async value => {
	const body = value.map(item => ({ id: item.id }));
	const url = `calidad-textil/productos`;
	const response = await httpClient.post(url, { productos: body });
	return response;
};

export const getOneProduccion = async id => {
	const {
		data: { statusCode, body },
	} = await httpClient.get(`comercial/producciones/${id}`);
	if (statusCode === 200) {
		return body;
	}
	return null;
};

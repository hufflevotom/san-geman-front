import { limitCombo, offsetCombo } from 'constants/constantes';
import httpClient from 'utils/Api';

export const getProveedoresService = async busqueda => {
	let b = '';
	if (busqueda) {
		b = busqueda.trim();
	}
	const url = `comercial/proveedores?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;
	const response = await httpClient.get(url);
	const data = await response.data.body[0];
	return data;
};

export const getFormaPagosService = async busqueda => {
	let b = '';
	if (busqueda) {
		b = busqueda.trim();
	}
	const url = `configuraciones/forma-pagos?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;
	const response = await httpClient.get(url);
	const data = await response.data.body[0];
	return data;
};

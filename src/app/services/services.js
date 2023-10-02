import { limitCombo, offsetCombo } from 'constants/constantes';
import httpClient, { httpClientFacturacion } from 'utils/Api';

export const getChoferesService = async busqueda => {
	let b = '';
	if (busqueda) {
		b = busqueda.trim();
	}
	const url = `usuarios/choferes?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;
	const response = await httpClient.get(url);
	const data = await response.data.body[0];
	return data;
};

export const getVehiculosService = async busqueda => {
	let b = '';
	if (busqueda) {
		b = busqueda.trim();
	}
	const url = `logistica/vehiculos?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;
	const response = await httpClient.get(url);
	const data = await response.data.body[0];
	return data;
};

export const getClientesNacionalesService = async busqueda => {
	let b = '';
	if (busqueda) {
		b = busqueda.trim();
	}
	const url = `comprobantes/guias-remision/razones-sociales?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;
	const response = await httpClient.get(url);
	const data = await response.data.body;
	return data;
};

export const getDatosSunat = async ruc => {
	const url = `api/search/ruc`;
	const response = await httpClientFacturacion.post(url, { ruc });

	const data = await response.data;
	return data;
};

export const getGuiaRemisionSerieService = async () => {
	const url = `comprobantes/series-comprobantes/tipo/3`;
	const response = await httpClient.get(url);
	const data = await response.data.body;
	return data;
};

export const generateGuiaRemision = async body => {
	const url = `api/generateGuia`;
	const response = await httpClientFacturacion.post(url, body);
	const data = await response.data;
	return data;
};

export const getClienteService = async id => {
	const url = `comercial/clientes/${id}`;
	const response = await httpClient.get(url);
	const data = await response.data.body;
	return data;
};

export const getProveedorService = async id => {
	const url = `comercial/proveedores/${id}`;
	const response = await httpClient.get(url);
	const data = await response.data.body;
	return data;
};

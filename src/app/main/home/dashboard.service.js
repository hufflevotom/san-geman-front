import httpClient from 'utils/Api';

export const getControlCalidad = async () => {
	const url = `producto-tela/dashboard/pendientes`;
	const response = await httpClient.get(url);
	return response;
};

export const getTotalProductos = async () => {
	const url = `almacen-tela/kardex/dashboard/stock/total`;
	const response = await httpClient.get(url);
	return response;
};

export const getTotalAvios = async () => {
	const url = `almacen-avio/kardex/dashboard/stock/total`;
	const response = await httpClient.get(url);
	return response;
};

export const getTipoClientes = async () => {
	const url = `comercial/clientes/dashboard/tipoClientes`;
	const response = await httpClient.get(url);
	return response;
};

export const getCantidadAvios = async cantidad => {
	const url = `almacen-avio/kardex/dashboard/stock/mejores?cantidad=${cantidad}`;
	const response = await httpClient.get(url);
	return response;
};

export const getStockAvios = async cantidad => {
	const url = `almacen-avio/kardex/dashboard/stock/faltante?cantidadMaxima=${cantidad}`;
	const response = await httpClient.get(url);
	return response;
};

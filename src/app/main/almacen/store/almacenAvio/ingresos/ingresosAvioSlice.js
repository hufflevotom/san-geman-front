import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createIngreso = createAsyncThunk(
	'almacen/almacen-avio/postIngreso',
	async (almacenAvio, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('almacen-avio/ingreso', almacenAvio);
			const data = await response.data;
			return data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const createSalida = createAsyncThunk(
	'almacen/almacen-avio/postSalida',
	async (almacenAvio, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('almacen-avio/salida', almacenAvio);
			const data = await response.data;
			return data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const getIngresoId = createAsyncThunk('almacen/almacen-avio/getIngresoId', async id => {
	const response = await httpClient.get(`almacen-avio/ingreso/${id}`);
	const data = await response.data.body;
	data.aviosComplemento =
		response.data.body.origen !== 'INVENTARIO'
			? response.data.body.detallesProductosIngresosAlmacenesAvios.map(e => {
					return {
						id: e.id,
						avio: e.producto?.avio,
						cantidadPrincipal: e.cantidadPrincipal,
						cantidadSecundaria: e.cantidadSecundaria,
						talla: e.producto?.talla,
					};
			  })
			: response.data.body.detallesProductosIngresosAlmacenesAvios.map(e => {
					return {
						id: e.id,
						avio: e.producto?.avio,
						cantidad: e.cantidad,
						cantidadPrincipal: e.cantidadPrincipal,
						cantidadSecundaria: e.cantidadSecundaria,
						talla: e.producto?.avio?.talla,
						unidad: { ...e.unidad, label: e.unidad.nombre },
					};
			  });
	return data;
});

export const getSalidaId = createAsyncThunk('almacen/almacen-avio/getSalidaId', async id => {
	const response = await httpClient.get(`almacen-avio/salida/${id}`);
	const data = await response.data.body;
	return data;
});

export const updateAlmacenAvio = createAsyncThunk(
	'almacen/almacen-avio/putAlmacenAvio',
	async (almacenAvio, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`almacen-avio/ingreso/${almacenAvio.id}`, almacenAvio);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteAlmacenAvio = createAsyncThunk(
	'almacen/almacen-avio/deleteAlmacenAvio',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().almacen.ingreso;
			const response = await httpClient.delete(`almacen/almacen-avios/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const IngresosAvioSlice = createSlice({
	name: 'almacen/almacen-avio',
	initialState: null,
	reducers: {
		resetIngreso: () => null,
		resetSalida: () => null,
		newIngreso: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					nNota: '',
					fechaRegistro: '',
					tipoOperacion: '',
					origen: null,
					detalleOrigen: '',
					tipoComprobante: '',
					nroSerie: '',
					nroDocumento: '',
					fechaDocumento: '',
					ordenCompra: null,
					detallesProductosIngresosAlmacenesAvios: [],
				},
			}),
		},
		newSalida: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					codigo: '',
					avios: [],
				},
			}),
		},
	},
	extraReducers: {
		[getIngresoId.fulfilled]: (state, action) => action.payload,
		[getSalidaId.fulfilled]: (state, action) => action.payload,
		[createIngreso.fulfilled]: (state, action) => action.payload,
		[createSalida.fulfilled]: (state, action) => action.payload,

		// [updateAlmacenAvio.fulfilled]: (state, action) => action.payload,
		// [deleteAlmacenAvio.fulfilled]: (state, action) => null,
	},
});

export const { resetIngreso, newIngreso, resetSalida, newSalida } = IngresosAvioSlice.actions;
export default IngresosAvioSlice.reducer;

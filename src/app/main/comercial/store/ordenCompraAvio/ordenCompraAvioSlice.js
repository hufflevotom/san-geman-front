import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createOCAvios = createAsyncThunk(
	'comercial/ordCompraAvio/postOCAvio',
	async (cliente, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('comercial/compra-avios', cliente);
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

export const getOCAvioId = createAsyncThunk('comercial/ordCompraAvio/getOCAvio', async id => {
	const response = await httpClient.get(`comercial/compra-avios/${id}`);
	const data = await response.data.body;
	return data;
});

export const updateOCAvio = createAsyncThunk(
	'comercial/ordCompraAvio/putOCAvio',
	async (cliente, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`comercial/compra-avios/${cliente.id}`, cliente);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteOCAvio = createAsyncThunk(
	'comercial/ordCompraAvio/deleteOCAvio',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().comercial.ordenCompraAvio;
			const response = await httpClient.delete(`comercial/compra-avios/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const OrdenCompraAvioSlice = createSlice({
	name: 'comercial/ordCompraAvio',
	initialState: null,
	reducers: {
		resetOCAvio: () => null,
		newOCAvio: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				// Guiarse del body al momento de crear (revisar SWAGGER)
				payload: {
					id: '',
					codigo: '',
					moneda: '',
					direccion: '',
					observacion: '',
					// subTotal: '',
					// igv: '',
					// total: '',
					fechaEmision: '',
					fechaEntrega: '',
					// fechaAnulacion: '',
					proveedor: null,
					produccion: null,
					formaPago: null,
					detalleOrdenComprasAvios: null,
				},
			}),
		},
	},
	extraReducers: {
		[getOCAvioId.fulfilled]: (state, action) => action.payload,
		[createOCAvios.fulfilled]: (state, action) => action.payload,
		[updateOCAvio.fulfilled]: (state, action) => action.payload,
		[deleteOCAvio.fulfilled]: (state, action) => null,
	},
});

export const { resetOCAvio, newOCAvio } = OrdenCompraAvioSlice.actions;
export default OrdenCompraAvioSlice.reducer;

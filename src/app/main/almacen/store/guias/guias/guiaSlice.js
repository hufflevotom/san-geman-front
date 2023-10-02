import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createGuia = createAsyncThunk(
	'almacen/guias/postGuia',
	async (guia, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('almacen-tela/guia', guia);
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

export const getGuiaId = createAsyncThunk('almacen/guias/getGuiaId', async id => {
	const response = await httpClient.get(`almacen-avio/ingreso/${id}`);
	const data = await response.data.body;
	return data;
});

export const updateGuia = createAsyncThunk(
	'almacen/guias/putGuia',
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

export const deleteGuia = createAsyncThunk(
	'almacen/guias/deleteGuia',
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

const GuiaSlice = createSlice({
	name: 'almacen/guia',
	initialState: null,
	reducers: {
		resetGuia: () => null,
		newGuia: {
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
	},
	extraReducers: {
		[getGuiaId.fulfilled]: (state, action) => action.payload,
		[createGuia.fulfilled]: (state, action) => action.payload,
	},
});

export const { resetGuia, newGuia } = GuiaSlice.actions;
export default GuiaSlice.reducer;

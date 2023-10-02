import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createMetodoPago = createAsyncThunk(
	'configuracion/metodoPago/postMetodoPago',
	async (unidad, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('configuraciones/forma-pagos', unidad);
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

export const getMetodoPagoId = createAsyncThunk(
	'configuracion/metodoPago/getMetodoPagoId',
	async id => {
		const response = await httpClient.get(`configuraciones/forma-pagos/${id}`);
		const data = await response.data.body;
		return data;
	}
);

export const updateMetodoPago = createAsyncThunk(
	'configuracion/metodoPago/putMetodoPago',
	async (unidad, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`configuraciones/forma-pagos/${unidad.id}`, unidad);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteMetodoPago = createAsyncThunk(
	'configuracion/metodoPago/deleteMetodoPago',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().configuraciones.metodoPago;
			const response = await httpClient.delete(`configuraciones/forma-pagos/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const MetodoPagoSlice = createSlice({
	name: 'configuracion/metodoPago',
	initialState: null,
	reducers: {
		resetMetodoPago: () => null,
		newMetodoPago: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					descripcion: '',
					dias: '',
				},
			}),
		},
	},
	extraReducers: {
		[getMetodoPagoId.fulfilled]: (state, action) => action.payload,
		[createMetodoPago.fulfilled]: (state, action) => action.payload,
		[updateMetodoPago.fulfilled]: (state, action) => action.payload,
		[deleteMetodoPago.fulfilled]: (state, action) => null,
	},
});

export const { newMetodoPago, resetMetodoPago } = MetodoPagoSlice.actions;
export default MetodoPagoSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createGuiaRemision = createAsyncThunk(
	'logistica/guias-remision/createGuiaRemision',
	async (body, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('comprobantes/guias-remision', body);
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

export const getGuiaRemisionId = createAsyncThunk(
	'logistica/guias-remision/getGuiaRemisionId',
	async id => {
		const response = await httpClient.get(`comprobantes/guias-remision/${id}`);
		const data = await response.data.body;
		return data;
	}
);

export const updateGuiaRemision = createAsyncThunk(
	'logistica/guias-remision/updateGuiaRemision',
	async (controlFactura, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(
				`comprobantes/guias-remision/${controlFactura.id}`,
				controlFactura
			);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteGuiaRemision = createAsyncThunk(
	'logistica/guias-remision/deleteGuiaRemision',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().logistica.guiaRemision;
			const response = await httpClient.delete(`comprobantes/guias-remision/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const GuiaRemisionSlice = createSlice({
	name: 'logistica/guias-remision',
	initialState: null,
	reducers: {
		resetGuiaRemision: () => null,
		newGuiaRemision: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					descripcion: '',
					prefijo: '',
				},
			}),
		},
	},
	extraReducers: {
		[getGuiaRemisionId.fulfilled]: (state, action) => action.payload,
		[createGuiaRemision.fulfilled]: (state, action) => action.payload,
		[updateGuiaRemision.fulfilled]: (state, action) => action.payload,
		[deleteGuiaRemision.fulfilled]: (state, action) => null,
	},
});

export const { resetGuiaRemision, newGuiaRemision } = GuiaRemisionSlice.actions;
export default GuiaRemisionSlice.reducer;

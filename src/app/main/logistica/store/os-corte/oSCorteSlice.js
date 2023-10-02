import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createOSCorte = createAsyncThunk(
	'logistica/orden-servicio-corte/postOSCorte',
	async (oSCorte, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('logistica/orden-servicio-corte', oSCorte);
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

export const getOSCorteId = createAsyncThunk(
	'logistica/orden-servicio-corte/getOSCorteId',
	async id => {
		const response = await httpClient.get(`logistica/orden-servicio-corte/${id}`);
		const data = await response.data.body;
		return data;
	}
);

export const updateOSCorte = createAsyncThunk(
	'logistica/orden-servicio-corte/putOSCorte',
	async (oSCorte, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(
				`logistica/orden-servicio-corte/${oSCorte.id}`,
				oSCorte
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

export const deleteOSCorte = createAsyncThunk(
	'logistica/orden-servicio-corte/deleteOSCorte',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().logistica.oSCorte;
			const response = await httpClient.delete(`logistica/orden-servicio-corte/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const OSCorteSlice = createSlice({
	name: 'logistica/orden-servicio-corte',
	initialState: null,
	reducers: {
		resetOSCorte: () => null,
		newOSCorte: {
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
		[getOSCorteId.fulfilled]: (state, action) => action.payload,
		[createOSCorte.fulfilled]: (state, action) => action.payload,
		[updateOSCorte.fulfilled]: (state, action) => action.payload,
		[deleteOSCorte.fulfilled]: (state, action) => null,
	},
});

export const { resetOSCorte, newOSCorte } = OSCorteSlice.actions;
export default OSCorteSlice.reducer;

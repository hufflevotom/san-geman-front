import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createCosto = createAsyncThunk(
	'cotizacion/costos/postCosto',
	async (body, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('costos', body);
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

export const getCostoId = createAsyncThunk('cotizacion/costos/getCostoId', async id => {
	const response = await httpClient.get(`costos/${id}`);
	const data = await response.data.body;
	return data;
});

export const updateCosto = createAsyncThunk(
	'cotizacion/costos/putCosto',
	async (body, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`costos/${body.id}`, body);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteCosto = createAsyncThunk(
	'cotizacion/costos/deleteCosto',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().cotizacion.costo;
			const response = await httpClient.delete(`cotizacion/costos/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const CostoSlice = createSlice({
	name: 'cotizacion/costos',
	initialState: null,
	reducers: {
		resetCosto: () => null,
		newCosto: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					estiloId: '',
					rutasCostos: [],
				},
			}),
		},
	},
	extraReducers: {
		[getCostoId.fulfilled]: (state, action) => action.payload,
		[createCosto.fulfilled]: (state, action) => action.payload,
		[updateCosto.fulfilled]: (state, action) => action.payload,
		[deleteCosto.fulfilled]: (state, action) => null,
	},
});

export const { resetCosto, newCosto } = CostoSlice.actions;
export default CostoSlice.reducer;

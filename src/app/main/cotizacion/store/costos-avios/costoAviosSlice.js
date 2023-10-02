import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createCostoAvios = createAsyncThunk(
	'cotizacion/costosAvios/postCostoAvios',
	async (body, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('costos-avios', body);
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

export const getCostoAviosId = createAsyncThunk(
	'cotizacion/costosAvios/getCostoAviosId',
	async id => {
		const response = await httpClient.get(`costos-avios/${id}`);
		const data = await response.data.body;
		return data;
	}
);

export const updateCostoAvios = createAsyncThunk(
	'cotizacion/costosAvios/putCostoAvios',
	async (body, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`costos-avios/${body.id}`, body);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteCostoAvios = createAsyncThunk(
	'cotizacion/costosAvios/deleteCostoAvios',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().cotizacion.costosAvios;
			const response = await httpClient.delete(`cotizacion/costos-avios/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const CostoAviosSlice = createSlice({
	name: 'cotizacion/costosAvios',
	initialState: null,
	reducers: {
		resetCostoAvios: () => null,
		newCostoAvios: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					estiloId: '',
					rutasCostoAvioss: [],
				},
			}),
		},
	},
	extraReducers: {
		[getCostoAviosId.fulfilled]: (state, action) => action.payload,
		[createCostoAvios.fulfilled]: (state, action) => action.payload,
		[updateCostoAvios.fulfilled]: (state, action) => action.payload,
		[deleteCostoAvios.fulfilled]: (state, action) => null,
	},
});

export const { resetCostoAvios, newCostoAvios } = CostoAviosSlice.actions;
export default CostoAviosSlice.reducer;

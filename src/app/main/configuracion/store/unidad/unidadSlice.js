import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createUnidad = createAsyncThunk(
	'configuracion/unidad/postUnidad',
	async (unidad, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('configuraciones/unidad-media', unidad);
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

export const getUnidadId = createAsyncThunk('configuracion/unidad/getUnidadId', async id => {
	const response = await httpClient.get(`configuraciones/unidad-media/${id}`);
	const data = await response.data.body;
	data.unidad = data.relacion?.UnidadMedidaSeleccionada;
	data.valor = data.relacion?.valor;
	return data;
});

export const updateUnidad = createAsyncThunk(
	'configuracion/unidad/putUnidad',
	async (unidad, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`configuraciones/unidad-media/${unidad.id}`, unidad);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteUnidad = createAsyncThunk(
	'configuracion/unidad/deleteUnidad',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().configuraciones.unidad;
			const response = await httpClient.delete(`configuraciones/unidad-media/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const UnidadSlice = createSlice({
	name: 'configuracion/unidad',
	initialState: null,
	reducers: {
		resetUnidad: () => null,
		newUnidad: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					nombre: '',
					prefijo: '',
					unidad: null,
					valor: 0,
				},
			}),
		},
	},
	extraReducers: {
		[getUnidadId.fulfilled]: (state, action) => action.payload,
		[createUnidad.fulfilled]: (state, action) => action.payload,
		[updateUnidad.fulfilled]: (state, action) => action.payload,
		[deleteUnidad.fulfilled]: (state, action) => null,
	},
});

export const { newUnidad, resetUnidad } = UnidadSlice.actions;
export default UnidadSlice.reducer;

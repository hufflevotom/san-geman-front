import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createUbicacionEstampado = createAsyncThunk(
	'configuracion/ubicacionEstampado/postUbicacionEstampado',
	async (ubicacionEstampado, { rejectWithValue }) => {
		try {
			const response = await httpClient.post(
				'configuraciones/ubicacion-estilos-estampados',
				ubicacionEstampado
			);
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

export const getUbicacionEstampadoId = createAsyncThunk(
	'configuracion/ubicacionEstampado/getUbicacionEstampadoId',
	async id => {
		const response = await httpClient.get(`configuraciones/ubicacion-estilos-estampados/${id}`);
		const data = await response.data.body;
		return data;
	}
);

export const updateUbicacionEstampado = createAsyncThunk(
	'configuracion/ubicacionEstampado/updateUbicacionEstampado',
	async (ubicacionEstampado, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(
				`configuraciones/ubicacion-estilos-estampados/${ubicacionEstampado.id}`,
				ubicacionEstampado
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

export const deleteUbicacionEstampado = createAsyncThunk(
	'configuracion/ubicacionEstampado/deleteUbicacionEstampado',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().configuraciones.ubicacionEstampado;
			const response = await httpClient.delete(
				`configuraciones/ubicacion-estilos-estampados/${id}`
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

const UbicacionEstampadoSlice = createSlice({
	name: 'configuracion/ubicacionEstampado',
	initialState: null,
	reducers: {
		resetUbicacionEstampado: () => null,
		newUbicacionEstampado: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					codigo: '',
					nombre: '',
				},
			}),
		},
	},
	extraReducers: {
		[getUbicacionEstampadoId.fulfilled]: (state, action) => action.payload,
		[createUbicacionEstampado.fulfilled]: (state, action) => action.payload,
		[updateUbicacionEstampado.fulfilled]: (state, action) => action.payload,
		[deleteUbicacionEstampado.fulfilled]: (state, action) => null,
	},
});

export const { newUbicacionEstampado, resetUbicacionEstampado } = UbicacionEstampadoSlice.actions;
export default UbicacionEstampadoSlice.reducer;

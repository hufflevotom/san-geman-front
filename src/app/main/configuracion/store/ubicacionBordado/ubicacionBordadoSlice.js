import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createUbicacionBordado = createAsyncThunk(
	'configuracion/ubicacionBordado/postUbicacionBordado',
	async (ubicacionBordado, { rejectWithValue }) => {
		try {
			const response = await httpClient.post(
				'configuraciones/ubicacion-estilos-bordados',
				ubicacionBordado
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

export const getUbicacionBordadoId = createAsyncThunk(
	'configuracion/ubicacionBordado/getUbicacionBordadoId',
	async id => {
		const response = await httpClient.get(`configuraciones/ubicacion-estilos-bordados/${id}`);
		const data = await response.data.body;
		return data;
	}
);

export const updateUbicacionBordado = createAsyncThunk(
	'configuracion/ubicacionBordado/updateUbicacionBordado',
	async (ubicacionBordado, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(
				`configuraciones/ubicacion-estilos-bordados/${ubicacionBordado.id}`,
				ubicacionBordado
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

export const deleteUbicacionBordado = createAsyncThunk(
	'configuracion/ubicacionBordado/deleteUbicacionBordado',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().configuraciones.ubicacionBordado;
			const response = await httpClient.delete(`configuraciones/ubicacion-estilos-bordados/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const UbicacionBordadoSlice = createSlice({
	name: 'configuracion/ubicacionBordado',
	initialState: null,
	reducers: {
		resetUbicacionBordado: () => null,
		newUbicacionBordado: {
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
		[getUbicacionBordadoId.fulfilled]: (state, action) => action.payload,
		[createUbicacionBordado.fulfilled]: (state, action) => action.payload,
		[updateUbicacionBordado.fulfilled]: (state, action) => action.payload,
		[deleteUbicacionBordado.fulfilled]: (state, action) => null,
	},
});

export const { newUbicacionBordado, resetUbicacionBordado } = UbicacionBordadoSlice.actions;
export default UbicacionBordadoSlice.reducer;

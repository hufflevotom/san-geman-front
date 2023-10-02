import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createRuta = createAsyncThunk(
	'comercial/ruta/postRuta',
	async (ruta, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('comercial/rutas', ruta);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const getRutaId = createAsyncThunk('comercial/ruta/getRutaId', async id => {
	const response = await httpClient.get(`comercial/rutas/${id}`);
	const data = await response.data.body;
	return data;
});

export const updateRuta = createAsyncThunk(
	'comercial/ruta/putRuta',
	async (ruta, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`comercial/rutas/${ruta.id}`, ruta);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteRuta = createAsyncThunk(
	'comercial/ruta/deleteRuta',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().comercial.ruta;
			const response = await httpClient.delete(`comercial/rutas/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const RutaSlice = createSlice({
	name: 'comercial/ruta',
	initialState: null,
	reducers: {
		resetRuta: () => null,
		newRuta: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					descripcion: '',
				},
			}),
		},
	},
	extraReducers: {
		[getRutaId.fulfilled]: (state, action) => action.payload,
		[createRuta.fulfilled]: (state, action) => action.payload,
		[updateRuta.fulfilled]: (state, action) => action.payload,
		[deleteRuta.fulfilled]: (state, action) => null,
	},
});

export const { newRuta, resetRuta } = RutaSlice.actions;
export default RutaSlice.reducer;

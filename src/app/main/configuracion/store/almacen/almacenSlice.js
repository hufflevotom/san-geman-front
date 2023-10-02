import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createAlmacen = createAsyncThunk(
	'configuracion/almacen/postAlmacen',
	async (almacen, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('configuraciones/almacenes', almacen);
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

export const getAlmacenId = createAsyncThunk('configuracion/almacen/getAlmacenId', async id => {
	const response = await httpClient.get(`configuraciones/almacenes/${id}`);
	const data = await response.data.body;
	return data;
});

export const updateAlmacen = createAsyncThunk(
	'configuracion/almacen/putAlmacen',
	async (almacen, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`configuraciones/almacenes/${almacen.id}`, almacen);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteAlmacen = createAsyncThunk(
	'configuracion/almacen/deleteAlmacen',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().configuraciones.almacen;
			const response = await httpClient.delete(`configuraciones/almacenes/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const AlmacenSlice = createSlice({
	name: 'configuracion/almacen',
	initialState: null,
	reducers: {
		resetAlmacen: () => null,
		newAlmacen: {
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
		[getAlmacenId.fulfilled]: (state, action) => action.payload,
		[createAlmacen.fulfilled]: (state, action) => action.payload,
		[updateAlmacen.fulfilled]: (state, action) => action.payload,
		[deleteAlmacen.fulfilled]: (state, action) => null,
	},
});

export const { newAlmacen, resetAlmacen } = AlmacenSlice.actions;
export default AlmacenSlice.reducer;

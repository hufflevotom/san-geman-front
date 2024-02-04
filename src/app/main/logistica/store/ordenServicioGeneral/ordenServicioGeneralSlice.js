import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createOrdenServicioGeneral = createAsyncThunk(
	'logistica/orden-servicio-general/postOrdenServicioGeneral',
	async (ordenServicioGeneral, { rejectWithValue }) => {
		try {
			const response = await httpClient.post(
				'logistica/orden-servicio-general',
				ordenServicioGeneral
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

export const getOrdenServicioGeneralId = createAsyncThunk(
	'logistica/orden-servicio-general/getOrdenServicioGeneralId',
	async id => {
		const response = await httpClient.get(`logistica/orden-servicio-general/${id}`);
		const data = await response.data.body;
		return data;
	}
);

export const updateOrdenServicioGeneral = createAsyncThunk(
	'logistica/orden-servicio-general/putOrdenServicioGeneral',
	async (ordenServicioGeneral, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(
				`logistica/orden-servicio-general/${ordenServicioGeneral.id}`,
				ordenServicioGeneral
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

export const deleteOrdenServicioGeneral = createAsyncThunk(
	'logistica/orden-servicio-general/deleteOrdenServicioGeneral',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().logistica.ordenServicioGeneral;
			const response = await httpClient.delete(`logistica/orden-servicio-general/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const OrdenServicioGeneralSlice = createSlice({
	name: 'logistica/orden-servicio-general',
	initialState: null,
	reducers: {
		resetOrdenServicioGeneral: () => null,
		newOrdenServicioGeneral: {
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
		[getOrdenServicioGeneralId.fulfilled]: (state, action) => action.payload,
		[createOrdenServicioGeneral.fulfilled]: (state, action) => action.payload,
		[updateOrdenServicioGeneral.fulfilled]: (state, action) => action.payload,
		[deleteOrdenServicioGeneral.fulfilled]: (state, action) => null,
	},
});

export const { resetOrdenServicioGeneral, newOrdenServicioGeneral } =
	OrdenServicioGeneralSlice.actions;
export default OrdenServicioGeneralSlice.reducer;

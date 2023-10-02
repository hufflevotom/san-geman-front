import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createNotificacion = createAsyncThunk(
	'notificacion/postNotificacion',
	async (notificacion, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('auth/notificaciones', notificacion);
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

export const getNotificacionId = createAsyncThunk('notificacion/getNotificacionId', async id => {
	const response = await httpClient.get(`auth/roles/${id}`);
	const data = await response.data.body;
	return data;
});

export const updateNotificacion = createAsyncThunk(
	'notificacion/putNotificacion',
	async (notificacion, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(
				`auth/roles/notificaciones/${notificacion.id}`,
				notificacion
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

export const deleteNotificacion = createAsyncThunk(
	'notificacion/deleteNotificacion',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().usuarios.notificacion;
			const response = await httpClient.delete(`auth/notificaciones/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const NotificacionSlice = createSlice({
	name: 'notificacion',
	initialState: null,
	reducers: {
		resetNotificacion: () => null,
		newNotificacion: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					nombre: '',
					modulos: [],
				},
			}),
		},
	},
	extraReducers: {
		[getNotificacionId.fulfilled]: (state, action) => action.payload,
		[createNotificacion.fulfilled]: (state, action) => action.payload,
		[updateNotificacion.fulfilled]: (state, action) => action.payload,
		[deleteNotificacion.fulfilled]: (state, action) => null,
	},
});

export const { resetNotificacion, newNotificacion } = NotificacionSlice.actions;
export default NotificacionSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createUsuario = createAsyncThunk(
	'usuario/postUsuario',
	async (usuario, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('usuarios', usuario);
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

export const getUsuarioId = createAsyncThunk('usuario/getUsuarioId', async id => {
	const response = await httpClient.get(`usuarios/${id}`);
	const data = await response.data.body;
	return data;
});

export const updateUsuario = createAsyncThunk(
	'usuario/putUsuario',
	async (prenda, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`usuarios/${prenda.id}`, prenda);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteUsuario = createAsyncThunk(
	'usuario/deleteUsuario',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().usuarios.usuario;
			const response = await httpClient.delete(`usuarios/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const UsuarioSlice = createSlice({
	name: 'usuario',
	initialState: null,
	reducers: {
		resetUsuario: () => null,
		newUsuario: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					nombre: '',
					apellido: '',
					email: '',
					password: '',
					/* 	fechaNacimiento: '',
					genero: '', */
				},
			}),
		},
	},
	extraReducers: {
		[getUsuarioId.fulfilled]: (state, action) => action.payload,
		[createUsuario.fulfilled]: (state, action) => action.payload,
		[updateUsuario.fulfilled]: (state, action) => action.payload,
		[deleteUsuario.fulfilled]: (state, action) => null,
	},
});

export const { resetUsuario, newUsuario } = UsuarioSlice.actions;
export default UsuarioSlice.reducer;

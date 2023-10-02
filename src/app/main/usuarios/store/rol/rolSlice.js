import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createRol = createAsyncThunk('rol/postRol', async (rol, { rejectWithValue }) => {
	try {
		const response = await httpClient.post('auth/roles', rol);
		const data = await response.data;
		return data;
	} catch (error) {
		if (!error.response) {
			throw error;
		}
		return rejectWithValue(error.response.data);
	}
});

export const getRolId = createAsyncThunk('rol/getRolId', async id => {
	const response = await httpClient.get(`auth/roles/${id}`);
	const data = await response.data.body;
	return data;
});

export const updateRol = createAsyncThunk('rol/putRol', async (rol, { rejectWithValue }) => {
	try {
		const response = await httpClient.put(`auth/roles/${rol.id}`, rol);
		return response.data;
	} catch (error) {
		if (!error.response) {
			throw error;
		}
		return rejectWithValue(error.response.data);
	}
});

export const deleteRol = createAsyncThunk(
	'rol/deleteRol',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().usuarios.rol;
			const response = await httpClient.delete(`auth/roles/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const RolSlice = createSlice({
	name: 'rol',
	initialState: null,
	reducers: {
		resetRol: () => null,
		newRol: {
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
		[getRolId.fulfilled]: (state, action) => action.payload,
		[createRol.fulfilled]: (state, action) => action.payload,
		[updateRol.fulfilled]: (state, action) => action.payload,
		[deleteRol.fulfilled]: (state, action) => null,
	},
});

export const { resetRol, newRol } = RolSlice.actions;
export default RolSlice.reducer;

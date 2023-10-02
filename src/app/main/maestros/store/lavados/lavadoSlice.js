import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createLavado = createAsyncThunk(
	'maestro/lavado/postLavado',
	async (lavado, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('maestro/lavados', lavado);
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

export const getLavadoId = createAsyncThunk('maestro/lavado/getLavadoId', async id => {
	const response = await httpClient.get(`maestro/lavados/${id}`);

	const data = await response.data.body;
	return data;
});

export const updateLavado = createAsyncThunk(
	'maestro/lavado/putLavado',
	async (lavado, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`maestro/lavados/${lavado.id}`, lavado);

			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteLavado = createAsyncThunk(
	'maestro/lavado/deleteLavado',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().maestros.lavado;
			const response = await httpClient.delete(`maestro/lavados/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const LavadoSlice = createSlice({
	name: 'maestros/lavado',
	initialState: null,
	reducers: {
		resetLavado: () => null,
		newlavado: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					descripcion: '',
				},
			}),
		},
	},
	extraReducers: {
		[getLavadoId.fulfilled]: (state, action) => action.payload,
		[createLavado.fulfilled]: (state, action) => action.payload,
		[updateLavado.fulfilled]: (state, action) => action.payload,
		[deleteLavado.fulfilled]: (state, action) => null,
	},
});

export const { newlavado, resetLavado } = LavadoSlice.actions;
export default LavadoSlice.reducer;

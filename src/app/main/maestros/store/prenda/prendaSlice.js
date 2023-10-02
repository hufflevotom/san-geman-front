import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createPrenda = createAsyncThunk(
	'maestro/prenda/postPrenda',
	async (prenda, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('maestro/prenda', prenda);
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

export const getPrendaId = createAsyncThunk('maestro/prenda/getPrendaId', async id => {
	const response = await httpClient.get(`maestro/prenda/${id}`);
	const data = await response.data.body;
	return data;
});

export const updatePrenda = createAsyncThunk(
	'maestro/prenda/putPrenda',
	async (prenda, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`maestro/prenda/${prenda.id}`, prenda);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deletePrenda = createAsyncThunk(
	'maestro/prenda/deletePrenda',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().maestros.prenda;
			const response = await httpClient.delete(`maestro/prenda/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const PrendaSlice = createSlice({
	name: 'maestros/prenda',
	initialState: null,
	reducers: {
		resetPrenda: () => null,
		newPrenda: {
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
		[getPrendaId.fulfilled]: (state, action) => action.payload,
		[createPrenda.fulfilled]: (state, action) => action.payload,
		[updatePrenda.fulfilled]: (state, action) => action.payload,
		[deletePrenda.fulfilled]: (state, action) => null,
	},
});

export const { newPrenda, resetPrenda } = PrendaSlice.actions;
export default PrendaSlice.reducer;

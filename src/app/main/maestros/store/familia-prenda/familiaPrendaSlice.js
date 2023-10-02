import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createFamiliaPrenda = createAsyncThunk(
	'maestro/familia-prenda/postPrenda',
	async (prenda, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('maestro/familia-prenda', prenda);
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

export const getFamiliaPrendaId = createAsyncThunk(
	'maestro/familia-prenda/getPrendaId',
	async id => {
		const response = await httpClient.get(`maestro/familia-prenda/${id}`);
		const data = await response.data.body;
		return data;
	}
);

export const updateFamiliaPrenda = createAsyncThunk(
	'maestro/familia-prenda/putPrenda',
	async (prenda, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`maestro/familia-prenda/${prenda.id}`, prenda);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteFamiliaPrenda = createAsyncThunk(
	'maestro/familia-prenda/deletePrenda',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().maestros.familiaPrenda;
			const response = await httpClient.delete(`maestro/familia-prenda/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const FamliliaPrendaSlice = createSlice({
	name: 'maestros/familia-prenda',
	initialState: null,
	reducers: {
		resetFamliliaPrenda: () => null,
		newFamiliaPrenda: {
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
		[getFamiliaPrendaId.fulfilled]: (state, action) => action.payload,
		[createFamiliaPrenda.fulfilled]: (state, action) => action.payload,
		[updateFamiliaPrenda.fulfilled]: (state, action) => action.payload,
		[deleteFamiliaPrenda.fulfilled]: (state, action) => null,
	},
});

export const { newFamiliaPrenda, resetFamliliaPrenda } = FamliliaPrendaSlice.actions;
export default FamliliaPrendaSlice.reducer;

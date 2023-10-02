import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createFamiliaTela = createAsyncThunk(
	'maestro/familia-tela/postTela',
	async (familiaTela, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('maestro/familia-tela', familiaTela);
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

export const getFamiliaTelaId = createAsyncThunk(
	'maestro/familia-tela/getFamiliaTelaId',
	async id => {
		const response = await httpClient.get(`maestro/familia-tela/${id}`);
		const data = await response.data.body;
		return data;
	}
);

export const updateFamiliaTela = createAsyncThunk(
	'maestro/familia-tela/putTela',
	async (familiaTela, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`maestro/familia-tela/${familiaTela.id}`, familiaTela);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteFamiliaTela = createAsyncThunk(
	'maestro/familia-tela/deleteTela',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().maestros.familiaTela;
			const response = await httpClient.delete(`maestro/familia-tela/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const FamiliaTelaSlice = createSlice({
	name: 'maestros/familia-tela',
	initialState: null,
	reducers: {
		resetFamiliaTela: () => null,
		newFamiliaTela: {
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
		[getFamiliaTelaId.fulfilled]: (state, action) => action.payload,
		[createFamiliaTela.fulfilled]: (state, action) => action.payload,
		[updateFamiliaTela.fulfilled]: (state, action) => action.payload,
		[deleteFamiliaTela.fulfilled]: (state, action) => null,
	},
});

export const { newFamiliaTela, resetFamiliaTela } = FamiliaTelaSlice.actions;
export default FamiliaTelaSlice.reducer;

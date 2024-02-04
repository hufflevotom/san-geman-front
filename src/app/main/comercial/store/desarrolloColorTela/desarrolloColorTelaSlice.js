import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createDesarrolloColorTela = createAsyncThunk(
	'comercial/desarrolloColorTela/postDesarrolloColorTela',
	async (desarrolloColorTela, { rejectWithValue }) => {
		try {
			const response = await httpClient.post(
				'comercial/desarrollo-color-tela',
				desarrolloColorTela
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

export const getDesarrolloColorTelaId = createAsyncThunk(
	'comercial/desarrolloColorTela/getDesarrolloColorTelaId',
	async id => {
		const response = await httpClient.get(`comercial/desarrollo-color-tela/${id}`);
		const data = await response.data.body;

		return data;
	}
);

export const updateDesarrolloColorTela = createAsyncThunk(
	'comercial/desarrolloColorTela/putDesarrolloColorTela',
	async (desarrolloColorTela, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(
				`comercial/desarrollo-color-tela/${desarrolloColorTela.id}`,
				desarrolloColorTela
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

export const deleteDesarrolloColorTela = createAsyncThunk(
	'comercial/desarrolloColorTela/deleteDesarrolloColorTela',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().comercial.desarrolloColorTela;
			const response = await httpClient.delete(`comercial/desarrollo-color-tela/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const DesarrolloColorTelaSlice = createSlice({
	name: 'comercial/desarrolloColorTela',
	initialState: null,
	reducers: {
		resetDesarrolloColorTela: () => null,
		newDesarrolloColorTela: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					codigo: '',
					visible: true,
					fechaDespacho: '',
					pedidosId: [],
					clienteId: null,
					dataEstilos: [],
				},
			}),
		},
	},
	extraReducers: {
		[getDesarrolloColorTelaId.fulfilled]: (state, action) => action.payload,
		[createDesarrolloColorTela.fulfilled]: (state, action) => action.payload,
		[updateDesarrolloColorTela.fulfilled]: (state, action) => action.payload,
		[deleteDesarrolloColorTela.fulfilled]: (state, action) => null,
	},
});

export const { newDesarrolloColorTela, resetDesarrolloColorTela } =
	DesarrolloColorTelaSlice.actions;
export default DesarrolloColorTelaSlice.reducer;

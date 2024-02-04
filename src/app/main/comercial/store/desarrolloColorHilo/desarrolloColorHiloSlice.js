import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createDesarrolloColorHilo = createAsyncThunk(
	'comercial/desarrolloColorHilo/postDesarrolloColorHilo',
	async (desarrolloColorHilo, { rejectWithValue }) => {
		try {
			const response = await httpClient.post(
				'comercial/desarrollo-color-hilo',
				desarrolloColorHilo
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

export const getDesarrolloColorHiloId = createAsyncThunk(
	'comercial/desarrolloColorHilo/getDesarrolloColorHiloId',
	async id => {
		const response = await httpClient.get(`comercial/desarrollo-color-hilo/${id}`);
		const data = await response.data.body;

		return data;
	}
);

export const updateDesarrolloColorHilo = createAsyncThunk(
	'comercial/desarrolloColorHilo/putDesarrolloColorHilo',
	async (desarrolloColorHilo, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(
				`comercial/desarrollo-color-hilo/${desarrolloColorHilo.id}`,
				desarrolloColorHilo
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

export const deleteDesarrolloColorHilo = createAsyncThunk(
	'comercial/desarrolloColorHilo/deleteDesarrolloColorHilo',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().comercial.desarrolloColorHilo;
			const response = await httpClient.delete(`comercial/desarrollo-color-hilo/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const DesarrolloColorHiloSlice = createSlice({
	name: 'comercial/desarrolloColorHilo',
	initialState: null,
	reducers: {
		resetDesarrolloColorHilo: () => null,
		newDesarrolloColorHilo: {
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
		[getDesarrolloColorHiloId.fulfilled]: (state, action) => action.payload,
		[createDesarrolloColorHilo.fulfilled]: (state, action) => action.payload,
		[updateDesarrolloColorHilo.fulfilled]: (state, action) => action.payload,
		[deleteDesarrolloColorHilo.fulfilled]: (state, action) => null,
	},
});

export const { newDesarrolloColorHilo, resetDesarrolloColorHilo } =
	DesarrolloColorHiloSlice.actions;
export default DesarrolloColorHiloSlice.reducer;

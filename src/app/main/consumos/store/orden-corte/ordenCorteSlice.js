import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createOrdenCorte = createAsyncThunk(
	'consumos/orden-corte/postOrdenCorte',
	async (body, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('orden-corte-panios', body);
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

export const getOrdenCorteId = createAsyncThunk(
	'consumos/orden-corte/getOrdenCorteId',
	async id => {
		const response = await httpClient.get(`orden-corte-panios/${id}`);
		const data = await response.data.body;
		return data;
	}
);

export const updateOrdenCorte = createAsyncThunk(
	'consumos/orden-corte/putOrdenCorte',
	async (body, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`orden-corte-panios/${body.id}`, body);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteOrdenCorte = createAsyncThunk(
	'consumos/orden-corte/deleteOrdenCorte',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().consumos.ordenCorte;
			const response = await httpClient.delete(`consumos/orden-corte-panios/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const OrdenCorteSlice = createSlice({
	name: 'consumos/orden-corte',
	initialState: null,
	reducers: {
		resetOrdenCorte: () => null,
		newOrdenCorte: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					productoTelaId: '',
					molde: '',
					fecha: '',
					produccionId: '',
					prendaId: '',
					complementos: [],
					piezas: [],
					estilosId: [],
					telasId: [],
					colorId: '',
					cantidades: [],
					tizados: [],
					extras: [],
				},
			}),
		},
	},
	extraReducers: {
		[getOrdenCorteId.fulfilled]: (state, action) => action.payload,
		[createOrdenCorte.fulfilled]: (state, action) => action.payload,
		[updateOrdenCorte.fulfilled]: (state, action) => action.payload,
		[deleteOrdenCorte.fulfilled]: (state, action) => null,
	},
});

export const { resetOrdenCorte, newOrdenCorte } = OrdenCorteSlice.actions;
export default OrdenCorteSlice.reducer;

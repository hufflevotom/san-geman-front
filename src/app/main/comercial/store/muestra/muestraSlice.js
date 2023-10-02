import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createMuestra = createAsyncThunk(
	'comercial/muestra/postMuestra',
	async (muestra, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('comercial/muestras', muestra);
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

export const getMuestraId = createAsyncThunk('comercial/muestra/getMuestraId', async id => {
	const response = await httpClient.get(`comercial/muestras/${id}`);
	const data = await response.data.body;

	data.dataEstilos = data.pedidos.map(pedido => {
		return {
			id: pedido.id,
			po: pedido.po,
			estilos: pedido.estilos,
			cantidades: pedido.cantidades,
			cantidadesPorcentaje: pedido.cantidadesPorcentaje,
			totalCantidades: pedido.totalCantidades,
		};
	});

	console.log('GET BY ID PRODUCCION: 2 ', data);

	return data;
});

export const updateMuestra = createAsyncThunk(
	'comercial/muestra/putMuestra',
	async (muestra, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`comercial/muestras/${muestra.id}`, muestra);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteMuestra = createAsyncThunk(
	'comercial/muestra/deleteMuestra',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().comercial.muestra;
			const response = await httpClient.delete(`comercial/muestras/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const MuestraSlice = createSlice({
	name: 'comercial/muestra',
	initialState: null,
	reducers: {
		resetMuestra: () => null,
		newMuestra: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					codigo: '',
					fechaDespacho: '',
					pedidosId: [],
					clienteId: null,
					dataEstilos: [],
				},
			}),
		},
	},
	extraReducers: {
		[getMuestraId.fulfilled]: (state, action) => action.payload,
		[createMuestra.fulfilled]: (state, action) => action.payload,
		[updateMuestra.fulfilled]: (state, action) => action.payload,
		[deleteMuestra.fulfilled]: (state, action) => null,
	},
});

export const { newMuestra, resetMuestra } = MuestraSlice.actions;
export default MuestraSlice.reducer;

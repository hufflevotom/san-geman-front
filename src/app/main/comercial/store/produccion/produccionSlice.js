import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createProduccion = createAsyncThunk(
	'comercial/produccion/postProduccion',
	async (produccion, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('comercial/producciones', produccion);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const getProduccionId = createAsyncThunk(
	'comercial/produccion/getProduccionId',
	async id => {
		const response = await httpClient.get(`comercial/producciones/${id}`);
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
	}
);

export const updateProduccion = createAsyncThunk(
	'comercial/produccion/putProduccion',
	async (produccion, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`comercial/producciones/${produccion.id}`, produccion);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteProduccion = createAsyncThunk(
	'comercial/produccion/deleteProduccion',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().comercial.produccion;
			const response = await httpClient.delete(`comercial/producciones/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const ProduccionSlice = createSlice({
	name: 'comercial/produccion',
	initialState: null,
	reducers: {
		resetProduccion: () => null,
		newProduccion: {
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
		[getProduccionId.fulfilled]: (state, action) => action.payload,
		[createProduccion.fulfilled]: (state, action) => action.payload,
		[updateProduccion.fulfilled]: (state, action) => action.payload,
		[deleteProduccion.fulfilled]: (state, action) => null,
	},
});

export const { newProduccion, resetProduccion } = ProduccionSlice.actions;
export default ProduccionSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';
import { setPedidoLoading } from './helpers';

export const createPedido = createAsyncThunk(
	'comercial/pedido/postPedido',
	async (pedido, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('comercial/pedidos', pedido);

			return response.data;
		} catch (error) {
			console.log(error);
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const getPedidoId = createAsyncThunk('comercial/pedido/getPedidoId', async id => {
	const response = await httpClient.get(`comercial/pedidos/${id}`);
	const data = await response.data.body;
	data.dataEstilos = {
		estilos: data.estilos,
		cantidades: data.cantidades,
		cantidadesPorcentaje: data.cantidadesPorcentaje,
		totalCantidades: data.totalCantidades,
	};
	data.ordenTallas = data.ordenTallas.map(ot => ({
		label: ot.talla?.talla,
		orden: ot.orden,
		talla: ot.talla,
	}));

	console.log('DATA PEDIDO: ', data);

	return data;
});

export const updatePedido = createAsyncThunk(
	'comercial/pedido/putPedido',
	async (pedido, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`comercial/pedidos/${pedido.id}`, pedido);

			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deletePedido = createAsyncThunk(
	'comercial/pedido/deletePedido',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().comercial.pedido;
			const response = await httpClient.delete(`comercial/pedidos/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const PedidoSlice = createSlice({
	name: 'comercial/pedido',
	initialState: null,
	reducers: {
		resetPedido: () => null,
		newPedido: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					po: '',
					incoterms: '',
					shipMode: '',
					temporada: '',
					estilosId: [],
					cantidades: [],
					cantidadesPorcentaje: [],
					totalCantidades: [],
					dataEstilos: {
						estilos: [],
						cantidades: [],
						cantidadesPorcentaje: [],
						totalCantidades: [],
					},
					aviosPo: [],
				},
			}),
		},
	},
	extraReducers: {
		[getPedidoId.fulfilled]: (state, action) => action.payload,
		[createPedido.fulfilled]: (state, action) => action.payload,
		[updatePedido.fulfilled]: (state, action) => action.payload,
		[deletePedido.fulfilled]: (state, action) => null,
	},
});

export const { newPedido, resetPedido } = PedidoSlice.actions;
export default PedidoSlice.reducer;

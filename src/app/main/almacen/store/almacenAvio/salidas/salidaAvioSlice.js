import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createSalida = createAsyncThunk(
	'almacen/almacen-avio/postSalida',
	async (almacenTela, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('almacen-avio/salida', almacenTela);
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

export const updateSalida = createAsyncThunk(
	'almacen/almacen-avio/putSalida',
	async (almacenTela, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`almacen-avio/salida/${almacenTela.id}`, almacenTela);
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

export const getSalidaId = createAsyncThunk('almacen/almacen-avio/getSalidaId', async id => {
	const response = await httpClient.get(`almacen-avio/salida/${id}`);
	const data = await response.data.body;
	// data.detalleTabla = response.data.body.detallesProductosSalidasAlmacenesTelas.map(e => {
	// 	let telaProgramada = 0;
	// 	data.ordenServicioCorte.ordenesCortePaños.forEach(element => {
	// 		element.extras.forEach(extras => {
	// 			if (extras.productoTela.id === e.producto.id) {
	// 				telaProgramada += extras.telaProgramada;
	// 			}
	// 		});
	// 	});
	// 	return {
	// 		...e,
	// 		id: e.id,
	// 		cantidadSalida: e.cantidad,
	// 		cantidadRollos: e.cantidadRollos,
	// 		telaProgramada,
	// 		productoTela: e.producto,
	// 		colores: e.producto?.color,
	// 		numPartida: e.producto?.partida,
	// 		tela: e.producto?.tela,
	// 	};
	// });
	// data.observacion = data.ordenServicioCorte.observaciones;
	return data;
});

const SalidaAvioSlice = createSlice({
	name: 'almacen/almacen-avio',
	initialState: null,
	reducers: {
		resetSalida: () => null,
		newSalida: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					fechaRegistro: '',
					tipoOperacion: '',
					tipoComprobante: '',
					ordenCompraId: 0,
					codigo: '',
				},
			}),
		},
	},
	extraReducers: {
		[getSalidaId.fulfilled]: (state, action) => action.payload,
		[createSalida.fulfilled]: (state, action) => action.payload,
		[updateSalida.fulfilled]: (state, action) => action.payload,
	},
});

export const { resetSalida, newSalida } = SalidaAvioSlice.actions;
export default SalidaAvioSlice.reducer;

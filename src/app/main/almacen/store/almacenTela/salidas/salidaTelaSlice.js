import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createSalida = createAsyncThunk(
	'almacen/almacen-tela/postSalida',
	async (almacenTela, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('almacen-tela/salida', almacenTela);
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
	'almacen/almacen-tela/putSalida',
	async (almacenTela, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`almacen-tela/salida/${almacenTela.id}`, almacenTela);
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

export const getSalidaId = createAsyncThunk('almacen/almacen-tela/getSalidaId', async id => {
	const response = await httpClient.get(`almacen-tela/salida/${id}`);
	const data = await response.data.body;
	data.detalleTabla = response.data.body.detallesProductosSalidasAlmacenesTelas.map(e => {
		let telaProgramada = 0;
		data.ordenServicioCorte.ordenesCortePaños.forEach(element => {
			element.extras.forEach(extras => {
				if (extras.productoTela.id === e.producto.id) {
					telaProgramada += extras.telaProgramada;
				}
			});
		});
		return {
			...e,
			id: e.id,
			cantidadSalida: e.cantidad,
			cantidadRollos: e.cantidadRollos,
			telaProgramada,
			productoTela: e.producto,
			colores: e.producto?.color,
			numPartida: e.producto?.partida,
			tela: e.producto?.tela,
		};
	});
	data.observacion = data.ordenServicioCorte.observaciones;
	return data;
});

const SalidaTelaSlice = createSlice({
	name: 'almacen/almacen-tela',
	initialState: null,
	reducers: {
		resetSalida: () => null,
		newSalida: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					fechaRegistro: '',
					fechaDocumento: null,
					tipoOperacion: '',
					tipoComprobante: '',
					nroSerie: '',
					nroDocumento: '',
					ordenCompraId: 0,
					detallesProductosIngresosAlmacenesTelas: [],
					codigo: '',
					telas: [],
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

export const { resetSalida, newSalida } = SalidaTelaSlice.actions;
export default SalidaTelaSlice.reducer;

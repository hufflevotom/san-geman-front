import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createIngreso = createAsyncThunk(
	'almacen/almacen-tela/postIngreso',
	async (almacenTela, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('almacen-tela/ingreso', almacenTela);
			const data = await response.data;
			if (almacenTela.documentoReferenciaUrl) {
				const formData = new FormData();
				formData.append('documento', almacenTela.documentoReferenciaUrl.file);
				await httpClient.put(`almacen-tela/ingreso/documento/${data.body.id}`, formData);
			}
			return data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const getIngresoId = createAsyncThunk('almacen/almacen-tela/getIngresoId', async id => {
	const response = await httpClient.get(`almacen-tela/ingreso/${id}`);
	const data = await response.data.body;
	data.telasComplemento = response.data.body.detallesProductosIngresosAlmacenesTelas.map(e => {
		return {
			id: e.id,
			cantidad: e.cantidad,
			cantidadRollo: e.cantidadRollos,
			colores: e.producto?.color,
			numPartida: e.producto?.partida,
			tela: e.producto?.tela,
			unidad: e.unidad,
		};
	});
	return data;
});

const IngresosTelaSlice = createSlice({
	name: 'almacen/almacen-tela',
	initialState: null,
	reducers: {
		resetIngreso: () => null,
		newIngreso: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					fechaRegistro: '',
					tipoOperacion: '',
					tipoComprobante: '',
					nroSerie: '',
					nroDocumento: '',
					ordenCompraId: 0,
					detallesProductosIngresosAlmacenesTelas: [],
				},
			}),
		},
	},
	extraReducers: {
		[getIngresoId.fulfilled]: (state, action) => action.payload,
		[createIngreso.fulfilled]: (state, action) => action.payload,
	},
});

export const { resetIngreso, newIngreso } = IngresosTelaSlice.actions;
export default IngresosTelaSlice.reducer;

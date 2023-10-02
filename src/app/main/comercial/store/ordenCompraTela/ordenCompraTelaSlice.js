/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createOCTela = createAsyncThunk(
	'comercial/ordCompraTela/postOCTela',
	async (cliente, { rejectWithValue }) => {
		try {
			//* Asigna automáticamente cada partida seleccionada en el modal, para la producción seleccionada
			const { partidasAsignar } = cliente;
			for (const partida of partidasAsignar) {
				await httpClient.put(
					`producto-tela/changeAsignarOp/${partida.producto.id}/${cliente.produccionId}`
				);
			}
			const response = await httpClient.post('comercial/compra-telas', cliente);
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

export const getOCTelaId = createAsyncThunk('comercial/ordCompraTela/getOCTela', async id => {
	const response = await httpClient.get(`comercial/compra-telas/${id}`);
	const data = await response.data.body;
	return data;
});

export const updateOCTela = createAsyncThunk(
	'comercial/ordCompraTela/putOCTela',
	async (cliente, { rejectWithValue }) => {
		try {
			//* Asigna automáticamente cada partida seleccionada en el modal, para la producción seleccionada
			const { partidasAsignar } = cliente;
			for (const partida of partidasAsignar) {
				await httpClient.post(
					`producto-tela/changeAsignarOp/${partida.producto.id}/${cliente.produccionId}`
				);
			}
			const response = await httpClient.put(`comercial/compra-telas/${cliente.id}`, cliente);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteOCTela = createAsyncThunk(
	'comercial/ordCompraTela/deleteOCTela',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().comercial.ordenCompraTela;
			const response = await httpClient.delete(`comercial/compra-telas/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const OrdenCompraTelaSlice = createSlice({
	name: 'comercial/ordCompraTela',
	initialState: null,
	reducers: {
		resetOCTela: () => null,
		newOCTela: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					codigo: '',
					valorVenta: 0,
					igv: 0,
					total: 0,
					fechaEmision: '',
					fechaEntrega: '',
					fechaAnulacion: '',
					observaciones: '',
					proveedorId: 0,
					produccionId: 0,
					telas: [],
				},
			}),
		},
	},
	extraReducers: {
		[getOCTelaId.fulfilled]: (state, action) => action.payload,
		[createOCTela.fulfilled]: (state, action) => action.payload,
		[updateOCTela.fulfilled]: (state, action) => action.payload,
		[deleteOCTela.fulfilled]: (state, action) => null,
	},
});

export const { resetOCTela, newOCTela } = OrdenCompraTelaSlice.actions;
export default OrdenCompraTelaSlice.reducer;

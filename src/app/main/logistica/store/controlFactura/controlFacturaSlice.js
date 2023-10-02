import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createControlFactura = createAsyncThunk(
	'logistica/control-factura/postControlFactura',
	async (oSCorte, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('logistica/control-factura', oSCorte);
			const data = await response.data;
			if (oSCorte.imagen) {
				const body = new FormData();
				body.append('imagen', oSCorte.imagen.file);
				await httpClient.put(`logistica/control-factura/imagen/${data.body.id}`, body, {
					'Content-Type': 'multipart/form-data',
				});
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

export const getControlFacturaId = createAsyncThunk(
	'logistica/control-factura/getControlFacturaId',
	async id => {
		const response = await httpClient.get(`logistica/control-factura/${id}`);
		const data = await response.data.body;
		return data;
	}
);

export const updateControlFactura = createAsyncThunk(
	'logistica/control-factura/putControlFactura',
	async (controlFactura, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(
				`logistica/control-factura/${controlFactura.id}`,
				controlFactura
			);
			if (controlFactura.imagen) {
				const body = new FormData();
				body.append('imagen', controlFactura.imagen.file);
				await httpClient.put(`logistica/control-factura/imagen/${controlFactura.id}`, body, {
					'Content-Type': 'multipart/form-data',
				});
			}
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteControlFactura = createAsyncThunk(
	'logistica/control-factura/deleteControlFactura',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().logistica.oSCorte;
			const response = await httpClient.delete(`logistica/control-factura/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const ControlFacturaSlice = createSlice({
	name: 'logistica/control-factura',
	initialState: null,
	reducers: {
		resetControlFactura: () => null,
		newControlFactura: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					descripcion: '',
					prefijo: '',
				},
			}),
		},
	},
	extraReducers: {
		[getControlFacturaId.fulfilled]: (state, action) => action.payload,
		[createControlFactura.fulfilled]: (state, action) => action.payload,
		[updateControlFactura.fulfilled]: (state, action) => action.payload,
		[deleteControlFactura.fulfilled]: (state, action) => null,
	},
});

export const { resetControlFactura, newControlFactura } = ControlFacturaSlice.actions;
export default ControlFacturaSlice.reducer;

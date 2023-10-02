import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createCliente = createAsyncThunk(
	'comercial/cliente/postCliente',
	async (cliente, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('comercial/clientes', cliente);
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

export const getClienteId = createAsyncThunk('comercial/cliente/getClienteId', async id => {
	const response = await httpClient.get(`comercial/clientes/${id}`);
	const data = await response.data.body;
	data.ubigeo = {
		codigo: data.ubigeo,
		label: data.ubigeo,
		key: data.ubigeo,
		distrito: data.ubigeo,
	};
	return data;
});

export const updateCliente = createAsyncThunk(
	'comercial/cliente/putCliente',
	async (cliente, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`comercial/clientes/${cliente.id}`, cliente);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteCliente = createAsyncThunk(
	'comercial/cliente/deleteCliente',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().comercial.cliente;
			const response = await httpClient.delete(`comercial/clientes/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const ClienteSlice = createSlice({
	name: 'comercial/cliente',
	initialState: null,
	reducers: {
		resetCliente: () => null,
		newCliente: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					tipoCliente: 'N',
					tipo: 'N',
					natTipoDocumento: '',
					natNroDocumento: '',
					natNombres: '',
					natApellidoPaterno: '',
					natApellidoMaterno: '',
					razónSocial: '',
					nombreComercial: '',
					direccion: '',
					celular: '',
					celularContacto: '',
					correo: '',
					ruc: '',
					personaContacto: '',
					porcentajeError: 0,
					detraccion: '',
					pais: '',
					observacion: '',
					tipoMoneda: 'Soles',
					codigo: '',
				},
			}),
		},
	},
	extraReducers: {
		[getClienteId.fulfilled]: (state, action) => action.payload,
		[createCliente.fulfilled]: (state, action) => action.payload,
		[updateCliente.fulfilled]: (state, action) => action.payload,
		[deleteCliente.fulfilled]: (state, action) => null,
	},
});

export const { resetCliente, newCliente } = ClienteSlice.actions;
export default ClienteSlice.reducer;

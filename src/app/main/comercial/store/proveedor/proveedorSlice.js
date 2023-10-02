import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createProveedor = createAsyncThunk(
	'comercial/proveedor/postProveedor',
	async (proveedor, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('comercial/proveedores', proveedor);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const getProveedorId = createAsyncThunk('comercial/proveedor/getProveedorId', async id => {
	const response = await httpClient.get(`comercial/proveedores/${id}`);
	const data = await response.data.body;
	return data;
});

export const updateProveedor = createAsyncThunk(
	'comercial/proveedor/putProveedor',
	async (proveedor, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`comercial/proveedores/${proveedor.id}`, proveedor);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteProveedor = createAsyncThunk(
	'comercial/proveedor/deleteProveedor',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().comercial.proveedor;
			const response = await httpClient.delete(`comercial/proveedores/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const ProveedorSlice = createSlice({
	name: 'comercial/proveedor',
	initialState: null,
	reducers: {
		resetProveedor: () => null,
		newProveedor: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					tipo: 'N',
					nroDocumento: '',
					nombres: '',
					apellidoPaterno: '',
					apellidoMaterno: '',
					ruc: '',
					razonSocial: '',
					direccion: '',
					celular: '',
					correo: '',
					banco: null,
					moneda: null,
					nroCuenta: '',
					nroCci: '',
					detraccion: null,
					personaContacto: '',
					rubro: '',
					observacion: '',
				},
			}),
		},
	},
	extraReducers: {
		[getProveedorId.fulfilled]: (state, action) => action.payload,
		[createProveedor.fulfilled]: (state, action) => action.payload,
		[updateProveedor.fulfilled]: (state, action) => action.payload,
		[deleteProveedor.fulfilled]: (state, action) => null,
	},
});

export const { newProveedor, resetProveedor } = ProveedorSlice.actions;
export default ProveedorSlice.reducer;

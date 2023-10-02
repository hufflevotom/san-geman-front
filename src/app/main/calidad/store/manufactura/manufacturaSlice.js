import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createManufactura = createAsyncThunk(
	'calidad/manufactura/postManufactura',
	async (manufactura, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('calidad/manufacturas', manufactura);
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

export const getManufacturaId = createAsyncThunk(
	'calidad/manufactura/getManufacturaId',
	async id => {
		const response = await httpClient.get(`calidad/manufacturas/${id}`);
		const data = await response.data.body;
		return data;
	}
);

export const updateManufactura = createAsyncThunk(
	'calidad/manufactura/putManufactura',
	async (manufactura, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`calidad/manufacturas/${manufactura.id}`, manufactura);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteManufactura = createAsyncThunk(
	'calidad/manufactura/deleteManufactura',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().calidad.manufactura;
			const response = await httpClient.delete(`calidad/manufacturas/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const ManufacturaSlice = createSlice({
	name: 'calidad/manufactura',
	initialState: null,
	reducers: {
		resetManufactura: () => null,
		newManufactura: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					tipoManufactura: 'N',
					tipo: 'N',
					natTipoDocumento: '',
					natNroDocumento: '',
					natNombres: '',
					natApellidoPaterno: '',
					natApellidoMaterno: '',
					razónSocial: '',
					nombreCalidad: '',
					direccion: '',
					celular: '',
					correo: '',
					ruc: '',
					personaContacto: '',
					porcentajeError: 0,
					detraccion: '',
					codigo: '',
				},
			}),
		},
	},
	extraReducers: {
		[getManufacturaId.fulfilled]: (state, action) => action.payload,
		[createManufactura.fulfilled]: (state, action) => action.payload,
		[updateManufactura.fulfilled]: (state, action) => action.payload,
		[deleteManufactura.fulfilled]: (state, action) => null,
	},
});

export const { resetManufactura, newManufactura } = ManufacturaSlice.actions;
export default ManufacturaSlice.reducer;

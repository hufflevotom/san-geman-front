import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createVehiculo = createAsyncThunk(
	'logistica/vehiculo/postVehiculo',
	async (data, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('logistica/vehiculos', data);
			const dataR = await response.data;

			return dataR;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const getVehiculoId = createAsyncThunk('logistica/vehiculo/getVehiculoId', async id => {
	const response = await httpClient.get(`logistica/vehiculos/${id}`);
	const data = await response.data.body;
	return data;
});

export const updateVehiculo = createAsyncThunk(
	'logistica/vehiculo/putVehiculo',
	async (data, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`logistica/vehiculos/${data.id}`, data);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteVehiculo = createAsyncThunk(
	'logistica/vehiculo/deleteVehiculo',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().logistica.vehiculo;
			const response = await httpClient.delete(`logistica/vehiculos/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const VehiculoSlice = createSlice({
	name: 'logistica/vehiculo',
	initialState: null,
	reducers: {
		resetVehiculo: () => null,
		newVehiculo: {
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
		[getVehiculoId.fulfilled]: (state, action) => action.payload,
		[createVehiculo.fulfilled]: (state, action) => action.payload,
		[updateVehiculo.fulfilled]: (state, action) => action.payload,
		[deleteVehiculo.fulfilled]: (state, action) => null,
	},
});

export const { resetVehiculo, newVehiculo } = VehiculoSlice.actions;
export default VehiculoSlice.reducer;

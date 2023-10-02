import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createFamiliaAvios = createAsyncThunk(
	'maestro/familia-avios/postAvios',
	async (avios, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('maestro/familia-avios', avios);
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

export const getFamiliaAviosId = createAsyncThunk('maestro/familia-avios/getAviosId', async id => {
	const response = await httpClient.get(`maestro/familia-avios/${id}`);
	const data = await response.data.body;
	return data;
});

export const updateFamiliaAvios = createAsyncThunk(
	'maestro/familia-avios/putAvios',
	async (avios, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`maestro/familia-avios/${avios.id}`, avios);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteFamiliaAvios = createAsyncThunk(
	'maestro/familia-avios/deleteAvios',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().maestros.familiaAvios;
			const response = await httpClient.delete(`maestro/familia-avios/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const FamiliaAvioSlice = createSlice({
	name: 'maestros/familia-avios',
	initialState: null,
	reducers: {
		resetFamiliaAvio: () => null,
		newFamiliaAvio: {
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
		[getFamiliaAviosId.fulfilled]: (state, action) => action.payload,
		[createFamiliaAvios.fulfilled]: (state, action) => action.payload,
		[updateFamiliaAvios.fulfilled]: (state, action) => action.payload,
		[deleteFamiliaAvios.fulfilled]: (state, action) => null,
	},
});

export const { resetFamiliaAvio, newFamiliaAvio } = FamiliaAvioSlice.actions;
export default FamiliaAvioSlice.reducer;

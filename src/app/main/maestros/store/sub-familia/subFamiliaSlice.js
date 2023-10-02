/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-template */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createSubFamilia = createAsyncThunk(
	'maestro/subFamilia/postSubFamilia',
	async (subfamilia, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('maestro/subfamilia', subfamilia);
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

export const getSubFamiliaId = createAsyncThunk('maestro/subFamilia/getSubFamiliaId', async id => {
	const response = await httpClient.get(`maestro/subfamilia/${id}`);
	const data = await response.data.body;
	data.nombre = data.nombre.split(data.familiaTela.descripcion + ' ')[1];

	return data;
});

export const updateSubFamilia = createAsyncThunk(
	'maestro/subFamilia/putSubFamilia',
	async (subfamilia, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`maestro/subfamilia/${subfamilia.id}`, subfamilia);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteSubFamilia = createAsyncThunk(
	'maestro/subFamilia/deleteSubFamilia',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().maestros.subfamilia;
			const response = await httpClient.delete(`maestro/subfamilia/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const SubFamiliaSlice = createSlice({
	name: 'maestros/subFamilia',
	initialState: null,
	reducers: {
		resetSubFamilia: () => null,
		newSubFamilia: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					nombre: '',
					familiaTelaId: 0,
				},
			}),
		},
	},
	extraReducers: {
		[getSubFamiliaId.fulfilled]: (state, action) => action.payload,
		[createSubFamilia.fulfilled]: (state, action) => action.payload,
		[updateSubFamilia.fulfilled]: (state, action) => action.payload,
		[deleteSubFamilia.fulfilled]: (state, action) => null,
	},
});

export const { resetSubFamilia, newSubFamilia } = SubFamiliaSlice.actions;
export default SubFamiliaSlice.reducer;

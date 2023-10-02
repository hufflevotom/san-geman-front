import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createTalla = createAsyncThunk(
	'maestro/talla/postTalla',
	async (talla, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('maestro/tallas', talla);
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

export const getTallaId = createAsyncThunk('maestro/talla/getTallaId', async id => {
	const response = await httpClient.get(`maestro/tallas/${id}`);
	const data = await response.data.body;
	return data;
});

export const updateTalla = createAsyncThunk(
	'maestro/talla/putTalla',
	async (talla, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`maestro/tallas/${talla.id}`, talla);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteTalla = createAsyncThunk(
	'maestro/talla/deleteTalla',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().maestros.talla;
			const response = await httpClient.delete(`maestro/tallas/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const TallaSlice = createSlice({
	name: 'maestros/talla',
	initialState: null,
	reducers: {
		resetTalla: () => null,
		newTalla: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					talla: '',
				},
			}),
		},
	},
	extraReducers: {
		[getTallaId.fulfilled]: (state, action) => action.payload,
		[createTalla.fulfilled]: (state, action) => action.payload,
		[updateTalla.fulfilled]: (state, action) => action.payload,
		[deleteTalla.fulfilled]: (state, action) => null,
	},
});

export const { newTalla, resetTalla } = TallaSlice.actions;
export default TallaSlice.reducer;

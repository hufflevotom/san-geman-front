import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createMuestraTelaLibre = createAsyncThunk(
	'comercial/muestraTelaLibre/postMuestraTelaLibre',
	async (muestraTelaLibre, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('comercial/muestras-telas-libres', muestraTelaLibre);
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

export const getMuestraTelaLibreId = createAsyncThunk(
	'comercial/muestraTelaLibre/getMuestraLibreId',
	async id => {
		const response = await httpClient.get(`comercial/muestras-telas-libres/${id}`);
		const data = await response.data.body;

		return data;
	}
);

export const updateMuestraTelaLibre = createAsyncThunk(
	'comercial/muestraTelaLibre/putMuestraLibre',
	async (muestraTelaLibre, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(
				`comercial/muestras-telas-libres/${muestraTelaLibre.id}`,
				muestraTelaLibre
			);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteMuestraTelaLibre = createAsyncThunk(
	'comercial/muestraTelaLibre/deleteMuestraLibre',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().comercial.muestraTelaLibre;
			const response = await httpClient.delete(`comercial/muestras-telas-libres/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const MuestraTelaLibreSlice = createSlice({
	name: 'comercial/muestraTelaLibre',
	initialState: null,
	reducers: {
		resetMuestraTelaLibre: () => null,
		newMuestraTelaLibre: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					codigo: '',
					fechaDespacho: '',
					clienteId: null,
					dataEstilos: [],
				},
			}),
		},
	},
	extraReducers: {
		[getMuestraTelaLibreId.fulfilled]: (state, action) => action.payload,
		[createMuestraTelaLibre.fulfilled]: (state, action) => action.payload,
		[updateMuestraTelaLibre.fulfilled]: (state, action) => action.payload,
		[deleteMuestraTelaLibre.fulfilled]: (state, action) => null,
	},
});

export const { newMuestraTelaLibre, resetMuestraTelaLibre } = MuestraTelaLibreSlice.actions;
export default MuestraTelaLibreSlice.reducer;

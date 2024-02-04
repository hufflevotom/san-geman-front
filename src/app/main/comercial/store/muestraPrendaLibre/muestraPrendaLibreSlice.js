import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createMuestraPrendaLibre = createAsyncThunk(
	'comercial/muestraPrendaLibre/postMuestraPrendaLibre',
	async (muestraPrendaLibre, { rejectWithValue }) => {
		try {
			const response = await httpClient.post(
				'comercial/muestras-prendas-libres',
				muestraPrendaLibre
			);
			const data = await response.data;

			const { imagenes } = muestraPrendaLibre;

			if (imagenes.length > 0) {
				// eslint-disable-next-line no-restricted-syntax
				for (const f of imagenes) {
					if (f.file) {
						const formData = new FormData();
						formData.append('imagen', f.file);

						// eslint-disable-next-line no-await-in-loop
						await httpClient.put(
							`comercial/muestras-prendas-libres/imagen/${data.body.id}`,
							formData,
							{
								'Content-Type': 'multipart/form-data',
							}
						);
					}
				}
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

export const getMuestraPrendaLibreId = createAsyncThunk(
	'comercial/muestraPrendaLibre/getMuestraPrendaLibreId',
	async id => {
		const response = await httpClient.get(`comercial/muestras-prendas-libres/${id}`);
		const data = await response.data.body;

		return data;
	}
);

export const updateMuestraPrendaLibre = createAsyncThunk(
	'comercial/muestraPrendaLibre/putMuestraPrendaLibre',
	async (muestraPrendaLibre, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(
				`comercial/muestras-prendas-libres/${muestraPrendaLibre.id}`,
				muestraPrendaLibre
			);

			const { imagenes } = muestraPrendaLibre;

			if (imagenes.length > 0) {
				// eslint-disable-next-line no-restricted-syntax
				for (const f of imagenes) {
					if (f.file) {
						const formData = new FormData();
						formData.append('imagen', f.file);

						// eslint-disable-next-line no-await-in-loop
						await httpClient.put(
							`comercial/muestras-prendas-libres/imagen/${muestraPrendaLibre.id}`,
							formData,
							{
								'Content-Type': 'multipart/form-data',
							}
						);
					}
				}
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

export const deleteMuestraPrendaLibre = createAsyncThunk(
	'comercial/muestraPrendaLibre/deleteMuestraPrendaLibre',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().comercial.muestraPrendaLibre;
			const response = await httpClient.delete(`comercial/muestras-prendas-libres/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const MuestraPrendaLibreSlice = createSlice({
	name: 'comercial/muestraPrendaLibre',
	initialState: null,
	reducers: {
		resetMuestraPrendaLibre: () => null,
		newMuestraPrendaLibre: {
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
		[getMuestraPrendaLibreId.fulfilled]: (state, action) => action.payload,
		[createMuestraPrendaLibre.fulfilled]: (state, action) => action.payload,
		[updateMuestraPrendaLibre.fulfilled]: (state, action) => action.payload,
		[deleteMuestraPrendaLibre.fulfilled]: (state, action) => null,
	},
});

export const { newMuestraPrendaLibre, resetMuestraPrendaLibre } = MuestraPrendaLibreSlice.actions;
export default MuestraPrendaLibreSlice.reducer;

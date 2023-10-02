import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createAvio = createAsyncThunk(
	'maestro/avio/postAvio',
	async (obj, { rejectWithValue }) => {
		try {
			const { data, img, img2 } = obj;

			const response = await httpClient.post('maestro/avios', data);
			const dataBody = await response.data.body;

			if (img) {
				const formData = new FormData();
				formData.append('imagen', img);
				await httpClient.put(`maestro/avios/imagen/${dataBody.id}`, formData, {
					'Content-Type': 'multipart/form-data',
				});
			}

			if (img2) {
				const formData2 = new FormData();
				formData2.append('imagen', img2);
				await httpClient.put(`maestro/avios/imagenSec/${dataBody.id}`, formData2, {
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

export const getAvioId = createAsyncThunk('maestro/avio/getAvioId', async id => {
	const response = await httpClient.get(`maestro/avios/${id}`);
	const data = await response.data.body;
	return data;
});

export const updateAvio = createAsyncThunk(
	'maestro/avio/putAvio',
	async (obj, { rejectWithValue }) => {
		try {
			const { data, img, img2 } = obj;

			const response = await httpClient.put(`maestro/avios/${data.id}`, data);
			const dataBody = await response.data.body;

			if (img) {
				const formData = new FormData();
				formData.append('imagen', img);
				await httpClient.put(`maestro/avios/imagen/${dataBody.id}`, formData, {
					'Content-Type': 'multipart/form-data',
				});
			}

			if (img2) {
				const formData2 = new FormData();
				formData2.append('imagen', img2);
				await httpClient.put(`maestro/avios/imagenSec/${dataBody.id}`, formData2, {
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

export const deleteAvio = createAsyncThunk(
	'maestro/avio/deleteAvio',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().maestros.avio;
			const response = await httpClient.delete(`maestro/avios/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const AvioSlice = createSlice({
	name: 'maestros/avio',
	initialState: null,
	reducers: {
		resetAvio: () => null,
		newAvio: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					nombre: '',
					codigo: '',
					familiaId: 0,
					tipo: '',
					hilos: false,
					unidadId: 0,
					tallasId: [],
				},
			}),
		},
	},
	extraReducers: {
		[getAvioId.fulfilled]: (state, action) => action.payload,
		[createAvio.fulfilled]: (state, action) => action.payload,
		[updateAvio.fulfilled]: (state, action) => action.payload,
		[deleteAvio.fulfilled]: (state, action) => null,
	},
});

export const { newAvio, resetAvio } = AvioSlice.actions;
export default AvioSlice.reducer;

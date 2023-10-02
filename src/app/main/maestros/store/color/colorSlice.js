import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createColor = createAsyncThunk(
	'maestro/color/postColor',
	async (obj, { rejectWithValue }) => {
		try {
			const { data, img, img2 } = obj;
			const response = await httpClient.post('maestro/color', data);

			const alternativaId = await response.data.body.alternativas[0].id;

			if (img && img.file) {
				const formData = new FormData();
				formData.append('imagen', img.file);
				await httpClient.put(`maestro/color/imagen/${alternativaId}`, formData, {
					'Content-Type': 'multipart/form-data',
				});
			}
			if (img2 && img2.file) {
				const formData = new FormData();
				formData.append('imagen2', img2.file);
				await httpClient.put(`maestro/color/imagen2/${alternativaId}`, formData, {
					'Content-Type': 'multipart/form-data',
				});
			}

			return response.data;
		} catch (error) {
			// console.log('error.response', error);
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const getColorId = createAsyncThunk('maestro/color/getColorId', async id => {
	const response = await httpClient.get(`maestro/color/${id}`);

	const data = await response.data.body;
	if (data.proveedor) {
		data.proveedorId = data.proveedor.id;
	}
	data.imagenUrl = data.alternativas[0].imagenUrl;
	data.imagenUrlSec = data.alternativas[0].imagenUrl2;
	return data;
});

export const updateColor = createAsyncThunk(
	'maestro/color/putColor',
	async (obj, { rejectWithValue }) => {
		try {
			// const validar = obj.data.alternativas.filter(element => {
			// 	if (element.nombre !== '') {
			// 		return element;
			// 	}
			// 	return '';
			// });

			// obj.data.alternativas = validar;
			const { data, img, img2 } = obj;

			const response = await httpClient.put(`maestro/color/${data.id}`, data);

			const alternativaId = await response.data.body.alternativas[0].id;

			if (img && img.file !== undefined) {
				const formData = new FormData();
				formData.append('imagen', img.file);
				await httpClient.put(`maestro/color/imagen/${alternativaId}`, formData, {
					'Content-Type': 'multipart/form-data',
				});
			} else if (img === null) {
				await httpClient.put(`maestro/color/eliminarImagen1/${alternativaId}`);
			}
			if (img2 && img2.file !== undefined) {
				const formData = new FormData();
				formData.append('imagen2', img2.file);
				await httpClient.put(`maestro/color/imagen2/${alternativaId}`, formData, {
					'Content-Type': 'multipart/form-data',
				});
			} else if (img2 === null) {
				await httpClient.put(`maestro/color/eliminarImagen2/${alternativaId}`);
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

export const deleteColor = createAsyncThunk(
	'maestro/color/deleteColor',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().maestros.color;
			const response = await httpClient.delete(`maestro/color/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const ColorSlice = createSlice({
	name: 'maestros/color',
	initialState: null,
	reducers: {
		resetColor: () => null,
		newColor: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					codigo: '',
					descripcion: '',
					gama: '',
					pantone: '',
					proveedor: null,
					alternativas: [],
				},
			}),
		},
	},
	extraReducers: {
		[getColorId.fulfilled]: (state, action) => action.payload,
		[createColor.fulfilled]: (state, action) => action.payload,
		[updateColor.fulfilled]: (state, action) => action.payload,
		[deleteColor.fulfilled]: (state, action) => null,
	},
});

export const { newColor, resetColor } = ColorSlice.actions;
export default ColorSlice.reducer;

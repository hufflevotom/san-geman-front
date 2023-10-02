import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { log } from 'util';
import httpClient from 'utils/Api';

export const createTitulacion = createAsyncThunk(
	'maestro/titulacion/postTitulacion',
	async (titulacion, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('maestro/titulacion', titulacion);
			const data = await response.data;
			console.log('respuesta guardado', data);
			if (titulacion.fichaTecnicaUrl) {
				const formData = new FormData();
				formData.append('fichaTecnica', titulacion.fichaTecnicaUrl.file);
				await httpClient.put(`maestro/titulacion/archivos/${data.body.id}`, formData);
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

export const getTitulacionId = createAsyncThunk('maestro/titulacion/getTitulacionId', async id => {
	const response = await httpClient.get(`maestro/titulacion/${id}`);

	const data = await response.data.body;
	// Agregar ID y nombre de alternativas
	/* const alternativas = alternativasParseadas.map(alternativa => ({
		...alternativa,
		id:  
		nombre: alternativa,
	}));
 */
	// data.alternativas = alternativasParseadas;

	// data.proveedorId = data.proveedor.id;
	return data;
});

export const updateTitulacion = createAsyncThunk(
	'maestro/titulacion/putTitulacion',
	async (titulacion, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`maestro/titulacion/${titulacion.id}`, titulacion);

			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteTitulacion = createAsyncThunk(
	'maestro/titulacion/deleteTitulacion',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().maestros.titulacion;
			const response = await httpClient.delete(`maestro/titulacion/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const TitulacionSlice = createSlice({
	name: 'maestros/titulacion',
	initialState: null,
	reducers: {
		resetTitulacion: () => null,
		newtitulacion: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					nombre: '',
				},
			}),
		},
	},
	extraReducers: {
		[getTitulacionId.fulfilled]: (state, action) => action.payload,
		[createTitulacion.fulfilled]: (state, action) => action.payload,
		[updateTitulacion.fulfilled]: (state, action) => action.payload,
		[deleteTitulacion.fulfilled]: (state, action) => null,
	},
});

export const { newtitulacion, resetTitulacion } = TitulacionSlice.actions;
export default TitulacionSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { log } from 'util';
import httpClient from 'utils/Api';

export const createTela = createAsyncThunk(
	'maestro/tela/postTela',
	async (tela, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('maestro/tela', tela);
			const data = await response.data;
			console.log('respuesta guardado', data);
			if (tela.fichaTecnicaUrl) {
				const formData = new FormData();
				formData.append('fichaTecnica', tela.fichaTecnicaUrl.file);
				await httpClient.put(`maestro/tela/archivos/${data.body.id}`, formData);
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

export const getTelaId = createAsyncThunk('maestro/tela/getTelaId', async id => {
	const response = await httpClient.get(`maestro/tela/${id}`);

	const data = await response.data.body;
	// const alternativasParseadas = JSON.parse(data.alternativas);
	data.titulacionJson =
		data.titulacionJson === '' ? data.titulacionJson : JSON.parse(data.titulacionJson);
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

export const updateTela = createAsyncThunk(
	'maestro/tela/putTela',
	async (tela, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`maestro/tela/${tela.id}`, tela);

			if (tela.fichaTecnicaUrl && tela.fichaTecnicaUrl.file) {
				const formData = new FormData();
				formData.append('fichaTecnica', tela.fichaTecnicaUrl.file);

				await httpClient.put(`maestro/tela/archivos/${response.data.body.id}`, formData);
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

export const deleteTela = createAsyncThunk(
	'maestro/tela/deleteTela',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().maestros.tela;
			const response = await httpClient.delete(`maestro/tela/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const TelaSlice = createSlice({
	name: 'maestros/tela',
	initialState: null,
	reducers: {
		resetTela: () => null,
		newtela: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					codigo: '',
					nombre: '',
					descripcionComercial: '',
					tipoTela: '',
					alternativas: [],
					densidad: 0,
					ancho: 0,
					acabado: '',
					subFamilia: '',
					titulacionJson: '',
					familiaId: 0,
					unidadId: 0,
					tipoListado: '',
					fichaTecnicaUrl: '',
					encogimientoLargo: 0,
					encogimientoAncho: 0,
					revirado: 0,
					codReferencia: '',
					estado: 'desarrollo',
				},
			}),
		},
	},
	extraReducers: {
		[getTelaId.fulfilled]: (state, action) => action.payload,
		[createTela.fulfilled]: (state, action) => action.payload,
		[updateTela.fulfilled]: (state, action) => action.payload,
		[deleteTela.fulfilled]: (state, action) => null,
	},
});

export const { newtela, resetTela } = TelaSlice.actions;
export default TelaSlice.reducer;

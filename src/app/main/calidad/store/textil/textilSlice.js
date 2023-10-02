import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createTextil = createAsyncThunk(
	'calidad/textil/postTextil',
	async (textil, { rejectWithValue }) => {
		try {
			const response = await httpClient.post('calidad-textil', textil);
			const data = await response.data;
			if (textil.documentoReferenciaUrl) {
				const formData = new FormData();
				formData.append('documento', textil.documentoReferenciaUrl.file);
				await httpClient.put(`calidad-textil/documento/${data.body.id}`, formData);
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

export const getTextilId = createAsyncThunk(
	'calidad/textil/getTextilId',
	async ({ id, codigo }) => {
		console.log('getTextilId', id, codigo);
		const response = await httpClient.get(`producto-tela/${id}?codigo=${codigo}`);
		let data = {};
		if (response.data.body?.calidadTextil) {
			data = response.data.body?.calidadTextil;
		}
		data.productoTelaId = response.data.body.id;
		data.anchoTela = response.data.body.tela.ancho;
		data.densidadTela = response.data.body.tela.densidad;
		data.encogimientoEstandarLargo = response.data.body.tela.encogimientoLargo;
		data.encogimientoEstandarAncho = response.data.body.tela.encogimientoAncho;
		data.reviradoEstandar = response.data.body.tela.revirado;
		return data;
	}
);

export const updateTextil = createAsyncThunk(
	'calidad/textil/putTextil',
	async (textil, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`calidad-textil/${textil.id}`, textil);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteTextil = createAsyncThunk(
	'calidad/textil/deleteTextil',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().calidad.textil;
			const response = await httpClient.delete(`calidad/textiles/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const TextilSlice = createSlice({
	name: 'calidad/textil',
	initialState: null,
	reducers: {
		resetTextil: () => null,
		newTextil: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					densidadAntesLavadoEstandar: 0,
					denstidadDespuesLavadoEstandar: 0,
					anchoDelRolloEstandar: 0,
					densidadAntesLavadoReal: 0,
					denstidadDespuesLavadoReal: 0,
					anchoDelRolloReal: 0,
					anchoDeReposoReal: 0,
					encogimientoEstandarLargo: 0,
					encogimientoEstandarAncho: 0,
					encogimiento1largo: 0,
					encogimiento1ancho: 0,
					encogimiento2largo: 0,
					encogimiento2ancho: 0,
					encogimiento3largo: 0,
					encogimiento3ancho: 0,
					reviradoEstandar: 0,
					reviradoDerecho: 0,
					reviradoIzquierdo: 0,
					inclinacionEstandar: 0,
					inclinacionAntesDerecho: 0,
					inclinacionAntesIzquierdo: 0,
					inclinacionDespuesDerecho: 0,
					inclinacionDespuesIzquierdo: 0,
					solidez: 0,
					apariencia: '',
					productoTelaId: 0,
					reviradoPromedio: 0,
					inclinacionAntesPromedio: 0,
					inclinacionDespuesPromedio: 0,
				},
			}),
		},
	},
	extraReducers: {
		[getTextilId.fulfilled]: (state, action) => action.payload,
		[createTextil.fulfilled]: (state, action) => action.payload,
		[updateTextil.fulfilled]: (state, action) => action.payload,
		[deleteTextil.fulfilled]: (state, action) => null,
	},
});

export const { resetTextil, newTextil } = TextilSlice.actions;
export default TextilSlice.reducer;

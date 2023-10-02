import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getProducciones = createAsyncThunk(
	'comercial/producciones/getProducciones',
	async abc => {
		let url = `comercial/producciones?limit=${abc.limit}&offset=${abc.offset}`;

		if (abc.busqueda) {
			url += `&busqueda=${abc.busqueda}`;
		}

		const response = await httpClient.get(url);
		const data = await response.data.body;
		return { data, tipo: abc.tipoBusqueda };
	}
);

export const estadoProduccion = createAsyncThunk(
	'comercial/producciones/estadoProduccion',
	async (data, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`comercial/producciones/visible/${data.id}`);
			return response.data.body;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const removeProducciones = createAsyncThunk(
	'comercial/producciones/removeProducciones',
	async (target, { dispatch, getState }) => {
		const texto = getState().comercial.producciones.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`comercial/producciones/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`comercial/producciones?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Producción eliminada' };
	}
);

export const produccionesAdapter = createEntityAdapter({ selectId: produccion => produccion.id });

export const { selectAll: selectProducciones, selectById: selectProduccionesById } =
	produccionesAdapter.getSelectors(state => state.comercial.producciones);

const ProduccionesSlice = createSlice({
	name: 'comercial/producciones',
	initialState: produccionesAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setProduccionesSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteProduccionArray: (state, action) => {
			produccionesAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getProducciones.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				produccionesAdapter.setAll(state, action.payload.data[0]);
			} else {
				produccionesAdapter.addMany(state, action.payload.data[0]);
			}

			const data = produccionesAdapter.getSelectors().selectAll(state);
			console.log(data);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						produccionesAdapter.updateOne(state, {
							id: newElement.id,
							changes: newElement,
						});
					}
				});
			});

			produccionesAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeProducciones.fulfilled]: (state, action) => {
			produccionesAdapter.removeMany(state, action.payload.ids);
			produccionesAdapter.addMany(
				state,
				action.payload.data[0].filter(
					element => action.payload.ids.findIndex(e => e === element.id) === -1
				)
			);

			const data = produccionesAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						produccionesAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});
			const total = action.payload.data[1];
			state.total = total;
		},
		[estadoProduccion.fulfilled]: (state, action) => {
			produccionesAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
		},
	},
});

export const { setProduccionesSearchText, deleteProduccionArray } = ProduccionesSlice.actions;
export default ProduccionesSlice.reducer;

import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getRutas = createAsyncThunk('comercial/rutas/getRutas', async abc => {
	let url = `comercial/rutas?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;
	return { data, tipo: abc.tipoBusqueda };
});

export const removeRutas = createAsyncThunk(
	'comercial/rutas/removeRutas',
	async (target, { dispatch, getState }) => {
		const texto = getState().comercial.rutas.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`comercial/rutas/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`comercial/rutas?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Ruta eliminada' };
	}
);

export const rutasAdapter = createEntityAdapter({ selectId: ruta => ruta.id });

export const { selectAll: selectRutas, selectById: selectRutasById } = rutasAdapter.getSelectors(
	state => state.comercial.rutas
);

const RutasSlice = createSlice({
	name: 'comercial/rutas',
	initialState: rutasAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setRutasSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteRutaArray: (state, action) => {
			rutasAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getRutas.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				rutasAdapter.setAll(state, action.payload.data[0]);
			} else {
				rutasAdapter.addMany(state, action.payload.data[0]);
			}

			const data = rutasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						rutasAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			rutasAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeRutas.fulfilled]: (state, action) => {
			rutasAdapter.removeMany(state, action.payload.ids);
			rutasAdapter.addMany(state, action.payload.data[0]);

			const data = rutasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						rutasAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});
			const total = action.payload.data[1];
			state.total = total;
		},
	},
});

export const { setRutasSearchText, deleteRutaArray } = RutasSlice.actions;
export default RutasSlice.reducer;

import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getFamliasPrenda = createAsyncThunk(
	'maestro/familia-prendas/getPrendas',
	async abc => {
		let url = `maestro/familia-prenda?limit=${abc.limit}&offset=${abc.offset}`;

		if (abc.busqueda) {
			url += `&busqueda=${abc.busqueda}`;
		}

		const response = await httpClient.get(url);
		const data = await response.data.body;
		return { data, tipo: abc.tipoBusqueda };
	}
);

export const removeFamliasPrendas = createAsyncThunk(
	'maestro/familia-prendas/removePrendas',
	async (target, { dispatch, getState }) => {
		const texto = getState().maestros.familiasPrenda.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`maestro/familia-prenda/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`maestro/familia-prenda?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Familia eliminada' };
	}
);

export const familiasPrendaAdapter = createEntityAdapter({ selectId: prenda => prenda.id });

export const { selectAll: selectFamiliasPrendas, selectById: selectFamiliasPrendasById } =
	familiasPrendaAdapter.getSelectors(state => state.maestros.familiasPrenda);

const FamliasPrendaSlice = createSlice({
	name: 'maestros/familia-prendas',
	initialState: familiasPrendaAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setFamiliasPrendasSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteFamiliaPrendaArray: (state, action) => {
			familiasPrendaAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getFamliasPrenda.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				familiasPrendaAdapter.setAll(state, action.payload.data[0]);
			} else {
				familiasPrendaAdapter.addMany(state, action.payload.data[0]);
			}

			const data = familiasPrendaAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						familiasPrendaAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			familiasPrendaAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeFamliasPrendas.fulfilled]: (state, action) => {
			familiasPrendaAdapter.removeMany(state, action.payload.ids);
			familiasPrendaAdapter.addMany(state, action.payload.data[0]);

			const data = familiasPrendaAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						familiasPrendaAdapter.updateOne(state, {
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

export const { setFamiliasPrendasSearchText, deleteFamiliaPrendaArray } =
	FamliasPrendaSlice.actions;
export default FamliasPrendaSlice.reducer;

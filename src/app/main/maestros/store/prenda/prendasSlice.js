import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getPrendas = createAsyncThunk('maestros/prendas/getPrendas', async abc => {
	let url = `maestro/prenda?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}
	const response = await httpClient.get(url);
	const data = await response.data.body;
	return { data, tipo: abc.tipoBusqueda };
});

export const removePrendas = createAsyncThunk(
	'maestros/prendas/removePrendas',
	async (target, { dispatch, getState }) => {
		const texto = getState().maestros.prendas.searchText;

		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`maestro/prenda/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`maestro/prenda?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Prenda eliminada' };
	}
);

export const prendasAdapter = createEntityAdapter({ selectId: prenda => prenda.id });

export const { selectAll: selectPrendas, selectById: selectPrendasById } =
	prendasAdapter.getSelectors(state => state.maestros.prendas);

const PrendasSlice = createSlice({
	name: 'maestros/prendas',
	initialState: prendasAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setPrendasSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deletePrendasArray: (state, action) => {
			prendasAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getPrendas.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				prendasAdapter.setAll(state, action.payload.data[0]);
			} else {
				prendasAdapter.addMany(state, action.payload.data[0]);
			}

			const data = prendasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						prendasAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			prendasAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removePrendas.fulfilled]: (state, action) => {
			prendasAdapter.removeMany(state, action.payload.ids);
			prendasAdapter.addMany(state, action.payload.data[0]);

			const data = prendasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						prendasAdapter.updateOne(state, {
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

export const { setPrendasSearchText, deletePrendasArray } = PrendasSlice.actions;
export default PrendasSlice.reducer;

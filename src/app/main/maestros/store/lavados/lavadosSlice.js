import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getLavados = createAsyncThunk('maestros/lavados/getLavados', async abc => {
	let url = `maestro/lavados?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;
	return { data, tipo: abc.tipoBusqueda };
});

export const removeLavados = createAsyncThunk(
	'maestros/lavados/removeLavados',
	async (target, { dispatch, getState }) => {
		const texto = getState().maestros.lavados.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`maestro/lavados/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`maestro/lavados?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Lavado eliminada' };
	}
);

export const lavadosAdapter = createEntityAdapter({ selectId: lavados => lavados.id });

export const { selectAll: selectLavados, selectById: selectLavadosById } =
	lavadosAdapter.getSelectors(state => state.maestros.lavados);

const LavadosSlice = createSlice({
	name: 'maestros/lavados',
	initialState: lavadosAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setLavadosSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteLavadosArray: (state, action) => {
			lavadosAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getLavados.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				lavadosAdapter.setAll(state, action.payload.data[0]);
			} else {
				lavadosAdapter.addMany(state, action.payload.data[0]);
			}

			const data = lavadosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						lavadosAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			lavadosAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeLavados.fulfilled]: (state, action) => {
			lavadosAdapter.removeMany(state, action.payload.ids);
			lavadosAdapter.addMany(state, action.payload.data[0]);

			const data = lavadosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						lavadosAdapter.updateOne(state, {
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

export const { setLavadosSearchText, deleteLavadosArray } = LavadosSlice.actions;
export default LavadosSlice.reducer;

import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getColores = createAsyncThunk('maestros/colores/getColores', async abc => {
	let url = `maestro/color?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}
	const response = await httpClient.get(url);
	const data = await response.data.body;
	return { data, tipo: abc.tipoBusqueda };
});

export const getColoresTemporales = createAsyncThunk(
	'maestros/colores/getColoresTemporales',
	async abc => {
		let url = `maestro/color/borradores?limit=${abc.limit}&offset=${abc.offset}`;

		if (abc.busqueda) {
			url += `&busqueda=${abc.busqueda}`;
		}
		const response = await httpClient.get(url);
		const data = await response.data.body;
		return { data, tipo: abc.tipoBusqueda };
	}
);

export const removeColores = createAsyncThunk(
	'maestros/colores/removeColores',
	async (target, { dispatch, getState }) => {
		const texto = getState().maestros.colores.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`maestro/color/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`maestro/color?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Color eliminado' };
	}
);

export const coloresAdapter = createEntityAdapter({ selectId: color => color.id });

export const { selectAll: selectColores, selectById: selectColoresById } =
	coloresAdapter.getSelectors(state => state.maestros.colores);

const ColorsSlice = createSlice({
	name: 'maestros/colores',
	initialState: coloresAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		resetTabla: () =>
			coloresAdapter.getInitialState({
				total: 0,
				searchText: '',
				maxPage: 0,
			}),
		setColoresSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteColoresArray: (state, action) => {
			coloresAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getColores.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				coloresAdapter.setAll(state, action.payload.data[0]);
			} else {
				coloresAdapter.addMany(state, action.payload.data[0]);
			}

			const data = coloresAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						coloresAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			coloresAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[getColoresTemporales.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				coloresAdapter.setAll(state, action.payload.data[0]);
			} else {
				coloresAdapter.addMany(state, action.payload.data[0]);
			}

			const data = coloresAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						coloresAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			coloresAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeColores.fulfilled]: (state, action) => {
			coloresAdapter.removeMany(state, action.payload.ids);
			coloresAdapter.addMany(state, action.payload.data[0]);

			const data = coloresAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						coloresAdapter.updateOne(state, {
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

export const { setColoresSearchText, deleteColoresArray, resetTabla } = ColorsSlice.actions;
export default ColorsSlice.reducer;

import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import httpClient from 'utils/Api';

export const getUnidades = createAsyncThunk('configuraciones/unidades/getUnidades', async abc => {
	let url = `configuraciones/unidad-media?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;
	return { data, tipo: abc.tipoBusqueda };
});

export const removeUnidades = createAsyncThunk(
	'configuraciones/unidades/removeUnidades',
	async (target, { dispatch, getState }) => {
		const texto = getState().configuraciones.unidades.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`configuraciones/unidad-media/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`configuraciones/unidad-media?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Unidad eliminada' };
	}
);

export const unidadesAdapter = createEntityAdapter({ selectId: unidad => unidad.id });

export const { selectAll: selectUnidades, selectById: selectUnidadesById } =
	unidadesAdapter.getSelectors(state => state.configuraciones.unidades);

const UnidadesSlice = createSlice({
	name: 'configuraciones/unidades',
	initialState: unidadesAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setUnidadesSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteUnidadesArray: (state, action) => {
			unidadesAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getUnidades.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				unidadesAdapter.setAll(state, action.payload.data[0]);
			} else {
				unidadesAdapter.addMany(state, action.payload.data[0]);
			}

			const data = unidadesAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						unidadesAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			unidadesAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},

		[removeUnidades.fulfilled]: (state, action) => {
			unidadesAdapter.removeMany(state, action.payload.ids);
			unidadesAdapter.addMany(state, action.payload.data[0]);

			const data = unidadesAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						unidadesAdapter.updateOne(state, {
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

export const { setUnidadesSearchText, deleteUnidadesArray } = UnidadesSlice.actions;
export default UnidadesSlice.reducer;

/* eslint-disable no-restricted-syntax */
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getOrdenesCorte = createAsyncThunk(
	'consumos/orden-corte/getOrdenesCorte',
	async abc => {
		let url = `orden-corte-panios?limit=${abc.limit}&offset=${abc.offset}`;

		if (abc.busqueda) {
			url += `&busqueda=${abc.busqueda}`;
		}

		const res = await httpClient.get(url);
		const data = res.data.body;
		const array = [];
		for (const [key, value] of Object.entries(data[0])) {
			array.push({
				key,
				id: value.length === 1 ? value[0].id : key,
				codigo: key,
				ordenesCorte: value,
			});
		}
		// const response = [array, data[1]];
		data[0] = array;

		// ordenar array por codigo
		data[0].sort((a, b) => {
			if (parseInt(a.codigo, 10) < parseInt(b.codigo, 10)) {
				return 1;
			}
			if (parseInt(a.codigo, 10) > parseInt(b.codigo, 10)) {
				return -1;
			}

			return 0;
		});

		return { data, tipo: abc.tipoBusqueda };
	}
);

export const removeOrdenesCorte = createAsyncThunk(
	'consumos/orden-corte/removeOrdenesCorte',
	async (target, { dispatch, getState }) => {
		const texto = getState().consumos.ordenesCorte.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`consumos/orden-corte-panios/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`consumos/orden-corte-panios?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Orden de corte eliminado' };
	}
);

export const ordenesCorteAdapter = createEntityAdapter({
	selectId: ordenesCorte => ordenesCorte.id,
});

export const { selectAll: selectOrdenesCorte, selectById: selectOrdenesCorteById } =
	ordenesCorteAdapter.getSelectors(state => state.consumos.ordenesCorte);

const OrdenesCorteSlice = createSlice({
	name: 'consumos/orden-corte',
	initialState: ordenesCorteAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setOrdenesCorteSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteOrdenesCorteArray: (state, action) => {
			ordenesCorteAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getOrdenesCorte.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				ordenesCorteAdapter.setAll(state, action.payload.data[0]);
			} else {
				ordenesCorteAdapter.addMany(state, action.payload.data[0]);
			}

			const data = ordenesCorteAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						ordenesCorteAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			ordenesCorteAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeOrdenesCorte.fulfilled]: (state, action) => {
			ordenesCorteAdapter.removeMany(state, action.payload.ids);
			ordenesCorteAdapter.addMany(state, action.payload.data[0]);

			const data = ordenesCorteAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						ordenesCorteAdapter.updateOne(state, {
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

export const { setOrdenesCorteSearchText, deleteOrdenesCorteArray } = OrdenesCorteSlice.actions;
export default OrdenesCorteSlice.reducer;

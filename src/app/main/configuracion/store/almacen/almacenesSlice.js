import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import httpClient from 'utils/Api';

export const getAlmacenes = createAsyncThunk(
	'configuraciones/almacenes/getAlmacenes',
	async abc => {
		let url = `configuraciones/almacenes?limit=${abc.limit}&offset=${abc.offset}`;

		if (abc.busqueda) {
			url += `&busqueda=${abc.busqueda}`;
		}

		const response = await httpClient.get(url);
		const data = await response.data.body;
		return { data, tipo: abc.tipoBusqueda };
	}
);

export const removeAlmacenes = createAsyncThunk(
	'configuraciones/almacenes/removeAlmacenes',
	async (target, { dispatch, getState }) => {
		const texto = getState().configuraciones.almacenes.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`configuraciones/almacenes/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`configuraciones/almacenes?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Almacén eliminado' };
	}
);

export const almacenesAdapter = createEntityAdapter({ selectId: almacen => almacen.id });

export const { selectAll: selectAlmacenes, selectById: selectAlmacenesById } =
	almacenesAdapter.getSelectors(state => state.configuraciones.almacenes);

const AlmacenesSlice = createSlice({
	name: 'configuraciones/almacenes',
	initialState: almacenesAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setAlmacenesSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteAlmacenesArray: (state, action) => {
			almacenesAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getAlmacenes.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				almacenesAdapter.setAll(state, action.payload.data[0]);
			} else {
				almacenesAdapter.addMany(state, action.payload.data[0]);
			}

			const data = almacenesAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						almacenesAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			almacenesAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},

		[removeAlmacenes.fulfilled]: (state, action) => {
			almacenesAdapter.removeMany(state, action.payload.ids);
			almacenesAdapter.addMany(state, action.payload.data[0]);

			const data = almacenesAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						almacenesAdapter.updateOne(state, {
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

export const { setAlmacenesSearchText, deleteAlmacenesArray } = AlmacenesSlice.actions;
export default AlmacenesSlice.reducer;

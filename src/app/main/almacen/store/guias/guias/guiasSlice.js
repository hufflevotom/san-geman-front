import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getGuias = createAsyncThunk('almacen/guias/getGuias', async abc => {
	let url = `almacen-tela/guia?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;
	return { data, tipo: abc.tipoBusqueda };
});

export const removeGuia = createAsyncThunk(
	'almacen/guias/removeGuias',
	async (target, { dispatch, getState }) => {
		const texto = getState().almacen.guias.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`almacen/guias/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`almacen/guias?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Fila eliminada' };
	}
);

export const anularGuia = createAsyncThunk(
	'almacen/guias/anularGuia',
	async (target, { dispatch, getState }) => {
		const texto = getState().almacen.guias.searchText;
		const dataBody = await httpClient.put(`almacen/guias/${target.id}`);
		const response = await httpClient.get(
			`almacen/guias?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);

		const data = await response.data.body;
		return { data, id: target.id };
	}
);

export const guiasAdapter = createEntityAdapter({ selectId: guia => guia.id });

export const { selectAll: selectGuias, selectById: selectGuiasById } = guiasAdapter.getSelectors(
	state => state.almacen.guias
);

const GuiasSlice = createSlice({
	name: 'almacen/guias',
	initialState: guiasAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		resetTabla: () =>
			guiasAdapter.getInitialState({
				total: 0,
				searchText: '',
				maxPage: 0,
			}),
		setGuiasSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteGuiasArray: (state, action) => {
			guiasAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getGuias.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				guiasAdapter.setAll(state, action.payload.data[0]);
			} else {
				guiasAdapter.addMany(state, action.payload.data[0]);
			}

			const data = guiasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						guiasAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			guiasAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeGuia.fulfilled]: (state, action) => {
			guiasAdapter.removeMany(state, action.payload.ids);
			guiasAdapter.addMany(
				state,
				action.payload.data[0].filter(
					element => action.payload.ids.findIndex(e => e === element.id) === -1
				)
			);

			const data = guiasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						guiasAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});
			const total = action.payload.data[1];
			state.total = total;
		},

		[anularGuia.fulfilled]: (state, action) => {
			guiasAdapter.removeOne(state, action.payload.id);
			guiasAdapter.addMany(state, action.payload.data[0]);

			const data = guiasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						guiasAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			// ingresosAviosAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
	},
});

export const { resetTabla, setGuiasSearchText, deleteGuiasArray } = GuiasSlice.actions;
export default GuiasSlice.reducer;

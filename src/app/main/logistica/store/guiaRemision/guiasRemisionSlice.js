import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getGuiaRemisiones = createAsyncThunk(
	'logistica/guias-remision/getGuiaRemisiones',
	async model => {
		let url = `comprobantes/guias-remision?limit=${model.limit}&offset=${model.offset}`;

		if (model.busqueda) {
			url += `&busqueda=${model.busqueda}`;
		}

		const response = await httpClient.get(url);
		const data = await response.data.body;

		return { data, tipo: model.tipoBusqueda };
	}
);

export const removeGuiaRemisiones = createAsyncThunk(
	'logistica/guias-remision/removeGuiaRemisiones',
	async (target, { dispatch, getState }) => {
		const texto = getState().logistica.guiasRemision.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`comprobantes/guias-remision/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`comprobantes/guias-remision?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Guia eliminada' };
	}
);

export const guiaRemisionesAdapter = createEntityAdapter({
	selectId: model => model.id,
});

export const { selectAll: selectGuiasRemision, selectById: selectGuiaRemisionById } =
	guiaRemisionesAdapter.getSelectors(state => state.logistica.guiasRemision);

const GuiasRemisionSlice = createSlice({
	name: 'logistica/guias-remision',
	initialState: guiaRemisionesAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setGuiasRemisionSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteGuiasRemisionArray: (state, action) => {
			guiaRemisionesAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getGuiaRemisiones.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				guiaRemisionesAdapter.setAll(state, action.payload.data[0]);
			} else {
				guiaRemisionesAdapter.addMany(state, action.payload.data[0]);
			}

			const data = guiaRemisionesAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						guiaRemisionesAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			guiaRemisionesAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeGuiaRemisiones.fulfilled]: (state, action) => {
			guiaRemisionesAdapter.removeMany(state, action.payload.ids);
			guiaRemisionesAdapter.addMany(state, action.payload.data[0]);

			const data = guiaRemisionesAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						guiaRemisionesAdapter.updateOne(state, {
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

export const { setGuiasRemisionSearchText, deleteGuiasRemisionArray } = GuiasRemisionSlice.actions;
export default GuiasRemisionSlice.reducer;

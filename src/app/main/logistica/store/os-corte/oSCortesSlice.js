import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getOSCortes = createAsyncThunk(
	'logistica/orden-servicio-corte/getOSCortes',
	async abc => {
		let url = `logistica/orden-servicio-corte?limit=${abc.limit}&offset=${abc.offset}`;

		if (abc.busqueda) {
			url += `&busqueda=${abc.busqueda}`;
		}

		const response = await httpClient.get(url);
		const data = await response.data.body;

		return { data, tipo: abc.tipoBusqueda };
	}
);

export const removeOSCortes = createAsyncThunk(
	'logistica/orden-servicio-corte/removeOSCortes',
	async (target, { dispatch, getState }) => {
		const texto = getState().logistica.oSCortes.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`logistica/orden-servicio-corte/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`logistica/orden-servicio-corte?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Orden de corte eliminada' };
	}
);

export const oSCortesAdapter = createEntityAdapter({
	selectId: oSCortes => oSCortes.id,
});

export const { selectAll: selectOSCortes, selectById: selectOSCortesById } =
	oSCortesAdapter.getSelectors(state => state.logistica.oSCortes);

const OSCortesSlice = createSlice({
	name: 'logistica/orden-servicio-corte',
	initialState: oSCortesAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setOSCortesSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteOSCortesArray: (state, action) => {
			oSCortesAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getOSCortes.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				oSCortesAdapter.setAll(state, action.payload.data[0]);
			} else {
				oSCortesAdapter.addMany(state, action.payload.data[0]);
			}

			const data = oSCortesAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						oSCortesAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			oSCortesAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeOSCortes.fulfilled]: (state, action) => {
			oSCortesAdapter.removeMany(state, action.payload.ids);
			oSCortesAdapter.addMany(state, action.payload.data[0]);

			const data = oSCortesAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						oSCortesAdapter.updateOne(state, {
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

export const { setOSCortesSearchText, deleteOSCortesArray } = OSCortesSlice.actions;
export default OSCortesSlice.reducer;

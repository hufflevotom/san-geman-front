import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getOrdenServicioGenerales = createAsyncThunk(
	'logistica/orden-servicio-general/getOrdenServicioGenerales',
	async abc => {
		let url = `logistica/orden-servicio-general?limit=${abc.limit}&offset=${abc.offset}`;

		if (abc.busqueda) {
			url += `&busqueda=${abc.busqueda}`;
		}

		const response = await httpClient.get(url);
		const data = await response.data.body;

		return { data, tipo: abc.tipoBusqueda };
	}
);

export const removeOrdenServicioGenerales = createAsyncThunk(
	'logistica/orden-servicio-general/removeOrdenServicioGenerales',
	async (target, { dispatch, getState }) => {
		const texto = getState().logistica.ordenServicioGenerales.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`logistica/orden-servicio-general/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`logistica/orden-servicio-general?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Orden de servicio eliminada' };
	}
);

export const ordenServicioGeneralesAdapter = createEntityAdapter({
	selectId: ordenServicioGenerales => ordenServicioGenerales.id,
});

export const {
	selectAll: selectOrdenServicioGenerales,
	selectById: selectOrdenServicioGeneralesById,
} = ordenServicioGeneralesAdapter.getSelectors(state => state.logistica.ordenServicioGenerales);

const OrdenServicioGeneralesSlice = createSlice({
	name: 'logistica/orden-servicio-general',
	initialState: ordenServicioGeneralesAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setOrdenServicioGeneralesSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteOrdenServicioGeneralesArray: (state, action) => {
			ordenServicioGeneralesAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getOrdenServicioGenerales.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				ordenServicioGeneralesAdapter.setAll(state, action.payload.data[0]);
			} else {
				ordenServicioGeneralesAdapter.addMany(state, action.payload.data[0]);
			}

			const data = ordenServicioGeneralesAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						ordenServicioGeneralesAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			ordenServicioGeneralesAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeOrdenServicioGenerales.fulfilled]: (state, action) => {
			ordenServicioGeneralesAdapter.removeMany(state, action.payload.ids);
			ordenServicioGeneralesAdapter.addMany(state, action.payload.data[0]);

			const data = ordenServicioGeneralesAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						ordenServicioGeneralesAdapter.updateOne(state, {
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

export const { setOrdenServicioGeneralesSearchText, deleteOrdenServicioGeneralesArray } =
	OrdenServicioGeneralesSlice.actions;
export default OrdenServicioGeneralesSlice.reducer;

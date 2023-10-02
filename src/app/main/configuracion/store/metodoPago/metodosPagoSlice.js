import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import httpClient from 'utils/Api';

export const getMetodosPago = createAsyncThunk(
	'configuraciones/metodosPago/getMetodosPago',
	async abc => {
		let url = `configuraciones/forma-pagos?limit=${abc.limit}&offset=${abc.offset}`;

		if (abc.busqueda) {
			url += `&busqueda=${abc.busqueda}`;
		}

		const response = await httpClient.get(url);
		const data = await response.data.body;
		return { data, tipo: abc.tipoBusqueda };
	}
);

export const removeMetodosPago = createAsyncThunk(
	'configuraciones/metodosPago/removeMetodosPago',
	async (target, { dispatch, getState }) => {
		const texto = getState().configuraciones.metodosPago.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`configuraciones/forma-pagos/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`configuraciones/forma-pagos?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Método de pago eliminado' };
	}
);

export const metodosPagoAdapter = createEntityAdapter({ selectId: metodoPago => metodoPago.id });

export const { selectAll: selectMetodosPago, selectById: selectMetodosPagoById } =
	metodosPagoAdapter.getSelectors(state => state.configuraciones.metodosPago);

const MetodosPagoSlice = createSlice({
	name: 'configuraciones/metodoPago',
	initialState: metodosPagoAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setMetodosPagoSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteMetodosPagoArray: (state, action) => {
			metodosPagoAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getMetodosPago.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				metodosPagoAdapter.setAll(state, action.payload.data[0]);
			} else {
				metodosPagoAdapter.addMany(state, action.payload.data[0]);
			}

			const data = metodosPagoAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						metodosPagoAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			metodosPagoAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},

		[removeMetodosPago.fulfilled]: (state, action) => {
			metodosPagoAdapter.removeMany(state, action.payload.ids);
			metodosPagoAdapter.addMany(state, action.payload.data[0]);

			const data = metodosPagoAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						metodosPagoAdapter.updateOne(state, {
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

export const { setMetodosPagoSearchText, deleteMetodosPagoArray } = MetodosPagoSlice.actions;
export default MetodosPagoSlice.reducer;

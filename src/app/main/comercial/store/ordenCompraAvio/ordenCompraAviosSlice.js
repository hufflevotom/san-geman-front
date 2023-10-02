import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getOCAvios = createAsyncThunk('comercial/ordCompraAvios/getOCAvios', async abc => {
	let url = `comercial/compra-avios?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;
	return { data, tipo: abc.tipoBusqueda };
});

export const removeOCAvios = createAsyncThunk(
	'comercial/ordCompraAvios/removeOCAvios',
	async (target, { dispatch, getState }) => {
		const texto = getState().comercial.ordenCompraAvios.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`comercial/compra-avios/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`comercial/compra-avios?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Orden eliminada' };
	}
);

export const ordenCompraAviosAdapter = createEntityAdapter({ selectId: ocAvio => ocAvio.id });

export const { selectAll: selectOCAvios, selectById: selectOCAviosById } =
	ordenCompraAviosAdapter.getSelectors(state => state.comercial.ordenCompraAvios);

const OrdenCompraAviosSlice = createSlice({
	name: 'comercial/ordCompraAvios',
	initialState: ordenCompraAviosAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setOrdenCompraAviosSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteOrdenCompraAviosArray: (state, action) => {
			ordenCompraAviosAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getOCAvios.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				ordenCompraAviosAdapter.setAll(state, action.payload.data[0]);
			} else {
				ordenCompraAviosAdapter.addMany(state, action.payload.data[0]);
			}

			const data = ordenCompraAviosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						ordenCompraAviosAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			ordenCompraAviosAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeOCAvios.fulfilled]: (state, action) => {
			ordenCompraAviosAdapter.removeMany(state, action.payload.ids);
			ordenCompraAviosAdapter.addMany(
				state,
				action.payload.data[0].filter(
					element => action.payload.ids.findIndex(e => e === element.id) === -1
				)
			);

			const data = ordenCompraAviosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						ordenCompraAviosAdapter.updateOne(state, {
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

export const { setOrdenCompraAviosSearchText, deleteOrdenCompraAviosArray } =
	OrdenCompraAviosSlice.actions;
export default OrdenCompraAviosSlice.reducer;

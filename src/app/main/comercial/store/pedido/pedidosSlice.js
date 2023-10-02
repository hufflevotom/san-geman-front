import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getPedidos = createAsyncThunk('comercial/pedidos/getPedidos', async abc => {
	let url = `comercial/pedidos?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;
	console.log('URL: ', data);

	return { data, tipo: abc.tipoBusqueda };
});

export const removePedidos = createAsyncThunk(
	'comercial/pedidos/removePedidos',
	async (target, { dispatch, getState }) => {
		const texto = getState().comercial.pedidos.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`comercial/pedidos/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`comercial/pedidos?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Pedido eliminado' };
	}
);

export const pedidosAdapter = createEntityAdapter({ selectId: pedido => pedido.id });

export const { selectAll: selectPedidos, selectById: selectPedidosById } =
	pedidosAdapter.getSelectors(state => state.comercial.pedidos);

const PedidosSlice = createSlice({
	name: 'comercial/pedidos',
	initialState: pedidosAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setPedidosSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deletePedidosArray: (state, action) => {
			pedidosAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getPedidos.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				pedidosAdapter.setAll(state, action.payload.data[0]);
			} else {
				pedidosAdapter.addMany(state, action.payload.data[0]);
			}

			const data = pedidosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						pedidosAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			pedidosAdapter.sortComparer = true;
			const total = action.payload.data[1];
			console.log('TOTAL ADAPTER 1 :', total);
			state.total = total;
		},
		[removePedidos.fulfilled]: (state, action) => {
			pedidosAdapter.removeMany(state, action.payload.ids);
			pedidosAdapter.addMany(
				state,
				action.payload.data[0].filter(
					element => action.payload.ids.findIndex(e => e === element.id) === -1
				)
			);

			const data = pedidosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						pedidosAdapter.updateOne(state, {
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

export const { setPedidosSearchText, deletePedidosArray } = PedidosSlice.actions;
export default PedidosSlice.reducer;

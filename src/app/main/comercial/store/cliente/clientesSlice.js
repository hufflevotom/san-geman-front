import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getClientes = createAsyncThunk('comercial/clientes/getClientes', async abc => {
	let url = `comercial/clientes?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;
	return { data, tipo: abc.tipoBusqueda };
});

export const removeClientes = createAsyncThunk(
	'comercial/clientes/removeClientes',
	async (target, { dispatch, getState }) => {
		const texto = getState().comercial.clientes.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`comercial/clientes/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`comercial/clientes?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Cliente eliminado' };
	}
);

export const clientesAdapter = createEntityAdapter({ selectId: cliente => cliente.id });

export const { selectAll: selectClientes, selectById: selectClientesById } =
	clientesAdapter.getSelectors(state => state.comercial.clientes);

const ClientesSlice = createSlice({
	name: 'comercial/clientes',
	initialState: clientesAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setClientesSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteClientesArray: (state, action) => {
			clientesAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getClientes.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				clientesAdapter.setAll(state, action.payload.data[0]);
			} else {
				clientesAdapter.addMany(state, action.payload.data[0]);
			}

			const data = clientesAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						clientesAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			clientesAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeClientes.fulfilled]: (state, action) => {
			clientesAdapter.removeMany(state, action.payload.ids);
			clientesAdapter.addMany(
				state,
				action.payload.data[0].filter(
					element => action.payload.ids.findIndex(e => e === element.id) === -1
				)
			);

			const data = clientesAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						clientesAdapter.updateOne(state, {
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

export const { setClientesSearchText, deleteClientesArray } = ClientesSlice.actions;
export default ClientesSlice.reducer;

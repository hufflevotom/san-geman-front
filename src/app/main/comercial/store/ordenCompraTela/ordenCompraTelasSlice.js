import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getOCTelas = createAsyncThunk('comercial/ordCompraTelas/getOCTelas', async abc => {
	let url = `comercial/compra-telas?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;
	return { data, tipo: abc.tipoBusqueda };
});

export const removeOCTelas = createAsyncThunk(
	'comercial/ordCompraTelas/removeOCTelas',
	async (target, { dispatch, getState }) => {
		const texto = getState().comercial.ordenCompraTelas.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`comercial/compra-telas/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`comercial/compra-telas?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Orden eliminada' };
	}
);

export const ordenCompraTelasAdapter = createEntityAdapter({ selectId: ocTela => ocTela.id });

export const { selectAll: selectOCTelas, selectById: selectOCTelasById } =
	ordenCompraTelasAdapter.getSelectors(state => state.comercial.ordenCompraTelas);

const OrdenCompraTelasSlice = createSlice({
	name: 'comercial/ordCompraTelas',
	initialState: ordenCompraTelasAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setOrdenCompraTelasSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteOrdenCompraTelasArray: (state, action) => {
			ordenCompraTelasAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getOCTelas.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				ordenCompraTelasAdapter.setAll(state, action.payload.data[0]);
			} else {
				ordenCompraTelasAdapter.addMany(state, action.payload.data[0]);
			}

			const data = ordenCompraTelasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						ordenCompraTelasAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			ordenCompraTelasAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeOCTelas.fulfilled]: (state, action) => {
			ordenCompraTelasAdapter.removeMany(state, action.payload.ids);
			ordenCompraTelasAdapter.addMany(
				state,
				action.payload.data[0].filter(
					element => action.payload.ids.findIndex(e => e === element.id) === -1
				)
			);

			const data = ordenCompraTelasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						ordenCompraTelasAdapter.updateOne(state, {
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

export const { setOrdenCompraTelasSearchText, deleteOrdenCompraTelasArray } =
	OrdenCompraTelasSlice.actions;
export default OrdenCompraTelasSlice.reducer;

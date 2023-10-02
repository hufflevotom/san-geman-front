import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getSalidas = createAsyncThunk('almacen/salidas/getSalidas', async abc => {
	let url = `almacen-tela/salida?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;

	return { data, tipo: abc.tipoBusqueda };
});

export const removeAlmacenTelas = createAsyncThunk(
	'almacen/salidas/removeAlmacenTelas',
	async (target, { dispatch, getState }) => {
		const texto = getState().almacen.almacenTelas.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`almacen/almacen-telas/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`almacen/almacen-telas?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Fila eliminada' };
	}
);

export const anularSalidaTela = createAsyncThunk(
	'almacen/almacen-telas/anularSalida',
	async (target, { dispatch, getState }) => {
		const texto = getState().almacen.ingresos.searchText;
		const dataBody = await httpClient.put(`almacen-tela/salida/anular/${target.id}`);
		const response = await httpClient.get(
			`almacen-tela/salida?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);

		const data = await response.data.body;
		return { data, id: target.id };
	}
);

export const salidasTelasAdapter = createEntityAdapter({ selectId: salida => salida.id });

export const { selectAll: selectSalidas, selectById: selectSalidasById } =
	salidasTelasAdapter.getSelectors(state => state.almacen.salidas);

const SalidasTelasSlice = createSlice({
	name: 'almacen/salidas',
	initialState: salidasTelasAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		resetTabla: () =>
			salidasTelasAdapter.getInitialState({
				total: 0,
				searchText: '',
				maxPage: 0,
			}),
		setSalidasSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteSalidasArray: (state, action) => {
			salidasTelasAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getSalidas.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				salidasTelasAdapter.setAll(state, action.payload.data[0]);
			} else {
				salidasTelasAdapter.addMany(state, action.payload.data[0]);
			}

			const data = salidasTelasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						salidasTelasAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			salidasTelasAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeAlmacenTelas.fulfilled]: (state, action) => {
			salidasTelasAdapter.removeMany(state, action.payload.ids);
			salidasTelasAdapter.addMany(state, action.payload.data[0]);

			const data = salidasTelasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						salidasTelasAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});
			const total = action.payload.data[1];
			state.total = total;
		},
		[anularSalidaTela.fulfilled]: (state, action) => {
			salidasTelasAdapter.removeOne(state, action.payload.id);
			salidasTelasAdapter.addMany(state, action.payload.data[0]);

			const data = salidasTelasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						salidasTelasAdapter.updateOne(state, {
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

export const { resetTabla, setSalidasSearchText, deleteSalidasArray } = SalidasTelasSlice.actions;
export default SalidasTelasSlice.reducer;

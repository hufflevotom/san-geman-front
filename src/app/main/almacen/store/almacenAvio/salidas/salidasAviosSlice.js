import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getSalidas = createAsyncThunk('almacen/salidas/getSalidas', async abc => {
	let url = `almacen-avio/salida?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;

	return { data, tipo: abc.tipoBusqueda };
});

export const removeAlmacenAvios = createAsyncThunk(
	'almacen/salidas/removeAlmacenAvios',
	async (target, { dispatch, getState }) => {
		const texto = getState().almacen.almacenAvios.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`almacen/almacen-avios/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`almacen/almacen-avios?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Fila eliminada' };
	}
);

export const anularSalidaAvio = createAsyncThunk(
	'almacen/salidas/anularSalidaAvio',
	async (target, { dispatch, getState }) => {
		const texto = getState().almacen.ingresos.searchText;
		const dataBody = await httpClient.put(`almacen-avio/salida/anular/${target.id}`);
		const response = await httpClient.get(
			`almacen-avio/salida?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);

		const data = await response.data.body;
		return { data, id: target.id };
	}
);

export const salidasAviosAdapter = createEntityAdapter({ selectId: salida => salida.id });

export const { selectAll: selectSalidas, selectById: selectSalidasById } =
	salidasAviosAdapter.getSelectors(state => state.almacen.salidasAvio);

const SalidasAviosSlice = createSlice({
	name: 'almacen/salidas',
	initialState: salidasAviosAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setSalidasSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteSalidasArray: (state, action) => {
			salidasAviosAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getSalidas.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				salidasAviosAdapter.setAll(state, action.payload.data[0]);
			} else {
				salidasAviosAdapter.addMany(state, action.payload.data[0]);
			}

			const data = salidasAviosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						salidasAviosAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			salidasAviosAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeAlmacenAvios.fulfilled]: (state, action) => {
			salidasAviosAdapter.removeMany(state, action.payload.ids);
			salidasAviosAdapter.addMany(state, action.payload.data[0]);

			const data = salidasAviosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						salidasAviosAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});
			const total = action.payload.data[1];
			state.total = total;
		},
		[anularSalidaAvio.fulfilled]: (state, action) => {
			salidasAviosAdapter.removeOne(state, action.payload.id);
			salidasAviosAdapter.addMany(state, action.payload.data[0]);

			const data = salidasAviosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						salidasAviosAdapter.updateOne(state, {
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

export const { setSalidasSearchText, deleteSalidasArray } = SalidasAviosSlice.actions;
export default SalidasAviosSlice.reducer;

import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getSalidasMixtas = createAsyncThunk(
	'almacen/salidasMixtas/getSalidasMixtas',
	async abc => {
		let url = `almacen-tela/salida?limit=${abc.limit}&offset=${abc.offset}`;

		if (abc.busqueda) {
			url += `&busqueda=${abc.busqueda}`;
		}

		const response = await httpClient.get(url);
		const data = await response.data.body;
		return { data, tipo: abc.tipoBusqueda };
	}
);

export const salidasMixtasAdapter = createEntityAdapter({
	selectId: salidaMixta => salidaMixta.id,
});

export const { selectAll: selectSalidasMixtas, selectById: selectSalidasMixtasById } =
	salidasMixtasAdapter.getSelectors(state => state.almacen.salidasMixtas);

const SalidasMixtasSlice = createSlice({
	name: 'almacen/salidasMixtas',
	initialState: salidasMixtasAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		resetTabla: () =>
			salidasMixtasAdapter.getInitialState({
				total: 0,
				searchText: '',
				maxPage: 0,
			}),
		setSalidasMixtasSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteSalidasMixtasArray: (state, action) => {
			salidasMixtasAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getSalidasMixtas.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				salidasMixtasAdapter.setAll(state, action.payload.data[0]);
			} else {
				salidasMixtasAdapter.addMany(state, action.payload.data[0]);
			}

			const data = salidasMixtasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						salidasMixtasAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			salidasMixtasAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
	},
});

export const { resetTabla, setSalidasMixtasSearchText, deleteSalidasMixtasArray } =
	SalidasMixtasSlice.actions;
export default SalidasMixtasSlice.reducer;

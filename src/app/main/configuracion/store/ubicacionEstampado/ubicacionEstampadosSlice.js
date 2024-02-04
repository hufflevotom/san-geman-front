import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import httpClient from 'utils/Api';

export const getUbicacionEstampados = createAsyncThunk(
	'configuraciones/ubicacionEstampados/getUbicacionEstampados',
	async abc => {
		let url = `configuraciones/ubicacion-estilos-estampados?limit=${abc.limit}&offset=${abc.offset}`;

		if (abc.busqueda) {
			url += `&busqueda=${abc.busqueda}`;
		}

		const response = await httpClient.get(url);
		const data = await response.data.body;
		return { data, tipo: abc.tipoBusqueda };
	}
);

export const removeUbicacionEstampados = createAsyncThunk(
	'configuraciones/ubicacionEstampados/removeUbicacionEstampados',
	async (target, { dispatch, getState }) => {
		const texto = getState().configuraciones.ubicacionEstampados.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`configuraciones/ubicacion-estilos-estampados/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`configuraciones/ubicacion-estilos-estampados?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Estampado eliminado' };
	}
);

export const ubicacionEstampadosAdapter = createEntityAdapter({
	selectId: ubicacionEstampado => ubicacionEstampado.id,
});

export const { selectAll: selectUbicacionEstampados, selectById: selectUbicacionEstampadosById } =
	ubicacionEstampadosAdapter.getSelectors(state => state.configuraciones.ubicacionEstampados);

const UbicacionEstampadosSlice = createSlice({
	name: 'configuraciones/ubicacionEstampados',
	initialState: ubicacionEstampadosAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setUbicacionEstampadosSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteUbicacionEstampadosArray: (state, action) => {
			ubicacionEstampadosAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getUbicacionEstampados.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				ubicacionEstampadosAdapter.setAll(state, action.payload.data[0]);
			} else {
				ubicacionEstampadosAdapter.addMany(state, action.payload.data[0]);
			}

			const data = ubicacionEstampadosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						ubicacionEstampadosAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			ubicacionEstampadosAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},

		[removeUbicacionEstampados.fulfilled]: (state, action) => {
			ubicacionEstampadosAdapter.removeMany(state, action.payload.ids);
			ubicacionEstampadosAdapter.addMany(state, action.payload.data[0]);

			const data = ubicacionEstampadosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						ubicacionEstampadosAdapter.updateOne(state, {
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

export const { setUbicacionEstampadosSearchText, deleteUbicacionEstampadosArray } =
	UbicacionEstampadosSlice.actions;
export default UbicacionEstampadosSlice.reducer;

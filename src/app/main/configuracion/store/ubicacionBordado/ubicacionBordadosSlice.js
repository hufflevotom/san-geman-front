import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import httpClient from 'utils/Api';

export const getUbicacionBordados = createAsyncThunk(
	'configuraciones/ubicacionBordados/getUbicacionBordados',
	async abc => {
		let url = `configuraciones/ubicacion-estilos-bordados?limit=${abc.limit}&offset=${abc.offset}`;

		if (abc.busqueda) {
			url += `&busqueda=${abc.busqueda}`;
		}

		const response = await httpClient.get(url);
		const data = await response.data.body;
		return { data, tipo: abc.tipoBusqueda };
	}
);

export const removeUbicacionBordados = createAsyncThunk(
	'configuraciones/ubicacionBordados/removeUbicacionBordados',
	async (target, { dispatch, getState }) => {
		const texto = getState().configuraciones.ubicacionBordados.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`configuraciones/ubicacion-estilos-bordados/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`configuraciones/ubicacion-estilos-bordados?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Bordado eliminado' };
	}
);

export const ubicacionBordadosAdapter = createEntityAdapter({
	selectId: ubicacionBordado => ubicacionBordado.id,
});

export const { selectAll: selectUbicacionBordados, selectById: selectUbicacionBordadosById } =
	ubicacionBordadosAdapter.getSelectors(state => state.configuraciones.ubicacionBordados);

const UbicacionBordadosSlice = createSlice({
	name: 'configuraciones/ubicacionBordados',
	initialState: ubicacionBordadosAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setUbicacionBordadosSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteUbicacionBordadosArray: (state, action) => {
			ubicacionBordadosAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getUbicacionBordados.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				ubicacionBordadosAdapter.setAll(state, action.payload.data[0]);
			} else {
				ubicacionBordadosAdapter.addMany(state, action.payload.data[0]);
			}

			const data = ubicacionBordadosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						ubicacionBordadosAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			ubicacionBordadosAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},

		[removeUbicacionBordados.fulfilled]: (state, action) => {
			ubicacionBordadosAdapter.removeMany(state, action.payload.ids);
			ubicacionBordadosAdapter.addMany(state, action.payload.data[0]);

			const data = ubicacionBordadosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						ubicacionBordadosAdapter.updateOne(state, {
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

export const { setUbicacionBordadosSearchText, deleteUbicacionBordadosArray } =
	UbicacionBordadosSlice.actions;
export default UbicacionBordadosSlice.reducer;

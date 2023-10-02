import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getMuestrasPrendasLibres = createAsyncThunk(
	'comercial/muestrasPrendasLibres/getMuestrasPrendasLibres',
	async abc => {
		let url = `comercial/muestras-prendas-libres?limit=${abc.limit}&offset=${abc.offset}`;

		if (abc.busqueda) {
			url += `&busqueda=${abc.busqueda}`;
		}

		const response = await httpClient.get(url);
		const data = await response.data.body;
		return { data, tipo: abc.tipoBusqueda };
	}
);

export const removeMuestrasPrendasLibres = createAsyncThunk(
	'comercial/muestrasPrendasLibres/removeMuestrasPrendasLibres',
	async (target, { dispatch, getState }) => {
		const texto = getState().comercial.muestrasPrendasLibres.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`comercial/muestras-prendas-libres/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`comercial/muestras-prendas-libres?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Muestra Prenda libre eliminada' };
	}
);

export const cambiarEstadoMuestraPrenda = createAsyncThunk(
	'comercial/muestrasPrendasLibres/cambiarEstadoMuestraPrenda',
	async target => {
		const response = await httpClient.put(`comercial/muestras-prendas-libres/estado/${target.id}`, {
			estado: target.state,
		});
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Muestra Prenda modificada' };
	}
);

export const muestrasPrendasLibresAdapter = createEntityAdapter({
	selectId: muestraLibre => muestraLibre.id,
});

export const {
	selectAll: selectMuestrasPrendasLibres,
	selectById: selectMuestrasPrendasLibresById,
} = muestrasPrendasLibresAdapter.getSelectors(state => state.comercial.muestrasPrendasLibres);

const MuestrasPrendasLibresSlice = createSlice({
	name: 'comercial/muestrasPrendasLibres',
	initialState: muestrasPrendasLibresAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setMuestrasPrendasLibresSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteMuestraPrendaLibreArray: (state, action) => {
			muestrasPrendasLibresAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getMuestrasPrendasLibres.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				muestrasPrendasLibresAdapter.setAll(state, action.payload.data[0]);
			} else {
				muestrasPrendasLibresAdapter.addMany(state, action.payload.data[0]);
			}

			const data = muestrasPrendasLibresAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						muestrasPrendasLibresAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			muestrasPrendasLibresAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeMuestrasPrendasLibres.fulfilled]: (state, action) => {
			muestrasPrendasLibresAdapter.removeMany(state, action.payload.ids);
			muestrasPrendasLibresAdapter.addMany(
				state,
				action.payload.data[0].filter(
					element => action.payload.ids.findIndex(e => e === element.id) === -1
				)
			);

			const data = muestrasPrendasLibresAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						muestrasPrendasLibresAdapter.updateOne(state, {
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

export const { setMuestrasPrendasLibresSearchText, deleteMuestraPrendaLibreArray } =
	MuestrasPrendasLibresSlice.actions;
export default MuestrasPrendasLibresSlice.reducer;

import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getMuestrasTelasLibres = createAsyncThunk(
	'comercial/muestrasTelasLibres/getMuestrasTelasLibres',
	async abc => {
		let url = `comercial/muestras-telas-libres?limit=${abc.limit}&offset=${abc.offset}`;

		if (abc.busqueda) {
			url += `&busqueda=${abc.busqueda}`;
		}

		const response = await httpClient.get(url);
		const data = await response.data.body;
		return { data, tipo: abc.tipoBusqueda };
	}
);

export const removeMuestrasTelasLibres = createAsyncThunk(
	'comercial/muestrasTelasLibres/removeMuestrasTelasLibres',
	async (target, { dispatch, getState }) => {
		const texto = getState().comercial.muestrasTelasLibres.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`comercial/muestras-telas-libres/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`comercial/muestras-telas-libres?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Muestra libre eliminada' };
	}
);

export const cambiarEstadoMuestraTela = createAsyncThunk(
	'comercial/muestrasTelasLibres/cambiarEstadoMuestraTela',
	async target => {
		const response = await httpClient.put(`comercial/muestras-telas-libres/estado/${target.id}`, {
			estado: target.state,
		});
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Muestra Tela modificada' };
	}
);

export const muestrasTelasLibresAdapter = createEntityAdapter({
	selectId: muestraTelaLibre => muestraTelaLibre.id,
});

export const { selectAll: selectMuestrasTelasLibres, selectById: selectMuestrasTelasLibresById } =
	muestrasTelasLibresAdapter.getSelectors(state => state.comercial.muestrasTelasLibres);

const MuestrasTelasLibresSlice = createSlice({
	name: 'comercial/muestrasTelasLibres',
	initialState: muestrasTelasLibresAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setMuestrasTelasLibresSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteMuestraTelaLibreArray: (state, action) => {
			muestrasTelasLibresAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getMuestrasTelasLibres.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				muestrasTelasLibresAdapter.setAll(state, action.payload.data[0]);
			} else {
				muestrasTelasLibresAdapter.addMany(state, action.payload.data[0]);
			}

			const data = muestrasTelasLibresAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						muestrasTelasLibresAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			muestrasTelasLibresAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeMuestrasTelasLibres.fulfilled]: (state, action) => {
			muestrasTelasLibresAdapter.removeMany(state, action.payload.ids);
			muestrasTelasLibresAdapter.addMany(
				state,
				action.payload.data[0].filter(
					element => action.payload.ids.findIndex(e => e === element.id) === -1
				)
			);

			const data = muestrasTelasLibresAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						muestrasTelasLibresAdapter.updateOne(state, {
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

export const { setMuestrasTelasLibresSearchText, deleteMuestraTelaLibreArray } =
	MuestrasTelasLibresSlice.actions;
export default MuestrasTelasLibresSlice.reducer;

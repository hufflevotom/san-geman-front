import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getKardex = createAsyncThunk('almacen/almacen-avios/getKardex', async abc => {
	let url = `almacen-avio/kardex?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;
	return { data, tipo: abc.tipoBusqueda };
});

export const cambioUbicacion = createAsyncThunk(
	'almacen/almacen-avio/cambioUbicacion',
	async (abc, { rejectWithValue }) => {
		try {
			const url = `almacen-avio/kardex/actualizarUbicacion/${abc.id}/${abc.ubicacion}`;
			const response = await httpClient.put(url);
			return await response.data.body;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const removeAlmacenAvios = createAsyncThunk(
	'almacen/almacen-avios/removeAlmacenAvios',
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

export const kardexAviosAdapter = createEntityAdapter({ selectId: kardex => kardex.id });

export const { selectAll: selectKardex, selectById: selectKardexById } =
	kardexAviosAdapter.getSelectors(state => state.almacen.kardexAvio);

const KardexAviosSlice = createSlice({
	name: 'almacen/kardex',
	initialState: kardexAviosAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setKardexSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteKardexArray: (state, action) => {
			kardexAviosAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getKardex.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				kardexAviosAdapter.setAll(state, action.payload.data[0]);
			} else {
				kardexAviosAdapter.addMany(state, action.payload.data[0]);
			}

			const data = kardexAviosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						kardexAviosAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			kardexAviosAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeAlmacenAvios.fulfilled]: (state, action) => {
			kardexAviosAdapter.removeMany(state, action.payload.ids);
			kardexAviosAdapter.addMany(state, action.payload.data[0]);

			const data = kardexAviosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						kardexAviosAdapter.updateOne(state, {
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

export const { setKardexSearchText, deleteKardexArray } = KardexAviosSlice.actions;
export default KardexAviosSlice.reducer;

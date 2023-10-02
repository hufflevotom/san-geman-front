import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getKardex = createAsyncThunk('almacen/almacen-telas/getKardex', async abc => {
	let url = `almacen-tela/kardex?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;
	return { data, tipo: abc.tipoBusqueda };
});

export const cambioUbicacion = createAsyncThunk(
	'almacen/almacen-telas/cambioUbicacion',
	async (abc, { rejectWithValue }) => {
		try {
			const url = `almacen-tela/kardex/actualizarUbicacion/${abc.id}/${abc.ubicacion}`;
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

export const cambioColor = createAsyncThunk(
	'almacen/almacen-telas/cambioColor',
	async (abc, { rejectWithValue }) => {
		try {
			const url = `producto-tela/actualizarColor/${abc.id}/${abc.color}`;
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

export const cambioAsignacion = createAsyncThunk(
	'almacen/almacen-telas/cambioAsignacion',
	async (abc, { rejectWithValue }) => {
		try {
			const url = `producto-tela/changeAsignarOp/${abc.id}/${abc.op}`;
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

export const removeAlmacenTelas = createAsyncThunk(
	'almacen/almacen-telas/removeAlmacenTelas',
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

export const kardexTelasAdapter = createEntityAdapter({ selectId: kardex => kardex.id });

export const { selectAll: selectKardex, selectById: selectKardexById } =
	kardexTelasAdapter.getSelectors(state => state.almacen.kardex);

const KardexTelasSlice = createSlice({
	name: 'almacen/kardex',
	initialState: kardexTelasAdapter.getInitialState({
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
			kardexTelasAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getKardex.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				kardexTelasAdapter.setAll(state, action.payload.data[0]);
			} else {
				kardexTelasAdapter.addMany(state, action.payload.data[0]);
			}

			const data = kardexTelasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						kardexTelasAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			kardexTelasAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeAlmacenTelas.fulfilled]: (state, action) => {
			kardexTelasAdapter.removeMany(state, action.payload.ids);
			kardexTelasAdapter.addMany(state, action.payload.data[0]);

			const data = kardexTelasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						kardexTelasAdapter.updateOne(state, {
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

export const { setKardexSearchText, deleteKardexArray } = KardexTelasSlice.actions;
export default KardexTelasSlice.reducer;

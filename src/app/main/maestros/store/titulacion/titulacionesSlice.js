import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getTitulaciones = createAsyncThunk(
	'maestros/titulaciones/getTitulaciones',
	async abc => {
		let url = `maestro/titulacion?limit=${abc.limit}&offset=${abc.offset}`;

		if (abc.busqueda) {
			url += `&busqueda=${abc.busqueda}`;
		}

		const response = await httpClient.get(url);
		const data = await response.data.body;
		return { data, tipo: abc.tipoBusqueda };
	}
);

export const removeTitulaciones = createAsyncThunk(
	'maestros/titulaciones/removeTitulaciones',
	async (target, { dispatch, getState }) => {
		const texto = getState().maestros.titulaciones.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`maestro/titulacion/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`maestro/titulacion?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Titulacion eliminada' };
	}
);

// export const estadoTitulacion = createAsyncThunk(
// 	'maestro/titulacion/estadoTitulacion',
// 	async (data, { rejectWithValue }) => {
// 		try {
// 			const response = await httpClient.put(`maestro/titulacion/estado/${data.id}`, {
// 				estado: data.estado,
// 			});

// 			return response.data.body;
// 		} catch (error) {
// 			if (!error.response) {
// 				throw error;
// 			}
// 			return rejectWithValue(error.response.data);
// 		}
// 	}
// );

export const titulacionesAdapter = createEntityAdapter({ selectId: titulacion => titulacion.id });

export const { selectAll: selectTitulaciones, selectById: selectTitulacionesById } =
	titulacionesAdapter.getSelectors(state => state.maestros.titulaciones);

const TitulacionesSlice = createSlice({
	name: 'maestros/titulaciones',
	initialState: titulacionesAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setTitulacionesSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteTitulacionesArray: (state, action) => {
			titulacionesAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getTitulaciones.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				titulacionesAdapter.setAll(state, action.payload.data[0]);
			} else {
				titulacionesAdapter.addMany(state, action.payload.data[0]);
			}

			const data = titulacionesAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						titulacionesAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			titulacionesAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeTitulaciones.fulfilled]: (state, action) => {
			titulacionesAdapter.removeMany(state, action.payload.ids);
			titulacionesAdapter.addMany(state, action.payload.data[0]);

			const data = titulacionesAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						titulacionesAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});
			const total = action.payload.data[1];
			state.total = total;
		},
		// [estadoTitulacion.fulfilled]: (state, action) => {
		// 	titulacionesAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
		// },
	},
});

export const { setTitulacionesSearchText, deleteTitulacionesArray } = TitulacionesSlice.actions;
export default TitulacionesSlice.reducer;

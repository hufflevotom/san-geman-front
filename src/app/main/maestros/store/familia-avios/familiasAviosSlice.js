import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getFamiliasAvios = createAsyncThunk('maestro/familia-avios/getAvios', async abc => {
	let url = `maestro/familia-avios?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	console.log('GET DATA: ', response);
	const data = await response.data.body;

	return { data, tipo: abc.tipoBusqueda };
});

export const removeFamiliasAvios = createAsyncThunk(
	'maestro/familia-avios/removeAvios',
	async (target, { dispatch, getState }) => {
		const texto = getState().maestros.familiasAvios.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`maestro/familia-avios/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`maestro/familia-avios?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Familia eliminada' };
	}
);

export const familiasAviosAdapter = createEntityAdapter({ selectId: avios => avios.id });

export const { selectAll: selectFamiliasAvios, selectById: selectFamiliasAviosById } =
	familiasAviosAdapter.getSelectors(state => state.maestros.familiasAvios);

const FamliasAviosSlice = createSlice({
	name: 'maestros/familia-avios',
	initialState: familiasAviosAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setFamiliasAviosSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteFamiliaAviosArray: (state, action) => {
			familiasAviosAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getFamiliasAvios.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				familiasAviosAdapter.setAll(state, action.payload.data[0]);
			} else {
				familiasAviosAdapter.addMany(state, action.payload.data[0]);
			}

			const data = familiasAviosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						familiasAviosAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			familiasAviosAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeFamiliasAvios.fulfilled]: (state, action) => {
			familiasAviosAdapter.removeMany(state, action.payload.ids);
			familiasAviosAdapter.addMany(state, action.payload.data[0]);

			const data = familiasAviosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						familiasAviosAdapter.updateOne(state, {
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

export const { setFamiliasAviosSearchText, deleteFamiliaAviosArray } = FamliasAviosSlice.actions;
export default FamliasAviosSlice.reducer;

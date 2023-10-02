import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getFamiliasTela = createAsyncThunk(
	'maestro/familia-telas/getFamiliasTela',
	async abc => {
		let url = `maestro/familia-tela?limit=${abc.limit}&offset=${abc.offset}`;

		if (abc.busqueda) {
			url += `&busqueda=${abc.busqueda}`;
		}

		const response = await httpClient.get(url);
		const data = await response.data.body;
		return { data, tipo: abc.tipoBusqueda };
	}
);

export const removeFamliasTelas = createAsyncThunk(
	'maestro/familia-telas/removeFamiliasTelas',
	async (target, { dispatch, getState }) => {
		const texto = getState().maestros.familiasTela.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`maestro/familia-tela/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`maestro/familia-tela?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Familia eliminada' };
	}
);

export const familiasTelaAdapter = createEntityAdapter({ selectId: familiaTela => familiaTela.id });

export const { selectAll: selectFamiliasTelas, selectById: selectFamiliasTelasById } =
	familiasTelaAdapter.getSelectors(state => state.maestros.familiasTela);

const FamiliasTelaSlice = createSlice({
	name: 'maestros/familia-telas',
	initialState: familiasTelaAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setFamiliasTelasSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteFamiliaTelaArray: (state, action) => {
			familiasTelaAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getFamiliasTela.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				familiasTelaAdapter.setAll(state, action.payload.data[0]);
			} else {
				familiasTelaAdapter.addMany(state, action.payload.data[0]);
			}

			const data = familiasTelaAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						familiasTelaAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			familiasTelaAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeFamliasTelas.fulfilled]: (state, action) => {
			familiasTelaAdapter.removeMany(state, action.payload.ids);
			familiasTelaAdapter.addMany(state, action.payload.data[0]);

			const data = familiasTelaAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						familiasTelaAdapter.updateOne(state, {
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

export const { setFamiliasTelasSearchText, deleteFamiliaTelaArray } = FamiliasTelaSlice.actions;
export default FamiliasTelaSlice.reducer;

import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getDesarrollosColoresTela = createAsyncThunk(
	'comercial/desarrollosColoresTela/getDesarrollosColoresTela',
	async abc => {
		let url = `comercial/desarrollo-color-tela?limit=${abc.limit}&offset=${abc.offset}`;

		if (abc.busqueda) {
			url += `&busqueda=${abc.busqueda}`;
		}

		const response = await httpClient.get(url);
		const data = await response.data.body;
		return { data, tipo: abc.tipoBusqueda };
	}
);

export const removeDesarrollosColoresTela = createAsyncThunk(
	'comercial/desarrollosColoresTela/removeDesarrollosColoresTela',
	async (target, { dispatch, getState }) => {
		const texto = getState().comercial.desarrollosColoresTela.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`comercial/desarrollo-color-tela/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`comercial/desarrollo-color-tela?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Desarrollo de color tela eliminada' };
	}
);

export const desarrollosColoresTelaAdapter = createEntityAdapter({
	selectId: produccion => produccion.id,
});

export const {
	selectAll: selectDesarrollosColoresTela,
	selectById: selectDesarrollosColoresTelaById,
} = desarrollosColoresTelaAdapter.getSelectors(state => state.comercial.desarrollosColoresTela);

const DarrollosColoresTelaSlice = createSlice({
	name: 'comercial/desarrollosColoresTela',
	initialState: desarrollosColoresTelaAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setDarrollosColoresTelaSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteDarrollosColoresTelaArray: (state, action) => {
			desarrollosColoresTelaAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getDesarrollosColoresTela.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				desarrollosColoresTelaAdapter.setAll(state, action.payload.data[0]);
			} else {
				desarrollosColoresTelaAdapter.addMany(state, action.payload.data[0]);
			}

			const data = desarrollosColoresTelaAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						desarrollosColoresTelaAdapter.updateOne(state, {
							id: newElement.id,
							changes: newElement,
						});
					}
				});
			});

			desarrollosColoresTelaAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeDesarrollosColoresTela.fulfilled]: (state, action) => {
			desarrollosColoresTelaAdapter.removeMany(state, action.payload.ids);
			desarrollosColoresTelaAdapter.addMany(
				state,
				action.payload.data[0].filter(
					element => action.payload.ids.findIndex(e => e === element.id) === -1
				)
			);

			const data = desarrollosColoresTelaAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						desarrollosColoresTelaAdapter.updateOne(state, {
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

export const { setDarrollosColoresTelaSearchText, deleteDarrollosColoresTelaArray } =
	DarrollosColoresTelaSlice.actions;
export default DarrollosColoresTelaSlice.reducer;

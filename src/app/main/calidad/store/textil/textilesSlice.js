import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getTextiles = createAsyncThunk('calidad/textiles/getTextiles', async abc => {
	let url = `producto-tela?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;
	return { data, tipo: abc.tipoBusqueda };
});

export const removeTextiles = createAsyncThunk(
	'calidad/textiles/removeTextiles',
	async (target, { dispatch, getState }) => {
		const texto = getState().calidad.textiles.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`calidad/textiles/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`calidad/textiles?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Textil eliminado' };
	}
);

export const textilesAdapter = createEntityAdapter({ selectId: textil => textil.id });

export const { selectAll: selectTextiles, selectById: selectTextilesById } =
	textilesAdapter.getSelectors(state => state.calidad.textiles);

const TextilesSlice = createSlice({
	name: 'calidad/textiles',
	initialState: textilesAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setTextilesSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteTextilesArray: (state, action) => {
			textilesAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getTextiles.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				textilesAdapter.setAll(state, action.payload.data[0]);
			} else {
				textilesAdapter.addMany(state, action.payload.data[0]);
			}

			const data = textilesAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						textilesAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			textilesAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeTextiles.fulfilled]: (state, action) => {
			textilesAdapter.removeMany(state, action.payload.ids);
			textilesAdapter.addMany(state, action.payload.data[0]);

			const data = textilesAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						textilesAdapter.updateOne(state, {
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

export const { setTextilesSearchText, deleteTextilesArray } = TextilesSlice.actions;
export default TextilesSlice.reducer;

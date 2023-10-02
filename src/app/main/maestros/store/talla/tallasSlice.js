import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getTallas = createAsyncThunk('maestros/tallas/getTallas', async abc => {
	let url = `maestro/tallas?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;
	return { data, tipo: abc.tipoBusqueda };
});

export const removeTallas = createAsyncThunk(
	'maestros/tallas/removeTallas',
	async (target, { dispatch, getState }) => {
		const texto = getState().maestros.tallas.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`maestro/tallas/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`maestro/tallas?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Talla eliminada' };
	}
);

export const tallasAdapter = createEntityAdapter({ selectId: talla => talla.id });

export const { selectAll: selectTallas, selectById: selectTallasById } = tallasAdapter.getSelectors(
	state => state.maestros.tallas
);

const TallasSlice = createSlice({
	name: 'maestros/tallas',
	initialState: tallasAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setTallasSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteTallasArray: (state, action) => {
			tallasAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getTallas.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				tallasAdapter.setAll(state, action.payload.data[0]);
			} else {
				tallasAdapter.addMany(state, action.payload.data[0]);
			}

			const data = tallasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						tallasAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			tallasAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeTallas.fulfilled]: (state, action) => {
			tallasAdapter.removeMany(state, action.payload.ids);
			tallasAdapter.addMany(state, action.payload.data[0]);

			const data = tallasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						tallasAdapter.updateOne(state, {
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

export const { setTallasSearchText, deleteTallasArray } = TallasSlice.actions;
export default TallasSlice.reducer;

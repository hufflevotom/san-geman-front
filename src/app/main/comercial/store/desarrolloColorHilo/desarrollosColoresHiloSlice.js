import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getDesarrollosColoresHilo = createAsyncThunk(
	'comercial/desarrollosColoresHilo/getDesarrollosColoresHilo',
	async abc => {
		let url = `comercial/desarrollo-color-hilo?limit=${abc.limit}&offset=${abc.offset}`;

		if (abc.busqueda) {
			url += `&busqueda=${abc.busqueda}`;
		}

		const response = await httpClient.get(url);
		const data = await response.data.body;
		return { data, tipo: abc.tipoBusqueda };
	}
);

export const removeDesarrollosColoresHilo = createAsyncThunk(
	'comercial/desarrollosColoresHilo/removeDesarrollosColoresHilo',
	async (target, { dispatch, getState }) => {
		const texto = getState().comercial.desarrollosColoresHilo.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`comercial/desarrollo-color-hilo/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`comercial/desarrollo-color-hilo?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Desarrollo de color hilo eliminada' };
	}
);

export const desarrollosColoresHiloAdapter = createEntityAdapter({
	selectId: produccion => produccion.id,
});

export const {
	selectAll: selectDesarrollosColoresHilo,
	selectById: selectDesarrollosColoresHiloById,
} = desarrollosColoresHiloAdapter.getSelectors(state => state.comercial.desarrollosColoresHilo);

const DarrollosColoresHiloSlice = createSlice({
	name: 'comercial/desarrollosColoresHilo',
	initialState: desarrollosColoresHiloAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setDarrollosColoresHiloSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteDarrollosColoresHiloArray: (state, action) => {
			desarrollosColoresHiloAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getDesarrollosColoresHilo.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				desarrollosColoresHiloAdapter.setAll(state, action.payload.data[0]);
			} else {
				desarrollosColoresHiloAdapter.addMany(state, action.payload.data[0]);
			}

			const data = desarrollosColoresHiloAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						desarrollosColoresHiloAdapter.updateOne(state, {
							id: newElement.id,
							changes: newElement,
						});
					}
				});
			});

			desarrollosColoresHiloAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeDesarrollosColoresHilo.fulfilled]: (state, action) => {
			desarrollosColoresHiloAdapter.removeMany(state, action.payload.ids);
			desarrollosColoresHiloAdapter.addMany(
				state,
				action.payload.data[0].filter(
					element => action.payload.ids.findIndex(e => e === element.id) === -1
				)
			);

			const data = desarrollosColoresHiloAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						desarrollosColoresHiloAdapter.updateOne(state, {
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

export const { setDarrollosColoresHiloSearchText, deleteDarrollosColoresHiloArray } =
	DarrollosColoresHiloSlice.actions;
export default DarrollosColoresHiloSlice.reducer;

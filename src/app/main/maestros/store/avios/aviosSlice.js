import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getAvios = createAsyncThunk('maestros/avios/getAvios', async abc => {
	let url = `maestro/avios?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;
	return { data, tipo: abc.tipoBusqueda };
});

export const getAviosHilos = createAsyncThunk('maestros/avios/getAviosHilos', async abc => {
	let url = `maestro/avios/hilo?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;
	return { data, tipo: abc.tipoBusqueda };
});

export const removeAvios = createAsyncThunk(
	'maestros/avios/removeAvios',
	async (target, { dispatch, getState }) => {
		const texto = getState().maestros.avios.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`maestro/avios/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`maestro/avios?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Avío eliminado' };
	}
);

export const aviosAdapter = createEntityAdapter({ selectId: avio => avio.id });

export const { selectAll: selectAvios, selectById: selectAviosById } = aviosAdapter.getSelectors(
	state => state.maestros.avios
);

const AviosSlice = createSlice({
	name: 'maestros/avios',
	initialState: aviosAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		resetTabla: () =>
			aviosAdapter.getInitialState({
				total: 0,
				searchText: '',
				maxPage: 0,
			}),
		setAviosSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteAviosArray: (state, action) => {
			aviosAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getAvios.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				aviosAdapter.setAll(state, action.payload.data[0]);
			} else {
				aviosAdapter.addMany(state, action.payload.data[0]);
			}

			const data = aviosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						aviosAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			aviosAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[getAviosHilos.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				aviosAdapter.setAll(state, action.payload.data[0]);
			} else {
				aviosAdapter.addMany(state, action.payload.data[0]);
			}

			const data = aviosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						aviosAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			aviosAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeAvios.fulfilled]: (state, action) => {
			aviosAdapter.removeMany(state, action.payload.ids);
			aviosAdapter.addMany(state, action.payload.data[0]);

			const data = aviosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						aviosAdapter.updateOne(state, {
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

export const { setAviosSearchText, deleteAviosArray, resetTabla } = AviosSlice.actions;
export default AviosSlice.reducer;

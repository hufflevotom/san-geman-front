import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getTelas = createAsyncThunk('maestros/telas/getTelas', async abc => {
	let url = `maestro/tela?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;
	return { data, tipo: abc.tipoBusqueda };
});

export const removeTelas = createAsyncThunk(
	'maestros/telas/removeTelas',
	async (target, { dispatch, getState }) => {
		const texto = getState().maestros.telas.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`maestro/tela/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`maestro/tela?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Tela eliminada' };
	}
);

export const estadoTela = createAsyncThunk(
	'maestro/tela/estadoTela',
	async (data, { rejectWithValue }) => {
		try {
			const response = await httpClient.put(`maestro/tela/estado/${data.id}`, {
				estado: data.estado,
			});

			return response.data.body;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const telasAdapter = createEntityAdapter({ selectId: tela => tela.id });

export const { selectAll: selectTelas, selectById: selectTelasById } = telasAdapter.getSelectors(
	state => state.maestros.telas
);

const TelasSlice = createSlice({
	name: 'maestros/telas',
	initialState: telasAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setTelasSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteTelasArray: (state, action) => {
			telasAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getTelas.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				telasAdapter.setAll(state, action.payload.data[0]);
			} else {
				telasAdapter.addMany(state, action.payload.data[0]);
			}

			const data = telasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						telasAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			telasAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeTelas.fulfilled]: (state, action) => {
			telasAdapter.removeMany(state, action.payload.ids);
			telasAdapter.addMany(state, action.payload.data[0]);

			const data = telasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						telasAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});
			const total = action.payload.data[1];
			state.total = total;
		},
		[estadoTela.fulfilled]: (state, action) => {
			telasAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
		},
	},
});

export const { setTelasSearchText, deleteTelasArray } = TelasSlice.actions;
export default TelasSlice.reducer;

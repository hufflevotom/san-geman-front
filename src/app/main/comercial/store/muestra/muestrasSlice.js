import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getMuestras = createAsyncThunk('comercial/muestras/getMuestras', async abc => {
	let url = `comercial/muestras?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;
	return { data, tipo: abc.tipoBusqueda };
});

export const removeMuestras = createAsyncThunk(
	'comercial/muestras/removeMuestras',
	async (target, { dispatch, getState }) => {
		const texto = getState().comercial.muestras.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`comercial/muestras/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`comercial/muestras?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Muestra eliminada' };
	}
);

export const muestrasAdapter = createEntityAdapter({ selectId: muestra => muestra.id });

export const { selectAll: selectMuestras, selectById: selectMuestrasById } =
	muestrasAdapter.getSelectors(state => state.comercial.muestras);

const MuestrasSlice = createSlice({
	name: 'comercial/muestras',
	initialState: muestrasAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setMuestrasSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteMuestraArray: (state, action) => {
			muestrasAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getMuestras.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				muestrasAdapter.setAll(state, action.payload.data[0]);
			} else {
				muestrasAdapter.addMany(state, action.payload.data[0]);
			}

			const data = muestrasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						muestrasAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			muestrasAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeMuestras.fulfilled]: (state, action) => {
			muestrasAdapter.removeMany(state, action.payload.ids);
			muestrasAdapter.addMany(
				state,
				action.payload.data[0].filter(
					element => action.payload.ids.findIndex(e => e === element.id) === -1
				)
			);

			const data = muestrasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						muestrasAdapter.updateOne(state, {
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

export const { setMuestrasSearchText, deleteMuestraArray } = MuestrasSlice.actions;
export default MuestrasSlice.reducer;

import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getSubFamilias = createAsyncThunk('maestros/subfamilias/getSubFamilias', async abc => {
	let url = `maestro/subfamilia?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;
	return { data, tipo: abc.tipoBusqueda };
});

export const removeSubFamilias = createAsyncThunk(
	'maestros/subfamilias/removeSubFamilias',
	async (target, { dispatch, getState }) => {
		const texto = getState().maestros.subfamilias.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`maestro/subfamilia/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`maestro/subfamilia?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Sub familia eliminada' };
	}
);

export const subFamiliasAdapter = createEntityAdapter({ selectId: subfamilia => subfamilia.id });

export const { selectAll: selectSubFamilias, selectById: selectSubFamilasById } =
	subFamiliasAdapter.getSelectors(state => state.maestros.subfamilias);

const SubFamiliasSlice = createSlice({
	name: 'maestros/subfamilias',
	initialState: subFamiliasAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setSubFamiliasSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteSubFamiliasArray: (state, action) => {
			subFamiliasAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getSubFamilias.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				subFamiliasAdapter.setAll(state, action.payload.data[0]);
			} else {
				subFamiliasAdapter.addMany(state, action.payload.data[0]);
			}

			const data = subFamiliasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						subFamiliasAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			subFamiliasAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeSubFamilias.fulfilled]: (state, action) => {
			subFamiliasAdapter.removeMany(state, action.payload.ids);
			subFamiliasAdapter.addMany(state, action.payload.data[0]);

			const data = subFamiliasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						subFamiliasAdapter.updateOne(state, {
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

export const { setSubFamiliasSearchText, deleteSubFamiliasArray } = SubFamiliasSlice.actions;
export default SubFamiliasSlice.reducer;

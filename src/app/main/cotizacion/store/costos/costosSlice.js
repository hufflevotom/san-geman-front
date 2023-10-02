/* eslint-disable no-restricted-syntax */
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getCostos = createAsyncThunk('cotizacion/costos/getCostos', async abc => {
	let url = `comercial/estilos/costo/estilos?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const res = await httpClient.get(url);
	const data = res.data.body;
	return { data, tipo: abc.tipoBusqueda };
});

export const costosAdapter = createEntityAdapter({
	selectId: costos => costos.id,
});

export const { selectAll: selectCostos, selectById: selectCostosById } = costosAdapter.getSelectors(
	state => state.cotizacion.costos
);

const CostosSlice = createSlice({
	name: 'cotizacion/costos',
	initialState: costosAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setCostosSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteCostosArray: (state, action) => {
			costosAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getCostos.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				costosAdapter.setAll(state, action.payload.data[0]);
			} else {
				costosAdapter.addMany(state, action.payload.data[0]);
			}

			const data = costosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						costosAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			costosAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
	},
});

export const { setCostosSearchText, deleteCostosArray } = CostosSlice.actions;
export default CostosSlice.reducer;

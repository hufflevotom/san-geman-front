/* eslint-disable no-restricted-syntax */
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getCostosAvios = createAsyncThunk(
	'cotizacion/costosAvios/getCostosAvios',
	async abc => {
		let url = `comercial/producciones?limit=${abc.limit}&offset=${abc.offset}`;

		if (abc.busqueda) {
			url += `&busqueda=${abc.busqueda}`;
		}

		const res = await httpClient.get(url);
		const data = res.data.body;
		return { data, tipo: abc.tipoBusqueda };
	}
);

export const costosAviosAdapter = createEntityAdapter({
	selectId: costosAvios => costosAvios.id,
});

export const { selectAll: selectCostosAvios, selectById: selectCostosAviosById } =
	costosAviosAdapter.getSelectors(state => state.cotizacion.costosAvios);

const CostosAviosSlice = createSlice({
	name: 'cotizacion/costosAvios',
	initialState: costosAviosAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setCostosAviosSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteCostosAviosArray: (state, action) => {
			costosAviosAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getCostosAvios.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				costosAviosAdapter.setAll(state, action.payload.data[0]);
			} else {
				costosAviosAdapter.addMany(state, action.payload.data[0]);
			}

			const data = costosAviosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						costosAviosAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			costosAviosAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
	},
});

export const { setCostosAviosSearchText, deleteCostosAviosArray } = CostosAviosSlice.actions;
export default CostosAviosSlice.reducer;

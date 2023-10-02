import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getControlFacturas = createAsyncThunk(
	'logistica/control-factura/getControlFacturas',
	async model => {
		let url = `logistica/control-factura?limit=${model.limit}&offset=${model.offset}`;

		if (model.busqueda) {
			url += `&busqueda=${model.busqueda}`;
		}

		const response = await httpClient.get(url);
		const data = await response.data.body;

		return { data, tipo: model.tipoBusqueda };
	}
);

export const removeControlFacturas = createAsyncThunk(
	'logistica/control-factura/removeControlFacturas',
	async (target, { dispatch, getState }) => {
		const texto = getState().logistica.controlFacturas.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`logistica/control-factura/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`logistica/control-factura?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Factura eliminada' };
	}
);

export const controlFacturasAdapter = createEntityAdapter({
	selectId: controlFacturas => controlFacturas.id,
});

export const { selectAll: selectControlFacturas, selectById: selectControlFacturasById } =
	controlFacturasAdapter.getSelectors(state => state.logistica.controlFacturas);

const ControlFacturasSlice = createSlice({
	name: 'logistica/control-factura',
	initialState: controlFacturasAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setControlFacturasSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteControlFacturasArray: (state, action) => {
			controlFacturasAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getControlFacturas.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				controlFacturasAdapter.setAll(state, action.payload.data[0]);
			} else {
				controlFacturasAdapter.addMany(state, action.payload.data[0]);
			}

			const data = controlFacturasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						controlFacturasAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			controlFacturasAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeControlFacturas.fulfilled]: (state, action) => {
			controlFacturasAdapter.removeMany(state, action.payload.ids);
			controlFacturasAdapter.addMany(state, action.payload.data[0]);

			const data = controlFacturasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						controlFacturasAdapter.updateOne(state, {
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

export const { setControlFacturasSearchText, deleteControlFacturasArray } =
	ControlFacturasSlice.actions;
export default ControlFacturasSlice.reducer;

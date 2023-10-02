import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getVehiculos = createAsyncThunk('logistica/vehiculos/getVehiculos', async model => {
	let url = `logistica/vehiculos?limit=${model.limit}&offset=${model.offset}`;

	if (model.busqueda) {
		url += `&busqueda=${model.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;

	return { data, tipo: model.tipoBusqueda };
});

export const removeVehiculo = createAsyncThunk(
	'logistica/vehiculos/removeVehiculo',
	async (target, { dispatch, getState }) => {
		const texto = getState().logistica.vehiculos.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`logistica/vehiculos/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`logistica/vehiculos?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Vehiculo eliminado' };
	}
);

export const vehiculosAdapter = createEntityAdapter({
	selectId: vehiculos => vehiculos.id,
});

export const { selectAll: selectVehiculos, selectById: selectVehiculosById } =
	vehiculosAdapter.getSelectors(state => state.logistica.vehiculos);

const VehiculosSlice = createSlice({
	name: 'logistica/vehiculos',
	initialState: vehiculosAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setVehiculosSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteVehiculosArray: (state, action) => {
			vehiculosAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getVehiculos.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				vehiculosAdapter.setAll(state, action.payload.data[0]);
			} else {
				vehiculosAdapter.addMany(state, action.payload.data[0]);
			}

			const data = vehiculosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						vehiculosAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			vehiculosAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeVehiculo.fulfilled]: (state, action) => {
			vehiculosAdapter.removeMany(state, action.payload.ids);
			vehiculosAdapter.addMany(state, action.payload.data[0]);

			const data = vehiculosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						vehiculosAdapter.updateOne(state, {
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

export const { setVehiculosSearchText, deleteVehiculosArray } = VehiculosSlice.actions;
export default VehiculosSlice.reducer;

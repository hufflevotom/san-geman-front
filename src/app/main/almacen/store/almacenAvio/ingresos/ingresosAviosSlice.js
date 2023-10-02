import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getIngresos = createAsyncThunk('almacen/almacen-avios/getIngresos', async abc => {
	let url = `almacen-avio/ingreso?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;
	console.log('dataaaa: ', data);
	return { data, tipo: abc.tipoBusqueda };
});

export const removeAlmacenAvios = createAsyncThunk(
	'almacen/almacen-avios/removeAlmacenAvios',
	async (target, { dispatch, getState }) => {
		const texto = getState().almacen.almacenAvios.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`almacen/almacen-avios/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`almacen/almacen-avios?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Fila eliminada' };
	}
);

export const anularIngreso = createAsyncThunk(
	'almacen/almacen-avios/anularIngreso',
	async (target, { dispatch, getState }) => {
		const texto = getState().almacen.ingresos.searchText;
		const dataBody = await httpClient.put(`almacen-avio/ingreso/anular/${target.id}`);
		const response = await httpClient.get(
			`almacen-avio/ingreso?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);

		const data = await response.data.body;
		return { data, id: target.id };
	}
);

export const ingresosAviosAdapter = createEntityAdapter({ selectId: ingreso => ingreso.id });

export const { selectAll: selectIngresosAvios, selectById: selectIngresosAviosById } =
	ingresosAviosAdapter.getSelectors(state => state.almacen.ingresosAvio);

const IngresosAviosSlice = createSlice({
	name: 'almacen/ingresos',
	initialState: ingresosAviosAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		resetTabla: () =>
			ingresosAviosAdapter.getInitialState({
				total: 0,
				searchText: '',
				maxPage: 0,
			}),
		setIngresosAviosSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteIngresosAviosArray: (state, action) => {
			ingresosAviosAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getIngresos.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				ingresosAviosAdapter.setAll(state, action.payload.data[0]);
			} else {
				ingresosAviosAdapter.addMany(state, action.payload.data[0]);
			}

			const data = ingresosAviosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						ingresosAviosAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			ingresosAviosAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeAlmacenAvios.fulfilled]: (state, action) => {
			ingresosAviosAdapter.removeMany(state, action.payload.ids);
			ingresosAviosAdapter.addMany(state, action.payload.data[0]);

			const data = ingresosAviosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						ingresosAviosAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});
			const total = action.payload.data[1];
			state.total = total;
		},

		[anularIngreso.fulfilled]: (state, action) => {
			ingresosAviosAdapter.removeOne(state, action.payload.id);
			ingresosAviosAdapter.addMany(state, action.payload.data[0]);

			const data = ingresosAviosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						ingresosAviosAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			// ingresosAviosAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
	},
});

export const { resetTabla, setIngresosAviosSearchText, deleteIngresosAviosArray } =
	IngresosAviosSlice.actions;
export default IngresosAviosSlice.reducer;

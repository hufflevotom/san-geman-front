import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getIngresos = createAsyncThunk('almacen/almacen-telas/getIngresos', async abc => {
	let url = `almacen-tela/ingreso?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;
	console.log('dataaaa: ', data);
	return { data, tipo: abc.tipoBusqueda };
});

export const removeAlmacenTelas = createAsyncThunk(
	'almacen/almacen-telas/removeAlmacenTelas',
	async (target, { dispatch, getState }) => {
		const texto = getState().almacen.almacenTelas.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`almacen/almacen-telas/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`almacen/almacen-telas?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Fila eliminada' };
	}
);

export const anularIngreso = createAsyncThunk(
	'almacen/almacen-telas/anularIngreso',
	async (target, { dispatch, getState }) => {
		const texto = getState().almacen.ingresos.searchText;
		const dataBody = await httpClient.put(`almacen-tela/ingreso/anular/${target.id}`);
		const response = await httpClient.get(
			`almacen-tela/ingreso?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);

		const data = await response.data.body;
		return { data, id: target.id };
	}
);

export const ingresosTelasAdapter = createEntityAdapter({ selectId: ingreso => ingreso.id });

export const { selectAll: selectIngresosTelas, selectById: selectIngresosTelasById } =
	ingresosTelasAdapter.getSelectors(state => state.almacen.ingresos);

const IngresosTelasSlice = createSlice({
	name: 'almacen/ingresos',
	initialState: ingresosTelasAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		resetTabla: () =>
			ingresosTelasAdapter.getInitialState({
				total: 0,
				searchText: '',
				maxPage: 0,
			}),
		setIngresosTelasSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteIngresosTelasArray: (state, action) => {
			ingresosTelasAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getIngresos.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				ingresosTelasAdapter.setAll(state, action.payload.data[0]);
			} else {
				ingresosTelasAdapter.addMany(state, action.payload.data[0]);
			}

			const data = ingresosTelasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						ingresosTelasAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			ingresosTelasAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeAlmacenTelas.fulfilled]: (state, action) => {
			ingresosTelasAdapter.removeMany(state, action.payload.ids);
			ingresosTelasAdapter.addMany(state, action.payload.data[0]);

			const data = ingresosTelasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						ingresosTelasAdapter.updateOne(state, {
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
			ingresosTelasAdapter.removeOne(state, action.payload.id);
			ingresosTelasAdapter.addMany(state, action.payload.data[0]);

			const data = ingresosTelasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						ingresosTelasAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			// ingresosTelasAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
	},
});

export const { resetTabla, setIngresosTelasSearchText, deleteIngresosTelasArray } =
	IngresosTelasSlice.actions;
export default IngresosTelasSlice.reducer;

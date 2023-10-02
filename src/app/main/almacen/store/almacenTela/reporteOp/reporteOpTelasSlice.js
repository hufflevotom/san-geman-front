import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getReporteOp = createAsyncThunk('almacen/almacen-telas/getReporteOp', async abc => {
	let url = `comercial/producciones?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;

	return { data, tipo: abc.tipoBusqueda };
});

export const reporteOpTelasAdapter = createEntityAdapter({
	selectId: reporteOpTela => reporteOpTela.id,
});

export const { selectAll: selectReporteOpTelas, selectById: selectReporteOpTelasById } =
	reporteOpTelasAdapter.getSelectors(state => state.almacen.reporteOp);

const ReporteOpTelasSlice = createSlice({
	name: 'almacen/reporteOpTela',
	initialState: reporteOpTelasAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		resetTabla: () =>
			reporteOpTelasAdapter.getInitialState({
				total: 0,
				searchText: '',
				maxPage: 0,
			}),
		setReporteOpTelasSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteReporteOpTelasArray: (state, action) => {
			reporteOpTelasAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getReporteOp.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				reporteOpTelasAdapter.setAll(state, action.payload.data[0]);
			} else {
				reporteOpTelasAdapter.addMany(state, action.payload.data[0]);
			}

			const data = reporteOpTelasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						reporteOpTelasAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			reporteOpTelasAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
	},
});

export const { resetTabla, setReporteOpTelasSearchText, deleteReporteOpTelasArray } =
	ReporteOpTelasSlice.actions;
export default ReporteOpTelasSlice.reducer;

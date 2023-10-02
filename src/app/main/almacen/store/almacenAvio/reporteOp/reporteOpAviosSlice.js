import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getReporteOp = createAsyncThunk('almacen/almacen-avios/getReporteOp', async abc => {
	let url = `comercial/producciones?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;

	return { data, tipo: abc.tipoBusqueda };
});

export const reporteOpAviosAdapter = createEntityAdapter({
	selectId: reporteOpAvio => reporteOpAvio.id,
});

export const { selectAll: selectReporteOpAvios, selectById: selectReporteOpAviosById } =
	reporteOpAviosAdapter.getSelectors(state => state.almacen.reporteOpAvio);

const ReporteOpAviosSlice = createSlice({
	name: 'almacen/reporteOpAvio',
	initialState: reporteOpAviosAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		resetTabla: () =>
			reporteOpAviosAdapter.getInitialState({
				total: 0,
				searchText: '',
				maxPage: 0,
			}),
		setReporteOpAviosSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteReporteOpAviosArray: (state, action) => {
			reporteOpAviosAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getReporteOp.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				reporteOpAviosAdapter.setAll(state, action.payload.data[0]);
			} else {
				reporteOpAviosAdapter.addMany(state, action.payload.data[0]);
			}

			const data = reporteOpAviosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						reporteOpAviosAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			reporteOpAviosAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
	},
});

export const { resetTabla, setReporteOpAviosSearchText, deleteReporteOpAviosArray } =
	ReporteOpAviosSlice.actions;
export default ReporteOpAviosSlice.reducer;

import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getManufacturas = createAsyncThunk(
	'calidad/manufacturas/getManufacturas',
	async abc => {
		let url = `calidad/manufacturas?limit=${abc.limit}&offset=${abc.offset}`;

		if (abc.busqueda) {
			url += `&busqueda=${abc.busqueda}`;
		}

		const response = await httpClient.get(url);
		const data = await response.data.body;
		return { data, tipo: abc.tipoBusqueda };
	}
);

export const removeManufacturas = createAsyncThunk(
	'calidad/manufacturas/removeManufacturas',
	async (target, { dispatch, getState }) => {
		const texto = getState().calidad.manufacturas.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`calidad/manufacturas/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`calidad/manufacturas?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Manufactura eliminado' };
	}
);

export const manufacturasAdapter = createEntityAdapter({ selectId: manufactura => manufactura.id });

export const { selectAll: selectManufacturas, selectById: selectManufacturasById } =
	manufacturasAdapter.getSelectors(state => state.calidad.manufacturas);

const ManufacturasSlice = createSlice({
	name: 'calidad/manufacturas',
	initialState: manufacturasAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setManufacturasSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteManufacturasArray: (state, action) => {
			manufacturasAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getManufacturas.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				manufacturasAdapter.setAll(state, action.payload.data[0]);
			} else {
				manufacturasAdapter.addMany(state, action.payload.data[0]);
			}

			const data = manufacturasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						manufacturasAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			manufacturasAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeManufacturas.fulfilled]: (state, action) => {
			manufacturasAdapter.removeMany(state, action.payload.ids);
			manufacturasAdapter.addMany(state, action.payload.data[0]);

			const data = manufacturasAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						manufacturasAdapter.updateOne(state, {
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

export const { setManufacturasSearchText, deleteManufacturasArray } = ManufacturasSlice.actions;
export default ManufacturasSlice.reducer;

import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getProveedores = createAsyncThunk(
	'comercial/proveedores/getProveedores',
	async abc => {
		let url = `comercial/proveedores?limit=${abc.limit}&offset=${abc.offset}`;

		if (abc.busqueda) {
			url += `&busqueda=${abc.busqueda}`;
		}

		const response = await httpClient.get(url);
		const data = await response.data.body;
		return { data, tipo: abc.tipoBusqueda };
	}
);

export const removeProveedores = createAsyncThunk(
	'comercial/proveedores/removeProveedores',
	async (target, { dispatch, getState }) => {
		const texto = getState().comercial.proveedores.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`comercial/proveedores/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`comercial/proveedores?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Proveedor eliminado' };
	}
);

export const proveedoresAdapter = createEntityAdapter({ selectId: proveedor => proveedor.id });

export const { selectAll: selectProveedores, selectById: selectProveedoresById } =
	proveedoresAdapter.getSelectors(state => state.comercial.proveedores);

const ProveedoresSlice = createSlice({
	name: 'comercial/proveedores',
	initialState: proveedoresAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setProveedoresSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteProveedorArray: (state, action) => {
			proveedoresAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getProveedores.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				proveedoresAdapter.setAll(state, action.payload.data[0]);
			} else {
				proveedoresAdapter.addMany(state, action.payload.data[0]);
			}

			const data = proveedoresAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						proveedoresAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			proveedoresAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeProveedores.fulfilled]: (state, action) => {
			proveedoresAdapter.removeMany(state, action.payload.ids);
			proveedoresAdapter.addMany(state, action.payload.data[0]);

			const data = proveedoresAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						proveedoresAdapter.updateOne(state, {
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

export const { setProveedoresSearchText, deleteProveedorArray } = ProveedoresSlice.actions;
export default ProveedoresSlice.reducer;

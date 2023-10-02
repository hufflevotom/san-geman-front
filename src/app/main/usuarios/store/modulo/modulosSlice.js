import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getModulos = createAsyncThunk('auth/getModulos', async abc => {
	let url = `modulos?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;
	return { data, tipo: abc.tipoBusqueda };
});

export const removeModulos = createAsyncThunk(
	'auth/removeModulos',
	async (target, { dispatch, getState }) => {
		const texto = getState().configuraciones.unidades.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`modulos/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`modulos?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Módulo eliminado' };
	}
);

export const modulosAdapter = createEntityAdapter({ selectId: modulo => modulo.id });

export const { selectAll: selectModulos, selectById: selectModulosById } =
	modulosAdapter.getSelectors(state => state.usuarios.modulos);

const ModulosSlice = createSlice({
	name: 'auth',
	initialState: modulosAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {},
	extraReducers: {
		[getModulos.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				modulosAdapter.setAll(state, action.payload.data[0]);
			} else {
				modulosAdapter.addMany(state, action.payload.data[0]);
			}

			const data = modulosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						modulosAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			modulosAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeModulos.fulfilled]: (state, action) => {
			modulosAdapter.removeMany(state, action.payload.ids);
			modulosAdapter.addMany(state, action.payload.data[0]);

			const data = modulosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						modulosAdapter.updateOne(state, {
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

export default ModulosSlice.reducer;

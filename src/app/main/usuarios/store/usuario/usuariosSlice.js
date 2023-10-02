import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getUsuarios = createAsyncThunk('usuarios/getUsuarios', async abc => {
	let url = `usuarios?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;
	return { data, tipo: abc.tipoBusqueda };
});

export const removeUsuarios = createAsyncThunk(
	'usuarios/removeUsuarios',
	async (target, { dispatch, getState }) => {
		const texto = getState().usuarios.usuarios.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`usuarios/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`usuarios?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Usuario eliminado' };
	}
);

export const usuariosAdapter = createEntityAdapter({ selectId: usuario => usuario.id });

export const { selectAll: selectUsuarios, selectById: selectUsuariosById } =
	usuariosAdapter.getSelectors(state => state.usuarios.usuarios);

const UsuariosSlice = createSlice({
	name: 'usuarios',
	initialState: usuariosAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setUsuariosSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteUsuariosArray: (state, action) => {
			usuariosAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getUsuarios.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				usuariosAdapter.setAll(state, action.payload.data[0]);
			} else {
				usuariosAdapter.addMany(state, action.payload.data[0]);
			}

			const data = usuariosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						usuariosAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});
			usuariosAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeUsuarios.fulfilled]: (state, action) => {
			usuariosAdapter.removeMany(state, action.payload.ids);
			usuariosAdapter.addMany(state, action.payload.data[0]);

			const data = usuariosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						usuariosAdapter.updateOne(state, {
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

export const { setUsuariosSearchText, deleteUsuariosArray } = UsuariosSlice.actions;
export default UsuariosSlice.reducer;

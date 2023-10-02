import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getRoles = createAsyncThunk('roles/getRoles', async abc => {
	let url = `auth/roles?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;
	return { data, tipo: abc.tipoBusqueda };
});

export const removeRoles = createAsyncThunk(
	'roles/removeRoles',
	async (target, { dispatch, getState }) => {
		const texto = getState().usuarios.roles.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`auth/roles/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`auth/roles?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Rol eliminado' };
	}
);

export const rolesAdapter = createEntityAdapter({ selectId: rol => rol.id });

export const { selectAll: selectRoles, selectById: selectRolesById } = rolesAdapter.getSelectors(
	state => state.usuarios.roles
);

const RolesSlice = createSlice({
	name: 'roles',
	initialState: rolesAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setRolesSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteRolesArray: (state, action) => {
			rolesAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getRoles.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				rolesAdapter.setAll(state, action.payload.data[0]);
			} else {
				rolesAdapter.addMany(state, action.payload.data[0]);
			}

			const data = rolesAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						rolesAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			rolesAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
		[removeRoles.fulfilled]: (state, action) => {
			rolesAdapter.removeMany(state, action.payload.ids);
			rolesAdapter.addMany(state, action.payload.data[0]);

			const data = rolesAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						rolesAdapter.updateOne(state, {
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

export const { setRolesSearchText, deleteRolesArray } = RolesSlice.actions;
export default RolesSlice.reducer;

import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getNotificaciones = createAsyncThunk('notificaciones/getNotificaciones', async () => {
	const url = `notificaciones`;

	const response = await httpClient.get(url);
	console.log(response);
	const data = await response.data;
	return { data };
});

export const removeNotificaciones = createAsyncThunk(
	'notificaciones/removeNotificaciones',
	async (target, { dispatch, getState }) => {
		const texto = getState().usuarios.notificaciones.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`auth/notificaciones/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`auth/notificaciones?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Notificacion eliminado' };
	}
);

export const notificacionesAdapter = createEntityAdapter({
	selectId: notificacion => notificacion.id,
});

export const { selectAll: selectNotificaciones, selectById: selectNotificacionesById } =
	notificacionesAdapter.getSelectors(state => state.usuarios.notificaciones);

const NotificacionesSlice = createSlice({
	name: 'notificaciones',
	initialState: notificacionesAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setNotificacionesSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteNotificacionesArray: (state, action) => {
			notificacionesAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getNotificaciones.fulfilled]: (state, action) => {
			notificacionesAdapter.addMany(state, action.payload.data);

			notificacionesAdapter.sortComparer = true;
			const total = action.payload.data.length;
			state.total = total;
		},
		[removeNotificaciones.fulfilled]: (state, action) => {
			notificacionesAdapter.removeMany(state, action.payload.ids);
			notificacionesAdapter.addMany(state, action.payload.data[0]);

			const data = notificacionesAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						notificacionesAdapter.updateOne(state, {
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

export const { setNotificacionesSearchText, deleteNotificacionesArray } =
	NotificacionesSlice.actions;
export default NotificacionesSlice.reducer;

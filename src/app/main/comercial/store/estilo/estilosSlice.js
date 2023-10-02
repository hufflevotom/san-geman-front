import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getEstilos = createAsyncThunk('comercial/estilos/getEstilos', async abc => {
	let url = `comercial/estilos?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);
	const data = await response.data.body;
	console.log('URL: ', data);

	return { data, tipo: abc.tipoBusqueda };
});

export const removeEstilos = createAsyncThunk(
	'comercial/estilos/removeEstilos',
	async (target, { dispatch, getState }) => {
		const texto = getState().comercial.estilos.searchText;
		const promesas = [];
		target.ids.forEach(async id => {
			httpClient.delete(`comercial/estilos/${id}`);
		});
		await Promise.all(promesas);

		const response = await httpClient.get(
			`comercial/estilos?limit=${target.limit}&offset=${target.offset}&busqueda=${texto}`
		);
		const data = await response.data.body;
		return { data, ids: target.ids, message: 'Estilo eliminado' };
	}
);

export const estilosAdapter = createEntityAdapter({ selectId: estilo => estilo.id });

export const { selectAll: selectEstilos, selectById: selectEstilosById } =
	estilosAdapter.getSelectors(state => state.comercial.estilos);

const EstilosSlice = createSlice({
	name: 'comercial/estilos',
	initialState: estilosAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setEstilosSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteEstilosArray: (state, action) => {
			estilosAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getEstilos.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				estilosAdapter.setAll(state, action.payload.data[0]);
			} else {
				estilosAdapter.addMany(state, action.payload.data[0]);
			}

			const data = estilosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						estilosAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			estilosAdapter.sortComparer = true;
			const total = action.payload.data[1];
			console.log('TOTAL ADAPTER 1 :', total);
			state.total = total;
		},
		[removeEstilos.fulfilled]: (state, action) => {
			estilosAdapter.removeMany(state, action.payload.ids);
			estilosAdapter.addMany(
				state,
				action.payload.data[0].filter(
					element => action.payload.ids.findIndex(e => e === element.id) === -1
				)
			);

			const data = estilosAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						estilosAdapter.updateOne(state, {
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

export const { setEstilosSearchText, deleteEstilosArray } = EstilosSlice.actions;
export default EstilosSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const ResumenPedidoSlice = createSlice({
	name: 'comercial/pedidos/resumen',
	initialState: {
		dataAvios: {},
		dataAviosResumen: [],
	},
	reducers: {
		setDataAvios: {
			reducer: (state, action) => {
				state.dataAvios = action.payload;
			},
		},
		setDataAviosResumen: {
			reducer: (state, action) => {
				state.dataAviosResumen = action.payload;
			},
		},
	},
	extraReducers: {},
});

export const { setDataAvios, setDataAviosResumen } = ResumenPedidoSlice.actions;
export default ResumenPedidoSlice.reducer;

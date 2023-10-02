import { createSlice } from '@reduxjs/toolkit';

const HelpersSlice = createSlice({
	name: 'helpers',
	initialState: {
		loading: false,
	},
	reducers: {
		setPedidoLoading: {
			reducer: (state, action) => {
				state.loading = action.payload;
			},
		},
	},
	extraReducers: {},
});

export const { setPedidoLoading } = HelpersSlice.actions;
export default HelpersSlice.reducer;

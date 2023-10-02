import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getRoles = createAsyncThunk('auth/roles', async () => {
	const response = await httpClient.get('auth/roles?limit=1000&offset=0');
	const data = await response.data.body;
	return data;
});

const RolesSlice = createSlice({
	name: 'auth/roles',
	initialState: null,
	reducers: {},
	extraReducers: {
		[getRoles.fulfilled]: (state, action) => action.payload,
	},
});

export default RolesSlice.reducer;

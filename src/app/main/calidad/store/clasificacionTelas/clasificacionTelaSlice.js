/* eslint-disable import/prefer-default-export */
import { createAsyncThunk } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const cambioClasificacion = createAsyncThunk(
	'calidad/clasificacion/cambioClasificacion',
	async (abc, { rejectWithValue }) => {
		try {
			const url = `almacen-tela/kardex/clasificacion`;
			const response = await httpClient.put(url, abc);
			return await response.data.body;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

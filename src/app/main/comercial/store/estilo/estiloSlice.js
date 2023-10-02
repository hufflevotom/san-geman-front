/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const createEstilo = createAsyncThunk(
	'comercial/estilo/postEstilo',
	async (obj, { rejectWithValue }) => {
		try {
			const { data } = obj;
			const { archivos } = obj;
			const { imagenes } = obj;

			const response = await httpClient.post('comercial/estilos', data);
			const datita = await response.data.body;

			const arrayEstampados = imagenes.imagenesEstampados;
			const estampadosResponse = datita.estampados;

			const arrayBordados = imagenes.imagenesBordados;
			const bordadosResponse = datita.bordados;

			const arrayReferenciales = imagenes.imagenesReferenciales;
			const referencialesResponse = datita.imagenesOpcionales;

			if (arrayEstampados.length > 0) {
				const filtroE = estampadosResponse.map(element => {
					const estampado = arrayEstampados.find(
						element2 =>
							element.tipo === element2.tipo &&
							element.nombre === element2.nombre &&
							element.descripcion === element2.descripcion &&
							(element.color ? element.color.id === element2.colorId : true)
					);

					const objRet = { ...element };

					if (estampado) {
						objRet.file = estampado.file ? estampado.file : null;
					}

					return objRet;
				});

				// eslint-disable-next-line no-restricted-syntax
				for (const f of filtroE) {
					if (f.file) {
						const formData = new FormData();
						formData.append('imagen', f.file);

						// eslint-disable-next-line no-await-in-loop
						const respuesta = await httpClient.put(
							`comercial/estilos/estampado/${f.id}`,
							formData,
							{
								'Content-Type': 'multipart/form-data',
							}
						);
					}
				}
			}

			if (arrayBordados.length > 0) {
				const filtroB = bordadosResponse.map(element => {
					const bordado = arrayBordados.find(
						element2 =>
							element.tipo === element2.tipo &&
							element.nombre === element2.nombre &&
							element.descripcion === element2.descripcion &&
							(element.color ? element.color.id === element2.colorId : true)
					);

					const objRet = { ...element };

					if (bordado) {
						objRet.file = bordado.file ? bordado.file : null;
					}

					return objRet;
				});

				// eslint-disable-next-line no-restricted-syntax
				for (const f of filtroB) {
					if (f.file) {
						const formData = new FormData();
						formData.append('imagen', f.file);

						// eslint-disable-next-line no-await-in-loop
						await httpClient.put(`comercial/estilos/bordado/${f.id}`, formData, {
							'Content-Type': 'multipart/form-data',
						});
					}
				}
			}

			if (arrayReferenciales.length > 0) {
				const filtroR = referencialesResponse.map(element => {
					const imgRef = arrayReferenciales.find(element2 => element.colorId === element2.colorId);

					const objRet = { ...element };
					if (imgRef) {
						objRet.file = imgRef.file ? imgRef.file : null;
					}

					return objRet;
				});
				// eslint-disable-next-line no-restricted-syntax
				for (const f of filtroR) {
					if (f.file) {
						const formData = new FormData();
						formData.append('imagen', f.file);

						// eslint-disable-next-line no-await-in-loop
						await httpClient.put(`comercial/estilos/imagenOpcional/${f.id}`, formData, {
							'Content-Type': 'multipart/form-data',
						});
					}
				}
			}

			if (archivos.imagen) {
				const formData = new FormData();
				formData.append('imagen', archivos.imagen.file);
				await httpClient.put(`comercial/estilos/archivos/${datita.id}`, formData);
			}

			if (archivos.fichaTecnica) {
				const formData = new FormData();
				formData.append('fichaTecnica', archivos.fichaTecnica.file);
				await httpClient.put(`comercial/estilos/archivos/${datita.id}`, formData);
			}

			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const getEstiloId = createAsyncThunk('comercial/estilo/getEstiloId', async id => {
	const response = await httpClient.get(`comercial/estilos/${id}`);
	const data = await response.data.body;
	/* console.log('datita x id:', data); */

	if (data.estampados.length > 0) {
		data.banderaEstampado = true;
		data.estampados.forEach(e => {
			if (e.color) {
				const objColor = { ...e.color, label: e.color.descripcion };
				e.color = objColor;
			}
		});
	} else {
		data.banderaEstampado = false;
	}

	if (data.imagenesOpcionales.length > 0) {
		data.banderaImagenReferencial = true;
		const arrayColores = [];
		data.imagenesOpcionales.forEach(e => {
			const oldColor = data.telaPrincipal.colores.find(c => c.id === e.colorId);
			if (oldColor)
				arrayColores.push({ ...oldColor, urlImagen: e.urlImagen, idImagenOpcional: e.id });
		});
		data.imagenesReferenciales = arrayColores;
		// data.imagenesReferenciales = data.imagenesOpcionales;
	} else {
		data.banderaImagenReferencial = false;
	}

	if (data.bordados.length > 0) {
		data.banderaBordados = true;
		data.bordados.forEach(e => {
			if (e.color) {
				const objColor = { ...e.color, label: e.color.descripcion };
				e.color = objColor;
			}
		});
	} else {
		data.banderaBordados = false;
	}

	if (data.telasComplemento.length > 0) {
		data.banderaTelaComplemento = true;
		data.telasComplemento.forEach(e => {
			const arrColores = [];
			if (e.coloresRelacionados) {
				data.telaPrincipal.colores.forEach(c => {
					if (e.coloresRelacionados.findIndex(c2 => c2 === c.id) !== -1) {
						arrColores.push({ ...c });
					}
				});
				e.coloresRelacionados = arrColores;
			}
		});
	} else {
		data.banderaTelaComplemento = false;
	}

	// if (data.tipoAcabado) {
	// 	data.tipoAcabado = JSON.parse(data.tipoAcabado);

	// 	if (data.tipoAcabado.length > 0) {
	// 		data.banderaLavanderia = true;
	// 	} else {
	// 		data.banderaLavanderia = false;
	// 	}
	// }
	if (data.lavados) {
		if (data.lavados.length > 0) {
			data.banderaLavanderia = true;
		} else {
			data.banderaLavanderia = false;
		}
		data.lavados.forEach(element => {
			element.label = element.descripcion;
		});
	}

	console.log('GET ESTILO X ID: ', data);

	return data;
});

export const updateEstilo = createAsyncThunk(
	'comercial/estilo/putEstilo',
	async (obj, { rejectWithValue }) => {
		try {
			const { data } = obj;
			const { archivos } = obj;
			const { imagenes } = obj;

			const response = await httpClient.put(`comercial/estilos/${data.id}`, data);
			const datita = await response.data.body;

			const arrayEstampados = imagenes.imagenesEstampados;
			const estampadosResponse = datita.estampados;

			const arrayBordados = imagenes.imagenesBordados;
			const bordadosResponse = datita.bordados;

			const arrayReferenciales = imagenes.imagenesReferenciales;
			const referencialesResponse = datita.imagenesOpcionales;

			if (arrayEstampados.length > 0) {
				const filtroE = estampadosResponse.map(element => {
					const estampado = arrayEstampados.find(
						element2 =>
							element.tipo === element2.tipo &&
							element.nombre === element2.nombre &&
							element.descripcion === element2.descripcion &&
							(element.color ? element.color.id === element2.colorId : true)
					);

					const objRet = { ...element };

					if (estampado) {
						objRet.file = estampado.file ? estampado.file : null;
					}

					return objRet;
				});
				console.log('filtroE: ', filtroE);
				for (const f of filtroE) {
					if (f.file) {
						const formData = new FormData();
						formData.append('imagen', f.file);
						await httpClient.put(`comercial/estilos/estampado/${f.id}`, formData, {
							'Content-Type': 'multipart/form-data',
						});
					}
				}
			}

			if (arrayBordados.length > 0) {
				const filtroB = bordadosResponse.map(element => {
					const bordado = arrayBordados.find(
						element2 =>
							element.tipo === element2.tipo &&
							element.nombre === element2.nombre &&
							element.descripcion === element2.descripcion &&
							(element.color ? element.color.id === element2.colorId : true)
					);
					const objRet = { ...element };

					if (bordado) {
						objRet.file = bordado.file ? bordado.file : null;
					}
					return objRet;
				});
				console.log('filtroB: ', filtroB);
				for (const f of filtroB) {
					if (f.file) {
						const formData = new FormData();
						formData.append('imagen', f.file);
						await httpClient.put(`comercial/estilos/bordado/${f.id}`, formData, {
							'Content-Type': 'multipart/form-data',
						});
					}
				}
			}

			if (arrayReferenciales.length > 0) {
				const filtroR = referencialesResponse.map(element => {
					const imgRef = arrayReferenciales.find(element2 => element.colorId === element2.colorId);

					const objRet = { ...element };
					if (imgRef) {
						objRet.file = imgRef.file ? imgRef.file : null;
					}

					return objRet;
				});
				// eslint-disable-next-line no-restricted-syntax
				for (const f of filtroR) {
					if (f.file) {
						const formData = new FormData();
						formData.append('imagen', f.file);

						// eslint-disable-next-line no-await-in-loop
						await httpClient.put(`comercial/estilos/imagenOpcional/${f.id}`, formData, {
							'Content-Type': 'multipart/form-data',
						});
					}
				}
			}

			/* if (archivos.imagen.file || archivos.fichaTecnica.file) {
		const formData = new FormData();
		formData.append('imagen', archivos.imagen.file);
		formData.append('fichaTecnica', archivos.fichaTecnica.file);

		await httpClient.put(`comercial/estilos/archivos/${datita.id}`, formData);
	} */

			if (archivos.imagen && archivos.imagen.file) {
				const formData = new FormData();
				formData.append('imagen', archivos.imagen.file);
				await httpClient.put(`comercial/estilos/archivos/${datita.id}`, formData);
			}

			if (archivos.fichaTecnica && archivos.fichaTecnica.file) {
				const formData = new FormData();
				formData.append('fichaTecnica', archivos.fichaTecnica.file);
				await httpClient.put(`comercial/estilos/archivos/${datita.id}`, formData);
			}

			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteEstilo = createAsyncThunk(
	'comercial/estilo/deleteEstilo',
	async (val, { dispatch, getState, rejectWithValue }) => {
		try {
			const { id } = getState().comercial.estilo;
			const response = await httpClient.delete(`comercial/estilos/${id}`);
			return response.data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response.data);
		}
	}
);

const EstiloSlice = createSlice({
	name: 'comercial/estilo',
	initialState: null,
	reducers: {
		resetEstilo: () => null,
		newEstilo: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					estilo: '',
					nombre: '',
					tipoAcabado: null,
					imagenEstiloUrl: null,
					fichaTecnicaUrl: null,
					activo: true,
					prenda: null,
					estampados: [],
					bordados: [],
					telaPrincipal: null,
					telasComplemento: [],
					rutasEstilos: [],
					banderaTelaComplemento: false,
					banderaEstampado: false,
					banderaBordados: false,
					banderaLavanderia: false,
					avios: [],
				},
			}),
		},
	},
	extraReducers: {
		[getEstiloId.fulfilled]: (state, action) => action.payload,
		[createEstilo.fulfilled]: (state, action) => action.payload,
		[updateEstilo.fulfilled]: (state, action) => action.payload,
		[deleteEstilo.fulfilled]: (state, action) => null,
	},
});

export const { newEstilo, resetEstilo } = EstiloSlice.actions;
export default EstiloSlice.reducer;

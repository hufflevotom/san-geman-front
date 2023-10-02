/* eslint-disable no-nested-ternary */
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import httpClient from 'utils/Api';

export const getEstadosOp = createAsyncThunk('reporte/estados-op/getEstadosOp', async abc => {
	let url = `comercial/registros-op?limit=${abc.limit}&offset=${abc.offset}`;

	if (abc.busqueda) {
		url += `&busqueda=${abc.busqueda}`;
	}

	const response = await httpClient.get(url);

	const data = await response.data.body;
	data[0].forEach(produccion => {
		//* Agrega las telas principales
		const array = agregarTelasPrincipales(produccion.produccion.pedidos);

		//* Agrega las telas complemento
		const arrTelas = agregarTelasComplemento(produccion.produccion.pedidos, array);

		//* Calculo de cantidades
		const cantidades = calcularCantidadesPrincipales(produccion.produccion.pedidos, arrTelas);

		//* Calculo de cantidades de telas complementarias
		const cantidadesComplemento = calcularCantidadesComplemento(
			produccion.produccion.pedidos,
			cantidades
		);

		//* Sumar data repetida del array
		const arrayUnique = sumarDataRepetida(cantidadesComplemento);

		//* Restar ordenes y asignaciones
		const arrResta = restarOrdenesAsignaciones(arrayUnique, produccion.produccion);

		produccion.porcentajeOC = obtenerPorcentajeOC(arrResta).toFixed(2);
		produccion.porcentajeIngresos = obtenerPorcentajeIngresos(
			produccion.produccion.ordenCompraTelas,
			produccion.registrosIngresoAlmacenTela
		).toFixed(2);
	});

	return { data, tipo: abc.tipoBusqueda };
});

const agregarTelasPrincipales = dataEstilos => {
	const array = [];

	dataEstilos.forEach(dataEstilo => {
		dataEstilo.estilos.forEach(estilo => {
			const qty = dataEstilo.totalCantidades
				.filter(
					cantidad => cantidad.totalCantidadPorcentaje > 0 && cantidad.estilo.id === estilo.id
				)
				.map(cantidad => cantidad.color.id);
			estilo.telasEstilos.forEach(tela => {
				tela.colores.forEach(color => {
					// * Agrega el color si está en la lista de colores de la cantidad
					if (qty.includes(color.id)) {
						array.push({
							...tela.tela,
							id: `${tela.tela.codigo}-${color.codigo}`,
							telaId: tela.tela.id,
							tela: tela.tela.nombre,
							colorId: color.id,
							color: color.descripcion,
							// * Consumo de Gramos a Kilo Gramos
							cantidad: tela.unidadMedida
								? tela.unidadMedida.id === 4
									? tela.consumo / 1000
									: tela.consumo
								: tela.consumo / 1000,
							cantidadRestar: 0,
							tipo: tela.tipo,
							estiloId: estilo.id,
							umId: tela.unidadMedida ? (tela.unidadMedida.id === 4 ? 1 : tela.unidadMedida.id) : 1,
							um: tela.unidadMedida
								? tela.unidadMedida.id === 4
									? 'KG'
									: tela.unidadMedida.prefijo
								: 'KG',
						});
					}
				});
			});
		});
	});

	return array;
};

const agregarTelasComplemento = (dataEstilos, array) => {
	const arrTelas = [...array];

	dataEstilos.forEach(dataEstilo => {
		const coloresArr = dataEstilo.totalCantidades.map(qty => qty.color);

		dataEstilo.estilos.forEach(estilo => {
			estilo.telasEstilos.forEach(tela => {
				if (tela.tipo !== 'P') {
					tela.colores.forEach(color => {
						const relacionados = JSON.parse(tela.coloresRelacionados);
						const coloresFound = [];
						coloresArr.forEach(cr => {
							if (relacionados.findIndex(r => r === cr.id) !== -1) {
								if (coloresFound.findIndex(cf => cf.id === cr.id) === -1) coloresFound.push(cr);
							}
						});
						arrTelas.push({
							...tela.tela,
							id: `${tela.tela.codigo}-${color.codigo}`,
							telaId: tela.tela.id,
							tela: tela.tela.nombre,
							colorId: color.id,
							color: color.descripcion,
							// * Consumo de Gramos a Kilo Gramos
							cantidad: tela.unidadMedida
								? tela.unidadMedida.id === 4
									? tela.consumo / 1000
									: tela.consumo
								: tela.consumo / 1000,
							cantidadRestar: 0,
							tipo: tela.tipo,
							estiloId: estilo.id,
							umId: tela.unidadMedida ? (tela.unidadMedida.id === 4 ? 1 : tela.unidadMedida.id) : 1,
							um: tela.unidadMedida
								? tela.unidadMedida.id === 4
									? 'KG'
									: tela.unidadMedida.prefijo
								: 'KG',
							coloresRelacionados: coloresFound,
						});
					});
				}
			});
		});
	});

	return arrTelas;
};

const calcularCantidadesPrincipales = (pedidos, array) => {
	pedidos.forEach(pedido => {
		pedido.totalCantidades.forEach(total => {
			array.forEach(element => {
				//* Se multiplica si es una tela principal
				if (
					element.estiloId === total.estilo.id &&
					element.colorId === total.color.id &&
					element.tipo === 'P'
				) {
					element.cantidad *= total.totalCantidadPorcentaje;
				}
			});
		});
	});
	return array;
};

const calcularCantidadesComplemento = (pedidos, array) => {
	pedidos.forEach(pedido => {
		array.forEach(element => {
			if (element.tipo !== 'P') {
				//* Se toma el total de la cantidad si no tiene colores relacionados
				if (element.coloresRelacionados?.length === 0) {
					const total = pedido.totalCantidades.reduce(
						(acc, curr) => acc + curr.totalCantidadPorcentaje,
						0
					);
					element.cantidad *= total;
				} else {
					//* Se suman los totales de cantidades si tiene colores relacionados
					let total = 0;
					pedido.totalCantidades.forEach(curr => {
						if (
							element.coloresRelacionados?.findIndex(
								cr => element.estiloId === curr.estilo.id && cr.id === curr.color.id
							) !== -1
						)
							total += curr.totalCantidadPorcentaje;
					});
					element.cantidad *= total;
				}
			}
		});
	});

	return array;
};

const sumarDataRepetida = cantidades => {
	const arrayUnique = [];
	const arrayTemp = [];
	cantidades.forEach(element => {
		if (arrayTemp.includes(element.id)) {
			arrayUnique.forEach(elementUnique => {
				if (elementUnique.id === element.id) {
					elementUnique.cantidad += element.cantidad;
				}
			});
		} else {
			arrayTemp.push(element.id);
			arrayUnique.push(element);
		}
	});
	return arrayUnique;
};

const restarOrdenesAsignaciones = (arrayUnique, produccion) => {
	const array = [...arrayUnique];

	// * Restar asignaciones
	produccion?.productosTela.forEach(element => {
		array.forEach(elementArray => {
			if (elementArray.telaId === element.tela.id && elementArray.colorId === element.color.id) {
				elementArray.cantidadRestar += element.kardexTelas.reduce(
					(k, l) => k + parseFloat(l.cantidad),
					0
				);
			}
		});
	});

	//* Restar ordenes anteriores
	produccion?.ordenCompraTelas.forEach(element => {
		element.detalleOrdenComprasTelas.forEach(elementDetalle => {
			array.forEach(elementArray => {
				if (
					elementArray.telaId === elementDetalle.producto.tela.id &&
					elementArray.colorId === elementDetalle.producto.color.id
				) {
					elementArray.cantidadRestar += parseFloat(elementDetalle.cantidad);
				}
			});
		});
	});

	return array;
};

const obtenerPorcentajeOC = arrayUnique => {
	const array = [...arrayUnique];
	let totalCantidades = 0;
	let totalAvanzado = 0;

	array.forEach(elementArray => {
		totalCantidades += elementArray.cantidad;
		totalAvanzado += elementArray.cantidadRestar;
	});

	return (totalAvanzado * 100) / totalCantidades;
};

const obtenerPorcentajeIngresos = (ordenes, ingresos) => {
	const ordenesArray = [...ordenes];
	const ingresosArray = [...ingresos];
	let totalOrdenes = 0;
	let totalIngresos = 0;

	ordenesArray.forEach(elementArray => {
		totalOrdenes += elementArray.detalleOrdenComprasTelas.reduce(
			(a, b) => a + parseFloat(b.cantidad),
			0
		);
	});

	ingresosArray.forEach(elementArray => {
		totalIngresos += elementArray.detallesProductosIngresosAlmacenesTelas.reduce(
			(a, b) => a + parseFloat(b.cantidad),
			0
		);
	});

	return totalOrdenes > 0 ? (totalIngresos * 100) / totalOrdenes : 0;
};

export const estadosOpAdapter = createEntityAdapter({
	selectId: estadosOp => estadosOp.id,
});

export const { selectAll: selectEstadosOp, selectById: selectEstadosOpById } =
	estadosOpAdapter.getSelectors(state => state.reporte.estadosOp);

const EstadosOpSlice = createSlice({
	name: 'reporte/estados-op',
	initialState: estadosOpAdapter.getInitialState({
		total: 0,
		searchText: '',
		maxPage: 0,
	}),
	reducers: {
		setEstadosOpSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' }),
		},
		deleteEstadosOpArray: (state, action) => {
			estadosOpAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: {
		[getEstadosOp.fulfilled]: (state, action) => {
			if (action.payload.tipo === 'nuevaBusqueda') {
				estadosOpAdapter.setAll(state, action.payload.data[0]);
			} else {
				estadosOpAdapter.addMany(state, action.payload.data[0]);
			}

			const data = estadosOpAdapter.getSelectors().selectAll(state);

			action.payload.data[0].forEach(newElement => {
				data.forEach(element => {
					if (element.id === newElement.id) {
						estadosOpAdapter.updateOne(state, {
							id: element.id,
							changes: newElement,
						});
					}
				});
			});

			estadosOpAdapter.sortComparer = true;
			const total = action.payload.data[1];
			state.total = total;
		},
	},
});

export const { setEstadosOpSearchText, deleteEstadosOpArray } = EstadosOpSlice.actions;
export default EstadosOpSlice.reducer;

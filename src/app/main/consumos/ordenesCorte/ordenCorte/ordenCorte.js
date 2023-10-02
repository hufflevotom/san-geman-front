/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { styled } from '@mui/material/styles';
import { useDeepCompareEffect } from '@fuse/hooks';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { Button, Typography } from '@mui/material';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseUtils from '@fuse/utils/FuseUtils';
import { motion } from 'framer-motion';
import withReducer from 'app/store/withReducer';

import useQueryParams from 'utils/useQueryParams';
import httpClient from 'utils/Api';
import showToast from 'utils/Toast';
import ModalAgregarSubCodigo from './modalAgregarSubCodigo';

import reducer from '../../store';
import { newOrdenCorte, resetOrdenCorte } from '../../store/orden-corte/ordenCorteSlice';

import OrdenCorteHeader from './ordenCorteHeader';

import {
	getControlCalidadService,
	getProduccionesService,
	getProduccionService,
	getProductosTelasService,
} from './services';

import {
	Produccion,
	Partidas,
	Telas,
	Color,
	Estilos,
	Prenda,
	Molde,
	CantidadesTizados,
	DatoTelaReal,
	ObservacionGeneral,
	CheckPanios,
} from './components';

const Root = styled(FusePageCarded)(({ theme }) => ({
	'& .FusePageCarded-header': {
		minHeight: 72,
		height: 72,
		alignItems: 'center',
		[theme.breakpoints.up('sm')]: {
			minHeight: 136,
			height: 136,
		},
	},
}));

const OrdenCorte = () => {
	const dispatch = useDispatch();
	const cortePano = useSelector(({ consumos }) => consumos.cortePano);

	const routeParams = useParams();
	const params = useQueryParams();
	const [tabValue, setTabValue] = useState(0);
	const [disabled, setDisabled] = useState(false);
	const [actionn, setActionn] = useState(false);

	const [noExisteFamilia, setNoExisteFamilia] = useState(false);

	const [modalAgregarSubCodigo, setModalAgregarSubCodigo] = useState(false);

	const [codigo, setCodigo] = useState();
	const [subCodigo, setSubCodigo] = useState();
	const [descripcion, setDescripcion] = useState();

	const [currentProduccion, setCurrentProduccion] = useState(null);
	const [currentPartida, setCurrentPartida] = useState([]);
	const [currentTelas, setCurrentTelas] = useState([]);
	const [currentColor, setCurrentColor] = useState(null);
	const [currentEstilos, setCurrentEstilos] = useState([]);
	const [currentTipoPrenda, setCurrentTipoPrenda] = useState(null);
	const [currentMolde, setCurrentMolde] = useState(null);
	const [currentObservaciones, setCurrentObservaciones] = useState([]);
	const [currentObservacionGeneral, setCurrentObservacionGeneral] = useState(null);
	const [currentCheckPanios, setCurrentCheckPanios] = useState(false);

	const [uniquePartidas, setUniquePartidas] = useState([]);
	const [productosTela, setProductosTela] = useState([]);
	const [tablaTizados, setTablaTizados] = useState([]);
	const [temporalProductosTela, setTemporalProductosTela] = useState([]);
	const [producciones, setProducciones] = useState([]);

	const [estilos, setEstilos] = useState([]);

	const [produccionesST, setProduccionesST] = useState('');
	const [partidaST, setPartidaST] = useState('');

	const resetPartida = tipo => {
		setCurrentPartida([]);
		if (tipo) setUniquePartidas([]);
		resetColor();
		resetTelas(true);
	};

	const resetProduccion = tipo => {
		setCurrentProduccion(null);
		if (tipo) setProducciones([]);
		resetPartida(true);
	};

	const resetTelas = tipo => {
		setCurrentTelas([]);
		if (tipo) setProductosTela([]);
		resetEstilos();
	};

	const resetColor = () => {
		setCurrentColor(null);
	};

	const resetEstilos = () => {
		setCurrentEstilos([]);
		resetTipoPrenda();
		resetTablaTizados();
	};

	const resetTablaTizados = () => {
		setTablaTizados([]);
		resetTizado();
	};

	const resetTizado = () => {
		setTablaTizados([]);
		resetDatosTela();
	};

	const resetDatosTela = () => {
		setCurrentObservaciones([]);
	};

	const resetTipoPrenda = () => {
		setCurrentTipoPrenda(null);
	};

	const obtenerData = async id => {
		setDisabled(true);
		await showToast(
			{
				promesa: async () => {
					const {
						data: { statusCode, body },
					} = await httpClient.get(`orden-corte-panios/${id}`);
					if (statusCode === 200) {
						//* Obtenemos los datos de la produccion
						const dataProduccion = await getProduccionService(body.produccion.id);
						llenarListas(dataProduccion);

						//* Obtenemos los datos de las telas
						const pertenece = await getProductosTelasService('', dataProduccion, 1);
						const unqPertenece = pertenece.filter(
							(partida, index) => pertenece.findIndex(p => p.codigo === partida.codigo) === index
						);

						const noPertenece = await getProductosTelasService('', dataProduccion, -1);
						const unqNoPertenece = noPertenece.filter(
							(partida, index) => noPertenece.findIndex(p => p.codigo === partida.codigo) === index
						);

						const libres = await getProductosTelasService('', dataProduccion, 0);
						const unqLibres = libres.filter(
							(partida, index) => libres.findIndex(p => p.codigo === partida.codigo) === index
						);

						const arrUnique = [
							...unqPertenece.map(p => ({
								...p,
								origen: 1,
							})),
							...unqNoPertenece.map(p => ({
								...p,
								origen: -1,
							})),
							...unqLibres.map(p => ({
								...p,
								origen: 0,
							})),
						];

						const unqPartidas = arrUnique.filter(
							(partida, index) =>
								arrUnique.findIndex(p => p.partida === partida.partida) === index &&
								partida.clasificacion === 'Tela OK'
						);

						const partidasPertenecen = [];

						const telasProduccion = obtenerTelasDeUnaProduccion(dataProduccion);

						body.productosTelas.forEach(curr => {
							const index = telasProduccion.findIndex(tela => tela.id === curr.tela.id);
							if (index !== -1) {
								partidasPertenecen.push(curr);
							}
						});

						const responseCalidad = await getControlCalidadService(partidasPertenecen);

						//* Seteamos los datos de la partida
						const partidaValue = unqPartidas.filter(
							p => body.productosTelas.findIndex(q => p.partida === q.partida) !== -1
						);

						//* Seteamos los datos de las telas
						const telasValue = [];
						responseCalidad.data.body.forEach(tela => {
							const telas = body.productosTelas.find(t => t.id === tela.id);
							if (telas) {
								telasValue.push({ ...tela, key: tela.id, label: `${tela.tela.nombre}` });
							}
						});

						//* Seteamos los datos de los estilos
						const estilosValue = [];
						dataProduccion.pedidos.forEach(pedido => {
							pedido.estilos.forEach(estilo => {
								body.estilos.forEach(estiloBody => {
									if (estiloBody.id === estilo.id) {
										if (!estilosValue.find(e => e.id === estilo.id)) {
											estilosValue.push(estilo);
										}
									}
								});
							});
						});

						//* Seteamos los datos de las cantidades y tizados
						const tabla = [];

						estilosValue.forEach((estilo, index) => {
							const telasArray = [];
							const tallasArray = [];

							let nombreTelas = '';
							telasValue.forEach(tela => {
								estilo.telasEstilos.forEach(telaEstilo => {
									if (telaEstilo.tela.id === tela.tela.id) {
										if (telasValue.length > 1) {
											nombreTelas += `${tela.label ? tela.label : tela.tela.nombre} -/- `;
										} else if (telasValue.length === 1) {
											nombreTelas = telasValue[0].label
												? telasValue[0].label
												: telasValue[0].tela.nombre;
										}
										telasArray.push(tela);
									}
								});
							});

							const cantidadesPorTalla = [];
							estilo.registroEstilos?.forEach(registroEstilo => {
								registroEstilo.detalleRegistroEstilo.forEach(detalleRegistroEstilo => {
									if (tallasArray.findIndex(c => c.id === detalleRegistroEstilo.talla.id) === -1) {
										if (detalleRegistroEstilo.porcentaje !== null) {
											tallasArray.push({
												id: detalleRegistroEstilo.talla.id,
												talla: detalleRegistroEstilo.talla.talla,
												prefijo: detalleRegistroEstilo.talla.prefijo,
											});
											cantidadesPorTalla.push(detalleRegistroEstilo.cantidad);
										}
									}
								});
							});
							const dataTizados = [];
							body.tizados.forEach(estiloTizados => {
								const calidad = responseCalidad.data.body.find(
									e => e.id === estiloTizados.productoTela.id
								);
								const anchoDensidad =
									parseFloat(calidad.calidadTextil.anchoDelRolloReal / 100) *
									parseFloat(calidad.calidadTextil.densidadAntesLavadoReal / 1000);
								dataTizados.push({
									id: estiloTizados.id,
									tela: estiloTizados.productoTela,
									telaValue: {
										...estiloTizados.productoTela.tela,
										label: `${estiloTizados.productoTela.tela.nombre}`,
									},
									anchoDensidad,
									cantidadPano: estiloTizados.cantPaños,
									largoTizado: estiloTizados.largoTizado,
									pesoPano: estiloTizados.pesoPaño,
									cantidadesTizado: estiloTizados.tizadosCantidades.map(c => ({
										id: c.talla.id,
										talla: c.talla.talla,
										relacion: c.multiplicador,
										cantidad: c.cantidad,
									})),
								});
							});

							tabla.push({
								estiloId: estilo.id,
								telas: telasArray,
								tallas: tallasArray,
								detalleCantidades: {
									estilo: estilo.estilo,
									nombre: estilo.nombre,
									color: body.color?.descripcion,
									tela: nombreTelas,
									cantidadesTotales: cantidadesPorTalla,
									cantidadesCorte: cantidadesPorTalla.map(c => 0),
								},
								tizados: dataTizados,
							});
						});
						console.info('Form.TablaTizados: ', tabla);

						filterTelaPrincipal(estilosValue);

						//* Seteamos los datos de las observaciones
						const arreglo = [];
						// eslint-disable-next-line no-restricted-syntax
						for (const tela of telasValue) {
							// eslint-disable-next-line no-restricted-syntax
							for (const extra of body.extras) {
								if (extra.productoTela.id === tela.id) {
									if (tela.calidadTextil) {
										const partidas = [];
										const arrPartidas = partidaValue.filter(
											partida => partida.tela.id === tela.tela.id
										);
										// eslint-disable-next-line no-restricted-syntax
										for (const partida of arrPartidas) {
											if (partida.calidadTextil) {
												// eslint-disable-next-line no-await-in-loop
												const resKardex = await httpClient.get(
													`/almacen-tela/kardex/kardexTela/${tela.id}`
												);
												let reservado = 0;
												resKardex.data.body.reservaOrdenCorte?.forEach(a => {
													if (parseInt(a.ordenCorte.id, 10) !== parseInt(id, 10)) {
														reservado += parseFloat(a.cantidad);
													}
												});
												partidas.push({
													kardexTelaId: resKardex.data.body.id,
													partida: partida.partida,
													cantidadAlmacen: parseFloat(resKardex.data.body.cantidad) - reservado,
													reservado,
													densidadReal: partida.calidadTextil.densidadAntesLavadoReal / 1000,
													anchoReal: partida.calidadTextil.anchoDelRolloReal / 100,
													telaProgramada: 0,
												});
											}
										}
										arreglo.push({
											id: FuseUtils.generateGUID(),
											tela: tela.tela,
											productoTelaId: tela.id,
											codigo: tela.codigo,
											sumaPesos: parseFloat(extra.sumaPesos),
											saldoTeorico: 0,
											telaProgramada: parseFloat(extra.telaProgramada),
											partidas,
										});
									}
								}
							}
						}

						//* Calculo de la suma de pesos
						const array = [];
						await arreglo.forEach(item => {
							const partidasArr = [];
							item.partidas.forEach(partida => {
								partidasArr.push({ ...partida });
							});
							array.push({
								...item,
								partidas: partidasArr,
								sumaPesos: 0,
								telaProgramada: 0,
								saldoTeorico: item.cantidadAlmacen,
							});
						});
						if (array.length > 0) {
							await array.forEach(observacion => {
								if (tabla && tabla.length > 0) {
									tabla.forEach(tablaa => {
										tablaa.tizados.forEach(tizado => {
											if (tizado.tela?.tela?.id === observacion.tela?.id) {
												observacion.sumaPesos += parseFloat(tizado.pesoPano || 0);
												observacion.telaProgramada += parseFloat(tizado.pesoPano || 0);
												observacion.saldoTeorico -= parseFloat(tizado.pesoPano || 0);
											}
										});
									});
								}
							});
							await array.forEach(observacion => {
								let tela = parseFloat(observacion.telaProgramada || 0);
								observacion.partidas = observacion.partidas.map(partida => {
									if (tela >= partida.cantidadAlmacen) {
										partida.telaProgramada = partida.cantidadAlmacen;
										tela -= partida.cantidadAlmacen;
									} else {
										partida.telaProgramada = tela;
										tela = 0;
									}
									return partida;
								});
							});
						}

						//* Seteamos los datos del codigo
						setCodigo(body.codigo);
						setSubCodigo(body.subCodigo);
						setDescripcion(
							`${body.codigo.toString().padStart(6, '0')}-${body.subCodigo.toString()}`
						);
						//* Seteamos los datos de la produccion
						console.info('Form.Produccion: ', dataProduccion);
						setCurrentProduccion(dataProduccion);

						setUniquePartidas(unqPartidas);

						setProductosTela(responseCalidad.data.body.filter(a => a.clasificacion === 'Tela OK'));

						console.info('Form.Partida: ', partidaValue);
						setCurrentPartida(partidaValue);

						console.info('Form.Telas: ', telasValue);
						setCurrentTelas(telasValue);

						//* Seteamos los datos del color
						setCurrentColor(body.color);

						console.info('Form.Estilos: ', estilosValue);
						setCurrentEstilos(estilosValue);

						//* Seteamos los datos del tipo de prenda
						console.info('Form.TipoPrenda: ', body.prenda);
						setCurrentTipoPrenda(body.prenda);

						//* Seteamos los datos del molde
						console.info('Form.Molde: ', body.molde);
						setCurrentMolde(body.molde);

						//* Seteamos los datos del check paños
						console.info('Form.CheckPanios: ', body.panios);
						setCurrentCheckPanios(body.panios);

						console.info('Form.DatosDeTelaReal: ', array);
						setCurrentObservaciones(array);

						setTablaTizados(tabla);

						//* Seteamos los datos de la observacion general
						console.info('Form.ObservacionGeneral: ', body.observaciones);
						setCurrentObservacionGeneral(body.observaciones);

						setDisabled(false);
						return { payload: { message: 'Producción encontrada' } };
					}
				},
				parametros: [],
			},
			'buscar',
			'Producción'
		);
		calcularSumaPesos();
	};

	async function handleAgregarSubCodigo() {
		resetProduccion();
		setCurrentMolde(null);
		setCurrentCheckPanios(true);
		setCurrentObservacionGeneral(null);
		setModalAgregarSubCodigo(false);
		obtenerSubCodigo(codigo);
	}

	async function obtenerSubCodigo(cod) {
		try {
			const response = await httpClient.get(`orden-corte-panios/getNewSubCodigo/${cod}`);
			if (response.error) throw response;
			if (response.data.statusCode === 200) {
				setDescripcion(
					codigo
						? `${codigo.toString().padStart(6, '0')}-${response.data.body.toString()}`
						: cod.toString().padStart(6, '0')
				);
				setSubCodigo(response.data.body);
			}
			return { payload: { message: 'Código generado' } };
		} catch (error) {
			console.error('Error:', error);
			throw error;
		}
	}

	async function handleGetCodigo() {
		try {
			const response = await httpClient.get('orden-corte-panios/getNewCodigo');
			if (response.error) throw response;
			if (response.data.statusCode === 200) {
				setCodigo(response.data.body);
			}
			return obtenerSubCodigo(response.data.body);
		} catch (error) {
			console.error('Error:', error);
			throw error;
		}
	}

	const getProducciones = async busqueda => {
		const data = await getProduccionesService(busqueda);
		if (data) setProducciones(data);
	};

	const debouncedProducciones = debounce(() => {
		getProducciones(produccionesST);
	}, 500);

	useEffect(() => {
		debouncedProducciones(); // Llamar a la versión debounced de fetchData
		return debouncedProducciones.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [produccionesST]);

	const getProduccion = async id => {
		if (id !== '') {
			showToast(
				{
					promesa: async () => {
						const data = await getProduccionService(id);
						console.info('Form.Produccion:', data);
						setCurrentProduccion(data);
						llenarListas(data);
						return { payload: { message: 'Producción encontrada' } };
					},
					parametros: [],
				},
				'buscar',
				'Producción'
			);
		}
	};

	const getPartidas = async busqueda => {
		const pertenece = await getProductosTelasService(busqueda, currentProduccion, 1);
		console.log('HV.pertenece', pertenece);
		const unqPertenece = pertenece.filter(
			(partida, index) =>
				pertenece.findIndex(p => p.codigo === partida.codigo && p.clasificacion === 'Tela OK') ===
				index
		);
		console.log('HV.unqPertenece', unqPertenece);

		const noPertenece = await getProductosTelasService(busqueda, currentProduccion, -1);
		const unqNoPertenece = noPertenece.filter(
			(partida, index) =>
				noPertenece.findIndex(p => p.codigo === partida.codigo && p.clasificacion === 'Tela OK') ===
				index
		);
		console.log('HV.unqNoPertenece', unqNoPertenece);

		const libres = await getProductosTelasService(busqueda, currentProduccion, 0);
		const unqLibres = libres.filter(
			(partida, index) =>
				libres.findIndex(p => p.codigo === partida.codigo && p.clasificacion === 'Tela OK') ===
				index
		);
		console.log('HV.unqLibres', unqLibres);

		const arrUnique = [
			...unqPertenece.map(p => ({
				...p,
				origen: 1,
			})),
			...unqNoPertenece.map(p => ({
				...p,
				origen: -1,
			})),
			...unqLibres.map(p => ({
				...p,
				origen: 0,
			})),
		];
		console.log('HV.arrUnique', arrUnique);

		const unqPartidas = arrUnique.filter(
			(partida, index) =>
				arrUnique.findIndex(p => p.partida === partida.partida) === index &&
				partida.clasificacion === 'Tela OK'
		);
		console.log('HV.unqPartidas', unqPartidas);

		setUniquePartidas(unqPartidas);
	};

	const debouncedPartidas = debounce(() => {
		getPartidas(partidaST);
	}, 500);

	useEffect(() => {
		debouncedProducciones(); // Llamar a la versión debounced de fetchData
		return debouncedProducciones.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [partidaST]);

	const obtenerTelasDeUnaProduccion = produccion => {
		const telas = [];

		if (produccion && produccion.pedidos) {
			produccion.pedidos.forEach(pedido => {
				pedido.estilos.forEach(estilo => {
					estilo.telasEstilos.forEach(tela => {
						telas.push(tela.tela);
					});
				});
			});
		}

		return telas.filter((tela, index) => telas.findIndex(t => t.id === tela.id) === index);
	};

	const getProductosTelas = async () => {
		const partidasPertenecen = [];

		const telas = obtenerTelasDeUnaProduccion(currentProduccion);
		console.log('🚀 ~ file: ordenCorte.js:612 ~ getProductosTelas ~ telas:', telas);

		console.log(
			'🚀 ~ file: ordenCorte.js:620 ~ getProductosTelas ~ currentPartida:',
			currentPartida
		);
		currentPartida.forEach(curr => {
			const index = telas.findIndex(tela => tela.id === curr.tela.id);
			if (index !== -1) {
				partidasPertenecen.push(curr);
			}
		});

		const response = await getControlCalidadService(partidasPertenecen);
		const arrCalidadUnique = [];
		response.data.body.forEach(item => {
			if (
				arrCalidadUnique.findIndex(y => y.tela.id === item.tela.id) === -1 &&
				item.clasificacion === 'Tela OK'
			) {
				arrCalidadUnique.push(item);
			}
		});
		setTemporalProductosTela(response.data.body.filter(x => x.clasificacion === 'Tela OK'));

		setProductosTela(arrCalidadUnique);
	};

	const llenarListas = async prod => {
		const estilosArray = [];

		prod.pedidos.forEach(item => {
			item.estilos.forEach(estilo => {
				estilosArray.push(estilo);
			});
		});

		const idEstilos = [];
		const est = [];

		estilosArray.forEach(estilo => {
			if (!idEstilos.includes(estilo.id)) {
				idEstilos.push(estilo.id);
				est.push(estilo);
			}
		});

		setEstilos(est);
	};

	const filterTelaPrincipal = arrayEstilos => {
		currentTelas.forEach(a => {
			a.tipo = null;
		});
		const arrayTelas = [];
		const arrayTemp = [];
		const tel = [];
		if (arrayEstilos.length > 0) {
			currentTelas.forEach(tela => {
				arrayEstilos.forEach(estilo => {
					estilo.telasEstilos?.forEach(telaEstilo => {
						if (tela.tela.id === telaEstilo.tela.id) {
							if (tela.tipo !== 'P') {
								if (telaEstilo.tipo === 'P') {
									arrayTelas.push({ ...tela, tipo: telaEstilo.tipo });
								}
							} else {
								arrayTelas.push(tela);
							}
						} else {
							arrayTemp.push(tela);
						}
					});
				});
			});
			const idsTelas = [];
			arrayTelas.forEach(tela => {
				if (!idsTelas.includes(tela.id)) {
					idsTelas.push(tela.id);
					tel.push(tela);
				}
			});
			arrayTemp.forEach(tela => {
				if (!idsTelas.includes(tela.id)) {
					idsTelas.push(tela.id);
					tel.push(tela);
				}
			});
		} else {
			currentTelas.forEach(tela => {
				if (tela.tipo) delete tela.tipo;
				arrayTelas.push(tela);
			});
			const idsTelas = [];
			arrayTelas.forEach(tela => {
				if (!idsTelas.includes(tela.id)) {
					idsTelas.push(tela.id);
					tel.push(tela);
				}
			});
		}
		setCurrentTelas(tel);
	};

	const crearTablaTizados = (dataEstilos, dataTelas, dataColor) => {
		const tabla = [];

		dataEstilos.forEach((estilo, index) => {
			const telasArray = [];
			const tallasArray = [];

			let nombreTelas = '';
			dataTelas.forEach(tela => {
				estilo.telasEstilos.forEach(telaEstilo => {
					if (telaEstilo.tela.id === tela.tela.id) {
						if (dataTelas.length > 1) {
							nombreTelas += `${tela.label ? tela.label : tela.tela.nombre} -/- `;
						} else if (dataTelas.length === 1) {
							nombreTelas = dataTelas[0].label ? dataTelas[0].label : dataTelas[0].tela.nombre;
						}
						telasArray.push(tela);
					}
				});
			});

			const cantidadesPorTalla = [];
			estilo.registroEstilos?.forEach(registroEstilo => {
				registroEstilo.detalleRegistroEstilo.forEach(detalleRegistroEstilo => {
					if (tallasArray.findIndex(c => c.id === detalleRegistroEstilo.talla.id) === -1) {
						if (detalleRegistroEstilo.porcentaje !== null) {
							tallasArray.push({
								id: detalleRegistroEstilo.talla.id,
								talla: detalleRegistroEstilo.talla.talla,
								prefijo: detalleRegistroEstilo.talla.prefijo,
							});
							cantidadesPorTalla.push(detalleRegistroEstilo.cantidad);
						}
					}
				});
			});

			tabla.push({
				estiloId: estilo.id,
				telas: telasArray,
				tallas: tallasArray,
				detalleCantidades: {
					estilo: estilo.estilo,
					nombre: estilo.nombre,
					color: dataColor?.descripcion,
					tela: nombreTelas,
					cantidadesTotales: cantidadesPorTalla,
					cantidadesCorte: cantidadesPorTalla.map(c => 0),
				},
				tizados: [],
			});
		});

		setTablaTizados(tabla);
	};

	const calcularSumaPesos = () => {
		const array = currentObservaciones.map(item => {
			return {
				...item,
				sumaPesos: 0,
				telaProgramada: 0,
				saldoTeorico: item.cantidadAlmacen,
			};
		});
		if (array.length > 0) {
			array.forEach(observacion => {
				if (tablaTizados && tablaTizados.length > 0) {
					tablaTizados.forEach(tabla => {
						tabla.tizados.forEach(tizado => {
							if (tizado.tela?.tela?.id === observacion.tela?.id) {
								observacion.sumaPesos += parseFloat(tizado.pesoPano || 0);
								observacion.telaProgramada += parseFloat(tizado.pesoPano || 0);
								observacion.saldoTeorico -= parseFloat(tizado.pesoPano || 0);
							}
						});
					});
				}
			});
			array.forEach(observacion => {
				let tela = parseFloat(observacion.telaProgramada || 0);
				observacion.partidas = observacion.partidas.map(partida => {
					if (tela >= partida.cantidadAlmacen) {
						partida.telaProgramada = partida.cantidadAlmacen;
						tela -= partida.cantidadAlmacen;
					} else {
						partida.telaProgramada = tela;
						tela = 0;
					}
					return partida;
				});
			});
		}

		setCurrentObservaciones(array);
	};

	const datoTelaRealInicial = () => {
		const arreglo = [];
		if (currentTelas && currentTelas.length > 0) {
			currentTelas.forEach(tela => {
				if (tela.calidadTextil) {
					const partidas = [];
					const arrPartidas = currentPartida.filter(partida => partida.tela.id === tela.tela.id);
					arrPartidas.forEach(async partida => {
						if (partida.calidadTextil) {
							// const {
							// 	data: { body },
							// } = await httpClient.get(`/almacen-tela/kardex/${tela.codigo}/${tela.partida}`);
							const {
								data: { body },
							} = await httpClient.get(`/almacen-tela/kardex/kardexTela/${tela.id}`);
							const { id } = routeParams;
							let reservado = 0;
							body.reservaOrdenCorte?.forEach(a => {
								if (parseInt(a.ordenCorte.id, 10) !== parseInt(id, 10)) {
									reservado += parseFloat(a.cantidad);
								}
							});
							partidas.push({
								kardexTelaId: body.id,
								partida: partida.partida,
								cantidadAlmacen: parseFloat(body.cantidad) - reservado,
								reservado,
								densidadReal: partida.calidadTextil.densidadAntesLavadoReal / 1000,
								anchoReal: partida.calidadTextil.anchoDelRolloReal / 100,
								telaProgramada: 0,
							});
						}
					});
					arreglo.push({
						id: FuseUtils.generateGUID(),
						tela: tela.tela,
						productoTelaId: tela.id,
						codigo: tela.codigo,
						sumaPesos: 0,
						saldoTeorico: 0,
						partidas,
					});
				}
			});
		}
		setCurrentObservaciones(arreglo);
	};

	useEffect(() => {
		if (currentProduccion) {
			getPartidas();
		}
	}, [currentProduccion]);

	useEffect(() => {
		if (currentPartida) {
			getProductosTelas();
		}
	}, [currentPartida]);

	useEffect(() => {
		calcularSumaPesos();
	}, [disabled, tablaTizados]);

	useEffect(() => {
		if (currentPartida && currentPartida.length > 0) {
			datoTelaRealInicial();
		}
	}, [currentTelas]);

	useEffect(() => {
		if (routeParams.id === 'nuevo') {
			handleGetCodigo();
		}
		getProducciones('');
	}, []);

	/* ---------------------------------------------------------------------------------------------------------------------------------- */

	useDeepCompareEffect(() => {
		async function updateFamiliaState() {
			const { id } = routeParams;
			const { action } = await params;
			if (id === 'nuevo') {
				dispatch(newOrdenCorte());
				getProducciones();
			} else {
				setDisabled(action === 'SW');
				setActionn(action === 'ET');
				obtenerData(id);
			}
		}

		updateFamiliaState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!cortePano) {
			return null;
		}
	}, [cortePano]);

	useEffect(() => {
		return () => {
			dispatch(resetOrdenCorte());
			setNoExisteFamilia(false);
		};
	}, [dispatch]);

	// ----------------------------------------------------------------------------

	if (noExisteFamilia) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontro la orden de corte!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/consumos-modelaje/ordenes-corte"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (cortePano && parseInt(routeParams.id, 10) !== cortePano.id && routeParams.id !== 'nuevo') {
		return <FuseLoading />;
	}

	return (
		<Root
			header={
				<OrdenCorteHeader
					tipo={routeParams.id}
					disabled={disabled}
					descripcion={descripcion}
					codigo={codigo}
					subCodigo={subCodigo}
					setModalAgregarSubCodigo={setModalAgregarSubCodigo}
					currentProduccion={currentProduccion}
					currentPartida={currentPartida}
					currentTelas={currentTelas}
					currentColor={currentColor}
					currentEstilos={currentEstilos}
					currentTipoPrenda={currentTipoPrenda}
					currentMolde={currentMolde}
					currentCheckPanios={currentCheckPanios}
					currentTablaTizado={tablaTizados}
					currentObservaciones={currentObservaciones}
					currentObservacionGeneral={currentObservacionGeneral}
					temporalProductosTela={temporalProductosTela}
				/>
			}
			content={
				<div className="p-16 sm:p-24 ">
					<div className={tabValue !== 0 ? 'hidden' : ''}>
						<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Detalles</div>
						<div>
							<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
								<Produccion
									currentProduccion={currentProduccion}
									getProducciones={setProduccionesST}
									setProducciones={setProducciones}
									producciones={producciones}
									getProduccion={getProduccion}
									resetProduccion={resetProduccion}
									disabled={disabled}
									action={actionn}
								/>
								<Partidas
									currentPartida={currentPartida}
									setCurrentPartida={setCurrentPartida}
									setCurrentColor={setCurrentColor}
									getProductosTelas={setPartidaST}
									uniquePartidas={uniquePartidas}
									resetPartida={resetPartida}
									currentProduccion={currentProduccion}
									currentColor={currentColor}
									disabled={disabled}
									action={actionn}
								/>
							</div>
							<div className="flex flex-col sm:flex-row mr-24 sm:mr-4 mt-4">
								<Telas
									currentTelas={currentTelas}
									setCurrentTelas={setCurrentTelas}
									productosTela={productosTela}
									resetTelas={resetTelas}
									currentPartida={currentPartida}
									disabled={disabled}
									currentEstilos={currentEstilos}
								/>
								<Color currentColor={currentColor} />
								<Estilos
									currentEstilos={currentEstilos}
									setCurrentEstilos={setCurrentEstilos}
									setCurrentTipoPrenda={setCurrentTipoPrenda}
									estilos={estilos}
									resetEstilos={resetEstilos}
									currentColor={currentColor}
									currentTelas={currentTelas}
									crearTablaTizados={crearTablaTizados}
									filterTelaPrincipal={filterTelaPrincipal}
									disabled={disabled}
									action={actionn}
								/>
							</div>
							<div className="flex flex-col sm:flex-row mr-24 sm:mr-4 mt-2">
								<Prenda
									currentTipoPrenda={currentTipoPrenda}
									setCurrentTipoPrenda={setCurrentTipoPrenda}
								/>
								<Molde
									currentMolde={currentMolde}
									setCurrentMolde={setCurrentMolde}
									disabled={disabled}
								/>
								<CheckPanios
									currentCheckPanios={currentCheckPanios}
									setCurrentCheckPanios={setCurrentCheckPanios}
									disabled={disabled}
								/>
							</div>

							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									width: '100%',
									margin: 0,
									padding: 0,
									marginLeft: '12px',
									marginBottom: '12px',
								}}
							>
								<CantidadesTizados
									tablaTizados={tablaTizados}
									setTablaTizados={setTablaTizados}
									disabled={disabled}
								/>
							</div>
							<div className="flex flex-col sm:flex-row mr-24 sm:mr-4 mt-4">
								{tablaTizados.length > 0 && (
									<DatoTelaReal
										currentObservaciones={currentObservaciones}
										setCurrentObservaciones={setCurrentObservaciones}
										disabled={disabled}
									/>
								)}
							</div>
							<div className="flex flex-col sm:flex-row mr-24 sm:mr-4 mt-4">
								<ObservacionGeneral
									currentObservacionGeneral={currentObservacionGeneral}
									setCurrentObservacionGeneral={setCurrentObservacionGeneral}
									disabled={disabled}
								/>
							</div>
						</div>
					</div>
					{modalAgregarSubCodigo && (
						<ModalAgregarSubCodigo
							visible={modalAgregarSubCodigo}
							setVisible={setModalAgregarSubCodigo}
							handleAgregarSubCodigo={handleAgregarSubCodigo}
						/>
					)}
				</div>
			}
			innerScroll
		/>
	);
};

export default withReducer('consumos', reducer)(OrdenCorte);

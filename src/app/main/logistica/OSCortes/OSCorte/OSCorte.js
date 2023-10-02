/* eslint-disable no-restricted-syntax */
import debounce from 'lodash.debounce';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';
import withReducer from 'app/store/withReducer';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import { Button, Typography } from '@mui/material';
import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'framer-motion';
import useQueryParams from 'utils/useQueryParams';
import httpClient from 'utils/Api';
import showToast from 'utils/Toast';
import moment from 'moment';
import reducer from '../../store';
import { getOSCorteId, newOSCorte, resetOSCorte } from '../../store/os-corte/oSCorteSlice';
import OrdenCorteHeader from './OSCorteHeader';
import {
	Cantidades,
	Fecha,
	FormaPago,
	LugarEntrega,
	Moneda,
	ObservacionGeneral,
	OrdenCorte,
	Produccion,
	Proveedor,
	Resumen,
	TipoServicio,
	GuiasRemision,
} from './components';
import {
	getProduccionesService,
	getProduccionService,
	getProveedoresService,
	getFormaPagosService,
	getOrdenesCorteService,
} from './services';

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

const OSCorte = () => {
	const dispatch = useDispatch();
	const ordenCorte = useSelector(({ logistica }) => logistica.oSCorte);

	const routeParams = useParams();
	const params = useQueryParams();
	const [tabValue, setTabValue] = useState(0);
	const [disabled, setDisabled] = useState(false);

	const [noExisteFamilia, setNoExisteFamilia] = useState(false);

	const [corte, setCorte] = useState();
	const [currentTipoServicio, setCurrentTipoServicio] = useState(null);
	const [currentProveedor, setCurrentProveedor] = useState(null);
	const [currentMoneda, setCurrentMoneda] = useState(null);
	const [currentFormaPago, setCurrentFormaPago] = useState(null);
	const [currentLugarEntrega, setCurrentLugarEntrega] = useState(null);
	const [currentProduccion, setCurrentProduccion] = useState(null);
	const [currentOrdenesCorte, setCurrentOrdenesCorte] = useState([]);

	const [cantidadesData, setCantidadesData] = useState([]);

	const [currentGuiasRemision, setCurrentGuiasRemision] = useState('');
	const [currentFechaEmision, setCurrentFechaEmision] = useState(new Date());
	const [currentFechaEntrega, setCurrentFechaEntrega] = useState(null);
	const [currentObservacionGeneral, setCurrentObservacionGeneral] = useState(null);

	const [descripcion, setDescripcion] = useState();
	const [codigo, setCodigo] = useState();

	const [uniqueOrdenesCorte, setUniqueOrdenesCorte] = useState([]);
	const [uniqueFormasPago, setUniqueFormasPago] = useState([]);
	const [producciones, setProducciones] = useState([]);
	const [proveedores, setProveedores] = useState([]);

	const [produccionesST, setProduccionesST] = useState('');
	const [corteST, setCorteST] = useState('');
	const [proveedoresST, setProveedoresST] = useState('');
	const [formaPagosST, setFormaPagosST] = useState('');

	const resetProveedor = tipo => {
		setCurrentProveedor(null);
		if (tipo) setProveedores([]);
		resetFormaPago(true);
		resetMoneda();
	};

	const resetFormaPago = tipo => {
		setCurrentFormaPago(null);
		if (tipo) setUniqueFormasPago([]);
	};

	const resetMoneda = () => {
		setCurrentMoneda(null);
	};

	const resetProduccion = tipo => {
		setCurrentProduccion(null);
		if (tipo) setProducciones([]);
	};

	const resetOrdenCorte = tipo => {
		setCurrentOrdenesCorte([]);
		if (tipo) setUniqueOrdenesCorte([]);
	};

	const getProveedores = async busqueda => {
		const data = await getProveedoresService(busqueda);
		if (data) setProveedores(data);
	};

	const debouncedProveedores = debounce(() => {
		getProveedores(proveedoresST);
	}, 500);

	useEffect(() => {
		debouncedProveedores(); // Llamar a la versión debounced de fetchData
		return debouncedProveedores.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [proveedoresST]);

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

	const getFormaPagos = async busqueda => {
		const data = await getFormaPagosService(busqueda);
		if (data) setUniqueFormasPago(data);
	};

	const debouncedFormaPagos = debounce(() => {
		getFormaPagos(formaPagosST);
	}, 500);

	useEffect(() => {
		debouncedFormaPagos(); // Llamar a la versión debounced de fetchData
		return debouncedFormaPagos.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [formaPagosST]);

	const getCantidades = async array => {
		if (array.length > 0) {
			const cantidades = [];
			//* Obtenemos los datos de la produccion
			const dataProduccion = await getProduccionService(currentProduccion.id);
			array.forEach(item => {
				const telasArray = [];
				const estilosValue = [];
				let colorArray = {};
				const cantidadesValue = [];
				item.ordenesCorte.forEach(c => {
					//* Seteamos los datos de los estilos
					dataProduccion.pedidos.forEach(pedido => {
						pedido.estilos.forEach(estilo => {
							c.estilos.forEach(estiloBody => {
								if (estiloBody.id === estilo.id) {
									if (!estilosValue.find(e => e.id === estilo.id)) {
										estilosValue.push(estilo);
									}
								}
							});
						});
					});
					telasArray.push(...c.productosTelas);
					colorArray = c.color;

					c.estiloCantidadesPaños.forEach(cantidad => {
						const ordenCortePañoCantidades = [];
						//* Formateamos las cantidades
						cantidad.ordenCorteCantidadesPaños.forEach(ordenCorteCantidad => {
							// ordenCorteCantidad.cantidad = parseFloat(ordenCorteCantidad.cantidad);
							ordenCortePañoCantidades.push(ordenCorteCantidad);
						});

						// let costo = 0;
						// cantidad.estilo.costo.rutasCostos.forEach(ruta => {
						// 	if (ruta.ruta.descripcion.split(' ').slice(-1)[0] === currentTipoOrdenesCorte.key) {
						// 		if (currentTipoServicio.key === 'EX') {
						// 			if (parseFloat(ruta.montoExPEN) > 0) {
						// 				costo += parseFloat(ruta.montoExPEN);
						// 			} else {
						// 				costo += parseFloat(ruta.montoExUSD);
						// 			}
						// 		} else if (parseFloat(ruta.montoInPEN) > 0) {
						// 			costo += parseFloat(ruta.montoInPEN);
						// 		} else {
						// 			costo += parseFloat(ruta.montoInUSD);
						// 		}
						// 	}
						// });

						cantidadesValue.push({
							...cantidad,
							estiloId: cantidad.estilo.id,
							costo: 0,
							igv: 0,
							subtotal: 0,
							ordenCortePañoCantidades,
						});
					});
				});
				cantidades.push({
					orden: item.label,
					telas: telasArray,
					estilos: estilosValue,
					color: colorArray,
					cantidades: cantidadesValue,
				});
			});
			setCantidadesData(cantidades);
		}
	};

	const getOrdenesCorte = async () => {
		let data = {};
		data = await getOrdenesCorteService(currentProduccion.id);
		const array = [];
		for (const [key, value] of Object.entries(data)) {
			value.forEach((item, index) => {
				array.push({
					key,
					id: item.id,
					codigo: `${key.padStart(6, '0')}-${index + 1}`,
					ordenesCorte: [item],
				});
			});
		}
		setUniqueOrdenesCorte(array);
	};

	const debouncedCorte = debounce(() => {
		getOrdenesCorte();
	}, 500);

	useEffect(() => {
		debouncedCorte(); // Llamar a la versión debounced de fetchData
		return debouncedCorte.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [corteST]);

	async function handleGetCodigo() {
		try {
			const year = new Date().getFullYear();
			const response = await httpClient.get(`logistica/orden-servicio-corte/correlativo/${year}`);
			if (response.error) throw response;
			if (response.data.statusCode === 200) {
				setDescripcion(
					`OSG${year.toString().substring(2, 4)}-${response.data.body.toString().padStart(6, '0')}`
				);
				setCodigo(response.data.body);
			}
		} catch (error) {
			console.error('Error:', error);
			throw error;
		}
	}

	const obtenerData = async id => {
		setDisabled(true);
		await showToast(
			{
				promesa: async () => {
					const {
						data: { statusCode, body },
					} = await httpClient.get(`logistica/orden-servicio-corte/${id}`);
					if (statusCode === 200) {
						//* Seteamos los datos del codigo
						setCodigo(body.correlativo);
						setDescripcion(body.codigo);
						//* Seteamos los datos del tipo de servicio
						setCurrentTipoServicio({ id: body.tipoServicio, key: body.tipoServicio });

						//* Seteamos los datos de la produccion
						setCurrentProduccion(body.produccion);
						//* Seteamos los datos de guias de remision
						setCurrentGuiasRemision(body.guiaRemision);
						//* Seteamos los datos de fecha de emision
						setCurrentFechaEmision(moment(body.fechaEmision));
						//* Seteamos los datos de fecha de entrega
						setCurrentFechaEntrega(moment(body.fechaEntrega));
						//* Seteamos los datos del proveedor
						setCurrentProveedor(body.proveedor);
						//* Seteamos los datos de la moneda
						setCurrentMoneda({
							id: body.moneda,
							key: body.moneda,
							label: body.moneda,
						});
						//* Seteamos los datos de la forma de pago
						setCurrentFormaPago(body.formaPago);
						//* Seteamos los datos del lugar de entrega
						setCurrentLugarEntrega(body.lugarEntrega);
						//* Seteamos los datos de las observaciones
						setCurrentObservacionGeneral(body.observaciones);
						//* Seteamos los datos de las ordenes de corte
						const ordenes = [];
						body.ordenesCortePaños.forEach(item => {
							ordenes.push({
								key: item.id,
								id: item.id,
								codigo: `${item.codigo.toString().padStart(6, '0')}-${item.subCodigo}`,
								ordenesCorte: [item],
							});
						});
						setCurrentOrdenesCorte(ordenes);
						//* Seteamos los datos de las cantidades
						const cantidades = [];
						const dataProduccion = await getProduccionService(body.produccion.id);
						ordenes.forEach(item => {
							const telasArray = [];
							const estilosValue = [];
							let colorArray = {};
							const cantidadesValue = [];
							item.ordenesCorte.forEach(c => {
								//* Seteamos los datos de los estilos
								dataProduccion.pedidos.forEach(pedido => {
									pedido.estilos.forEach(estilo => {
										c.estilos.forEach(estiloBody => {
											if (estiloBody.id === estilo.id) {
												if (!estilosValue.find(e => e.id === estilo.id)) {
													estilosValue.push(estilo);
												}
											}
										});
									});
								});
								telasArray.push(...c.productosTelas);
								colorArray = c.color;

								c.estiloCantidadesPaños.forEach(cantidad => {
									const ordenCortePañoCantidades = [];
									//* Formateamos las cantidades
									cantidad.ordenCorteCantidadesPaños.forEach(ordenCorteCantidad => {
										// ordenCortePañoCantidades.cantidad = parseFloat(ordenCortePañoCantidades.cantidad);
										ordenCortePañoCantidades.push(ordenCorteCantidad);
									});

									let costo = 0;
									let igv = 0;
									let subTotal = 0;
									body.costosOrdenesServicioCorte.forEach(costos => {
										if (costos.estiloCantidadPañosId === cantidad.id) {
											costo = costos.precioUnitario;
											igv = costos.igv;
											subTotal = costos.costo;
										}
									});
									cantidadesValue.push({
										...cantidad,
										estiloId: cantidad.estilo.id,
										costo,
										igv,
										subTotal,
										ordenCortePañoCantidades,
									});
								});
							});
							cantidades.push({
								orden: item.label,
								telas: telasArray,
								estilos: estilosValue,
								color: colorArray,
								cantidades: cantidadesValue,
							});
						});
						setCantidadesData(cantidades);
					}
					setDisabled(false);
					return { payload: { message: 'Orden de Servicio de Corte encontrada' } };
				},
				parametros: [],
			},
			'buscar',
			'Orden de Servicio de Corte'
		);
	};

	useEffect(() => {
		if (currentProduccion) {
			getOrdenesCorte();
		}
	}, [currentProduccion]);

	useEffect(() => {
		if (currentOrdenesCorte && routeParams.id === 'nuevo') {
			getCantidades(currentOrdenesCorte);
		}
	}, [currentOrdenesCorte]);

	useEffect(() => {
		if (currentProveedor) {
			if (currentProveedor.moneda) {
				setCurrentMoneda({
					id: currentProveedor.moneda,
					key: currentProveedor.moneda,
					label: currentProveedor.moneda,
				});
			}
			setCurrentFormaPago(currentProveedor.formaPago);
		}
	}, [currentProveedor]);

	useEffect(() => {
		if (routeParams.id === 'nuevo') {
			handleGetCodigo();
			getProveedores();
			getProducciones();
			getFormaPagos();
		}
	}, []);
	useDeepCompareEffect(() => {
		function updateFamiliaState() {
			if (routeParams.id === 'nuevo') {
				dispatch(newOSCorte());
			} else {
				dispatch(getOSCorteId(routeParams.id)).then(action => {
					if (!action.payload) {
						setNoExisteFamilia(true);
					}
				});
				obtenerData(routeParams.id);
			}
		}

		updateFamiliaState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		return () => {
			dispatch(resetOSCorte());
			setNoExisteFamilia(false);
		};
	}, [dispatch]);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

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
					to="/logistica/ordenes-servicio-corte"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (ordenCorte && parseInt(routeParams.id, 10) !== ordenCorte.id && routeParams.id !== 'nuevo') {
		return <FuseLoading />;
	}
	return (
		<Root
			header={
				<OrdenCorteHeader
					tipo={routeParams.id}
					descripcion={descripcion}
					data={{
						codigo,
						currentTipoServicio,
						currentProduccion,
						currentOrdenesCorte,
						currentGuiasRemision,
						currentFechaEmision,
						currentFechaEntrega,
						currentProveedor,
						currentMoneda,
						currentFormaPago,
						currentLugarEntrega,
						currentObservacionGeneral,
						cantidadesData,
					}}
				/>
			}
			content={
				<div className="p-16 sm:p-24 ">
					<div className={tabValue !== 0 ? 'hidden' : ''}>
						<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Detalles</div>
						<div>
							<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
								<TipoServicio
									current={currentTipoServicio}
									setCurrent={setCurrentTipoServicio}
									disabled={disabled}
								/>
								<Produccion
									getProducciones={setProduccionesST}
									producciones={producciones}
									setCurrentProduccion={setCurrentProduccion}
									currentProduccion={currentProduccion}
									resetProduccion={resetProduccion}
									currentTipoServicio={currentTipoServicio}
									disabled={disabled}
								/>
								<OrdenCorte
									getOrdenesCorte={setCorteST}
									uniqueOrdenesCorte={uniqueOrdenesCorte}
									currentOrdenesCorte={currentOrdenesCorte}
									setCurrentOrdenesCorte={setCurrentOrdenesCorte}
									resetOrdenCorte={resetOrdenCorte}
									currentProduccion={currentProduccion}
									disabled={disabled}
									corte={corte}
									setCorte={setCorte}
								/>
							</div>
							<div className="flex flex-col sm:flex-row mr-24 sm:mr-4 mt-2">
								<GuiasRemision
									currentGuiasRemision={currentGuiasRemision}
									setCurrentGuiasRemision={setCurrentGuiasRemision}
									disabled={disabled}
								/>
								<Fecha
									value={currentFechaEmision}
									setValue={setCurrentFechaEmision}
									name="Fecha emisión"
									disabled
								/>
								<Fecha
									value={currentFechaEntrega}
									setValue={setCurrentFechaEntrega}
									name="Fecha de entrega"
									entrega
									disabled={disabled}
								/>
							</div>
							<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
								<Proveedor
									getProveedores={setProveedoresST}
									proveedores={proveedores}
									currentProveedor={currentProveedor}
									setCurrentProveedor={setCurrentProveedor}
									resetProveedor={resetProveedor}
									disabled={disabled}
								/>
								<Moneda
									currentMoneda={currentMoneda}
									setCurrentMoneda={setCurrentMoneda}
									resetMoneda={resetMoneda}
									currentProveedor={currentProveedor}
									disabled={disabled}
								/>
								<FormaPago
									getFormaPagos={setFormaPagosST}
									uniqueFormasPago={uniqueFormasPago}
									currentFormaPago={currentFormaPago}
									setCurrentFormaPago={setCurrentFormaPago}
									resetFormaPago={resetFormaPago}
									resetProduccion={resetProduccion}
									currentProveedor={currentProveedor}
									disabled={disabled}
								/>
							</div>
							<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
								<LugarEntrega
									currentLugarEntrega={currentLugarEntrega}
									setCurrentLugarEntrega={setCurrentLugarEntrega}
									disabled={disabled}
								/>
								<ObservacionGeneral
									currentObservacionGeneral={currentObservacionGeneral}
									setCurrentObservacionGeneral={setCurrentObservacionGeneral}
									disabled={disabled}
								/>
							</div>
							<div className="flex flex-col mx-24">
								{cantidadesData.map((q, i) => (
									<Cantidades
										indexCantidad={i}
										orden={q.orden}
										produccion={currentProduccion}
										telas={q.telas}
										estilos={q.estilos}
										color={q.color}
										cantidades={q.cantidades}
										cantidadesData={cantidadesData}
										setCantidadesData={setCantidadesData}
										currentTipoServicio={currentTipoServicio}
									/>
								))}
							</div>
							<div>
								{cantidadesData && (
									<Resumen data={cantidadesData} currentTipoServicio={currentTipoServicio} />
								)}
							</div>
						</div>
					</div>
				</div>
			}
			innerScroll
		/>
	);
};

export default withReducer('logistica', reducer)(OSCorte);

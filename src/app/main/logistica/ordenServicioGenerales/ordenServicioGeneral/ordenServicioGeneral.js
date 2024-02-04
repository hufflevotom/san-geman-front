/* eslint-disable no-restricted-syntax */
import debounce from 'lodash.debounce';
import FusePageCarded from '@fuse/core/FusePageCarded';
import FuseUtils from '@fuse/utils/FuseUtils';
import { styled } from '@mui/material/styles';
import withReducer from 'app/store/withReducer';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import { Button, IconButton, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'framer-motion';
import httpClient from 'utils/Api';
import showToast from 'utils/Toast';
import moment from 'moment';
import reducer from '../../store';
import {
	getOrdenServicioGeneralId,
	newOrdenServicioGeneral,
	resetOrdenServicioGeneral,
} from '../../store/ordenServicioGeneral/ordenServicioGeneralSlice';
import OrdenServicioGeneralHeader from './ordenServicioGeneralHeader';
import {
	Cantidades,
	Fecha,
	FormaPago,
	LugarEntrega,
	Moneda,
	ObservacionGeneral,
	Produccion,
	Proveedor,
	Resumen,
	TipoServicio,
	GuiasRemision,
} from './components';
import {
	getOneProduccion,
	getProduccionesService,
	getProveedoresService,
	getFormaPagosService,
} from './services';
import TipoOrden from './components/TipoOrden';
import InputString from '../../controlFacturas/controlFactura/components/inputString';
import TipoProduccion from './components/TipoProduccion';
import { Estilos } from './components/Estilos';

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

const RUTAS_INVALIDAS = [1, 2];

const OrdenServicioGeneral = () => {
	const dispatch = useDispatch();
	const ordenCorte = useSelector(({ logistica }) => logistica.ordenServicioGeneral);

	const routeParams = useParams();
	const [disabled, setDisabled] = useState(false);

	const [noExisteFamilia, setNoExisteFamilia] = useState(false);

	const [currentTipoOrdenServicio, setCurrentTipoOrdenServicio] = useState(null);
	const [currentTipoOrden, setCurrentTipoOrden] = useState(null);
	const [currentTipoServicio, setCurrentTipoServicio] = useState(null);
	const [currentProveedor, setCurrentProveedor] = useState(null);
	const [currentMoneda, setCurrentMoneda] = useState(null);
	const [currentFormaPago, setCurrentFormaPago] = useState(null);
	const [currentAtencion, setCurrentAtencion] = useState(null);
	const [currentEstado, setCurrentEstado] = useState(null);
	const [currentProduccion, setCurrentProduccion] = useState(null);
	const [currentEstilo, setCurrentEstilo] = useState(null);

	const [cantidadesData, setCantidadesData] = useState([]);

	const [currentGuiasRemision, setCurrentGuiasRemision] = useState('');
	const [currentFechaEmision, setCurrentFechaEmision] = useState(new Date());
	const [currentFechaEntrega, setCurrentFechaEntrega] = useState(null);
	const [currentObservacionGeneral, setCurrentObservacionGeneral] = useState(null);

	const [descripcion, setDescripcion] = useState();
	const [codigo, setCodigo] = useState();

	const [uniqueFormasPago, setUniqueFormasPago] = useState([]);
	const [producciones, setProducciones] = useState([]);
	const [estilos, setEstilos] = useState([]);
	const [rutas, setRutas] = useState([]);
	const [proveedores, setProveedores] = useState([]);
	const [colores, setColores] = useState([]);

	const [prenda, setPrenda] = useState(null);
	const [produccionesST, setProduccionesST] = useState('');
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

	const resetEstilo = tipo => {
		setCurrentEstilo(null);
		if (tipo) setEstilos([]);
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

	async function handleGetCodigo() {
		try {
			const year = new Date().getFullYear();
			const response = await httpClient.get(`logistica/orden-servicio-general/correlativo/${year}`);
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
					} = await httpClient.get(`logistica/orden-servicio-general/${id}`);
					if (statusCode === 200) {
						setCodigo(body.correlativo);
						setDescripcion(body.codigo);
						setCurrentTipoOrden({ id: body.tipoOrden, key: body.tipoOrden });
						setCurrentTipoServicio({ id: body.tipoServicio, key: body.tipoServicio });
						setCurrentProduccion(body.produccion);
						setCurrentGuiasRemision(body.guiaRemision);
						setCurrentFechaEmision(moment(body.fechaEmision));
						setCurrentFechaEntrega(moment(body.fechaEntrega));
						setCurrentProveedor(body.proveedor);
						setCurrentMoneda({
							id: body.moneda,
							key: body.moneda,
							label: body.moneda,
						});
						setCurrentFormaPago(body.formaPago);
						setCurrentAtencion(body.atencion);
						setCurrentEstado(body.estado);
						setCurrentObservacionGeneral(body.observaciones);
						setCantidadesData(body.costosOrdenesServicioGeneral);
					}
					setDisabled(false);
					return { payload: { message: 'Orden de Servicio encontrada' } };
				},
				parametros: [],
			},
			'buscar',
			'Orden de Servicio de Corte'
		);
	};

	useEffect(() => {
		if (currentProduccion) {
			getOneProduccion(currentProduccion.id).then(response => {
				if (response) {
					const estilosArr = [];
					response.pedidos.forEach(pedido => {
						pedido.estilos.forEach(estilo => {
							if (!estilosArr.find(e => e.id === estilo.id))
								estilosArr.push({
									id: estilo.id,
									key: estilo.id,
									label: `${estilo.estilo} - ${estilo.nombre}`,
									...estilo,
								});
						});
					});
					setEstilos(estilosArr);
					console.log(response);
				}
			});
			console.log(currentProduccion);
		}
	}, [currentProduccion]);

	useEffect(() => {
		if (currentEstilo) {
			const rutasArr = [];
			currentEstilo.rutasEstilos.forEach(estilo => {
				if (!rutasArr.find(e => e.id === estilo.ruta.id))
					if (!RUTAS_INVALIDAS.some(ruta => ruta === estilo.ruta.id))
						rutasArr.push({
							id: estilo.ruta.id,
							key: estilo.ruta.id,
							label: estilo.ruta.descripcion,
							...estilo.ruta,
						});
			});
			setRutas(rutasArr);
			console.log(currentEstilo);
			const coloresArr = [];
			currentEstilo.telasEstilos.forEach(tela => {
				if (tela.tipo === 'P')
					tela.colores.forEach(color => {
						if (!coloresArr.find(e => e.id === color.id)) coloresArr.push(color);
					});
			});
			setColores(
				coloresArr.map(colo => ({
					...colo,
					label: `${colo.descripcion} - ${colo.codigo}`,
					value: colo.id,
				}))
			);
			setPrenda(currentEstilo.prenda);
			setCantidadesData([]);
		}
	}, [currentEstilo]);

	useEffect(() => {
		if (currentProveedor) {
			if (currentProveedor.moneda) {
				setCurrentMoneda({
					id: currentProveedor.moneda,
					key: currentProveedor.moneda,
					label: currentProveedor.moneda,
				});
			}
			setCurrentAtencion(
				currentProveedor.tipo === 'N' ? currentProveedor.label : currentProveedor.personaContacto
			);
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
				dispatch(newOrdenServicioGeneral());
			} else {
				dispatch(getOrdenServicioGeneralId(routeParams.id)).then(action => {
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
			dispatch(resetOrdenServicioGeneral());
			setNoExisteFamilia(false);
		};
	}, [dispatch]);

	if (noExisteFamilia) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontro la orden de servicio!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/logistica/ordenes-servicio-general"
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
				<OrdenServicioGeneralHeader
					tipo={routeParams.id}
					descripcion={descripcion}
					data={{
						codigo,
						prenda,
						currentTipoOrdenServicio,
						currentProduccion,
						currentEstilo,
						currentTipoOrden,
						currentTipoServicio,
						currentGuiasRemision,
						currentFechaEntrega,
						currentProveedor,
						currentMoneda,
						currentFormaPago,
						currentAtencion,
						currentObservacionGeneral,
						cantidadesData,
						currentEstado,
						currentFechaEmision,
					}}
				/>
			}
			content={
				<div className="p-16 sm:p-24 ">
					<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Detalles</div>
					<div>
						<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
							<TipoProduccion
								current={currentTipoOrdenServicio}
								setCurrent={setCurrentTipoOrdenServicio}
								disabled={disabled}
							/>
						</div>
						<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
							<Produccion
								getProducciones={setProduccionesST}
								producciones={producciones}
								setCurrentProduccion={setCurrentProduccion}
								currentProduccion={currentProduccion}
								resetProduccion={resetProduccion}
								currentTipoServicio={currentTipoServicio}
								disabled={!currentTipoOrdenServicio || producciones.length === 0 || disabled}
							/>
							<Estilos
								opciones={estilos}
								setValue={setCurrentEstilo}
								value={currentEstilo}
								reset={resetEstilo}
								disabled={!currentProduccion || estilos.length === 0 || disabled}
							/>
							<TipoOrden
								opciones={rutas}
								current={currentTipoOrden}
								setCurrent={setCurrentTipoOrden}
								disabled={disabled}
							/>
							<TipoServicio
								current={currentTipoServicio}
								setCurrent={setCurrentTipoServicio}
								disabled={disabled}
							/>
						</div>
						<div className="flex flex-col sm:flex-row mr-24 sm:mr-4 mt-2">
							<GuiasRemision
								currentGuiasRemision={currentGuiasRemision}
								setCurrentGuiasRemision={setCurrentGuiasRemision}
								disabled={disabled}
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
							<InputString
								label="Atencion a"
								value={currentAtencion}
								onChange={event => {
									setCurrentAtencion(event.target.value);
								}}
							/>
						</div>
						<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
							<ObservacionGeneral
								currentObservacionGeneral={currentObservacionGeneral}
								setCurrentObservacionGeneral={setCurrentObservacionGeneral}
								disabled={disabled}
							/>
						</div>
						<div className="flex flex-col mx-24">
							{prenda && <h5 className="my-24">{`${prenda?.codigo} - ${prenda?.nombre}`}</h5>}
							{cantidadesData.map(item => {
								return (
									<Cantidades
										key={FuseUtils.generateGUID()}
										onChange={values => {
											setCantidadesData(values);
										}}
										items={cantidadesData}
										row={item}
										currentTipoServicio={currentTipoServicio}
										colores={colores}
									/>
								);
							})}
							<IconButton
								className="w-[calc(100%-30px)] h-fit py-14 flex items-center justify-center rounded-8 overflow-hidden cursor-pointer shadow hover:shadow-md"
								aria-label="add"
								size="medium"
								color="primary"
								style={{
									height: '46px',
									marginLeft: '20px',
									// backgroundColor: '#ccf0df',
									backgroundColor: 'rgb(2 136 209)',
								}}
								onClick={() => {
									setCantidadesData(curr => [
										...curr,
										{
											id: FuseUtils.generateGUID(),
											cantidad: 0,
											unidadMedida: null,
											codigo: '',
											descripcion: '',
											color: '',
											precioUnitario: 0,
											igv: 0,
										},
									]);
								}}
								disabled={!currentTipoServicio}
							>
								<h5 style={{ color: 'white', fontWeight: 'bold' }}>Agregar item</h5>
								&nbsp;
								<AddCircleOutlineIcon style={{ fontSize: '30px', color: 'white' }} />
							</IconButton>
						</div>
						<div>
							{cantidadesData && (
								<Resumen data={cantidadesData} currentTipoServicio={currentTipoServicio} />
							)}
						</div>
					</div>
				</div>
			}
			innerScroll
		/>
	);
};

export default withReducer('logistica', reducer)(OrdenServicioGeneral);

/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
import debounce from 'lodash.debounce';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';
import withReducer from 'app/store/withReducer';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useDeepCompareEffect } from '@fuse/hooks';
import { Button, IconButton, Typography } from '@mui/material';
import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'framer-motion';
import httpClient from 'utils/Api';
import showToast from 'utils/Toast';
import FuseUtils from '@fuse/utils/FuseUtils';
import { toast } from 'react-toastify';
import { motivosTraslado, unidadesSunat } from 'constants/constantes';
import reducer from '../../store';
import GuiaRemisionHeader from './guiaRemisionHeader';
import {
	getGuiaRemisionId,
	newGuiaRemision,
	resetGuiaRemision,
} from '../../store/guiaRemision/guiaRemisionSlice';
import InputSelect from '../../controlFacturas/controlFactura/components/inputSelect';
import InputString from '../../controlFacturas/controlFactura/components/inputString';
import InputNumber from '../../controlFacturas/controlFactura/components/inputNumber';
import {
	getChoferesService,
	getClientesNacionalesService,
	getVehiculosService,
} from '../../../../services/services';

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

const GuiaRemision = () => {
	const dispatch = useDispatch();
	const routeParams = useParams();

	const model = useSelector(({ logistica }) => logistica.model);

	const [disabled, setDisabled] = useState(false);
	const [noExiste, setNoExiste] = useState(false);

	const [currentItems, setCurrentItems] = useState([]);
	const [currentChofer, setCurrentChofer] = useState(null);
	const [currentVehiculo, setCurrentVehiculo] = useState(null);
	const [currentPesoTotal, setCurrentPesoTotal] = useState(0);
	const [currentCliente, setCurrentCliente] = useState(null);
	// const [currentDocumento, setCurrentDocumento] = useState(null);
	const [currentMotivoTraslado, setCurrentMotivoTraslado] = useState(null);
	// const [currentNumeroDocumento, setCurrentNumeroDocumento] = useState('');
	// const [currentUbigeoOrigen, setCurrentUbigeoOrigen] = useState('');
	// const [currentDireccionOrigen, setCurrentDireccionOrigen] = useState('');
	// const [currentUbigeoDestino, setCurrentUbigeoDestino] = useState('');
	const [currentDireccionDestino, setCurrentDireccionDestino] = useState(null);
	const [currentObservacion, setCurrentObservacion] = useState('');

	const [choferes, setChoferes] = useState([]);
	const [vehiculos, setVehiculos] = useState([]);
	const [clientes, setClientes] = useState([]);
	const [direccionesRazonSocial, setDireccionesRazonSocial] = useState([]);

	const [choferesSearchText, setChoferesSearchText] = useState('');
	const [vehiculosSearchText, setVehiculosSearchText] = useState('');
	const [clientesSearchText, setClientesSearchText] = useState('');

	const getChoferes = async busqueda => {
		const data = await getChoferesService(busqueda);
		if (data) setChoferes(data);
	};

	const debouncedTraerChoferes = debounce(() => {
		getChoferes(choferesSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerChoferes(); // Llamar a la versión debounced de fetchData
		return debouncedTraerChoferes.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [choferesSearchText]);

	const getVehiculos = async busqueda => {
		const data = await getVehiculosService(busqueda);
		if (data) setVehiculos(data);
	};

	const debouncedTraerVehiculos = debounce(() => {
		getVehiculos(vehiculosSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerVehiculos(); // Llamar a la versión debounced de fetchData
		return debouncedTraerVehiculos.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [vehiculosSearchText]);

	const getClientes = async busqueda => {
		const data = await getClientesNacionalesService(busqueda);
		setClientes(data);
	};

	const debouncedTraerClientes = debounce(() => {
		getClientes(clientesSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerClientes(); // Llamar a la versión debounced de fetchData
		return debouncedTraerClientes.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [clientesSearchText]);

	const obtenerData = async id => {
		setDisabled(true);
		await showToast(
			{
				promesa: async () => {
					const {
						data: { statusCode, body },
					} = await httpClient.get(`comprobantes/guias-remision/${id}`);
					if (statusCode === 200) {
						await getChoferes(body.chofer.dni);
						await getVehiculos(body.vehiculo.placa);
						await getClientes(body.cliente.ruc);
						//* Seteamos los datos del vehiculo
						setCurrentVehiculo({
							...body.vehiculo,
							key: body.vehiculo.id,
							label: body.vehiculo.placa,
						});
						//* Seteamos los datos del chofer
						setCurrentChofer({
							...body.chofer,
							key: body.chofer.id,
							label: body.chofer.dni,
						});
						//* Seteamos los datos del igvTotal
						setCurrentPesoTotal(parseFloat(body.peso_total));
					}
					setDisabled(false);
					return { payload: { message: 'Guia encontrada' } };
				},
				parametros: [],
			},
			'buscar',
			'Guia'
		);
	};

	useEffect(() => {
		if (routeParams.id === 'nuevo') {
			getChoferes();
			getVehiculos();
			getClientes();
		}
	}, []);

	useDeepCompareEffect(() => {
		function updateFamiliaState() {
			if (routeParams.id === 'nuevo') {
				dispatch(newGuiaRemision());
			} else {
				dispatch(getGuiaRemisionId(routeParams.id)).then(action => {
					if (!action.payload) {
						setNoExiste(true);
					}
				});
				obtenerData(routeParams.id);
			}
		}

		updateFamiliaState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		return () => {
			dispatch(resetGuiaRemision());
			setNoExiste(false);
		};
	}, [dispatch]);

	if (noExiste) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontro la guia!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/logistica/guia-remision"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (model && parseInt(routeParams.id, 10) !== model.id && routeParams.id !== 'nuevo') {
		return <FuseLoading />;
	}

	return (
		<Root
			header={
				<GuiaRemisionHeader
					tipo={routeParams.id}
					data={{
						currentObservacion,
						currentMotivoTraslado,
						// currentDocumento,
						// currentNumeroDocumento,
						currentItems,
						currentChofer,
						currentVehiculo,
						currentPesoTotal,
						currentCliente,
						// currentUbigeoOrigen,
						// currentDireccionOrigen,
						// currentUbigeoDestino,
						currentDireccionDestino,
					}}
				/>
			}
			content={
				<div className="p-16 sm:p-24 ">
					<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Detalles</div>
					<div>
						<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
							<InputSelect
								label="Razon Social"
								onSearch={setClientesSearchText}
								options={clientes.map(cliente => ({
									...cliente,
									key: cliente.id,
									label: `${
										cliente.tipoRespuesta === 'C'
											? cliente.tipoCliente === 'N'
												? cliente.tipo === 'J'
													? `${cliente.razónSocial}`
													: `${cliente.natNombres} ${cliente.natApellidoPaterno}`
												: `${cliente.razónSocial}`
											: cliente.tipo === 'J'
											? cliente.tipo === 'J'
												? cliente.razonSocial
												: `${cliente.apellidoPaterno} ${cliente.apellidoMaterno} ${cliente.nombres}`
											: `${cliente.apellidoPaterno} ${cliente.apellidoMaterno} ${cliente.nombres}`
									} - ${
										cliente.tipoRespuesta === 'P'
											? cliente.ruc || cliente.nroDocumento
											: cliente.ruc || cliente.natNroDocumento
									}`,
								}))}
								value={currentCliente}
								onChange={(e, newValue) => {
									if (newValue) {
										const direcciones = [];
										newValue.direccionesAlternativas.forEach(d => {
											if (!!d.direccion && d.ubigeo !== null) {
												direcciones.push({ direccion: d.direccion, ubigeo: d.ubigeo });
											}
										});
										if (!!newValue.direccion && newValue.ubigeo !== null) {
											direcciones.push({ direccion: newValue.direccion, ubigeo: newValue.ubigeo });
										}
										if (direcciones.length === 0) {
											toast.error('El cliente no tiene direccion y ubigeo registrados');
										}
										setDireccionesRazonSocial(direcciones);
									}
									setCurrentCliente(newValue);
								}}
								disabled={disabled}
							/>
							<InputNumber
								label="Peso Total en KG"
								value={currentPesoTotal}
								onChange={event => {
									setCurrentPesoTotal(event.target.value);
								}}
								disabled={disabled}
								suffix="KG"
							/>
						</div>
						{/* <div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
							<InputSelect
								label="Tipo de Documento"
								options={[
									{ id: 'B', key: 'B', label: 'BOLETA' },
									{ id: 'F', key: 'F', label: 'FACTURA' },
								]}
								value={currentDocumento}
								onChange={(e, newValue) => setCurrentDocumento(newValue)}
								disabled={disabled}
							/>
							<InputString
								label="Numero de documento"
								value={currentNumeroDocumento}
								onChange={event => {
									setCurrentNumeroDocumento(event.target.value);
								}}
								disabled={disabled}
							/>
						</div> */}
						<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
							<InputSelect
								label="Chofer"
								onSearch={setChoferesSearchText}
								options={choferes.map(chofer => ({
									...chofer,
									key: chofer.id,
									label: `${chofer.licencia} - ${chofer.nombre} ${chofer.apellido}`,
								}))}
								value={currentChofer}
								onChange={(e, newValue) => setCurrentChofer(newValue)}
								disabled={disabled}
							/>
							<InputSelect
								label="Vehiculo"
								onSearch={setVehiculosSearchText}
								options={vehiculos.map(vehiculo => ({
									...vehiculo,
									key: vehiculo.id,
									label: `${vehiculo.placa} - ${vehiculo.marca} ${vehiculo.modelo}`,
								}))}
								value={currentVehiculo}
								onChange={(e, newValue) => setCurrentVehiculo(newValue)}
								disabled={disabled}
							/>
						</div>
						<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
							<InputSelect
								label="Motivo de traslado"
								options={motivosTraslado}
								value={currentMotivoTraslado}
								onChange={(e, newValue) => setCurrentMotivoTraslado(newValue)}
								disabled={disabled}
							/>
							<InputString
								label="Observacion"
								value={currentObservacion}
								onChange={event => {
									if (event.target.value.length <= 100) setCurrentObservacion(event.target.value);
								}}
								disabled={disabled}
							/>
						</div>
						<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Direccion</div>
						{/* <div className="mx-6 mb-16 mt-12 sm:mt-4 text-xs">Origen</div>
						<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
							<InputString
								label="Ubigeo de Origen"
								value={currentUbigeoOrigen}
								onChange={event => {
									setCurrentUbigeoOrigen(event.target.value);
								}}
								disabled
							/>
							<InputString
								label="Direccion de Origen"
								value={currentDireccionOrigen}
								onChange={event => {
									setCurrentDireccionOrigen(event.target.value);
								}}
								disabled
							/>
						</div> */}
						{/* <div className="mx-6 mb-16 mt-12 sm:mt-4 text-xs">Destino</div> */}
						<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
							{/* <InputString
								label="Ubigeo de Destino"
								value={currentUbigeoDestino}
								onChange={event => {
									setCurrentUbigeoDestino(event.target.value);
								}}
								disabled={disabled}
							/>
							<InputString
								label="Direccion de Destino"
								value={currentDireccionDestino}
								onChange={event => {
									setCurrentDireccionDestino(event.target.value);
								}}
								disabled={disabled}
							/> */}
							<InputSelect
								label="Direccion de Destino"
								options={direccionesRazonSocial.map(direccion => ({
									...direccion,
									label: `${direccion.direccion} - ${direccion.ubigeo}`,
								}))}
								value={currentDireccionDestino}
								onChange={(e, newValue) => setCurrentDireccionDestino(newValue)}
								disabled={disabled || direccionesRazonSocial.length === 0}
							/>
						</div>
						<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Items</div>
						<div className="flex flex-col mr-24 sm:mr-4">
							{currentItems.map(item => {
								return (
									<Items
										key={FuseUtils.generateGUID()}
										onChange={values => {
											setCurrentItems(values);
										}}
										items={currentItems}
										row={item}
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
									setCurrentItems(curr => [
										...curr,
										{
											id: FuseUtils.generateGUID(),
											codigo: '',
											descripcion: '',
											cantidad: 0,
											unidad: null,
										},
									]);
								}}
							>
								<h5 style={{ color: 'white', fontWeight: 'bold' }}>Agregar item</h5>
								&nbsp;
								<AddCircleOutlineIcon style={{ fontSize: '30px', color: 'white' }} />
							</IconButton>
						</div>
					</div>
				</div>
			}
			innerScroll
		/>
	);
};

const Items = ({ onChange, items, row }) => {
	const [currentCodigo, setCurrentCodigo] = useState(row.codigo);
	const [currentDescripcion, setCurrentDescripcion] = useState(row.descripcion);
	const [currentCantidad, setCurrentCantidad] = useState(row.cantidad);

	const actualizar = (val, key) => {
		const itemsCopy = structuredClone(items);
		itemsCopy.forEach(item => {
			if (item.id === row.id) {
				item[key] = val;
			}
		});
		onChange(itemsCopy);
	};

	return (
		<div
			className="flex flex-row"
			style={{
				alignItems: 'center',
				width: 'calc(100%-30px)',
				margin: 0,
				padding: 0,
				marginLeft: '12px',
				marginRight: '12px',
				marginBottom: '12px',
			}}
		>
			<InputString
				label="Codigo"
				value={currentCodigo}
				onBlur={event => {
					actualizar(event.target.value, 'codigo');
				}}
				onChange={event => {
					setCurrentCodigo(event.target.value);
				}}
			/>
			<InputString
				label="Descripcion"
				value={currentDescripcion}
				onBlur={event => {
					actualizar(event.target.value, 'descripcion');
				}}
				onChange={event => {
					setCurrentDescripcion(event.target.value);
				}}
			/>
			<InputSelect
				label="Unidad"
				options={unidadesSunat}
				value={row.unidad}
				onChange={(e, newValue) => actualizar(newValue, 'unidad')}
			/>
			<InputNumber
				label="Cantidad"
				value={currentCantidad}
				onBlur={event => {
					actualizar(event.target.value, 'cantidad');
				}}
				onChange={event => {
					setCurrentCantidad(event.target.value);
				}}
			/>
			<div
				style={{ backgroundColor: '#F5FBFA', /* marginBottom: '100px',  */ borderRadius: '50px' }}
			>
				<IconButton
					aria-label="delete"
					color="error"
					onClick={() => {
						const itemsCopy = structuredClone(items);
						const itemsDelete = itemsCopy.filter(item => item.id !== row.id);
						onChange(itemsDelete);
					}}
				>
					<DeleteForeverIcon />
				</IconButton>
			</div>
		</div>
	);
};

export default withReducer('logistica', reducer)(GuiaRemision);

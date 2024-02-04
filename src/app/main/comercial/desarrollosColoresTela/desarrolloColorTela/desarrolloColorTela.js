/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
import FusePageCarded from '@fuse/core/FusePageCarded';
import debounce from 'lodash.debounce';
import { styled } from '@mui/material/styles';
import withReducer from 'app/store/withReducer';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import { Button, Typography } from '@mui/material';
import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'framer-motion';
import httpClient from 'utils/Api';
import showToast from 'utils/Toast';

import { getClientesService, getProveedoresService } from 'app/services/services';

import { InputSelect, InputString } from 'app/UI';

import DesarrolloColorTelaHeader from './desarrolloColorTelaHeader';

import reducer from '../../store';
import {
	getDesarrolloColorTelaId,
	newDesarrolloColorTela,
	resetDesarrolloColorTela,
} from '../../store/desarrolloColorTela/desarrolloColorTelaSlice';

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

const DesarrolloColorTela = () => {
	const dispatch = useDispatch();
	const routeParams = useParams();

	const model = useSelector(({ logistica }) => logistica.model);

	const [disabled, setDisabled] = useState(false);
	const [noExiste, setNoExiste] = useState(false);

	const [currentProveedor, setCurrentProveedor] = useState(null);
	const [currentCliente, setCurrentCliente] = useState(null);
	const [currentMarca, setCurrentMarca] = useState(null);
	const [currentTipoTela, setCurrentTipoTela] = useState('');
	const [currentPantone, setCurrentPantone] = useState('');
	const [currentComposicion, setCurrentComposicion] = useState('');
	const [currentTipoTenido, setCurrentTipoTenido] = useState('');
	const [currentColorSG, setCurrentColorSG] = useState('');
	const [currentColorCliente, setCurrentColorCliente] = useState('');

	const [proveedores, setProveedores] = useState([]);
	const [clientes, setClientes] = useState([]);
	const [marcas, setMarcas] = useState([]);

	const [proveedorSearchText, setProveedorSearchText] = useState('');
	const [clienteSearchText, setClienteSearchText] = useState('');

	const getProveedores = async busqueda => {
		const data = await getProveedoresService(busqueda);
		if (data) setProveedores(data);
	};

	const debouncedTraerProveedores = debounce(() => {
		getProveedores(proveedorSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerProveedores(); // Llamar a la versión debounced de fetchData
		return debouncedTraerProveedores.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [proveedorSearchText]);

	const getClientes = async busqueda => {
		const data = await getClientesService(busqueda);
		if (data) setClientes(data);
	};

	const debouncedTraerClientes = debounce(() => {
		getClientes(proveedorSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerClientes(); // Llamar a la versión debounced de fetchData
		return debouncedTraerClientes.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [clienteSearchText]);

	useEffect(() => {
		if (currentCliente) setMarcas(currentCliente.marcas);
	}, [currentCliente]);

	const obtenerData = async id => {
		setDisabled(true);
		await showToast(
			{
				promesa: async () => {
					const {
						data: { statusCode, body },
					} = await httpClient.get(`comercial/desarrollo-color-tela/${id}`);
					if (statusCode === 200) {
						await getProveedores(
							body.proveedor.tipo === 'N' ? body.proveedor.ruc : body.proveedor.nroDocumento
						);
						//* Seteamos los datos del proveedor
						setCurrentProveedor({
							...body.proveedor,
							key: body.proveedor.id,
							label: `${
								body.proveedor.tipo === 'N'
									? `${body.proveedor.apellidoPaterno} ${body.proveedor.apellidoMaterno}, ${body.proveedor.nombres}`
									: body.proveedor.razonSocial
							}`,
						});
						await getClientes(
							body.cliente.tipo === 'N' ? body.cliente.natNroDocumento : body.cliente.ruc
						);
						//* Seteamos los datos del cliente
						setCurrentCliente({
							...body.cliente,
							key: body.cliente.id,
							label:
								body.cliente.tipoCliente === 'N'
									? body.cliente.tipo === 'J'
										? `${body.cliente.razónSocial}`
										: `${body.cliente.natNombres} ${body.cliente.natApellidoPaterno}`
									: `${body.cliente.razónSocial}`,
						});
						//* Seteamos los datos del marca
						setCurrentMarca({
							...body.marca,
							key: body.marca.id,
							label: body.marca.marca,
						});
						//* Seteamos los datos del marca
						setCurrentColorSG(body.colorSG);
						setCurrentColorCliente(body.colorCliente);
						setCurrentComposicion(body.composicion);
						setCurrentPantone(body.pantone);
						setCurrentTipoTela(body.tipoTela);
						setCurrentTipoTenido(body.tipoTenido);
					}
					setDisabled(false);
					return { payload: { message: 'Solicitud encontrada' } };
				},
				parametros: [],
			},
			'buscar',
			'Solicitud'
		);
	};

	useEffect(() => {
		if (routeParams.id === 'nuevo') {
			getProveedores();
		}
	}, []);

	useDeepCompareEffect(() => {
		(() => {
			if (routeParams.id === 'nuevo') {
				dispatch(newDesarrolloColorTela());
			} else {
				dispatch(getDesarrolloColorTelaId(routeParams.id)).then(action => {
					if (!action.payload) {
						setNoExiste(true);
					}
				});
				obtenerData(routeParams.id);
			}
		})();
	}, [dispatch, routeParams]);
	

	useEffect(() => {
		return () => {
			dispatch(resetDesarrolloColorTela());
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
					No se encontro la solicitud!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/comercial/desarrollo-color-tela"
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
				<DesarrolloColorTelaHeader
					tipo={routeParams.id}
					data={{
						currentProveedor,
						currentCliente,
						currentMarca,
						currentTipoTela,
						currentPantone,
						currentComposicion,
						currentTipoTenido,
						currentColorSG,
						currentColorCliente,
					}}
				/>
			}
			content={
				<div className="p-16 sm:p-24 ">
					<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Detalles</div>
					<div>
						<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
							<InputSelect
								label="Proveedor"
								onSearch={setProveedorSearchText}
								options={proveedores.map(e => ({
									...e,
									label: `${
										e.tipo === 'N'
											? `${e.apellidoPaterno} ${e.apellidoMaterno}, ${e.nombres}`
											: e.razonSocial
									}`,
									key: e.id,
								}))}
								value={currentProveedor}
								onChange={(e, newValue) => setCurrentProveedor(newValue)}
								disabled={disabled}
							/>
							<InputSelect
								label="Cliente"
								onSearch={setClienteSearchText}
								options={clientes.map(cliente => ({
									...cliente,
									label:
										cliente.tipoCliente === 'N'
											? cliente.tipo === 'J'
												? `${cliente.razónSocial}`
												: `${cliente.natNombres} ${cliente.natApellidoPaterno}`
											: `${cliente.razónSocial}`,
									key: cliente.id,
								}))}
								value={currentCliente}
								onChange={(e, newValue) => setCurrentCliente(newValue)}
								disabled={disabled}
							/>
							<InputSelect
								label="Marca"
								options={marcas.map(marca => ({
									...marca,
									key: marca.id,
									label: marca.marca,
								}))}
								value={currentMarca}
								onChange={(e, newValue) => setCurrentMarca(newValue)}
								disabled={disabled}
							/>
						</div>
						<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
							<InputString
								label="Tipo de Tela"
								value={currentTipoTela}
								onChange={event => {
									setCurrentTipoTela(event.target.value);
								}}
								disabled={disabled}
							/>
							<InputString
								label="Pantone"
								value={currentPantone}
								onChange={event => {
									setCurrentPantone(event.target.value);
								}}
								disabled={disabled}
							/>
							<InputString
								label="Composicion"
								value={currentComposicion}
								onChange={event => {
									setCurrentComposicion(event.target.value);
								}}
								disabled={disabled}
							/>
						</div>
						<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
							<InputString
								label="Tipo de Teñido"
								value={currentTipoTenido}
								onChange={event => {
									setCurrentTipoTenido(event.target.value);
								}}
								disabled={disabled}
							/>
							<InputString
								label="Color SG"
								value={currentColorSG}
								onChange={event => {
									setCurrentColorSG(event.target.value);
								}}
								disabled={disabled}
							/>
							<InputString
								label="Color Cliente"
								value={currentColorCliente}
								onChange={event => {
									setCurrentColorCliente(event.target.value);
								}}
								disabled={disabled}
							/>
						</div>
					</div>
				</div>
			}
			innerScroll
		/>
	);
};

export default withReducer('comercial', reducer)(DesarrolloColorTela);

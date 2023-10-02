import FusePageCarded from '@fuse/core/FusePageCarded';
import debounce from 'lodash.debounce';
import { styled } from '@mui/material/styles';
import withReducer from 'app/store/withReducer';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDeepCompareEffect } from '@fuse/hooks';
import { Button, Typography } from '@mui/material';
import _ from '@lodash';
import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'framer-motion';
import httpClient from 'utils/Api';
import {
	getOCTelaId,
	newOCTela,
	resetOCTela,
} from '../../store/ordenCompraTela/ordenCompraTelaSlice';
import reducer from '../../store';
import OrdenCompraTelaHeader from './ordenCompraTelaHeader';
import InformacionBasica from './tabs/informacionBasica';

import { getFormaPagosService, getProveedoresService } from './services';

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

const schema = yup.object().shape({
	nombre: yup
		.string()
		.required('El nombre es requerido')
		.min(5, 'El nombre debe tener al menos 5 caracteres'),
	direccion: yup.string().required('Dirección es requerido'),
	telefono: yup.lazy(value =>
		value === ''
			? yup.string()
			: yup
					.number()
					.test(
						'len',
						'Debe especificar un telefono valido',
						val => val.toString().length === 0 || val.toString().length === 9
					)
	),
	email: yup.string().email('Debe especificar un email valido'),
	ruc: yup
		.number()
		.required('Ruc es requerido')
		.typeError('Debe especificar un RUC valido')
		.test('len', 'Debe especificar un RUC valido', val => val.toString().length === 11),
	modulos: yup.array().required('Modulos es requerido'),
});

const OrdenCompraTela = () => {
	const dispatch = useDispatch();
	const ordenCompraTela = useSelector(({ comercial }) => comercial.ordenCompraTela);

	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [codigo, setCodigo] = useState('');
	const [noExisteOrdenCompraTela, setNoExisteOrdenCompraTela] = useState(false);
	const methods = useForm({
		mode: 'all',
		// defaultValues: {},
		resolver: yupResolver(schema),
	});
	const { reset, watch, control, onChange, formState } = methods;
	const form = watch();

	const [disabled, setDisabled] = useState(false);
	const [currentProveedor, setCurrentProveedor] = useState(null);
	const [currentMoneda, setCurrentMoneda] = useState(null);
	const [currentFormaPago, setCurrentFormaPago] = useState(null);

	const [partidas, setPartidas] = useState([]);
	const [produccionesIgnoradas, setProduccionesIgnoradas] = useState([]);
	const [proveedores, setProveedores] = useState([]);
	const [uniqueFormasPago, setUniqueFormasPago] = useState([]);

	const [proveedorSearchText, setProveedorSearchText] = useState('');
	const [formaPagoSearchText, setFormaPagoSearchText] = useState('');

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

	const getFormaPagos = async busqueda => {
		const data = await getFormaPagosService(busqueda);
		if (data) setUniqueFormasPago(data);
	};

	const debouncedGetFormaPagos = debounce(() => {
		getFormaPagos(formaPagoSearchText);
	}, 500);

	useEffect(() => {
		debouncedGetFormaPagos(); // Llamar a la versión debounced de fetchData
		return debouncedGetFormaPagos.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [formaPagoSearchText]);

	useEffect(() => {
		if (routeParams.id === 'nuevo') {
			getProveedores();
			getFormaPagos();
		}
	}, []);

	// promesa que esperara un segundo
	const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

	const obtenerData = async id => {
		const {
			data: { statusCode, body },
		} = await httpClient.get(`comercial/compra-telas/${id}`);
		if (statusCode === 200) {
			console.log(body);
			setCodigo(body.codigo);
			//* Seteamos los datos del proveedor
			if (body.proveedor) setCurrentProveedor(body.proveedor);
			await sleep(1000);
			//* Seteamos los datos de la moneda
			if (body.moneda)
				setCurrentMoneda({
					id: body.moneda,
					key: body.moneda,
					label: body.moneda,
				});
			//* Seteamos los datos de la forma de pago
			if (body.formaPago) setCurrentFormaPago(body.formaPago);
		}
	};

	useDeepCompareEffect(() => {
		getProveedores();
		function updateOrdenCompraTelaState() {
			const { id } = routeParams;
			if (id === 'nuevo') {
				dispatch(newOCTela());
			} else {
				dispatch(getOCTelaId(id)).then(action => {
					if (!action.payload) {
						setNoExisteOrdenCompraTela(true);
					}
				});
				obtenerData(routeParams.id);
			}
		}

		updateOrdenCompraTelaState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!ordenCompraTela) {
			return;
		}

		reset(ordenCompraTela);
	}, [ordenCompraTela, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetOCTela());
			setNoExisteOrdenCompraTela(false);
		};
	}, [dispatch]);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	useEffect(() => {
		if (currentProveedor) {
			if (currentProveedor.moneda) {
				setCurrentMoneda({
					id: currentProveedor.moneda,
					key: currentProveedor.moneda,
					label: currentProveedor.moneda,
				});
			}
			if (currentProveedor.formaPago) {
				setCurrentFormaPago(currentProveedor.formaPago);
			}
		}
	}, [currentProveedor]);

	if (noExisteOrdenCompraTela) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontro el ordenCompraTela!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/comercial/ordenCompraTelas"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (
		_.isEmpty(form) ||
		(ordenCompraTela &&
			parseInt(routeParams.id, 10) !== ordenCompraTela.id &&
			routeParams.id !== 'nuevo')
	) {
		return <FuseLoading />;
	}
	return (
		<FormProvider {...methods}>
			<Root
				header={
					<OrdenCompraTelaHeader
						tipo={routeParams.id}
						codigo={codigo}
						currentProveedor={currentProveedor}
						currentMoneda={currentMoneda}
						currentFormaPago={currentFormaPago}
						partidas={partidas}
					/>
				}
				content={
					<div className="p-16 sm:p-24 ">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							{/* <InformacionPdf /> */}
							<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Detalles</div>
							<InformacionBasica
								routeParams={routeParams}
								setCodigo={setCodigo}
								getProveedores={setProveedorSearchText}
								proveedores={proveedores}
								currentProveedor={currentProveedor}
								setCurrentProveedor={setCurrentProveedor}
								resetProveedor={resetProveedor}
								disabled={disabled}
								currentMoneda={currentMoneda}
								setCurrentMoneda={setCurrentMoneda}
								resetMoneda={resetMoneda}
								getFormaPagos={setFormaPagoSearchText}
								uniqueFormasPago={uniqueFormasPago}
								currentFormaPago={currentFormaPago}
								setCurrentFormaPago={setCurrentFormaPago}
								resetFormaPago={resetFormaPago}
								tipo={routeParams.id}
								partidas={partidas}
								setPartidas={setPartidas}
								produccionesIgnoradas={produccionesIgnoradas}
								setProduccionesIgnoradas={setProduccionesIgnoradas}
							/>
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
};

export default withReducer('comercial', reducer)(OrdenCompraTela);

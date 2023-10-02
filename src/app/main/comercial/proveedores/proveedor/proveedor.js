import FusePageCarded from '@fuse/core/FusePageCarded';
import debounce from 'lodash.debounce';
import { styled } from '@mui/material/styles';
import withReducer from 'app/store/withReducer';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { limitCombo, offsetCombo } from 'constants/constantes';
import httpClient from 'utils/Api';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDeepCompareEffect } from '@fuse/hooks';
import { Button, Typography } from '@mui/material';
import _ from '@lodash';
import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'framer-motion';
import { getProveedorId, newProveedor, resetProveedor } from '../../store/proveedor/proveedorSlice';
import reducer from '../../store';
import ProveedorHeader from './proveedorHeader';
import InformacionBasica from './tabs/informacionBasica';
import CuentasBanco from './tabs/banco';
import Contacto from './tabs/contacto';
import DetraccionProveedor from './tabs/detraccion';
import MetodoPago from './tabs/metodoPago';
import TipoServicio from './tabs/tipoServicio';
import DireccionesAlternativas from './tabs/direccionesAlternativas';

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
	direccion: yup.string().required('Dirección es requerida'),
	// telefono: yup.lazy(value =>
	// 	value === ''
	// 		? yup.string()
	// 		: yup
	// 				.number()
	// 				.test(
	// 					'len',
	// 					'Debe especificar un telefono valido',
	// 					val => val.toString().length === 0 || val.toString().length === 9
	// 				)
	// ),
	celular: yup.lazy(value =>
		value === ''
			? yup.string()
			: yup
					.number()
					.test(
						'len',
						'Debe especificar un celular valido',
						val => val.toString().length === 0 || val.toString().length === 9
					)
	),
	email: yup.string().email('Debe especificar un email valido'),
	ruc: yup
		.number()
		.required('Ruc es requerido')
		.typeError('Debe especificar un RUC valido')
		.test('len', 'Debe especificar un RUC valido', val => val.toString().length === 11),
});

const Proveedor = () => {
	const dispatch = useDispatch();
	const proveedor = useSelector(({ comercial }) => comercial.proveedor);

	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [noExisteProveedor, setNoExisteProveedor] = useState(false);
	const [ubigeosSearchText, setUbigeosSearchText] = useState('');
	const [ubigeos, setUbigeos] = useState([]);
	const methods = useForm({
		mode: 'all',
		// defaultValues: {},
		resolver: yupResolver(schema),
	});
	const { reset, watch, control, onChange, formState } = methods;
	const form = watch();

	const getUbigeos = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `ubigeo?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setUbigeos(data.map(ubigeo => ({ ...ubigeo, label: ubigeo.distrito, key: ubigeo.codigo })));
	};

	const debouncedTraerUbigeos = debounce(() => {
		getUbigeos(ubigeosSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerUbigeos(); // Llamar a la versión debounced de fetchData
		return debouncedTraerUbigeos.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [ubigeosSearchText]);

	useDeepCompareEffect(() => {
		function updateProveedorState() {
			const { id } = routeParams;
			if (id === 'nuevo') {
				dispatch(newProveedor());
			} else {
				dispatch(getProveedorId(id)).then(action => {
					if (!action.payload) {
						setNoExisteProveedor(true);
					}
				});
			}
		}

		updateProveedorState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!proveedor) {
			return;
		}

		reset(proveedor);
	}, [proveedor, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetProveedor());
			setNoExisteProveedor(false);
		};
	}, [dispatch]);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (noExisteProveedor) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontro el proveedor!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/comercial/proveedores"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (
		_.isEmpty(form) ||
		(proveedor && parseInt(routeParams.id, 10) !== proveedor.id && routeParams.id !== 'nuevo')
	) {
		return <FuseLoading />;
	}
	return (
		<FormProvider {...methods}>
			<Root
				header={<ProveedorHeader tipo={routeParams.id} />}
				content={
					<div className="p-16 sm:p-24 ">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Datos</div>
							<InformacionBasica ubigeos={ubigeos} getUbigeos={setUbigeosSearchText} />
							<div className="mx-6 my-16 text-base">Contacto</div>
							<Contacto ubigeos={ubigeos} getUbigeos={setUbigeosSearchText} />
							<div className="mx-6 my-16 text-base">Direcciones Alternativas</div>
							<DireccionesAlternativas />
							<div className="mx-6 my-16 text-base">Banco</div>
							<CuentasBanco />
							<div className="mx-6 my-16 text-base">Detracción</div>
							<DetraccionProveedor />
							<div className="mx-6 my-16 text-base">Método de Pago</div>
							<MetodoPago />
							<div className="mx-6 my-16 text-base">Tipo de Servicio</div>
							<TipoServicio />
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
};

export default withReducer('comercial', reducer)(Proveedor);

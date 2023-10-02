import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';
import withReducer from 'app/store/withReducer';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import debounce from 'lodash.debounce';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDeepCompareEffect } from '@fuse/hooks';
import { Button, Typography } from '@mui/material';
import _ from '@lodash';
import { limitCombo, offsetCombo } from 'constants/constantes';
import httpClient from 'utils/Api';
import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'framer-motion';
import reducer from '../../store';
import InformacionBasica from './tabs/informacionBasica';
import { getClienteId, newCliente, resetCliente } from '../../store/cliente/clienteSlice';
import ClienteHeader from './clienteHeader';
import Contacto from './tabs/contacto';
import DetraccionCliente from './tabs/detraccion';
import Marcas from './tabs/marcas';
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
	nombre: yup
		.string()
		.required('El nombre es requerido')
		.min(5, 'El nombre debe tener al menos 5 caracteres'),
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

const Cliente = () => {
	const dispatch = useDispatch();
	const cliente = useSelector(({ comercial }) => comercial.cliente);
	const [ubigeos, setUbigeos] = useState([]);
	const [ubigeosSearchText, setUbigeosSearchText] = useState('');

	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [noExisteCliente, setNoExisteCliente] = useState(false);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
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
		function updateClienteState() {
			const { id } = routeParams;
			if (id === 'nuevo') {
				dispatch(newCliente());
			} else {
				dispatch(getClienteId(id)).then(action => {
					if (!action.payload) {
						setNoExisteCliente(true);
					}
				});
			}
		}

		updateClienteState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!cliente) {
			return;
		}
		reset(cliente);
	}, [cliente, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetCliente());
			setNoExisteCliente(false);
		};
	}, [dispatch]);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (noExisteCliente) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontro el cliente!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/comercial/clientes"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (
		_.isEmpty(form) ||
		(cliente && parseInt(routeParams.id, 10) !== cliente.id && routeParams.id !== 'nuevo')
	) {
		return <FuseLoading />;
	}
	return (
		<FormProvider {...methods}>
			<Root
				header={<ClienteHeader tipo={routeParams.id} />}
				content={
					<div className="p-16 sm:p-24 ">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Datos</div>
							<InformacionBasica
								tipo={routeParams.id}
								ubigeos={ubigeos}
								setUbigeosSearchText={setUbigeosSearchText}
							/>
							<div className="mx-6 mb-16 mt-16 text-base">Contacto</div>
							<Contacto ubigeos={ubigeos} setUbigeosSearchText={setUbigeosSearchText} />
							<div className="mx-6 my-16 text-base">Direcciones Alternativas</div>
							<DireccionesAlternativas />
							<div className="mx-6 mb-16 mt-16 text-base">Marcas</div>
							<div className="flex flex-col sm:flex-col mr-24 sm:mr-4 ">
								<Marcas />
							</div>
							{/* <div className="mx-6 mb-16 mt-16 text-base">Margen</div> */}
							{/* <Preferencia /> */}
							<div className="mx-6 mb-16 mt-16 text-base">Detracción</div>
							<DetraccionCliente />
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
};

export default withReducer('comercial', reducer)(Cliente);

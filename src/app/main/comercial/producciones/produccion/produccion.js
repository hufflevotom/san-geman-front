import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';
import withReducer from 'app/store/withReducer';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDeepCompareEffect } from '@fuse/hooks';
import { Button, Tab, Tabs, Typography } from '@mui/material';
import _ from '@lodash';
import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'framer-motion';
import {
	getProduccionId,
	newProduccion,
	resetProduccion,
} from '../../store/produccion/produccionSlice';
import reducer from '../../store';
import ProduccionHeader from './produccionHeader';
import InformacionBasica from './tabs/informacionBasica';
import TabPedidos from './tabs/pedidos';
import Observaciones from './tabs/observaciones';
import ColoresEstilos from './tabs/coloresEstilos';

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

const Produccion = () => {
	const dispatch = useDispatch();
	const produccion = useSelector(({ comercial }) => comercial.produccion);

	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [noExisteProduccion, setNoExisteProduccion] = useState(false);
	const [codigo, setCodigo] = useState('');
	const methods = useForm({
		mode: 'all',
		// defaultValues: {},
		resolver: yupResolver(schema),
	});
	const { reset, watch, control, onChange, formState } = methods;
	const form = watch();

	useDeepCompareEffect(() => {
		function updateProduccionState() {
			const { id } = routeParams;
			if (id === 'nuevo') {
				dispatch(newProduccion());
			} else {
				dispatch(getProduccionId(id)).then(action => {
					if (!action.payload) {
						setNoExisteProduccion(true);
					}
				});
			}
		}

		updateProduccionState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!produccion) {
			return;
		}

		reset(produccion);
	}, [produccion, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetProduccion());
			setNoExisteProduccion(false);
		};
	}, [dispatch]);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (noExisteProduccion) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontro el produccion!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/comercial/producciones"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (
		_.isEmpty(form) ||
		(produccion && parseInt(routeParams.id, 10) !== produccion.id && routeParams.id !== 'nuevo')
	) {
		return <FuseLoading />;
	}
	return (
		<FormProvider {...methods}>
			<Root
				header={<ProduccionHeader tipo={routeParams.id} codigo={codigo} />}
				contentToolbar={
					<Tabs
						value={tabValue}
						onChange={handleTabChange}
						indicatorColor="primary"
						textColor="primary"
						variant="scrollable"
						scrollButtons="auto"
						classes={{ root: 'w-full h-64' }}
					>
						<Tab className="h-64" label="Detalles" />
						{routeParams.id === 'nuevo' && <Tab className="h-64" label="Colores para el Cliente" />}
					</Tabs>
				}
				content={
					<div className="p-16 sm:p-24 ">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							<InformacionBasica setCodigo={setCodigo} param={routeParams.id} />
							<Observaciones />
							<TabPedidos />
						</div>
						<div className={tabValue !== 1 ? 'hidden' : ''}>
							<ColoresEstilos />
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
};

export default withReducer('comercial', reducer)(Produccion);

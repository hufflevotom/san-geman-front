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
import { Button, Typography } from '@mui/material';
import _ from '@lodash';
import FuseLoading from '@fuse/core/FuseLoading';
// import { getModulos } from 'app/store/generales/modulosSlice';
import { motion } from 'framer-motion';

import reducer from '../../store';
import InformacionBasica from './tabs/informacionBasica';
import { getAlmacenId, newAlmacen, resetAlmacen } from '../../store/almacen/almacenSlice';
import AlmacenHeader from './almacenHeader';
// import InformacionBasica from './tabs/informacionBasica';

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

const Almacen = () => {
	const dispatch = useDispatch();
	const almacen = useSelector(({ configuraciones }) => configuraciones.almacen);

	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [noExisteAlmacen, setNoExisteAlmacen] = useState(false);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: yupResolver(schema),
	});
	const { reset, watch, control, onChange, formState } = methods;
	const form = watch();

	useDeepCompareEffect(() => {
		function updateAlmacenState() {
			const { id } = routeParams;
			if (id === 'nuevo') {
				dispatch(newAlmacen());
			} else {
				dispatch(getAlmacenId(id)).then(action => {
					if (!action.payload) {
						setNoExisteAlmacen(true);
					}
				});
			}
		}

		updateAlmacenState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!almacen) {
			return;
		}

		reset(almacen);
	}, [almacen, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetAlmacen());
			setNoExisteAlmacen(false);
		};
	}, [dispatch]);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (noExisteAlmacen) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontro el almacen!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/configuraciones/almacenes"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (
		_.isEmpty(form) ||
		(almacen && parseInt(routeParams.id, 10) !== almacen.id && routeParams.id !== 'nuevo')
	) {
		return <FuseLoading />;
	}
	return (
		<FormProvider {...methods}>
			<Root
				header={<AlmacenHeader tipo={routeParams.id} />}
				content={
					<div className="p-16 sm:p-24 ">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Detalles</div>
							<InformacionBasica />
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
};

export default withReducer('configuraciones', reducer)(Almacen);

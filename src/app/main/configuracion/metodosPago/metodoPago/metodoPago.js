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
import { Button, Tabs, Typography, Tab } from '@mui/material';
import _ from '@lodash';
import FuseLoading from '@fuse/core/FuseLoading';
// import { getModulos } from 'app/store/generales/modulosSlice';
import { motion } from 'framer-motion';

import reducer from '../../store';
import {
	getMetodoPagoId,
	newMetodoPago,
	resetMetodoPago,
} from '../../store/metodoPago/metodoPagoSlice';
import MetodoPagoHeader from './metodoPagoHeader';
import InformacionBasica from './tabs/informacionBasica';
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
	descripcion: yup.string().required('Descripción es requerido'),
	dias: yup.number().required('Dias es requerido'),
});

const MetodoPago = () => {
	const dispatch = useDispatch();
	const metodoPago = useSelector(({ configuraciones }) => configuraciones.metodoPago);

	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [noExisteMetodoPago, setExisteMetodoPago] = useState(false);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: yupResolver(schema),
	});
	const { reset, watch, control, onChange, formState } = methods;
	const form = watch();

	useDeepCompareEffect(() => {
		function updateUnidadState() {
			const { id } = routeParams;
			if (id === 'nuevo') {
				dispatch(newMetodoPago());
			} else {
				dispatch(getMetodoPagoId(id)).then(action => {
					if (!action.payload) {
						setExisteMetodoPago(true);
					}
				});
			}
		}

		updateUnidadState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!metodoPago) {
			return;
		}

		reset(metodoPago);
	}, [metodoPago, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetMetodoPago());
			setExisteMetodoPago(false);
		};
	}, [dispatch]);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (noExisteMetodoPago) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontro el método de pago!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/configuraciones/metodos-pago"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (
		_.isEmpty(form) ||
		(metodoPago && parseInt(routeParams.id, 10) !== metodoPago.id && routeParams.id !== 'nuevo')
	) {
		return <FuseLoading />;
	}
	return (
		<FormProvider {...methods}>
			<Root
				header={<MetodoPagoHeader tipo={routeParams.id} />}
				// contentToolbar={
				// 	<Tabs
				// 		value={tabValue}
				// 		onChange={handleTabChange}
				// 		indicatorColor="primary"
				// 		textColor="primary"
				// 		variant="scrollable"
				// 		scrollButtons="auto"
				// 		classes={{ root: 'w-full h-64' }}
				// 	>
				// 		<Tab className="h-64" label="Información Basica" />x
				// 	</Tabs>
				// }
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

export default withReducer('configuraciones', reducer)(MetodoPago);

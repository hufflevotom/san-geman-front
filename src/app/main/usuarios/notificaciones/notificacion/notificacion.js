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
import { motion } from 'framer-motion';
import reducer from '../../store';

import {
	getNotificacionId,
	newNotificacion,
	resetNotificacion,
} from '../../store/notificacion/notificacionSlice';
import NotificacionHeader from './notificacionHeader';
import ModulosTab from './tabs/modulos';
import { getModulos } from '../../store/modulo/modulosSlice';
import { getNotificaciones } from '../../store/notificacion/notificacionesSlice';

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
});

const Notificacion = () => {
	const dispatch = useDispatch();
	const user = useSelector(({ usuarios }) => usuarios.notificacion);

	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [noExisteUsuario, setNoExisteUsuario] = useState(false);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: yupResolver(schema),
	});
	const { reset, watch, control, onChange, formState } = methods;
	const form = watch();

	useDeepCompareEffect(() => {
		function updateNotificacionState() {
			const { id } = routeParams;
			dispatch(getNotificaciones());
			dispatch(getNotificacionId(id)).then(action => {
				if (!action.payload) {
					setNoExisteUsuario(true);
				}
			});
		}

		updateNotificacionState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!user) {
			return;
		}

		reset(user);
	}, [user, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetNotificacion());
			setNoExisteUsuario(false);
		};
	}, [dispatch]);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (noExisteUsuario) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontro el notificacion!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/notificaciones"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (
		_.isEmpty(form) ||
		(user && parseInt(routeParams.id, 10) !== user.id && routeParams.id !== 'nuevo')
	) {
		return <FuseLoading />;
	}
	return (
		<FormProvider {...methods}>
			<Root
				header={<NotificacionHeader tipo={routeParams.id} />}
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
				// 		<Tab className="h-64" label="Información Basica" />
				// 	</Tabs>
				// }
				content={
					<div className="p-16 sm:p-24 ">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							<div className="mx-6 mb-16 mt-16 text-base">Modulos</div>
							<ModulosTab />
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
};

export default withReducer('usuarios', reducer)(Notificacion);

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
import { motion } from 'framer-motion';
import reducer from '../../store';
import InformacionBasica from './tabs/informacionBasica';
import { getUsuarioId, newUsuario, resetUsuario } from '../../store/usuario/usuarioSlice';
import UsuarioHeader from './usuarioHeader';

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
	chofer: yup.boolean(),
	dni: yup.number().typeError('Debe especificar un dni'),
	licencia: yup.number().typeError('Debe especificar una licencia'),
	celular: yup
		.number()
		.typeError('Debe especificar un celular valido')
		.test('len', 'Debe especificar un celular valido', val => val.toString().length === 9),
	email: yup.string().email('Debe especificar un email valido'),
	ruc: yup
		.number()
		.required('Ruc es requerido')
		.typeError('Debe especificar un RUC valido')
		.test('len', 'Debe especificar un RUC valido', val => val.toString().length === 11),
	modulos: yup.array().required('Modulos es requerido'),
});

const Usuario = () => {
	const dispatch = useDispatch();
	const user = useSelector(({ usuarios }) => usuarios.usuario);

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
		function updateUsuarioState() {
			const { id } = routeParams;
			if (id === 'nuevo') {
				dispatch(newUsuario());
			} else {
				dispatch(getUsuarioId(id)).then(action => {
					if (!action.payload) {
						setNoExisteUsuario(true);
					}
				});
			}
		}

		updateUsuarioState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!user) {
			return;
		}

		reset(user);
	}, [user, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetUsuario());
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
					No se encontro al usuario!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/usuarios"
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
				header={<UsuarioHeader tipo={routeParams.id} />}
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

export default withReducer('usuarios', reducer)(Usuario);

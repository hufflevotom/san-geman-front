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
import { getMuestraId, newMuestra, resetMuestra } from '../../store/muestra/muestraSlice';
import reducer from '../../store';
import MuestraHeader from './muestraHeader';
import InformacionBasica from './tabs/informacionBasica';
import TabPedidos from './tabs/pedidos';

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

const Muestra = () => {
	const dispatch = useDispatch();
	const muestra = useSelector(({ comercial }) => comercial.muestra);

	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [noExisteMuestra, setNoExisteMuestra] = useState(false);
	const [codigo, setCodigo] = useState('');
	const methods = useForm({
		mode: 'all',
		// defaultValues: {},
		resolver: yupResolver(schema),
	});
	const { reset, watch, control, onChange, formState } = methods;
	const form = watch();

	useDeepCompareEffect(() => {
		function updateMuestraState() {
			const { id } = routeParams;
			if (id === 'nuevo') {
				dispatch(newMuestra());
			} else {
				dispatch(getMuestraId(id)).then(action => {
					if (!action.payload) {
						setNoExisteMuestra(true);
					}
				});
			}
		}

		updateMuestraState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!muestra) {
			return;
		}

		reset(muestra);
	}, [muestra, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetMuestra());
			setNoExisteMuestra(false);
		};
	}, [dispatch]);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (noExisteMuestra) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontro el muestra!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/comercial/muestras"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (
		_.isEmpty(form) ||
		(muestra && parseInt(routeParams.id, 10) !== muestra.id && routeParams.id !== 'nuevo')
	) {
		return <FuseLoading />;
	}
	return (
		<FormProvider {...methods}>
			<Root
				header={<MuestraHeader tipo={routeParams.id} codigo={codigo} />}
				content={
					<div className="p-16 sm:p-24 ">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Detalle</div>
							<InformacionBasica setCodigo={setCodigo} />
							<TabPedidos />
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
};

export default withReducer('comercial', reducer)(Muestra);

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
import useQueryParams from 'utils/useQueryParams';
import { motion } from 'framer-motion';
import reducer from '../../store';
import { getTextilId, newTextil, resetTextil } from '../../store/textil/textilSlice';
import TextilHeader from './textilHeader';
import Partida from './tabs/informacionBasica';
import Densidad from './tabs/densidad';
import Encogimiento from './tabs/encogimiento';
import Revirado from './tabs/revirado';
import Inclinacion from './tabs/inclinacion';
import Solidez from './tabs/solidez';
import DocumentoReferencia from './tabs/documentoReferencia';

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

const Textil = () => {
	const dispatch = useDispatch();
	const textil = useSelector(({ calidad }) => calidad.textil);

	const routeParams = useParams();

	const params = useQueryParams();

	const [tabValue, setTabValue] = useState(0);
	const [noExisteTextil, setNoExisteTextil] = useState(false);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: yupResolver(schema),
	});
	const { reset, watch, control, onChange, formState } = methods;
	const form = watch();

	useDeepCompareEffect(() => {
		async function updateTextilState() {
			const { id } = routeParams;
			const { codigo } = await params;
			console.log('codigo', codigo);
			if (id === 'nuevo') {
				dispatch(newTextil());
			} else {
				dispatch(getTextilId({ id, codigo })).then(action => {
					if (!action.payload) {
						setNoExisteTextil(true);
					}
				});
			}
		}

		updateTextilState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!textil) {
			return;
		}
		reset(textil);
	}, [textil, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetTextil());
			setNoExisteTextil(false);
		};
	}, [dispatch]);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (noExisteTextil) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontro el textil!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/calidad/textil"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (
		_.isEmpty(form) ||
		!(textil && parseInt(routeParams.id, 10) !== textil.id && routeParams.id !== 'nuevo')
	) {
		return <FuseLoading />;
	}
	return (
		<FormProvider {...methods}>
			<Root
				header={<TextilHeader tipo={routeParams.id} />}
				content={
					<div className="p-16 sm:p-24 ">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Densidad</div>
							<Densidad />
							<div className="mx-6 mb-16 mt-16 text-base">Encogimiento</div>
							<Encogimiento />
							<div className="mx-6 mb-16 mt-16 text-base">% Revirado</div>
							<Revirado />
							<div className="mx-6 mb-16 mt-16 text-base">Grado de inclinación de trama</div>
							<Inclinacion />
							<div className="mx-6 mb-16 mt-16 text-base">Solidez y apariencia</div>
							<Solidez />
							<div className="mx-6 mb-16 mt-16 text-base">Documento</div>
							<DocumentoReferencia />
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
};

export default withReducer('calidad', reducer)(Textil);

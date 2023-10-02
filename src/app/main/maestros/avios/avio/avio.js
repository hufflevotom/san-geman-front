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
import useQueryParams from 'utils/useQueryParams';
import reducer from '../../store';
import { getAvioId, newAvio, resetAvio } from '../../store/avios/avioSlice';
import AvioHeader from './avioHeader';
import InformacionBasica from './tabs/informacionBasica';
import FamiliaAvios from './tabs/familiaAvios';
import ClienteTab from './tabs/cliente';
import ImagenesTab from './tabs/imagenes';
import Tallas from './tabs/tallas';

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

const Avio = () => {
	const dispatch = useDispatch();
	const avio = useSelector(({ maestros }) => maestros.avio);

	const routeParams = useParams();
	const params = useQueryParams();
	const [generar, setGenerar] = useState(false);
	const [imagenes, setImagenes] = useState();
	const [tabValue, setTabValue] = useState(0);
	const [noExisteFamilia, setNoExisteFamilia] = useState(false);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: yupResolver(schema),
	});
	const { reset, watch, control, onChange, formState, getValues } = methods;
	const form = watch();

	const { tallas } = getValues();

	useEffect(() => {
		if (tallas) {
			const objImgs = tallas.map(e => ({ talla: e, imagenPrinc: null, imagenSec: null }));
			setImagenes(objImgs);
		}
	}, [tallas]);

	useDeepCompareEffect(() => {
		async function updateFamiliaState() {
			const { id } = routeParams;
			const { action } = await params;
			if (id === 'nuevo') {
				/**
				 * Create New Empresa data
				 */
				dispatch(newAvio());
			} else {
				/**
				 * Get Empresa data
				 */
				dispatch(getAvioId(id)).then(act => {
					/**
					 * If the requested Empresa is not exist show message
					 */
					if (!act.payload) {
						setNoExisteFamilia(true);
					}
				});
			}
			setGenerar(action === 'GT');
		}

		updateFamiliaState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!avio) {
			return;
		}
		/**
		 * Reset the form on Empresa state changes
		 */
		reset(avio);
	}, [avio, reset]);

	useEffect(() => {
		// Traemos lso modulos
		// dispatch(getModulos());

		return () => {
			/**
			 * Reset Empresa on component unload
			 */
			dispatch(resetAvio());
			setNoExisteFamilia(false);
		};
	}, [dispatch]);

	/**
	 * Tab Change
	 */
	function handleTabChange(event, value) {
		setTabValue(value);
	}

	/**
	 * Show Message if the requested empresas is not exists
	 */
	if (noExisteFamilia) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontro avios!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/maestros/avios"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while empresa data is loading and form is setted
	 */
	if (
		_.isEmpty(form) ||
		(avio && parseInt(routeParams.id, 10) !== avio.id && routeParams.id !== 'nuevo')
	) {
		// return <Root content={<FuseLoading />} innerScroll />;
		return <FuseLoading />;
	}
	return (
		<FormProvider {...methods}>
			<Root
				header={<AvioHeader tipo={routeParams.id} generar={generar} imagenes={imagenes} />}
				content={
					<div className="p-16 sm:p-24 ">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Detalles</div>
							{generar && <Tallas />}
							<InformacionBasica />
							<FamiliaAvios generar={generar} />
							<div className="mx-6 mb-16 mt-16 text-base">Cliente</div>
							<ClienteTab />
							<div className="mx-6 mb-16 mt-16 text-base">Imágenes</div>
							<ImagenesTab generar={generar} imagenes={imagenes} setImagenes={setImagenes} />
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
};

export default withReducer('maestros', reducer)(Avio);

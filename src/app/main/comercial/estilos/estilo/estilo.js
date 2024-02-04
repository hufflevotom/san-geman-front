/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from '@lodash';
import { motion } from 'framer-motion';

import { Button, Tabs, Typography, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import FusePageCarded from '@fuse/core/FusePageCarded';
import FuseLoading from '@fuse/core/FuseLoading';
import { useDeepCompareEffect } from '@fuse/hooks';

import withReducer from 'app/store/withReducer';
import useQueryParams from 'utils/useQueryParams';

import { ACCIONES, MODULOS } from 'constants/constantes';

import { getAllBordadosService, getAllEstampadosService } from 'app/services/services';

import reducer from '../../store';
import { getEstiloId, newEstilo, resetEstilo } from '../../store/estilo/estiloSlice';

import InformacionBasica from './tabs/informacionBasica';
import EstiloHeader from './estiloHeader';
import Disenho from './tabs/disenho';
import Ruta from './tabs/ruta';
import Avios from './tabs/avios';

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

const Estilo = () => {
	const dispatch = useDispatch();
	const estilo = useSelector(({ comercial }) => comercial.estilo);
	const rolActual = useSelector(({ auth }) => auth.user.role);
	const modulos = useSelector(
		({ auth }) => auth.roles[0].find(rol => rol.id === rolActual.id).modulos
	);

	const params = useQueryParams();

	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [subCodigo, setSubCodigo] = useState();
	const [noExisteEstilo, setNoExisteEstilo] = useState(false);
	const [accionActual, setAccionActual] = useState();
	const [bordados, setBordados] = useState([]);
	const [estampados, setEstampados] = useState([]);

	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: yupResolver(schema),
	});
	const { reset, watch, setValue } = methods;
	const form = watch();

	useDeepCompareEffect(() => {
		async function updateEstiloState() {
			const { id } = routeParams;
			const query = await params;
			if (id === 'nuevo') {
				dispatch(newEstilo());
				setAccionActual(ACCIONES.CREAR);
			} else {
				dispatch(getEstiloId(id)).then(action => {
					const asignado = action?.payload?.asignado;
					if (!action.payload) {
						setNoExisteEstilo(true);
					}
					const edicionEstilosAsignados =
						modulos.findIndex(modulo => modulo.nombre === MODULOS.edicionEstilosAsignados) !== -1;
					setAccionActual(
						query.subcodigo
							? ACCIONES.NUEVO
							: asignado
							? query.action === 'edit' && edicionEstilosAsignados
								? ACCIONES.EDITAR_ASIGNADOS
								: ACCIONES.VISUALIZAR
							: ACCIONES.EDITAR
					);
				});
				if (query && query.subcodigo) {
					setSubCodigo(query.subcodigo);
					setValue('imagenEstiloUrl', '');
					setValue('fichaTecnicaUrl', '');
				}
			}
		}

		updateEstiloState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!estilo) {
			return;
		}
		reset(estilo);
		(async function cleanImages() {
			const query = await params;
			if (estilo && query && query.subcodigo) {
				const imgs = estilo.imagenesReferenciales.map(img => ({ ...img, urlImagen: '' })) || [];
				setValue('imagenEstiloUrl', '');
				setValue('fichaTecnicaUrl', '');
				setValue('imagenesReferenciales', imgs);
			}
		})();
	}, [estilo, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetEstilo());
			setNoExisteEstilo(false);
		};
	}, [dispatch]);

	useEffect(() => {
		getAllBordadosService().then(bordadosRes => {
			setBordados(bordadosRes[0]);
		});
		getAllEstampadosService().then(estampadosRes => {
			setEstampados(estampadosRes[0]);
		});
	}, []);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (noExisteEstilo) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontro el estilo!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/comercial/estilos"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (
		_.isEmpty(form) ||
		(estilo && parseInt(routeParams.id, 10) !== estilo.id && routeParams.id !== 'nuevo')
	) {
		return <FuseLoading />;
	}
	return (
		<FormProvider {...methods}>
			<Root
				header={
					<EstiloHeader
						tipo={routeParams.id}
						subCodigo={subCodigo}
						disabled={accionActual === ACCIONES.VISUALIZAR}
						accion={accionActual}
					/>
				}
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
						<Tab className="h-64" label="Diseño" />
						<Tab className="h-64" label="Ruta" />
						<Tab className="h-64" label="Avios" />
					</Tabs>
				}
				content={
					<div className="p-16 sm:p-24 ">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base"> {/*  */} </div>
							<InformacionBasica
								subCodigo={subCodigo}
								tipo={routeParams.id}
								// disabled={accionActual !== ACCIONES.CREAR}
								disabled={
									accionActual === ACCIONES.VISUALIZAR || accionActual === ACCIONES.EDITAR_ASIGNADOS
								}
								accion={accionActual}
							/>
						</div>
						<div className={tabValue !== 1 ? 'hidden' : ''}>
							<div className="mx-6 mb-16 mt-16 text-base">Tela Principal</div>
							<Disenho
								disabled={accionActual === ACCIONES.VISUALIZAR}
								accion={accionActual}
								bordados={bordados}
								estampados={estampados}
							/>
						</div>
						<div className={tabValue !== 2 ? 'hidden' : ''}>
							{/* <div className="mx-6 mb-16 mt-16 text-base">Ruta</div> */}
							<Ruta
								disabled={
									accionActual === ACCIONES.VISUALIZAR || accionActual === ACCIONES.EDITAR_ASIGNADOS
								}
							/>
						</div>
						<div className={tabValue !== 3 ? 'hidden' : ''}>
							{/* <div className="mx-6 mb-16 mt-16 text-base">Ruta</div> */}
							<Avios
								disabled={
									accionActual === ACCIONES.VISUALIZAR || accionActual === ACCIONES.EDITAR_ASIGNADOS
								}
							/>
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
};

export default withReducer('comercial', reducer)(Estilo);

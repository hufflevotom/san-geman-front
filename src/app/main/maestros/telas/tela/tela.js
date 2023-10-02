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
import InformacionBasica from './tabs/informacionBasica';
import { getTelaId, newtela, resetTela } from '../../store/tela/telaSlice';
import TelaHeader from './telaHeader';
import TabFamilia from './tabs/tabFamilia';
import AlternativasTab from './tabs/alternativas';
import FichaTecnica from './tabs/fichaTecnica';

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
	subFamilia: yup.object().required('Sub Familia es requerida').nullable(),
	familia: yup.object().required('Familia  es requerida').nullable(),
	descripcionComercial: yup.string().required('La Descripción es requerida').nullable(),

	titulacionJson: yup.array().required('Titulación es requerida').nullable(),
	// composicion: yup.string().required('Composición es requerida').nullable(),
	unidadMedida: yup.object().required('Unidad es requerida').nullable(),
	unidadMedidaSecundaria: yup.object().required('Unidad Secundaria es requerida').nullable(),

	densidad: yup.string().required('La Densidad es requerida').nullable(),
	encogimientoLargo: yup.string().required('El campo es requerido').nullable(),
	encogimientoAncho: yup.string().required('El campo es requerido').nullable(),
	revirado: yup.string().required('El campo es requerido').nullable(),
	ancho: yup.string().required('El Ancho es requerido').nullable(),
	acabado: yup.string().required('El Acabado es requerido').nullable(),
});

const Tela = () => {
	const dispatch = useDispatch();
	const color = useSelector(({ maestros }) => maestros.tela);

	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [noExisteTela, setNoExisteTela] = useState(false);
	const methods = useForm({
		mode: 'all',
		// defaultValues: {},
		resolver: yupResolver(schema),
	});
	const { reset, watch, control, onChange, formState } = methods;
	const form = watch();

	useDeepCompareEffect(() => {
		function updateTelaState() {
			const { id } = routeParams;
			if (id === 'nuevo') {
				dispatch(newtela());
			} else {
				dispatch(getTelaId(id)).then(action => {
					if (!action.payload) {
						setNoExisteTela(true);
					}
				});
			}
		}

		updateTelaState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!color) {
			return;
		}

		reset(color);
	}, [color, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetTela());
			setNoExisteTela(false);
		};
	}, [dispatch]);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (noExisteTela) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontro la tela!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/maestros/telas"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (
		_.isEmpty(form) ||
		(color && parseInt(routeParams.id, 10) !== color.id && routeParams.id !== 'nuevo')
	) {
		return <FuseLoading />;
	}
	return (
		<FormProvider {...methods}>
			<Root
				header={<TelaHeader tipo={routeParams.id} />}
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
						<Tab className="h-64" label="Ficha Tecnica" />
						{/* 	<Tab className="h-64" label="Proveedor" /> */}
					</Tabs>
				}
				content={
					<div className="p-16 sm:p-24 ">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Familia</div>
							<TabFamilia tipo={routeParams.id} />
							<div className="mx-6 mb-16 mt-16 text-base">Detalles</div>
							<InformacionBasica />
							{/* <div className="mx-6 mb-16 mt-16 text-base">Alternativas</div>
							<AlternativasTab /> */}
						</div>
						<div className={tabValue !== 1 ? 'hidden' : ''}>
							<FichaTecnica tipo={routeParams.id} />
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
};

export default withReducer('maestros', reducer)(Tela);

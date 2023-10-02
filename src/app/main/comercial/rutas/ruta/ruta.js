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
import { getRutaId, newRuta, resetRuta } from '../../store/ruta/rutaSlice';
import reducer from '../../store';
import RutaHeader from './rutaHeader';
import InformacionBasica from './tabs/informacionBasica';

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
});

const Ruta = () => {
	const dispatch = useDispatch();
	const ruta = useSelector(({ comercial }) => comercial.ruta);

	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [noExisteRuta, setNoExisteRuta] = useState(false);
	const methods = useForm({
		mode: 'all',
		// defaultValues: {},
		resolver: yupResolver(schema),
	});
	const { reset, watch, control, onChange, formState } = methods;
	const form = watch();

	useDeepCompareEffect(() => {
		function updateRutaState() {
			const { id } = routeParams;
			if (id === 'nuevo') {
				dispatch(newRuta());
			} else {
				dispatch(getRutaId(id)).then(action => {
					if (!action.payload) {
						setNoExisteRuta(true);
					}
				});
			}
		}

		updateRutaState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!ruta) {
			return;
		}

		reset(ruta);
	}, [ruta, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetRuta());
			setNoExisteRuta(false);
		};
	}, [dispatch]);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (noExisteRuta) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontro el ruta!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/comercial/rutas"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (
		_.isEmpty(form) ||
		(ruta && parseInt(routeParams.id, 10) !== ruta.id && routeParams.id !== 'nuevo')
	) {
		return <FuseLoading />;
	}
	return (
		<FormProvider {...methods}>
			<Root
				header={<RutaHeader tipo={routeParams.id} />}
				content={
					<div className="p-16 sm:p-24 ">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Detalle</div>
							<InformacionBasica />
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
};

export default withReducer('comercial', reducer)(Ruta);

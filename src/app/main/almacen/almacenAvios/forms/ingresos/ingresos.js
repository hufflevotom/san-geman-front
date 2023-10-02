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
import { Button, Tab, Tabs, Typography } from '@mui/material';
import _ from '@lodash';
import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'framer-motion';
import reducer from '../../../store';
import InformacionBasica from './tabs/informacionBasica';
import {
	getIngresoId,
	newIngreso,
	resetIngreso,
} from '../../../store/almacenAvio/ingresos/ingresosAvioSlice';
import IngresoHeader from './ingresosHeader';
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

const schema = yup.object().shape({});

const Ingreso = () => {
	const dispatch = useDispatch();
	const ingreso = useSelector(({ almacen }) => almacen.ingresoAvio);

	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [noExisteIngreso, setNoExisteIngreso] = useState(false);
	const methods = useForm({
		mode: 'onChange',
		// defaultValues: {},
		resolver: yupResolver(schema),
	});
	const { reset, watch, control, onChange, formState } = methods;
	const form = watch();

	useDeepCompareEffect(() => {
		function updateIngresoState() {
			const { id } = routeParams;
			console.log('id:', id);
			if (id === 'nuevo') {
				dispatch(newIngreso());
			} else {
				dispatch(getIngresoId(id)).then(action => {
					if (!action.payload) {
						setNoExisteIngreso(true);
					}
				});
			}
		}

		updateIngresoState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!ingreso) {
			return;
		}
		reset(ingreso);
	}, [ingreso, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetIngreso());
			setNoExisteIngreso(false);
		};
	}, [dispatch]);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (noExisteIngreso) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontró el ingreso!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/almacen/avios/ingresos"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (
		_.isEmpty(form) ||
		(ingreso && parseInt(routeParams.id, 10) !== ingreso.id && routeParams.id !== 'nuevo')
	) {
		return <FuseLoading />;
	}
	return (
		<FormProvider {...methods}>
			<Root
				header={<IngresoHeader tipo={routeParams.id} />}
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
						<Tab className="h-64" label="Documento de Referencia" />
					</Tabs>
				}
				content={
					<div className="p-16 sm:p-24 ">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							<InformacionBasica />
						</div>
						<div className={tabValue !== 1 ? 'hidden' : ''}>
							<DocumentoReferencia />
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
};

export default withReducer('almacen', reducer)(Ingreso);

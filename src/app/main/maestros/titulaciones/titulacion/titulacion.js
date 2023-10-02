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
import {
	getTitulacionId,
	newtitulacion,
	resetTitulacion,
} from '../../store/titulacion/titulacionSlice';
import TitulacionHeader from './titulacionHeader';

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
	nombre: yup.string().required('El nombre es requerido').nullable(),
});

const Titulacion = () => {
	const dispatch = useDispatch();
	const color = useSelector(({ maestros }) => maestros.titulacion);

	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [noExisteTitulacion, setNoExisteTitulacion] = useState(false);
	const methods = useForm({
		mode: 'all',
		// defaultValues: {},
		resolver: yupResolver(schema),
	});
	const { reset, watch, control, onChange, formState } = methods;
	const form = watch();

	useDeepCompareEffect(() => {
		function updateTitulacionState() {
			const { id } = routeParams;
			if (id === 'nuevo') {
				dispatch(newtitulacion());
			} else {
				dispatch(getTitulacionId(id)).then(action => {
					if (!action.payload) {
						setNoExisteTitulacion(true);
					}
				});
			}
		}

		updateTitulacionState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!color) {
			return;
		}

		reset(color);
	}, [color, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetTitulacion());
			setNoExisteTitulacion(false);
		};
	}, [dispatch]);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (noExisteTitulacion) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontro la titulacion!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/maestros/titulaciones"
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
				header={<TitulacionHeader tipo={routeParams.id} />}
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
						{/* 	<Tab className="h-64" label="Proveedor" /> */}
					</Tabs>
				}
				content={
					<div className="p-16 sm:p-24 ">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							<InformacionBasica />
							{/* <div className="mx-6 mb-16 mt-16 text-base">Alternativas</div>
							<AlternativasTab /> */}
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
};

export default withReducer('maestros', reducer)(Titulacion);

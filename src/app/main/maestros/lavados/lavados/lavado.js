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
import { getLavadoId, newlavado, resetLavado } from '../../store/lavados/lavadoSlice';
import TitulacionHeader from './lavadoHeader';

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
	descripcion: yup.string().required('La descripcion es requerida').nullable(),
});

const Lavado = () => {
	const dispatch = useDispatch();
	const lavado = useSelector(({ maestros }) => maestros.lavado);

	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [noExiste, setNoExiste] = useState(false);
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
				dispatch(newlavado());
			} else {
				dispatch(getLavadoId(id)).then(action => {
					if (!action.payload) {
						setNoExiste(true);
					}
				});
			}
		}

		updateTitulacionState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!lavado) {
			return;
		}

		reset(lavado);
	}, [lavado, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetLavado());
			setNoExiste(false);
		};
	}, [dispatch]);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (noExiste) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography lavados="textSecondary" variant="h5">
					No se encontro el lavado!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/maestros/lavados"
					lavados="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (
		_.isEmpty(form) ||
		(lavado && parseInt(routeParams.id, 10) !== lavado.id && routeParams.id !== 'nuevo')
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
					</Tabs>
				}
				content={
					<div className="p-16 sm:p-24 ">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							<InformacionBasica />
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
};

export default withReducer('maestros', reducer)(Lavado);

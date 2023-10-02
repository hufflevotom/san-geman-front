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
import PrendaHeader from './prendaHeader';
import TabFamilia from './tabs/tabFamilia';
import { getFamliasPrenda } from '../../store/familia-prenda/familiasPrendasSlice';
import { getPrendaId, newPrenda, resetPrenda } from '../../store/prenda/prendaSlice';

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
	nombre: yup.string().required('Nombre es requerido'),
	familiaPrenda: yup.object().required('Familia  es requerida').nullable(),
	// unidadMedida: yup.object().required('Unidad es requerida').nullable(),
});

const Prenda = () => {
	const dispatch = useDispatch();
	const prenda = useSelector(({ maestros }) => maestros.prenda);

	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [noExistePrenda, setNoExistePrenda] = useState(false);
	const methods = useForm({
		mode: 'all',
		// defaultValues: {},
		resolver: yupResolver(schema),
	});
	const { reset, watch, control, onChange, formState } = methods;
	const form = watch();

	useDeepCompareEffect(() => {
		function updatePrendaState() {
			const { id } = routeParams;
			if (id === 'nuevo') {
				dispatch(newPrenda());
			} else {
				dispatch(getPrendaId(id)).then(action => {
					if (!action.payload) {
						setNoExistePrenda(true);
					}
				});
			}
		}

		updatePrendaState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!prenda) {
			return;
		}

		reset(prenda);
	}, [prenda, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetPrenda());
			setNoExistePrenda(false);
		};
	}, [dispatch]);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (noExistePrenda) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontro la prenda!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/maestros/prendas"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (
		_.isEmpty(form) ||
		(prenda && parseInt(routeParams.id, 10) !== prenda.id && routeParams.id !== 'nuevo')
	) {
		return <FuseLoading />;
	}
	return (
		<FormProvider {...methods}>
			<Root
				header={<PrendaHeader tipo={routeParams.id} />}
				// contentToolbar={
				// 	<Tabs
				// 		value={tabValue}
				// 		onChange={handleTabChange}
				// 		indicatorColor="primary"
				// 		textColor="primary"
				// 		variant="scrollable"
				// 		scrollButtons="auto"
				// 		classes={{ root: 'w-full h-64' }}
				// 	>
				// 		<Tab className="h-64" label="Detalles" />
				// 		<Tab className="h-64" label="Familia" />
				// 		{/* 	<Tab className="h-64" label="Proveedor" /> */}
				// 	</Tabs>
				// }
				content={
					<div className="p-16 sm:p-24 ">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Familia</div>
							<TabFamilia tipo={routeParams.id} />
							<div className="mx-6 mb-16 mt-16 text-base">Detalles</div>
							<InformacionBasica />
						</div>
						{/* 	<div className={tabValue !== 2 ? 'hidden' : ''}>
							<ProveedorTab />
						</div> */}
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
};

export default withReducer('maestros', reducer)(Prenda);

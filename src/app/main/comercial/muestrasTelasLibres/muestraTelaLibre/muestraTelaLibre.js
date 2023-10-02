import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import _ from '@lodash';
import { motion } from 'framer-motion';

import { styled } from '@mui/material/styles';
import { Button, Typography } from '@mui/material';

import FusePageCarded from '@fuse/core/FusePageCarded';
import { useDeepCompareEffect } from '@fuse/hooks';
import FuseLoading from '@fuse/core/FuseLoading';

import useQueryParams from 'utils/useQueryParams';

import withReducer from 'app/store/withReducer';
import reducer from '../../store';
import {
	getMuestraTelaLibreId,
	newMuestraTelaLibre,
	resetMuestraTelaLibre,
} from '../../store/muestraTelaLibre/muestraTelaLibreSlice';

import MuestraTelaLibreHeader from './muestraTelaLibreHeader';
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

const MuestraTelaLibre = () => {
	const dispatch = useDispatch();
	const muestraTelaLibre = useSelector(({ comercial }) => comercial.muestraTelaLibre);

	const routeParams = useParams();
	const params = useQueryParams();
	const [tabValue, setTabValue] = useState(0);
	const [disabled, setDisabled] = useState(false);
	const [noExisteMuestra, setNoExisteMuestra] = useState(false);
	const [codigo, setCodigo] = useState('');
	const methods = useForm({
		mode: 'all',
	});
	const { reset, watch } = methods;
	const form = watch();

	useDeepCompareEffect(() => {
		async function updateMuestraState() {
			const { id } = routeParams;
			const { action } = await params;
			if (id === 'nuevo') {
				dispatch(newMuestraTelaLibre());
			} else {
				dispatch(getMuestraTelaLibreId(id)).then(act => {
					if (!act.payload) {
						setNoExisteMuestra(true);
					}
				});
				setDisabled(action === 'SW');
			}
		}

		updateMuestraState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!muestraTelaLibre) {
			return;
		}

		reset(muestraTelaLibre);
	}, [muestraTelaLibre, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetMuestraTelaLibre());
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
					No se encontro la muestra de tela libre!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/comercial/muestrasTelasLibres"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (
		_.isEmpty(form) ||
		(muestraTelaLibre &&
			parseInt(routeParams.id, 10) !== muestraTelaLibre.id &&
			routeParams.id !== 'nuevo')
	) {
		return <FuseLoading />;
	}
	return (
		<FormProvider {...methods}>
			<Root
				header={
					<MuestraTelaLibreHeader tipo={routeParams.id} codigo={codigo} disabled={disabled} />
				}
				content={
					<div className="p-16 sm:p-24 ">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Detalle</div>
							<InformacionBasica setCodigo={setCodigo} disabled={disabled} />
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
};

export default withReducer('comercial', reducer)(MuestraTelaLibre);

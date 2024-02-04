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

import showToast from 'utils/Toast';
import httpClient from 'utils/Api';

import reducer from '../../store';
import {
	getUbicacionEstampadoId,
	newUbicacionEstampado,
	resetUbicacionEstampado,
} from '../../store/ubicacionEstampado/ubicacionEstampadoSlice';
import UbicacionEstampadoHeader from './ubicacionEstampadoHeader';
import InputString from '../../../logistica/controlFacturas/controlFactura/components/inputString';

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
	label: yup
		.string()
		.required('El nombre es requerido')
		.min(3, 'El nombre debe tener al menos 3 caracteres'),
});

const UbicacionEstampado = () => {
	const dispatch = useDispatch();
	const ubicacionEstampado = useSelector(
		({ configuraciones }) => configuraciones.ubicacionEstampado
	);

	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [noExiste, setNoExiste] = useState(false);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: yupResolver(schema),
	});
	const { reset, watch, control, onChange, formState } = methods;
	const form = watch();

	const [currentLabel, setCurrentLabel] = useState('');

	const obtenerData = async id => {
		await showToast(
			{
				promesa: async () => {
					const {
						data: { statusCode, body },
					} = await httpClient.get(`configuraciones/ubicacion-estilos-estampados/${id}`);
					if (statusCode === 200) {
						setCurrentLabel(body.label);
					}
					return { payload: { message: 'Ubicación encontrada' } };
				},
				parametros: [],
			},
			'buscar',
			'Ubicación'
		);
	};

	useDeepCompareEffect(() => {
		function updateAlmacenState() {
			const { id } = routeParams;
			if (id === 'nuevo') {
				dispatch(newUbicacionEstampado());
			} else {
				dispatch(getUbicacionEstampadoId(id)).then(action => {
					if (!action.payload) {
						setNoExiste(true);
					}
				});
				obtenerData(id);
			}
		}

		updateAlmacenState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!ubicacionEstampado) {
			return;
		}

		reset(ubicacionEstampado);
	}, [ubicacionEstampado, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetUbicacionEstampado());
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
				<Typography color="textSecondary" variant="h5">
					No se encontro la ubicación!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/configuraciones/ubicacion-estampados"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (
		_.isEmpty(form) ||
		(ubicacionEstampado &&
			parseInt(routeParams.id, 10) !== ubicacionEstampado.id &&
			routeParams.id !== 'nuevo')
	) {
		return <FuseLoading />;
	}
	return (
		<FormProvider {...methods}>
			<Root
				header={<UbicacionEstampadoHeader tipo={routeParams.id} data={{ currentLabel }} />}
				content={
					<div className="p-16 sm:p-24 ">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Detalles</div>
							<InputString
								label="Nombre"
								value={currentLabel}
								onChange={event => {
									setCurrentLabel(event.target.value);
								}}
								required
								// disabled={disabled}
							/>
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
};

export default withReducer('configuraciones', reducer)(UbicacionEstampado);

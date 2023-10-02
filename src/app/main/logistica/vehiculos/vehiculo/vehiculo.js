/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';
import withReducer from 'app/store/withReducer';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import { Button, Typography } from '@mui/material';
import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'framer-motion';
import showToast from 'utils/Toast';
import httpClient from 'utils/Api';
import reducer from '../../store';
import Header from './vehiculoHeader';
import { getVehiculoId, newVehiculo, resetVehiculo } from '../../store/vehiculo/vehiculoSlice';
import InputString from '../../controlFacturas/controlFactura/components/inputString';

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

const Formulario = () => {
	const dispatch = useDispatch();
	const routeParams = useParams();

	const model = useSelector(({ logistica }) => logistica.model);

	const [disabled, setDisabled] = useState(false);
	const [noExiste, setNoExiste] = useState(false);
	const [currentPlaca, setCurrentPlaca] = useState('');
	const [currentMarca, setCurrentMarca] = useState('');
	const [currentModelo, setCurrentModelo] = useState('');
	const [currentColor, setCurrentColor] = useState('');
	const [currentObservaciones, setCurrentObservaciones] = useState('');

	const obtenerData = async id => {
		setDisabled(true);
		await showToast(
			{
				promesa: async () => {
					const {
						data: { statusCode, body },
					} = await httpClient.get(`logistica/vehiculos/${id}`);
					if (statusCode === 200) {
						setCurrentPlaca(body.placa);
						setCurrentMarca(body.marca);
						setCurrentModelo(body.modelo);
						setCurrentColor(body.color);
						setCurrentObservaciones(body.observaciones);
					}
					setDisabled(false);
					return { payload: { message: 'Vehiculo encontrado' } };
				},
				parametros: [],
			},
			'buscar',
			'Vehiculo'
		);
	};

	useDeepCompareEffect(() => {
		function updateFamiliaState() {
			if (routeParams.id === 'nuevo') {
				dispatch(newVehiculo());
			} else {
				dispatch(getVehiculoId(routeParams.id)).then(action => {
					if (!action.payload) {
						setNoExiste(true);
					}
				});
				obtenerData(routeParams.id);
			}
		}

		updateFamiliaState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		return () => {
			dispatch(resetVehiculo());
			setNoExiste(false);
		};
	}, [dispatch]);

	if (noExiste) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontro el vehiculo!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/logistica/vehiculo"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (model && parseInt(routeParams.id, 10) !== model.id && routeParams.id !== 'nuevo') {
		return <FuseLoading />;
	}

	return (
		<Root
			header={
				<Header
					tipo={routeParams.id}
					data={{
						currentPlaca,
						currentMarca,
						currentModelo,
						currentColor,
						currentObservaciones,
					}}
				/>
			}
			content={
				<div className="p-16 sm:p-24 ">
					<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Detalles</div>
					<div>
						<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
							<InputString
								label="Placa"
								value={currentPlaca}
								onChange={event => {
									setCurrentPlaca(event.target.value);
								}}
								required
								disabled={disabled}
							/>
							<InputString
								label="Marca"
								value={currentMarca}
								onChange={event => {
									setCurrentMarca(event.target.value);
								}}
								required
								disabled={disabled}
							/>
						</div>
						<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
							<InputString
								label="Modelo"
								value={currentModelo}
								onChange={event => {
									setCurrentModelo(event.target.value);
								}}
								disabled={disabled}
							/>
							<InputString
								label="Color"
								value={currentColor}
								onChange={event => {
									setCurrentColor(event.target.value);
								}}
								disabled={disabled}
							/>
						</div>
						<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
							<InputString
								label="Observaciones"
								value={currentObservaciones}
								onChange={event => {
									setCurrentObservaciones(event.target.value);
								}}
								disabled={disabled}
							/>
						</div>
					</div>
				</div>
			}
			innerScroll
		/>
	);
};

export default withReducer('logistica', reducer)(Formulario);

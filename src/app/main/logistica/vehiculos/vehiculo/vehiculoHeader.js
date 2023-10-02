/* eslint-disable no-nested-ternary */
/* eslint-disable no-throw-literal */
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import { useTheme } from '@mui/material/styles';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';

import showToast from 'utils/Toast';
import { createVehiculo, updateVehiculo, deleteVehiculo } from '../../store/vehiculo/vehiculoSlice';
import { deleteVehiculosArray } from '../../store/vehiculo/vehiculosSlice';

function Header({ tipo, data }) {
	const dispatch = useDispatch();
	const theme = useTheme();
	const navigate = useNavigate();

	async function handleSaveOrden() {
		showToast(
			{
				promesa: save,
				parametros: [],
			},
			'save',
			'orden corte'
		);
	}

	function validateFormulario(formData) {
		const { currentPlaca, currentMarca } = formData;

		if (currentPlaca.length < 2 || currentPlaca === null) {
			return { isValid: false, errorMessage: 'Debe ingresar una placa válida' };
		}

		if (currentMarca.length < 2 || currentMarca === null) {
			return { isValid: false, errorMessage: 'Debe ingresar una marca válida' };
		}

		return { isValid: true, errorMessage: null };
	}

	async function save() {
		try {
			let error = {};

			const { isValid, errorMessage } = validateFormulario(data);

			if (!isValid) throw new Error(errorMessage);

			const body = {
				placa: data.currentPlaca,
				marca: data.currentMarca,
				modelo: data.currentModelo,
				color: data.currentColor,
				observaciones: data.currentObervaciones,
			};

			if (tipo === 'nuevo') {
				error = await dispatch(createVehiculo(body));
				if (error.error) throw error;
			} else {
				body.id = tipo;
				error = await dispatch(updateVehiculo(body));
				if (error.error) throw error;
			}
			navigate(`/logistica/vehiculo`);
			return error;
		} catch (error) {
			console.log('Error:', error);
			throw error;
		}
	}

	async function handleRemoveorden() {
		showToast(
			{
				promesa: removeorden,
				parametros: [],
			},
			'delete',
			'orden corte'
		);
	}

	async function removeorden() {
		try {
			const val = await dispatch(deleteVehiculo());
			const error = await dispatch(deleteVehiculosArray(val.payload));
			if (error.error) throw error;
			navigate('/logistica/vehiculo');
		} catch (error) {
			console.log('Error:', error);
			throw error;
		}
	}

	return (
		<div className="flex flex-1 w-full items-center justify-between">
			<div className="flex flex-col items-start max-w-full min-w-0">
				<motion.div
					initial={{ x: 20, opacity: 0 }}
					animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
				>
					<Typography
						className="flex items-center sm:mb-12"
						component={Link}
						role="button"
						to="/logistica/vehiculo"
						color="inherit"
					>
						<Icon className="text-20">
							{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
						</Icon>
						<span className="hidden sm:flex mx-4 font-medium">Volver</span>
					</Typography>
				</motion.div>

				<div className="flex items-center max-w-full">
					<motion.div
						className="hidden sm:flex"
						initial={{ scale: 0 }}
						animate={{ scale: 1, transition: { delay: 0.3 } }}
					>
						<LocalShippingIcon fontSize="large" />
					</motion.div>
					<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
						<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								Nuevo Vehículo
							</Typography>
						</motion.div>
					</div>
				</div>
			</div>
			<motion.div
				className="flex"
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
			>
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					onClick={handleSaveOrden}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default Header;

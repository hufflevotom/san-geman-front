import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import SpeedIcon from '@mui/icons-material/Speed';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import showToast from 'utils/Toast';
import {
	createMetodoPago,
	deleteMetodoPago,
	updateMetodoPago,
} from '../../store/metodoPago/metodoPagoSlice';
import { deleteMetodosPagoArray } from '../../store/metodoPago/metodosPagoSlice';

function MetodoPagoHeader({ tipo }) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const descripcion = watch('descripcion');
	const dias = watch('dias');
	const theme = useTheme();
	const navigate = useNavigate();

	async function handleSaveMetodoPago() {
		showToast(
			{
				promesa: saveMetodoPago,
				parametros: [],
			},
			'save',
			'método de pago'
		);
	}

	async function saveMetodoPago() {
		try {
			let error = {};
			if (tipo === 'nuevo') {
				error = await dispatch(createMetodoPago(getValues()));
				if (error.error) throw error;
			} else {
				error = await dispatch(updateMetodoPago(getValues()));
				if (error.error) throw error;
			}
			navigate(`/configuracion/metodos-pago`);
			return error;
		} catch (error) {
			console.log('Error:', error);
			throw error;
		}
	}

	async function handleRemoveMetodoPago() {
		showToast(
			{
				promesa: removeMetodoPago,
				parametros: [],
			},
			'delete',
			'método de pago'
		);
	}

	async function removeMetodoPago() {
		try {
			const val = await dispatch(deleteMetodoPago());
			const error = await dispatch(deleteMetodosPagoArray(val.payload));
			if (error.error) throw error;
			navigate('/configuracion/metodos-pago');
			return val;
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
						to="/configuracion/metodos-pago"
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
						{/* <img
							className="w-32 sm:w-48 rounded"
							src="assets/images/ecommerce/product-image-placeholder.png"
							alt={nombre}
						/> */}
						<SpeedIcon fontSize="large" />
					</motion.div>
					<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
						<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								{descripcion || 'Nuevo Método de Pago'}
							</Typography>
							<Typography variant="caption" className="font-medium">
								{dias}
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
					onClick={handleRemoveMetodoPago}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					Eliminar
				</Button>
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSaveMetodoPago}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default MetodoPagoHeader;

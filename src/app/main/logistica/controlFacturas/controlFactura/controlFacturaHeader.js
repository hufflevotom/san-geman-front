/* eslint-disable no-throw-literal */
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import { useTheme } from '@mui/material/styles';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';

import showToast from 'utils/Toast';

import {
	createControlFactura,
	deleteControlFactura,
	updateControlFactura,
} from '../../store/controlFactura/controlFacturaSlice';
import { deleteControlFacturasArray } from '../../store/controlFactura/controlFacturasSlice';

function ControlFacturaHeader({ tipo, data }) {
	const dispatch = useDispatch();
	const theme = useTheme();
	const navigate = useNavigate();

	async function handleSaveOrden() {
		showToast(
			{
				promesa: saveOrden,
				parametros: [],
			},
			'save',
			'orden corte'
		);
	}

	async function saveOrden() {
		try {
			let error = {};

			if (!data.currentProduccion) {
				throw { payload: { message: 'La producción es requerida' } };
			}

			if (!data.currentSerie || data.currentSerie === '') {
				throw { payload: { message: 'La serie es requerida' } };
			}

			if (!data.currentNumero || data.currentNumero === '') {
				throw { payload: { message: 'El número es requerido' } };
			}

			if (!data.currentMoneda) {
				throw { payload: { message: 'La moneda es requerida' } };
			}

			if (!data.currentIgvTotal) {
				throw { payload: { message: 'El IGV Total es requerido' } };
			}

			if (!data.currentSubTotal || data.currentSubTotal === 0) {
				throw { payload: { message: 'El SubTotal es requerido' } };
			}

			if (!data.currentTotal || data.currentTotal === 0) {
				throw { payload: { message: 'El Total es requerido' } };
			}

			const body = {
				serie: data.currentSerie,
				numero: data.currentNumero,
				pagado: data.currentPagado,
				produccionId: data.currentProduccion.id,
				moneda: data.currentMoneda.id,
				observaciones: data.currentObservaciones,
				igvTotal: data.currentIgvTotal,
				subTotal: data.currentSubTotal,
				total: data.currentTotal,
			};

			if (typeof data.imagenDocumento !== 'string') {
				body.imagen = data.imagenDocumento;
			}

			if (tipo === 'nuevo') {
				error = await dispatch(createControlFactura(body));
				if (error.error) throw error;
			} else {
				body.id = tipo;
				error = await dispatch(updateControlFactura(body));
				if (error.error) throw error;
			}
			navigate(`/logistica/control-factura`);
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
			const val = await dispatch(deleteControlFactura());
			const error = await dispatch(deleteControlFacturasArray(val.payload));
			if (error.error) throw error;
			navigate('/logistica/control-factura');
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
						to="/logistica/control-factura"
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
						<ReceiptLongIcon fontSize="large" />
					</motion.div>
					<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
						<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								Nueva Factura
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

export default ControlFacturaHeader;

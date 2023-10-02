/* eslint-disable no-throw-literal */
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import showToast from 'utils/Toast';
import { deletePedido } from '../../store/pedido/pedidoSlice';
import { deletePedidosArray } from '../../store/pedido/pedidosSlice';

function PedidoHeader({ handleSavePedido }) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const navigate = useNavigate();

	const pedido = useSelector(({ comercial }) => comercial.pedido);

	const { formState, watch } = methods;
	const { isValid } = formState;

	const nombre = pedido.po ? pedido.po : 'Nuevo Pedido';
	const prefijo = watch('ruc');

	const theme = useTheme();

	async function handleRemovePedido() {
		showToast(
			{
				promesa: removePedido,
				parametros: [],
			},
			'delete',
			'pedido'
		);
	}

	async function removePedido() {
		try {
			const val = await dispatch(deletePedido());
			const error = await dispatch(deletePedidosArray(val.payload));
			if (error.error) throw error;
			navigate('/comercial/pedidos');
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
						to="/comercial/pedidos"
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
								{nombre}
							</Typography>
							<Typography variant="caption" className="font-medium">
								{prefijo}
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
					onClick={handleRemovePedido}
					disabled={pedido?.asignado}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					Eliminar
				</Button>
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					disabled={!isValid || pedido?.asignado}
					onClick={handleSavePedido}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default PedidoHeader;

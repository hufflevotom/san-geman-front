/* eslint-disable no-throw-literal */
/* eslint-disable no-nested-ternary */
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import showToast from 'utils/Toast';
import {
	createProduccion,
	deleteProduccion,
	updateProduccion,
} from '../../store/produccion/produccionSlice';
import { deleteProduccionArray } from '../../store/produccion/produccionesSlice';

function ProduccionHeader({ tipo, codigo }) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const theme = useTheme();
	const navigate = useNavigate();

	async function handleSaveProduccion() {
		showToast(
			{
				promesa: saveProduccion,
				parametros: [],
			},
			'save',
			'producción'
		);
	}

	async function saveProduccion() {
		try {
			let error = {};
			const data = getValues();
			console.log(data);
			if (!data.marca || data.marca === null) {
				throw { payload: { message: 'La marca es requerida' } };
			}

			data.pedidosId = data.dataEstilos.map(pedido => pedido.id);
			data.clienteId = data.cliente.id;
			data.marcaId = data.marca.id;
			data.codigo = codigo;
			data.anio = new Date().getFullYear();
			data.correlativo = parseInt(codigo.split('-')[1], 10);

			if (tipo === 'nuevo') {
				const coloresCliente = [];
				if (data.coloresClientes.some(c => c.colorCliente !== '')) {
					data.coloresClientes.forEach(color => {
						if (color.colorCliente !== '') {
							coloresCliente.push({
								colorId: color.color.id,
								estiloId: color.estilo.id,
								colorCliente: color.colorCliente,
							});
						}
					});
				}
				data.coloresCliente = coloresCliente;
				error = await dispatch(createProduccion(data));
				if (error.error) throw error;
			} else {
				error = await dispatch(updateProduccion(data));
				if (error.error) throw error;
			}
			navigate(`/comercial/producciones`);
			return error;
		} catch (error) {
			console.log('Error:', error);
			throw error;
		}
	}

	async function handleRemoveproduccion() {
		showToast(
			{
				promesa: removeproduccion,
				parametros: [],
			},
			'delete',
			'producción'
		);
	}

	async function removeproduccion() {
		try {
			const val = await dispatch(deleteProduccion());
			const error = await dispatch(deleteProduccionArray(val.payload));
			if (error.error) throw error;
			navigate('/comercial/producciones');
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
						to="/comercial/producciones"
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
						<PendingActionsIcon fontSize="large" />
					</motion.div>
					<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
						<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								{codigo || 'Nueva Produccion'}
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
					onClick={handleRemoveproduccion}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					Eliminar
				</Button>
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSaveProduccion}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default ProduccionHeader;

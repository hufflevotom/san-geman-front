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
import { createMuestra, deleteMuestra, updateMuestra } from '../../store/muestra/muestraSlice';
import { deleteMuestraArray } from '../../store/muestra/muestrasSlice';

function MuestraHeader({ tipo, codigo }) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	// const codigo = watch('codigo');

	const theme = useTheme();
	const navigate = useNavigate();

	async function handleSaveMuestra() {
		showToast(
			{
				promesa: saveMuestra,
				parametros: [],
			},
			'save',
			'muestra'
		);
	}

	async function saveMuestra() {
		try {
			let error = {};
			const data = getValues();

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
				error = await dispatch(createMuestra(data));
				if (error.error) throw error;
			} else {
				error = await dispatch(updateMuestra(data));
				if (error.error) throw error;
			}
			navigate(`/comercial/muestras`);
			return error;
		} catch (error) {
			console.log('Error:', error);
			throw error;
		}
	}

	async function handleRemovemuestra() {
		showToast(
			{
				promesa: removemuestra,
				parametros: [],
			},
			'delete',
			'muestra'
		);
	}

	async function removemuestra() {
		try {
			const val = await dispatch(deleteMuestra());
			const error = await dispatch(deleteMuestraArray(val.payload));
			if (error.error) throw error;
			navigate('/comercial/muestras');
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
						to="/comercial/muestras"
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
								{codigo || 'Nueva Muestra'}
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
					onClick={handleRemovemuestra}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					Eliminar
				</Button>
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSaveMuestra}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default MuestraHeader;

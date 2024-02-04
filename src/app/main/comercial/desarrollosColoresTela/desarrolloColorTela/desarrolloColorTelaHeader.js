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
	createDesarrolloColorTela,
	deleteDesarrolloColorTela,
	updateDesarrolloColorTela,
} from '../../store/desarrolloColorTela/desarrolloColorTelaSlice';
import { deleteDarrollosColoresTelaArray } from '../../store/desarrolloColorTela/desarrollosColoresTelaSlice';

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
			'solicitud'
		);
	}

	async function saveOrden() {
		try {
			let error = {};

			if (!data.currentProveedor) {
				throw { payload: { message: 'El proveedor es requerido' } };
			}

			if (!data.currentCliente) {
				throw { payload: { message: 'El cliente es requerido' } };
			}

			if (!data.currentMarca) {
				throw { payload: { message: 'La marca es requerida' } };
			}

			if (!data.currentTipoTela || data.currentTipoTela === '') {
				throw { payload: { message: 'El tipo de tela es requerido' } };
			}

			if (!data.currentPantone || data.currentPantone === '') {
				throw { payload: { message: 'El pantone es requerido' } };
			}

			if (!data.currentComposicion || data.currentComposicion === '') {
				throw { payload: { message: 'La composición es requerida' } };
			}

			if (!data.currentTipoTenido || data.currentTipoTenido === '') {
				throw { payload: { message: 'El tipo de teñido es requerido' } };
			}

			if (!data.currentColorSG || data.currentColorSG === '') {
				throw { payload: { message: 'El color SG es requerido' } };
			}

			if (!data.currentColorCliente || data.currentColorCliente === '') {
				throw { payload: { message: 'El color cliente es requerido' } };
			}

			const body = {
				pantone: data.currentPantone,
				tipoTela: data.currentTipoTela,
				composicion: data.currentComposicion,
				tipoTenido: data.currentTipoTenido,
				colorCliente: data.currentColorCliente,
				colorSG: data.currentColorSG,
				clienteId: data.currentCliente.id,
				marcaId: data.currentMarca.id,
				proveedorId: data.currentProveedor.id,
			};

			if (tipo === 'nuevo') {
				error = await dispatch(createDesarrolloColorTela(body));
				if (error.error) throw error;
			} else {
				body.id = tipo;
				error = await dispatch(updateDesarrolloColorTela(body));
				if (error.error) throw error;
			}
			navigate(`/comercial/desarrollo-color-tela`);
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
			'solicitud'
		);
	}

	async function removeorden() {
		try {
			const val = await dispatch(deleteDesarrolloColorTela());
			const error = await dispatch(deleteDarrollosColoresTelaArray(val.payload));
			if (error.error) throw error;
			navigate('/comercial/desarrollo-color-tela');
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
						to="/comercial/desarrollo-color-tela"
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
								Nueva solicitud de desarrollo de color para tela
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

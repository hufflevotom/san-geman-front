/* eslint-disable no-throw-literal */
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import { useTheme } from '@mui/material/styles';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import moment from 'moment';

import showToast from 'utils/Toast';

import {
	createOrdenServicioGeneral,
	updateOrdenServicioGeneral,
} from '../../store/ordenServicioGeneral/ordenServicioGeneralSlice';

function OrdenServicioGeneralHeader({ tipo, descripcion, data }) {
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
			'orden servicio'
		);
	}

	async function saveOrden() {
		try {
			let error = {};
			const costosOrdenesServicioGeneral = [];
			let igvTotal = 0;
			let total = 0;

			if (!data.currentTipoOrden) {
				throw { payload: { message: 'El tipo de orden es requerido' } };
			}

			if (!data.currentProduccion) {
				throw { payload: { message: 'La producción es requerida' } };
			}

			if (!data.currentEstilo) {
				throw { payload: { message: 'El estilo es requerida' } };
			}

			if (!data.currentTipoOrden) {
				throw { payload: { message: 'El tipo de orden es requerido' } };
			}

			if (!data.currentTipoServicio) {
				throw { payload: { message: 'El tipo de servicio es requerido' } };
			}

			if (!data.currentFechaEntrega || data.currentFechaEntrega === '') {
				throw { payload: { message: 'La fecha de entrega es requerida' } };
			}

			if (!data.currentProveedor) {
				throw { payload: { message: 'El proveedor es requerido' } };
			}

			if (!data.currentMoneda || data.currentMoneda === undefined) {
				throw { payload: { message: 'La moneda es requerida' } };
			}

			if (!data.currentFormaPago) {
				throw { payload: { message: 'La forma de pago es requerida' } };
			}

			if (!data.cantidadesData || data.cantidadesData.length === 0) {
				throw { payload: { message: 'Los costos son requeridos' } };
			} else {
				data.cantidadesData.forEach((item2, index2) => {
					const costo =
						typeof item2.precioUnitario === 'string'
							? parseFloat(item2.precioUnitario)
							: item2.precioUnitario;

					if (costo === 0) {
						throw { payload: { message: 'Los costos son requeridos' } };
					}

					if (data.currentTipoServicio.id !== 'IN') igvTotal += item2.igv ? item2.igv : 0;
					total += item2.cantidad * costo;

					costosOrdenesServicioGeneral.push({
						cantidad: item2.cantidad,
						unidadMedida: item2.unidadMedida.id,
						prendaId: data.prenda.id,
						colorId: item2.color.id,
						precioUnitario: costo,
						igv: data.currentTipoServicio.id !== 'IN' ? 0 : item2.igv,
					});
				});
			}

			const body = {
				tipoOrdenGeneral: data.currentTipoOrdenServicio.id,
				tipoServicio: data.currentTipoServicio.id,
				produccionId: data.currentProduccion.id,
				estiloId: data.currentEstilo.id,
				rutaId: data.currentTipoOrden.id,
				guiaRemision: data.currentGuiasRemision,
				fechaEntrega: moment(data.currentFechaEntrega),
				proveedorId: data.currentProveedor.id,
				moneda: data.currentMoneda.id,
				formaPagoId: data.currentFormaPago.id,
				lugarEntrega: data.currentLugarEntrega,
				atencion: data.currentAtencion,
				estado: data.currentEstado,
				fax: data.currentFax,
				observaciones: data.currentObservacionGeneral,
				costosOrdenesServicioGeneral,
				igvTotal,
				subTotal: total - igvTotal,
				total,
			};
			if (tipo === 'nuevo') {
				error = await dispatch(createOrdenServicioGeneral(body));
				if (error.error) throw error;
			} else {
				body.id = tipo;
				error = await dispatch(updateOrdenServicioGeneral(body));
				if (error.error) throw error;
			}
			navigate(`/logistica/ordenes-servicio-general`);
			return error;
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
						to="/logistica/ordenes-servicio-general"
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
							alt={descripcion}
						/> */}
						<AssignmentIcon fontSize="large" />
					</motion.div>
					<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
						<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								{descripcion || 'Nueva Orden de Servicio de Corte'}
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
					// disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSaveOrden}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default OrdenServicioGeneralHeader;

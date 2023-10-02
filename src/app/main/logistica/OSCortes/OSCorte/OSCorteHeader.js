/* eslint-disable no-throw-literal */
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import { useTheme } from '@mui/material/styles';
import Grid4x4Icon from '@mui/icons-material/Grid4x4';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import moment from 'moment';

import showToast from 'utils/Toast';

import { createOSCorte, deleteOSCorte, updateOSCorte } from '../../store/os-corte/oSCorteSlice';
import { deleteOSCortesArray } from '../../store/os-corte/oSCortesSlice';

function OrdenCorteHeader({ tipo, descripcion, data }) {
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
			const ordenesCortePaniosId = [];
			const costosOrdenesServicioCorte = [];
			let igvTotal = 0;
			let total = 0;
			let cortePanos = false;

			if (!data.currentTipoServicio) {
				throw { payload: { message: 'El tipo de servicio es requerido' } };
			}

			if (!data.currentProduccion) {
				throw { payload: { message: 'La producción es requerida' } };
			}

			if (!data.currentOrdenesCorte || data.currentOrdenesCorte.length === 0) {
				throw { payload: { message: 'Las ordenes de corte son requeridos' } };
			} else {
				data.currentOrdenesCorte.forEach((item, index) => {
					ordenesCortePaniosId.push(item.id);
					cortePanos = item.ordenesCorte.findIndex(f => f.panios === true) !== -1;
				});
			}

			if (!data.currentGuiasRemision || data.currentGuiasRemision === '') {
				throw { payload: { message: 'La guía de remisión es requerida' } };
			}

			if (!data.currentFechaEmision || data.currentFechaEmision === '') {
				throw { payload: { message: 'La fecha de emisión es requerida' } };
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
				data.cantidadesData.forEach((item, index) => {
					item.cantidades.forEach((item2, index2) => {
						const costo = typeof item2.costo === 'string' ? parseFloat(item2.costo) : item2.costo;

						if (costo === 0) {
							throw { payload: { message: 'Los costos son requeridos' } };
						}

						if (data.currentTipoServicio.id !== 'IN') igvTotal += item2.igv ? item2.igv : 0;
						total += item2.subTotal ? item2.subTotal : 0;

						costosOrdenesServicioCorte.push({
							estiloCantidadPañosId: item2.id,
							precioUnitario: costo,
							costo: total,
							igv: data.currentTipoServicio.id !== 'IN' ? 0 : item2.igv,
						});
					});
				});
			}

			const year = new Date().getFullYear();

			const body = {
				codigo: descripcion,
				anio: year,
				correlativo: data.codigo,
				tipoServicio: data.currentTipoServicio.id,
				produccionId: data.currentProduccion.id,
				ordenesCortePaniosId,
				guiaRemision: data.currentGuiasRemision,
				fechaEmision: moment(data.currentFechaEmision),
				fechaEntrega: moment(data.currentFechaEntrega),
				proveedorId: data.currentProveedor.id,
				moneda: data.currentMoneda.id,
				formaPagoId: data.currentFormaPago.id,
				lugarEntrega: data.currentLugarEntrega,
				observaciones: data.currentObservacionGeneral,
				costosOrdenesServicioCorte,
				igvTotal,
				subTotal: total - igvTotal,
				total,
				cortePanos,
			};

			if (tipo === 'nuevo') {
				error = await dispatch(createOSCorte(body));
				if (error.error) throw error;
			} else {
				body.id = tipo;
				error = await dispatch(updateOSCorte(body));
				if (error.error) throw error;
			}
			navigate(`/logistica/ordenes-servicio-corte`);
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
			const val = await dispatch(deleteOSCorte());
			const error = await dispatch(deleteOSCortesArray(val.payload));
			if (error.error) throw error;
			navigate('/logistica/ordenes-servicio-corte');
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
						to="/logistica/ordenes-servicio-corte"
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
						<Grid4x4Icon fontSize="large" />
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
					onClick={handleRemoveorden}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					Eliminar
				</Button>
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

export default OrdenCorteHeader;

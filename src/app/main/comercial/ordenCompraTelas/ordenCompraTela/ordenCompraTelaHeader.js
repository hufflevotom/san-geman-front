/* eslint-disable no-throw-literal */
/* eslint-disable no-nested-ternary */
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import TextureIcon from '@mui/icons-material/Texture';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import _ from '@lodash';
import showToast from 'utils/Toast';
import {
	createOCTela,
	updateOCTela,
	deleteOCTela,
} from '../../store/ordenCompraTela/ordenCompraTelaSlice';
import { deleteOrdenCompraTelasArray } from '../../store/ordenCompraTela/ordenCompraTelasSlice';

function OrdenCompraTelaHeader({
	tipo,
	codigo,
	currentProveedor,
	currentMoneda,
	currentFormaPago,
	partidas,
}) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	// const codigo = watch('codigo');

	const theme = useTheme();
	const navigate = useNavigate();

	async function handleSaveOrdenCompraTela() {
		showToast(
			{
				promesa: saveOrdenCompraTela,
				parametros: [],
			},
			'save',
			'orden compra de tela'
		);
	}

	async function saveOrdenCompraTela() {
		try {
			let error = {};
			if (tipo === 'nuevo') {
				const data = getValues();
				console.log('data', { ...data });
				if (!currentProveedor) {
					throw { payload: { message: 'El proveedor es requerido' } };
				}

				if (!currentMoneda || currentMoneda === undefined) {
					throw { payload: { message: 'La moneda es requerida' } };
				}

				if (!currentFormaPago) {
					throw { payload: { message: 'La forma de pago es requerida' } };
				}

				if (!data.fechaEntrega) {
					throw { payload: { message: 'Ingrese la fecha de entrega' } };
				}

				data.codigo = codigo;
				data.anio = new Date().getFullYear();
				data.correlativo = parseInt(codigo.split('-')[1], 10);
				let valorVenta = 0;
				let igv = 0;
				let total = 0;
				const arrayTelas = [];

				if (!data.tipoOperacion || data.tipoOperacion.value !== 'libre') {
					data.detalleOrdenComprasTelas.forEach(element => {
						if (element.totalImporte) {
							valorVenta += element.totalImporte;
						}
					});

					data.detalleOrdenComprasTelas.forEach(tela => {
						arrayTelas.push({
							telaId: tela.telaId,
							colorId: tela.colorId,
							cantidad: tela.cantidad,
							unidadId: tela.umId,
							valorUnitario: tela.valorUnitario,
							descuento: tela.descuento,
							precioUnitario: tela.precioUnitario,
							totalImporte: tela.totalImporte,
							colorCliente: tela.colorCliente,
						});
					});
				} else {
					data.telasLibres.forEach(element => {
						if (element.totalImporte) {
							valorVenta += element.totalImporte;
						}
					});

					data.telasLibres.forEach(tela => {
						arrayTelas.push({
							telaId: tela.tela.id,
							colorId: tela.colores.id,
							cantidad: tela.cantidad,
							unidadId: tela.unidad.id,
							valorUnitario: tela.valorUnitario,
							descuento: tela.descuento,
							precioUnitario: tela.precioUnitario,
							totalImporte: tela.totalImporte,
							colorCliente: '-',
						});
					});
				}

				total = valorVenta * 1.18;
				igv = total - valorVenta;

				data.valorVenta = parseFloat(valorVenta.toFixed(2));
				data.igv = parseFloat(igv.toFixed(2));
				data.total = parseFloat(total.toFixed(2));

				data.telas = arrayTelas;
				data.proveedorId = currentProveedor.id;
				data.moneda = currentMoneda.id;
				data.formaPagoId = currentFormaPago.id;

				if (data.produccion?.id) {
					data.produccionId = data.produccion.id;
				}

				if (data.muestra?.id) {
					data.muestraId = data.muestra.id;
				}

				data.tipo = data.tipo.value;
				data.tipoOperacion = data.tipoOperacion ? data.tipoOperacion.value.toUpperCase() : 'NORMAL';
				data.fechaEmision = moment().toISOString();
				data.fechaAnulacion = null;
				data.partidasAsignar = partidas || [];

				error = await dispatch(createOCTela(data));
				if (error.error) throw error;
			} else {
				const data = getValues();
				console.log('data', { ...data });
				if (!currentProveedor) {
					throw { payload: { message: 'El proveedor es requerido' } };
				}

				if (!currentMoneda || currentMoneda === undefined) {
					throw { payload: { message: 'La moneda es requerida' } };
				}

				if (!currentFormaPago) {
					throw { payload: { message: 'La forma de pago es requerida' } };
				}

				if (!data.fechaEntrega) {
					throw { payload: { message: 'Ingrese la fecha de entrega' } };
				}

				data.codigo = codigo;
				data.anio = new Date().getFullYear();
				data.correlativo = parseInt(codigo.split('-')[1], 10);

				let valorVenta = 0;
				let igv = 0;
				let total = 0;
				const arrayTelas = [];

				data.detalleOrdenComprasTelas.forEach(element => {
					if (element.totalImporte) {
						valorVenta += parseFloat(element.totalImporte.toString());
					}
				});

				console.log('detalleOrdenComprasTelas', data.detalleOrdenComprasTelas);

				data.detalleOrdenComprasTelas.forEach(tela => {
					arrayTelas.push({
						id: tela.id,
						telaId: tela.producto ? tela.producto.tela.id : tela.telaId,
						colorId: tela.producto ? tela.producto.color.id : tela.colorId,
						cantidad: tela.cantidad,
						unidadId: tela.unidad ? tela.unidad.id : tela.umId,
						valorUnitario: tela.valorUnitario,
						descuento: tela.descuento,
						precioUnitario: tela.precioUnitario,
						totalImporte: tela.totalImporte,
						colorCliente: tela.producto?.colorCliente || '-',
					});
				});

				total = valorVenta * 1.18;
				igv = total - valorVenta;

				data.valorVenta =
					typeof valorVenta === 'string'
						? parseFloat(valorVenta).toFixed(2)
						: valorVenta.toFixed(2);
				data.igv = typeof igv === 'string' ? parseFloat(igv).toFixed(2) : igv.toFixed(2);
				data.total = typeof total === 'string' ? parseFloat(total).toFixed(2) : total.toFixed(2);

				data.telas = arrayTelas;

				if (data.produccion?.id) {
					data.produccionId = data.produccion.id;
				} else {
					data.produccionId = null;
				}

				if (data.muestra?.id) {
					data.muestraId = data.muestra.id;
				}

				if (data.tipo?.value) {
					data.tipo = data.tipo.value;
				}

				data.proveedorId = currentProveedor.id;
				data.moneda = currentMoneda.id;
				data.formaPagoId = currentFormaPago.id;
				data.fechaEmision = moment().toISOString();
				data.fechaAnulacion = null;
				data.partidasAsignar = partidas || [];

				error = await dispatch(updateOCTela(data));
				if (error.error) throw error;
			}
			navigate(`/comercial/orden-compra-telas`);
			return error;
		} catch (error) {
			console.log('Error:', error);
			throw error;
		}
	}

	async function handleRemoveordenCompraTela() {
		showToast(
			{
				promesa: removeordenCompraTela,
				parametros: [],
			},
			'delete',
			'orden compra de tela'
		);
	}

	async function removeordenCompraTela() {
		try {
			const val = await dispatch(deleteOCTela());
			const error = await dispatch(deleteOrdenCompraTelasArray(val.payload));
			if (error.error) throw error;
			navigate('/comercial/orden-compra-telas');
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
						to="/comercial/orden-compra-telas"
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
						<TextureIcon fontSize="large" />
					</motion.div>
					<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
						<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								{codigo || 'Nueva órden de compra de Telas'}
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
					onClick={handleRemoveordenCompraTela}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					Eliminar
				</Button>
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSaveOrdenCompraTela}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default OrdenCompraTelaHeader;

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
import _ from '@lodash';
import showToast from 'utils/Toast';
import {
	createOCAvios,
	deleteOCAvio,
	updateOCAvio,
} from '../../store/ordenCompraAvio/ordenCompraAvioSlice';
import { deleteOrdenCompraAviosArray } from '../../store/ordenCompraAvio/ordenCompraAviosSlice';

function OrdenCompraAvioHeader({ tipo, codigo }) {
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
			'orden de compra'
		);
	}

	async function saveOrdenCompraTela() {
		try {
			let error = {};
			const data = getValues();

			let subTotal = 0;
			let igv = 0;
			let total = 0;

			const body = {
				codigo,
				anio: (data.anio = new Date().getFullYear()),
				correlativo: (data.correlativo = parseInt(codigo.split('-')[1], 10)),
				moneda: data.moneda,
				direccion: data.direccion,
				observacion: data.observacion,
				lugarEntrega: data.lugarEntrega,
			};
			// body.fechaEmision =
			// 	typeof data.fechaEmision === 'string' ? data.fechaEmision : data.fechaEmision.toJSON();
			body.fechaEmision = new Date();
			if (data.fechaEntrega !== '') {
				body.fechaEntrega =
					typeof data.fechaEntrega === 'string' ? data.fechaEntrega : data.fechaEntrega.toJSON();
			}
			body.proveedorId = data.proveedor.id;
			body.formaPagoId = data.formaPago.id;
			if (data.produccion) body.produccionId = data.produccion.id;

			if (tipo === 'nuevo') {
				console.log('body', body);
				console.log('data', data);
				if (data.tipoOperacion ? data.tipoOperacion.value !== 'libre' : true) {
					body.detalleOrdenComprasAvios = data.detalleOrdenComprasAvios.map(avio => {
						subTotal += parseFloat(avio.totalImporte);
						if (!subTotal) {
							throw { payload: { message: 'Las cantidades y precios son requeridos' } };
						}
						if (!avio.unidad) {
							if (avio.idUnidadMedida === null) {
								throw { payload: { message: 'La unidad es requerida' } };
							} else {
								avio.unidad = { id: avio.idUnidadMedida };
							}
						}
						return {
							codigo: avio.codigo,
							avioId: avio.avioId,
							cantidad: avio.cantidad,
							unidadId: avio.unidad.id,
							tallaId: avio.tallaId,
							precioUnitario: avio.precioUnitario,
							totalImporte: avio.totalImporte,
						};
					});
				} else {
					body.detalleOrdenComprasAvios = data.aviosLibres.map(avio => {
						subTotal += parseFloat(avio.totalImporte);
						if (!subTotal) {
							throw { payload: { message: 'Las cantidades y precios son requeridos' } };
						}
						if (!avio.unidad) {
							if (avio.idUnidadMedida === null) {
								throw { payload: { message: 'La unidad es requerida' } };
							} else {
								avio.unidad = { id: avio.idUnidadMedida };
							}
						}
						return {
							codigo: avio.avio.codigo,
							avioId: avio.avio.id,
							cantidad: avio.cantidad,
							unidadId: avio.unidad.id,
							tallaId: avio.avio.talla ? avio.avio.talla.id : null,
							precioUnitario: avio.precioUnitario,
							totalImporte: avio.totalImporte,
						};
					});
				}
				total = subTotal * 1.18;
				igv = total - subTotal;

				body.subTotal = parseFloat(subTotal.toFixed(2));
				body.igv = parseFloat(igv.toFixed(2));
				body.total = parseFloat(total.toFixed(2));

				body.tipoOperacion = data.tipoOperacion ? data.tipoOperacion.value.toUpperCase() : 'NORMAL';
				error = await dispatch(createOCAvios(body));
				if (error.error) throw error;
			} else {
				console.log('body', body);
				console.log('data', data);
				body.id = data.id;

				body.detalleOrdenComprasAvios = data.detalleOrdenComprasAvios.map(avio => {
					subTotal += parseFloat(avio.totalImporte);
					if (!subTotal) {
						throw { payload: { message: 'Las cantidades y precios son requeridos' } };
					}
					if (!avio.unidad) {
						if (avio.idUnidadMedida === null) {
							throw { payload: { message: 'La unidad es requerida' } };
						} else {
							avio.unidad = { id: avio.idUnidadMedida };
						}
					}
					return {
						codigo: avio.codigo,
						avioId: avio.producto.avio.id,
						cantidad: avio.cantidad,
						unidadId: avio.unidad.id,
						tallaId: avio.producto.talla ? avio.producto.talla.id : null,
						precioUnitario: avio.precioUnitario,
						totalImporte: avio.totalImporte,
					};
				});
				total = subTotal * 1.18;
				igv = total - subTotal;
				if (data.produccion) body.produccionId = data.produccion.id;
				body.subTotal = parseFloat(subTotal.toFixed(2));
				body.igv = parseFloat(igv.toFixed(2));
				body.total = parseFloat(total.toFixed(2));

				error = await dispatch(updateOCAvio(body));
				if (error.error) throw error;
			}
			navigate(`/comercial/orden-compra-avios`);
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
			'orden compra de avio'
		);
	}

	async function removeordenCompraTela() {
		try {
			const val = await dispatch(deleteOCAvio());
			const error = await dispatch(deleteOrdenCompraAviosArray(val.payload));
			if (error.error) throw error;
			navigate('/comercial/orden-compra-avios');
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
						to="/comercial/orden-compra-avios"
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
								{codigo || 'Nueva órden de compra de Avios'}
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

export default OrdenCompraAvioHeader;

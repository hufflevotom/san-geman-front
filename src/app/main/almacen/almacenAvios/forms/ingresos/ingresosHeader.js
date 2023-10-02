/* eslint-disable no-throw-literal */
/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import httpClient from 'utils/Api';
import _ from '@lodash';
import showToast from 'utils/Toast';
import {
	createIngreso,
	updateAlmacenAvio,
	// deleteAlmacenAvio,
	// updateAlmacenAvio,
} from '../../../store/almacenAvio/ingresos/ingresosAvioSlice';
// import { deleteAlmacenAviosArray } from '../../../store/almacenAvio/ingresos/ingresosAviosSlice';

function IngresoHeader({ tipo }) {
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const nroSerie = watch('nroSerie');
	const nroDoc = watch('nroDocumento');

	const theme = useTheme();
	const navigate = useNavigate();

	async function handleSaveAlmacenAvio() {
		setLoading(true);
		showToast(
			{
				promesa: saveAlmacenAvio,
				parametros: [],
			},
			'save',
			'almacen avio'
		);
		setLoading(false);
	}

	async function saveAlmacenAvio() {
		try {
			let error = {};
			if (tipo === 'nuevo') {
				const body = getValues();
				console.log('BODY:', body);

				const data = {};
				data.observacion = body.observacion;
				data.fechaRegistro = body.fechaRegistro;
				data.fechaDocumento = body.fechaDocumento;
				data.tipoOperacion = body.tipoOperacion.value;

				if (body.origen && data.tipoOperacion !== 'COMPRA NACIONAL CON ORDEN DE COMPRA') {
					data.origen = body.origen.value;
				}
				if (body.detalleOrigen && data.tipoOperacion !== 'COMPRA NACIONAL CON ORDEN DE COMPRA') {
					data.detalleOrigen = body.detalleOrigen;
				}
				data.tipoComprobante = body.tipoComprobante.value;
				data.nroSerie = body.nroSerie;
				data.nroDocumento = body.nroDocumento;

				if (data.tipoOperacion !== 'COMPRA NACIONAL CON ORDEN DE COMPRA') {
					if (body.proveedor) data.proveedorId = body.proveedor.id;
					else throw { payload: { message: 'Debe seleccionar un proveedor' } };

					if (data.origen === 'ORDEN DE PRODUCCIÓN (OP)') {
						if (body.ordenProduccion) {
							data.produccionId = body.ordenProduccion.id;
						} else {
							throw { payload: { message: 'Debe seleccionar una orden de producción' } };
						}
					}
				} else {
					data.proveedorId = body.ordenCompra.proveedor.id;
				}
				data.ordenCompraId = body.ordenCompra?.id || 0;

				if (data.tipoOperacion !== 'COMPRA NACIONAL CON ORDEN DE COMPRA') {
					const arrAvios = [];
					body.aviosComplemento.forEach(e => {
						if (e.avio) {
							arrAvios.push({
								cantidad: parseFloat(e.cantidad),
								ubicacion: e.ubicacion,
								unidadId: e.unidad.id,
								producto: {
									avioId: e.avio.id,
									tallaId: e.avio.talla ? e.avio.talla.id : null,
								},
							});
						}
					});
					data.detallesProductosIngresosAlmacenesAvios = arrAvios;
				} else {
					data.detallesProductosIngresosAlmacenesAvios = body.detalleTabla.map(e => {
						return {
							cantidad: parseFloat(e.nuevaCantidadPrincipal),
							ubicacion: e.ubicacion,
							unidadId: e.nuevaUnidadPrincipal?.id,
							producto: {
								avioId: e.producto.avio.id,
								tallaId: e.producto?.avio?.talla?.id ?? null,
							},
						};
					});
				}

				console.log('data:', data);

				error = await dispatch(createIngreso(data)).then(res => res);
				if (error.error) throw error;
				navigate(`/almacen/avios/ingresos`);
			} else {
				const body = getValues();
				const data = {};
				data.id = body.id;
				data.fechaRegistro = body.fechaRegistro;
				data.fechaDocumento = body.fechaDocumento;
				data.tipoOperacion = body.tipoOperacion.value || body.tipoOperacion;

				if (body.origen && data.tipoOperacion !== 'COMPRA NACIONAL CON ORDEN DE COMPRA') {
					data.origen = body.origen.value || body.origen;
				}
				if (body.detalleOrigen && data.tipoOperacion !== 'COMPRA NACIONAL CON ORDEN DE COMPRA') {
					data.detalleOrigen = body.detalleOrigen;
				}

				data.tipoComprobante = body.tipoComprobante?.value || body.tipoComprobante;
				data.nroSerie = body.nroSerie;
				data.nroDocumento = body.nroDocumento;
				data.proveedorId = body.proveedor?.id || body.ordenCompra.proveedor.id;
				data.ordenCompraId = body.ordenCompra?.id || 0;

				if (data.origen === 'ORDEN DE PRODUCCIÓN (OP)') {
					if (body.ordenProduccion) {
						data.produccionId = body.ordenProduccion.id;
					} else {
						throw { payload: { message: 'Debe seleccionar una orden de producción' } };
					}
				}

				if (data.tipoOperacion !== 'COMPRA NACIONAL CON ORDEN DE COMPRA') {
					const arrAvios = [];
					body.aviosComplemento.forEach(e => {
						if (e.avio) {
							arrAvios.push({
								cantidad: parseFloat(e.cantidad),
								ubicacion: e.ubicacion,
								unidadId: e.unidad?.id,
								producto: {
									avioId: e.avio.id,
									tallaId: e.avio.talla ? e.avio.talla.id : null,
								},
							});
						}
					});
					data.detallesProductosIngresosAlmacenesAvios = arrAvios;
				} else {
					data.detallesProductosIngresosAlmacenesAvios = body.detalleTabla
						? body.detalleTabla.map(e => {
								console.log(e);
								return {
									cantidadPrincipal: parseFloat(e.nuevaCantidadPrincipal),
									ubicacion: e.ubicacion,
									cantidadSecundaria: parseFloat(e.nuevaCantidadSecundaria ?? 0),
									producto: {
										avioId: e.producto.avio.id,
										tallaId: e.producto.talla?.id ?? null,
									},
								};
						  })
						: body.detallesProductosIngresosAlmacenesAvios.map(e => {
								return {
									cantidadPrincipal: parseFloat(e.cantidadPrincipal),
									ubicacion: e.ubicacion,
									cantidadSecundaria: parseFloat(e.cantidadSecundaria ?? 0),
									producto: {
										avioId: e.producto.avio.id,
										tallaId: e.producto.talla?.id ?? null,
									},
								};
						  });
				}

				error = await dispatch(updateAlmacenAvio(data)).then(res => res);
				if (error.error) throw error;
				navigate(`/almacen/avios/ingresos`);
			}
			return error;
		} catch (error) {
			console.log('Error:', error);
			throw error;
		}
	}

	// async function handleRemoveAlmacenAvio() {
	// 	const val = await dispatch(deleteAlmacenAvio());
	// 	await dispatch(deleteAlmacenAviosArray(val.payload));
	// 	navigate('/almacen/avios/ingresos');
	// }

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
						to="/almacen/avios/ingresos"
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
						<ArchitectureIcon fontSize="large" />
					</motion.div>
					<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
						<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								{`${nroSerie} - ${nroDoc}` || 'Nuevo Ingreso'}
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
				{/* <Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					onClick={handleRemoveAlmacenAvio}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					Eliminar
				</Button> */}
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || loading}
					onClick={handleSaveAlmacenAvio}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default IngresoHeader;

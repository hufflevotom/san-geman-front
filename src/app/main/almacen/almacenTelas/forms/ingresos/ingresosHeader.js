/* eslint-disable radix */
/* eslint-disable no-throw-literal */
/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Grid4x4Icon from '@mui/icons-material/Grid4x4';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import showToast from 'utils/Toast';
import { createIngreso } from '../../../store/almacenTela/ingresos/ingresosTelaSlice';
// import { deleteAlmacenTelasArray } from '../../../store/almacenTela/ingresos/ingresosTelasSlice';

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

	async function handleSaveAlmacenTela() {
		showToast(
			{
				promesa: saveAlmacenTela,
				parametros: [],
			},
			'save',
			'almacen tela'
		);
	}

	async function saveAlmacenTela() {
		/* libre: tela, color, cant ingreso, undmedida, partida, cant rollos */
		try {
			setLoading(true);
			let error = {};
			const body = getValues();
			const arreglo = [];
			if (
				typeof body.tipoOperacion === 'string'
					? body.tipoOperacion === 'Ingreso Libre' ||
					  body.tipoOperacion === 'Ingreso Libre - Inventario' ||
					  body.tipoOperacion === 'Ingreso con Orden de Producción (OP)'
					: body.tipoOperacion.value === 'Ingreso Libre' ||
					  body.tipoOperacion.value === 'Ingreso Libre - Inventario' ||
					  body.tipoOperacion.value === 'Ingreso con Orden de Producción (OP)'
			) {
				if (!body.telasComplemento || body.telasComplemento?.length === 0) {
					throw { payload: { message: 'Debe ingresar al menos una tela' } };
				}
				body.telasComplemento?.forEach(detalle => {
					if (
						detalle.numPartida === '' ||
						detalle.numPartida === undefined ||
						detalle.numPartida === '0' ||
						detalle.numPartida === 0 ||
						detalle.cantidad === '' ||
						detalle.cantidad === undefined ||
						detalle.cantidad === '0' ||
						detalle.cantidad === 0 ||
						detalle.ubicacion === '' ||
						detalle.ubicacion === undefined ||
						detalle.cantidadRollo === '' ||
						detalle.cantidadRollo === undefined ||
						detalle.cantidadRollo === '0' ||
						detalle.cantidadRollo === 0 ||
						!detalle.cantidad ||
						detalle.cantidad === undefined ||
						!detalle.tela ||
						detalle.tela === undefined ||
						!detalle.colores ||
						detalle.colores === undefined ||
						!detalle.unidad ||
						detalle.unidad === undefined
					) {
						throw { payload: { message: 'Complete todos los datos de las telas' } };
					}
					arreglo.push({
						cantidad: parseFloat(detalle.cantidad),
						unidadId: detalle.unidad?.id,
						cantidadRollos: parseFloat(detalle.cantidadRollo),
						ubicacion: detalle.ubicacion,
						producto: {
							telaId: detalle.tela?.id,
							colorId: detalle.colores?.id,
							colorCliente: '-',
							partida: detalle.numPartida,
							clasificacion: detalle.clasificacion
								? detalle.clasificacion.label !== ''
									? detalle.clasificacion.label
									: 'Tela OK'
								: 'Tela OK',
						},
					});
				});

				body.proveedorId = body.proveedor?.id;
				body.detallesProductosIngresosAlmacenesTelas = arreglo;
				// if (
				// 	body.tipoOperacion === 'Ingreso con Orden de Producción (OP)' ||
				// 	body.tipoOperacion.value === 'Ingreso con Orden de Producción (OP)'
				// ) {
				if (
					(body.tipoOperacion === 'Ingreso con Orden de Producción (OP)' ||
						body.tipoOperacion.value === 'Ingreso con Orden de Producción (OP)') &&
					!body.ordenProduccion
				) {
					throw { payload: { message: 'Seleccione una orden de producción' } };
				}
				if (body.ordenProduccion) {
					body.produccionId = body.ordenProduccion?.id;
				}
				// }
			} else {
				body.detalleTabla?.forEach(detalle => {
					if (
						detalle.numeroPartida === '' ||
						detalle.numeroPartida === undefined ||
						detalle.numeroPartida === '0' ||
						detalle.numeroPartida === 0
					) {
						throw { payload: { message: 'Las partidas son requeridas' } };
					}
					if (detalle.cantidadRollo) {
						arreglo.push({
							cantidad: detalle.nuevaCantidadPrincipal
								? parseFloat(detalle.nuevaCantidadPrincipal)
								: parseFloat(detalle.nuevaCantidadSecundaria),
							unidadId: detalle.nuevaUnidadPrincipal
								? detalle.nuevaUnidadPrincipal?.id
								: detalle.nuevaUnidadSecundaria?.id,
							ubicacion: detalle.ubicacion,
							cantidadRollos: parseFloat(detalle.cantidadRollo),
							producto: {
								telaId: detalle.producto?.tela?.id,
								colorId: detalle.producto?.color?.id,
								colorCliente: detalle.colorCliente,
								partida: detalle.numeroPartida,
								clasificacion: detalle.clasificacion ? detalle.clasificacion.label : 'Tela OK',
							},
						});
					}
				});

				body.ordenCompraId = body.ordenCompra?.id;
				body.proveedorId = body.ordenCompra?.proveedor?.id;
				body.detallesProductosIngresosAlmacenesTelas = arreglo;
			}

			body.tipoComprobante = body.tipoComprobante?.value;
			body.tipoOperacion = body.tipoOperacion?.value;

			delete body.ordenCompra;
			delete body.detalleTabla;

			if (tipo === 'nuevo') {
				error = await dispatch(createIngreso(body));
				if (error.error) throw error;
				navigate(`/almacen/telas/ingreso`);
				// } else {
				// 	error = await dispatch(updateIngreso(body));
				// 	if (error.error) throw error;
			}
			navigate(`/almacen/telas/ingreso`);
			setLoading(false);
			return error;
		} catch (error) {
			console.log('Error:', error);
			setLoading(false);
			throw error;
		}
	}

	// async function handleRemoveAlmacenTela() {
	// 	const val = await dispatch(deleteAlmacenTela());
	// 	await dispatch(deleteAlmacenTelasArray(val.payload));
	// 	navigate('/almacen/telas/ingresos');
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
						to="/almacen/telas/ingreso"
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
						<Grid4x4Icon fontSize="large" />
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
					onClick={handleRemoveAlmacenTela}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					Eliminar
				</Button> */}
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid || loading}
					onClick={handleSaveAlmacenTela}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default IngresoHeader;

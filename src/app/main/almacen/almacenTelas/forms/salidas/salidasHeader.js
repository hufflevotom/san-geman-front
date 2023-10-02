/* eslint-disable no-nested-ternary */
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Grid4x4Icon from '@mui/icons-material/Grid4x4';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import showToast from 'utils/Toast';
import { createSalida, updateSalida } from '../../../store/almacenTela/salidas/salidaTelaSlice';

function SalidasHeader({ tipo }) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const natNombres = watch('natNombres');
	const natApellidoPaterno = watch('natApellidoPaterno');
	const natApellidoMaterno = watch('natApellidoMaterno');
	const razónSocial = watch('razónSocial');
	const natNroDocumento = watch('natNroDocumento');
	const natTipoDocumento = watch('natTipoDocumento');
	const tipoPersona = watch('tipo');
	const tipoAlmacenTela = watch('tipoAlmacenTela');
	const ruc = watch('ruc');

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
		try {
			let error = {};
			const body = getValues();

			body.fechaRegistro = new Date();
			body.tipoOperacion = body.tipoOperacion.value;

			if (
				typeof body.tipoOperacion === 'string'
					? body.tipoOperacion === 'Salida Libre' || body.tipoOperacion === 'Salida Libre con OP/OM'
					: body.tipoOperacion.value === 'Salida Libre' ||
					  body.tipoOperacion.value === 'Salida Libre con OP/OM'
			) {
				const arrData = [];
				body.telasComplemento.forEach(detalle => {
					console.log(detalle);
					if (parseFloat(detalle.cantidad) <= detalle.stock && parseFloat(detalle.cantidad) > 0) {
						arrData.push({
							cantidad: parseFloat(detalle.cantidad),
							cantidadRollos: parseFloat(detalle.cantidadRollo),
							cantidadRollosRestantes: parseFloat(detalle.cantidadRolloRestante),
							//* Unidad Kilogramos
							unidadId: detalle.productoTela.unidadMedida.id,
							producto: {
								telaId: detalle.productoTela.tela.id,
								colorId: detalle.productoTela.color.id,
								partida: detalle.productoTela.partida,
								clasificacion: detalle.productoTela.clasificacion,
							},
						});
					} else {
						throw new Error(
							`La cantidad de ${detalle.avio?.producto?.avio?.nombre} no puede ser mayor a ${detalle.avio?.cantidad} o menor a 0`
						);
					}
				});
				body.detallesProductosSalidasAlmacenesTelas = arrData;
				if (
					typeof body.tipoOperacion === 'string'
						? body.tipoOperacion === 'Salida Libre con OP/OM'
						: body.tipoOperacion.value === 'Salida Libre con OP/OM'
				) {
					if (body.tipoOrdenSalida.id === 1) {
						body.ordenProduccionId = body.ordenProduccion?.id;
					} else {
						body.ordenMuestraId = body.ordenMuestra?.id;
					}
					body.tipoOrdenSalida = body.tipoOrdenSalida?.label;
				}
			} else {
				body.ordenServicioCorteId = body.ordenServicioCorte.id;
				body.detallesProductosSalidasAlmacenesTelas = body.detalleTabla.map(detalle => {
					return {
						cantidad: parseFloat(detalle.cantidadSalida),
						cantidadRollos: parseFloat(detalle.cantidadRollos),
						cantidadRollosRestantes: parseFloat(detalle.cantidadRollosRestantes),
						//* Unidad Kilogramos
						unidadId: 1,
						producto: {
							telaId: detalle.productoTela.tela.id,
							colorId: detalle.productoTela.color.id,
							partida: detalle.productoTela.partida,
							clasificacion: detalle.productoTela.clasificacion,
						},
					};
				});
			}
			delete body.ordenServicioCorte;
			delete body.detalleTabla;
			if (tipo === 'nuevo') {
				error = await dispatch(createSalida(body));
				if (error.error) throw error;
				navigate(`/almacen/telas/salida`);
			} else {
				error = await dispatch(updateSalida(body));
				if (error.error) throw error;
				navigate(`/almacen/telas/salida`);
			}
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
						to="/almacen/telas/salida"
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
								{razónSocial || 'Nueva Salida'}
							</Typography>
							<Typography variant="caption" className="font-medium">
								{tipoPersona === 'N' ? (natTipoDocumento === 'RUC' ? ruc : natNroDocumento) : ruc}
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
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSaveAlmacenTela}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default SalidasHeader;

/* eslint-disable no-throw-literal */
/* eslint-disable spaced-comment */
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import showToast from 'utils/Toast';
import {
	createOrdenCorte,
	deleteOrdenCorte,
	updateOrdenCorte,
} from '../../store/orden-corte/ordenCorteSlice';
import { deleteOrdenesCorteArray } from '../../store/orden-corte/ordenesCorteSlice';

function OrdenCorteHeader({
	tipo,
	disabled,
	descripcion,
	codigo,
	subCodigo,
	setModalAgregarSubCodigo,
	currentProduccion,
	currentPartida,
	currentTelas,
	currentColor,
	currentEstilos,
	currentTipoPrenda,
	currentMolde,
	currentCheckPanios,
	currentTablaTizado,
	currentObservaciones,
	currentObservacionGeneral,
	temporalProductosTela,
}) {
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
			const cantidades = [];
			const tizados = [];
			const tizadosNuevos = [];
			const extras = [];

			if (!currentProduccion) {
				throw { payload: { message: 'La orden de producción es requerida' } };
			}
			if (!currentPartida || currentPartida.length === 0) {
				throw { payload: { message: 'Las partidas son requeridas' } };
			}
			if (!currentTelas || currentTelas.length === 0) {
				throw { payload: { message: 'Las telas son requeridas' } };
			}
			if (!currentEstilos || currentEstilos.length === 0) {
				throw { payload: { message: 'Los estilos son requeridos' } };
			}
			if (!currentMolde || currentMolde === '') {
				throw { payload: { message: 'El molde es requerido' } };
			}
			if (!currentTablaTizado || currentTablaTizado.length === 0) {
				throw { payload: { message: 'Las cantidades a cortar son requeridas' } };
			} else {
				currentTablaTizado?.forEach((element, i) => {
					const ordenCortePañoCantidades = [];
					element.tizados?.forEach((element2, j) => {
						element2.cantidadesTizado.forEach(element3 => {
							const tallaId = element.tallas.find(talla => talla.talla === element3.talla).id;
							ordenCortePañoCantidades.push({
								tallaId,
								cantidad: element3.cantidad,
							});
						});
						tizados.push({ estiloId: element.estiloId, ...element2 });
					});
					cantidades.push({
						estiloId: element.estiloId,
						ordenCortePañoCantidades,
					});
				});
			}

			if (!tizados || tizados.length === 0) {
				throw { payload: { message: 'Los tizados son requeridos' } };
			} else {
				tizados.forEach((item, index) => {
					const tizadosCantidades = [];
					item.cantidadesTizado.forEach(element => {
						tizadosCantidades.push({
							tallaId: element.id,
							cantidad: parseFloat(element.cantidad),
							multiplicador: parseFloat(element.relacion),
						});
					});
					tizadosNuevos.push({
						orden: index,
						cantPaños: parseFloat(item.cantidadPano),
						largoTizado: parseFloat(item.largoTizado),
						pesoPaño: item.pesoPano,
						estiloId: item.estiloId,
						productoTelaId: item.tela ? item.tela.id : null,
						tizadosCantidades,
					});
				});
			}
			if (!currentObservaciones || currentObservaciones.length === 0) {
				throw { payload: { message: 'Los datos de tela real son requeridos' } };
			} else {
				currentObservaciones.forEach((item, index) => {
					if (!item.telaProgramada || item.telaProgramada === '0') {
						throw { payload: { message: 'Los datos de tela real son requeridos' } };
					}
					extras.push({
						telaProgramada: item.telaProgramada,
						productoTelaId: item.productoTelaId,
						sumaPesos: item.sumaPesos,
						detalles: item.partidas.map(element => ({
							kardexTelaId: element.kardexTelaId,
							partida: element.partida,
							anchoReal: element.anchoReal,
							densidadReal: element.densidadReal,
							saldoTeorico: element.cantidadAlmacen - element.telaProgramada,
							cantidad: element.telaProgramada,
						})),
					});
				});
			}
			// if (!currentObservacionGeneral || currentObservacionGeneral === '') {
			// 	throw { payload: { message: 'La observación general es requerida' } };
			// }

			const productosTelasId = [];
			temporalProductosTela.forEach(item => {
				if (currentTelas.findIndex(z => item.tela.id === z.tela.id) !== -1) {
					productosTelasId.push(item.id);
				}
			});

			const body = {
				produccionId: currentProduccion ? currentProduccion.id : null,
				partida: JSON.stringify(currentPartida.map(item => item.partida)),
				codigo,
				subCodigo,
				productosTelasId,
				colorId: currentColor ? currentColor.id : null,
				estilosId: currentEstilos ? currentEstilos.map(item => item.id) : [],
				prendaId: currentTipoPrenda ? currentTipoPrenda.id : null,
				molde: currentMolde,
				panios: currentCheckPanios,
				observaciones: currentObservacionGeneral,
				estiloCantidadesPaños: cantidades,
				tizados: tizadosNuevos,
				extras,
			};
			if (tipo === 'nuevo') {
				error = await dispatch(createOrdenCorte(body));
				if (error.error) throw error;
			} else {
				body.id = tipo;
				error = await dispatch(updateOrdenCorte(body));
				if (error.error) throw error;
			}
			setModalAgregarSubCodigo(true);
			return error;
		} catch (error) {
			console.error(error);
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
			const val = await dispatch(deleteOrdenCorte());
			const error = await dispatch(deleteOrdenesCorteArray(val.payload));
			if (error.error) throw error;
			navigate('/consumos-modelaje/ordenes-corte');
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
						to="/consumos-modelaje/ordenes-corte"
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
						<Icon
							component={motion.span}
							initial={{ scale: 0 }}
							animate={{ scale: 1, transition: { delay: 0.2 } }}
							className="text-24 md:text-32"
						>
							content_cut
						</Icon>
					</motion.div>
					<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
						<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								Orden de corte Nº {descripcion || '...'}
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
					onClick={handleRemoveorden}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					Eliminar
				</Button> */}
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					disabled={disabled}
					onClick={handleSaveOrden}
				>
					{tipo === 'nuevo' ? 'Guardar' : 'Actualizar'}
				</Button>
			</motion.div>
		</div>
	);
}

export default OrdenCorteHeader;

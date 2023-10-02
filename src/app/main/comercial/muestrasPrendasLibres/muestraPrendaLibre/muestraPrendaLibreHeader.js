/* eslint-disable no-nested-ternary */
/* eslint-disable no-throw-literal */
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';

import _ from '@lodash';
import { motion } from 'framer-motion';

import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import showToast from 'utils/Toast';
import {
	createMuestraPrendaLibre,
	updateMuestraPrendaLibre,
} from '../../store/muestraPrendaLibre/muestraPrendaLibreSlice';

function MuestraPrendaLibreHeader({ tipo, codigo, disabled }) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { formState, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const idUsuario = useSelector(({ auth }) => auth.user.id);

	const theme = useTheme();
	const navigate = useNavigate();

	async function handleSave() {
		showToast(
			{
				promesa: save,
				parametros: [],
			},
			'save',
			'muestra'
		);
	}

	async function save() {
		try {
			let error = {};
			const data = getValues();

			if (!data.marca || data.marca === null) {
				throw { payload: { message: 'La marca es requerida' } };
			}
			if (!data.color || data.color === null) {
				throw { payload: { message: 'El color es requerido' } };
			}

			const avios = [];

			(data.muestraPrendaLibreAvios || []).forEach(muestraAvio => {
				avios.push({
					cantidad: muestraAvio.avios?.hilos
						? 5000 / muestraAvio.cantidadUnidad
						: muestraAvio.avios?.familiaAvios.id === 8
						? 1 / muestraAvio.cantidadUnidad
						: muestraAvio.avios?.familiaAvios.id === 9
						? 1 / muestraAvio.cantidadUnidad
						: muestraAvio.cantidad,
					tipo: muestraAvio.tipo?.value ? muestraAvio.tipo?.value : muestraAvio.tipo,
					cantidadUnidad:
						muestraAvio.avios?.hilos ||
						muestraAvio.avios?.familiaAvios.id === 8 ||
						muestraAvio.avios?.familiaAvios.id === 9 ||
						muestraAvio.avios?.familiaAvios.id === 13 ||
						muestraAvio.avios?.familiaAvios.id === 7
							? muestraAvio.cantidadUnidad
							: null,
					aviosId: muestraAvio.avios?.id,
					unidadMedidaId: muestraAvio.avios?.hilos
						? 6
						: muestraAvio.avios?.familiaAvios.id === 8
						? 2
						: muestraAvio.avios?.familiaAvios.id === 9
						? 2
						: muestraAvio.avios?.familiaAvios.id === 13
						? 2
						: muestraAvio.avios?.familiaAvios.id === 7
						? 2
						: muestraAvio.unidadMedida?.id,
				});
			});

			const imgsReferenciales = [];

			data.imagenes?.forEach(imgRef => {
				if (imgRef && imgRef.file) {
					imgsReferenciales.push({
						file: imgRef.file,
					});
				}
			});

			const body = {
				fechaDespacho: data.fechaDespacho,
				clienteId: data.cliente?.id || null,
				marcaId: data.marca.id,
				detalles: data.detalles || '',
				usuarioId: idUsuario,
				cantidadPrendasSolicitadas: data.cantidadPrendasSolicitadas,
				tallasPrendasSolicitadas: data.tallasPrendasSolicitadas,
				ruta: data.ruta,
				nombreEstilo: data.nombreEstilo,
				tipoTela: data.tipoTela?.value || null,
				colorId: data.color?.id || null,
				muestraPrendaLibreAvios: avios,
				preguntas: data.preguntas,
				imagenes: imgsReferenciales,
			};

			if (tipo === 'nuevo') {
				body.codigo = codigo;
				body.anio = new Date().getFullYear();
				body.correlativo = parseInt(codigo.split('-')[1], 10);

				error = await dispatch(createMuestraPrendaLibre(body));
				if (error.error) throw error;
			} else {
				body.id = data.id;
				body.anio = data.anio;
				body.codigo = data.codigo;
				body.correlativo = data.correlativo;
				error = await dispatch(updateMuestraPrendaLibre(body));
				if (error.error) throw error;
			}

			navigate(`/comercial/muestrasPrendasLibres`);
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
						to="/comercial/muestrasPrendasLibres"
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
								{codigo || 'Nueva Muestra de Prenda Libre'}
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
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSave}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default MuestraPrendaLibreHeader;

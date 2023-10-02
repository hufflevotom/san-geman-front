/* eslint-disable no-nested-ternary */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-throw-literal */
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import { useTheme } from '@mui/material/styles';
import Grid4x4Icon from '@mui/icons-material/Grid4x4';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import httpClient from 'utils/Api';
import showToast from 'utils/Toast';
import { createAvio, deleteAvio, updateAvio } from '../../store/avios/avioSlice';
import { deleteAviosArray } from '../../store/avios/aviosSlice';

function AvioHeader({ tipo, generar, imagenes }) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const codigo = watch('codigo');

	const descripcion = watch('nombre');
	const familia = watch('familiaAvios');

	const existeHilos = getValues();

	const getCodigo = () => {
		let codigoParseado;

		if (familia) {
			if (tipo === 'nuevo') {
				codigoParseado = `${familia.prefijo}-${(familia.correlativo + 1)
					.toString()
					.padStart(4, '0')}`;
			} else {
				codigoParseado = codigo.toString();
			}
		}

		if (existeHilos?.hilos) {
			if (tipo === 'nuevo') {
				httpClient.get(`maestro/familia-avios/1`).then(response => {
					const data = response.data.body;
					codigoParseado = `${data.prefijo}-${(data.correlativo + 1).toString().padStart(4, '0')}`;
				});
			} else {
				codigoParseado = codigo.toString();
			}
		}
		return codigoParseado;
	};

	const theme = useTheme();
	const navigate = useNavigate();

	async function handleSaveAvio() {
		showToast(
			{
				promesa: saveAvio,
				parametros: [],
			},
			'save',
			'avios'
		);
	}

	async function saveAvio() {
		try {
			let error = {};
			if (tipo === 'nuevo') {
				const data = getValues();
				console.log(data);

				if (!data.nombre || data.nombre === null || data.nombre === '') {
					throw { payload: { message: 'El nombre es requerido' } };
				}
				if (!data.unidadMedida || data.unidadMedida === null) {
					throw { payload: { message: 'La unidad de medida es requerida' } };
				}
				if (!data.unidadMedidaSecundaria || data.unidadMedidaSecundaria === null) {
					throw { payload: { message: 'La unidad de medida secundaria es requerida' } };
				}
				if (!data.unidadMedidaCompra || data.unidadMedidaCompra === null) {
					throw { payload: { message: 'La unidad de medida de compra es requerida' } };
				}
				if (!data.tipo || data.tipo === null) {
					throw { payload: { message: 'El tipo es requerido' } };
				}
				if (!data.hilos) {
					if (!data.familiaAvios || data.familiaAvios === null) {
						throw { payload: { message: 'La Familia de Avios es requerida' } };
					}
				}

				//! Comentar si el cliente no es requerido
				if (!data.cliente || data.cliente === null) {
					throw { payload: { message: 'El cliente es requerido' } };
				}

				if (data.cliente) {
					data.clienteId = data.cliente.id;
				}

				if (!data.marca || data.marca === null) {
					throw { payload: { message: 'La marca es requerida' } };
				}
				if (data.marca) {
					data.marcaId = data.marca.id;
				}

				data.tipo = data.tipo.value;
				data.familiaId = data.hilos ? 1 : data.calcularCajas ? 8 : data.familiaAvios.id;
				data.unidadId = data.unidadMedida.id;
				data.unidadSecundariaId = data.unidadMedidaSecundaria.id;
				data.unidadCompraId = data.unidadMedidaCompra.id;
				data.codigo = getCodigo();

				if (data.color) data.colorId = data.color.id;

				if (generar) {
					if (!data.tallas || data.tallas.length === 0) {
						throw { payload: { message: 'Las tallas son requeridas' } };
					}

					for (const t of data.tallas) {
						data.tallaId = t.id;
						const imges = imagenes.findIndex(i => i.talla.id === t.id);
						const img = imagenes[imges].imagenPrinc;
						const img2 = imagenes[imges].imagenSec;
						const obj = {
							data,
							img,
							img2,
						};
						error = await dispatch(createAvio(obj));
						if (error.error) throw error;
					}
				} else {
					if (data.talla) {
						data.tallaId = data.talla?.id || null;
					}
					const img = data.imagenUrl?.file;
					const img2 = data.imagenUrlSec?.file;
					const obj = {
						data,
						img,
						img2,
					};

					error = await dispatch(createAvio(obj));
					if (error.error) throw error;
				}
			} else {
				const data = getValues();

				if (!data.nombre || data.nombre === null || data.nombre === '') {
					throw { payload: { message: 'El nombre es requerido' } };
				}
				if (!data.unidadMedida || data.unidadMedida === null) {
					throw { payload: { message: 'La unidad de medida es requerida' } };
				}
				if (!data.unidadMedidaSecundaria || data.unidadMedidaSecundaria === null) {
					throw { payload: { message: 'La unidad de medida secundaria es requerida' } };
				}
				if (!data.unidadMedidaCompra || data.unidadMedidaCompra === null) {
					throw { payload: { message: 'La unidad de medida de compra es requerida' } };
				}
				if (!data.tipo || data.tipo === null) {
					throw { payload: { message: 'El tipo es requerido' } };
				}
				if (!data.hilos) {
					if (!data.familiaAvios || data.familiaAvios === null) {
						throw { payload: { message: 'La Familia de Avios es requerida' } };
					}
				}

				//! Comentar si el cliente no es requerido
				if (!data.cliente || data.cliente === null) {
					throw { payload: { message: 'El cliente es requerido' } };
				}
				if (!data.marca || data.marca === null) {
					throw { payload: { message: 'La marca es requerida' } };
				}

				if (data.cliente) {
					data.clienteId = data.cliente.id;
					data.marcaId = data.marca.id;
				}

				data.tipo = data.tipo.value ? data.tipo.value : data.tipo;
				data.familiaId = data.familiaAvios.id;
				data.unidadId = data.unidadMedida.id;
				data.unidadSecundariaId = data.unidadMedidaSecundaria.id;
				data.unidadCompraId = data.unidadMedidaCompra.id;
				data.codigo = getCodigo();

				if (data.color) data.colorId = data.color.id;

				if (data.talla) {
					data.tallaId = data.talla?.id || null;
				}

				const img = data.imagenUrl?.file;
				const img2 = data.imagenUrlSec?.file;

				const obj = {
					data,
					img,
					img2,
				};

				error = await dispatch(updateAvio(obj));
				if (error.error) throw error;
			}
			navigate(`/maestros/avios`);
			return error;
		} catch (error) {
			console.error('Error:', error);
			throw error;
		}
	}

	async function handleRemoveAvio() {
		showToast(
			{
				promesa: removeAvio,
				parametros: [],
			},
			'delete',
			'avios'
		);
	}

	async function removeAvio() {
		try {
			const val = await dispatch(deleteAvio());
			const error = await dispatch(deleteAviosArray(val.payload));
			if (error.error) throw error;
			navigate('/maestros/avios');
			return val;
		} catch (error) {
			console.error('Error:', error);
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
						to="/maestros/avios"
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
								{descripcion || 'Nuevo Avios'}
							</Typography>
							<Typography variant="caption" className="font-medium">
								{getCodigo()}
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
					onClick={handleRemoveAvio}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					Eliminar
				</Button>
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSaveAvio}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default AvioHeader;

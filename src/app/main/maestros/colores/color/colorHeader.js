/* eslint-disable no-throw-literal */
import { useState } from 'react';

import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';

import ColorLensIcon from '@mui/icons-material/ColorLens';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';

import showToast from 'utils/Toast';
import { createColor, deleteColor, updateColor } from '../../store/color/colorSlice';
import { deleteColoresArray } from '../../store/color/colorsSlice';

function ColorHeader({ tipo }) {
	const [mostrarModal, setMostrarModal] = useState(false);
	const [dataModal, setDataModal] = useState(null);

	const dispatch = useDispatch();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const codigo = watch('codigo');
	const descripcion = watch('descripcion');
	const gama = watch('gama');

	const valor = getValues();

	const theme = useTheme();
	const navigate = useNavigate();

	async function saveColor() {
		try {
			const data = getValues();
			if (
				data.alternativas.length === 0 ||
				data.codigo === '' ||
				data.descripcion === '' ||
				data.gama === '' ||
				data.tipoDesarrollo === '' ||
				data.proveedor === null ||
				data.cliente === null ||
				data.marca === null
			) {
				setMostrarModal(true);
				setDataModal(data);
			} else if (tipo === 'nuevo') {
				handleSavColor(data, false);
			} else {
				handleEditColor(data, false);
			}
		} catch (error) {
			console.error('Save color:', error);
			throw error;
		}
	}

	async function handleSavColor(data, borrador) {
		showToast(
			{
				promesa: savColor,
				parametros: [data, borrador],
			},
			'save',
			'color'
		);
	}

	async function savColor(data, borrador) {
		try {
			if (data.codigo === '') {
				throw { payload: { message: 'El codigo es requerido' } };
			}
			data.alternativas = data.alternativas ? data.alternativas : [];
			const alt = [];

			data.alternativas.forEach(element => {
				alt.push({ nombre: element.nombre });
			});

			data.alternativas = alt;
			data.gama = data.gama.value;
			data.tipoDesarrollo = data.tipoDesarrollo?.value;

			data.borrador = borrador;
			if (data.proveedor) {
				data.proveedorId = data.proveedor.id;
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

			const img = data.imagenUrl;
			const img2 = data.imagenUrlSec;

			const obj = {
				data,
				img,
				img2,
			};

			const response = await dispatch(createColor(obj));
			// console.log('response', response);
			if (response.error) throw response;
			navigate(`/maestros/colores`);
			return response;
		} catch (error) {
			console.error('Save color:', error);
			throw error;
		}
	}

	async function handleEditColor(data, borrador) {
		showToast(
			{
				promesa: editColor,
				parametros: [data, borrador],
			},
			'update',
			'color'
		);
	}

	async function editColor(data, borrador) {
		try {
			const alt = [];
			data.alternativas = data.alternativas ? data.alternativas : [];
			data.alternativas.forEach(element => {
				if (typeof element.id === 'string') {
					alt.push({ nombre: element.nombre });
				} else if (element.nombre !== '') {
					alt.push(element);
				}
			});

			data.alternativas = alt;
			data.gama = data.gama.value;
			data.tipoDesarrollo = data.tipoDesarrollo?.value;

			data.borrador = borrador;

			if (data.proveedor) {
				data.proveedorId = data.proveedor.id;
			}

			if (data.cliente) {
				data.clienteId = data.cliente.id;
			}

			if (data.marca) {
				data.marcaId = data.marca.id;
			}

			const img = data.imagenUrl;
			const img2 = data.imagenUrlSec;

			const obj = {
				data,
				img,
				img2,
			};

			const error = await dispatch(updateColor(obj));
			if (error.error) throw error;
			navigate(`/maestros/colores`);
			return error;
		} catch (error) {
			console.log('Error:', error);
			throw error;
		}
	}

	async function handleRemoveColor() {
		showToast(
			{
				promesa: removeColor,
				parametros: [],
			},
			'delete',
			'color'
		);
	}

	async function removeColor() {
		try {
			const val = await dispatch(deleteColor());
			const error = await dispatch(deleteColoresArray(val.payload));
			if (error.error) throw error;
			navigate('/maestros/colores');
			return val;
		} catch (error) {
			console.log('Error:', error);
			throw error;
		}
	}

	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 400,
		border: '2px solid #000',
		boxShadow: 24,
		p: 4,
		backgroundColor: '#fff',
	};

	return (
		<>
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
							to="/maestros/colores"
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
							alt={codigo}
						/> */}
							<ColorLensIcon fontSize="large" />
						</motion.div>
						<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
							<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
								<Typography className="text-16 sm:text-20 truncate font-semibold">
									{descripcion || 'Nuevo Color'}
								</Typography>
								<Typography variant="caption" className="font-medium">
									{codigo}
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
						onClick={handleRemoveColor}
						startIcon={<Icon className="hidden sm:flex">delete</Icon>}
					>
						Eliminar
					</Button>
					<Button
						className="whitespace-nowrap mx-4"
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid}
						onClick={saveColor}
					>
						Guardar
					</Button>
				</motion.div>
			</div>
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={mostrarModal}
				/* onClose={() => setMostrarModal(false)} */
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={mostrarModal}>
					<Box sx={style}>
						<Typography id="transition-modal-title" variant="h6" component="h2">
							Guardado Temporal
						</Typography>
						<Typography id="transition-modal-description" sx={{ mt: 2 }}>
							Hay campos sin completar, ¿Desea guardar como temporal?
						</Typography>
						<Box sx={{ mt: 2 }}>
							<Button
								variant="contained"
								color="primary"
								onClick={() => {
									setMostrarModal(false);
									if (valor.id) {
										handleEditColor(dataModal, true);
									} else {
										handleSavColor(dataModal, true);
									}
								}}
							>
								Guardar
							</Button>
							&nbsp;
							<Button
								variant="contained"
								color="secondary"
								onClick={() => {
									setMostrarModal(false);
								}}
							>
								Cancelar
							</Button>
						</Box>
					</Box>
				</Fade>
			</Modal>
		</>
	);
}

export default ColorHeader;

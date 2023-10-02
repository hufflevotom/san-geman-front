import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import showToast from 'utils/Toast';
import { createUsuario, deleteUsuario, updateUsuario } from '../../store/usuario/usuarioSlice';
import { deleteUsuariosArray } from '../../store/usuario/usuariosSlice';

function UsuarioHeader({ tipo }) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const nombre = watch('nombre');
	const apellido = watch('apellido');

	const theme = useTheme();
	const navigate = useNavigate();

	async function handleSaveUsuario() {
		showToast(
			{
				promesa: saveUsuario,
				parametros: [],
			},
			'save',
			'usuario'
		);
	}

	async function saveUsuario() {
		try {
			let error = {};
			if (tipo === 'nuevo') {
				const data = getValues();
				if (data.chofer) {
					data.rolId = 1;
					if (!data.dni || data.dni.length < 8) throw new Error('El DNI debe ser válido');
					if (!data.licencia || data.licencia.length < 5)
						throw new Error('La licencia debe ser válida');
				} else {
					data.rolId = data.role.id;
					let activePin = false;

					const permisosPin = [
						'anularIngresoAlmacenAvios',
						'anularIngresoAlmacenTelas',
						'anularSalidaAlmacenAvios',
						'anularSalidaAlmacenTelas',
					];

					data.role.modulos.forEach(modulo => {
						if (permisosPin.includes(modulo.nombre)) {
							activePin = true;
						}
					});

					if (activePin) {
						if (!data.pin || data.pin.length !== 6)
							throw new Error('El PIN es requerido y debe tener 6 dígitos');
					}
				}
				error = await dispatch(createUsuario(data));
				if (error.error) throw error;
			} else {
				const data = getValues();
				data.rolId = data.role.id;
				error = await dispatch(updateUsuario(data));
				if (error.error) throw error;
			}
			navigate(`/usuarios`);
			return error;
		} catch (error) {
			console.log('Error:', error);
			throw error;
		}
	}

	async function handleRemoveUsuario() {
		showToast(
			{
				promesa: removeUsuario,
				parametros: [],
			},
			'delete',
			'usuario'
		);
	}

	async function removeUsuario() {
		try {
			let error = {};
			const val = await dispatch(deleteUsuario());
			error = await dispatch(deleteUsuariosArray(val.payload));
			if (error.error) throw error;
			navigate('/usuarios');
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
						to="/usuarios"
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
						<img
							className="w-32 sm:w-48 rounded"
							src="assets/images/ecommerce/product-image-placeholder.png"
							alt={nombre}
						/>
					</motion.div>
					<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
						<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								{nombre || 'Nuevo Usuario'}
							</Typography>
							<Typography variant="caption" className="font-medium">
								{apellido}
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
					onClick={handleRemoveUsuario}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					Eliminar
				</Button>
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSaveUsuario}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default UsuarioHeader;

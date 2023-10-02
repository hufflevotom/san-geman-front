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
import { createRol, deleteRol, updateRol } from '../../store/rol/rolSlice';
import { deleteRolesArray } from '../../store/rol/rolesSlice';

function RolHeader({ tipo }) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const nombre = watch('nombre');

	const theme = useTheme();
	const navigate = useNavigate();

	async function handleSaveRol() {
		showToast(
			{
				promesa: saveRol,
				parametros: [],
			},
			'save',
			'rol'
		);
	}

	async function saveRol() {
		try {
			let error = {};
			if (tipo === 'nuevo') {
				const data = getValues();
				const arrayModulosId = [];
				// Recorrer los modulos y agregarle a un array ID
				if (data.modulos) {
					data.modulos.forEach(modulo => {
						arrayModulosId.push(modulo.id);
					});
				}

				delete data.modulos;
				data.modulosId = arrayModulosId;
				error = await dispatch(createRol(data));
				if (error.error) throw error;
			} else {
				const data = getValues();
				const arrayModulosId = [];
				// Recorrer los modulos y agregarle a un array ID
				if (data.modulos) {
					data.modulos.forEach(modulo => {
						arrayModulosId.push(modulo.id);
					});
				}

				delete data.modulos;
				data.modulosId = arrayModulosId;
				error = await dispatch(updateRol(data));
				if (error.error) throw error;
			}
			navigate(`/roles`);
			return error;
		} catch (error) {
			console.log('Error:', error);
			throw error;
		}
	}

	async function handleRemoveRol() {
		showToast(
			{
				promesa: removeRol,
				parametros: [],
			},
			'delete',
			'rol'
		);
	}

	async function removeRol() {
		try {
			const error = await dispatch(deleteRol());
			const val = await dispatch(deleteRolesArray(val.payload));
			if (error.error) throw error;
			navigate('/roles');
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
						to="/roles"
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
								{nombre || 'Nuevo Rol'}
							</Typography>
							<Typography variant="caption" className="font-medium">
								{/* {apellido} */}
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
					onClick={handleRemoveRol}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					Eliminar
				</Button>
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSaveRol}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default RolHeader;

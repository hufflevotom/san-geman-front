import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import showToast from 'utils/Toast';
import { createTalla, deleteTalla, updateTalla } from '../../store/talla/tallaSlice';
import { deleteTallasArray } from '../../store/talla/tallasSlice';

function TallaHeader({ tipo }) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const talla = watch('talla');
	const theme = useTheme();
	const navigate = useNavigate();

	async function handleSaveTalla() {
		showToast(
			{
				promesa: saveTalla,
				parametros: [],
			},
			'save',
			'talla'
		);
	}

	async function saveTalla() {
		try {
			let error = {};
			if (tipo === 'nuevo') {
				error = await dispatch(createTalla(getValues()));
				if (error.error) throw error;
			} else {
				error = await dispatch(updateTalla(getValues()));
				if (error.error) throw error;
			}
			navigate(`/maestros/tallas`);
			return error;
		} catch (error) {
			console.log('Error:', error);
			throw error;
		}
	}

	async function handleRemoveTalla() {
		showToast(
			{
				promesa: removeTalla,
				parametros: [],
			},
			'delete',
			'talla'
		);
	}

	async function removeTalla() {
		try {
			const error = await dispatch(deleteTalla());
			const val = await dispatch(deleteTallasArray(val.payload));
			if (error.error) throw error;
			navigate('/maestros/tallas');
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
						to="/maestros/tallas"
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
							alt={talla}
						/> */}
						<FormatSizeIcon fontSize="large" />
					</motion.div>
					<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
						<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								{talla || 'Nueva Talla'}
							</Typography>
							{/* <Typography variant="caption" className="font-medium">
								{prefijo}
							</Typography> */}
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
					onClick={handleRemoveTalla}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					Eliminar
				</Button>
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSaveTalla}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default TallaHeader;

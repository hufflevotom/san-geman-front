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
import showToast from 'utils/Toast';
import {
	createFamiliaTela,
	deleteFamiliaTela,
	updateFamiliaTela,
} from '../../store/familia-tela/familiaTelaSlice';
import { deleteFamiliaTelaArray } from '../../store/familia-tela/familiasTelasSlice';

function FamiliaTelaHeader({ tipo }) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;
	// const featuredLogoId = watch('featuredLogoId');
	// const logos = watch('logos');
	const descripcion = watch('descripcion');
	const prefijo = watch('prefijo');
	const theme = useTheme();
	const navigate = useNavigate();

	async function handleSaveFamilia() {
		showToast(
			{
				promesa: saveFamilia,
				parametros: [],
			},
			'save',
			'famila de tela'
		);
	}

	async function saveFamilia() {
		try {
			let error = {};
			if (tipo === 'nuevo') {
				error = await dispatch(createFamiliaTela(getValues()));
				if (error.error) throw error;
			} else {
				error = await dispatch(updateFamiliaTela(getValues()));
				if (error.error) throw error;
			}
			navigate(`/maestros/familias-telas`);
			return error;
		} catch (error) {
			console.log('Error:', error);
			throw error;
		}
	}

	async function handleRemovefamilia() {
		const val = await dispatch(deleteFamiliaTela());
		await dispatch(deleteFamiliaTelaArray(val.payload));
		navigate('/maestros/familias-telas');
		return val;
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
						to="/maestros/familias-telas"
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
								{descripcion || 'Nueva Familia de Tela'}
							</Typography>
							<Typography variant="caption" className="font-medium">
								{prefijo}
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
					onClick={handleRemovefamilia}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					Eliminar
				</Button>
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSaveFamilia}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default FamiliaTelaHeader;

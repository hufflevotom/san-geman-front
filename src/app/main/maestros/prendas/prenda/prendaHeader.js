import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import { useTheme } from '@mui/material/styles';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import showToast from 'utils/Toast';
import { createPrenda, deletePrenda, updatePrenda } from '../../store/prenda/prendaSlice';
import { deletePrendasArray } from '../../store/prenda/prendasSlice';

function PrendaHeader({ tipo }) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const codigo = watch('codigo');
	const nombre = watch('nombre');
	const familia = watch('familiaPrenda');

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

	const theme = useTheme();
	const navigate = useNavigate();

	async function handleSavePrenda() {
		showToast(
			{
				promesa: savePrenda,
				parametros: [],
			},
			'save',
			'prenda'
		);
	}

	async function savePrenda() {
		try {
			let error = {};
			if (tipo === 'nuevo') {
				const data = getValues();
				console.log(data);
				data.familiaId = data.familiaPrenda.id;
				data.unidadId = data.unidadMedida.id;
				data.codigo = codigoParseado;

				error = await dispatch(createPrenda(data));
				if (error.error) throw error;
			} else {
				const data = getValues();
				data.familiaId = data.familiaPrenda.id;
				data.unidadId = data.unidadMedida.id;

				error = await dispatch(updatePrenda(data));
				if (error.error) throw error;
			}
			navigate(`/maestros/prendas`);
			return error;
		} catch (error) {
			console.log('Error:', error);
			throw error;
		}
	}

	async function handleRemovePrenda() {
		showToast(
			{
				promesa: removePrenda,
				parametros: [],
			},
			'delete',
			'prenda'
		);
	}

	async function removePrenda() {
		try {
			const val = await dispatch(deletePrenda());
			const error = await dispatch(deletePrendasArray(val.payload));
			if (error.error) throw error;
			navigate('/maestros/prendas');
			return val;
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
						to="/maestros/prendas"
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
							alt={nombre}
						/> */}
						<CheckroomIcon fontSize="large" />
					</motion.div>
					<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
						<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								{nombre || 'Nueva Prenda'}
							</Typography>
							<Typography variant="caption" className="font-medium">
								{codigoParseado}
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
					onClick={handleRemovePrenda}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					Eliminar
				</Button>
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSavePrenda}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default PrendaHeader;

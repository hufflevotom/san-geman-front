import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import { useTheme } from '@mui/material/styles';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import showToast from 'utils/Toast';
import {
	createSubFamilia,
	deleteSubFamilia,
	updateSubFamilia,
} from '../../store/sub-familia/subFamiliaSlice';
import { deleteSubFamiliasArray } from '../../store/sub-familia/SubFamiliasSlice';

function SubFamiliaHeader({ tipo }) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const familia = watch('familiaTela');
	const nombre = watch('nombre');

	let nombreParseado = '';
	if (familia && nombre) {
		nombreParseado = `${familia.descripcion}  ${nombre}`;
	}

	const theme = useTheme();
	const navigate = useNavigate();

	async function handleSaveSubFamilia() {
		showToast(
			{
				promesa: saveSubFamilia,
				parametros: [],
			},
			'save',
			'subFamilia'
		);
	}

	async function saveSubFamilia() {
		try {
			let error = {};
			const data = getValues();
			if (tipo === 'nuevo') {
				data.nombre = `${data.familiaTela.descripcion} ${data.nombre}`;
				data.familiaTelaId = data.familiaTela.id;
				error = await dispatch(createSubFamilia(data));
				if (error.error) throw error;
			} else {
				data.nombre = `${data.familiaTela.descripcion} ${data.nombre}`;
				data.familiaTelaId = data.familiaTela.id;
				error = await dispatch(updateSubFamilia(data));
				if (error.error) throw error;
			}
			navigate(`/maestros/subfamilias`);
			return error;
		} catch (error) {
			console.log('Error:', error);
			throw error;
		}
	}

	async function handleRemoveSubFamilia() {
		const val = await dispatch(deleteSubFamilia());
		await dispatch(deleteSubFamiliasArray(val.payload));
		navigate('/maestros/subfamilias');
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
						to="/maestros/subfamilias"
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
						<WorkspacesIcon fontSize="large" />
					</motion.div>
					<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
						<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								{nombreParseado || 'Nueva SubFamilia'}
							</Typography>
							<Typography variant="caption" className="font-medium">
								{/* {codigoParseado} */}
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
					onClick={handleRemoveSubFamilia}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					Eliminar
				</Button>
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSaveSubFamilia}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default SubFamiliaHeader;

/* eslint-disable no-nested-ternary */
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import PeopleIcon from '@mui/icons-material/People';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import showToast from 'utils/Toast';
import { createTextil, deleteTextil, updateTextil } from '../../store/textil/textilSlice';
import { deleteTextilesArray } from '../../store/textil/textilesSlice';

function TextilHeader({ tipo }) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const theme = useTheme();
	const navigate = useNavigate();

	async function handleSaveTextil() {
		showToast(
			{
				promesa: saveTextil,
				parametros: [],
			},
			'save',
			'textil'
		);
	}

	async function saveTextil() {
		try {
			const form = getValues();
			const body = {
				densidadAntesLavadoEstandar: parseFloat(form.densidadAntesLavadoEstandar) || 0,
				denstidadDespuesLavadoEstandar: parseFloat(form.denstidadDespuesLavadoEstandar) || 0,
				anchoDelRolloEstandar: parseFloat(form.anchoDelRolloEstandar) || 0,
				densidadAntesLavadoReal: parseFloat(form.densidadAntesLavadoReal) || 0,
				denstidadDespuesLavadoReal: parseFloat(form.denstidadDespuesLavadoReal) || 0,
				anchoDelRolloReal: parseFloat(form.anchoDelRolloReal) || 0,
				anchoDeReposoReal: parseFloat(form.anchoDeReposoReal) || 0,
				encogimientoEstandarLargo: parseFloat(form.encogimientoEstandarLargo) || 0,
				encogimientoEstandarAncho: parseFloat(form.encogimientoEstandarAncho) || 0,
				encogimiento1largo: parseFloat(form.encogimiento1largo) || 0,
				encogimiento1ancho: parseFloat(form.encogimiento1ancho) || 0,
				encogimiento2largo: parseFloat(form.encogimiento2largo) || 0,
				encogimiento2ancho: parseFloat(form.encogimiento2ancho) || 0,
				encogimiento3largo: parseFloat(form.encogimiento3largo) || 0,
				encogimiento3ancho: parseFloat(form.encogimiento3ancho) || 0,
				reviradoEstandar: parseFloat(form.reviradoEstandar) || 0,
				reviradoDerecho: parseFloat(form.reviradoDerecho) || 0,
				reviradoIzquierdo: parseFloat(form.reviradoIzquierdo) || 0,
				inclinacionEstandar: parseFloat(form.inclinacionEstandar) || 0,
				inclinacionAntesDerecho: parseFloat(form.inclinacionAntesDerecho) || 0,
				inclinacionAntesIzquierdo: parseFloat(form.inclinacionAntesIzquierdo) || 0,
				inclinacionDespuesDerecho: parseFloat(form.inclinacionDespuesDerecho) || 0,
				inclinacionDespuesIzquierdo: parseFloat(form.inclinacionDespuesIzquierdo) || 0,
				solidez: parseFloat(form.solidez) || 0,
				// apariencia: form.apariencia || '',
				apariencia: form.apariencia.value || '',
				comentarios: form.comentarios || '',
				reviradoPromedio:
					(parseFloat(form.reviradoDerecho || '0') + parseFloat(form.reviradoIzquierdo || '0')) / 2,
				inclinacionAntesPromedio:
					(parseFloat(form.inclinacionAntesDerecho || '0') +
						parseFloat(form.inclinacionAntesIzquierdo || '0')) /
					2,
				inclinacionDespuesPromedio:
					(parseFloat(form.inclinacionDespuesDerecho || '0') +
						parseFloat(form.inclinacionDespuesIzquierdo || '0')) /
					2,
				productoTelaId: form.productoTelaId,
			};
			if (form.documentoReferenciaUrl) body.documentoReferenciaUrl = form.documentoReferenciaUrl;
			let error = {};
			if (form.id) {
				body.id = form.id;
				error = await dispatch(updateTextil(body));
			} else {
				error = await dispatch(createTextil(body));
			}
			if (error.error) throw error;
			navigate(`/calidad/textil`);
			return error;
		} catch (error) {
			console.log('Error:', error);
			throw error;
		}
	}

	async function handleRemoveTextil() {
		showToast(
			{
				promesa: removeTextil,
				parametros: [],
			},
			'delete',
			'textil'
		);
	}

	async function removeTextil() {
		try {
			const val = await dispatch(deleteTextil());
			const error = await dispatch(deleteTextilesArray(val.payload));
			if (error.error) throw error;
			navigate('/calidad/textil');
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
						to="/calidad/textil"
						color="inherit"
					>
						<Icon className="text-20">
							{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
						</Icon>
						<span className="hidden sm:flex mx-4 font-medium">Volver</span>
					</Typography>
				</motion.div>

				<div className="flex items-center max-w-full">
					{/* <motion.div
						className="hidden sm:flex"
						initial={{ scale: 0 }}
						animate={{ scale: 1, transition: { delay: 0.3 } }}
					> */}
					{/* <img
							className="w-32 sm:w-48 rounded"
							src="assets/images/ecommerce/product-image-placeholder.png"
							alt={nombre}
						/> */}
					{/* <PeopleIcon fontSize="large" /> */}
					{/* </motion.div> */}
					<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
						<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								Calidad Textil
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
					onClick={handleRemoveTextil}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					Eliminar
				</Button> */}
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSaveTextil}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default TextilHeader;

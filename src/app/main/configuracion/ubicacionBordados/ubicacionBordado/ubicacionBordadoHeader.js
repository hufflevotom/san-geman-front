import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import showToast from 'utils/Toast';
import {
	createUbicacionBordado,
	deleteUbicacionBordado,
	updateUbicacionBordado,
} from '../../store/ubicacionBordado/ubicacionBordadoSlice';
import { deleteUbicacionBordadosArray } from '../../store/ubicacionBordado/ubicacionBordadosSlice';

function UbicacionBordadoHeader({ tipo, data }) {
	const dispatch = useDispatch();
	const theme = useTheme();
	const navigate = useNavigate();

	async function handleSave() {
		showToast(
			{
				promesa: save,
				parametros: [],
			},
			'save',
			'ubicacion bordados'
		);
	}

	async function save() {
		try {
			let error = {};
			const body = { label: data.currentLabel, value: data.currentLabel, tipo: 'BORDADO' };
			if (tipo === 'nuevo') {
				error = await dispatch(createUbicacionBordado(body));
				if (error.error) throw error;
			} else {
				body.id = tipo;
				error = await dispatch(updateUbicacionBordado(body));
				if (error.error) throw error;
			}
			navigate(`/configuracion/ubicacion-bordados`);
			return error;
		} catch (error) {
			console.log('Error:', error);
			throw error;
		}
	}

	async function handleRemove() {
		const val = await dispatch(deleteUbicacionBordado());
		await dispatch(deleteUbicacionBordadosArray(val.payload));
		navigate('/configuracion/ubicacion-bordados');
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
						to="/configuracion/ubicacion-bordados"
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
						<SettingsApplicationsIcon fontSize="large" />
					</motion.div>
					<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
						<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								Nueva ubicación
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
					onClick={handleRemove}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					Eliminar
				</Button> */}
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(data.currentLabel)}
					onClick={handleSave}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default UbicacionBordadoHeader;

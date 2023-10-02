/* eslint-disable no-nested-ternary */
/* eslint-disable prettier/prettier */
/* eslint-disable no-throw-literal */
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Grid4x4Icon from '@mui/icons-material/Grid4x4';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import showToast from 'utils/Toast';
import {
	createTitulacion,
	deleteTitulacion,
	updateTitulacion,
} from '../../store/titulacion/titulacionSlice';
import { deleteTitulacionesArray } from '../../store/titulacion/titulacionesSlice';

function TitulacionHeader({ tipo }) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;
	const [nombreParseado, setNombreParseado] = useState();
	const [codigoParseado, setCodigoParseado] = useState();

	const codigo = watch('codigo');
	const titulacion = watch('titulacionJson');
	const acabado = watch('acabado');
	/* const unidadMedida = watch('unidadMedida'); */
	const familia = watch('familia');
	const subFamilia = watch('subFamilia');
	const descripcionComercial = watch('descripcionComercial');

	const tipoTitulacion = watch('tipoTitulacion');
	const tipoListado = watch('tipoListado');

	useEffect(() => {
		if (acabado && familia && subFamilia && titulacion.length > 0 && tipoTitulacion) {
			setNombreParseado(
				`${subFamilia.nombre} ${
					titulacion &&
					titulacion.map(e => `- ${e.titulacion} ${e.porcentaje}% ${e.material ? e.material : ''}`)
				} - ${acabado} `
			);

			if (tipo === 'nuevo') {
				setCodigoParseado(
					`${familia.prefijo}-${(familia.correlativo + 1).toString().padStart(4, '0')}`
				);
			} else {
				setCodigoParseado(codigo.toString());
			}
		}
	}, [acabado, familia, titulacion, tipoTitulacion, codigo, tipo, subFamilia]);

	const theme = useTheme();
	const navigate = useNavigate();

	async function handleSaveTitulacion() {
		showToast(
			{
				promesa: saveTitulacion,
				parametros: [],
			},
			'save',
			'titulacion'
		);
	}

	async function saveTitulacion() {
		try {
			let error = {};

			const data = getValues();

			if (tipo === 'nuevo') {
				error = await dispatch(createTitulacion(data));
				if (error.error) throw error;
			} else {
				error = await dispatch(updateTitulacion(data));
				if (error.error) throw error;
			}
			navigate(`/maestros/titulaciones`);
			return error;
		} catch (error) {
			console.log('Error:', error);
			throw error;
		}
	}

	async function handleRemoveTitulacion() {
		showToast(
			{
				promesa: removeTitulacion,
				parametros: [],
			},
			'delete',
			'titulacion'
		);
	}

	async function removeTitulacion() {
		try {
			const error = await dispatch(deleteTitulacion());
			const val = await dispatch(deleteTitulacionesArray(val.payload));
			if (error.error) throw error;
			navigate('/maestros/titulaciones');
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
						to="/maestros/titulaciones"
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
						<Grid4x4Icon fontSize="large" />
					</motion.div>
					<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
						<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								{nombreParseado?.toUpperCase() || 'Nueva Titulacion'}
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
					onClick={handleRemoveTitulacion}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					Eliminar
				</Button>
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSaveTitulacion}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default TitulacionHeader;

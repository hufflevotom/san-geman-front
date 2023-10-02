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
import { createTela, deleteTela, updateTela } from '../../store/tela/telaSlice';
import { deleteTelasArray } from '../../store/tela/telasSlice';

function TelaHeader({ tipo }) {
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

	const tipoTela = watch('tipoTela');
	const tipoListado = watch('tipoListado');

	useEffect(() => {
		if (acabado && familia && subFamilia && titulacion.length > 0 && tipoTela) {
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
	}, [acabado, familia, titulacion, tipoTela, codigo, tipo, subFamilia]);

	const theme = useTheme();
	const navigate = useNavigate();

	async function handleSaveTela() {
		showToast(
			{
				promesa: saveTela,
				parametros: [],
			},
			'save',
			'tela'
		);
	}

	async function saveTela() {
		try {
			let error = {};
			let porcentaje = 0;
			const data = getValues();

			if (data.tipoListado !== '') {
				data.tipoListado = data.tipoListado.value;
			}

			if (data.alternativas?.length > 0) {
				data.alternativasArray = JSON.stringify(data.alternativas);
			}

			if (data.titulacionJson?.length > 0) {
				data.titulacionJson.forEach(element => {
					if (element.porcentaje === 0 || element.titulacion === '' || element.material === '') {
						throw { payload: { message: 'La titulación es requerida' } };
					}
					porcentaje += parseFloat(element.porcentaje);
				});
				if (porcentaje !== 100) {
					throw { payload: { message: 'El total de porcentajes de titulación debe ser 100%' } };
				}
				data.titulacionJson = JSON.stringify(data.titulacionJson);
			}
			if (!data.unidadMedida) {
				throw { payload: { message: 'La unidad de medida es requerida' } };
			}
			if (!data.unidadMedidaSecundaria) {
				throw { payload: { message: 'La unidad de medida secundaria es requerida' } };
			}

			data.nombre = nombreParseado;
			data.codigo = codigoParseado;
			data.familiaId = data.familia.id;
			data.subFamiliaId = data.subFamilia.id;
			data.unidadId = data.unidadMedida.id;
			data.unidadSecundariaId = data.unidadMedidaSecundaria.id;
			data.tipoTela = data.tipoTela.value;

			if (tipo === 'nuevo') {
				error = await dispatch(createTela(data));
				if (error.error) throw error;
			} else {
				error = await dispatch(updateTela(data));
				if (error.error) throw error;
			}
			navigate(`/maestros/telas`);
			return error;
		} catch (error) {
			console.log('Error:', error);
			throw error;
		}
	}

	async function handleRemoveTela() {
		showToast(
			{
				promesa: removeTela,
				parametros: [],
			},
			'delete',
			'tela'
		);
	}

	async function removeTela() {
		try {
			const error = await dispatch(deleteTela());
			const val = await dispatch(deleteTelasArray(val.payload));
			if (error.error) throw error;
			navigate('/maestros/telas');
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
						to="/maestros/telas"
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
								{nombreParseado?.toUpperCase() || 'Nueva Tela'}
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
					onClick={handleRemoveTela}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					Eliminar
				</Button>
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSaveTela}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default TelaHeader;

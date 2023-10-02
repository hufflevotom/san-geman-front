/* eslint-disable no-throw-literal */
/* eslint-disable no-nested-ternary */
import { useDispatch } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import PeopleIcon from '@mui/icons-material/People';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import _ from '@lodash';
import showToast from 'utils/Toast';
import httpClient from 'utils/Api';
import { createCliente, deleteCliente, updateCliente } from '../../store/cliente/clienteSlice';
import { deleteClientesArray } from '../../store/cliente/clientesSlice';

function ClienteHeader({ tipo }) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const natNombres = watch('natNombres');
	const natApellidoPaterno = watch('natApellidoPaterno');
	const natApellidoMaterno = watch('natApellidoMaterno');
	const razónSocial = watch('razónSocial');
	const natNroDocumento = watch('natNroDocumento');
	const natTipoDocumento = watch('natTipoDocumento');
	const tipoPersona = watch('tipo');
	const tipoCliente = watch('tipoCliente');
	const ruc = watch('ruc');

	const theme = useTheme();
	const navigate = useNavigate();

	function isValidMarcas(marcas) {
		const isValidArr = [];
		marcas.forEach(async marca => {
			const resp = await httpClient.get(`comercial/clientes/marca/${marca.marca}`);
			if (resp.data.body === null) {
				isValidArr.push(true);
			} else {
				toast.error(`La marca ${marca.marca} ya existe`);
				isValidArr.push(false);
			}
		});
		return isValidArr.every(item => item === true);
	}

	async function handleSaveCliente() {
		showToast(
			{
				promesa: saveCliente,
				parametros: [],
			},
			'save',
			'cliente'
		);
	}

	async function saveCliente() {
		try {
			let error = {};
			const data = getValues();

			if (data.tipoCliente === 'N' && data.tipo === 'N') {
				if (data.natTipoDocumento === 'RUC' && data.ruc === '')
					throw { payload: { message: 'Debe llenar todos los campos requeridos' } };
				if (data.natTipoDocumento !== 'RUC' && data.natNroDocumento === '')
					throw { payload: { message: 'Debe llenar todos los campos requeridos' } };
				if (
					data.natApellidoMaterno === '' ||
					data.natApellidoPaterno === '' ||
					data.natNombres === '' ||
					data.direccion === '' ||
					data.celular === '' ||
					data.correo === '' ||
					!data.ubigeo
				) {
					console.error({
						natNroDocumento: data.natNroDocumento,
						natApellidoMaterno: data.natApellidoMaterno,
						natApellidoPaterno: data.natApellidoPaterno,
						natNombres: data.natNombres,
						direccion: data.direccion,
						celular: data.celular,
						correo: data.correo,
						ubigeo: data.ubigeo,
					});
					throw { payload: { message: 'Debe llenar todos los campos requeridos' } };
				}
			}

			if (data.tipoCliente === 'N' && data.tipo === 'J') {
				if (
					data.ruc === '' ||
					data.razónSocial === '' ||
					data.celularContacto === '' ||
					data.celular === '' ||
					data.direccion === '' ||
					data.personaContacto === '' ||
					data.correo === '' ||
					!data.ubigeo
				) {
					console.error({
						ruc: data.ruc,
						razónSocial: data.razónSocial,
						celularContacto: data.celularContacto,
						celular: data.celular,
						direccion: data.direccion,
						personaContacto: data.personaContacto,
						correo: data.correo,
						ubigeo: data.ubigeo,
					});
					throw { payload: { message: 'Debe llenar todos los campos requeridos' } };
				}
			}

			if (data.tipoCliente === 'E') {
				if (
					data.pais === '' ||
					data.natNroDocumento === '' ||
					data.celular === '' ||
					data.direccion === '' ||
					data.correo === ''
				) {
					console.error({
						pais: data.pais,
						natNroDocumento: data.natNroDocumento,
						celular: data.celular,
						direccion: data.direccion,
						correo: data.correo,
					});
					throw { payload: { message: 'Debe llenar todos los campos requeridos' } };
				}
			}

			// if (!data.marcas || data.marcas.length === 0) {
			// 	throw { payload: { message: 'Debe registrar al menos una marca' } };
			// }

			const direccionesAlternativas = [];
			if (data.direccionesAlternativas) {
				data.direccionesAlternativas.forEach(da => {
					if (da.ubigeo?.value) da.ubigeo = da.ubigeo.value;
					if (da.direccion && da.ubigeo) {
						direccionesAlternativas.push({
							...da,
							direccion: da.direccion,
							ubigeo: da.ubigeo?.key,
						});
					}
				});
			}

			if (tipo === 'nuevo') {
				if (isValidMarcas(data.marcas)) {
					data.marcas.forEach(marca => {
						delete marca.id;
					});
					error = await dispatch(
						createCliente({ ...data, direccionesAlternativas, ubigeo: data.ubigeo?.codigo })
					);
					if (error.error) throw error;
					navigate(`/comercial/clientes`);
				} else {
					throw { payload: { message: 'Las marcas no se pueden repetir' } };
				}
			} else {
				data.marcas.forEach(marca => {
					if (typeof marca.id === 'string') delete marca.id;
				});
				error = await dispatch(
					updateCliente({ ...data, direccionesAlternativas, ubigeo: data.ubigeo?.codigo })
				);
				if (error.error) throw error;
				navigate(`/comercial/clientes`);
			}
			return error;
		} catch (error) {
			console.log('Error:', error);
			throw error;
		}
	}

	async function handleRemoveCliente() {
		showToast(
			{
				promesa: removeCliente,
				parametros: [],
			},
			'delete',
			'cliente'
		);
	}

	async function removeCliente() {
		try {
			const val = await dispatch(deleteCliente());
			const error = await dispatch(deleteClientesArray(val.payload));
			if (error.error) throw error;
			navigate('/comercial/clientes');
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
						to="/comercial/clientes"
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
						<PeopleIcon fontSize="large" />
					</motion.div>
					<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
						<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								{tipoCliente === 'N'
									? tipoPersona === 'N'
										? natApellidoPaterno
											? `${natApellidoPaterno} ${natApellidoMaterno} ${natNombres}`
											: 'Nuevo Cliente'
										: razónSocial || 'Nuevo Cliente'
									: razónSocial || 'Nuevo Cliente'}
							</Typography>
							<Typography variant="caption" className="font-medium">
								{tipoPersona === 'N' ? (natTipoDocumento === 'RUC' ? ruc : natNroDocumento) : ruc}
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
					onClick={handleRemoveCliente}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					Eliminar
				</Button>
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSaveCliente}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default ClienteHeader;

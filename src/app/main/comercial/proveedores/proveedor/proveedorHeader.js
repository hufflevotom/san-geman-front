/* eslint-disable no-throw-literal */
/* eslint-disable no-nested-ternary */
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import showToast from 'utils/Toast';
import {
	createProveedor,
	deleteProveedor,
	updateProveedor,
} from '../../store/proveedor/proveedorSlice';
import { deleteProveedorArray } from '../../store/proveedor/proveedoresSlice';

function ProveedorHeader({ tipo }) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const tipoPersona = watch('tipo');
	const nombres = watch('nombres');
	const apellidoPaterno = watch('apellidoPaterno');
	const apellidoMaterno = watch('apellidoMaterno');
	const nroDocumento = watch('nroDocumento');
	const ruc = watch('ruc');
	const razonSocial = watch('razonSocial');

	const theme = useTheme();
	const navigate = useNavigate();

	async function handleSaveProveedor() {
		showToast(
			{
				promesa: saveProveedor,
				parametros: [],
			},
			'save',
			'proveedor'
		);
	}

	async function saveProveedor() {
		try {
			let error = {};
			const data = getValues();
			if (data.tipo === 'J') {
				if (
					!data.razonSocial ||
					data.razonSocial === '' ||
					!data.personaContacto ||
					data.personaContacto === ''
				) {
					throw { payload: { message: 'Debe llenar todos los campos requeridos' } };
				}
			} else {
				if (
					!data.nroDocumento ||
					data.nroDocumento === '' ||
					data.nroDocumento.length < 8 ||
					data.nroDocumento.length > 15
				) {
					throw { payload: { message: 'El documento de identidad es requerido' } };
				}
				if (
					!data.apellidoPaterno ||
					data.apellidoPaterno === '' ||
					!data.apellidoMaterno ||
					data.apellidoMaterno === '' ||
					!data.nombres ||
					data.nombres === ''
				) {
					throw { payload: { message: 'Debe llenar todos los campos requeridos' } };
				}
			}
			if (!data.ruc || data.ruc === '' || data.ruc.length !== 11) {
				throw { payload: { message: 'El RUC es requerido' } };
			}
			if (
				!data.direccion ||
				data.direccion === '' ||
				!data.ubigeo ||
				!data.celular ||
				data.celular === '' ||
				!data.correo ||
				data.correo === '' ||
				!data.formaPago ||
				data.formaPago === ''
			) {
				throw { payload: { message: 'Debe llenar todos los campos requeridos' } };
			}

			const direccionesAlternativas = [];
			if (data.direccionesAlternativas) {
				data.direccionesAlternativas.forEach(da => {
					if (da.ubigeo?.value) da.ubigeo = da.ubigeo.value;
					if (da.direccion && da.ubigeo) {
						direccionesAlternativas.push({
							id: typeof da.id === 'string' ? null : da.id,
							direccion: da.direccion,
							ubigeo: da.ubigeo?.key,
						});
					}
				});
			}

			const cuentasBanco = [];
			if (data.cuentasBanco) {
				console.log(data.cuentasBanco);
				data.cuentasBanco.forEach(cuenta => {
					if (typeof cuenta.banco === 'string') cuenta.banco = { value: cuenta.banco };
					if (typeof cuenta.moneda === 'string') cuenta.moneda = { value: cuenta.moneda };

					if (cuenta.banco?.value !== 'OTROS') {
						cuentasBanco.push({
							...cuenta,
							moneda: cuenta.moneda?.value,
							banco: cuenta.banco?.value.toUpperCase(),
						});
					} else if (cuenta.otroBanco) {
						cuentasBanco.push({
							...cuenta,
							moneda: cuenta.moneda?.value,
							banco: cuenta.otroBanco?.toUpperCase(),
						});
					} else {
						throw { payload: { message: 'Debe llenar todos los campos' } };
					}
				});
			}

			const body = {
				...data,
				cuentasBanco,
				direccionesAlternativas,
				detraccion:
					data.detraccion !== null && data.detraccion.value
						? data.detraccion.value
						: data.detraccion,
				formaPagoId: data.formaPago.id,
				ubigeo: data.ubigeo?.codigo,
			};
			if (tipo === 'nuevo') {
				error = await dispatch(createProveedor(body));
				if (error.error) throw error;
			} else {
				error = await dispatch(updateProveedor(body));
				if (error.error) throw error;
			}
			navigate(`/comercial/proveedores`);
			return error;
		} catch (error) {
			console.log('Error:', error);
			throw error;
		}
	}

	async function handleRemoveproveedor() {
		showToast(
			{
				promesa: removeproveedor,
				parametros: [],
			},
			'delete',
			'proveedor'
		);
	}

	async function removeproveedor() {
		try {
			const val = await dispatch(deleteProveedor());
			const error = await dispatch(deleteProveedorArray(val.payload));
			if (error.error) throw error;
			navigate('/comercial/proveedores');
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
						to="/comercial/proveedores"
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
							alt={razonSocial}
						/> */}
						<AccountCircleIcon fontSize="large" />
					</motion.div>
					<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
						<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								{tipoPersona === 'N'
									? apellidoPaterno
										? `${apellidoPaterno} ${apellidoMaterno} ${nombres}`
										: 'Nuevo Proveedor'
									: razonSocial || 'Nuevo Proveedor'}
							</Typography>
							<Typography variant="caption" className="font-medium">
								{tipoPersona === 'N' ? nroDocumento || ruc : ruc}
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
					onClick={handleRemoveproveedor}
					startIcon={<Icon className="hidden sm:flex">delete</Icon>}
				>
					Eliminar
				</Button>
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSaveProveedor}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default ProveedorHeader;

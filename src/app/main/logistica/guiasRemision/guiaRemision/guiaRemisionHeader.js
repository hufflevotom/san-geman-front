/* eslint-disable no-nested-ternary */
/* eslint-disable no-throw-literal */
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import { useTheme } from '@mui/material/styles';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';

import showToast from 'utils/Toast';
import { baseFacturacionUrl } from 'utils/Api';

import { DataEmpresa } from 'constants/constantes';
import { generateGuiaRemision, getGuiaRemisionSerieService } from 'app/services/services';
import { createGuiaRemision, deleteGuiaRemision } from '../../store/guiaRemision/guiaRemisionSlice';
import { deleteGuiasRemisionArray } from '../../store/guiaRemision/guiasRemisionSlice';

function GuiaRemisionHeader({ tipo, data }) {
	const dispatch = useDispatch();
	const theme = useTheme();
	const navigate = useNavigate();

	async function handleSaveOrden() {
		showToast(
			{
				promesa: saveOrden,
				parametros: [],
			},
			'save',
			'orden corte'
		);
	}

	function validateFormulario(formData) {
		const {
			currentMotivoTraslado,
			// currentDocumento,
			// currentNumeroDocumento,
			currentChofer,
			currentCliente,
			currentDireccionDestino,
			// currentDireccionOrigen,
			currentItems,
			currentPesoTotal,
			// currentUbigeoDestino,
			// currentUbigeoOrigen,
			currentVehiculo,
		} = formData;

		if (currentCliente === null) {
			return { isValid: false, errorMessage: 'Debe seleccionar un cliente' };
		}

		if (currentPesoTotal === 0 || currentPesoTotal === null) {
			return { isValid: false, errorMessage: 'Debe ingresar un peso total' };
		}

		if (currentMotivoTraslado === null) {
			return { isValid: false, errorMessage: 'Debe seleccionar un motivo de traslado' };
		}

		// if (currentDocumento === null) {
		// 	return { isValid: false, errorMessage: 'Debe seleccionar un tipo de documento relacionado' };
		// }

		// if (currentNumeroDocumento.length < 2 || currentNumeroDocumento === null) {
		// 	return { isValid: false, errorMessage: 'Debe ingresar una boleta o factura válida' };
		// }

		if (currentChofer === null) {
			return { isValid: false, errorMessage: 'Debe seleccionar un chofer' };
		}

		if (currentVehiculo === null) {
			return { isValid: false, errorMessage: 'Debe seleccionar un vehiculo' };
		}

		// if (currentUbigeoOrigen.length === 0 || currentUbigeoOrigen === null) {
		// 	return { isValid: false, errorMessage: 'Debe ingresar un ubigeo de origen' };
		// }

		// if (currentDireccionOrigen.length === 0 || currentDireccionOrigen === null) {
		// 	return { isValid: false, errorMessage: 'Debe ingresar una direccion de origen' };
		// }

		// if (currentUbigeoDestino.length === 0 || currentUbigeoDestino === null) {
		// 	return { isValid: false, errorMessage: 'Debe ingresar un ubigeo de destino' };
		// }

		if (currentDireccionDestino === null) {
			return { isValid: false, errorMessage: 'Debe seleccionar una direccion de destino' };
		}

		if (currentItems.length === 0 || currentItems === null) {
			return { isValid: false, errorMessage: 'Debe ingresar al menos un producto' };
		}

		if (currentItems.some(e => e.cantidad === 0 || e.cantidad === null)) {
			return { isValid: false, errorMessage: 'Debe ingresar una cantidad mayor a 0' };
		}

		if (currentItems.some(e => e.unidad === null)) {
			return { isValid: false, errorMessage: 'Debe ingresar una unidad' };
		}

		if (currentItems.some(e => e.codigo.length === 0 || e.codigo === null)) {
			return { isValid: false, errorMessage: 'Debe ingresar un codigo' };
		}

		if (currentItems.some(e => e.descripcion.length === 0 || e.descripcion === null)) {
			return { isValid: false, errorMessage: 'Debe ingresar una descripcion' };
		}

		return { isValid: true, errorMessage: null };
	}

	const descargar = async url => {
		const link = document.createElement('a');
		link.setAttribute('href', `${baseFacturacionUrl}files/${url}`);
		link.setAttribute('download', url);
		document.body.appendChild(link);
		link.dispatchEvent(
			new MouseEvent('click', {
				bubbles: true,
				cancelable: true,
				view: window,
			})
		);
		document.body.removeChild(link);
	};

	async function saveOrden() {
		let error = {};

		console.log(data);

		const { isValid, errorMessage } = validateFormulario(data);

		if (!isValid) throw new Error(errorMessage);

		const {
			currentObservacion,
			currentMotivoTraslado,
			// currentDocumento,
			// currentNumeroDocumento,
			currentChofer,
			currentCliente,
			currentDireccionDestino,
			// currentDireccionOrigen,
			currentItems,
			currentPesoTotal,
			// currentUbigeoDestino,
			// currentUbigeoOrigen,
			currentVehiculo,
		} = data;

		const items = currentItems.map(e => ({
			codigo: e.codigo,
			descripcion: e.descripcion,
			unidad: e.unidad.key,
			cantidad: e.cantidad,
		}));

		let cliente;

		if (currentCliente.tipoRespuesta === 'C') {
			cliente = {
				tipo:
					currentCliente.tipo === 'J'
						? currentCliente.ruc.length === 8
							? '1'
							: '6'
						: currentCliente.natNroDocumento.length === 8
						? '1'
						: '6',
				numero_documento:
					currentCliente.tipo === 'J' ? currentCliente.ruc : currentCliente.natNroDocumento,
				razon_social:
					currentCliente.tipo === 'J'
						? currentCliente.razónSocial
						: `${currentCliente.natNombres} ${currentCliente.natApellidoPaterno} ${currentCliente.natApellidoMaterno}`,
				direccion: currentCliente.direccion,
			};
		} else {
			cliente = {
				tipo:
					currentCliente.tipo === 'J'
						? currentCliente.ruc.length === 8
							? '1'
							: '6'
						: currentCliente.nroDocumento.length === 8
						? '1'
						: '6',
				numero_documento:
					currentCliente.tipo === 'J' ? currentCliente.ruc : currentCliente.nroDocumento,
				razon_social:
					currentCliente.tipo === 'J'
						? currentCliente.razonSocial
						: `${currentCliente.nombres} ${currentCliente.apellidoPaterno} ${currentCliente.apellidoMaterno}`,
				direccion: currentCliente.direccion,
			};
		}

		// const descDoc = currentDocumento.key === 'B' ? 'BOLETA' : 'FACTURA';
		// const tipoDoc = currentDocumento.key === 'B' ? '03' : '01';
		let serieId = 0;
		let serie = '';
		let correlativo = '';

		try {
			const resp = await getGuiaRemisionSerieService();
			if (resp === null)
				throw new Error('No se pudo obtener la serie de la guia de remision, contacte a soporte');
			serieId = resp.id;
			serie = resp.serie;
			correlativo = (parseInt(resp.correlativo, 10) + 1).toString().padStart(6, '0');
		} catch (e) {
			console.error(e);
		}

		// const documento = {
		// 	tipo_desc: descDoc,
		// 	tipo: tipoDoc,
		// 	numero: currentNumeroDocumento,
		// 	emisor: DataEmpresa.ruc,
		// };

		const vehiculo = {
			placa: currentVehiculo.placa,
		};

		const chofer = {
			dni: currentChofer.dni,
			licencia: currentChofer.licencia,
			nombre: currentChofer.nombre,
			apellido: currentChofer.apellido,
		};

		const carga = {
			peso_total: parseFloat(currentPesoTotal),
		};

		const direcciones = {
			origen: {
				ubigeo: DataEmpresa.ubigeo,
				direccion: DataEmpresa.direccion,
			},
			destino: {
				ubigeo: currentDireccionDestino.ubigeo,
				direccion: currentDireccionDestino.direccion,
			},
		};

		const datos = {
			anio: new Date().getFullYear(),
			serie,
			correlativo,
			motivo: currentMotivoTraslado.key,
		};

		try {
			if (tipo === 'nuevo') {
				// documento,
				const resp = await generateGuiaRemision({
					items,
					vehiculo,
					chofer,
					carga,
					direcciones,
					datos,
					empresa: DataEmpresa,
					cliente,
					observaciones: currentObservacion,
				});
				if (resp.success) {
					error = await dispatch(
						// documento,
						createGuiaRemision({
							...datos,
							choferId: currentChofer.id,
							observaciones: currentObservacion,
							vehiculoId: currentVehiculo.id,
							peso_total: parseFloat(currentPesoTotal),
							direcciones: [
								{ tipo: 'ORIGEN', ubigeo: DataEmpresa.ubigeo, direccion: DataEmpresa.direccion },
								{
									tipo: 'DESTINO',
									ubigeo: currentDireccionDestino.ubigeo,
									direccion: currentDireccionDestino.direccion,
								},
							],
							items,
							clienteId: currentCliente.tipoRespuesta === 'C' ? currentCliente.id : null,
							proveedorId: currentCliente.tipoRespuesta === 'P' ? currentCliente.id : null,
							serieId,
							xml: resp.data.files.xml,
							zip: resp.data.files.zip,
							pdf: resp.data.files.pdf,
						})
					);
					// descargar(resp.data.files.pdf);
					if (error.error) throw error;
				} else {
					throw new Error(resp.message);
				}
			}
			navigate(`/logistica/guia-remision`);
			return error;
		} catch (e) {
			console.log('Error:', e);
			throw e;
		}
	}

	async function handleRemoveorden() {
		showToast(
			{
				promesa: removeorden,
				parametros: [],
			},
			'delete',
			'orden corte'
		);
	}

	async function removeorden() {
		try {
			const val = await dispatch(deleteGuiaRemision());
			const error = await dispatch(deleteGuiasRemisionArray(val.payload));
			if (error.error) throw error;
			navigate('/logistica/guia-remision');
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
						to="/logistica/guia-remision"
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
						<ReceiptLongIcon fontSize="large" />
					</motion.div>
					<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
						<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								Nueva Guia de Remisión
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
					onClick={handleSaveOrden}
				>
					Guardar
				</Button>
			</motion.div>
		</div>
	);
}

export default GuiaRemisionHeader;

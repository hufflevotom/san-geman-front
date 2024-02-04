/* eslint-disable no-nested-ternary */
/* eslint-disable no-throw-literal */
/* eslint-disable no-unused-expressions */
import { useEffect, useState } from 'react';
import { Button, Link as LinkMUI } from '@mui/material';
import Icon from '@mui/material/Icon';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import showToast from 'utils/Toast';
import httpClient from 'utils/Api';
import { ACCIONES } from 'constants/constantes';
import { createEstilo, updateEstilo } from '../../store/estilo/estiloSlice';

function EstiloHeader({ tipo, subCodigo, disabled, accion }) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const [nuevaVersion, setNuevaVersion] = useState();
	const dependencia = watch('dependencia');
	const estilo = watch('estilo');
	const theme = useTheme();
	const navigate = useNavigate();

	const getSubCodigo = async () => {
		const data = getValues();
		const response = await httpClient.get(`/comercial/estilos/correlativo/${data.dependencia}`);
		if (response.data.statusCode === 200) {
			setNuevaVersion(response.data.body + 1);
		}
	};

	const verifyAvios = async ({ avios }) => {
		let isValidAvios = true;
		const errorAvios = [];

		//* Obtengo los ids de los avios
		const ids = [];
		(avios || []).forEach(
			avio => avio.avios && ids.indexOf(avio.avios?.id) === -1 && ids.push(avio.avios?.id)
		);

		//* Si no hay avios, es valido ya que no son requeridos
		if (ids.length === 0) return { isValidAvios, errorAvios };

		//* Obtengo los avios que no se pueden usar
		const response = await httpClient.post(`/maestro/avios/verify`, { ids });

		//* Evalúo si es valido o no, y si no es valido obtengo los nombres de los avios
		if (response.data.statusCode === 200) {
			isValidAvios = response.data.body.length === 0;
			(response.data.body || []).forEach(id => {
				errorAvios.push(avios.find(avio => avio.avios?.id === id).avios?.nombre);
			});
		}
		return { isValidAvios, errorAvios };
	};

	const existeEstilo = async estiloString => {
		let isValidEstilo = false;
		//* Comprobar si existe el estilo
		const response = await httpClient.get(`/comercial/estilos/existeEstilo/${estiloString}`);
		//* Evalúo si es valido
		if (response.data.statusCode === 200) isValidEstilo = response.data.body;
		return isValidEstilo;
	};

	async function handleSaveEstilo() {
		showToast(
			{
				promesa: saveEstilo,
				parametros: [],
			},
			'save',
			'estilo'
		);
	}

	async function saveEstilo() {
		try {
			let error = {};

			const data = getValues();

			const imgsBordados = [];
			const imgsEstampados = [];
			const imgsReferenciales = [];

			const arrayRutas = [];
			const arrayTelas = [];
			const arrayDetallesBordados = [];
			const arrayDetallesEstampados = [];
			const estilosAvios = [];

			if (!data.estilo || data.estilo === '') {
				throw new Error('El estilo es requerido');
			}
			if (!data.nombre || data.nombre === '') {
				throw new Error('El nombre es requerido');
			}

			const STATIC_FAMILIA_AVIOS = [8, 9, 13, 7];

			data.estiloAvios?.forEach((estiloAvio, index) => {
				let cantidad;
				if (estiloAvio.avios?.hilos) {
					cantidad = 5000 / estiloAvio.cantidadUnidad;
				} else if ([8, 9].includes(estiloAvio.avios?.familiaAvios.id)) {
					cantidad = estiloAvio.cantidadUnidad ? 1 / estiloAvio.cantidadUnidad : null;
				} else {
					cantidad = estiloAvio.cantidad;
				}

				let unidadMedidaId;
				if (estiloAvio.avios?.hilos) {
					unidadMedidaId = 6;
				} else if (STATIC_FAMILIA_AVIOS.includes(estiloAvio.avios?.familiaAvios.id)) {
					unidadMedidaId = 2;
				} else {
					unidadMedidaId = estiloAvio.unidadMedida?.id;
				}
				console.log(
					`item: ${index + 1}`,
					STATIC_FAMILIA_AVIOS.includes(estiloAvio.avios?.familiaAvios.id) ?? estiloAvio
				);
				estilosAvios.push({
					id: typeof estiloAvio.id === 'number' && !subCodigo ? estiloAvio.id : null,
					cantidad,
					tipo: estiloAvio.tipo?.value ? estiloAvio.tipo?.value : estiloAvio.tipo,
					cantidadUnidad:
						estiloAvio.avios?.hilos ||
						STATIC_FAMILIA_AVIOS.includes(estiloAvio.avios?.familiaAvios.id)
							? estiloAvio.cantidadUnidad
							: null,
					aviosId: estiloAvio.avios?.id,
					unidadMedidaId,
					coloresId: estiloAvio.colores ? estiloAvio.colores.map(c => c.id) : [],
				});
			});

			//! Comentar si el cliente no es requerido
			if (!data.cliente || data.cliente === null) {
				throw new Error('El cliente es requerido');
			}
			if (data.cliente) {
				data.clienteId = data.cliente.id;
			}

			//! Comentar si la marca no es requerida
			if (!data.marca || data.marca === null) {
				throw new Error('La marca es requerida');
			}
			if (data.marca) {
				data.marcaId = data.marca.id;
			}

			if (!data.rutasEstilos || data.rutasEstilos.length === 0) {
				throw new Error('Las rutas son requeridas');
			} else {
				data.rutasEstilos?.forEach(rt => {
					arrayRutas.push({
						id: rt.ruta && !subCodigo ? rt.id : null,
						orden: rt.orden,
						rutaId: rt.ruta ? rt.ruta?.id : rt.id,
					});
				});
			}

			if (!data?.telaPrincipal?.tela) {
				throw new Error('La tela principal es requerida');
			} else if (!data.telaPrincipal.consumo) {
				throw new Error('El consumo de la tela principal es requerido');
			} else if (!data.telaPrincipal.colores || data.telaPrincipal.colores.length === 0) {
				throw new Error('Los colores de la tela principal son requeridos');
			} else {
				data.telaPrincipal &&
					arrayTelas.push({
						id: data.telaPrincipal.tela && !subCodigo ? data.telaPrincipal?.id : null,
						telaId: data.telaPrincipal.tela ? data.telaPrincipal?.tela?.id : data.telaPrincipal?.id,
						consumo: data.telaPrincipal?.consumo,
						unidadMedidaId: 4,
						tipo: 'P',
						coloresId: data.telaPrincipal?.colores?.map(color => color.id),
						ubicacion: '',
						coloresRelacionados: JSON.stringify([]),
					});
			}

			if (data.banderaTelaComplemento) {
				data.telasComplemento?.forEach(telaC => {
					if (telaC.tela && telaC.colores && telaC.consumo && telaC.unidadMedida) {
						arrayTelas.push({
							id: typeof telaC.id === 'number' && !subCodigo ? telaC.id : null,
							telaId: telaC.tela?.id,
							coloresId: [telaC.colores?.id || telaC.colores[0]?.id],
							consumo: telaC?.consumo,
							unidadMedidaId: telaC?.unidadMedida.id,
							tipo: 'C',
							ubicacion: telaC?.ubicacion,
							coloresRelacionados: JSON.stringify(telaC?.coloresRelacionados.map(cr => cr.id)),
						});
					}
				});
			}

			if (data.banderaBordados) {
				data.bordados?.forEach(bordado => {
					if (bordado.tipo && bordado.nombre && bordado.descripcion && bordado.nroPuntadas) {
						arrayDetallesBordados.push({
							id: typeof bordado.id === 'number' && !subCodigo ? bordado.id : null,
							tipo: bordado.tipo,
							nombre: bordado.nombre,
							descripcion: bordado.descripcion,
							hilo: bordado.hilo || '',
							colorHilo: bordado.colorHilo || '',
							nroPuntadas: bordado.nroPuntadas,
							colorId: bordado.color ? bordado.color?.id : null,
						});

						if (bordado?.file) {
							imgsBordados.push({
								tipo: bordado.tipo,
								nombre: bordado.nombre,
								descripcion: bordado.descripcion,
								colorId: bordado.color?.id ?? null,
								file: bordado.file,
							});
						}
					}
				});
			}

			if (data.banderaEstampado) {
				data.estampados?.forEach(estampado => {
					if (estampado.tipo && estampado.nombre && estampado.descripcion) {
						arrayDetallesEstampados.push({
							id: typeof estampado.id === 'number' && !subCodigo ? estampado.id : null,
							tipo: estampado.tipo,
							nombre: estampado.nombre,
							descripcion: estampado.descripcion,
							colorId: estampado.color ? estampado.color?.id : null,
						});
						if (estampado?.file) {
							imgsEstampados.push({
								tipo: estampado.tipo,
								nombre: estampado.nombre,
								descripcion: estampado.descripcion,
								colorId: estampado.color ? estampado.color?.id : null,
								file: estampado.file,
							});
						}
					}
				});
			}

			if (data.banderaImagenReferencial) {
				data.imagenesOpcionalesEstilosDto = data.imagenesReferenciales?.map(imgRef => ({
					id: imgRef?.idImagenOpcional || null,
					colorId: imgRef?.id,
				}));
				data.imagenesReferenciales?.forEach(imgRef => {
					if (imgRef?.file) {
						imgsReferenciales.push({
							colorId: imgRef?.id,
							file: imgRef.file,
						});
					}
				});
			}

			if (data.lavados) {
				data.lavadosId = data.lavados.map(l => l.id);
			}

			if (!data.prenda || data.prenda === null) {
				throw new Error('El tipo de prenda es requerido');
			}

			data.estilosAvios = estilosAvios;
			data.prendaId = data.prenda.id;
			data.rutas = arrayRutas;
			data.telas = arrayTelas;
			data.detallesBordados = arrayDetallesBordados;
			data.detallesEstampados = arrayDetallesEstampados;

			const archivos = {
				imagen: data.imagenEstiloUrl,
				fichaTecnica: data.fichaTecnicaUrl,
			};

			const imagenes = {
				imagenesBordados: imgsBordados,
				imagenesEstampados: imgsEstampados,
				imagenesReferenciales: imgsReferenciales,
			};

			const obj = {
				data,
				archivos,
				imagenes,
			};

			let isValidAvios = true;
			let errorAvios = [];
			if (accion !== ACCIONES.EDITAR_ASIGNADOS) {
				const validacion = await verifyAvios({ avios: data.estiloAvios || [] });
				isValidAvios = validacion.isValidAvios;
				errorAvios = validacion.errorAvios;
			}

			if (!isValidAvios) {
				errorAvios.forEach(e => {
					toast.error(`No se puede usar el avío: ${e}`);
				});
				throw new Error('Error en avíos');
			} else {
				if (tipo === 'nuevo') {
					obj.data.dependencia = obj.data.estilo;
					obj.data.correlativo = 0;
					const valido = await existeEstilo(obj.data.estilo);
					if (valido) {
						error = await dispatch(createEstilo(obj));
					} else {
						throw new Error('El estilo ya existe');
					}
					if (error.error) throw error;
				} else if (subCodigo) {
					obj.data.correlativo = subCodigo;
					obj.data.estilo = `${obj.data.dependencia}-${subCodigo}`;
					obj.data.imagenesOpcionalesEstilosDto = obj.data.imagenesOpcionalesEstilosDto.map(
						imagen => ({ colorId: imagen?.colorId })
					);
					error = await dispatch(createEstilo(obj));
					if (error.error) throw error;
				} else {
					error = await dispatch(updateEstilo(obj));
					if (error.error) throw error;
				}
				navigate(`/comercial/estilos`);
			}
			return error;
		} catch (error) {
			console.error('Error:', error);
			throw error;
		}
	}

	useEffect(() => {
		if (tipo !== 'nuevo' && !subCodigo) {
			getSubCodigo();
		}
	}, []);

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
						to="/comercial/estilos"
						color="inherit"
					>
						<Icon className="text-20">
							{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
						</Icon>
						<span className="hidden sm:flex mx-4 font-medium">Volver</span>
					</Typography>
				</motion.div>

				<div className="flex items-center max-w-full">
					<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
						<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								{estilo && subCodigo ? `${dependencia}-${subCodigo}` : estilo || 'Nuevo Estilo'}
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
				{tipo !== 'nuevo' && !subCodigo ? (
					<Button
						className="whitespace-nowrap mx-4"
						variant="contained"
						color="secondary"
						component={LinkMUI}
						href={`/comercial/estilos/${tipo}?subcodigo=${nuevaVersion}`}
						disabled={!nuevaVersion}
					>
						Nueva versión
					</Button>
				) : null}
				{subCodigo && (
					<span
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							color: 'red',
							paddingRight: '20px',
						}}
					>
						*Vuelva a cargar las imágenes
					</span>
				)}
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					disabled={(!subCodigo && _.isEmpty(dirtyFields)) || !isValid || disabled}
					onClick={handleSaveEstilo}
				>
					Guardar{subCodigo ? ' versión' : ''}
				</Button>
			</motion.div>
		</div>
	);
}

export default EstiloHeader;

/* eslint-disable consistent-return */
import FuseLoading from '@fuse/core/FuseLoading';
import { PDFDocument } from 'pdf-lib';
import { useEffect, useState } from 'react';
import domtoimage from 'dom-to-image';
import httpClient from 'utils/Api';
import moment from 'moment';
import showToast from 'utils/Toast';
import FuseUtils from '@fuse/utils/FuseUtils';
import {
	getControlCalidadService,
	getProduccionService,
	getProductosTelasService,
} from './ordenCorte/services';
import { CantidadesTizados, DatoTelaReal } from './ordenCorte/components';

const {
	Modal,
	Fade,
	Backdrop,
	Typography,
	TableHead,
	TableRow,
	TableCell,
	Table,
	TableBody,
	Button,
	TableFooter,
} = require('@mui/material');
const { Box } = require('@mui/system');

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '90%',
	height: '90%',
	bgcolor: 'background.paper',
	borderRadius: 3,
	// boxShadow: 24,
	overflowY: 'scroll',
	p: 4,
};
const constPading = 8;
const border = 1;

const obtenerTelasDeUnaProduccion = produccion => {
	const telas = [];

	if (produccion && produccion.pedidos) {
		produccion.pedidos.forEach(pedido => {
			pedido.estilos.forEach(estilo => {
				estilo.telasEstilos.forEach(tela => {
					telas.push(tela.tela);
				});
			});
		});
	}

	return telas.filter((tela, index) => telas.findIndex(t => t.id === tela.id) === index);
};

const ModalDetallesOC = ({ openModal, setOpenModal, dataModal }) => {
	const [loading, setLoading] = useState(false);

	const [fecha, setFecha] = useState();
	const [codigo, setCodigo] = useState();
	const [subCodigo, setSubCodigo] = useState();
	const [descripcion, setDescripcion] = useState();

	const [currentProduccion, setCurrentProduccion] = useState(null);
	const [currentPartida, setCurrentPartida] = useState([]);
	const [currentTelas, setCurrentTelas] = useState([]);
	const [currentColor, setCurrentColor] = useState(null);
	const [currentEstilos, setCurrentEstilos] = useState([]);
	const [currentTipoPrenda, setCurrentTipoPrenda] = useState(null);
	const [currentMolde, setCurrentMolde] = useState(null);
	const [currentObservaciones, setCurrentObservaciones] = useState([]);
	const [currentObservacionGeneral, setCurrentObservacionGeneral] = useState(null);
	const [currentCheckPanios, setCurrentCheckPanios] = useState(false);

	const [uniquePartidas, setUniquePartidas] = useState([]);
	const [productosTela, setProductosTela] = useState([]);
	const [tablaTizados, setTablaTizados] = useState([]);

	const [estilos, setEstilos] = useState([]);

	const obtenerDataModal = async id => {
		setLoading(true);
		await showToast(
			{
				promesa: async () => {
					const {
						data: { statusCode, body },
					} = await httpClient.get(`orden-corte-panios/${id}`);
					if (statusCode === 200) {
						//* Obtenemos los datos de la produccion
						const dataProduccion = await getProduccionService(body.produccion.id);
						llenarListas(dataProduccion);

						//* Obtenemos los datos de las telas
						const pertenece = await getProductosTelasService('', dataProduccion, 1);
						const unqPertenece = pertenece.filter(
							(partida, index) => pertenece.findIndex(p => p.codigo === partida.codigo) === index
						);

						const noPertenece = await getProductosTelasService('', dataProduccion, -1);
						const unqNoPertenece = noPertenece.filter(
							(partida, index) => noPertenece.findIndex(p => p.codigo === partida.codigo) === index
						);

						const libres = await getProductosTelasService('', dataProduccion, 0);
						const unqLibres = libres.filter(
							(partida, index) => libres.findIndex(p => p.codigo === partida.codigo) === index
						);

						const arrUnique = [
							...unqPertenece.map(p => ({
								...p,
								origen: 1,
							})),
							...unqNoPertenece.map(p => ({
								...p,
								origen: -1,
							})),
							...unqLibres.map(p => ({
								...p,
								origen: 0,
							})),
						];

						const unqPartidas = arrUnique.filter(
							(partida, index) =>
								arrUnique.findIndex(p => p.partida === partida.partida) === index &&
								partida.clasificacion === 'Tela OK'
						);

						const partidasPertenecen = [];

						const telasProduccion = obtenerTelasDeUnaProduccion(dataProduccion);

						body.productosTelas.forEach(curr => {
							const index = telasProduccion.findIndex(tela => tela.id === curr.tela.id);
							if (index !== -1) {
								partidasPertenecen.push(curr);
							}
						});

						const responseCalidad = await getControlCalidadService(partidasPertenecen);

						//* Seteamos los datos de la partida
						const partidaValue = unqPartidas.filter(
							p => body.productosTelas.findIndex(q => p.partida === q.partida) !== -1
						);

						//* Seteamos los datos de las telas
						const telasValue = [];
						responseCalidad.data.body.forEach(tela => {
							const telas = body.productosTelas.find(t => t.id === tela.id);
							if (telas) {
								telasValue.push({ ...tela, key: tela.id, label: `${tela.tela.nombre}` });
							}
						});

						//* Seteamos los datos de los estilos
						const estilosValue = [];
						dataProduccion.pedidos.forEach(pedido => {
							pedido.estilos.forEach(estilo => {
								body.estilos.forEach(estiloBody => {
									if (estiloBody.id === estilo.id) {
										if (!estilosValue.find(e => e.id === estilo.id)) {
											estilosValue.push(estilo);
										}
									}
								});
							});
						});

						//* Seteamos los datos de las cantidades y tizados
						const tabla = [];

						estilosValue.forEach((estilo, index) => {
							const telasArray = [];
							const tallasArray = [];

							let nombreTelas = '';
							telasValue.forEach(tela => {
								estilo.telasEstilos.forEach(telaEstilo => {
									if (telaEstilo.tela.id === tela.tela.id) {
										if (telasValue.length > 1) {
											nombreTelas += `${tela.label ? tela.label : tela.tela.nombre} -/- `;
										} else if (telasValue.length === 1) {
											nombreTelas = telasValue[0].label
												? telasValue[0].label
												: telasValue[0].tela.nombre;
										}
										telasArray.push(tela);
									}
								});
							});

							const cantidadesPorTalla = [];
							estilo.registroEstilos?.forEach(registroEstilo => {
								registroEstilo.detalleRegistroEstilo.forEach(detalleRegistroEstilo => {
									if (tallasArray.findIndex(c => c.id === detalleRegistroEstilo.talla.id) === -1) {
										if (detalleRegistroEstilo.porcentaje !== null) {
											tallasArray.push({
												id: detalleRegistroEstilo.talla.id,
												talla: detalleRegistroEstilo.talla.talla,
												prefijo: detalleRegistroEstilo.talla.prefijo,
											});
											cantidadesPorTalla.push(detalleRegistroEstilo.cantidad);
										}
									}
								});
							});
							const dataTizados = [];
							body.tizados.forEach(estiloTizados => {
								const calidad = responseCalidad.data.body.find(
									e => e.id === estiloTizados.productoTela.id
								);
								const anchoDensidad =
									parseFloat(calidad.calidadTextil.anchoDelRolloReal / 100) *
									parseFloat(calidad.calidadTextil.densidadAntesLavadoReal / 1000);
								dataTizados.push({
									id: estiloTizados.id,
									tela: estiloTizados.productoTela,
									telaValue: {
										...estiloTizados.productoTela.tela,
										label: `${estiloTizados.productoTela.tela.nombre}`,
									},
									anchoDensidad,
									cantidadPano: estiloTizados.cantPaños,
									largoTizado: estiloTizados.largoTizado,
									pesoPano: estiloTizados.pesoPaño,
									cantidadesTizado: estiloTizados.tizadosCantidades.map(c => ({
										id: c.talla.id,
										talla: c.talla.talla,
										relacion: c.multiplicador,
										cantidad: c.cantidad,
									})),
								});
							});

							tabla.push({
								estiloId: estilo.id,
								telas: telasArray,
								tallas: tallasArray,
								detalleCantidades: {
									estilo: estilo.estilo,
									nombre: estilo.nombre,
									color: body.color?.descripcion,
									tela: nombreTelas,
									cantidadesTotales: cantidadesPorTalla,
									cantidadesCorte: cantidadesPorTalla.map(c => 0),
								},
								tizados: dataTizados,
							});
						});

						filterTelaPrincipal(estilosValue);

						//* Seteamos los datos de las observaciones
						const arreglo = [];
						// eslint-disable-next-line no-restricted-syntax
						for (const tela of telasValue) {
							// eslint-disable-next-line no-restricted-syntax
							for (const extra of body.extras) {
								if (extra.productoTela.id === tela.id) {
									if (tela.calidadTextil) {
										const partidas = [];
										const arrPartidas = partidaValue.filter(
											partida => partida.tela.id === tela.tela.id
										);
										// eslint-disable-next-line no-restricted-syntax
										for (const partida of arrPartidas) {
											if (partida.calidadTextil) {
												// eslint-disable-next-line no-await-in-loop
												const resKardex = await httpClient.get(
													`/almacen-tela/kardex/kardexTela/${tela.id}`
												);
												let reservado = 0;
												resKardex.data.body.reservaOrdenCorte?.forEach(a => {
													if (parseInt(a.ordenCorte.id, 10) !== parseInt(id, 10)) {
														reservado += parseFloat(a.cantidad);
													}
												});
												partidas.push({
													kardexTelaId: resKardex.data.body.id,
													partida: partida.partida,
													cantidadAlmacen: parseFloat(resKardex.data.body.cantidad) - reservado,
													reservado,
													densidadReal: partida.calidadTextil.densidadAntesLavadoReal / 1000,
													anchoReal: partida.calidadTextil.anchoDelRolloReal / 100,
													telaProgramada: 0,
												});
											}
										}
										arreglo.push({
											id: FuseUtils.generateGUID(),
											tela: tela.tela,
											productoTelaId: tela.id,
											codigo: tela.codigo,
											sumaPesos: parseFloat(extra.sumaPesos),
											saldoTeorico: 0,
											telaProgramada: parseFloat(extra.telaProgramada),
											partidas,
										});
									}
								}
							}
						}

						//* Calculo de la suma de pesos
						const array = [];
						await arreglo.forEach(item => {
							const partidasArr = [];
							item.partidas.forEach(partida => {
								partidasArr.push({ ...partida });
							});
							array.push({
								...item,
								partidas: partidasArr,
								sumaPesos: 0,
								telaProgramada: 0,
								saldoTeorico: item.cantidadAlmacen,
							});
						});
						if (array.length > 0) {
							await array.forEach(observacion => {
								if (tabla && tabla.length > 0) {
									tabla.forEach(tablaa => {
										tablaa.tizados.forEach(tizado => {
											if (tizado.tela?.tela?.id === observacion.tela?.id) {
												observacion.sumaPesos += parseFloat(tizado.pesoPano || 0);
												observacion.telaProgramada += parseFloat(tizado.pesoPano || 0);
												observacion.saldoTeorico -= parseFloat(tizado.pesoPano || 0);
											}
										});
									});
								}
							});
							await array.forEach(observacion => {
								let tela = parseFloat(observacion.telaProgramada || 0);
								observacion.partidas = observacion.partidas.map(partida => {
									if (tela >= partida.cantidadAlmacen) {
										partida.telaProgramada = partida.cantidadAlmacen;
										tela -= partida.cantidadAlmacen;
									} else {
										partida.telaProgramada = tela;
										tela = 0;
									}
									return partida;
								});
							});
						}

						//* Seteamos los datos del codigo
						setCodigo(body.codigo);
						setSubCodigo(body.subCodigo);
						setDescripcion(
							`${body.codigo.toString().padStart(6, '0')}-${body.subCodigo.toString()}`
						);
						//* Seteamos los datos de la produccion
						setCurrentProduccion(dataProduccion);

						setUniquePartidas(unqPartidas);

						setProductosTela(responseCalidad.data.body.filter(a => a.clasificacion === 'Tela OK'));

						setCurrentPartida(partidaValue);

						setCurrentTelas(telasValue);

						//* Seteamos los datos del color
						setCurrentColor(body.color);

						setCurrentEstilos(estilosValue);

						//* Seteamos los datos del tipo de prenda
						setCurrentTipoPrenda(body.prenda);

						//* Seteamos los datos del molde
						setCurrentMolde(body.molde);

						//* Seteamos los datos del check paños
						setCurrentCheckPanios(body.panios);

						setCurrentObservaciones(array);

						setTablaTizados(tabla);

						//* Seteamos los datos de la observacion general
						setCurrentObservacionGeneral(body.observaciones);

						setFecha(body.fecha);

						setLoading(false);
						return { payload: { message: 'Producción encontrada' } };
					}
				},
				parametros: [],
			},
			'buscar',
			'Producción'
		);
		calcularSumaPesos();
	};

	const calcularSumaPesos = () => {
		const array = currentObservaciones.map(item => {
			return {
				...item,
				sumaPesos: 0,
				telaProgramada: 0,
				saldoTeorico: item.cantidadAlmacen,
			};
		});
		if (array.length > 0) {
			array.forEach(observacion => {
				if (tablaTizados && tablaTizados.length > 0) {
					tablaTizados.forEach(tabla => {
						tabla.tizados.forEach(tizado => {
							if (tizado.tela?.tela?.id === observacion.tela?.id) {
								observacion.sumaPesos += parseFloat(tizado.pesoPano || 0);
								observacion.telaProgramada += parseFloat(tizado.pesoPano || 0);
								observacion.saldoTeorico -= parseFloat(tizado.pesoPano || 0);
							}
						});
					});
				}
			});
			array.forEach(observacion => {
				let tela = parseFloat(observacion.telaProgramada || 0);
				observacion.partidas = observacion.partidas.map(partida => {
					if (tela >= partida.cantidadAlmacen) {
						partida.telaProgramada = partida.cantidadAlmacen;
						tela -= partida.cantidadAlmacen;
					} else {
						partida.telaProgramada = tela;
						tela = 0;
					}
					return partida;
				});
			});
		}

		setCurrentObservaciones(array);
	};

	const llenarListas = async prod => {
		const estilosArray = [];

		prod.pedidos.forEach(item => {
			item.estilos.forEach(estilo => {
				estilosArray.push(estilo);
			});
		});

		const idEstilos = [];
		const est = [];

		estilosArray.forEach(estilo => {
			if (!idEstilos.includes(estilo.id)) {
				idEstilos.push(estilo.id);
				est.push(estilo);
			}
		});

		setEstilos(est);
	};

	const filterTelaPrincipal = arrayEstilos => {
		currentTelas.forEach(a => {
			a.tipo = null;
		});
		const arrayTelas = [];
		const arrayTemp = [];
		const tel = [];
		if (arrayEstilos.length > 0) {
			currentTelas.forEach(tela => {
				arrayEstilos.forEach(estilo => {
					estilo.telasEstilos?.forEach(telaEstilo => {
						if (tela.tela.id === telaEstilo.tela.id) {
							if (tela.tipo !== 'P') {
								if (telaEstilo.tipo === 'P') {
									arrayTelas.push({ ...tela, tipo: telaEstilo.tipo });
								}
							} else {
								arrayTelas.push(tela);
							}
						} else {
							arrayTemp.push(tela);
						}
					});
				});
			});
			const idsTelas = [];
			arrayTelas.forEach(tela => {
				if (!idsTelas.includes(tela.id)) {
					idsTelas.push(tela.id);
					tel.push(tela);
				}
			});
			arrayTemp.forEach(tela => {
				if (!idsTelas.includes(tela.id)) {
					idsTelas.push(tela.id);
					tel.push(tela);
				}
			});
		} else {
			currentTelas.forEach(tela => {
				if (tela.tipo) delete tela.tipo;
				arrayTelas.push(tela);
			});
			const idsTelas = [];
			arrayTelas.forEach(tela => {
				if (!idsTelas.includes(tela.id)) {
					idsTelas.push(tela.id);
					tel.push(tela);
				}
			});
		}
		setCurrentTelas(tel);
	};

	const descargarImpresion = async () => {
		try {
			const pdfDoc = await PDFDocument.create();

			const dataUrl = await domtoimage.toPng(document.getElementById('documentoImpresion'), {
				quality: 1,
				bgcolor: '#fff',
			});

			const page = pdfDoc.addPage([842, 595]);
			const { width, height } = page.getSize();

			page.drawImage(await pdfDoc.embedPng(dataUrl), {
				x: 20,
				y: 30,
				width: width - 50,
				height: height - 50,
			});

			const pdfBytes = await pdfDoc.save();
			const blob = new Blob([pdfBytes], { type: 'application/pdf' });
			const link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = `${dataModal.codigo}.pdf`;
			link.click();
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		obtenerDataModal(dataModal.id);
	}, []);

	return (
		<Modal
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			open={openModal}
			onClose={() => setOpenModal(false)}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
		>
			<Fade in={openModal}>
				<Box sx={style}>
					<div id="documentoImpresion">
						{loading ? (
							<div
								style={{
									width: '100%',
									height: '100%',
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<FuseLoading />
							</div>
						) : (
							<div>
								<>
									{/* <div>Tabla de cantidades programadas: {JSON.stringify(dataModal)}</div> */}

									{currentProduccion && (
										<div className="flex gap-2">
											<div className="mx-6 mb-16 text-base">OP:</div>
											<div className="mx-6 mb-16 text-base">{currentProduccion?.codigo}</div>
										</div>
									)}
									<div className="flex gap-20">
										{dataModal?.codigo && (
											<div className="flex gap-2">
												<div className="mx-6 mb-16 text-base">#Corte:</div>
												<div className="mx-6 mb-16 text-base">
													{dataModal?.codigo.toString().padStart(6, '0')}
												</div>
											</div>
										)}
										{fecha && (
											<div className="flex gap-2">
												<div className="mx-6 mb-16 text-base">Fecha:</div>
												<div className="mx-6 mb-16 text-base">
													{moment(fecha).format('DD/MM/YYYY')}
												</div>
											</div>
										)}
									</div>
									<div className="flex gap-20">
										{currentTipoPrenda && (
											<div className="flex gap-2">
												<div className="mx-6 mb-16 text-base">Tipo de Prenda:</div>
												<div className="mx-6 mb-16 text-base">{currentTipoPrenda?.nombre}</div>
											</div>
										)}
										{currentTipoPrenda && (
											<div className="flex gap-2">
												<div className="mx-6 mb-16 text-base">Color:</div>
												<div className="mx-6 mb-16 text-base">{currentColor?.descripcion}</div>
											</div>
										)}
										{currentPartida.length > 0 && (
											<div className="flex gap-2">
												<div className="mx-6 mb-16 text-base">
													Partida{currentPartida.length > 1 ? 's:' : ':'}
												</div>
												<div className="mx-6 mb-16 text-base">
													{currentPartida?.map(partida => partida.partida).join(' - ')}
												</div>
											</div>
										)}
									</div>
									{currentMolde && (
										<div className="flex gap-2">
											<div className="mx-6 mb-16 text-base">Molde:</div>
											<div className="mx-6 mb-16 text-base">{currentMolde}</div>
										</div>
									)}
									{/* <div className="flex gap-2">
											<div className="mx-6 mb-16 text-base">Complementos:</div> {JSON.stringify(currentObservaciones)}</div> */}
									{tablaTizados.length > 0 && (
										<>
											<CantidadesTizados
												tablaTizados={tablaTizados}
												setTablaTizados={setTablaTizados}
												disabled
												text
											/>
											<DatoTelaReal
												currentObservaciones={currentObservaciones}
												setCurrentObservaciones={setCurrentObservaciones}
												disabled
												text
											/>
										</>
									)}
									{currentObservacionGeneral && (
										<div className="flex gap-2">
											<div className="mx-6 mb-16 text-base">Observaciones:</div>
											<div className="mx-6 mb-16 text-base">{currentObservacionGeneral}</div>
										</div>
									)}
									{/* <div
											style={{
												width: '100%',
												display: 'flex',
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'space-between',
												paddingBottom: '20px',
											}}
										>
											<div>
												<img
													src="assets/images/logos/logoSG.png"
													alt="logo"
													style={{ width: '150px' }}
												/>
											</div>
											<div>
												<Typography id="transition-modal-title" variant="h6" component="h2">
													ORDEN DE COMPRA: <br />
													{model.codigo}
												</Typography>
											</div>
											<div>
												<div
													style={{
														width: '100%',
														display: 'flex',
														flexDirection: 'column',
														alignItems: 'start',
														justifyContent: 'space-between',
													}}
												>
													<div
														style={{
															width: '100%',
															display: 'flex',
															flexDirection: 'row',
															alignItems: 'center',
															justifyContent: 'left',
															gap: '10px',
														}}
													>
														<div style={{ fontWeight: 'bold' }}>F. EMISION:</div>
														<div>
															{model.fechaEmision
																? moment(model.fechaEmision).format('DD/MM/YYYY')
																: ' '}
														</div>
													</div>
													<div
														style={{
															width: '100%',
															display: 'flex',
															flexDirection: 'row',
															alignItems: 'center',
															justifyContent: 'left',
															gap: '10px',
														}}
													>
														<div style={{ fontWeight: 'bold' }}>F. ENTREGA:</div>
														<div>
															{model.fechaEntrega
																? moment(model.fechaEntrega).format('DD/MM/YYYY')
																: ' '}
														</div>
													</div>
													<div
														style={{
															width: '100%',
															display: 'flex',
															flexDirection: 'row',
															alignItems: 'center',
															justifyContent: 'left',
															gap: '10px',
														}}
													>
														<div style={{ fontWeight: 'bold' }}>F. ANULACION:</div>
														<div>
															{model.fechaAnulacion
																? moment(model.fechaAnulacion).format('DD/MM/YYYY')
																: ' '}
														</div>
													</div>
												</div>
											</div>
										</div> */}
									{/* <div
											style={{
												width: '100%',
												display: 'flex',
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'space-between',
												paddingBottom: '20px',
											}}
										>
											<div
												style={{
													width: '100%',
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'start',
													justifyContent: 'space-between',
												}}
											>
												<div
													style={{
														width: '100%',
														display: 'flex',
														flexDirection: 'row',
														alignItems: 'center',
														justifyContent: 'left',
														gap: '10px',
													}}
												>
													<div style={{ fontWeight: 'bold' }}>PROVEEDOR:</div>
													<div>{model.proveedor.razonSocial}</div>
												</div>
												<div
													style={{
														width: '100%',
														display: 'flex',
														flexDirection: 'row',
														alignItems: 'center',
														justifyContent: 'left',
														gap: '10px',
													}}
												>
													<div style={{ fontWeight: 'bold' }}>RUC:</div>
													<div>{model.proveedor.ruc}</div>
												</div>
												<div
													style={{
														width: '100%',
														display: 'flex',
														flexDirection: 'row',
														alignItems: 'center',
														justifyContent: 'left',
														gap: '10px',
													}}
												>
													<div style={{ fontWeight: 'bold' }}>CONTACTO:</div>
													<div>
														{model.proveedor.personaContacto ||
															'No tiene persona de contacto registrado'}
													</div>
												</div>
												<div
													style={{
														width: '100%',
														display: 'flex',
														flexDirection: 'row',
														alignItems: 'center',
														justifyContent: 'left',
														gap: '10px',
													}}
												>
													<div style={{ fontWeight: 'bold' }}>FORMA PAGO:</div>
													<div>
														{model.formaPago.descripcion || 'No tiene forma de pago registrado'}
													</div>
												</div>
											</div>
											<div
												style={{
													width: '100%',
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'start',
													justifyContent: 'space-between',
												}}
											>
												<div
													style={{
														width: '100%',
														display: 'flex',
														flexDirection: 'row',
														alignItems: 'center',
														justifyContent: 'left',
														gap: '10px',
													}}
												>
													<div style={{ fontWeight: 'bold' }}>EMAIL:</div>
													<div>{model.proveedor.correo || 'No tiene email registrado'}</div>
												</div>
												<div
													style={{
														width: '100%',
														display: 'flex',
														flexDirection: 'row',
														alignItems: 'center',
														justifyContent: 'left',
														gap: '10px',
													}}
												>
													<div style={{ fontWeight: 'bold' }}>MONEDA:</div>
													<div>{model.moneda || 'No tiene moneda registrada'}</div>
												</div>
											</div>
										</div> */}
									{/* <div
											style={{
												width: '100%',
												display: 'flex',
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'space-between',
											}}
										>
											<div
												style={{
													width: '100%',
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												<div style={{ width: '100%', paddingBottom: '10px', fontWeight: 'bold' }}>
													FACTURAR A NOMBRE DE:
												</div>
												<div
													style={{
														width: '100%',
														display: 'flex',
														flexDirection: 'row',
														alignItems: 'center',
														justifyContent: 'left',
														gap: '10px',
													}}
												>
													<div style={{ fontWeight: 'bold' }}>RAZON SOCIAL:</div>
													<div>CONFECCIONES SAN GERMAN S.A.C.</div>
												</div>
												<div
													style={{
														width: '100%',
														display: 'flex',
														flexDirection: 'row',
														alignItems: 'center',
														justifyContent: 'left',
														gap: '10px',
													}}
												>
													<div style={{ fontWeight: 'bold' }}>R.U.C.:</div>
													<div>20548370206</div>
												</div>
												<div
													style={{
														width: '100%',
														display: 'flex',
														flexDirection: 'row',
														alignItems: 'center',
														justifyContent: 'left',
														gap: '10px',
													}}
												>
													<div style={{ fontWeight: 'bold' }}>DOMICILIO FISCAL:</div>
													<div>
														AV. HUAROCHIRI MZ B LTE 25 URB. LA PORTADA DE CERES - SANTA ANITA - LIMA
														- LIMA
													</div>
												</div>
											</div>
										</div> */}
									{/* <div style={{ padding: '20px 0' }}>
											Agradecemos se sirvan remitirnos la(s) mercadería(s) que describimos a
											continuación, de acuerdo a las condiciones pactadas con Uds. Las cuales
											confirmamos con la presente.
										</div> */}
									{/* <Table
											style={{
												borderWidth: border,
												borderColor: 'black',
											}}
										>
											<TableHead>
												<TableRow>
													<TableCell
														style={{
															borderWidth: border,
															borderColor: 'black',
															padding: constPading,
															fontWeight: 'bold',
														}}
														width={100}
														align="center"
													>
														CODIGO
													</TableCell>
													<TableCell
														style={{
															borderWidth: border,
															borderColor: 'black',
															padding: constPading,
															fontWeight: 'bold',
														}}
														align="center"
													>
														DESCRIPCION
													</TableCell>
													<TableCell
														style={{
															borderWidth: border,
															borderColor: 'black',
															padding: constPading,
															fontWeight: 'bold',
														}}
														align="center"
													>
														CANT.
													</TableCell>
													<TableCell
														align="center"
														style={{
															borderWidth: border,
															borderColor: 'black',
															padding: constPading,
															fontWeight: 'bold',
														}}
													>
														U/M
													</TableCell>
													<TableCell
														align="center"
														style={{
															borderWidth: border,
															borderColor: 'black',
															padding: constPading,
															fontWeight: 'bold',
														}}
													>
														VALOR UNITARIO
													</TableCell>
													<TableCell
														align="center"
														style={{
															borderWidth: border,
															borderColor: 'black',
															padding: constPading,
															fontWeight: 'bold',
														}}
													>
														% DSCTO
													</TableCell>
													<TableCell
														align="center"
														style={{
															borderWidth: border,
															borderColor: 'black',
															padding: constPading,
															fontWeight: 'bold',
														}}
													>
														PRECIO UNITARIO
													</TableCell>
													<TableCell
														align="center"
														style={{
															borderWidth: border,
															borderColor: 'black',
															padding: constPading,
															fontWeight: 'bold',
														}}
													>
														TOTAL IMPORTE
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{model.detalleOrdenComprasTelas.map((fila, index) => (
													<>
														<TableRow key={index}>
															<TableCell
																align="center"
																style={{
																	borderWidth: border,
																	borderColor: 'black',
																	padding: constPading,
																}}
															>
																{fila.producto.tela.codReferencia}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	borderWidth: border,
																	borderColor: 'black',
																	padding: constPading,
																}}
															>
																{`${fila.producto.tela.nombre} - ${fila.producto.color.descripcion}`}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	width: 90,
																	borderWidth: border,
																	borderColor: 'black',
																	padding: constPading,
																}}
															>
																{fila.cantidad}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	borderWidth: border,
																	borderColor: 'black',
																	padding: constPading,
																}}
															>
																{fila.unidad.nombre}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	width: 90,
																	borderWidth: border,
																	borderColor: 'black',
																	padding: constPading,
																}}
															>
																{model.moneda === 'DOLARES' ? '$ ' : 'S/ '}
																{fila.valorUnitario}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	width: 90,
																	borderWidth: border,
																	borderColor: 'black',
																	padding: constPading,
																}}
															>
																{fila.descuento} %
															</TableCell>
															<TableCell
																align="center"
																style={{
																	width: 90,
																	borderWidth: border,
																	borderColor: 'black',
																	padding: constPading,
																}}
															>
																{model.moneda === 'DOLARES' ? '$ ' : 'S/ '}
																{fila.precioUnitario}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	width: 90,
																	borderWidth: border,
																	borderColor: 'black',
																	padding: constPading,
																}}
															>
																{model.moneda === 'DOLARES' ? '$ ' : 'S/ '}
																{fila.totalImporte}
															</TableCell>
														</TableRow>
													</>
												))}
												<TableRow>
													<TableCell
														colSpan={7}
														style={{
															borderWidth: border,
															borderColor: 'black',
															padding: constPading,
															textAlign: 'right',
															fontWeight: 'bold',
														}}
													>
														VALOR VENTA:
													</TableCell>
													<TableCell
														colSpan={1}
														style={{
															borderWidth: border,
															borderColor: 'black',
															padding: constPading,
														}}
													>
														{model.moneda === 'DOLARES' ? '$ ' : 'S/ '}
														{model.valorVenta || ' '}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell
														colSpan={7}
														style={{
															borderWidth: border,
															borderColor: 'black',
															padding: constPading,
															textAlign: 'right',
															fontWeight: 'bold',
														}}
													>
														IGV (18.00%):
													</TableCell>
													<TableCell
														colSpan={1}
														style={{
															borderWidth: border,
															borderColor: 'black',
															padding: constPading,
														}}
													>
														{model.moneda === 'DOLARES' ? '$ ' : 'S/ '}
														{model.igv || ' '}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell
														colSpan={7}
														style={{
															borderWidth: border,
															borderColor: 'black',
															padding: constPading,
															textAlign: 'right',
															fontWeight: 'bold',
														}}
													>
														TOTAL IMPORTE:
													</TableCell>
													<TableCell
														colSpan={1}
														style={{
															borderWidth: border,
															borderColor: 'black',
															padding: constPading,
														}}
													>
														{model.moneda === 'DOLARES' ? '$ ' : 'S/ '}
														{model.total || ' '}
													</TableCell>
												</TableRow>
											</TableBody>
										</Table> */}
									{/* <div style={{ padding: '40px 0 0 0', fontWeight: 'bold' }}>
											NOTAS / INDICACIONES:
										</div> */}
									{/* <div style={{ padding: '10px 0 20px 0' }}>{model.observacion || ' '}</div> */}
									{/* <div style={{ padding: '40px 0 0 0', fontWeight: 'bold' }}>OBSERVACIONES:</div> */}
									{/* <div style={{ padding: '10px 0 20px 0' }}>
											1.- LUGAR DE ENTREGA: CONFECCIONES SAN GERMAN, MZ B LT 25 URB PORTADA DE CERES
											SANTA ANITA.
											<br /> 2.- La Presente Orden de Compra es inválida automáticamente en los
											siguientes casos, dejando en libertad a CONFECCIONES SAN GERMAN a ejercer su
											derecho a recibir o rechazar las mercaderías solicitadas, salvo aceptación
											previa y escrita por CONFECCIONES SAN GERMAN S.A.C.:
											<br /> &nbsp; a.- El incumplimiento del proveedor de cualquiera de los
											requisitos de Calidad, Cantidad, Condiciones de Pago, Precos, Fecha, Lugar de
											Entrega, Caracterísitcas Técnicas de los artículos solicitados.
											<br /> &nbsp; b.- Cualquier enmedadura o corrección de la presente.
											<br /> 3.- FAVOR ADJUNTAR ESTA ORDEN DE COMPRA A LA FACTURA.
											<br /> 4.- CONFECCIONES SAN GERMAN SAC.
										</div> */}
									{/* <div
											style={{
												display: 'flex',
												flexDirection: 'row',
												justifyContent: 'space-between',
												gap: '100px',
											}}
										>
											<Table
												style={{
													borderWidth: border,
													borderColor: 'black',
												}}
											>
												<TableHead>
													<TableRow>
														<TableCell
															style={{
																borderWidth: border,
																borderColor: 'black',
																padding: constPading,
																fontWeight: 'bold',
															}}
															align="center"
															colSpan={2}
														>
															SOLICITADO
														</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													<TableRow>
														<TableCell
															align="center"
															style={{
																borderWidth: border,
																borderColor: 'black',
																padding: constPading,
																fontWeight: 'bold',
															}}
														>
															Solicitado por:
														</TableCell>
														<TableCell
															align="center"
															style={{
																borderWidth: border,
																borderColor: 'black',
																padding: constPading,
															}}
														>
															MARISOL PRETEL
														</TableCell>
													</TableRow>
													<TableRow>
														<TableCell
															align="center"
															style={{
																borderWidth: border,
																borderColor: 'black',
																padding: constPading,
																fontWeight: 'bold',
															}}
														>
															Aprobado por:
														</TableCell>
														<TableCell
															align="center"
															style={{
																borderWidth: border,
																borderColor: 'black',
																padding: constPading,
															}}
														>
															MARISOL PRETEL
														</TableCell>
													</TableRow>
													<TableRow>
														<TableCell
															align="center"
															style={{
																borderWidth: border,
																borderColor: 'black',
																padding: constPading,
																fontWeight: 'bold',
															}}
														>
															V.B. :
														</TableCell>
														<TableCell
															align="center"
															style={{
																borderWidth: border,
																borderColor: 'black',
																padding: constPading,
																height: 80,
															}}
														>
															{' '}
														</TableCell>
													</TableRow>
												</TableBody>
											</Table>
											<Table
												style={{
													borderWidth: border,
													borderColor: 'black',
												}}
											>
												<TableHead>
													<TableRow>
														<TableCell
															style={{
																borderWidth: border,
																borderColor: 'black',
																padding: constPading,
																fontWeight: 'bold',
															}}
															align="center"
														>
															CONFORME Y ACEPTADO
														</TableCell>
													</TableRow>
													<TableRow>
														<TableCell
															style={{
																borderWidth: border,
																borderColor: 'black',
																padding: constPading,
																height: 80,
															}}
															align="center"
														>
															{' '}
														</TableCell>
													</TableRow>
													<TableRow>
														<TableCell
															style={{
																borderWidth: border,
																borderColor: 'black',
																padding: constPading,
															}}
															align="center"
															colSpan={2}
														>
															<div
																style={{
																	width: '100%',
																	display: 'flex',
																	flexDirection: 'column',
																	alignItems: 'center',
																	justifyContent: 'center',
																}}
															>
																<div style={{ fontWeight: 'bold' }}>Autorizado</div>
																<div>Fecha y Firma de Representante</div>
															</div>
														</TableCell>
													</TableRow>
												</TableHead>
											</Table>
										</div> */}
								</>
							</div>
						)}
					</div>
					<div
						style={{
							width: '100%',
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'flex-end',
							marginTop: '20px',
							gap: '20px',
						}}
					>
						{!loading && (
							<Button variant="contained" color="primary" onClick={() => descargarImpresion()}>
								Descargar
							</Button>
						)}
						<Button variant="contained" color="secondary" onClick={() => setOpenModal(false)}>
							Cerrar
						</Button>
					</div>
				</Box>
			</Fade>
		</Modal>
	);
};

export default ModalDetallesOC;

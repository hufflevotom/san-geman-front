/* eslint-disable no-restricted-syntax */
import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';
import FuseLoading from '@fuse/core/FuseLoading';
import httpClient, { baseUrl } from 'utils/Api';
import { utils, writeFile } from 'xlsx';

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

const pageStyle = `
	@page {
		margin: 30px !important;
	}
	@media all {
		.pagebreak {
			display: none;
		}
	}
	@media print {
		.pagebreak {
			page-break-before: always;
		}
	}
`;

const ModalAviosDeProduccion = ({ visible, data, setVisible, imagenActiva, setImagenActiva }) => {
	const impresionRef = useRef();
	const [produccion, setProduccion] = useState();

	const [loading, setLoading] = useState(false);
	const [estilos, setEstilos] = useState([]);

	const handlePrint = useReactToPrint({
		content: () => impresionRef.current,
		pageStyle,
	});

	const obtenerProduccion = async id => {
		setLoading(true);
		try {
			const response = await httpClient.get(`comercial/producciones/${id}`);
			setProduccion(response.data.body);
		} catch (error) {
			console.error(error);
		}
	};

	const transformarData = dataInicial => {
		if (!dataInicial) return;

		const tablaNueva = [];
		console.log(dataInicial);
		dataInicial.pedidos[0].estilos.forEach(estilo => {
			tablaNueva.push({
				id: estilo.id,
				estilo: estilo.estilo,
				nombre: estilo.nombre,
				tabla: [],
			});
		});
		tablaNueva.forEach(estilo => {
			const aviosArr = [];
			dataInicial.pedidos[0].aviosPo.forEach(item => {
				if (item.estilo.id === estilo.id) {
					aviosArr.push({
						...item,
						id: item.id,
						avio:
							item.avio.familiaavio?.id === 1
								? `${item.avio.nombre} - ${item.avio.codigoSec} - ${item.avio.marcaHilo} - ${
										item.avio.color?.descripcion
								  }${item.avio.talla ? ` - Talla: ${item.avio.talla.prefijo}` : ''}`
								: `${item.avio.nombre}${
										item.avio.talla ? ` - Talla: ${item.avio.talla.prefijo}` : ''
								  }`,
						cantidad: item.unidad,
						unidad: item.unidadMedida?.prefijo,
						imagen: item.avio.imagenUrl || null,
					});
				}
			});
			estilo.tabla = aviosArr;
		});

		setEstilos(tablaNueva);
		setLoading(false);
	};

	const descargarImpresion = async () => {
		handlePrint();
	};

	useEffect(() => {
		obtenerProduccion(data.id);
	}, []);

	useEffect(() => {
		transformarData(produccion);
	}, [produccion]);

	const descargarExcel = async () => {
		//* Crear un libro de trabajo de Excel
		const wb = utils.book_new();
		//* Crear una hoja de cálculo
		const ws = utils.table_to_sheet(document.getElementById('tabla-exportable'));

		//* Ajustar ancho de la columna
		// ws['!cols'] = [{ width: 100 }, { width: 100 }, { width: imgWidth }, { width: imgWidth }];

		//* Añadir la hoja de cálculo al libro de trabajo
		utils.book_append_sheet(wb, ws, `${data.codigo}`);

		//* Guardar el archivo
		writeFile(wb, `${data.codigo}.xlsx`);
	};

	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: '50%',
		height: '90%',
		bgcolor: 'background.paper',
		borderRadius: 3,
		// boxShadow: 24,
		overflowY: 'scroll',
		p: 4,
	};
	const constPading = 8;
	const border = 1;

	return (
		<Modal
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			open={visible}
			onClose={() => setVisible(false)}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
		>
			<Fade in={visible}>
				<Box sx={style}>
					<div>
						<div
							style={{
								width: '100%',
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
								marginBottom: '20px',
							}}
						>
							<div
								style={{
									width: '100%',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'start',
									justifyContent: 'center',
								}}
							>
								<Typography
									id="transition-modal-title"
									variant="h6"
									component="h2"
									style={{ marginBottom: '20px' }}
								>
									{data.codigo}
								</Typography>
							</div>
							<div
								style={{
									width: '100%',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'end',
									justifyContent: 'center',
								}}
							>
								<Typography component="p">
									<b>PO: </b>
									{data.pedidos[0].po}
								</Typography>
								<Typography component="p">
									<b>Fecha despacho: </b>
									{moment(data.fechaDespacho).format('DD/MM/YYYY')}
								</Typography>
							</div>
						</div>
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
							<Table
							// style={{
							// 	borderWidth: border,
							// 	borderColor: 'black',
							// }}
							>
								{estilos.map(estilo => (
									<>
										<TableHead>
											<TableRow>
												<TableCell
													style={{
														border: 'none',
													}}
													align="left"
													colSpan={3}
												>
													<Typography
														id="transition-modal-title"
														variant="h6"
														component="h6"
														style={{ margin: '10px 0' }}
													>
														{estilo.estilo}
													</Typography>
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											<TableRow>
												<TableCell
													style={{
														borderWidth: border,
														borderColor: 'black',
														padding: constPading,
													}}
													align="center"
												>
													AVÍO
												</TableCell>
												<TableCell
													align="center"
													style={{
														borderWidth: border,
														borderColor: 'black',
														padding: constPading,
													}}
												>
													CANTIDAD
												</TableCell>
												<TableCell
													align="center"
													style={{
														borderWidth: border,
														borderColor: 'black',
														padding: constPading,
													}}
												>
													UNIDAD DE MEDIDA
												</TableCell>
											</TableRow>
											{estilo.tabla.map(fila => (
												<TableRow>
													<TableCell
														align="left"
														style={{
															borderWidth: border,
															borderColor: 'black',
															padding: constPading,
														}}
													>
														<div
															style={{
																width: '100%',
																display: 'flex',
																flexDirection: 'row',
																alignItems: 'center',
																justifyContent: 'center',
															}}
														>
															<div style={{ width: '20%' }}>
																<Button
																	onClick={() => {
																		if (fila.imagen) {
																			setVisible(false);
																			setImagenActiva(baseUrl + fila.imagen);
																		}
																	}}
																	color="primary"
																	disabled={!fila.imagen}
																>
																	Ver
																</Button>
															</div>
															<div style={{ width: '80%' }}>{fila.avio}</div>
														</div>
													</TableCell>
													<TableCell
														align="center"
														style={{
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
														{fila.unidad}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</>
								))}
							</Table>
						)}
					</div>
					<div style={{ display: 'none' }}>
						<div ref={impresionRef}>
							<div
								style={{
									width: '100%',
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'center',
									marginBottom: '20px',
								}}
							>
								<div
									style={{
										width: '100%',
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'start',
										justifyContent: 'center',
									}}
								>
									<Typography
										id="transition-modal-title"
										variant="h6"
										component="h2"
										style={{ marginBottom: '20px' }}
									>
										{data.codigo}
									</Typography>
								</div>
								<div
									style={{
										width: '100%',
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'end',
										justifyContent: 'center',
									}}
								>
									<Typography component="p">
										<b>PO: </b>
										{data.pedidos[0].po}
									</Typography>
									<Typography component="p">
										<b>Fecha despacho: </b>
										{moment(data.fechaDespacho).format('DD/MM/YYYY')}
									</Typography>
								</div>
							</div>
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
								<Table
									// style={{
									// 	borderWidth: border,
									// 	borderColor: 'black',
									// }}
									id="tabla-exportable"
								>
									{estilos.map(estilo => (
										<>
											<TableHead>
												<TableRow>
													<TableCell
														style={{
															border: 'none',
														}}
														align="left"
														colSpan={3}
													>
														<Typography
															id="transition-modal-title"
															variant="h6"
															component="h6"
															style={{ margin: '10px 0' }}
														>
															{estilo.estilo}
														</Typography>
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												<TableRow>
													<TableCell
														style={{
															borderWidth: border,
															borderColor: 'black',
															padding: constPading,
														}}
														align="center"
													>
														AVÍO
													</TableCell>
													<TableCell
														align="center"
														style={{
															borderWidth: border,
															borderColor: 'black',
															padding: constPading,
														}}
													>
														CANTIDAD
													</TableCell>
													<TableCell
														align="center"
														style={{
															borderWidth: border,
															borderColor: 'black',
															padding: constPading,
														}}
													>
														UNIDAD DE MEDIDA
													</TableCell>
												</TableRow>
												{estilo.tabla.map(fila => (
													<TableRow>
														<TableCell
															align="left"
															style={{
																borderWidth: border,
																borderColor: 'black',
																padding: constPading,
															}}
														>
															{fila.avio}
														</TableCell>
														<TableCell
															align="center"
															style={{
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
															{fila.unidad}
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</>
									))}
								</Table>
							)}
						</div>
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
						{!loading && (
							<Button variant="contained" color="success" onClick={descargarExcel}>
								Descargar Excel
							</Button>
						)}
						<Button variant="contained" color="secondary" onClick={() => setVisible(false)}>
							Cerrar
						</Button>
					</div>
				</Box>
			</Fade>
		</Modal>
	);
};

export default ModalAviosDeProduccion;

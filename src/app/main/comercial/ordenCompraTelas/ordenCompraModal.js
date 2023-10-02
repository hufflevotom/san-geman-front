/* eslint-disable react-hooks/exhaustive-deps */
import FuseLoading from '@fuse/core/FuseLoading';
import { useReactToPrint } from 'react-to-print';
import { useEffect, useRef, useState } from 'react';
import httpClient from 'utils/Api';
import { utils, writeFile } from 'xlsx';
import moment from 'moment';

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
		page: A4;
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

const ModalDetallesOCT = ({ openModal, setOpenModal, dataModal }) => {
	const impresionRef = useRef();
	const [model, setModel] = useState();

	const [loading, setLoading] = useState(false);
	const usuario = JSON.parse(localStorage.getItem('usuario'));

	const handlePrint = useReactToPrint({
		content: () => impresionRef.current,
		pageStyle,
	});

	const obtenerDataModal = async id => {
		setLoading(true);
		try {
			const response = await httpClient.get(`comercial/compra-telas/${id}`);
			setModel(response.data.body);
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
	};

	const descargarImpresion = async () => {
		// try {
		// 	const pdfDoc = await PDFDocument.create();

		// 	const dataUrl = await domtoimage.toPng(document.getElementById('documentoImpresion'), {
		// 		quality: 1,
		// 		bgcolor: '#fff',
		// 	});

		// 	console.log('dataUrl', dataUrl);

		// 	const page = pdfDoc.addPage([842, 595]);
		// 	const { width, height } = page.getSize();

		// 	page.drawImage(await pdfDoc.embedPng(dataUrl), {
		// 		x: 20,
		// 		y: 30,
		// 		width: width - 50,
		// 		height: height - 50,
		// 	});

		// 	const pdfBytes = await pdfDoc.save();
		// 	const blob = new Blob([pdfBytes], { type: 'application/pdf' });
		// 	const link = document.createElement('a');
		// 	link.href = window.URL.createObjectURL(blob);
		// 	link.download = `${dataModal.codigo}.pdf`;
		// 	link.click();
		// } catch (e) {
		// 	console.error(e);
		// }
		handlePrint();
	};

	useEffect(() => {
		obtenerDataModal(dataModal.id);
	}, []);

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
	const constPading = 3;
	const border = '1px solid #000';

	const descargarExcel = async () => {
		//* Crear un libro de trabajo de Excel
		const wb = utils.book_new();
		//* Crear una hoja de cálculo
		const ws = utils.table_to_sheet(document.getElementById('tabla-exportable'));

		//* Ajustar ancho de la columna
		// ws['!cols'] = [{ width: 100 }, { width: 100 }, { width: imgWidth }, { width: imgWidth }];

		//* Añadir la hoja de cálculo al libro de trabajo
		utils.book_append_sheet(wb, ws, `${dataModal.codigo}`);

		//* Guardar el archivo
		writeFile(wb, `${dataModal.codigo}.xlsx`);
	};

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
					<div style={{ fontSize: '10px' }}>
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
								{model ? (
									<>
										<div
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
													src="assets/images/logos/SG-Confecciones.jpeg"
													alt="logo"
													style={{ width: '150px' }}
												/>
											</div>
											<div style={{ fontSize: '16px' }}>ORDEN DE COMPRA: {model.codigo}</div>
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

													{/* <div
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
													</div> */}
												</div>
											</div>
										</div>
										<div
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
										</div>
										<div
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
										</div>
										<div style={{ padding: '20px 0' }}>
											Agradecemos se sirvan remitirnos la(s) mercadería(s) que describimos a
											continuación, de acuerdo a las condiciones pactadas con Uds. Las cuales
											confirmamos con la presente.
										</div>
										<Table
											style={{
												border,
											}}
										>
											<TableHead>
												<TableRow>
													<TableCell
														style={{
															border,
															fontSize: '12px',

															padding: constPading,
															fontWeight: 'bold',
														}}
														align="center"
													>
														#
													</TableCell>
													<TableCell
														style={{
															border,
															fontSize: '10px',

															padding: constPading,
															fontWeight: 'bold',
														}}
														align="center"
													>
														DESCRIPCION
													</TableCell>
													<TableCell
														style={{
															border,
															fontSize: '10px',

															padding: constPading,
															fontWeight: 'bold',
														}}
														align="center"
													>
														COLOR
													</TableCell>
													<TableCell
														style={{
															border,
															fontSize: '10px',

															padding: constPading,
															fontWeight: 'bold',
														}}
														align="center"
													>
														DENSIDAD
													</TableCell>
													<TableCell
														style={{
															border,
															fontSize: '10px',

															padding: constPading,
															fontWeight: 'bold',
														}}
														align="center"
													>
														ANCHO
													</TableCell>
													<TableCell
														style={{
															border,
															fontSize: '10px',

															padding: constPading,
															fontWeight: 'bold',
														}}
														align="center"
													>
														ACABADO
													</TableCell>
													<TableCell
														style={{
															border,
															fontSize: '10px',

															padding: constPading,
															fontWeight: 'bold',
														}}
														align="center"
													>
														COD.REF.
													</TableCell>
													<TableCell
														style={{
															border,
															fontSize: '10px',

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
															border,
															fontSize: '10px',

															padding: constPading,
															fontWeight: 'bold',
														}}
													>
														U/M
													</TableCell>
													<TableCell
														align="center"
														style={{
															border,
															fontSize: '10px',

															padding: constPading,
															fontWeight: 'bold',
															lineHeight: '1.2',
														}}
													>
														VALOR UNITARIO
													</TableCell>
													<TableCell
														align="center"
														style={{
															border,
															fontSize: '10px',

															padding: constPading,
															fontWeight: 'bold',
															lineHeight: '1.2',
														}}
													>
														% DSCTO
													</TableCell>
													<TableCell
														align="center"
														style={{
															border,
															fontSize: '10px',

															padding: constPading,
															fontWeight: 'bold',
															lineHeight: '1.2',
														}}
													>
														PRECIO UNITARIO
													</TableCell>
													<TableCell
														align="center"
														style={{
															border,
															fontSize: '10px',

															padding: constPading,
															fontWeight: 'bold',
															lineHeight: '1.2',
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
																	border,
																	fontSize: '10px',

																	padding: constPading,
																}}
															>
																{index + 1}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '10px',

																	padding: constPading,
																}}
															>
																{`${fila.producto.tela.nombre}`}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '10px',
																	padding: constPading,
																}}
															>
																{`${fila.producto.color.descripcion}`}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '10px',

																	padding: constPading,
																}}
															>
																{`${fila.producto.tela.densidad}`}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '10px',

																	padding: constPading,
																}}
															>
																{`${fila.producto.tela.ancho}`}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '10px',

																	padding: constPading,
																}}
															>
																{`${fila.producto.tela.acabado}`}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '10px',

																	padding: constPading,
																}}
															>
																{`${fila.producto.tela.codReferencia}`}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '10px',

																	padding: constPading,
																}}
															>
																{fila.cantidad}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '10px',

																	padding: constPading,
																}}
															>
																{fila.unidad.prefijo}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '10px',

																	padding: constPading,
																}}
															>
																{model.moneda === 'DOLARES' ? '$ ' : 'S/ '}
																{fila.valorUnitario}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '10px',

																	padding: constPading,
																}}
															>
																{fila.descuento} %
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '10px',

																	padding: constPading,
																}}
															>
																{model.moneda === 'DOLARES' ? '$ ' : 'S/ '}
																{fila.precioUnitario}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '10px',

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
														colSpan={12}
														style={{
															border,
															fontSize: '10px',

															padding: constPading,
															textAlign: 'right',
															fontWeight: 'bold',
														}}
													>
														VALOR VENTA:
													</TableCell>
													<TableCell
														align="center"
														colSpan={1}
														style={{
															border,
															fontSize: '10px',

															padding: constPading,
														}}
													>
														{model.moneda === 'DOLARES' ? '$ ' : 'S/ '}
														{model.valorVenta || ' '}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell
														colSpan={12}
														style={{
															border,
															fontSize: '10px',

															padding: constPading,
															textAlign: 'right',
															fontWeight: 'bold',
														}}
													>
														IGV (18.00%):
													</TableCell>
													<TableCell
														align="center"
														colSpan={1}
														style={{
															border,
															fontSize: '10px',

															padding: constPading,
														}}
													>
														{model.moneda === 'DOLARES' ? '$ ' : 'S/ '}
														{model.igv || ' '}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell
														colSpan={12}
														style={{
															border,
															fontSize: '10px',

															padding: constPading,
															textAlign: 'right',
															fontWeight: 'bold',
														}}
													>
														TOTAL IMPORTE:
													</TableCell>
													<TableCell
														align="center"
														colSpan={1}
														style={{
															border,
															fontSize: '10px',

															padding: constPading,
														}}
													>
														{model.moneda === 'DOLARES' ? '$ ' : 'S/ '}
														{model.total || ' '}
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
										<div
											style={{
												padding:
													model.detalleOrdenComprasTelas.length > 3 ? '20px 0 0 0' : '100px 0 0 0',
												fontWeight: 'bold',
											}}
										>
											NOTAS / INDICACIONES:
										</div>
										<div style={{ padding: '10px 0 20px 0' }}>{model.observaciones || ' '}</div>
										<div style={{ padding: '40px 0 0 0', fontWeight: 'bold' }}>OBSERVACIONES:</div>
										<div style={{ padding: '10px 0 20px 0' }}>
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
										</div>
										<div
											style={{
												display: 'flex',
												flexDirection: 'row',
												justifyContent: 'space-between',
												gap: '100px',
											}}
										>
											<Table
												style={{
													border,
													fontSize: '10px',
												}}
											>
												<TableHead>
													<TableRow>
														<TableCell
															style={{
																border,
																fontSize: '10px',

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
																border,
																fontSize: '10px',

																padding: constPading,
																fontWeight: 'bold',
															}}
														>
															Solicitado por:
														</TableCell>
														<TableCell
															align="center"
															style={{
																border,
																fontSize: '10px',

																padding: constPading,
															}}
														>
															{`${usuario.nombre} ${usuario.apellido}`}
														</TableCell>
													</TableRow>
													<TableRow>
														<TableCell
															align="center"
															style={{
																border,
																fontSize: '10px',

																padding: constPading,
																fontWeight: 'bold',
															}}
														>
															Aprobado por:
														</TableCell>
														<TableCell
															align="center"
															style={{
																border,
																fontSize: '10px',

																padding: constPading,
															}}
														>
															{`${usuario.nombre} ${usuario.apellido}`}
														</TableCell>
													</TableRow>
													<TableRow>
														<TableCell
															align="center"
															style={{
																border,
																fontSize: '10px',

																padding: constPading,
																fontWeight: 'bold',
															}}
														>
															V.B. :
														</TableCell>
														<TableCell
															align="center"
															style={{
																border,
																fontSize: '10px',

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
													border,
													fontSize: '10px',
												}}
											>
												<TableHead>
													<TableRow>
														<TableCell
															style={{
																border,
																fontSize: '10px',

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
																border,
																fontSize: '10px',

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
																border,
																fontSize: '10px',

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
																	gap: '3px',
																}}
															>
																<div style={{ fontWeight: 'bold' }}>Autorizado</div>
																<div>Fecha y Firma de Representante</div>
															</div>
														</TableCell>
													</TableRow>
												</TableHead>
											</Table>
										</div>
									</>
								) : null}
							</div>
						)}
					</div>
					<div style={{ display: 'none' }}>
						<div id="documentoImpresion" ref={impresionRef} style={{ fontSize: '8px' }}>
							<div>
								{model ? (
									<>
										<div
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
													src="assets/images/logos/SG-Confecciones.jpeg"
													alt="logo"
													style={{ width: '100px' }}
												/>
											</div>
											<div style={{ fontSize: '10px' }}>ORDEN DE COMPRA: {model.codigo}</div>
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
												</div>
											</div>
										</div>
										<div
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
										</div>
										<div
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
										</div>
										<div style={{ padding: '20px 0' }}>
											Agradecemos se sirvan remitirnos la(s) mercadería(s) que describimos a
											continuación, de acuerdo a las condiciones pactadas con Uds. Las cuales
											confirmamos con la presente.
										</div>
										<Table
											style={{
												border,
											}}
											id="tabla-exportable"
										>
											<TableHead>
												<TableRow>
													<TableCell
														style={{
															border,
															fontSize: '9px',

															padding: constPading,
															fontWeight: 'bold',
														}}
														align="center"
													>
														#
													</TableCell>
													<TableCell
														style={{
															border,
															fontSize: '9px',

															padding: constPading,
															fontWeight: 'bold',
														}}
														align="center"
													>
														DESCRIPCION
													</TableCell>
													<TableCell
														style={{
															border,
															fontSize: '9px',

															padding: constPading,
															fontWeight: 'bold',
														}}
														align="center"
													>
														COLOR
													</TableCell>
													<TableCell
														style={{
															border,
															fontSize: '9px',

															padding: constPading,
															fontWeight: 'bold',
														}}
														align="center"
													>
														DENSIDAD
													</TableCell>
													<TableCell
														style={{
															border,
															fontSize: '9px',

															padding: constPading,
															fontWeight: 'bold',
														}}
														align="center"
													>
														ANCHO
													</TableCell>
													<TableCell
														style={{
															border,
															fontSize: '9px',

															padding: constPading,
															fontWeight: 'bold',
														}}
														align="center"
													>
														ACABADO
													</TableCell>
													<TableCell
														style={{
															border,
															fontSize: '9px',

															padding: constPading,
															fontWeight: 'bold',
														}}
														align="center"
													>
														COD.REF.
													</TableCell>
													<TableCell
														style={{
															border,
															fontSize: '9px',

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
															border,
															fontSize: '9px',

															padding: constPading,
															fontWeight: 'bold',
														}}
													>
														U/M
													</TableCell>
													<TableCell
														align="center"
														style={{
															border,
															fontSize: '9px',

															padding: constPading,
															fontWeight: 'bold',
															lineHeight: '1.2',
														}}
													>
														VALOR UNITARIO
													</TableCell>
													<TableCell
														align="center"
														style={{
															border,
															fontSize: '9px',

															padding: constPading,
															fontWeight: 'bold',
															lineHeight: '1.2',
														}}
													>
														% DSCTO
													</TableCell>
													<TableCell
														align="center"
														style={{
															border,
															fontSize: '9px',

															padding: constPading,
															fontWeight: 'bold',
															lineHeight: '1.2',
														}}
													>
														PRECIO UNITARIO
													</TableCell>
													<TableCell
														align="center"
														style={{
															border,
															fontSize: '9px',

															padding: constPading,
															fontWeight: 'bold',
															lineHeight: '1.2',
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
																	border,
																	fontSize: '9px',

																	padding: constPading,
																}}
															>
																{index + 1}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '9px',

																	padding: constPading,
																}}
															>
																{`${fila.producto.tela.nombre}`}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '9px',

																	padding: constPading,
																}}
															>
																{`${fila.producto.color.descripcion}`}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '9px',

																	padding: constPading,
																}}
															>
																{`${fila.producto.tela.densidad}`}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '9px',

																	padding: constPading,
																}}
															>
																{`${fila.producto.tela.ancho}`}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '9px',

																	padding: constPading,
																}}
															>
																{`${fila.producto.tela.acabado}`}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '9px',

																	padding: constPading,
																}}
															>
																{`${fila.producto.tela.codReferencia}`}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '9px',

																	padding: constPading,
																}}
															>
																{fila.cantidad}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '9px',

																	padding: constPading,
																}}
															>
																{fila.unidad.prefijo}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '9px',

																	padding: constPading,
																}}
															>
																{model.moneda === 'DOLARES' ? '$ ' : 'S/ '}
																{fila.valorUnitario}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '9px',

																	padding: constPading,
																}}
															>
																{fila.descuento} %
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '9px',

																	padding: constPading,
																}}
															>
																{model.moneda === 'DOLARES' ? '$ ' : 'S/ '}
																{fila.precioUnitario}
															</TableCell>
															<TableCell
																align="center"
																style={{
																	border,
																	fontSize: '9px',

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
														colSpan={12}
														style={{
															border,
															fontSize: '9px',

															padding: constPading,
															textAlign: 'right',
															fontWeight: 'bold',
														}}
													>
														VALOR VENTA:
													</TableCell>
													<TableCell
														align="center"
														colSpan={1}
														style={{
															border,
															fontSize: '9px',

															padding: constPading,
														}}
													>
														{model.moneda === 'DOLARES' ? '$ ' : 'S/ '}
														{model.valorVenta || ' '}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell
														colSpan={12}
														style={{
															border,
															fontSize: '9px',

															padding: constPading,
															textAlign: 'right',
															fontWeight: 'bold',
														}}
													>
														IGV (18.00%):
													</TableCell>
													<TableCell
														align="center"
														colSpan={1}
														style={{
															border,
															fontSize: '9px',

															padding: constPading,
														}}
													>
														{model.moneda === 'DOLARES' ? '$ ' : 'S/ '}
														{model.igv || ' '}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell
														colSpan={12}
														style={{
															border,
															fontSize: '9px',

															padding: constPading,
															textAlign: 'right',
															fontWeight: 'bold',
														}}
													>
														TOTAL IMPORTE:
													</TableCell>
													<TableCell
														align="center"
														colSpan={1}
														style={{
															border,
															fontSize: '9px',

															padding: constPading,
														}}
													>
														{model.moneda === 'DOLARES' ? '$ ' : 'S/ '}
														{model.total || ' '}
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
										<div
											style={{
												padding: '20px 0 0 0',
												fontWeight: 'bold',
											}}
										>
											NOTAS / INDICACIONES:
										</div>
										<div style={{ padding: '10px 0 20px 0' }}>{model.observaciones || ' '}</div>
										<div style={{ fontWeight: 'bold' }}>OBSERVACIONES:</div>
										<div style={{ padding: '10px 0 20px 0' }}>
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
										</div>
										<div
											style={{
												display: 'flex',
												flexDirection: 'row',
												justifyContent: 'space-between',
												gap: '100px',
											}}
										>
											<Table
												style={{
													border,
													fontSize: '9px',
												}}
											>
												<TableHead>
													<TableRow>
														<TableCell
															style={{
																border,
																fontSize: '9px',

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
																border,
																fontSize: '9px',

																padding: constPading,
																fontWeight: 'bold',
															}}
														>
															Solicitado por:
														</TableCell>
														<TableCell
															align="center"
															style={{
																border,
																fontSize: '9px',

																padding: constPading,
															}}
														>
															{`${usuario.nombre} ${usuario.apellido}`}
														</TableCell>
													</TableRow>
													<TableRow>
														<TableCell
															align="center"
															style={{
																border,
																fontSize: '9px',

																padding: constPading,
																fontWeight: 'bold',
															}}
														>
															Aprobado por:
														</TableCell>
														<TableCell
															align="center"
															style={{
																border,
																fontSize: '9px',

																padding: constPading,
															}}
														>
															{`${usuario.nombre} ${usuario.apellido}`}
														</TableCell>
													</TableRow>
													<TableRow>
														<TableCell
															align="center"
															style={{
																border,
																fontSize: '9px',

																padding: constPading,
																fontWeight: 'bold',
															}}
														>
															V.B. :
														</TableCell>
														<TableCell
															align="center"
															style={{
																border,
																fontSize: '9px',

																padding: constPading,
																height: '50px',
															}}
														>
															{' '}
														</TableCell>
													</TableRow>
												</TableBody>
											</Table>
											<Table
												style={{
													border,
													fontSize: '9px',
												}}
											>
												<TableHead>
													<TableRow>
														<TableCell
															style={{
																border,
																fontSize: '9px',

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
																border,
																fontSize: '9px',

																padding: constPading,
																height: '50px',
															}}
															align="center"
														>
															{' '}
														</TableCell>
													</TableRow>
													<TableRow>
														<TableCell
															style={{
																border,
																fontSize: '9px',

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
																	gap: '3px',
																}}
															>
																<div style={{ fontWeight: 'bold' }}>Autorizado</div>
																<div>Fecha y Firma de Representante</div>
															</div>
														</TableCell>
													</TableRow>
												</TableHead>
											</Table>
										</div>
									</>
								) : null}
							</div>
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
								Imprimir
							</Button>
						)}
						{!loading && dataModal.codigo && (
							<Button variant="contained" color="success" onClick={descargarExcel}>
								Descargar Excel
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

export default ModalDetallesOCT;

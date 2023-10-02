import FuseLoading from '@fuse/core/FuseLoading';
import { PDFDocument } from 'pdf-lib';
import { useEffect, useState } from 'react';
import domtoimage from 'dom-to-image';
import httpClient, { baseUrl } from 'utils/Api';

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
} = require('@mui/material');
const { Box } = require('@mui/system');

const ModalPedidos = ({ visible, data, setVisible }) => {
	const [produccion, setProduccion] = useState();

	const [loading, setLoading] = useState(false);
	const [tallas, setTallas] = useState([]);
	const [tabla, setTabla] = useState([]);
	const [porcentaje, setPorcentaje] = useState(100);

	const obtenerProduccion = async id => {
		setLoading(true);
		try {
			const response = await httpClient.get(`comercial/pedidos/${id}`);
			setProduccion(response.data.body);
		} catch (error) {
			console.error(error);
		}
	};

	const transformarData = dataInicial => {
		if (!dataInicial) return;

		const tablaNueva = dataInicial.estilos.map(item => {
			return {
				id: item.id,
				estilo: item.estilo,
				imagen: item.imagenEstiloUrl,
				tela: item.telasEstilos.find(tela => tela.tipo === 'P').tela.nombre,
				prenda: item.prenda.nombre,
				consumo: item.telasEstilos.find(tela => tela.tipo === 'P').consumo,
			};
		});

		const cantidades = dataInicial.cantidadesPorcentaje;
		const newPorcentaje = cantidades[0].porcentaje + 100;

		let newTallas = [];
		const newCantidadesTallas = [];
		cantidades.forEach(item => {
			if (newCantidadesTallas.findIndex(e => e.estilo === item.estilo.id) === -1) {
				newCantidadesTallas.push({ estilo: item.estilo.id, tallas: [item.talla.prefijo] });
			} else {
				newCantidadesTallas[
					newCantidadesTallas.findIndex(e => e.estilo === item.estilo.id)
				].tallas.push(item.talla.prefijo);
			}
		});
		const arrDeArrTallas = [];
		newCantidadesTallas.forEach(item => {
			arrDeArrTallas.push(item.tallas);
		});

		arrDeArrTallas.sort((a, b) => {
			return b.length - a.length;
		});

		arrDeArrTallas.forEach(item => {
			item.forEach(talla => {
				if (!newTallas.includes(talla)) newTallas.push(talla);
			});
		});
		// eliminar tallas repetidas
		newTallas = [...new Set(newTallas)];

		// agrupar las cantidades por estilos
		const cantidadesPorEstilos = {};
		cantidades.forEach(item => {
			if (!cantidadesPorEstilos[item.estilo.id]) {
				cantidadesPorEstilos[item.estilo.id] = [];
			}
			cantidadesPorEstilos[item.estilo.id].push(item);
		});

		// agrupar las cantidades por colores
		// eslint-disable-next-line no-restricted-syntax
		for (const key in cantidadesPorEstilos) {
			if (Object.hasOwnProperty.call(cantidadesPorEstilos, key)) {
				const element = cantidadesPorEstilos[key];
				const cantidadesPorColores = {};
				element.forEach(item => {
					if (!cantidadesPorColores[item.color.id]) {
						cantidadesPorColores[item.color.id] = [];
					}
					cantidadesPorColores[item.color.id].push(item);
				});
				cantidadesPorEstilos[key] = cantidadesPorColores;
			}
		}

		tablaNueva.forEach(item => {
			// eslint-disable-next-line no-restricted-syntax
			for (const key in cantidadesPorEstilos) {
				if (Object.hasOwnProperty.call(cantidadesPorEstilos, key)) {
					const element = cantidadesPorEstilos[key];
					if (item.id.toString() === key) {
						item.detalles = [];
						// eslint-disable-next-line no-restricted-syntax
						for (const key2 in element) {
							if (Object.hasOwnProperty.call(element, key2)) {
								const element2 = element[key2];
								const det = {
									color: element2[0].color.descripcion,
									id: element2[0].color.id,
									total: element2.reduce((acc, cur) => acc + cur.cantidad, 0),
								};

								const cant = [];

								newTallas.forEach(talla => {
									const cantTalla = element2.find(x => x.talla.prefijo === talla);
									if (cantTalla) {
										cant.push(cantTalla.cantidad);
									} else {
										cant.push(0);
									}
								});

								det.cantidades = cant;
								item.detalles.push(det);
							}
						}
					}
				}
			}
		});

		setTallas(newTallas);
		setTabla(tablaNueva);
		setPorcentaje(newPorcentaje);
		setLoading(false);
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
			link.download = `${data.po}.pdf`;
			link.click();
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		obtenerProduccion(data.id);
	}, []);

	useEffect(() => {
		transformarData(produccion);
	}, [produccion]);

	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: '90%',
		height: '90%',
		bgcolor: 'background.paper',
		borderRadius: 3,
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
					<div id="documentoImpresion">
						<Typography
							id="transition-modal-title"
							variant="h6"
							component="h2"
							style={{ marginBottom: '20px' }}
						>
							{data.po}
						</Typography>
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
													// maxWidth: '150px',
												}}
												rowSpan={2}
												colSpan={1}
												width={100}
												align="center"
											>
												TELA
											</TableCell>
											<TableCell
												style={{
													borderWidth: border,
													borderColor: 'black',
													padding: constPading,
													width: '150px',
												}}
												rowSpan={2}
												colSpan={2}
												align="center"
											>
												ESTILO
											</TableCell>
											<TableCell
												style={{
													borderWidth: border,
													borderColor: 'black',
													padding: constPading,
													width: '150px',
												}}
												rowSpan={2}
												colSpan={1}
												align="center"
											>
												NOMBRE
											</TableCell>
											<TableCell
												rowSpan={2}
												colSpan={1}
												align="center"
												style={{
													borderWidth: border,
													borderColor: 'black',
													padding: constPading,
													width: '100px',
												}}
											>
												COLOR
											</TableCell>
											<TableCell
												rowSpan={1}
												colSpan={tallas.length + 1}
												align="center"
												style={{
													borderWidth: border,
													borderColor: 'black',
													padding: constPading,
													width: '350px',
												}}
											>
												CANTIDAD AL {porcentaje}%
											</TableCell>
											<TableCell
												rowSpan={2}
												colSpan={1}
												align="center"
												style={{
													borderWidth: border,
													borderColor: 'black',
													padding: constPading,
													width: '50px',
												}}
											>
												CONSUMO
											</TableCell>
										</TableRow>
										<TableRow>
											{tallas.map((talla, index) => (
												<TableCell
													rowSpan={1}
													colSpan={1}
													align="center"
													style={{
														borderWidth: border,
														borderColor: 'black',
														padding: constPading,
														width: '50px',
													}}
												>
													{talla}
												</TableCell>
											))}
											<TableCell
												rowSpan={2}
												colSpan={1}
												align="center"
												style={{
													borderWidth: border,
													borderColor: 'black',
													padding: constPading,
													width: '50px',
												}}
											>
												TOTAL
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{tabla.map(fila => (
											<>
												<TableRow>
													<TableCell
														rowSpan={fila.detalles.length + 1}
														colSpan={1}
														align="center"
														style={{
															borderWidth: border,
															borderColor: 'black',
															padding: constPading,
														}}
													>
														{fila.tela}
													</TableCell>
													<TableCell
														rowSpan={fila.detalles.length + 1}
														colSpan={1}
														align="center"
														style={{
															borderWidth: border,
															borderColor: 'black',
															padding: constPading,
															width: '50px',
														}}
													>
														{fila.estilo}
													</TableCell>
													<TableCell
														rowSpan={fila.detalles.length + 1}
														colSpan={1}
														align="center"
														style={{
															borderWidth: border,
															borderColor: 'black',
															padding: constPading,
															width: '50px',
														}}
													>
														<img src={`${baseUrl}${fila.imagen}`} alt="img" />
														{/* <img
															src="https://1.bp.blogspot.com/-EwBdqMTDfHM/Xgt01qJoNII/AAAAAAAATF8/wEUW_OoDx4QbL-MBsPpiBS3y3LU6CJeDgCLcBGAsYHQ/s1600/Blusa-camisera-de-mezclilla.jpg"
															alt="img"
														/> */}
													</TableCell>
												</TableRow>
												{fila.detalles.map(row => (
													<TableRow>
														<TableCell
															rowSpan={1}
															colSpan={1}
															align="center"
															style={{
																borderWidth: border,
																borderColor: 'black',
																padding: constPading,
																width: '50px',
															}}
														>
															{fila.prenda}
														</TableCell>
														<TableCell
															rowSpan={1}
															colSpan={1}
															align="center"
															style={{
																borderWidth: border,
																borderColor: 'black',
																padding: constPading,
																width: '50px',
															}}
														>
															{row.color}
														</TableCell>
														{row.cantidades.map(qty => (
															<TableCell
																rowSpan={1}
																colSpan={1}
																align="center"
																style={{
																	borderWidth: border,
																	borderColor: 'black',
																	padding: constPading,
																	width: '50px',
																}}
															>
																{qty}
															</TableCell>
														))}
														<TableCell
															rowSpan={1}
															colSpan={1}
															align="center"
															style={{
																borderWidth: border,
																borderColor: 'black',
																padding: constPading,
																width: '50px',
															}}
														>
															{row.total}
														</TableCell>
														<TableCell
															rowSpan={1}
															colSpan={1}
															align="center"
															style={{
																borderWidth: border,
																borderColor: 'black',
																padding: constPading,
																width: '50px',
															}}
														>
															{fila.consumo} gr
														</TableCell>
													</TableRow>
												))}
											</>
										))}
									</TableBody>
								</Table>
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
						<Button variant="contained" color="secondary" onClick={() => setVisible(false)}>
							Cerrar
						</Button>
					</div>
				</Box>
			</Fade>
		</Modal>
	);
};

export default ModalPedidos;

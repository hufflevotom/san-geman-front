/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-syntax */
import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';
import FuseLoading from '@fuse/core/FuseLoading';
import httpClient, { baseUrl } from 'utils/Api';
import { utils, writeFile } from 'xlsx';
import obtenerColorCliente from 'utils/obtenerColorCliente';

const {
	Modal,
	Fade,
	Backdrop,
	Typography,
	TableRow,
	TableCell,
	Table,
	TableBody,
	Button,
	TableHead,
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
		@page { size: landscape; }

		.pagebreak {
			page-break-before: always;
		}
	}
`;

const ModalProducciones = ({ visible, data, setVisible }) => {
	const impresionRef = useRef();
	const [produccion, setProduccion] = useState();

	const [loading, setLoading] = useState(false);
	const [diferentesLav, setDiferentesLav] = useState(false);
	const [diferentesTC, setDiferentesTC] = useState(false);
	const [tallas, setTallas] = useState([]);
	const [lavanderia, setLavanderia] = useState([]);
	const [telasComplementoProduccion, setTelasComplementoProduccion] = useState([]);
	const [telasProduccion, setTelasProduccion] = useState([]);
	const [rutaProduccion, setRutaProduccion] = useState([]);
	const [referenciales, setReferenciales] = useState([]);
	const [estampados, setEstampados] = useState([]);
	const [bordados, setBordados] = useState([]);
	const [porcentaje, setPorcentaje] = useState(100);
	const [tabla, setTabla] = useState([]);
	const [totales, setTotales] = useState([]);
	const [totalesPorcentaje, setTotalesPorcentaje] = useState([]);

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

	const obtenerConsumoTotal = (telaEstilo, item) => {
		if (!telaEstilo) return null;
		const { consumo, unidadMedida } = telaEstilo;

		if (!consumo) return null;

		let total = consumo;
		let unidad = unidadMedida?.prefijo || '-';
		let colores = telaEstilo.colores.map(color => color.id);
		if (!unidadMedida || unidadMedida?.id === 4) {
			total = consumo / 1000;
			unidad = 'KG';
		}

		if (telaEstilo?.tipo === 'P') {
			const coloresId = telaEstilo.colores;
			const cantidad = item.totalCantidades.reduce(
				(acc, curr) =>
					acc +
					(telaEstilo.idEstilo === curr.estilo.id &&
					coloresId.map(color => color.id).includes(curr.color.id)
						? parseFloat(curr.totalCantidadPorcentaje)
						: 0),
				0
			);
			total *= cantidad;
			colores = coloresId.map(color => color.descripcion);
		} else {
			const coloresRelacionadosId = JSON.parse(telaEstilo.coloresRelacionados || '[]');
			if (coloresRelacionadosId.length > 0) {
				const cantidad = item.totalCantidades.reduce(
					(acc, curr) =>
						acc +
						(telaEstilo.idEstilo === curr.estilo.id &&
						coloresRelacionadosId.map(color => color.id).includes(curr.color.id)
							? parseFloat(curr.totalCantidadPorcentaje)
							: 0),
					0
				);
				total *= cantidad;
				colores = coloresRelacionadosId.map(color => color.descripcion);
			} else {
				const cantidad = item.totalCantidades.reduce(
					(acc, curr) =>
						acc +
						(telaEstilo.idEstilo === curr.estilo.id ? parseFloat(curr.totalCantidadPorcentaje) : 0),
					0
				);
				total *= cantidad;
				colores = telaEstilo.colores.map(color => color.descripcion);
			}
		}

		const coloresConTallas = [];
		item.totalCantidades.forEach(cantidad => {
			if (colores.includes(cantidad.color.descripcion)) {
				coloresConTallas.push(cantidad.color.descripcion);
			}
		});

		return `) - (TOTAL: ${total.toFixed(3)} ${unidad} ${coloresConTallas.join(', ')}`;
	};

	const transformarData = dataInicial => {
		if (!dataInicial) return;

		let newTallas = [];
		const newReferenciales = [];
		const newEstampados = [];
		const newBordados = [];
		const newRutaProduccion = [];
		const newTelasProduccion = [];
		const newTelasComplementoProduccion = [];
		const newLavanderia = [];
		dataInicial.pedidos[0]?.estilos?.forEach(item => {
			item.estampados.forEach(est => {
				if (newEstampados.indexOf(est.tipo) === -1) {
					newEstampados.push(est.tipo);
				}
			});
			item.bordados.forEach(bor => {
				if (newBordados.indexOf(bor.tipo) === -1) {
					newBordados.push(bor.tipo);
				}
			});
			let stringRuta = '';
			item.rutasEstilos
				.sort((a, b) => a.orden - b.orden)
				.forEach((actualRuta, i) => {
					stringRuta +=
						i === 0 ? `${actualRuta.ruta.descripcion}` : ` - ${actualRuta.ruta.descripcion}`;
				});
			if (newRutaProduccion.findIndex(e => e.ruta === stringRuta) === -1) {
				newRutaProduccion.push({ ruta: stringRuta, estilo: item.estilo });
			} else {
				newRutaProduccion[
					newRutaProduccion.findIndex(e => e.ruta === stringRuta)
				].estilo += `, ${item.estilo}`;
			}

			const telaFound = item.telasEstilos.find(tela => tela.tipo === 'P');
			if (telaFound) {
				const telaString = `${telaFound.tela?.nombre} (CONSUMO: ${telaFound.consumo || 0} ${
					telaFound.unidadMedida?.prefijo || 'gr'
				}${obtenerConsumoTotal({ ...telaFound, idEstilo: item.id }, dataInicial.pedidos[0])})`;
				if (newTelasProduccion.findIndex(e => e.tela === telaString) === -1) {
					newTelasProduccion.push({ tela: telaString, estilo: item.estilo });
				} else {
					newTelasProduccion[
						newTelasProduccion.findIndex(e => e.tela === telaString)
					].estilo += `, ${item.estilo}`;
				}
			}
			const telaComplementoFound = item.telasEstilos.filter(tela => tela.tipo !== 'P');
			if (telaComplementoFound.length > 0) {
				telaComplementoFound.forEach(telaComplemento => {
					const telaString = `${telaComplemento.tela?.nombre} (CONSUMO: ${
						telaComplemento.consumo || 0
					} ${telaComplemento.unidadMedida?.prefijo || 'gr'}${obtenerConsumoTotal(
						{ ...telaComplemento, idEstilo: item.id },
						dataInicial.pedidos[0]
					)})`;
					if (newTelasComplementoProduccion.findIndex(e => e.tela === telaString) === -1) {
						newTelasComplementoProduccion.push({ tela: telaString, estilo: item.estilo });
					} else {
						newTelasComplementoProduccion[
							newTelasComplementoProduccion.findIndex(e => e.tela === telaString)
						].estilo += `, ${item.estilo}`;
					}
				});
			} else if (newTelasComplementoProduccion.findIndex(e => e.tela === 'N/A') === -1) {
				newTelasComplementoProduccion.push({ tela: 'N/A', estilo: item.estilo });
			} else {
				newTelasComplementoProduccion[
					newTelasComplementoProduccion.findIndex(e => e.tela === 'N/A')
				].estilo += `, ${item.estilo}`;
			}

			const arrLavanderias = item.lavados;
			(arrLavanderias || []).forEach(lav => {
				if (newLavanderia.findIndex(e => e.reg === lav.descripcion.trim().toUpperCase()) === -1) {
					newLavanderia.push({
						lavanderia: `${lav.descripcion} (${lav.unidadProceso || '-'})`,
						estilo: item.estilo,
						reg: lav.descripcion.trim().toUpperCase(),
					});
				} else {
					newLavanderia[
						newLavanderia.findIndex(e => e.reg === lav.descripcion.trim().toUpperCase())
					].estilo += `, ${item.estilo}`;
				}
			});
			if (item.lavados === null || arrLavanderias.length === 0) {
				if (newLavanderia.findIndex(e => e.reg === 'N/A') === -1) {
					newLavanderia.push({
						lavanderia: 'N/A',
						estilo: item.estilo,
						reg: 'N/A',
					});
				} else {
					newLavanderia[
						newLavanderia.findIndex(e => e.lavanderia === 'N/A')
					].estilo += `, ${item.estilo}`;
				}
			}
		});

		const tablaNueva = dataInicial.pedidos[0]?.estilos.map(item => {
			if (item.imagenesOpcionales?.length > 0) {
				newReferenciales.push('IMAGENES REFERENCIALES');
			}
			return {
				id: item.id,
				estilo: item.estilo,
				nombreEstilo: item.nombre,
				imagen: item.imagenEstiloUrl,
				tela: item.telasEstilos.find(tela => tela.tipo === 'P').tela.nombre,
				prenda: item.prenda.nombre,
				consumo: item.telasEstilos.find(tela => tela.tipo === 'P').consumo,
				referenciales: item.imagenesOpcionales,
				estampados: item.estampados,
				bordados: item.bordados,
			};
		});

		const cantidades = dataInicial.pedidos[0]?.cantidades.sort((a, b) => a.orden - b.orden) || [];
		const cantidadesPorcentaje =
			dataInicial.pedidos[0]?.cantidadesPorcentaje.sort((a, b) => a.orden - b.orden) || [];
		const newPorcentaje =
			(cantidadesPorcentaje ? cantidadesPorcentaje[0]?.porcentaje || 0 : 0) + 100;

		const newCantidadesTallas = [];
		(cantidadesPorcentaje || []).forEach(item => {
			if (newCantidadesTallas.findIndex(e => e.estilo === item.estilo.id) === -1) {
				newCantidadesTallas.push({ estilo: item.estilo.id, tallas: [item.talla.prefijo] });
			} else {
				newCantidadesTallas[
					newCantidadesTallas.findIndex(e => e.estilo === item.estilo.id)
				].tallas.push(item.talla.prefijo);
			}
		});

		//* Ordenar tallas
		if (dataInicial.pedidos[0]?.ordenTallas?.length > 0) {
			const arrDeArrTallas = [];
			dataInicial.pedidos[0]?.ordenTallas
				.sort((a, b) => a.orden - b.orden)
				.forEach(item => {
					arrDeArrTallas.push(item.talla);
				});

			newTallas = arrDeArrTallas.map(talla => talla.prefijo);
		} else {
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

			//* Eliminar tallas repetidas
			newTallas = [...new Set(newTallas)];
		}

		//* Agrupar las cantidades por estilos
		const cantidadesPorEstilos = {};
		(cantidades || []).forEach(item => {
			if (!cantidadesPorEstilos[item.estilo.id]) {
				cantidadesPorEstilos[item.estilo.id] = [];
			}
			cantidadesPorEstilos[item.estilo.id].push(item);
		});
		const cantidadesPorcentajePorEstilos = {};
		(cantidadesPorcentaje || []).forEach(item => {
			if (!cantidadesPorcentajePorEstilos[item.estilo.id]) {
				cantidadesPorcentajePorEstilos[item.estilo.id] = [];
			}
			cantidadesPorcentajePorEstilos[item.estilo.id].push(item);
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
		// agrupar las cantidades por colores
		// eslint-disable-next-line no-restricted-syntax
		for (const key in cantidadesPorcentajePorEstilos) {
			if (Object.hasOwnProperty.call(cantidadesPorcentajePorEstilos, key)) {
				const element = cantidadesPorcentajePorEstilos[key];
				const cantidadesPorColores = {};
				element.forEach(item => {
					if (!cantidadesPorColores[item.color.id]) {
						cantidadesPorColores[item.color.id] = [];
					}
					cantidadesPorColores[item.color.id].push(item);
				});
				cantidadesPorcentajePorEstilos[key] = cantidadesPorColores;
			}
		}

		// ordenar cantidad de items en el array de mayor a menor
		// eslint-disable-next-line no-restricted-syntax
		for (const key in cantidadesPorEstilos) {
			if (Object.hasOwnProperty.call(cantidadesPorEstilos, key)) {
				const element = cantidadesPorEstilos[key];
				// eslint-disable-next-line no-restricted-syntax
				for (const key2 in element) {
					if (Object.hasOwnProperty.call(element, key2)) {
						const element2 = element[key2];
						element2.sort((a, b) => b.cantidad - a.cantidad);
					}
				}
			}
		}
		// ordenar cantidad de items en el array de mayor a menor
		// eslint-disable-next-line no-restricted-syntax
		for (const key in cantidadesPorcentajePorEstilos) {
			if (Object.hasOwnProperty.call(cantidadesPorcentajePorEstilos, key)) {
				const element = cantidadesPorcentajePorEstilos[key];
				// eslint-disable-next-line no-restricted-syntax
				for (const key2 in element) {
					if (Object.hasOwnProperty.call(element, key2)) {
						const element2 = element[key2];
						element2.sort((a, b) => b.cantidad - a.cantidad);
					}
				}
			}
		}

		(tablaNueva || []).forEach(item => {
			// eslint-disable-next-line no-restricted-syntax
			for (const key in cantidadesPorcentajePorEstilos) {
				if (Object.hasOwnProperty.call(cantidadesPorcentajePorEstilos, key)) {
					const element = cantidadesPorcentajePorEstilos[key];
					if (item.id.toString() === key) {
						item.detalles = [];
						// eslint-disable-next-line no-restricted-syntax
						for (const key2 in element) {
							if (Object.hasOwnProperty.call(element, key2)) {
								const element2 = element[key2];
								const det = {
									color: element2[0].color.descripcion,
									colorCliente: obtenerColorCliente(
										element2[0].color,
										dataInicial.coloresCliente,
										element2[0].estilo
									),
									id: element2[0].color.id,
									total: element2.reduce((acc, cur) => acc + cur.cantidad, 0),
								};

								const cant = [];
								const ref = [];
								const est = [];
								const bor = [];

								newTallas.forEach(talla => {
									const cantTalla = element2.find(x => x.talla.prefijo === talla);
									if (cantTalla) {
										cant.push(cantTalla.cantidad);
									} else {
										cant.push(0);
									}
								});

								if (item.referenciales || newReferenciales.length > 0) {
									const imgFound =
										item.referenciales.find(x => x.colorId === element2[0].color.id) || false;
									if (imgFound) {
										ref.push(imgFound.urlImagen);
									} else {
										ref.push(null);
									}
								}

								newEstampados.forEach(itemz => {
									const elementFound =
										item.estampados.find(
											x =>
												x.tipo === itemz && (x.color ? x.color.id === element2[0].color.id : true)
										) || false;
									if (elementFound) {
										est.push(elementFound.urlImagen);
									} else {
										est.push(null);
									}
								});

								newBordados.forEach(itemz => {
									const elementFound =
										item.bordados.find(
											x =>
												x.tipo === itemz && (x.color ? x.color.id === element2[0].color.id : true)
										) || false;
									if (elementFound) {
										bor.push(elementFound.urlImagen);
									} else {
										bor.push(null);
									}
								});

								det.cantidades = cant;
								det.estampados = newEstampados.length > 0 ? est : [];
								det.referenciales = newReferenciales.length > 0 ? ref : [];
								det.bordados = newBordados.length > 0 ? bor : [];
								item.detalles.push(det);
							}
						}
					}
				}
			}
		});
		const tablacantidades100 = tablaNueva;
		(tablacantidades100 || []).forEach(item => {
			for (const key in cantidadesPorEstilos) {
				if (Object.hasOwnProperty.call(cantidadesPorEstilos, key)) {
					const element = cantidadesPorEstilos[key];
					if (item.id.toString() === key) {
						// eslint-disable-next-line no-restricted-syntax
						for (const key2 in element) {
							if (Object.hasOwnProperty.call(element, key2)) {
								const element2 = element[key2];
								item.detalles.forEach(det => {
									if (det.id === element2[0].color.id) {
										det.total100 = element2.reduce((acc, cur) => acc + cur.cantidad, 0);
										const cant100 = [];

										newTallas.forEach(talla => {
											const cantTalla = element2.find(x => x.talla.prefijo === talla);
											if (cantTalla) {
												cant100.push(cantTalla.cantidad);
											} else {
												cant100.push(0);
											}
										});

										det.cantidades100 = cant100;
									}
								});
							}
						}
					}
				}
			}
		});

		let diferentesTelaComplemento = false;
		let estiloAnterior = null;
		for (const itemTela of newTelasComplementoProduccion) {
			if (estiloAnterior === null) {
				estiloAnterior = itemTela.estilo;
			} else if (estiloAnterior !== itemTela.estilo) {
				diferentesTelaComplemento = true;
				break;
			}
		}

		let diferentesLavanderia = false;
		let estiloPasado = null;
		for (const itemTela of newLavanderia) {
			if (estiloPasado === null) {
				estiloPasado = itemTela.estilo;
			} else if (estiloPasado !== itemTela.estilo) {
				diferentesLavanderia = true;
				break;
			}
		}

		const totalesArr = [];
		const totalesPorcentajeArr = [];

		newTallas.forEach((t, i) => {
			let total = 0;
			let totalPorcentaje = 0;
			tablacantidades100.forEach(c => {
				c.detalles.forEach(d => {
					total += d.cantidades100[i];
					totalPorcentaje += d.cantidades[i];
				});
			});
			totalesArr.push(total);
			totalesPorcentajeArr.push(totalPorcentaje);
		});

		setDiferentesLav(diferentesLavanderia);
		setDiferentesTC(diferentesTelaComplemento);
		setLavanderia(newLavanderia);
		setTelasComplementoProduccion(newTelasComplementoProduccion);
		setTelasProduccion(newTelasProduccion);
		setRutaProduccion(newRutaProduccion);
		setTallas(newTallas);
		setReferenciales(newReferenciales);
		setEstampados(newEstampados);
		setBordados(newBordados);
		setPorcentaje(newPorcentaje);
		setTabla(tablacantidades100);

		setTotales(totalesArr);
		setTotalesPorcentaje(totalesPorcentajeArr);
		setLoading(false);
	};

	const descargarImpresion = async () => {
		handlePrint();
	};

	const getBase64FromUrl = async url => {
		const dt = await fetch(url);
		const blob = await dt.blob();
		return new Promise(resolve => {
			const reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = () => {
				const base64data = reader.result;
				resolve(base64data);
			};
		});
	};

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
	console.log(tabla);
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
									{produccion?.pedidos[0]?.po || '-'}
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
							<div>
								<Table
									style={{
										borderWidth: border,
										borderColor: 'black',
									}}
									id="tabla-exportable"
								>
									<TableHead>
										<TableRow>
											<TableCell
												style={{
													borderWidth: border,
													borderColor: 'black',
													padding: constPading,
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
													width: '100px',
												}}
												rowSpan={2}
												align="center"
											>
												TIPO DE PRENDA
											</TableCell>
											{referenciales.length > 0 ? (
												<TableCell
													style={{
														borderWidth: border,
														borderColor: 'black',
														padding: constPading,
														width: '150px',
													}}
													rowSpan={2}
													align="center"
												>
													IMAGENES REFERENCIALES
												</TableCell>
											) : null}
											{estampados.length > 0 ? (
												<TableCell
													style={{
														borderWidth: border,
														borderColor: 'black',
														padding: constPading,
														width: '150px',
													}}
													colSpan={estampados.length}
													align="center"
												>
													ESTAMPADOS
												</TableCell>
											) : null}
											{bordados.length > 0 ? (
												<TableCell
													style={{
														borderWidth: border,
														borderColor: 'black',
														padding: constPading,
														width: '150px',
													}}
													colSpan={bordados.length}
													align="center"
												>
													BORDADOS
												</TableCell>
											) : null}
											<TableCell
												rowSpan={2}
												align="center"
												style={{
													borderWidth: border,
													borderColor: 'black',
													padding: constPading,
													width: '80px',
												}}
											>
												COLOR DE TELA
											</TableCell>
											<TableCell
												rowSpan={2}
												align="center"
												style={{
													borderWidth: border,
													borderColor: 'black',
													padding: constPading,
													width: '80px',
												}}
											>
												COLOR CLIENTE
											</TableCell>
											<TableCell
												colSpan={tallas.length + 1}
												align="center"
												style={{
													borderWidth: border,
													borderColor: 'black',
													padding: constPading,
													width: '350px',
												}}
											>
												CANTIDAD AL 100%
											</TableCell>
											<TableCell
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
										</TableRow>
										<TableRow>
											{estampados.map((estampado, index) => (
												<TableCell
													align="center"
													style={{
														borderWidth: border,
														borderColor: 'black',
														padding: constPading,
														width: '50px',
														textTransform: 'uppercase',
													}}
												>
													{estampado}
												</TableCell>
											))}
											{bordados.map((bordado, index) => (
												<TableCell
													align="center"
													style={{
														borderWidth: border,
														borderColor: 'black',
														padding: constPading,
														width: '50px',
														textTransform: 'uppercase',
													}}
												>
													{bordado}
												</TableCell>
											))}
											{tallas.map((talla, index) => (
												<TableCell
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
											{tallas.map((talla, index) => (
												<TableCell
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
										{(tabla || []).map(fila => {
											return (
												<>
													<TableRow>
														<TableCell
															rowSpan={fila.detalles.length}
															align="center"
															style={{
																borderWidth: border,
																borderColor: 'black',
																padding: constPading,
																width: '30px',
															}}
														>
															{fila.estilo}
														</TableCell>
														<TableCell
															rowSpan={fila.detalles.length}
															align="center"
															style={{
																borderWidth: border,
																borderColor: 'black',
																padding: constPading,
																width: '50px',
															}}
														>
															{fila.nombreEstilo}
														</TableCell>
														<TableCell
															align="center"
															style={{
																borderWidth: border,
																borderColor: 'black',
																padding: constPading,
																width: '30px',
															}}
														>
															{fila.prenda}
														</TableCell>
														{fila.detalles[0]?.referenciales.map(qty => (
															<TableCell
																align="center"
																style={{
																	borderWidth: border,
																	borderColor: 'black',
																	padding: constPading,
																	width: '50px',
																}}
															>
																{qty === null ? (
																	'-'
																) : (
																	<>
																		<p className="imgUrl">{`${baseUrl}${qty}`}</p>
																		{qty ? (
																			<img src={`${baseUrl}${qty}`} alt={`${qty}referenciales`} />
																		) : null}
																	</>
																)}
															</TableCell>
														))}
														{fila.detalles[0]?.estampados.map(qty => (
															<TableCell
																align="center"
																style={{
																	borderWidth: border,
																	borderColor: 'black',
																	padding: constPading,
																	width: '50px',
																}}
															>
																{qty === null ? (
																	'-'
																) : (
																	<>
																		<p className="imgUrl">{`${baseUrl}${qty}`}</p>
																		{qty ? (
																			<img src={`${baseUrl}${qty}`} alt={`${qty}estampados`} />
																		) : null}
																	</>
																)}
															</TableCell>
														))}
														{fila.detalles[0]?.bordados.map(qty => (
															<TableCell
																align="center"
																style={{
																	borderWidth: border,
																	borderColor: 'black',
																	padding: constPading,
																	width: '50px',
																}}
															>
																{qty === null ? (
																	'-'
																) : (
																	<>
																		<p className="imgUrl">{`${baseUrl}${qty}`}</p>
																		{qty ? (
																			<img src={`${baseUrl}${qty}`} alt={`${qty}bordados`} />
																		) : null}
																	</>
																)}
															</TableCell>
														))}
														<TableCell
															align="center"
															style={{
																borderWidth: border,
																borderColor: 'black',
																padding: constPading,
																width: '50px',
															}}
														>
															{fila.detalles[0]?.color}
														</TableCell>
														<TableCell
															align="center"
															style={{
																borderWidth: border,
																borderColor: 'black',
																padding: constPading,
																width: '50px',
															}}
														>
															{fila.detalles[0]?.colorCliente}
														</TableCell>
														{fila.detalles[0]?.cantidades100.map(qty => (
															<TableCell
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
															align="center"
															style={{
																borderWidth: border,
																borderColor: 'black',
																padding: constPading,
																width: '50px',
															}}
														>
															{fila.detalles[0]?.total100}
														</TableCell>
														{fila.detalles[0]?.cantidades.map(qty => (
															<TableCell
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
															align="center"
															style={{
																borderWidth: border,
																borderColor: 'black',
																padding: constPading,
																width: '50px',
															}}
														>
															{fila.detalles[0]?.total}
														</TableCell>
													</TableRow>
													{fila.detalles
														.filter((fd, i) => i > 0)
														.map(row => (
															<TableRow>
																<TableCell
																	align="center"
																	style={{
																		borderWidth: border,
																		borderColor: 'black',
																		padding: constPading,
																		width: '30px',
																	}}
																>
																	{fila.prenda}
																</TableCell>
																{row.referenciales.map(qty => (
																	<TableCell
																		align="center"
																		style={{
																			borderWidth: border,
																			borderColor: 'black',
																			padding: constPading,
																			width: '50px',
																		}}
																	>
																		{qty === null ? (
																			'-'
																		) : (
																			<>
																				<p className="imgUrl">{`${baseUrl}${qty}`}</p>
																				{qty ? (
																					<img
																						src={`${baseUrl}${qty}`}
																						alt={`${qty}referenciales`}
																					/>
																				) : null}
																			</>
																		)}
																	</TableCell>
																))}
																{row.estampados.map(qty => (
																	<TableCell
																		align="center"
																		style={{
																			borderWidth: border,
																			borderColor: 'black',
																			padding: constPading,
																			width: '50px',
																		}}
																	>
																		{qty === null ? (
																			'-'
																		) : (
																			<>
																				<p className="imgUrl">{`${baseUrl}${qty}`}</p>
																				{qty ? (
																					<img src={`${baseUrl}${qty}`} alt={`${qty}estampados`} />
																				) : null}
																			</>
																		)}
																	</TableCell>
																))}
																{row.bordados.map(qty => (
																	<TableCell
																		align="center"
																		style={{
																			borderWidth: border,
																			borderColor: 'black',
																			padding: constPading,
																			width: '50px',
																		}}
																	>
																		{qty === null ? (
																			'-'
																		) : (
																			<>
																				<p className="imgUrl">{`${baseUrl}${qty}`}</p>
																				{qty ? (
																					<img src={`${baseUrl}${qty}`} alt={`${qty}bordados`} />
																				) : null}
																			</>
																		)}
																	</TableCell>
																))}
																<TableCell
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
																<TableCell
																	align="center"
																	style={{
																		borderWidth: border,
																		borderColor: 'black',
																		padding: constPading,
																		width: '50px',
																	}}
																>
																	{row.colorCliente}
																</TableCell>
																{row.cantidades100.map(qty => (
																	<TableCell
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
																	align="center"
																	style={{
																		borderWidth: border,
																		borderColor: 'black',
																		padding: constPading,
																		width: '50px',
																	}}
																>
																	{row.total100}
																</TableCell>
																{row.cantidades.map(qty => (
																	<TableCell
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
															</TableRow>
														))}
												</>
											);
										})}

										<TableRow>
											<TableCell
												colSpan={
													5 +
													(referenciales.length > 0 ? 1 : 0) +
													estampados.length +
													bordados.length
												}
												align="right"
												style={{
													borderWidth: border,
													borderColor: 'black',
													padding: constPading,
													color: 'black',
												}}
											>
												Totales
											</TableCell>

											{totales.map(t => (
												<TableCell
													align="center"
													style={{
														borderWidth: border,
														borderColor: 'black',
														padding: constPading,
														color: 'black',
													}}
												>
													{t}
												</TableCell>
											))}
											<TableCell
												align="center"
												style={{
													borderWidth: border,
													borderColor: 'black',
													padding: constPading,
													color: 'black',
												}}
											>
												{totales?.reduce((a, b) => a + b, 0)}
											</TableCell>
											{totalesPorcentaje.map(t => (
												<TableCell
													align="center"
													style={{
														borderWidth: border,
														borderColor: 'black',
														padding: constPading,
														color: 'black',
													}}
												>
													{t}
												</TableCell>
											))}
											<TableCell
												align="center"
												style={{
													borderWidth: border,
													borderColor: 'black',
													padding: constPading,
													color: 'black',
												}}
											>
												{totalesPorcentaje?.reduce((a, b) => a + b, 0)}
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell
												colSpan={
													referenciales.length +
													estampados.length +
													bordados.length +
													tallas.length +
													tallas.length +
													7
												}
												align="left"
												style={{
													borderWidth: border,
													borderColor: 'black',
													padding: constPading,
													color: 'black',
												}}
											>
												Ruta{rutaProduccion.length > 1 ? 's: ' : ': '}
												{rutaProduccion.map((item, i) => (
													<p>
														{item.ruta} {rutaProduccion.length > 1 ? ` (${item.estilo})` : ''}
													</p>
												))}
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell
												colSpan={
													referenciales.length +
													estampados.length +
													bordados.length +
													tallas.length +
													tallas.length +
													7
												}
												align="left"
												style={{
													borderWidth: border,
													borderColor: 'black',
													padding: constPading,
													color: 'black',
												}}
											>
												Tela{telasProduccion.length > 1 ? 's principales: ' : ' principal: '}
												{telasProduccion.map((item, i) => (
													<p>
														{item.tela} {telasProduccion.length > 1 ? ` (${item.estilo})` : ''}
													</p>
												))}
											</TableCell>
										</TableRow>
										{telasComplementoProduccion.filter(e => e.tela !== 'N/A').length > 0 ? (
											<TableRow>
												<TableCell
													colSpan={
														referenciales.length +
														estampados.length +
														bordados.length +
														tallas.length +
														tallas.length +
														7
													}
													align="left"
													style={{
														borderWidth: border,
														borderColor: 'black',
														padding: constPading,
														color: 'black',
													}}
												>
													Tela
													{telasComplementoProduccion.length > 1
														? 's complementos: '
														: ' complemento: '}
													{telasComplementoProduccion
														.filter(e => e.tela !== 'N/A')
														.map((item, i) => (
															<p>
																{item.tela} {diferentesTC ? ` (${item.estilo})` : ''}
															</p>
														))}
												</TableCell>
											</TableRow>
										) : null}
										{lavanderia.filter(e => e.reg !== 'N/A').length > 0 ? (
											<TableRow>
												<TableCell
													colSpan={
														referenciales.length +
														estampados.length +
														bordados.length +
														tallas.length +
														tallas.length +
														7
													}
													align="left"
													style={{
														borderWidth: border,
														borderColor: 'black',
														padding: constPading,
														color: 'black',
													}}
												>
													Lavanderia{lavanderia.length > 1 ? 's: ' : ': '}
													{lavanderia
														.filter(e => e.reg !== 'N/A')
														.map((item, i) => (
															<p>
																{item.lavanderia} {diferentesLav ? ` (${item.estilo})` : ''}
															</p>
														))}
												</TableCell>
											</TableRow>
										) : null}
										{data.observaciones ? (
											<TableRow>
												<TableCell
													colSpan={
														referenciales.length +
														estampados.length +
														bordados.length +
														tallas.length +
														tallas.length +
														7
													}
													align="left"
													style={{
														borderWidth: border,
														borderColor: 'black',
														padding: constPading,
														color: 'black',
													}}
												>
													Observacion: <p>{data.observaciones || ''}</p>
												</TableCell>
											</TableRow>
										) : null}
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
							<Button variant="contained" color="primary" onClick={descargarImpresion}>
								Descargar
							</Button>
						)}
						{!loading && data.codigo && (
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

export default ModalProducciones;

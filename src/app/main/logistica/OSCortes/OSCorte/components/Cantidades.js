/* eslint-disable no-lonely-if */
/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable spaced-comment */
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import FuseUtils from '@fuse/utils';
import Costos from './Costos';

const Cantidades = ({
	indexCantidad,
	orden,
	produccion,
	telas,
	estilos,
	color,
	cantidades,
	cantidadesData,
	setCantidadesData,
	currentTipoServicio,
	disabled,
}) => {
	const [dataTable, setDataTable] = useState([]);

	const toDataTable = pro => {
		const data = [];
		Array.from(Array(estilos.length).keys()).forEach((e, i) => {
			data.push([
				{
					estilo: 'Estilo',
					color: 'Color',
					tela: 'Tela',
					cantidadesTotales: [],
					cantidadesCorte: [],
				},
			]);
		});

		estilos.forEach((estilo, index) => {
			const telasArray = [];
			const tallasArray = [];

			let nombreTelas = '';
			telas.forEach(tela => {
				estilo.telasEstilos.forEach(telaEstilo => {
					if (telaEstilo.tela.id === tela.tela.id) {
						if (telas.length > 1) {
							nombreTelas += `${tela.label ? tela.label : tela.tela.nombre} -/- `;
						} else if (telas.length === 1) {
							nombreTelas = telas[0].label ? telas[0].label : telas[0].tela.nombre;
						}
						telasArray.push(tela);
					}
				});
			});

			const cantidadesPorTalla = [];
			estilo.registroEstilos?.forEach(registroEstilo => {
				registroEstilo.detalleRegistroEstilo.forEach(detalleRegistroEstilo => {
					if (
						data[index][0].cantidadesTotales.findIndex(
							c => c.id === detalleRegistroEstilo.talla.id
						) === -1
					) {
						if (detalleRegistroEstilo.porcentaje !== null) {
							data[index][0].cantidadesTotales.push({
								id: detalleRegistroEstilo.talla.id,
								talla: detalleRegistroEstilo.talla.talla,
							});
							data[index][0].cantidadesCorte.push({
								id: detalleRegistroEstilo.talla.id,
								talla: detalleRegistroEstilo.talla.talla,
							});
							tallasArray.push({
								id: detalleRegistroEstilo.talla.id,
								talla: detalleRegistroEstilo.talla.talla,
							});
							cantidadesPorTalla.push(detalleRegistroEstilo.cantidad);
						}
					}
				});
			});

			let cantidadesTalla = [];
			let costo = 0;
			let igv = 0;
			let subTotal = 0;
			if (cantidades.length > 0) {
				const dd = cantidades.find(e => e.estilo.id === estilo.id);
				tallasArray.forEach(e => {
					const cantPaño = dd.ordenCorteCantidadesPaños.find(x => x.talla.id === e.id);
					cantidadesTalla.push(
						typeof cantPaño.cantidad === 'number'
							? cantPaño.cantidad
							: parseFloat(cantPaño.cantidad)
					);
				});
				costo = dd.costo;
				igv = dd.igv;
				subTotal = dd.subTotal;
			} else {
				cantidadesTalla = cantidadesPorTalla.map(c => 0);
			}

			const registro = {
				estiloId: estilo.id,
				costo,
				igv,
				subTotal,
				ordenCortePañoCantidades: {
					estilo: estilo.estilo,
					color: color?.descripcion,
					tela: nombreTelas,
					cantidadesTotales: cantidadesPorTalla,
					cantidadesCorte: cantidadesTalla,
				},
			};

			data[index].push(registro);
		});

		setDataTable(data);
	};

	useEffect(() => {
		if (produccion) {
			toDataTable(produccion);
		}
	}, [produccion, telas, estilos, color, cantidades]);

	console.log(dataTable);

	return (
		<div style={{ width: '100%' }}>
			<span>Nº de Orden de Corte: {orden}</span>
			{dataTable &&
				dataTable.map((fila, k) => {
					return (
						fila.length > 1 && (
							<div
								style={{
									width: '100%',
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'start',
								}}
							>
								<div style={{ width: '70%', margin: '20px 20px 20px 0' }}>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell
													style={{
														border: '1px solid rgb(255 255 255)',
														borderBottomColor: 'rgb(224 224 224)',
														borderLeftColor: 'rgb(233 233 233)',
														borderRightColor: 'rgb(233 233 233)',
													}}
													rowSpan={3}
													colSpan={3}
													width={200}
													align="center"
												>
													ESTILO
												</TableCell>
												{/* <TableCell
												style={{
													// width: '600px',
													border: '1px solid rgb(255 255 255)',
													borderBottomColor: 'rgb(224 224 224)',
													borderLeftColor: 'rgb(233 233 233)',
													borderRightColor: 'rgb(233 233 233)',
												}}
												rowSpan={1}
												colSpan={fila[0].cantidadesTotales.length + 1}
												align="center"
											>
												CANTIDADES TOTALES
											</TableCell> */}
												<TableCell
													style={{
														// width: '600px',
														border: '1px solid rgb(255 255 255)',
														borderBottomColor: 'rgb(224 224 224)',
														borderLeftColor: 'rgb(233 233 233)',
														borderRightColor: 'rgb(233 233 233)',
													}}
													rowSpan={1}
													colSpan={fila[0].cantidadesTotales.length + 1}
													align="center"
												>
													CANTIDADES A CORTAR
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{fila.map((row, index) => {
												// let total = 0;
												let totalCorte = 0;

												return (
													<TableRow
														key={FuseUtils.generateGUID()}
														sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
													>
														<TableCell
															key={FuseUtils.generateGUID()}
															scope="row"
															align="center"
															style={{
																border: '1px solid rgb(255 255 255)',
																borderBottomColor: 'rgb(224 224 224)',
																borderRightColor: 'rgb(233 233 233)',
															}}
														>
															{index === 0 ? row.estilo : row.ordenCortePañoCantidades.estilo}
														</TableCell>
														<TableCell
															key={FuseUtils.generateGUID()}
															scope="row"
															align="center"
															style={{
																border: '1px solid rgb(255 255 255)',
																borderBottomColor: 'rgb(224 224 224)',
																borderRightColor: 'rgb(233 233 233)',
															}}
														>
															{index === 0 ? row.color : row.ordenCortePañoCantidades.color}
														</TableCell>
														<TableCell
															key={FuseUtils.generateGUID()}
															scope="row"
															align="center"
															style={{
																border: '1px solid rgb(255 255 255)',
																borderBottomColor: 'rgb(224 224 224)',
																borderRightColor: 'rgb(233 233 233)',
															}}
														>
															{index === 0 ? row.tela : row.ordenCortePañoCantidades.tela}
														</TableCell>

														{/* {Array.from(Array(fila[0].cantidadesTotales.length).keys())
														.map(j => {
															total +=
																index > 0 && row.ordenCortePañoCantidades.cantidadesTotales[j];

															return (
																<TableCell
																	align="center"
																	key={FuseUtils.generateGUID()}
																	style={{
																		width: '100px',
																		border: '1px solid rgb(255 255 255)',
																		borderBottomColor: 'rgb(224 224 224)',
																		borderLeftColor: 'rgb(233 233 233)',
																		borderRightColor: 'rgb(233 233 233)',
																	}}
																>
																	{index === 0
																		? row.cantidadesTotales[j].talla
																		: row.ordenCortePañoCantidades.cantidadesTotales[j]}
																</TableCell>
															);
														})
														.concat(
															<TableCell
																key={FuseUtils.generateGUID()}
																align="center"
																style={{
																	width: '100px',
																	border: '1px solid rgb(255 255 255)',
																	borderBottomColor: 'rgb(224 224 224)',
																	borderLeftColor: 'rgb(233 233 233)',
																	borderRightColor: 'rgb(233 233 233)',
																}}
															>
																{index === 0 ? 'Total' : total}
															</TableCell>
														)} */}
														{Array.from(Array(fila[0].cantidadesCorte.length).keys())
															.map(j => {
																let cantidadInicial;

																totalCorte +=
																	index > 0 && row.ordenCortePañoCantidades.cantidadesCorte[j];

																if (!totalCorte) {
																	totalCorte = 0;
																}

																return (
																	<TableCell
																		align="center"
																		key={FuseUtils.generateGUID()}
																		style={{
																			width: '100px',
																			border: '1px solid rgb(255 255 255)',
																			borderBottomColor: 'rgb(224 224 224)',
																			borderLeftColor: 'rgb(233 233 233)',
																			borderRightColor: 'rgb(233 233 233)',
																		}}
																	>
																		{index === 0
																			? row.cantidadesCorte[j].talla
																			: row.ordenCortePañoCantidades.cantidadesCorte[j]}
																	</TableCell>
																);
															})
															.concat(
																<TableCell
																	key={FuseUtils.generateGUID()}
																	align="center"
																	style={{
																		width: '100px',
																		border: '1px solid rgb(255 255 255)',
																		borderBottomColor: 'rgb(224 224 224)',
																		borderLeftColor: 'rgb(233 233 233)',
																		borderRightColor: 'rgb(233 233 233)',
																	}}
																>
																	{index === 0 ? 'Total' : totalCorte}
																</TableCell>
															)}
														{/* <TableCell
														key={FuseUtils.generateGUID()}
														scope="row"
														align="center"
														style={{
															border: '1px solid rgb(255 255 255)',
															borderBottomColor: 'rgb(224 224 224)',
															borderRightColor: 'rgb(233 233 233)',
														}}
													>
														{index === 0 ? 'Costo' : row.costo}
													</TableCell>
													<TableCell
														key={FuseUtils.generateGUID()}
														scope="row"
														align="center"
														style={{
															border: '1px solid rgb(255 255 255)',
															borderBottomColor: 'rgb(224 224 224)',
															borderRightColor: 'rgb(233 233 233)',
														}}
													>
														{index === 0 ? 'IGV' : row.igv}
													</TableCell> */}
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								</div>
								<div style={{ width: '30%' }}>
									<Costos
										index={k}
										cantidad={fila[1]}
										j={indexCantidad}
										data={cantidadesData}
										setData={setCantidadesData}
										currentTipoServicio={currentTipoServicio}
										disabled={disabled}
									/>
								</div>
							</div>
						)
					);
				})}
		</div>
	);
};

export default Cantidades;

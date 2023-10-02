import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import { useEffect, useState } from 'react';
import FuseUtils from '@fuse/utils';
import TableCabecera from '../../../pedidos/pedido/tabs/estilos/tablaCabecera';
import TextFieldValue from '../../../pedidos/pedido/tabs/estilos/textFieldValue';

const TablaPedido = ({
	opcionesTallas,
	estilo,
	getValues,
	valueDataEstilo,
	onChangeDataEstilo,
}) => {
	const [porcentaje, setPorcentaje] = useState(
		valueDataEstilo.cantidadesPorcentaje.length > 0
			? valueDataEstilo.cantidadesPorcentaje[0].porcentaje + 100
			: 100
	);
	console.log(valueDataEstilo);
	const cantidadEstilo = valueDataEstilo.cantidades.filter(
		cantidad => cantidad.estilo.id === estilo.id
	);

	const cantidadesPorcentajeEstilo = valueDataEstilo.cantidadesPorcentaje.filter(
		cantidad => cantidad.estilo.id === estilo.id
	);

	const coloresId = [];
	const agruparCantidadColor = {};

	cantidadEstilo.forEach(cantidad => {
		if (!coloresId.includes(cantidad.color.id)) {
			coloresId.push(cantidad.color.id);
			agruparCantidadColor[cantidad.color.id] = [cantidad];
		} else {
			agruparCantidadColor[cantidad.color.id].push(cantidad);
		}
	});

	const coloresIdPorcentaje = [];
	const agruparCantidadPorcentajeColor = {};

	cantidadesPorcentajeEstilo.forEach(cantidad => {
		if (!coloresIdPorcentaje.includes(cantidad.color.id)) {
			coloresIdPorcentaje.push(cantidad.color.id);
			agruparCantidadPorcentajeColor[cantidad.color.id] = [cantidad];
		} else {
			agruparCantidadPorcentajeColor[cantidad.color.id].push(cantidad);
		}
	});

	// eslint-disable-next-line no-restricted-syntax
	for (const key in agruparCantidadColor) {
		if (Object.hasOwnProperty.call(agruparCantidadColor, key)) {
			const element = agruparCantidadColor[key];
			element.sort((a, b) => a.orden - b.orden);
		}
	}

	// eslint-disable-next-line no-restricted-syntax
	for (const key in agruparCantidadPorcentajeColor) {
		if (Object.hasOwnProperty.call(agruparCantidadPorcentajeColor, key)) {
			const element = agruparCantidadPorcentajeColor[key];
			element.sort((a, b) => a.orden - b.orden);
		}
	}

	const [colSpan, setColSpan] = useState(
		agruparCantidadColor[coloresId[0]] ? agruparCantidadColor[coloresId[0]].length : 0
	);

	const agregarColumna = () => setColSpan(colSpan + 1);

	useEffect(() => {
		// eslint-disable-next-line no-unused-expressions
		if (cantidadesPorcentajeEstilo.length > 0) {
			setPorcentaje(cantidadesPorcentajeEstilo[0].porcentaje + 100);
		} else {
			setPorcentaje(parseInt(getValues().cliente.porcentajeError, 10) + 100);
		}
	}, [valueDataEstilo.cantidadesPorcentaje]);

	return (
		<TableContainer component={Paper} style={{ marginTop: 20 }}>
			<Table aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell
							style={{
								maxWidth: '160px',
							}}
							rowSpan={3}
							colSpan={1}
							width={200}
							align="center"
						>
							{estilo?.estilo ?? ''}
						</TableCell>
						<TableCell
							style={{
								width: '600px',
								border: '1px solid rgb(255 255 255)',
								borderBottomColor: 'rgb(224 224 224)',
								borderLeftColor: 'rgb(233 233 233)',
								borderRightColor: 'rgb(233 233 233)',
							}}
							rowSpan={1}
							colSpan={colSpan + 1}
							align="center"
						>
							CANTIDAD 100%
						</TableCell>
						<TableCell
							style={{
								width: '600px',
								border: '1px solid rgb(255 255 255)',
								borderBottomColor: 'rgb(224 224 224)',
								borderLeftColor: 'rgb(233 233 233)',
								borderRightColor: 'rgb(233 233 233)',
							}}
							rowSpan={1}
							colSpan={colSpan + 1}
							align="center"
						>
							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<div style={{ marginLeft: '10px' }}>CANTIDAD {porcentaje} %</div>
							</div>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell
							rowSpan={1}
							colSpan={colSpan + 1}
							align="center"
							style={{
								width: '600px',
								border: '1px solid rgb(255 255 255)',
								borderBottomColor: 'rgb(224 224 224)',
								borderLeftColor: 'rgb(233 233 233)',
								borderRightColor: 'rgb(233 233 233)',
							}}
						>
							TALLAS
						</TableCell>
						<TableCell
							rowSpan={1}
							colSpan={colSpan + 1}
							align="center"
							style={{
								width: '600px',
								border: '1px solid rgb(255 255 255)',
								borderBottomColor: 'rgb(224 224 224)',
								borderLeftColor: 'rgb(233 233 233)',
								borderRightColor: 'rgb(233 233 233)',
							}}
						>
							TALLAS
						</TableCell>
					</TableRow>

					<TableRow style={{ maxWidth: '600px' }}>
						{Array.from(Array(colSpan).keys())
							.map(i => {
								let vall;

								if (cantidadEstilo.filter(f => f.orden === i).length > 0) {
									// eslint-disable-next-line prefer-destructuring
									vall = cantidadEstilo.filter(f => f.orden === i)[0];
								} else {
									vall = null;
								}

								return (
									<TableCabecera
										disable
										key={i}
										opcionesTallas={opcionesTallas || []}
										vall={vall}
										onChangeDataEstilo={onChangeDataEstilo || (() => {})}
										valueDataEstilo={valueDataEstilo}
									/>
								);
							})
							.concat(
								<TableCell
									key="total"
									align="center"
									style={{
										width: '100px',
										border: '1px solid rgb(255 255 255)',
										borderBottomColor: 'rgb(224 224 224)',
										borderLeftColor: 'rgb(233 233 233)',
										borderRightColor: 'rgb(233 233 233)',
									}}
								>
									Total
								</TableCell>
							)}
						{Array.from(Array(colSpan).keys())
							.map(i => {
								let vall;

								if (cantidadEstilo.filter(f => f.orden === i).length > 0) {
									// eslint-disable-next-line prefer-destructuring
									vall = cantidadEstilo.filter(f => f.orden === i)[0];
								} else {
									vall = null;
								}

								return (
									<TableCabecera
										disable
										key={i}
										opcionesTallas={opcionesTallas || []}
										vall={vall}
										onChangeDataEstilo={onChangeDataEstilo || (() => {})}
										valueDataEstilo={valueDataEstilo}
									/>
								);
							})
							.concat(
								<TableCell
									key="total"
									align="center"
									style={{
										width: '100px',
										border: '1px solid rgb(255 255 255)',
										borderBottomColor: 'rgb(224 224 224)',
										borderLeftColor: 'rgb(233 233 233)',
										borderRightColor: 'rgb(233 233 233)',
									}}
								>
									Total
								</TableCell>
							)}
					</TableRow>
				</TableHead>
				<TableBody>
					{estilo.telasEstilos
						.filter(f => f.tipo === 'P')[0]
						.colores.map(color => {
							let total = 0;
							let totalPorcentaje = 0;

							return (
								<TableRow key={color.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
									<TableCell
										key={color.id}
										scope="row"
										align="center"
										style={{
											border: '1px solid rgb(255 255 255)',
											borderBottomColor: 'rgb(224 224 224)',
											borderRightColor: 'rgb(233 233 233)',
										}}
									>
										{color.codigo} - {color.descripcion}
									</TableCell>

									{Array.from(Array(colSpan).keys())
										.map(i => {
											let cantidadInicial;

											if (agruparCantidadColor[color.id] && agruparCantidadColor[color.id][i]) {
												cantidadInicial = agruparCantidadColor[color.id][i];
											} else {
												cantidadInicial = {
													id: FuseUtils.generateGUID(),
													cantidad: 0,
													orden: i,
													estilo,
													color,
												};
												valueDataEstilo.cantidades.push(cantidadInicial);
												// onChangeDataEstilo(valueDataEstilo);
											}

											total += cantidadInicial.cantidad;

											return (
												<TableCell
													align="center"
													key={i}
													style={{
														width: '100px',
														border: '1px solid rgb(255 255 255)',
														borderBottomColor: 'rgb(224 224 224)',
														borderLeftColor: 'rgb(233 233 233)',
														borderRightColor: 'rgb(233 233 233)',
													}}
												>
													<TextFieldValue
														indice={i}
														cantidadInicial={cantidadInicial}
														onChangeDataEstilo={onChangeDataEstilo}
														valueDataEstilo={valueDataEstilo}
														desactivado
														porcentaje
													/>
												</TableCell>
											);
										})
										.concat(
											<TableCell
												key={`total${color.id}`}
												align="center"
												style={{
													width: '100px',
													border: '1px solid rgb(255 255 255)',
													borderBottomColor: 'rgb(224 224 224)',
													borderLeftColor: 'rgb(233 233 233)',
													borderRightColor: 'rgb(233 233 233)',
												}}
											>
												{total}
											</TableCell>
										)}
									{Array.from(Array(colSpan).keys())
										.map(i => {
											let cantidadInicial;

											if (
												agruparCantidadPorcentajeColor[color.id] &&
												agruparCantidadPorcentajeColor[color.id][i]
											) {
												cantidadInicial = agruparCantidadPorcentajeColor[color.id][i];
											} else {
												let porcccc = 0;
												if (cantidadesPorcentajeEstilo.length > 0) {
													porcccc = cantidadesPorcentajeEstilo[0].porcentaje;
												} else {
													porcccc = getValues().cliente.porcentajeError;
												}

												cantidadInicial = {
													id: FuseUtils.generateGUID(),
													cantidad: 0,
													orden: i,
													estilo,
													color,
													porcentaje: porcccc,
												};
												valueDataEstilo.cantidadesPorcentaje.push(cantidadInicial);
												// onChangeDataEstilo(valueDataEstilo);
											}

											totalPorcentaje += cantidadInicial.cantidad;

											return (
												<TableCell
													align="center"
													key={i}
													style={{
														width: '100px',
														border: '1px solid rgb(255 255 255)',
														borderBottomColor: 'rgb(224 224 224)',
														borderLeftColor: 'rgb(233 233 233)',
														borderRightColor: 'rgb(233 233 233)',
													}}
												>
													<TextFieldValue
														indice={i}
														cantidadInicial={cantidadInicial}
														onChangeDataEstilo={onChangeDataEstilo}
														valueDataEstilo={valueDataEstilo}
														desactivado
														porcentaje
													/>
												</TableCell>
											);
										})
										.concat(
											<TableCell
												key={`total${color.id}`}
												align="center"
												style={{
													width: '100px',
													border: '1px solid rgb(255 255 255)',
													borderBottomColor: 'rgb(224 224 224)',
													borderLeftColor: 'rgb(233 233 233)',
													borderRightColor: 'rgb(233 233 233)',
												}}
											>
												{totalPorcentaje}
											</TableCell>
										)}
								</TableRow>
							);
						})}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default TablaPedido;

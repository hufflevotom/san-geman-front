/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */
import {
	IconButton,
	InputAdornment,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import FuseUtils from '@fuse/utils';
import { MODULOS } from 'constants/constantes';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import TableCabecera from './tablaCabecera';
import TextFieldValue from './textFieldValue';

const TablaEstilo = ({ key, estilo }) => {
	const methods = useFormContext();
	const { getValues, setValue, watch } = methods;

	const valueDataEstilo = watch('dataEstilos');
	const pedido = useSelector(({ comercial }) => comercial.pedido);

	const [tallaBool, setTallaBool] = useState(false);
	const [porcentaje, setPorcentaje] = useState(
		valueDataEstilo.cantidadesPorcentaje.length > 0
			? parseFloat(valueDataEstilo.cantidadesPorcentaje[0].porcentaje) + 100
			: 100
	);

	const cantidadEstilo = valueDataEstilo.cantidades.filter(
		cantidad => cantidad.estilo.id === estilo.id
	);

	const cantidadesPorcentajeEstilo = valueDataEstilo.cantidadesPorcentaje.filter(
		cantidad => cantidad.estilo.id === estilo.id
	);

	const coloresId = [];
	const agruparCantidadColor = {};

	const coloresIdPorcentaje = [];
	const agruparCantidadPorcentajeColor = {};
	const rolActual = useSelector(({ auth }) => auth.user.role);
	const modulos = useSelector(
		({ auth }) => auth.roles[0].find(rol => rol.id === rolActual.id).modulos
	);
	const editarPedidoAsignado =
		modulos.findIndex(modulo => modulo.nombre === MODULOS.editarPedidoAsignado) !== -1;

	cantidadEstilo.forEach(cantidad => {
		if (!coloresId.includes(cantidad.color.id)) {
			coloresId.push(cantidad.color.id);
			agruparCantidadColor[cantidad.color.id] = [cantidad];
		} else {
			agruparCantidadColor[cantidad.color.id].push(cantidad);
		}
	});

	cantidadesPorcentajeEstilo.forEach(cantidad => {
		if (!coloresIdPorcentaje.includes(cantidad.color.id)) {
			coloresIdPorcentaje.push(cantidad.color.id);
			agruparCantidadPorcentajeColor[cantidad.color.id] = [cantidad];
		} else {
			agruparCantidadPorcentajeColor[cantidad.color.id].push(cantidad);
		}
	});

	for (const k in agruparCantidadColor) {
		if (Object.hasOwnProperty.call(agruparCantidadColor, k)) {
			const element = agruparCantidadColor[k];
			element.sort((a, b) => a.orden - b.orden);
		}
	}

	for (const k in agruparCantidadPorcentajeColor) {
		if (Object.hasOwnProperty.call(agruparCantidadPorcentajeColor, k)) {
			const element = agruparCantidadPorcentajeColor[k];
			element.sort((a, b) => a.orden - b.orden);
		}
	}
	const [colSpan, setColSpan] = useState(
		agruparCantidadColor[coloresId[0]] ? agruparCantidadColor[coloresId[0]].length : 0
	);

	const agregarColumna = () => setColSpan(colSpan + 1);

	const eliminarColumna = () => {
		setColSpan(colSpan - 1);

		const cantidadesOtrosEstilos = valueDataEstilo.cantidades.filter(
			cantidad => cantidad.estilo.id !== estilo.id
		);

		const cantEstilos = valueDataEstilo.cantidades.filter(
			cantidad => cantidad.estilo.id === estilo.id
		);

		const ccc = [...cantEstilos.filter(e => e.orden !== colSpan - 1), ...cantidadesOtrosEstilos];
		setValue('dataEstilos', { ...valueDataEstilo, cantidades: ccc });
	};

	useEffect(() => {
		if (cantidadesPorcentajeEstilo.length > 0) {
			setPorcentaje(parseFloat(cantidadesPorcentajeEstilo[0].porcentaje) + 100);
		} else {
			setPorcentaje(parseFloat(getValues().cliente.porcentajeError) + 100);
		}
	}, [valueDataEstilo.cantidadesPorcentaje]);

	useEffect(() => {
		if (valueDataEstilo?.cantidades?.length > 0) {
			// validar si existe talla en valudataestilo cantidades
			valueDataEstilo.cantidades.forEach(valCant => {
				if (valCant.talla) {
					setTallaBool(false);
				} else {
					setTallaBool(true);
				}
			});
		} else {
			setTallaBool(false);
		}
	}, [valueDataEstilo, colSpan]);

	return (
		<TableContainer component={Paper} style={{ marginTop: 20 }} key={key}>
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
							{estilo?.estilo ?? 'Estilo'}
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
								<div style={{ marginLeft: '10px' }}>CANTIDAD</div>
								&nbsp; &nbsp;
								<TextField
									style={{ width: '90px' }}
									disabled={cantidadesPorcentajeEstilo.length === 0 || pedido?.asignado}
									required
									variant="outlined"
									value={porcentaje || 100}
									onBlur={() => {
										if (porcentaje >= 100) {
											const cantidadesPorcentajeArr = [];
											valueDataEstilo.cantidadesPorcentaje.forEach(cantidadPorcentaje => {
												let porcentajeVal = cantidadPorcentaje.porcentaje || 0;
												const porc = parseFloat(porcentaje) - 100;
												if (cantidadPorcentaje.estilo.id === estilo.id) {
													porcentajeVal = porc;
												}
												valueDataEstilo.cantidades.forEach(cantidad => {
													if (cantidadPorcentaje.estilo.id === estilo.id) {
														if (
															cantidadPorcentaje.color.id === cantidad.color.id &&
															cantidadPorcentaje.talla.id === cantidad.talla.id
														) {
															const aaa = cantidad.cantidad * (porc / 100 + 1);
															// aaa = Math.round(aaa * 1e12) / 1e12;
															if (aaa % 1 !== 0) {
																cantidadPorcentaje.cantidad =
																	parseInt(aaa.toString().split('.')[0], 10) + 1;
															} else {
																cantidadPorcentaje.cantidad = parseInt(aaa, 10);
															}
														}
													}
												});
												cantidadesPorcentajeArr.push({
													...cantidadPorcentaje,
													porcentaje: porcentajeVal,
												});
											});

											setValue('dataEstilos', {
												...valueDataEstilo,
												cantidadesPorcentaje: cantidadesPorcentajeArr,
											});
										}
									}}
									onChange={e => {
										setPorcentaje(parseFloat(e.target.value));
									}}
									InputProps={{
										endAdornment: <InputAdornment position="start">%</InputAdornment>,
									}}
								/>
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
							<IconButton
								color="primary"
								disabled={cantidadEstilo.length === 0 || pedido?.asignado}
								onClick={() => eliminarColumna()}
								style={{ marginLeft: 20 }}
							>
								<RemoveCircleIcon />
							</IconButton>
							<IconButton
								color="primary"
								disabled={tallaBool || pedido?.asignado}
								onClick={() => agregarColumna()}
							>
								<AddCircleIcon />
							</IconButton>
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
					{/* CABECERAS DE TABLA ----------------------------- */}
					<TableRow style={{ maxWidth: '600px' }}>
						{Array.from(Array(colSpan).keys())
							.map(i => {
								let vall;

								if (cantidadEstilo.filter(f => f.orden === i).length > 0) {
									vall = cantidadEstilo.filter(f => f.orden === i)[0];
								} else {
									vall = null;
								}

								return (
									<>
										<TableCabecera
											setColSpan={setColSpan}
											disable={false}
											key={i}
											vall={vall}
											valueDataEstilo={valueDataEstilo}
										/>
									</>
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
									vall = cantidadEstilo.filter(f => f.orden === i)[0];
								} else {
									vall = null;
								}

								return (
									<TableCabecera disable key={i} vall={vall} valueDataEstilo={valueDataEstilo} />
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
					{/* CABECERAS DE TABLA ----------------------------- FIN */}
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
										{color.descripcion}
									</TableCell>

									{Array.from(Array(colSpan).keys())
										.map(i => {
											let cantidadInicial;

											if (
												agruparCantidadColor &&
												agruparCantidadColor[color.id] &&
												agruparCantidadColor[color.id][i]
											) {
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
												setValue('dataEstilos', valueDataEstilo);
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
														valueDataEstilo={valueDataEstilo}
														desactivado={editarPedidoAsignado ? false : pedido.asignado}
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
														valueDataEstilo={valueDataEstilo}
														desactivado={editarPedidoAsignado ? false : pedido.asignado}
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

export default TablaEstilo;

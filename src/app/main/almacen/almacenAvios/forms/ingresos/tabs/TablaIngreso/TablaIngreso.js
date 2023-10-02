import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Controller, useFormContext } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';
import TextFieldValueTable from './TextFieldValue';
import TextFieldUbicacion from './TextFileldUbicacion';

const style = {
	border: '1px solid #ccc',
};

const TablaIngreso = ({ dataSeleccionada }) => {
	const methods = useFormContext();
	const { control, formState, getValues } = methods;

	const getData = getValues();

	return (
		<>
			<Controller
				name="detalleTabla"
				control={control}
				render={({ field: { onChange: onChangeTable, value } }) => {
					let ordenCompraTabla;

					if (value) {
						ordenCompraTabla = value;
					} else {
						ordenCompraTabla = dataSeleccionada;
					}

					return (
						<div className="flex flex-col sm:flex-row mr-24 sm:mr-4 mt-5">
							<TableContainer component={Paper}>
								<Table sx={{ minWidth: 700 }} aria-label="spanning table">
									<TableHead>
										<TableRow style={{ backgroundColor: '#e1e1e1' }}>
											<TableCell rowSpan={2} align="center" style={style} width={100}>
												CÓDIGO
											</TableCell>
											<TableCell rowSpan={2} align="center" style={style} width={350}>
												DESCRIPCIÓN
											</TableCell>
											<TableCell rowSpan={2} align="center" style={style} width={150}>
												TALLAS
											</TableCell>
											<TableCell rowSpan={2} align="center" style={style} width={100}>
												CANT ORDEN COMPRA
											</TableCell>
											<TableCell rowSpan={2} align="center" style={style} width={400}>
												CANT DE INGRESO
											</TableCell>
											<TableCell align="center" style={style} width={400}>
												UBICACION
											</TableCell>
											{/* 	<TableCell rowSpan={2} align="center" style={style} width={200}>
												CANT DE INGRESO
											</TableCell> */}
											{/* <TableCell rowSpan={2} align="center" style={style} width={200}>
												NÚMERO DE PARTIDA
											</TableCell> */}
											{/* <TableCell rowSpan={2} align="center" style={style} width={200}>
												CANT DE ROLLO
											</TableCell> */}
										</TableRow>
										{/* <TableRow style={{ backgroundColor: '#e1e1e1' }}>
											<TableCell rowSpan={1} colSpan={1} align="center" style={style} width={100}>
												UND PRINCIAL
											</TableCell>
											<TableCell rowSpan={1} colSpan={1} align="center" style={style} width={100}>
												MTS
											</TableCell>
										</TableRow> */}
									</TableHead>
									<TableBody>
										{ordenCompraTabla &&
											ordenCompraTabla.map(row => {
												return (
													<TableRow key={row.id}>
														<TableCell width={100} style={style}>
															{row.producto.codigo}
														</TableCell>
														<TableCell width={350} style={style}>
															{row.producto.avio.nombre}
														</TableCell>
														<TableCell width={150} style={style} align="center">
															{row.producto.talla?.talla ?? ''}
														</TableCell>
														<TableCell width={100} style={style} align="center">
															{`${row.cantidad} ${row.unidad.prefijo}`}
														</TableCell>
														{/* <TableCell width={200} style={style} align="center">
															{row.unidad.nombre}
														</TableCell> */}
														<TableCell width={200} style={style}>
															<TextFieldValueTable
																label="CANTIDAD"
																dataSeleccionada={dataSeleccionada}
																row={row}
																onChangeTable={onChangeTable}
																dataKey="P"
															/>
														</TableCell>
														<TableCell width={200} style={style}>
															<TextFieldUbicacion
																label="UBICACIÓN"
																dataSeleccionada={dataSeleccionada}
																row={row}
																onChangeTable={onChangeTable}
																dataKey="ubicacion"
															/>
														</TableCell>
														{/* <TableCell style={style}>
															<TextFieldValueTable
																disabled={getData?.id}
																label="Número de Partida"
																dataSeleccionada={dataSeleccionada}
																row={row}
																onChangeTable={onChangeTable}
																dataKey="numeroPartida"
															/>
														</TableCell> */}
														{/* <TableCell style={style}>
															<TextFieldValueTable
																label="Cantidad de Rollo"
																dataSeleccionada={dataSeleccionada}
																row={row}
																onChangeTable={onChangeTable}
																dataKey="cantidadRollo"
															/>
														</TableCell> */}
													</TableRow>
												);
											})}
									</TableBody>
								</Table>
							</TableContainer>
						</div>
					);
				}}
			/>
		</>
	);
};

export default TablaIngreso;

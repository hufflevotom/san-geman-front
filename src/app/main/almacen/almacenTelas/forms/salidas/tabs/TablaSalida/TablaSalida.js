import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Controller, useFormContext } from 'react-hook-form';
import { InputAdornment } from '@mui/material';
import TextFieldValueTable from './TextFieldValue';

const style = {
	border: '1px solid #ccc',
};

const TablaSalida = ({ dataSeleccionada }) => {
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
											{/* <TableCell rowSpan={2} align="center" style={style} width={200}>
												CÓDIGO
											</TableCell> */}
											<TableCell rowSpan={2} align="center" style={style} width={400}>
												DESCRIPCIÓN
											</TableCell>
											<TableCell rowSpan={2} align="center" style={style} width={300}>
												COLOR
											</TableCell>
											<TableCell rowSpan={2} align="center" style={style} width={300}>
												PARTIDA
											</TableCell>
											<TableCell rowSpan={2} align="center" style={style} width={100}>
												CANT PROGRAMADA
											</TableCell>
											<TableCell rowSpan={2} align="center" style={style} width={150}>
												CANT DE SALIDA
											</TableCell>
											<TableCell rowSpan={2} align="center" style={style} width={150}>
												CANT DE ROLLOS
											</TableCell>
											<TableCell rowSpan={2} align="center" style={style} width={150}>
												CANT DE ROLLOS RESTANTES
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{ordenCompraTabla &&
											ordenCompraTabla.map(row => {
												return (
													<TableRow key={row.id}>
														{/* <TableCell width={200} style={style}>
															{row.productoTela.codigo}
														</TableCell> */}
														<TableCell width={400} style={style}>
															{row.productoTela.tela.nombre}
														</TableCell>
														<TableCell width={100} style={style} align="center">
															{row.productoTela.color.descripcion}
														</TableCell>
														<TableCell style={style} align="center">
															{row.productoTela.partida}
														</TableCell>
														<TableCell width={100} style={style} align="center">
															{`${row.telaProgramada} ${row.productoTela.unidadMedida.prefijo}`}
														</TableCell>
														<TableCell style={style}>
															<TextFieldValueTable
																label="Cantidad de Salida"
																dataSeleccionada={dataSeleccionada}
																row={row}
																onChangeTable={onChangeTable}
																dataKey="cantidadSalida"
																InputProps={{
																	endAdornment: <InputAdornment position="end">KG</InputAdornment>,
																}}
															/>
														</TableCell>
														<TableCell style={style}>
															<TextFieldValueTable
																label="Cantidad de Rollos"
																dataSeleccionada={dataSeleccionada}
																row={row}
																onChangeTable={onChangeTable}
																dataKey="cantidadRollos"
															/>
														</TableCell>
														<TableCell style={style}>
															<TextFieldValueTable
																label="Cantidad de Rollos Restantes"
																dataSeleccionada={dataSeleccionada}
																row={row}
																onChangeTable={onChangeTable}
																dataKey="cantidadRollosRestantes"
															/>
														</TableCell>
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

export default TablaSalida;

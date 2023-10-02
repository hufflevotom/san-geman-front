import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Controller, useFormContext } from 'react-hook-form';
import { useRef, useState } from 'react';

import TextFieldValue from './textFieldValue';
import TextFieldUnidadValueTable from './TextFieldUnidadValue';

const ProduccionTable = ({ currentMoneda, dataSeleccionada }) => {
	// REDONDEAR CUALQUIER VALOR QUE TIENE DECIMAL AL SIGUIENTE ENTERO
	// if (dataSeleccionada) {
	// 	dataSeleccionada.forEach(element => {
	// 		const decimales = element.cantidad % 1;
	// 		if (decimales > 0) {
	// 			element.cantidad += 1 - decimales;
	// 		}
	// 	});
	// }

	console.log('DATA TABLE: ', dataSeleccionada);
	console.log('currentMoneda: ', currentMoneda);

	const methods = useFormContext();
	const impresionRef = useRef();
	const { control, formState } = methods;
	const { errors } = formState;

	const [data, setData] = useState({
		igv: 0,
		total: 0,
		valorVenta: 0,
	});

	const style = {
		border: '1px solid #ccc',
	};

	const pageStyle = `
        @page {
            margin: 15
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

	return (
		<>
			<Controller
				name="detalleOrdenComprasTelas"
				control={control}
				render={({ field: { onChange, value } }) => {
					let telas;

					if (value) {
						telas = value;
					} else {
						telas = dataSeleccionada;
					}

					let totalImporteX = 0;
					let valorVenta = 0;
					let igv = 0;

					telas.forEach(element => {
						if (element.totalImporte && typeof element.totalImporte !== 'string') {
							valorVenta += element.totalImporte;
						} else if (typeof element.totalImporte === 'string') {
							valorVenta += parseFloat(element.totalImporte);
						}
					});

					totalImporteX = valorVenta * 1.18;
					igv = totalImporteX - valorVenta;

					return (
						<>
							<div className="flex flex-col sm:flex-row mr-24 sm:mr-4 mt-5">
								<TableContainer component={Paper}>
									<Table sx={{ minWidth: 700 }} aria-label="spanning table">
										<TableHead>
											<TableRow style={{ backgroundColor: '#e1e1e1' }}>
												{/* <TableCell align="center" style={style}>
													CÓDIGO
												</TableCell> */}
												<TableCell align="center" style={style}>
													DESCRIPCIÓN
												</TableCell>
												<TableCell align="center" style={style}>
													CANT
												</TableCell>
												<TableCell align="center" style={style}>
													U/M
												</TableCell>
												<TableCell align="center" style={style}>
													VALOR UNITARIO
												</TableCell>
												<TableCell align="center" style={style}>
													% DSCTO
												</TableCell>
												<TableCell align="center" style={style}>
													PRECIO UNITARIO
												</TableCell>
												<TableCell align="center" style={style}>
													TOTAL IMPORTE
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{telas.map(row => {
												return (
													<TableRow key={row.id}>
														{/* <TableCell style={style}>
															{row.producto ? row.producto.codigo : row.id}
														</TableCell> */}
														<TableCell style={style}>
															{row.producto
																? `${row.producto.tela.nombre} / ${row.producto.color.descripcion}`
																: `${row.tela} / ${row.color}`}
														</TableCell>
														<TableCell style={style}>
															<TextFieldValue
																label="cantidad"
																dataKey="cantidad"
																dataSeleccionada={telas}
																row={row}
																onChangeDataTextField={onChange}
															/>
														</TableCell>
														<TableCell style={style}>
															<TextFieldUnidadValueTable
																label="Unidad"
																dataSeleccionada={telas}
																row={row}
																onChangeTable={onChange}
																// disabled={value && value.id && typeof value.id === 'number'}
																disabled
															/>
														</TableCell>
														<TableCell style={style} align="center">
															<TextFieldValue
																dataKey="valorUnitario"
																label="valor unitario"
																dataSeleccionada={telas}
																row={row}
																onChangeDataTextField={onChange}
															/>
														</TableCell>
														<TableCell style={style} align="center">
															<TextFieldValue
																dataKey="descuento"
																label="descuento"
																dataSeleccionada={telas}
																row={row}
																onChangeDataTextField={onChange}
															/>
														</TableCell>
														<TableCell style={style} align="center">
															{(typeof row?.precioUnitario === 'string'
																? parseFloat(row?.precioUnitario)
																: row?.precioUnitario
															).toFixed(2)}
														</TableCell>
														<TableCell style={style} align="center">
															{(typeof row.totalImporte === 'string'
																? parseFloat(row.totalImporte)
																: row.totalImporte
															).toFixed(2)}
														</TableCell>
													</TableRow>
												);
											})}

											<TableRow>
												<TableCell colSpan={4} />
												<TableCell colSpan={2} style={style}>
													VALOR VENTA
												</TableCell>
												<TableCell colSpan={2} style={style}>
													{currentMoneda?.key === 'SOLES' ? 'S/ ' : '$ '}
													{(typeof valorVenta === 'string'
														? parseFloat(valorVenta)
														: valorVenta
													).toFixed(2)}
												</TableCell>
											</TableRow>

											<TableRow>
												<TableCell colSpan={4} />
												<TableCell colSpan={2} style={style}>
													IGV (18.00%)
												</TableCell>
												<TableCell colSpan={2} style={style}>
													{currentMoneda?.key === 'SOLES' ? 'S/ ' : '$ '}
													{(typeof igv === 'string' ? parseFloat(igv) : igv).toFixed(2)}
												</TableCell>
											</TableRow>

											<TableRow>
												<TableCell colSpan={4} />
												<TableCell colSpan={2} style={style}>
													TOTAL IMPORTE
												</TableCell>
												<TableCell colSpan={2} style={style}>
													{currentMoneda?.key === 'SOLES' ? 'S/ ' : '$ '}
													{(typeof totalImporteX === 'string'
														? parseFloat(totalImporteX)
														: totalImporteX
													).toFixed(2)}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</TableContainer>
							</div>
						</>
					);
				}}
			/>
		</>
	);
};

export default ProduccionTable;

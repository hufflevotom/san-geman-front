/* eslint-disable no-nested-ternary */
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Controller, useFormContext } from 'react-hook-form';
import { useRef, useState } from 'react';
import { milliFormat } from 'utils/Format';

import TextFieldValue from './textFieldValue';
import TextFieldUnidadValueTable from './TextFieldUnidadValue';

const ProduccionTable = ({ dataSeleccionada }) => {
	// REDONDEAR CUALQUIER VALOR QUE TIENE DECIMAL AL SIGUIENTE ENTERO
	// if (dataSeleccionada) {
	// 	console.log('dataSeleccionada', dataSeleccionada);
	// 	dataSeleccionada.forEach(element => {
	// 		const decimales = element.cantidad % 1;
	// 		if (decimales > 0) {
	// 			element.cantidad += 1 - decimales;
	// 		}
	// 	});
	// }
	const methods = useFormContext();
	const impresionRef = useRef();
	const { control, formState, watch } = methods;
	const { errors } = formState;

	const moneda = watch('moneda');
	console.log(moneda);

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
				name="detalleOrdenComprasAvios"
				control={control}
				render={({ field: { onChange, value } }) => {
					let avios;

					if (value) {
						avios = value;
					} else {
						avios = dataSeleccionada;
					}

					let totalMonto = 0;
					let subTotalValorVenta = 0;
					let igv = 0;

					avios.forEach(avio => {
						if (avio.totalImporte && typeof avio.totalImporte !== 'string') {
							subTotalValorVenta += avio.totalImporte;
						} else if (avio.totalImporte && typeof avio.totalImporte === 'string') {
							subTotalValorVenta += parseFloat(avio.totalImporte);
						}
					});

					totalMonto = subTotalValorVenta * 1.18;
					igv = totalMonto - subTotalValorVenta;

					return (
						<>
							<div className="flex flex-col sm:flex-row mr-24 sm:mr-4 mt-5">
								<TableContainer component={Paper}>
									<Table sx={{ minWidth: 700 }} aria-label="spanning table">
										<TableHead>
											<TableRow style={{ backgroundColor: '#e1e1e1' }}>
												<TableCell align="center" style={style}>
													CÓDIGO
												</TableCell>
												<TableCell align="center" style={style}>
													DESCRIPCIÓN
												</TableCell>
												<TableCell align="center" style={style}>
													U/M
												</TableCell>
												<TableCell align="center" style={style}>
													CANTIDAD
												</TableCell>
												<TableCell align="center" style={style}>
													PRECIO
												</TableCell>
												<TableCell align="center" style={style}>
													MONTO
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{avios.map(row => {
												console.log(row);
												return (
													<TableRow key={row.id}>
														<TableCell align="center" style={style}>
															{row.codigo}
														</TableCell>
														<TableCell align="center" style={style}>
															{row.producto
																? `${row.producto.avio?.nombre} ${
																		row.producto.avio?.hilos
																			? `- ${row.producto.avio?.codigoSec} - ${row.producto.avio?.marcaHilo} - ${row.producto.avio?.color?.descripcion}`
																			: ''
																  }${
																		row.producto.avio?.talla
																			? ` - ${row.producto.avio?.talla.prefijo}`
																			: ''
																  }`
																: `${row?.nombre}`}
														</TableCell>
														<TableCell align="center" style={style}>
															<TextFieldUnidadValueTable
																label="Unidad"
																dataSeleccionada={avios}
																row={row}
																onChangeTable={onChange}
															/>
														</TableCell>
														<TableCell align="center" style={style}>
															<TextFieldValue
																type="number"
																label="cantidad"
																dataKey="cantidad"
																dataSeleccionada={avios}
																row={row}
																onChangeDataTextField={onChange}
															/>
														</TableCell>
														<TableCell style={style} align="center">
															<TextFieldValue
																type="number"
																dataKey="precioUnitario"
																label="Precio Unitario"
																dataSeleccionada={avios}
																row={row}
																onChangeDataTextField={onChange}
															/>
														</TableCell>

														<TableCell style={style} align="center">
															{milliFormat(row.totalImporte) ?? 0}
														</TableCell>
													</TableRow>
												);
											})}

											<TableRow>
												<TableCell colSpan={3} />
												<TableCell colSpan={2} style={style}>
													SUB TOTAL VALOR VENTA
												</TableCell>
												<TableCell colSpan={2} style={style}>
													{moneda === 'SOLES' ? 'S/' : '$'} {milliFormat(subTotalValorVenta)}
												</TableCell>
											</TableRow>

											<TableRow>
												<TableCell colSpan={3} />
												<TableCell colSpan={2} style={style}>
													IGV (18.00%)
												</TableCell>
												<TableCell colSpan={2} style={style}>
													{moneda === 'SOLES' ? 'S/' : '$'} {milliFormat(igv)}
												</TableCell>
											</TableRow>

											<TableRow>
												<TableCell colSpan={3} />
												<TableCell colSpan={2} style={style}>
													TOTAL MONTO
												</TableCell>
												<TableCell colSpan={2} style={style}>
													{moneda === 'SOLES' ? 'S/' : '$'} {milliFormat(totalMonto)}
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

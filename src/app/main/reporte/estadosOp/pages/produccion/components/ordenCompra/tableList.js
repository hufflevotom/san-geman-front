/* eslint-disable no-nested-ternary */
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import moment from 'moment';
import { useState } from 'react';
import ModalDetalle from './modalDetalle';

const rows = [
	{
		id: 'tipo',
		align: 'left',
		disablePadding: false,
		label: 'Tipo',
	},
	{
		id: 'codigo',
		align: 'left',
		disablePadding: false,
		label: 'Codigo',
	},
	{
		id: 'fechaEmision',
		align: 'left',
		disablePadding: false,
		label: 'Fecha de Emisión',
	},
	{
		id: 'qti',
		align: 'left',
		disablePadding: false,
		label: 'Ingresos al almacén',
	},
	{
		id: 'promedio',
		align: 'right',
		disablePadding: false,
		label: 'Estado',
	},
	{
		id: 'detalles',
		align: 'right',
		disablePadding: false,
		label: 'Ingresos',
	},
];

export default function OrdenesCompraTable({ ordenesCompra }) {
	const [openModal, setOpenModal] = useState(false);
	const [dataModal, setDataModal] = useState(null);

	const formatDate = date => {
		const fecha = moment(date).locale('es');
		return fecha.format('DD/MM/YYYY');
	};

	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
					<TableHead>
						<TableRow className="h-48 sm:h-64">
							{rows.map(row => {
								return (
									<TableCell
										className="p-4 md:p-16"
										key={row.id}
										align={row.align}
										padding={row.disablePadding ? 'none' : 'normal'}
									>
										{row.label}
									</TableCell>
								);
							}, this)}
						</TableRow>
					</TableHead>

					<TableBody>
						{ordenesCompra.map(n => {
							let cantidadIngresos = 0;
							let total = 0;
							let suma = 0;
							if (n.indicadorTipo === 'T') {
								n.detalleOrdenComprasTelas.forEach(detalle => {
									total += parseFloat(detalle.cantidad);
								});
								n.registrosIngresoAlmacenTela.forEach(item => {
									item.detallesProductosIngresosAlmacenesTelas.forEach(detalle => {
										suma += parseFloat(detalle.cantidad);
										cantidadIngresos += 1;
									});
								});
							} else {
								n.detalleOrdenComprasAvios.forEach(detalle => {
									total += parseFloat(detalle.cantidad);
								});
								n.registrosIngresoAlmacenAvio.forEach(item => {
									item.detallesProductosIngresosAlmacenesAvios.forEach(detalle => {
										suma += parseFloat(detalle.cantidad);
										cantidadIngresos += 1;
									});
								});
							}

							console.log('suma', suma);
							console.log('total', total);
							const promedio = total > 0 ? (suma * 100) / total : 0;
							console.log('promedio', promedio);
							return (
								<TableRow
									style={n.anulado ? { backgroundColor: '#ffd5d5' } : {}}
									className="h-72 cursor-pointer"
									hover
									tabIndex={-1}
									key={n.id + n.indicadorTipo}
								>
									<TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
										{n.indicadorTipo === 'T' ? 'TELAS' : 'AVIOS'}
									</TableCell>

									<TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
										{n.codigo}
									</TableCell>

									<TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
										{formatDate(n.fechaEmision)}
									</TableCell>

									<TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
										{cantidadIngresos}
									</TableCell>

									<TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
										{promedio > 100 || promedio === 0 ? (
											<span>
												{promedio.toFixed(2)}% <ErrorIcon color="error" />
											</span>
										) : promedio < 100 ? (
											<span>
												{promedio.toFixed(2)}% <WarningIcon color="warning" />
											</span>
										) : (
											<span>
												{promedio.toFixed(2)}% <CheckCircleIcon color="success" />
											</span>
										)}
									</TableCell>

									<TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
										<Button
											startIcon={<RemoveRedEyeIcon />}
											variant="contained"
											size="small"
											color="primary"
											onClick={() => {
												setOpenModal(true);
												setDataModal(n);
											}}
										>
											Ver
										</Button>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</FuseScrollbars>
			{openModal && (
				<ModalDetalle openModal={openModal} setOpenModal={setOpenModal} dataModal={dataModal} />
			)}
		</div>
	);
}

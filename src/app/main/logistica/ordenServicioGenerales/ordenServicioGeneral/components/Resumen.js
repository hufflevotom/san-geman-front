import { useEffect, useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const Resumen = ({ data, currentTipoServicio }) => {
	const [total, setTotal] = useState(0);
	const [totalIgv, setTotalIgv] = useState(0);

	useEffect(() => {
		let t = 0;
		let i = 0;
		data.forEach(item => {
			const suma = item.precioUnitario * item.cantidad;
			if (suma) {
				t += parseFloat(suma);
				i += parseFloat(item.igv);
			}
		});
		setTotal(t);
		setTotalIgv(i);
	}, [data]);

	if (data && data.length > 0) {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'end',
					marginTop: '20px',
				}}
			>
				<h2 style={{ fontWeight: 'bold' }}>Resumen</h2>
				<br />
				<TableContainer component={Paper} style={{ width: '25%' }}>
					<Table aria-label="simple table">
						<TableBody>
							{currentTipoServicio.id !== 'IN' && (
								<>
									<TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">SubTotal</TableCell>
										<TableCell align="right">S/ {total - totalIgv}</TableCell>
									</TableRow>

									<TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">IGV</TableCell>
										<TableCell align="right">S/ {totalIgv}</TableCell>
									</TableRow>
								</>
							)}
							<TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
								<TableCell align="left">Total</TableCell>
								<TableCell align="right">S/ {total}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		);
	}
	return null;
};

export default Resumen;

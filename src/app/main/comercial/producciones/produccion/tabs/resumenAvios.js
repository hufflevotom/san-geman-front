import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const ResumenAvios = ({ avios }) => {
	if (avios && avios.length > 0) {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'end',
					marginTop: '20px',
				}}
			>
				<h2 style={{ fontWeight: 'bold' }}>Resumen de Avios</h2>
				<br />
				<TableContainer component={Paper} style={{ width: '45%' }}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table" style={{ minWidth: '0px' }}>
						<TableHead>
							<TableRow>
								<TableCell align="right">Avios</TableCell>
								{/* <TableCell align="right">Tallas</TableCell> */}
								<TableCell align="right">Unidades Totales</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{avios.map((avio, index) => {
								const decimalesTotal = avio.cantidad.toString().split('.')[1];
								avio.cantidad =
									decimalesTotal && parseInt(decimalesTotal, 10) > 0
										? parseInt(avio.cantidad.toString().split('.')[0], 10) + 1
										: avio.cantidad;

								const aa = parseInt(avio.cantidad.toString().split('.')[0], 10);
								return (
									<TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="right">{`${avio?.avios?.nombre} ${
											avio?.avios?.hilos
												? `- ${avio?.avios?.codigoSec} - ${avio?.avios?.marcaHilo} - ${avio?.avios?.color?.descripcion}`
												: ''
										}`}</TableCell>
										{/* <TableCell align="right">{avio?.tallaNombe ? avio?.tallaNombe : ''}</TableCell> */}
										<TableCell align="right">{aa}</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		);
	}
	return null;
};

export default ResumenAvios;

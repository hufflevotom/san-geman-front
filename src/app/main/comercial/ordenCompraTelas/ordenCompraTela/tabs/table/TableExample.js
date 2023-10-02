import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TextField } from '@mui/material';

const style = {
	border: '1px solid #ccc',
};

const telas = [];

const TableExample = () => {
	return (
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
								CANT ORDEN COMPRA
							</TableCell>
							<TableCell align="center" style={style}>
								U/M
							</TableCell>
							<TableCell align="center" style={style}>
								CANT DE INGRESO
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{telas.map(row => {
							console.log('TELAS ROW CS 1:', row);

							return (
								<TableRow key={row.id}>
									<TableCell style={style}> 123 ABC </TableCell>
									<TableCell style={style}>DESC</TableCell>
									<TableCell style={style}>12</TableCell>
									<TableCell style={style}> KILOGRAMOS </TableCell>
									<TableCell style={style} align="center">
										<TextField
											// value={valuee}
											onChange={e => {
												// setValuee(e.target.value);
											}}
											onBlur={() => {}}
											style={{ width: '90px' }}
											id="outlined-basic"
											label="CANT DE INGRESO"
											variant="outlined"
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
};

export default TableExample;

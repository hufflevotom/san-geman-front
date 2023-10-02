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

function ProduccionesIgnoradas({ partidas, produccionesIgnoradas }) {
	const [producciones, setProducciones] = useState([]);

	const obtenerProduccionesIgnoradas = ({ arrProducciones, arrPartidas }) => {
		const arrTelas = [];
		arrProducciones.forEach(e => {
			const partidasSeleccionadas = arrPartidas.filter(
				p => e.kardex.findIndex(k => k.id === p.id) !== -1
			);
			const totalSeleccionado = partidasSeleccionadas.reduce(
				(a, b) => a + parseFloat(b.cantidad),
				0
			);
			// const decimales = e.cantidadAnterior % 1;
			// if (decimales > 0) {
			// 	e.cantidadAnterior += 1 - decimales;
			// }
			if (totalSeleccionado > 0) {
				arrTelas.push({
					key: e.id,
					tela: e.tela,
					color: e.color,
					cantidad: e.cantidadAnterior,
					um: e.um,
					totalSeleccionado,
					partidas: partidasSeleccionadas,
				});
			}
		});
		setProducciones(arrTelas);
	};

	useEffect(() => {
		obtenerProduccionesIgnoradas({ arrProducciones: produccionesIgnoradas, arrPartidas: partidas });
	}, [produccionesIgnoradas, partidas]);

	const style = {
		border: '1px solid #ccc',
	};

	return (
		<div
			style={{
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'start',
				justifyContent: 'center',
				margin: '30px 0',
				gap: '10px',
			}}
		>
			<h4>Telas a asignar</h4>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 700 }} aria-label="spanning table">
					<TableHead>
						<TableRow style={{ backgroundColor: '#e1e1e1' }}>
							<TableCell align="center" style={style}>
								TELA
							</TableCell>
							<TableCell align="center" style={style}>
								COLOR
							</TableCell>
							<TableCell align="center" style={style}>
								CANTIDAD PROGRAMADA
							</TableCell>
							<TableCell align="center" style={style}>
								CANTIDAD A ASIGNAR
							</TableCell>
							<TableCell align="center" style={style}>
								PARTIDAS
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{producciones.map(e => (
							<TableRow key={e.id}>
								<TableCell style={style}>{e.tela}</TableCell>
								<TableCell style={style}>{e.color}</TableCell>
								<TableCell style={style}>
									{e.cantidad.toFixed(2)} {e.um}
								</TableCell>
								<TableCell style={style}>
									{e.totalSeleccionado.toFixed(2)} {e.um}
								</TableCell>
								<TableCell style={style}>
									{e.partidas.map(p => (
										<div
											style={{
												width: '100%',
												display: 'flex',
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<span style={{ width: '50%' }}>- {p.producto.partida}</span>
											<span style={{ width: '50%' }}>
												{p.cantidad} {p.unidad.prefijo}
											</span>
										</div>
									))}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}

export default ProduccionesIgnoradas;

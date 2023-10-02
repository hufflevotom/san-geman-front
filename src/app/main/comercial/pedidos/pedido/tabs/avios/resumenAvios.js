import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { setDataAviosResumen } from 'app/main/comercial/store/pedido/resumenPedidoSlice';
import { useEffect, useState } from 'react';

const ResumenAvios = () => {
	const dataAvios = useSelector(state => state.comercial.infoPedido.dataAvios);
	const dispatch = useDispatch();
	const [arrayAvioData, setArrayAvioData] = useState([]);

	useEffect(() => {
		let arrayAvio = [];

		if (dataAvios !== {}) {
			console.log('existe data avios: ', dataAvios);
			const arry = [];
			// eslint-disable-next-line no-restricted-syntax
			for (const key in dataAvios) {
				if (Object.hasOwnProperty.call(dataAvios, key)) {
					const element = dataAvios[key];
					arry.push(...element);
				}
			}

			const dataTermporal = {};

			arry.forEach(element => {
				if (element.colorId) {
					dataTermporal[`${element.avioId}-${element.colorId}`] = dataTermporal[
						`${element.avioId}-${element.colorId}`
					]
						? [...dataTermporal[`${element.avioId}-${element.colorId}`], element]
						: [element];
				} else {
					dataTermporal[element.avioId] = dataTermporal[element.avioId]
						? [...dataTermporal[element.avioId], element]
						: [element];
				}
			});

			const dataFinal = [];
			// eslint-disable-next-line no-restricted-syntax
			for (const key in dataTermporal) {
				if (Object.hasOwnProperty.call(dataTermporal, key)) {
					const element = dataTermporal[key];

					const mapTemporal = {
						cantidad: 0,
					};
					element.forEach(el => {
						mapTemporal.aviosId = el.avioId;
						mapTemporal.coloresId = el.coloresId;
						mapTemporal.avioNombre = el.avioNombre;
						// mapTemporal.colorNombe = el.colorNombe;
						mapTemporal.cantidad +=
							typeof el.unidad === 'string' ? parseFloat(el.unidad) : el.unidad;
					});

					dataFinal.push(mapTemporal);
				}
			}

			arrayAvio = [...dataFinal];

			arrayAvio.sort((a, b) => {
				if (a.avioNombre.toLowerCase() < b.avioNombre.toLowerCase()) {
					return -1;
				}
				if (a.avioNombre.toLowerCase() > b.avioNombre.toLowerCase()) {
					return 1;
				}
				return 0;
			});

			setArrayAvioData(arrayAvio);
			dispatch(setDataAviosResumen(arrayAvio));
		}
	}, [dataAvios, dispatch]);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'end',
			}}
		>
			<h2 style={{ fontWeight: 'bold' }}>Resumen Total</h2>
			<br />
			<TableContainer component={Paper} style={{ width: '45%' }}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table" style={{ minWidth: '0px' }}>
					<TableHead>
						<TableRow>
							<TableCell align="right">Avios</TableCell>
							{/* <TableCell align="right">Color</TableCell> */}
							<TableCell align="right">Unidades Totales</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{arrayAvioData.map((avio, index) => (
							<TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
								<TableCell align="right">{avio.avioNombre}</TableCell>
								{/* <TableCell align="right">{avio?.colorNombe ? avio?.colorNombe : 'Todos'}</TableCell> */}
								<TableCell align="right">{avio.cantidad}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default ResumenAvios;

/* eslint-disable no-shadow */
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import httpClient from 'utils/Api';
import { toast } from 'react-toastify';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 900,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

const columns = [
	{ field: 'codigo', headerName: 'Código', minWidth: 150, flex: 1 },
	{ field: 'nombre', headerName: 'Nombre', minWidth: 290, flex: 1 },
	{ field: 'um', headerName: 'U/M de Compra', minWidth: 200, flex: 1 },
	{ field: 'cantidad', headerName: 'Cant', minWidth: 150, flex: 1 },
	// {
	// 	field: 'stockAlmacen',
	// 	headerName: 'En Stock',
	// 	flex: 1,
	// 	minWidth: 80,
	// 	renderCell: params => {
	// 		return (
	// 			<span style={{ color: '#6E173D' }}>
	// 				{params.value.map((e, i) => `${i > 0 ? ', ' : ''}${e.cantidad.toFixed(2)} ${e.prefijo}`)}
	// 			</span>
	// 		);
	// 	},
	// },
];

export default function ModalTableAvio({ modalOpen, setModalOpen, data, setDataSeleccionada }) {
	const [produccion, setProduccion] = useState([]);
	const [temporalSeleccionado, setTemporalSeleccionado] = useState([]);
	const [cargando, setCargando] = useState(false);

	const getPedidosId = async id => {
		setCargando(true);
		const arrayTemp = [];
		const response = await httpClient.get(`comercial/producciones/${id}`);
		const dataBody = await response.data.body.pedidos;
		if (!data.costoAvio) {
			toast.error('No se registraron costos de avíos para esta OP');
		}
		dataBody.forEach(element => {
			element.resumenAvios.forEach(e => {
				let precioMaximo = 0;
				let precioMaximoUSD = 0;
				console.log('HV.data', data);
				if (data.costoAvio) {
					const avio = data.costoAvio.detalles.find(b => b.avios.id === e.avios.id);
					if (avio) {
						precioMaximo = parseFloat(avio.precioMaximo);
						precioMaximoUSD = parseFloat(avio.precioMaximoUSD);
					}
				}

				arrayTemp.push({
					...e.avios,
					id: `${e.avios.codigo}-${e.avios.nombre}${
						e.avios.talla ? `-${e.avios.talla.prefijo}` : ''
					}`,
					codigo: `${e.avios.codigo}`,
					nombre: `${e.avios?.nombre} ${
						e.avios?.hilos
							? `- ${e.avios?.codigoSec} - ${e.avios?.marcaHilo} - ${e.avios?.color?.descripcion}${
									e.avios.talla ? ` - ${e.avios.talla.prefijo}` : ''
							  }`
							: `${e.avios.talla ? ` - ${e.avios.talla.prefijo}` : ''}`
					}`,
					um: e.avios.unidadMedidaCompra?.nombre,
					idUnidadMedida: e.avios.unidadMedidaCompra?.id,
					cantidad: e.cantidad,
					talla: e.avios.talla ? e.avios.talla.talla : '',
					tallaId: e.avios.talla ? e.avios.talla.id : null,
					avioId: e.avios.id,
					totalImporte: 0,
					precioMaximo,
					precioMaximoUSD,
				});
			});
		});

		// const arrayUnique = [...new Set(arrayTemp.map(item => item.id))].map(id => {
		// 	return arrayTemp.find(item => item.id === id);
		// });

		// eliminar dulicados pero sumando sus cantidades
		console.log('arrayTemp', arrayTemp);
		const arrayUnique = arrayTemp.reduce((acc, current) => {
			const x = acc.find(item => item.id === current.id);
			if (!x) {
				return acc.concat([current]);
			}
			x.cantidad = parseFloat(current.cantidad) + parseFloat(x.cantidad);
			return acc;
		}, []);

		//* Traer stock de almacen
		// const arrStock = await traerStockAlmacen(arrayUnique);

		// setProduccion(arrStock);
		setProduccion(arrayUnique);
		setCargando(false);
	};

	const traerStockAlmacen = async array => {
		const arrayStock = [];
		const response = await httpClient.post(`almacen-tela/kardex/existenciaTelaColor`, {
			productos: array.map(e => ({ idTela: e.telaId, idColor: e.colorId })),
		});
		const dataBody = await response.data.body;
		array.forEach(element => {
			const arrUnidades = [];
			const stockAlmacen = [];
			const stock = dataBody.find(
				e => e.idTela === element.telaId && e.idColor === element.colorId
			);
			stock.kardex.forEach(kardex => {
				if (!arrUnidades.includes(kardex.unidad.id)) arrUnidades.push(kardex.unidad.id);
			});
			arrUnidades.forEach(unidad => {
				const arrKardex = stock.kardex.filter(kardex => kardex.unidad.id === unidad);
				let total = 0;
				arrKardex.forEach(kardex => {
					total += parseFloat(kardex.cantidad);
				});
				stockAlmacen.push({
					id: unidad,
					nombre: arrKardex[0].unidad.nombre,
					prefijo: arrKardex[0].unidad.prefijo,
					cantidad: total,
				});
			});
			arrayStock.push({
				...element,
				stockAlmacen,
			});
		});
		return arrayStock;
	};

	useEffect(() => {
		if (data) {
			getPedidosId(data.id);
		}
	}, [data]);

	return (
		<div>
			<Modal
				width={900}
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={modalOpen}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={modalOpen}>
					<Box sx={style}>
						<Typography id="transition-modal-title" variant="h6" component="h2">
							{data.codigo ?? 'Titulo'}
						</Typography>
						<div style={{ height: 600, width: '100%' }}>
							<DataGrid
								loading={produccion.length === 0 && cargando}
								rows={produccion}
								columns={columns}
								pageSize={10}
								rowsPerPageOptions={[5]}
								checkboxSelection
								onSelectionModelChange={row => {
									const selectedIDs = new Set(row);
									const selectedRowData = produccion.filter(prod =>
										selectedIDs.has(prod.id.toString())
									);
									setTemporalSeleccionado(selectedRowData);
								}}
							/>
						</div>

						<div style={{ textAlign: 'end', marginTop: '15px' }}>
							<Button
								disabled={temporalSeleccionado.length === 0}
								variant="contained"
								size="large"
								onClick={() => {
									setModalOpen(false);
									setDataSeleccionada(temporalSeleccionado);
								}}
							>
								Seleccionar
							</Button>
							&nbsp;
							<Button
								variant="contained"
								size="large"
								onClick={() => {
									setModalOpen(false);
									setDataSeleccionada([]);
								}}
							>
								Cerrar
							</Button>
						</div>
					</Box>
				</Fade>
			</Modal>
		</div>
	);
}

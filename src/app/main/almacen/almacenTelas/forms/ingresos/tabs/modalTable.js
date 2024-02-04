import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';

import httpClient from 'utils/Api';

import Typography from '@mui/material/Typography';
import obtenerColorCliente from 'utils/obtenerColorCliente';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 1000,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

const columns = [
	{ field: 'tela', headerName: 'Tela', minWidth: 350, flex: 1 },
	{
		field: 'color',
		headerName: 'Color',
		flex: 1,
		minWidth: 180,
	},
	{
		field: 'colorCliente',
		headerName: 'Color Cliente',
		flex: 1,
		minWidth: 180,
	},
	{ field: 'cantidad', headerName: 'Cantidad', width: 100 },
];

export default function ModalTable({ modalOpen, setModalOpen, data, setDataSeleccionada }) {
	const [loading, setLoading] = useState(false);
	const [produccion, setProduccion] = useState([]);
	const [temporalSeleccionado, setTemporalSeleccionado] = useState([]);

	useEffect(() => {
		if (data) {
			traerOrdenDeComprasTelas(data);
		}
	}, [data]);

	const traerOrdenDeComprasTelas = async dataOC => {
		setLoading(true);
		const array = [];
		const response = await httpClient.get(`comercial/compra-telas/${dataOC.id}`);
		const dataBody = await response.data.body;
		const dataEstilos = dataBody.detalleOrdenComprasTelas;
		console.log(
			'🚀 ~ file: modalTable.js:60 ~ traerOrdenDeComprasTelas ~ dataEstilos:',
			dataEstilos
		);
		dataEstilos.forEach(dataEstilo => {
			array.push({
				...dataEstilo,
				codigo: dataEstilo.producto.codigo,
				tela: dataEstilo.producto.tela.nombre,
				color: dataEstilo.producto.color.descripcion,
				colorCliente: dataEstilo.producto.colorCliente,
				// colorCliente: obtenerColorCliente(
				// 	dataEstilo.producto.color,
				// 	dataBody?.produccion?.coloresCliente || [],
				// 	dataEstilo.producto.estilo
				// ),
			});
		});

		// Eliminar data repetida del array
		const arrayUnique = [...new Set(array.map(item => item.id))].map(sid => {
			return array.find(item => item.id === sid);
		});

		console.log('arrayUnique', [...arrayUnique]);

		let arrayFiltered = arrayUnique;
		//* Filtrar telas por OP
		if (dataOC.produccion) {
			arrayFiltered = await filtroIngresosOP(dataOC, arrayUnique);
		}
		console.log('HV.Hello World', arrayFiltered);
		setProduccion(arrayFiltered);
		setLoading(false);
	};

	const filtroIngresosOP = async (dataOC, arrayUnique) => {
		const array = [];
		const arrayFiltered = [];
		const response = await httpClient.get(
			`almacen-tela/ingreso/ingresos/op/${dataOC.produccion.id}`
		);
		if (response.data.body.length > 0) {
			response.data.body.forEach(dataBody => {
				const ingresos = dataBody.detallesProductosIngresosAlmacenesTelas;
				ingresos.forEach(ingreso => {
					// Creo un arreglo con los identificadores para comparar con el arrayUnique
					array.push({
						telaId: ingreso.producto.tela.id,
						colorId: ingreso.producto.color.id,
						cantidad: parseFloat(ingreso.cantidad),
						cantidadRollos: parseFloat(ingreso.cantidadRollos),
					});
				});
			});

			arrayUnique.forEach(origen => {
				// Buscamos todos los registros que coincidan con el arreglo de identificadores
				const item = array.filter(
					i => i.telaId === origen.producto.tela.id && i.colorId === origen.producto.color.id
				);
				if (item.length > 0) {
					const cantidad = item.reduce((a, b) => a + b.cantidad, 0);
					// Se valida la cantidad de la orden de compra con la cantidad de los ingresos y se resta en caso de que sea mayor
					if (origen.cantidad > cantidad) {
						arrayFiltered.push({
							...origen,
							cantidad: (parseFloat(origen.cantidad) - cantidad).toFixed(3),
						});
					}
				} else {
					// En caso de que no existan coincidencias, se agrega el registro al array
					arrayFiltered.push(origen);
				}
			});
			return arrayFiltered;
		}
		return arrayUnique;
	};

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
								loading={loading}
								rows={produccion}
								columns={columns}
								pageSize={10}
								rowsPerPageOptions={[5]}
								checkboxSelection
								onSelectionModelChange={row => {
									const selectedIDs = new Set(row);
									const selectedRowData = produccion.filter(prod => selectedIDs.has(prod.id));
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

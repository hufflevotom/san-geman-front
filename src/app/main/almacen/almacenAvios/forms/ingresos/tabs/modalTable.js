import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';

import httpClient from 'utils/Api';

import Typography from '@mui/material/Typography';

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
	{ field: 'codigo', headerName: 'Codigo', flex: 0.5, minWidth: 150 },
	{ field: 'avio', headerName: 'Avio', minWidth: 350, flex: 1 },
	{
		field: 'talla',
		headerName: 'Talla',
		flex: 1,
		minWidth: 180,
	},
	{ field: 'cantidad', headerName: 'Cantidad', width: 100 },
];

export default function ModalTable({ modalOpen, setModalOpen, data, setDataSeleccionada }) {
	const [produccion, setProduccion] = useState([]);
	const [temporalSeleccionado, setTemporalSeleccionado] = useState([]);
	console.log('DETALLEaasdf asdf asdf asdf asdf: ', data);
	useEffect(() => {
		if (data) {
			traerOrdenDeComprasAvios(data.id);
		}
	}, [data]);

	const traerOrdenDeComprasAvios = async id => {
		const array = [];
		const response = await httpClient.get(`comercial/compra-avios/${id}`);
		const dataBody = await response.data.body;
		const { detalleOrdenComprasAvios } = dataBody;
		// eslint-disable-next-line array-callback-return
		detalleOrdenComprasAvios.map(detalleOrdenCompraAvio => {
			array.push({
				...detalleOrdenCompraAvio,
				codigo: detalleOrdenCompraAvio.producto.codigo,
				avio: detalleOrdenCompraAvio.producto.avio.nombre,
				talla: detalleOrdenCompraAvio.producto.talla?.talla ?? '',
			});
		});

		// Eliminar data repetida del array
		// eslint-disable-next-line no-shadow
		const arrayUnique = [...new Set(array.map(item => item.id))].map(id => {
			return array.find(item => item.id === id);
		});

		// setProduccion(array);
		console.log('arrayUnique: ', arrayUnique);
		setProduccion(arrayUnique);
	};

	return (
		<div>
			<Modal
				width={900}
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={modalOpen}
				// onClose={() => setModalOpen(false)}
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
								loading={produccion.length === 0}
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

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
	// { field: 'codigo', headerName: 'Codigo', flex: 0.5, minWidth: 150 },
	{ field: 'tela', headerName: 'Tela', minWidth: 350, flex: 1 },
	{
		field: 'color',
		headerName: 'Color',
		flex: 1,
		minWidth: 180,
		/* resizable: false,
		renderCell: rows => (
			<div style={{ overflowWrap: 'break-word' }}>
				<p style={{ wordBreak: 'break-all' }}>{rows.value}</p>
			</div>
		), */
	},
	{ field: 'telaProgramadaUnidad', headerName: 'Cantidad', width: 100 },
];

export default function ModalTable({ modalOpen, setModalOpen, data, setDataSeleccionada }) {
	const [produccion, setProduccion] = useState([]);
	const [temporalSeleccionado, setTemporalSeleccionado] = useState([]);

	useEffect(() => {
		if (data) {
			traerOrdenDeComprasTelas(data.id);
		}
	}, [data]);

	const traerOrdenDeComprasTelas = async id => {
		const array = [];
		const response = await httpClient.get(`logistica/orden-servicio-corte/${id}`);
		const dataBody = await response.data.body;
		const dataEstilos = dataBody.ordenesCortePaños;
		dataEstilos.forEach(dataEstilo => {
			dataEstilo.extras.forEach(extra => {
				array.push({
					...extra,
					codigo: extra.productoTela.codigo,
					tela: extra.productoTela.tela.nombre,
					color: extra.productoTela.color.descripcion,
				});
			});
		});
		// * Suma las cantidades por producto tela
		const arrayUnique = [];
		array.forEach(item => {
			const index = arrayUnique.findIndex(
				element => element.productoTela.id === item.productoTela.id
			);
			if (index === -1) {
				arrayUnique.push(item);
			} else {
				arrayUnique[index].telaProgramada += item.telaProgramada;
			}
		});

		setProduccion(
			arrayUnique.map(e => ({
				...e,
				telaProgramadaUnidad: `${e.telaProgramada} ${
					e.productoTela.unidadMedida ? e.productoTela.unidadMedida.prefijo : ''
				}`,
			}))
		);
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

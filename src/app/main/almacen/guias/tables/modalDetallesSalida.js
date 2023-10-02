import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import {
	Backdrop,
	Fade,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import { useState } from 'react';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 1300,
	height: '90%',
	bgcolor: 'background.paper',
	border: '2px solid #ccc',
	borderRadius: '10px',
	boxShadow: 24,
	p: 4,
	overflowY: 'scroll',
};

const styleBorder = {
	border: '1px solid #ccc',
};

const ModalDetallesSalida = ({ openModal, setOpenModal, dataModal }) => {
	const [dataTable, setDataTable] = useState(dataModal);

	return (
		<div>
			<Modal
				width={1200}
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={openModal}
				// onClose={() => setModalOpen(false)}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={openModal}>
					<Box sx={style}>
						{dataTable?.tipoComprobante && (
							<h2>Tipo de Comprobante: {`${dataTable?.tipoComprobante}`}</h2>
						)}
						{dataTable?.nroSerie && dataTable?.nroDocumento && (
							<h2>
								Nro Documento de Referencia: {`${dataTable?.nroSerie} - ${dataTable?.nroDocumento}`}
							</h2>
						)}
						<br />
						<TableContainer component={Paper}>
							<Table aria-label="spanning table">
								<TableHead>
									<TableRow style={{ backgroundColor: '#e1e1e1' }}>
										{/* <TableCell align="center" style={styleBorder} width={120}>
											CÓDIGO
										</TableCell> */}
										<TableCell align="center" style={styleBorder} width={220}>
											DESCRIPCIÓN
										</TableCell>
										<TableCell align="center" style={styleBorder} width={150}>
											COLORES
										</TableCell>
										<TableCell align="center" style={styleBorder} width={100}>
											CANTIDAD
										</TableCell>
										<TableCell align="center" style={styleBorder} width={120}>
											NÚMERO DE PARTIDA
										</TableCell>
										<TableCell align="center" style={styleBorder} width={120}>
											CANT DE ROLLOS
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{dataTable?.detallesProductosSalidasAlmacenesTelas?.map(row => {
										return (
											<TableRow key={row.id}>
												{/* <TableCell width={120} style={styleBorder}>
													{row.producto.codigo}
												</TableCell> */}
												<TableCell width={220} style={styleBorder}>
													{row.producto.tela.nombre}
												</TableCell>
												<TableCell width={150} style={styleBorder} align="center">
													{row.producto.color.descripcion}
												</TableCell>
												<TableCell width={100} style={styleBorder} align="center">
													{`${row.cantidad} ${row.unidad?.prefijo}`}
												</TableCell>
												<TableCell width={100} style={styleBorder} align="center">
													{row.producto.partida}
												</TableCell>
												<TableCell width={100} style={styleBorder} align="center">
													{row.cantidadRollos}
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</TableContainer>
						{dataTable?.observacion && (
							<div style={{ paddingTop: '20px' }}>Observación: {`${dataTable?.observacion}`}</div>
						)}
						<br />
						<div style={{ textAlign: 'end' }}>
							<Button variant="contained" size="medium" onClick={() => setOpenModal(false)}>
								Aceptar
							</Button>
						</div>
					</Box>
				</Fade>
			</Modal>
		</div>
	);
};

export default ModalDetallesSalida;

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
	width: '90%',
	height: '80%',
	overflowY: 'scroll',
	bgcolor: 'background.paper',
	border: '2px solid #ccc',
	borderRadius: '10px',
	boxShadow: 24,
	p: 4,
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
						{dataTable?.origen !== 'INVENTARIO' && (
							<>
								<h2>Tipo de Operacion: {`${dataTable?.tipoOperacion}`}</h2>
								{/* <h2>Tipo de Comprobante: {`${dataTable?.tipoComprobante}`}</h2> */}
								{/* <h2>
									Nro Documento de Referencia:{' '}
									{`${dataTable?.nroSerie} - ${dataTable?.nroDocumento}`}
								</h2> */}
								{dataTable?.ordenCompra ? (
									<h2>Orden de compra: {`${dataTable?.ordenCompra?.codigo}`}</h2>
								) : null}
								<br />
							</>
						)}
						<TableContainer component={Paper}>
							<Table aria-label="spanning table">
								<TableHead>
									<TableRow style={{ backgroundColor: '#e1e1e1' }}>
										<TableCell align="center" style={styleBorder} width={120}>
											CÓDIGO
										</TableCell>
										<TableCell align="center" style={styleBorder} width={220}>
											DESCRIPCIÓN
										</TableCell>
										<TableCell align="center" style={styleBorder} width={220}>
											TIPO
										</TableCell>
										<TableCell align="center" style={styleBorder} width={100}>
											CANT
										</TableCell>
										<TableCell align="center" style={styleBorder} width={100}>
											UNIDAD
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{dataTable?.detallesProductosSalidasAlmacenesAvios?.map(row => {
										return (
											<TableRow key={row.id}>
												<TableCell width={120} style={styleBorder}>
													{row.producto?.codigo}
												</TableCell>
												<TableCell width={220} style={styleBorder}>
													{row.producto?.avio.familiaAvios?.id === 1
														? `${row.producto?.avio.nombre} - ${row.producto?.avio.codigoSec} - ${
																row.producto?.avio.marcaHilo
														  } - ${row.producto?.avio.color?.descripcion}${
																row.producto?.avio.talla
																	? ` - Talla: ${row.producto?.avio.talla.prefijo}`
																	: ''
														  }`
														: `${row.producto?.avio.nombre}${
																row.producto?.avio.talla
																	? ` - Talla: ${row.producto?.avio.talla.prefijo}`
																	: ''
														  }`}
												</TableCell>
												<TableCell width={220} style={styleBorder}>
													{row.producto?.avio?.tipo}
												</TableCell>
												<TableCell width={100} style={styleBorder} align="center">
													{row.cantidad}
												</TableCell>
												<TableCell width={100} style={styleBorder} align="center">
													{row.unidad?.nombre}
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

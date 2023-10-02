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

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 1300,
	bgcolor: 'background.paper',
	border: '2px solid #ccc',
	borderRadius: '10px',
	boxShadow: 24,
	p: 4,
};

const styleBorder = {
	border: '1px solid #ccc',
};

const ModalDetalle = ({ openModal, setOpenModal, dataModal }) => {
	console.log(dataModal);
	return (
		<div>
			<Modal
				width={1200}
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={openModal}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={openModal}>
					<Box sx={style}>
						{dataModal.indicadorTipo === 'T'
							? dataModal.registrosIngresoAlmacenTela.map(row => (
									<>
										<h4>{`${row?.nNota}`}</h4>
										<h4>
											Nro Documento de Referencia: {`${row?.nroSerie} - ${row?.nroDocumento}`}
										</h4>
										<br />
										<TableContainer component={Paper}>
											<Table aria-label="spanning table">
												<TableHead>
													<TableRow style={{ backgroundColor: '#e1e1e1' }}>
														<TableCell align="center" style={styleBorder} width={220}>
															DESCRIPCIÓN
														</TableCell>
														<TableCell align="center" style={styleBorder} width={150}>
															COLORES
														</TableCell>
														<TableCell align="center" style={styleBorder} width={100}>
															CANT DE INGRESO
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
													{row?.detallesProductosIngresosAlmacenesTelas?.map(detalle => {
														return (
															<TableRow key={detalle.id}>
																<TableCell width={220} style={styleBorder}>
																	{detalle.producto.tela.nombre}
																</TableCell>
																<TableCell width={150} style={styleBorder} align="center">
																	{detalle.producto.color.descripcion}
																</TableCell>
																<TableCell width={100} style={styleBorder} align="center">
																	{`${detalle.cantidad} ${detalle.unidad?.prefijo}`}
																</TableCell>
																<TableCell width={100} style={styleBorder} align="center">
																	{detalle.producto.partida}
																</TableCell>
																<TableCell width={100} style={styleBorder} align="center">
																	{detalle.cantidadRollos}
																</TableCell>
															</TableRow>
														);
													})}
												</TableBody>
											</Table>
										</TableContainer>
									</>
							  ))
							: dataModal.registrosIngresoAlmacenAvio?.map(row => (
									<>
										<h4>{`${row?.nNota}`}</h4>
										<h4>
											Nro Documento de Referencia: {`${row?.nroSerie} - ${row?.nroDocumento}`}
										</h4>
										<br />
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
													{row?.detallesProductosIngresosAlmacenesAvios?.map(detalle => {
														return (
															<TableRow key={detalle.id}>
																<TableCell width={120} style={styleBorder}>
																	{detalle.producto?.codigo}
																</TableCell>
																<TableCell width={220} style={styleBorder}>
																	{detalle.producto?.avio.familiaAvios?.id === 1
																		? `${detalle.producto?.avio.nombre} - ${
																				detalle.producto?.avio.codigoSec
																		  } - ${detalle.producto?.avio.marcaHilo} - ${
																				detalle.producto?.avio.color?.descripcion
																		  }${
																				detalle.producto?.avio.talla
																					? ` - Talla: ${detalle.producto?.avio.talla.prefijo}`
																					: ''
																		  }`
																		: `${detalle.producto?.avio.nombre}${
																				detalle.producto?.avio.talla
																					? ` - Talla: ${detalle.producto?.avio.talla.prefijo}`
																					: ''
																		  }`}
																</TableCell>
																<TableCell width={220} style={styleBorder}>
																	{detalle.producto?.avio?.tipo}
																</TableCell>
																<TableCell width={100} style={styleBorder} align="center">
																	{detalle.cantidad}
																</TableCell>
																<TableCell width={100} style={styleBorder} align="center">
																	{detalle.unidad?.nombre}
																</TableCell>
															</TableRow>
														);
													})}
												</TableBody>
											</Table>
										</TableContainer>
									</>
							  ))}
						<div style={{ textAlign: 'end', marginTop: '20px' }}>
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

export default ModalDetalle;

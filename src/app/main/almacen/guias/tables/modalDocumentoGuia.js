import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import {
	Autocomplete,
	Backdrop,
	Fade,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import httpClient from 'utils/Api';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 1200,
	height: '90%',
	bgcolor: 'background.paper',
	border: '2px solid #ccc',
	borderRadius: '10px',
	overflowY: 'scroll',
	p: 4,
};

const styleBorder = {
	border: '1px solid #ccc',
};

const ModalDocumentoSalida = ({ openModal, setOpenModal, dataModal }) => {
	const [dataTable, setDataTable] = useState();

	const getGuia = async id => {
		const url = `almacen-tela/guia/${id}`;
		const response = await httpClient.get(url);
		const data = await response.data.body;
		setDataTable(data);
	};

	useEffect(() => {
		getGuia(dataModal.id);
	}, [dataModal]);

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
						{dataTable && (
							<>
								<h2>{dataTable.idNota}</h2>
								<br />
								<div className="flex flex-row">
									<div className="w-full flex flex-col sm:flex-row mr-24 sm:mr-4">
										<TextField
											className="mt-8 mb-16 mx-12"
											id="destino"
											label="Destino"
											variant="outlined"
											value={dataTable.destino}
											fullWidth
											disabled
										/>
									</div>
									<div className="w-full flex flex-col sm:flex-row mr-24 sm:mr-4">
										<Autocomplete
											className="mt-8 mb-16 mx-12"
											multiple
											freeSolo
											isOptionEqualToValue={(opt, val) => opt.id === val.id}
											value={dataTable.registrosSalidaAlmacenTelas.map(e => ({
												...e,
												label: e.nNota,
											}))}
											fullWidth
											disabled
											renderInput={params => (
												<TextField
													{...params}
													placeholder="Seleccione las salidas"
													label="Salidas"
													variant="outlined"
													fullWidth
													InputLabelProps={{
														shrink: true,
													}}
												/>
											)}
										/>
									</div>
								</div>
								<div>
									{dataTable.registrosSalidaAlmacenTelas.map(salidas => (
										<div style={{ marginBottom: '20px' }}>
											<div>{salidas.nNota}</div>
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
														{salidas?.detallesProductosSalidasAlmacenesTelas?.map(row => {
															return (
																<TableRow key={row.id}>
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
										</div>
									))}
								</div>
							</>
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

export default ModalDocumentoSalida;

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
import httpClient from 'utils/Api';
import { useEffect, useState } from 'react';
import moment from 'moment';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '90%',
	height: '80%',
	bgcolor: 'background.paper',
	border: '2px solid #ccc',
	borderRadius: 3,
	overflowY: 'scroll',
	boxShadow: 24,
	p: 4,
};

const styleBorder = {
	border: '1px solid #ccc',
};

const ModalDetalles = ({ openModal, setOpenModal, dataModal }) => {
	const [dataTable, setDataTable] = useState(null);

	useEffect(() => {
		getAlmacenTelasId(dataModal.id, dataModal.tipo);
	}, [dataModal]);

	const getAlmacenTelasId = async (id, tipo) => {
		const url = `almacen-tela/${tipo}/${id}`;
		const response = await httpClient.get(url);
		const data = await response.data.body;
		setDataTable(data);
	};

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
						<div
							style={{
								width: '100%',
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
								marginBottom: '20px',
							}}
						>
							{(dataTable?.tipoOperacion ||
								dataTable?.ordenCompra ||
								dataTable?.produccion ||
								dataTable?.proveedor) && (
								<div
									style={{
										width: '100%',
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'start',
										justifyContent: 'center',
									}}
								>
									{dataTable?.tipoOperacion && (
										<h3>Tipo de Operación: {`${dataTable?.tipoOperacion}`}</h3>
									)}
									{dataTable?.ordenCompra && dataTable?.ordenCompra?.codigo && (
										<h3>Orden de compra: {`${dataTable?.ordenCompra?.codigo}`}</h3>
									)}
									{dataTable?.proveedor && (
										<h3>
											Proveedor:{' '}
											{dataTable.proveedor?.tipo === 'N'
												? `${dataTable.proveedor?.apellidoPaterno} ${dataTable.proveedor?.apellidoMaterno}, ${dataTable.proveedor?.nombres}`
												: dataTable.proveedor?.razonSocial}
										</h3>
									)}
									{dataTable?.produccion && <h3>Proveedor: {dataTable.produccion?.codigo}</h3>}
								</div>
							)}
							{(dataTable?.created_at ||
								dataTable?.tipoComprobante ||
								dataTable?.nroSerie ||
								dataTable?.nroDocumento) && (
								<div
									style={{
										width: '100%',
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'start',
										justifyContent: 'center',
									}}
								>
									{dataTable?.created_at && (
										<h3>
											Fecha de registro:{' '}
											{`${moment(dataTable?.created_at || '').format('DD/MM/YYYY')}`}
										</h3>
									)}
									{dataTable?.tipoComprobante && (
										<h3>Tipo de Comprobante: {`${dataTable?.tipoComprobante}`}</h3>
									)}
									{dataTable?.nroSerie && dataTable?.nroDocumento && (
										<h3>
											Nro Documento de Referencia:{' '}
											{`${dataTable?.nroSerie} - ${dataTable?.nroDocumento}`}
										</h3>
									)}
								</div>
							)}
						</div>
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
										<TableCell align="center" style={styleBorder} width={150}>
											COLOR CLIENTE
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
									{dataTable?.detallesProductosIngresosAlmacenesTelas?.map(row => {
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
												<TableCell width={150} style={styleBorder} align="center">
													{row.producto.colorCliente || '-'}
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

export default ModalDetalles;

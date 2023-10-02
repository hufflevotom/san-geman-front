import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {
	Backdrop,
	Fade,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
	Tooltip,
} from '@mui/material';
import moment from 'moment';
import httpClient from 'utils/Api';
import { useEffect, useState } from 'react';
import IngresosTableHead from './ingresos/ingresosTableHead';

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

const ModalDetallesReporte = ({
	openModal,
	setOpenModal,
	dataModal,
	setOpenModalIngreso,
	setOpenModalSalida,
	setDataModalIngreso,
	setDataModalSalida,
}) => {
	console.log('DATA MODAL: ', dataModal);

	const [dataTable, setDataTable] = useState([]);

	useEffect(() => {
		getProduccion(dataModal.id, dataModal.tipo);
	}, [dataModal]);

	const getProduccion = async (id, tipo) => {
		let url = `almacen-tela/salida/getAllOp/${id}`;
		if (tipo === 'ingresos') {
			url = `almacen-tela/ingreso/getAllOp/${id}`;
		}
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
						{dataModal.tipo === 'ingresos' ? (
							<Ingreso
								dataTablaIngreso={dataTable}
								setOpenModal={setOpenModalIngreso}
								setDataModal={setDataModalIngreso}
							/>
						) : (
							<Salida
								dataTablaSalida={dataTable}
								setOpenModal={setOpenModalSalida}
								setDataModal={setDataModalSalida}
							/>
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

const Ingreso = ({ dataTablaIngreso, setOpenModal, setDataModal }) => {
	console.log('dataTablaIngreso: ', dataTablaIngreso);
	const [data, setData] = useState([]);
	const formatDate = date => {
		const fecha = moment(date).locale('es');
		/* return fecha.format('DD [de] MMMM [del] YYYY'); */
		return fecha.format('DD/MM/YYYY');
	};

	useEffect(() => {
		if (dataTablaIngreso) setData(dataTablaIngreso);
	}, [dataTablaIngreso]);

	return (
		<TableContainer component={Paper}>
			<Table aria-label="spanning table">
				<TableHead>
					<TableRow style={{ backgroundColor: '#e1e1e1' }}>
						{[
							{
								id: 'Nota',
								align: 'left',
								disablePadding: false,
								label: 'Nota',
								sort: true,
							},

							{
								id: 'O/C',
								align: 'left',
								disablePadding: false,
								label: 'O/C',
								sort: true,
							},
							{
								id: 'Fecha de Ingreso',
								align: 'left',
								disablePadding: false,
								label: 'Fecha de Ingreso',
								sort: true,
							},
							{
								id: 'Marca',
								align: 'left',
								disablePadding: false,
								label: 'Marca',
								sort: true,
							},
							{
								id: 'serieReferencia',
								align: 'left',
								disablePadding: false,
								label: 'Serie - Referencia',
								sort: true,
							},
							{
								id: 'proveedor',
								align: 'left',
								disablePadding: false,
								label: 'Proveedor',
								sort: true,
							},
							{
								id: 'detalles',
								align: 'right',
								disablePadding: false,
								label: 'Detalles',
								sort: true,
								width: '180px',
							},
						].map(row => {
							return (
								<TableCell
									key={row.id}
									style={styleBorder}
									align={row.align}
									width={row.width ? row.width : ''}
								>
									{row.label}
								</TableCell>
							);
						}, this)}
					</TableRow>
				</TableHead>
				<TableBody>
					{data.map(n => {
						return (
							<TableRow key={n.id}>
								<TableCell style={styleBorder}>{n.nNota}</TableCell>

								<TableCell style={styleBorder}>
									{n.ordenCompra ? n.ordenCompra.codigo : 'No tiene Órden de Compra'}
								</TableCell>

								<TableCell style={styleBorder}>
									{formatDate(n.fechaRegistro || n.created_at)}
								</TableCell>

								<TableCell style={styleBorder}>
									{n.registroOp?.produccion?.marca
										? n.registroOp?.produccion?.marca.marca
										: 'No tiene Marca'}
								</TableCell>

								<TableCell style={styleBorder}>
									{n.nroSerie} - {n.nroDocumento}
								</TableCell>

								<TableCell style={styleBorder}>
									{n.proveedor?.tipo === 'N'
										? `${n.proveedor?.apellidoPaterno} ${n.proveedor?.apellidoMaterno}, ${n.proveedor?.nombres}`
										: n.proveedor?.razonSocial}
								</TableCell>

								<TableCell style={styleBorder}>
									<IconButton
										size="small"
										color="primary"
										onClick={() => {
											setOpenModal(true);
											setDataModal({
												id: n.id,
												tipo: 'ingreso',
											});
										}}
									>
										<RemoveRedEyeIcon />
									</IconButton>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

const Salida = ({ dataTablaSalida }) => {
	return (
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
					{dataTablaSalida?.detallesProductosSalidasAlmacenesAvios?.map(row => {
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
	);
};

export default ModalDetallesReporte;

import { useNavigate } from 'react-router-dom';

import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import moment from 'moment';
import { useState } from 'react';
import ModalDetallesOC from './ordenesCorteModal';

function ModalDetalles({ visible, setVisible, dataModal }) {
	const navigate = useNavigate();

	const [openModal, setOpenModal] = useState(false);
	const [dataDetalles, setDataDetalles] = useState();

	return (
		<Dialog
			open={visible}
			onClose={() => setVisible(false)}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			PaperProps={{
				sx: {
					width: '100%',
					maxWidth: '720px!important',
				},
			}}
		>
			<DialogTitle id="alert-dialog-title">
				Orden de corte Nº {dataModal.codigo.toString().padStart(6, '0')}
			</DialogTitle>
			<DialogContent>
				<Table>
					<TableHead>
						<TableRow className="h-72 cursor-pointer" tabIndex={-1}>
							<TableCell className="p-4 md:p-16" component="th" scope="row">
								Sub Código
							</TableCell>
							<TableCell className="p-4 md:p-16" component="th" scope="row">
								Molde
							</TableCell>
							<TableCell className="p-4 md:p-16" component="th" scope="row">
								Fecha
							</TableCell>
							<TableCell className="p-4 md:p-16" component="th" scope="row">
								Producción
							</TableCell>
							<TableCell className="p-4 md:p-16" component="th" scope="row">
								Acciones
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{dataModal.ordenesCorte.map((n, i) => (
							<TableRow className="h-72 cursor-pointer" hover tabIndex={-1} key={n.id}>
								<TableCell className="p-4 md:p-16" component="th" scope="row">
									{n.subCodigo.toString()}
								</TableCell>
								<TableCell className="p-4 md:p-16" component="th" scope="row">
									{n.molde}
								</TableCell>
								<TableCell className="p-4 md:p-16" component="th" scope="row">
									{moment(n.fecha).format('DD/MM/YYYY')}
								</TableCell>
								<TableCell className="p-4 md:p-16" component="th" scope="row">
									{n.produccion.codigo}
								</TableCell>
								<TableCell
									className="p-4 md:p-16"
									component="th"
									scope="row"
									style={{ textAlign: 'end' }}
								>
									<div
										style={{
											width: '100%',
											display: 'flex',
											flexDirection: 'row',
											alignItems: 'center',
											justifyContent: 'space-between',
										}}
									>
										<IconButton
											size="small"
											color="primary"
											onClick={() => {
												setOpenModal(true);
												setDataDetalles(n);
											}}
										>
											<RemoveRedEyeIcon />
										</IconButton>
										<IconButton
											size="small"
											color="success"
											onClick={() => navigate(`/consumos-modelaje/ordenes-corte/${n.id}?action=ET`)}
										>
											<EditIcon />
										</IconButton>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => {
						setVisible(false);
					}}
				>
					Cerrar
				</Button>
				{/* <Button
					onClick={() => {
						// setVisible(false);
						// navigate(`/consumos-modelaje/ordenes-corte/${item.id}`);
					}}
				>
					Agregar Sub Orden de Corte
				</Button> */}
			</DialogActions>
			{openModal && (
				<ModalDetallesOC
					openModal={openModal}
					setOpenModal={setOpenModal}
					dataModal={dataDetalles}
				/>
			)}
		</Dialog>
	);
}

export default ModalDetalles;

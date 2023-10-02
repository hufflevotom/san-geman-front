/* eslint-disable no-throw-literal */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Backdrop, Fade } from '@mui/material';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 500,
	bgcolor: 'background.paper',
	border: '2px solid #ccc',
	borderRadius: '10px',
	boxShadow: 24,
	p: 4,
};

const ModalConfirmarEstado = ({ openModal, setOpenModal, estado, arrEstados, confirmar }) => {
	return (
		<div>
			<Modal
				width={500}
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
						<h2>
							¿Estás seguro de cambiar el estado {estado.estado} a {arrEstados[estado.estado]}?
						</h2>
						<br />
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								gap: '20px',
								alignItems: 'end',
								justifyContent: 'end',
							}}
						>
							<Button
								variant="contained"
								size="medium"
								onClick={() => confirmar({ id: estado.id, state: estado.estado })}
							>
								Confirmar
							</Button>
							<Button
								variant="contained"
								size="medium"
								color="secondary"
								onClick={() => setOpenModal(false)}
							>
								Cerrar
							</Button>
						</div>
					</Box>
				</Fade>
			</Modal>
		</div>
	);
};

export default ModalConfirmarEstado;

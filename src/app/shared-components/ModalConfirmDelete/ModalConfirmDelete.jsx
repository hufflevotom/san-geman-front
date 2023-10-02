import { Backdrop, Box, Button, Fade, Modal } from '@mui/material';
import PropTypes from 'prop-types';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '350px',
	height: 'auto',
	overflowY: 'scroll',
	bgcolor: 'background.paper',
	border: '2px solid #ccc',
	borderRadius: '10px',
	boxShadow: 24,
	p: 4,
};

const ModalConfirmDelete = ({ visible, setVisible, callback, register }) => {
	return (
		<Modal
			width={500}
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			open={visible}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
		>
			<Fade in={visible}>
				<Box sx={style}>
					<div style={{ marginBottom: '20px', textAlign: 'center', fontSize: '14px' }}>
						¿Está seguro de eliminar {register || 'este registro'}?
					</div>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						className="w-full mx-auto mt-16"
						aria-label="accept"
						value="legacy"
						onClick={() => callback()}
					>
						Si, eliminar
					</Button>
					<Button
						type="button"
						variant="contained"
						color="secondary"
						className="w-full mx-auto mt-16"
						aria-label="cancel"
						value="legacy"
						onClick={() => setVisible(false)}
					>
						Cancelar
					</Button>
				</Box>
			</Fade>
		</Modal>
	);
};

ModalConfirmDelete.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	callback: PropTypes.func.isRequired,
	register: PropTypes.string,
};

export default ModalConfirmDelete;

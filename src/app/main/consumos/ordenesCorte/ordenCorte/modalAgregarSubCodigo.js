import { useNavigate } from 'react-router-dom';

import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@mui/material';

function ModalAgregarSubCodigo({ visible, setVisible, handleAgregarSubCodigo }) {
	const navigate = useNavigate();
	return (
		<Dialog
			open={visible}
			onClose={() => setVisible(false)}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">Sub Orden de Corte</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					¿Desea crear un nuevo subcódigo para esta Orden?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => {
						setVisible(false);
						navigate(`/consumos-modelaje/ordenes-corte`);
					}}
				>
					No
				</Button>
				<Button onClick={handleAgregarSubCodigo} autoFocus>
					Si
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ModalAgregarSubCodigo;

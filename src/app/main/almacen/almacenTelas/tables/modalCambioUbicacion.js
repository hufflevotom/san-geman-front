/* eslint-disable no-throw-literal */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Backdrop, Fade, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { cambioUbicacion, getKardex } from '../../store/almacenTela/kardex/kardexTelasSlice';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 600,
	bgcolor: 'background.paper',
	border: '2px solid #ccc',
	borderRadius: '10px',
	boxShadow: 24,
	p: 4,
};

const ModalCambioUbicacion = ({ openModal, setOpenModal, dataModal }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [ubicacion, setUbicacion] = useState();

	async function guardar() {
		toast.promise(
			() => save(),
			{
				pending: 'Guardando Ubicación',
				success: {
					render({ data }) {
						return `Guardado`;
					},
				},
				error: {
					render({ data }) {
						return `Error`;
					},
				},
			},
			{ theme: 'colored' }
		);
	}

	const save = async () => {
		try {
			if (ubicacion === undefined || ubicacion === '') {
				throw { payload: { message: 'Complete todos los datos de las telas' } };
			}

			const error = await dispatch(cambioUbicacion({ id: dataModal.data.id, ubicacion }));
			if (error.error) throw error;
			dispatch(
				getKardex({
					offset: dataModal.page * dataModal.rowsPerPage,
					limit: dataModal.rowsPerPage,
					busqueda: dataModal.searchText,
					tipoBusqueda: 'agregar',
				})
			);
			setOpenModal(false);
			return error;
		} catch (error) {
			console.error('Error:', error);
			throw error;
		}
	};

	return (
		<div>
			<Modal
				width={1200}
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={openModal}
				// onClose={() => setOpenModal(false)}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={openModal}>
					<Box sx={style}>
						<h2>Cambio de ubicación</h2>
						<br />
						<TextField
							name="ubicacion"
							placeholder="Ingrese la Ubicación"
							className="mt-8 mb-16 mx-12 w-5/6"
							label="Ubicación"
							variant="outlined"
							fullWidth
							value={ubicacion}
							// onBlur={() => {
							// 	setUbicacion(ubicacion);
							// }}
							onChange={e => {
								setUbicacion(e.target.value);
							}}
							required
							InputLabelProps={{
								shrink: true,
							}}
						/>
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
							<Button variant="contained" size="medium" onClick={guardar}>
								Guardar
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

export default ModalCambioUbicacion;

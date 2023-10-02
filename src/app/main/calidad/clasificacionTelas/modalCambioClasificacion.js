/* eslint-disable no-throw-literal */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Autocomplete, Backdrop, Fade, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { getKardex } from 'app/main/almacen/store/almacenTela/kardex/kardexTelasSlice';
import { cambioClasificacion } from '../store/clasificacionTelas/clasificacionTelaSlice';

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

const ModalCambioClasificacion = ({ openModal, setOpenModal, dataModal }) => {
	const dispatch = useDispatch();
	const cantidadMax = parseFloat(dataModal.data.cantidad || 0);
	const [clasificacion, setClasificacion] = useState();
	const [cantidad, setCantidad] = useState(1);
	const [rollos, setRollos] = useState();
	const [rollosRestante, setRollosRestante] = useState();
	const [opcionesClasificacion, setOpcionesClasificacion] = useState([]);

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
			if (
				clasificacion === undefined ||
				clasificacion === '' ||
				cantidad === undefined ||
				cantidad === '' ||
				rollos === undefined ||
				rollos === '' ||
				rollosRestante === undefined ||
				rollosRestante === ''
			) {
				throw { payload: { message: 'Complete todos los datos de las telas' } };
			}

			const error = await dispatch(
				cambioClasificacion({
					idKardex: dataModal.data.id,
					clasificacion: clasificacion.label,
					cantidad,
					rollos,
					rollosRestante,
				})
			);

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

	useEffect(() => {
		const newArrOptions = [
			{ id: 1, label: 'Tela OK' },
			{ id: 2, label: 'Tela Observada' },
			{ id: 3, label: 'Tela en Paños' },
			{ id: 4, label: 'Merma' },
			{ id: 5, label: 'Retazos' },
		].filter(e => e.label !== dataModal?.data?.producto?.clasificacion);
		setOpcionesClasificacion(newArrOptions);
	}, []);

	return (
		<Modal
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
					<h2>Cambio de clasificación</h2>
					<br />
					<Autocomplete
						className="mt-8 mb-16 mx-12 w-5/6"
						isOptionEqualToValue={(op, val) => op.id === val.id}
						options={opcionesClasificacion}
						disabled
						value={{
							id: 1,
							label: dataModal.data?.producto?.clasificacion
								? dataModal.data?.producto?.clasificacion
								: 'Tela OK',
						}}
						fullWidth
						filterOptions={(options, state) => options}
						onChange={(event, newValue) => {
							setClasificacion(newValue);
						}}
						renderInput={params => (
							<TextField
								{...params}
								placeholder="Seleccione la clasificacion"
								label="Clasificación de Origen"
								fullWidth
								variant="outlined"
								InputLabelProps={{
									shrink: true,
								}}
							/>
						)}
					/>
					<br />
					<Autocomplete
						className="mt-8 mb-16 mx-12 w-5/6"
						isOptionEqualToValue={(op, val) => op.id === val.id}
						options={opcionesClasificacion}
						value={clasificacion}
						fullWidth
						filterOptions={(options, state) => options}
						onChange={(event, newValue) => {
							setClasificacion(newValue);
						}}
						renderInput={params => (
							<TextField
								{...params}
								placeholder="Seleccione la clasificacion"
								label="Nueva Clasificación"
								required
								fullWidth
								variant="outlined"
								InputLabelProps={{
									shrink: true,
								}}
							/>
						)}
					/>
					<br />
					<div
						style={{
							width: '100%',
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'left',
							gap: '20px',
						}}
					>
						<TextField
							name="cantidad"
							type="number"
							placeholder="Cantidad"
							className="mt-8 mb-16 mx-12 w-4/6"
							label="Cantidad"
							variant="outlined"
							fullWidth
							value={cantidad}
							onChange={e => {
								if (parseFloat(e.target.value) <= cantidadMax && parseFloat(e.target.value) > 0) {
									setCantidad(parseFloat(e.target.value));
								} else {
									toast.error('Cantidad no valida');
								}
							}}
							required
							InputLabelProps={{
								shrink: true,
							}}
						/>
						Máximo: {cantidadMax}
					</div>
					<br />
					<div
						style={{
							width: '100%',
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'left',
							marginRight: '20px',
						}}
					>
						<TextField
							name="cantidadRollos"
							type="number"
							placeholder="Cantidad de Rollos"
							className="mt-8 mb-16 mx-12 w-1/2"
							label="Cantidad de Rollos"
							variant="outlined"
							fullWidth
							value={rollos}
							onChange={e => {
								setRollos(parseFloat(e.target.value));
							}}
							required
							InputLabelProps={{
								shrink: true,
							}}
						/>
						<TextField
							name="cantidadRollosRestantes"
							type="number"
							placeholder="Cantidad de Rollos Restantes"
							className="mt-8 mb-16 mx-12 w-1/2"
							label="Cantidad de Rollos Restantes"
							variant="outlined"
							fullWidth
							value={rollosRestante}
							onChange={e => {
								setRollosRestante(parseFloat(e.target.value));
							}}
							required
							InputLabelProps={{
								shrink: true,
							}}
						/>
					</div>
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
	);
};

export default ModalCambioClasificacion;

/* eslint-disable no-throw-literal */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Backdrop, Fade } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import InputSelect from 'app/main/logistica/controlFacturas/controlFactura/components/inputSelect';
import { useDispatch } from 'react-redux';
import httpClient from 'utils/Api';
import { limitCombo, offsetCombo } from 'constants/constantes';
import { cambioColor, getKardex } from '../../store/almacenTela/kardex/kardexTelasSlice';

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

const getColoresService = async busqueda => {
	let texto = '';
	if (busqueda) {
		texto = busqueda;
	}
	const url = `maestro/color?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${texto}`;
	const response = await httpClient.get(url);
	const data = await response.data.body[0];
	return data;
};

const ModalCambioColor = ({ openModal, setOpenModal, dataModal }) => {
	const dispatch = useDispatch();
	const [color, setColor] = useState(
		dataModal?.data?.producto?.color
			? {
					...dataModal?.data?.producto?.color,
					key: dataModal?.data?.producto?.color?.id,
					label: dataModal?.data?.producto?.color?.descripcion,
			  }
			: null
	);
	const [colores, setColores] = useState([]);

	const getColores = async busqueda => {
		const data = await getColoresService(busqueda);
		if (data) setColores(data);
	};

	async function guardar() {
		toast.promise(
			() => save(),
			{
				pending: 'Guardando Color',
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
			if (color === undefined || color === '') {
				throw { payload: { message: 'Complete todos los datos de las telas' } };
			}

			const error = await dispatch(
				cambioColor({ id: dataModal.data.producto.id, color: color.id })
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
		getColores();
	}, []);

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
						<h2>Cambio de color</h2>
						<br />
						<InputSelect
							label="Color"
							onSearch={getColores}
							options={colores.map(currColor => ({
								...currColor,
								key: currColor.id,
								label: currColor.descripcion,
							}))}
							value={color}
							onChange={(e, newValue) => setColor(newValue)}
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

export default ModalCambioColor;

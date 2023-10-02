/* eslint-disable no-throw-literal */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Autocomplete, Backdrop, Fade, MenuItem, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import httpClient from 'utils/Api';
import { limitCombo, offsetCombo } from 'constants/constantes';
import { cambioAsignacion, getKardex } from '../../store/almacenTela/kardex/kardexTelasSlice';

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

const ModalAsignacionOp = ({ openModal, setOpenModal, dataModal }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [op, setOp] = useState();
	const [opcionesProduccion, setOpcionesProduccion] = useState([]);

	const traerOrdenesProduccion = async busqueda => {
		const arrResp = [{ value: 0, label: 'Sin Asignación', id: 0, key: 0 }];
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `comercial/producciones?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		if (dataModal.data.producto.produccionAsignada) {
			if (data.find(x => x.id === dataModal.data.producto.produccionAsignada.id) === undefined)
				arrResp.push({
					...dataModal.data.producto.produccionAsignada,
					value: dataModal.data.producto.produccionAsignada.id,
					label: dataModal.data.producto.produccionAsignada.codigo,
				});
		}

		data.forEach(x => {
			arrResp.push({ ...x, value: x.id, label: x.codigo });
		});

		setOpcionesProduccion(arrResp);
	};

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
			if (op === undefined || op === '') {
				throw { payload: { message: 'Complete todos los datos de las telas' } };
			}

			const error = await dispatch(cambioAsignacion({ id: dataModal.data.producto.id, op: op.id }));
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
		if (dataModal.data.producto.produccionAsignada)
			setOp({
				...dataModal.data.producto.produccionAsignada,
				value: dataModal.data.producto.produccionAsignada.id,
				label: dataModal.data.producto.produccionAsignada.codigo,
			});
		traerOrdenesProduccion();
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
						<h2>Asignación</h2>
						<br />
						<Autocomplete
							className="mt-12 mb-16 mx-12"
							isOptionEqualToValue={(opp, val) => opp.id === val.id}
							options={opcionesProduccion || []}
							value={op}
							filterOptions={(options, state) => {
								return options;
							}}
							onInputChange={(event, newInputValue) => {
								traerOrdenesProduccion(newInputValue);
							}}
							fullWidth
							onChange={(event, newValue) => {
								if (newValue) {
									setOp(newValue);
								} else {
									setOp(null);
								}
							}}
							renderInput={params => (
								<TextField
									{...params}
									placeholder="Seleccione la orden de producción"
									label="Orden de producción (OP)"
									variant="outlined"
									fullWidth
									required
									InputLabelProps={{
										shrink: true,
									}}
								/>
							)}
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

export default ModalAsignacionOp;

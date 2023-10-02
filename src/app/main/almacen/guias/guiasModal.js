/* eslint-disable no-throw-literal */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import {
	Autocomplete,
	Backdrop,
	Fade,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import httpClient from 'utils/Api';
import { useDispatch } from 'react-redux';
import showToast from 'utils/Toast';
import { createGuia } from '../store/guias/guias/guiaSlice';
import { getGuias } from '../store/guias/guias/guiasSlice';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 1200,
	height: '90%',
	bgcolor: 'background.paper',
	border: '2px solid #ccc',
	borderRadius: '10px',
	overflowY: 'scroll',
	// boxShadow: 24,
	p: 4,
};

const styleBorder = {
	border: '1px solid #ccc',
};

const GuiasModal = ({ openModal, setOpenModal }) => {
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const [opcionesSalidas, setOpcionesSalidas] = useState([]);

	const [idNota, setIdNota] = useState(null);
	const [destinoVal, setDestinoVal] = useState();
	const [salidasVal, setSalidasVal] = useState([]);

	useEffect(() => {
		traerIdNota();
		getSalidas();
	}, []);

	const traerIdNota = async () => {
		const url = `almacen-tela/guia/generateNota`;
		const response = await httpClient.get(url);
		const data = await response.data.body;
		setIdNota(data.nota);
	};

	const getSalidas = async busqueda => {
		let url = `almacen-tela/salida/sinGuia?limit=20&offset=0`;
		if (busqueda) {
			url += `&busqueda=${busqueda}`;
		}
		const response = await httpClient.get(url);
		const data = await response.data.body;
		const opciones = data.map(produccion => ({
			...produccion,
			label: `${produccion.nNota}`,
			key: produccion.id,
		}));
		setOpcionesSalidas(opciones);
	};

	async function handleSave() {
		showToast(
			{
				promesa: save,
				parametros: [],
			},
			'save',
			'almacen avio'
		);
	}

	async function save() {
		try {
			setLoading(true);
			if (!destinoVal || destinoVal === '') {
				setLoading(false);
				throw new Error('Debe ingresar un destino');
			}
			if (!salidasVal || salidasVal.length === 0) {
				setLoading(false);
				throw new Error('Debe ingresar al menos una salida');
			}
			const data = {
				destino: destinoVal || '',
				salidasId: salidasVal.map(e => e.id),
			};
			const error = await dispatch(createGuia(data)).then(res => res);
			if (error.error) throw error;
			dispatch(
				getGuias({
					offset: 0,
					limit: 10,
					busqueda: '',
					tipoBusqueda: 'nuevaBusqueda',
				})
			);
			setOpenModal(false);
			setLoading(false);
			return error;
		} catch (error) {
			console.error('Error:', error);
			throw error;
		}
	}

	return (
		<div>
			<Modal
				width={1200}
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={openModal}
				onClose={() => setOpenModal(false)}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={openModal}>
					<Box sx={style}>
						<h2>{idNota}</h2>
						<br />
						<div className="flex flex-row">
							<div className="w-full flex flex-col sm:flex-row mr-24 sm:mr-4">
								<TextField
									className="mt-8 mb-16 mx-12"
									id="destino"
									label="Destino"
									variant="outlined"
									value={destinoVal}
									fullWidth
									onChange={e => setDestinoVal(e.target.value)}
								/>
							</div>
							<div className="w-full flex flex-col sm:flex-row mr-24 sm:mr-4">
								<Autocomplete
									className="mt-8 mb-16 mx-12"
									multiple
									freeSolo
									isOptionEqualToValue={(opt, val) => opt.id === val.id}
									options={opcionesSalidas || []}
									value={salidasVal}
									filterOptions={(options, state) => {
										return options;
									}}
									onInputChange={(event, newInputValue) => {
										getSalidas(newInputValue);
									}}
									fullWidth
									onChange={(event, newValue) => {
										if (newValue) {
											setSalidasVal(newValue);
										} else {
											setSalidasVal(null);
										}
									}}
									renderInput={params => (
										<TextField
											{...params}
											placeholder="Seleccione las salidas"
											label="Salidas"
											variant="outlined"
											fullWidth
											InputLabelProps={{
												shrink: true,
											}}
										/>
									)}
								/>
							</div>
						</div>
						<div>
							{salidasVal.map(dataTable => (
								<div style={{ marginBottom: '20px' }}>
									<div>{dataTable.nNota}</div>
									<br />
									<TableContainer component={Paper}>
										<Table aria-label="spanning table">
											<TableHead>
												<TableRow style={{ backgroundColor: '#e1e1e1' }}>
													<TableCell align="center" style={styleBorder} width={220}>
														DESCRIPCIÓN
													</TableCell>
													<TableCell align="center" style={styleBorder} width={150}>
														COLORES
													</TableCell>
													<TableCell align="center" style={styleBorder} width={100}>
														CANTIDAD
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
												{dataTable?.detallesProductosSalidasAlmacenesTelas?.map(row => {
													return (
														<TableRow key={row.id}>
															<TableCell width={220} style={styleBorder}>
																{row.producto.tela.nombre}
															</TableCell>
															<TableCell width={150} style={styleBorder} align="center">
																{row.producto.color.descripcion}
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
								</div>
							))}
						</div>
						<br />
						<div
							style={{
								width: '100%',
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'flex-end',
								marginTop: '20px',
								gap: '20px',
							}}
						>
							<Button
								className="whitespace-nowrap mx-4"
								variant="contained"
								color="secondary"
								disabled={loading}
								onClick={handleSave}
							>
								Guardar
							</Button>

							<Button variant="contained" size="medium" onClick={() => setOpenModal(false)}>
								Cerrar
							</Button>
						</div>
					</Box>
				</Fade>
			</Modal>
		</div>
	);
};

export default GuiasModal;

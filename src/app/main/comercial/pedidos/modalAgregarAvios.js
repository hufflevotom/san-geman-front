/* eslint-disable no-throw-literal */
/* eslint-disable no-nested-ternary */
import FuseUtils from '@fuse/utils';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import InputSelect from 'app/main/logistica/controlFacturas/controlFactura/components/inputSelect';
import Lightbox from 'react-awesome-lightbox';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import showToast from 'utils/Toast';
import { getPedidos } from '../store/pedido/pedidosSlice';

const {
	Autocomplete,
	TextField,
	IconButton,
	Box,
	Avatar,
	Grid,
	Modal,
	Backdrop,
	Fade,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
} = require('@mui/material');
const { offsetCombo } = require('constants/constantes');
const { useState, useEffect } = require('react');
const { default: httpClient, baseUrl } = require('utils/Api');

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '80%',
	height: '90%',
	bgcolor: 'background.paper',
	borderRadius: 3,
	overflowY: 'scroll',
	p: 4,
};

const obtenerPedido = async (idPedido, callback) => {
	const url = `comercial/pedidos/${idPedido}`;
	const response = await httpClient.get(url);
	const dataResponse = await response.data.body;
	callback(dataResponse);
};

const obtenerEstilo = async (idEstilo, callback) => {
	const url = `comercial/estilos/${idEstilo}`;
	const response = await httpClient.get(url);
	const dataResponse = await response.data.body;
	callback(dataResponse);
};

const guardarAvios = async (idPedido, idEstilo, avios, okCallBack) => {
	try {
		let error = {};
		const estilosAvios = [];
		if (!avios || avios.length === 0) {
			throw { payload: { message: 'Los avíos son requeridos' } };
		} else {
			avios?.forEach(estiloAvio => {
				estilosAvios.push({
					id: null,
					cantidad: estiloAvio.avios?.hilos
						? 5000 / estiloAvio.cantidadUnidad
						: estiloAvio.avios?.familiaAvios.id === 8
						? 1 / estiloAvio.cantidadUnidad
						: estiloAvio.avios?.familiaAvios.id === 9
						? 1 / estiloAvio.cantidadUnidad
						: estiloAvio.cantidad,
					tipo: estiloAvio.tipo?.value ? estiloAvio.tipo?.value : estiloAvio.tipo,
					cantidadUnidad:
						estiloAvio.avios?.hilos ||
						estiloAvio.avios?.familiaAvios.id === 8 ||
						estiloAvio.avios?.familiaAvios.id === 9 ||
						estiloAvio.avios?.familiaAvios.id === 13 ||
						estiloAvio.avios?.familiaAvios.id === 7
							? estiloAvio.cantidadUnidad
							: null,
					aviosId: estiloAvio.avios?.id,
					unidadMedidaId: estiloAvio.avios?.hilos
						? 6
						: estiloAvio.avios?.familiaAvios.id === 8
						? 2
						: estiloAvio.avios?.familiaAvios.id === 9
						? 2
						: estiloAvio.avios?.familiaAvios.id === 13
						? 2
						: estiloAvio.avios?.familiaAvios.id === 7
						? 2
						: estiloAvio.unidadMedida?.id,
					coloresId: estiloAvio.colores ? estiloAvio.colores.map(c => c.id) : [],
				});
			});
		}
		const body = {
			idEstilo,
			estilosAvios,
		};
		error = await httpClient.put(`comercial/pedidos/agregarAvios/${idPedido}`, body);
		if (error.error) throw error;
		okCallBack();
		return error;
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
};

function ModalAgregarAvios({ idPedido, visible, setVisible, page, rowsPerPage, searchText }) {
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
	});
	const dispatch = useDispatch();
	const { control, getValues } = methods;

	const [visibleConfirmar, setVisibleConfirmar] = useState(false);
	const [dataAvios, setDataAvios] = useState([]);
	const [estilos, setEstilos] = useState([]);
	const [estiloSelected, setEstiloSelected] = useState(null);
	const [telaPrincipal, setTelaPrincipal] = useState(null);
	const [dataAviosArray, setDataAviosArray] = useState([]);

	const traerAviosTipo = async (tipo, busqueda) => {
		let texto = '';
		if (busqueda) {
			texto = busqueda;
		}
		const url = `maestro/avios/tipo/${tipo}?limit=${50}&offset=${offsetCombo}&busqueda=${texto}`;
		const response = await httpClient.get(url);
		const dataResponse = await response.data.body[0];
		setDataAvios(dataResponse);
	};

	useEffect(() => {
		if (estiloSelected) {
			obtenerEstilo(estiloSelected.id, estilo => {
				setTelaPrincipal(estilo.telaPrincipal);
			});
		}
	}, [estiloSelected]);

	useEffect(() => {
		obtenerPedido(idPedido, pedido => {
			setEstilos(pedido.estilos);
		});
	}, []);

	return (
		<Modal
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			open={visible}
			// onClose={() => setVisible(false)}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
			// maskClosable={false}
		>
			<Fade in={visible}>
				<Box sx={style}>
					<div className="mx-6 mb-16 mt-16 text-base">Estilo</div>
					<InputSelect
						label="Estilo"
						options={estilos.map(estilo => ({
							...estilo,
							key: estilo.id,
							label: estilo.estilo,
						}))}
						value={estiloSelected}
						onChange={(e, newValue) => setEstiloSelected(newValue)}
					/>
					{estiloSelected && (
						<div>
							<div className="mx-6 mb-16 mt-16 text-base">Avios</div>
							<Controller
								name="estiloAvios"
								control={control}
								render={({ field: { onChange, value } }) => {
									let val = [];

									if (value) {
										val = value.map(alt => {
											return (
												<div key={alt.id}>
													<FormData
														dataAvios={dataAvios}
														dataAviosArray={dataAviosArray}
														setDataAviosArray={setDataAviosArray}
														traerAviosTipo={traerAviosTipo}
														data={alt}
														onChange={onChange}
														valInicial={value}
														colores={
															telaPrincipal?.colores
																? telaPrincipal.colores.map(e => ({
																		...e,
																		label: e.label || e.descripcion,
																  }))
																: []
														}
													/>
												</div>
											);
										});
									}

									val.push(
										<div key={FuseUtils.generateGUID()}>
											<IconButton
												className="w-full h-fit py-14 flex items-center justify-center rounded-8 overflow-hidden cursor-pointer shadow hover:shadow-md"
												aria-label="add"
												size="medium"
												style={{
													height: '46px',
													marginLeft: '20px',
													marginRight: '40px',
													backgroundColor: 'rgb(2 136 209)',
												}}
												// color="primary"
												onClick={() => {
													onChange(
														value
															? [
																	...value,
																	{
																		id: FuseUtils.generateGUID(),
																		avios: null,
																		tipo: null,
																		cantidad: '',
																		cantidadUnidad: '',
																		// color: { label: 'TODOS', value: 'TODOS' },
																	},
															  ]
															: [
																	{
																		id: FuseUtils.generateGUID(),
																		avios: null,
																		tipo: null,
																		cantidad: '',
																		cantidadUnidad: '',
																		// color: { label: 'TODOS', value: 'TODOS' },
																	},
															  ]
													);
												}}
											>
												<h5 style={{ color: 'white', fontWeight: 'bold' }}>Agregar Avios</h5>
												&nbsp;
												<AddCircleOutlineIcon style={{ fontSize: '30px', color: 'white' }} />
											</IconButton>
										</div>
									);
									return val;
								}}
							/>
						</div>
					)}
					<div className="flex justify-end mt-10">
						<Button
							className="whitespace-nowrap mx-4"
							variant="contained"
							color="secondary"
							onClick={() => setVisible(false)}
						>
							Cancelar
						</Button>
						<Button
							className="whitespace-nowrap mx-4"
							variant="contained"
							color="primary"
							onClick={() => setVisibleConfirmar(true)}
							disabled={!getValues('estiloAvios') || !estiloSelected}
						>
							Guardar
						</Button>
					</div>
					{visibleConfirmar && (
						<ModalConfirmar
							visible={visibleConfirmar}
							setVisible={setVisibleConfirmar}
							callback={() =>
								guardarAvios(idPedido, estiloSelected.id, getValues('estiloAvios'), () => {
									// dispatch(
									// 	getPedidos({
									// 		offset: page * rowsPerPage,
									// 		limit: rowsPerPage,
									// 		busqueda: searchText,
									// 		tipoBusqueda: 'nuevaBusqueda',
									// 	})
									// ).then(() =>
									setVisible(false);
									// );
								})
							}
						/>
					)}
				</Box>
			</Fade>
		</Modal>
	);
}

const FormData = ({
	data,
	onChange,
	valInicial,
	dataAvios,
	traerAviosTipo,
	dataAviosArray,
	setDataAviosArray,
	colores,
}) => {
	const [imagenActiva, setImagenActiva] = useState('');

	const [cantidad, setCantidad] = useState(data.cantidad);
	const [cantidadCalculada, setCantidadCalculada] = useState(data.cantidadUnidad);

	useEffect(() => {
		if (hiloBool) {
			if (cantidadCalculada !== '') {
				const nuevoValor = 5000 / cantidadCalculada;
				setCantidad(parseFloat(nuevoValor.toFixed(2)));
			}
		}
		if (cajaBool) {
			if (cantidadCalculada !== '') {
				const nuevoValor = 1 / cantidadCalculada;
				setCantidad(parseFloat(nuevoValor.toFixed(2)));
			}
		}
	}, [cantidadCalculada]);

	const traerAviosTipo2 = async (tipo, busqueda) => {
		let texto = '';
		if (busqueda) {
			texto = busqueda;
		}
		const url = `maestro/avios/tipo/${tipo}?limit=${50}&offset=${offsetCombo}&busqueda=${texto}`;
		const response = await httpClient.get(url);
		const dataResponse = await response.data.body[0];
		const ddd = dataAviosArray.filter(avios => avios?.id === data.id);
		if (dataResponse) ddd[0].opciones = opcionesAvios(dataResponse);
		setDataAviosArray([...dataAviosArray]);
	};

	const opcionesAvios = dataAvios1 => {
		// {n.familiaAvios?.id === 1
		// 	? `${n.nombre} - ${n.codigoSec} - ${n.marcaHilo} - ${n.color?.descripcion}`
		// 	: n.nombre}
		return dataAvios1.map(avios => ({
			...avios,
			label: `${avios.nombre} ${
				avios.hilos
					? ` - ${avios.codigoSec} - ${avios.marcaHilo} - ${avios.color?.descripcion}${
							avios.talla ? ` - Talla: ${avios.talla.prefijo}` : ''
					  }`
					: `${avios.talla ? ` - Talla: ${avios.talla.prefijo}` : ''}`
			}`,
		}));
	};

	const opcionesTipo = [
		{ id: 1, value: 'AVIOS DE COSTURA', label: 'AVIOS DE COSTURA' },
		{ id: 2, value: 'AVIOS DE ACABADO', label: 'AVIOS DE ACABADO' },
	];

	let aviosComplemento = null;
	let aviosTipo = null;
	let unidadMedida = null;
	let color = [];
	const unidadesAvios = [];

	if (data?.avios) {
		aviosComplemento = {
			...data.avios,
			label: `${data.avios.nombre} ${
				data.avios.hilos
					? ` - ${data.avios.codigoSec} - ${data.avios.marcaHilo} - ${data.avios.color?.descripcion}`
					: ''
			}`,
		};
		if (data.avios.unidadMedida)
			unidadesAvios.push({
				...data.avios.unidadMedida,
				label: data.avios.unidadMedida.nombre,
				value: data.avios.unidadMedida.id,
			});
		if (data.avios.unidadMedidaSecundaria)
			unidadesAvios.push({
				...data.avios.unidadMedidaSecundaria,
				label: data.avios.unidadMedidaSecundaria.nombre,
				value: data.avios.unidadMedidaSecundaria.id,
			});
		if (data.avios.unidadMedidaCompra)
			unidadesAvios.push({
				...data.avios.unidadMedidaCompra,
				label: data.avios.unidadMedidaCompra.nombre,
				value: data.avios.unidadMedidaCompra.id,
			});
	}

	if (data?.unidadMedida) {
		unidadMedida = {
			...data.unidadMedida,
			label: data.unidadMedida.nombre,
		};
	}

	if (data?.colores) {
		color = data.colores.map(c => ({
			...c,
			label: c.label || c.descripcion,
		}));
	}

	if (data?.tipo) {
		aviosTipo = {
			...data.tipo,
			label: data.tipo?.value ? data.tipo.value : data.tipo,
		};
	}

	const actualizar = (nnn, titulo) => {
		// eslint-disable-next-line no-restricted-syntax
		for (const key in valInicial) {
			if (Object.hasOwnProperty.call(valInicial, key)) {
				const element = valInicial[key];
				if (element.id === data.id) {
					element[titulo] = nnn;
				}
			}
		}
		onChange([...valInicial]);
	};

	let hiloBool = false;
	if (data.avios?.hilos) {
		hiloBool = true;
	} else {
		hiloBool = false;
	}

	//* CAJA
	let cajaBool = false;
	if (data.avios?.familiaAvios?.id === 8) {
		cajaBool = true;
	} else {
		cajaBool = false;
	}

	//* BOLSA
	let bolsaBool = false;
	if (data.avios?.familiaAvios?.id === 9) {
		bolsaBool = true;
	} else {
		bolsaBool = false;
	}

	//* SILICA
	let silicaBool = false;
	if (data.avios?.familiaAvios?.id === 13) {
		silicaBool = true;
	} else {
		silicaBool = false;
	}

	//* STICKER
	let stickerBool = false;
	if (data.avios?.familiaAvios?.id === 7) {
		stickerBool = true;
	} else {
		stickerBool = false;
	}

	return (
		// <div
		// 	className="flex flex-col sm:flex-row  sm:mr-4"
		// 	style={{
		// 		alignItems: 'center',
		// 		width: '100%',
		// 		margin: 0,
		// 		padding: 0,
		// 		marginLeft: '12px',
		// 		marginBottom: '12px',
		// 	}}
		// >
		<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
			<Grid item md={2} lg={stickerBool ? 2 : 2.5} xs={12}>
				<Autocomplete
					className="mt-8 mb-16 mx-12"
					isOptionEqualToValue={(op, val) => op.label === val.label}
					options={opcionesTipo || []}
					value={aviosTipo}
					fullWidth
					filterOptions={(options, state) => {
						return options;
					}}
					onChange={(event, newValue) => {
						// eslint-disable-next-line no-restricted-syntax
						for (const key in valInicial) {
							if (Object.hasOwnProperty.call(valInicial, key)) {
								const element = valInicial[key];
								if (element.id === data.id && newValue) {
									element.tipo = newValue;
									const ddd = dataAviosArray.filter(avios => avios?.id === data.id);
									if (ddd.length > 0) {
										ddd[0].tipo = newValue.value;
									} else {
										dataAviosArray.push({ tipo: newValue.value, id: data.id });
									}
									console.log('dataAviosArray', dataAviosArray);
									setDataAviosArray([...dataAviosArray]);
									traerAviosTipo(newValue.value);
								}
							}
						}

						onChange([...valInicial]);
					}}
					renderInput={params => (
						<TextField
							{...params}
							placeholder="Seleccione el tipo"
							label="Tipo de Avio"
							variant="outlined"
							fullWidth
							InputLabelProps={{
								shrink: true,
							}}
						/>
					)}
				/>
			</Grid>
			<Grid item md={3} lg={stickerBool ? 3 : 4} xs={12}>
				<Autocomplete
					className="mt-8 mb-16 mx-12"
					isOptionEqualToValue={(op, val) => op.id === val.id}
					options={
						dataAviosArray.filter(avios => avios?.id === data.id)[0]?.opciones ||
						(dataAvios && opcionesAvios(dataAvios)) ||
						[]
					}
					value={aviosComplemento}
					fullWidth
					filterOptions={(options, state) => options}
					onInputChange={(event, newInputValue) => {
						const ddd = dataAviosArray.filter(avios => avios?.id === data.id);
						traerAviosTipo2(ddd[0]?.tipo, newInputValue);
					}}
					onChange={(event, newValue) => {
						// eslint-disable-next-line no-restricted-syntax
						for (const key in valInicial) {
							if (Object.hasOwnProperty.call(valInicial, key)) {
								const element = valInicial[key];
								if (element.id === data.id) {
									element.avios = newValue;
								}
							}
						}
						onChange([...valInicial]);
					}}
					renderOption={(p, option) => {
						return (
							<Box component="li" sx={{ '& > img': { mr: 2, flemdhrink: 0 } }} {...p}>
								<Avatar
									variant="rounded"
									src={baseUrl + option.imagenUrl}
									sx={{ width: 28, height: 28, marginRight: '10px' }}
									onClick={() => {
										if (option.imagenUrl) {
											setImagenActiva(baseUrl + option.imagenUrl);
										}
									}}
								/>
								{option.label}
							</Box>
						);
					}}
					renderInput={params => (
						<TextField
							{...params}
							placeholder="Seleccione el Avio"
							label={`${hiloBool ? 'Avio - Hilo' : 'Avio'} `}
							required
							fullWidth
							variant="outlined"
							InputLabelProps={{
								shrink: true,
							}}
						/>
					)}
				/>
			</Grid>

			{imagenActiva !== '' ? (
				<Lightbox
					showTitle={false}
					onClose={() => setImagenActiva('')}
					image={imagenActiva}
					title="Image Title"
				/>
			) : null}
			{hiloBool && (
				<Grid item md={2} lg={1.5} xs={12}>
					<TextField
						placeholder="Ingrese la cantidad"
						className="mt-8 mb-16 mx-12"
						label="Prendas por cono"
						type="number"
						InputProps={{
							inputProps: { min: 0 },
						}}
						variant="outlined"
						fullWidth
						value={cantidadCalculada}
						onBlur={() => {
							actualizar(cantidadCalculada, 'cantidadUnidad');
						}}
						onChange={newValue => {
							setCantidadCalculada(newValue.target.value);
						}}
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</Grid>
			)}
			{(cajaBool || bolsaBool) && (
				<Grid item md={2} lg={1.5} xs={12}>
					<TextField
						placeholder="Ingrese la cantidad"
						className="mt-8 mb-16 mx-12"
						label={`Prendas por${bolsaBool ? ' bolsa' : ' caja'}`}
						type="number"
						InputProps={{
							inputProps: { min: 0 },
						}}
						variant="outlined"
						fullWidth
						value={cantidadCalculada}
						onBlur={() => {
							actualizar(cantidadCalculada, 'cantidadUnidad');
						}}
						onChange={newValue => {
							setCantidadCalculada(newValue.target.value);
						}}
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</Grid>
			)}
			{(stickerBool || silicaBool) && (
				<Grid item md={silicaBool ? 3 : 3} lg={silicaBool ? 4 : 2} xs={12}>
					<TextField
						disabled={cantidad > 0}
						placeholder="Ingrese la cantidad"
						className="mt-8 mb-16 mx-12 w-full"
						label="Cantidad por caja"
						type="number"
						InputProps={{
							inputProps: { min: 0 },
						}}
						variant="outlined"
						fullWidth
						value={cantidadCalculada}
						onBlur={() => {
							actualizar(cantidadCalculada, 'cantidadUnidad');
						}}
						onChange={newValue => {
							setCantidadCalculada(newValue.target.value);
						}}
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</Grid>
			)}
			{!cajaBool && !bolsaBool && !silicaBool && (
				<Grid item md={stickerBool ? 3 : 2} lg={stickerBool ? 2 : 1.5} xs={12}>
					<TextField
						placeholder="Ingrese la cantidad"
						disabled={hiloBool || (stickerBool && cantidadCalculada > 0)}
						className="mt-8 mb-16 mx-12"
						label={`${hiloBool ? 'Cantidad (Yardas) ' : 'Cantidad X Prenda'} `}
						variant="outlined"
						fullWidth
						type="number"
						InputProps={{
							inputProps: { min: 0 },
						}}
						value={cantidad}
						onBlur={() => {
							if (cantidad >= 0) actualizar(cantidad, 'cantidad');
						}}
						onChange={newValue => {
							if (newValue.target.value >= 0) setCantidad(newValue.target.value);
						}}
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</Grid>
			)}

			{!hiloBool && !cajaBool && !bolsaBool && !stickerBool && !silicaBool && (
				<Grid item md={2} lg={1.5} xs={12}>
					<Autocomplete
						className="mt-8 mb-16 mx-12"
						isOptionEqualToValue={(op, val) => op.id === val.id}
						options={unidadesAvios}
						fullWidth
						value={unidadMedida}
						filterOptions={(options, state) => options}
						onChange={(event, newValue) => {
							// eslint-disable-next-line no-restricted-syntax
							for (const key in valInicial) {
								if (Object.hasOwnProperty.call(valInicial, key)) {
									const element = valInicial[key];
									if (element.id === data.id) {
										element.unidadMedida = newValue;
									}
								}
							}
							onChange([...valInicial]);
						}}
						renderInput={params => (
							<TextField
								{...params}
								placeholder="Seleccione la unidad de medida"
								label="Unidad de Medida"
								required
								fullWidth
								variant="outlined"
								InputLabelProps={{
									shrink: true,
								}}
							/>
						)}
					/>
				</Grid>
			)}

			{!silicaBool && (
				<Grid item md={2} lg={cajaBool || bolsaBool ? 3 : stickerBool ? 2 : 1.5} xs={12}>
					<Autocomplete
						multiple
						freeSolo
						className="mt-8 mb-16 mx-12"
						isOptionEqualToValue={(op, val) => op.id === val.id}
						options={colores}
						fullWidth
						value={color}
						filterOptions={(options, state) => options}
						onChange={(event, newValue) => {
							// eslint-disable-next-line no-restricted-syntax
							for (const key in valInicial) {
								if (Object.hasOwnProperty.call(valInicial, key)) {
									const element = valInicial[key];
									if (element.id === data.id) {
										element.colores = newValue;
									}
								}
							}
							onChange([...valInicial]);
						}}
						renderInput={params => (
							<TextField
								{...params}
								placeholder="TODOS"
								label="Colores"
								required
								fullWidth
								variant="outlined"
								InputLabelProps={{
									shrink: true,
								}}
							/>
						)}
					/>
				</Grid>
			)}

			<Grid item md={1} xs={12}>
				<div
					style={{
						backgroundColor: '#F5FBFA',
						/* marginBottom: '100px',  */ borderRadius: '50px',
						height: '38px',
						width: '38px',
					}}
				>
					<IconButton
						aria-label="delete"
						color="error"
						onClick={() => {
							// eslint-disable-next-line no-restricted-syntax
							for (const key in valInicial) {
								if (Object.hasOwnProperty.call(valInicial, key)) {
									const element = valInicial[key];
									if (element.id === data.id) {
										valInicial.splice(key, 1);
									}
								}
							}
							onChange([...valInicial]);
						}}
					>
						<DeleteForeverIcon />
					</IconButton>
				</div>
			</Grid>
		</Grid>
	);
};

function ModalConfirmar({ visible, setVisible, callback }) {
	async function handleSavePedido() {
		setVisible(false);
		showToast(
			{
				promesa: callback,
				parametros: [],
			},
			'save',
			'pedido'
		);
	}

	return (
		<Dialog
			open={visible}
			onClose={() => setVisible(false)}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">¿Está seguro de grabar la información?</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					Recuerde revisar la información antes de guardar
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="error"
					onClick={() => {
						setVisible(false);
					}}
				>
					No
				</Button>
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="success"
					onClick={handleSavePedido}
					autoFocus
				>
					Si
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ModalAgregarAvios;

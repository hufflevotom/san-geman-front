import { Controller, useFormContext } from 'react-hook-form';
import FuseUtils from '@fuse/utils';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import debounce from 'lodash.debounce';

const { Autocomplete, TextField, IconButton } = require('@mui/material');
const { limitCombo, offsetCombo } = require('constants/constantes');
const { useState, useEffect } = require('react');
const { default: httpClient } = require('utils/Api');

const TipoIngresoForm = () => {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	return (
		<div key={FuseUtils.generateGUID()}>
			<hr />
			<div className="mx-6 mb-16 mt-16 text-base">Tela</div>
			<Controller
				name="telasComplemento"
				control={control}
				render={({ field: { onChange, value } }) => {
					let val = [];

					if (value) {
						val = value.map(alt => {
							return (
								<FormData
									key={alt.id}
									errors={errors}
									data={alt}
									onChange={onChange}
									valInicial={value}
								/>
							);
						});
					}

					val.push(
						<div key={FuseUtils.generateGUID()} style={{ marginRight: '25px' }}>
							<IconButton
								className="w-full h-fit py-14 flex items-center justify-center rounded-8 overflow-hidden cursor-pointer shadow hover:shadow-md"
								aria-label="add"
								size="medium"
								style={{
									height: '46px',
									marginLeft: '20px',
									marginRight: '40px',
									// backgroundColor: '#ccf0df',
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
														colores: null,
														tela: null,
														cantIngresoKG: '',
														cantIngresoMTS: '',
														numPartida: '',
														cantidadRollo: '',
														clasificacion: { id: 1, label: 'Tela OK' },
													},
											  ]
											: [
													{
														id: FuseUtils.generateGUID(),
														colores: null,
														tela: null,
														cantIngresoKG: '',
														cantIngresoMTS: '',
														numPartida: '',
														cantidadRollo: '',
														clasificacion: { id: 1, label: 'Tela OK' },
													},
											  ]
									);
								}}
							>
								<h5 style={{ color: 'white', fontWeight: 'bold' }}>Agregar Tela</h5>
								&nbsp;
								<AddCircleOutlineIcon style={{ fontSize: '30px', color: 'white' }} />
							</IconButton>
						</div>
					);
					return val;
				}}
			/>
		</div>
	);
};

const FormData = props => {
	const { errors, data, valInicial, onChange } = props;

	const [telasTemporal, setTelasTemporal] = useState(null);
	const [coloresTemporal, setColoresTemporal] = useState(null);
	const [unidadTemporal, setUnidadTemporal] = useState(null);

	const [coloresSearchText, setColoresSearchText] = useState('');
	const [telasSearchText, setTelasSearchText] = useState('');
	const [unidadesSearchText, setUnidadesSearchText] = useState('');

	const [dataColores, setDataColores] = useState([]);
	const [dataTelas, setDataTelas] = useState([]);
	const [dataUnidades, setDataUnidades] = useState([]);

	const [cantidad, setCantidad] = useState(data.cantidad);
	const [numPartida, setNumPartida] = useState(data.numPartida);
	const [cantRollos, setcantRollos] = useState(data.cantidadRollo);
	const [ubicacion, setUbicacion] = useState(data.ubicacion);

	useEffect(() => {
		traerColores();
		traerTelas();
		traerUnidades();
	}, []);

	const traerColores = async busqueda => {
		let texto = '';
		if (busqueda) {
			texto = busqueda;
		}
		const url = `maestro/color?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${texto}`;

		const response = await httpClient.get(url);
		const dataResponse = await response.data.body[0];
		setDataColores(dataResponse);
	};

	const debouncedTraerColores = debounce(() => {
		traerColores(coloresSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerColores(); // Llamar a la versión debounced de fetchData
		return debouncedTraerColores.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [coloresSearchText]);

	const traerTelas = async busqueda => {
		let texto = '';
		if (busqueda) {
			texto = busqueda;
		}
		const url = `maestro/tela?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${texto}`;

		const response = await httpClient.get(url);
		const dataResponse = await response.data.body[0];
		setDataTelas(dataResponse);
	};

	const debouncedTraerTelas = debounce(() => {
		traerTelas(telasSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerTelas(); // Llamar a la versión debounced de fetchData
		return debouncedTraerTelas.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [telasSearchText]);

	const traerUnidades = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `configuraciones/unidad-media?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const dataU = await response.data.body[0];
		setDataUnidades(dataU);
	};

	const debouncedTraerUnidades = debounce(() => {
		traerUnidades(unidadesSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerUnidades(); // Llamar a la versión debounced de fetchData
		return debouncedTraerUnidades.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [unidadesSearchText]);

	const opcionesTelas = dataTelas.map(tela => ({
		...tela,
		label: tela.nombre,
	}));

	const opcionesColores = dataColores.map(color => ({
		...color,
		label: color.descripcion,
	}));

	const opcionesUnidades = dataUnidades.map(u => ({
		...u,
		label: u.nombre,
	}));

	let telaComplemento = null;
	let coloresComplemento = null;
	let unidadComplemento = null;
	let clasificacion = null;

	if (data?.tela) {
		telaComplemento = {
			...data.tela,
			label: data.tela.nombre,
		};
	}
	if (data?.colores) {
		coloresComplemento = {
			...data.colores,
			label: data.colores.descripcion,
		};
	}
	if (data?.unidad) {
		unidadComplemento = {
			...data.unidad,
			label: data.unidad.nombre,
		};
	}
	if (data?.clasificacion) {
		clasificacion = {
			...data.clasificacion,
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

	return (
		<div
			className="flex flex-col sm:flex-row mr-12"
			style={{
				alignItems: 'center',
				width: '100%',
				margin: 0,
				padding: 0,
				marginRight: '12px',
				marginBottom: '12px',
			}}
		>
			<div
				className="flex flex-col"
				style={{
					alignItems: 'center',
					width: '100%',
					margin: 0,
					padding: 0,
					marginLeft: '12px',
					marginBottom: '12px',
				}}
			>
				<div
					className="flex flex-col sm:flex-row"
					style={{
						alignItems: 'center',
						width: '100%',
						margin: 0,
						padding: 0,
						marginLeft: '12px',
						marginBottom: '12px',
					}}
				>
					<Autocomplete
						className="mt-8 mb-16 mx-12"
						isOptionEqualToValue={(op, val) => op.id === val.id}
						options={opcionesTelas || []}
						value={telasTemporal || telaComplemento}
						fullWidth
						filterOptions={(options, state) => options}
						onInputChange={(event, newInputValue) => {
							setTelasSearchText(newInputValue);
							setTelasTemporal({ ...telaComplemento, label: newInputValue });
						}}
						onChange={(event, newValue) => {
							// eslint-disable-next-line no-restricted-syntax
							for (const key in valInicial) {
								if (Object.hasOwnProperty.call(valInicial, key)) {
									const element = valInicial[key];
									if (element.id === data.id) {
										element.tela = newValue;
									}
								}
							}
							setTelasTemporal(null);
							onChange([...valInicial]);
						}}
						renderInput={params => (
							<TextField
								{...params}
								placeholder="Seleccione la tela"
								label="Tela"
								required
								fullWidth
								error={!!errors.telasEstilos}
								helperText={errors?.telasEstilos?.message}
								variant="outlined"
								InputLabelProps={{
									shrink: true,
								}}
							/>
						)}
					/>

					<Autocomplete
						className="mt-8 mb-16 mx-12 w-2/4"
						isOptionEqualToValue={(op, val) => op.id === val.id}
						options={opcionesColores || []}
						value={coloresTemporal || coloresComplemento}
						fullWidth
						filterOptions={(options, state) => options}
						onInputChange={(event, newInputValue) => {
							setColoresSearchText(newInputValue);
							setColoresTemporal({ ...coloresComplemento, label: newInputValue });
						}}
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
							setColoresTemporal(null);
							onChange([...valInicial]);
						}}
						renderInput={params => (
							<TextField
								{...params}
								placeholder="Seleccione el color"
								label="Color"
								required
								fullWidth
								error={!!errors.telasEstilos}
								helperText={errors?.telasEstilos?.message}
								variant="outlined"
								InputLabelProps={{
									shrink: true,
								}}
							/>
						)}
					/>
					<Autocomplete
						className="mt-8 mb-16 mx-12 w-4/6"
						isOptionEqualToValue={(op, val) => op.id === val.id}
						options={[
							{ id: 1, label: 'Tela OK' },
							{ id: 2, label: 'Tela Observada' },
							{ id: 3, label: 'Tela en Paños' },
							{ id: 4, label: 'Merma' },
							{ id: 5, label: 'Retazos' },
						]}
						value={clasificacion || { id: 1, label: 'Tela OK' }}
						fullWidth
						filterOptions={(options, state) => options}
						onChange={(event, newValue) => {
							// eslint-disable-next-line no-restricted-syntax
							for (const key in valInicial) {
								if (Object.hasOwnProperty.call(valInicial, key)) {
									const element = valInicial[key];
									if (element.id === data.id) {
										element.clasificacion = newValue;
									}
								}
							}
							onChange([...valInicial]);
						}}
						renderInput={params => (
							<TextField
								{...params}
								placeholder="Seleccione la clasificacion"
								label="Clasificacion"
								required
								fullWidth
								error={!!errors.clasificacion}
								helperText={errors?.clasificacion?.message}
								variant="outlined"
								InputLabelProps={{
									shrink: true,
								}}
							/>
						)}
					/>
					<TextField
						name="ubicacion"
						placeholder="Ingrese la Ubicación"
						className="mt-8 mb-16 mx-12 w-4/6"
						label="Ubicación"
						variant="outlined"
						fullWidth
						value={ubicacion}
						onBlur={() => {
							actualizar(ubicacion, 'ubicacion');
						}}
						onChange={e => {
							setUbicacion(e.target.value);
						}}
						error={!!errors.ubicacion}
						helperText={errors?.ubicacion?.message}
						required
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</div>
				<div
					className="flex flex-col sm:flex-row"
					style={{
						alignItems: 'center',
						width: '100%',
						margin: 0,
						padding: 0,
						marginLeft: '12px',
						marginBottom: '12px',
					}}
				>
					<TextField
						name="cantidad"
						type="number"
						placeholder="Cantidad de ingreso"
						className="mt-8 mb-16 mx-12 w-1/3"
						label="Cantidad de Ingreso"
						variant="outlined"
						fullWidth
						value={cantidad}
						onBlur={() => {
							actualizar(cantidad, 'cantidad');
						}}
						onChange={e => {
							setCantidad(e.target.value);
						}}
						error={!!errors.cantidad}
						helperText={errors?.cantidad?.message}
						required
						InputLabelProps={{
							shrink: true,
						}}
					/>

					<Autocomplete
						className="mt-8 mb-16 mx-12 w-2/4"
						isOptionEqualToValue={(op, val) => op.id === val.id}
						options={opcionesUnidades || []}
						value={unidadTemporal || unidadComplemento}
						fullWidth
						filterOptions={(options, state) => options}
						onInputChange={(event, newInputValue) => {
							setUnidadesSearchText(newInputValue);
							setUnidadTemporal({ ...unidadComplemento, label: newInputValue });
						}}
						onChange={(event, newValue) => {
							// eslint-disable-next-line no-restricted-syntax
							for (const key in valInicial) {
								if (Object.hasOwnProperty.call(valInicial, key)) {
									const element = valInicial[key];
									if (element.id === data.id) {
										element.unidad = newValue;
									}
								}
							}
							setUnidadTemporal(null);
							onChange([...valInicial]);
						}}
						renderInput={params => (
							<TextField
								{...params}
								placeholder="Seleccione la unidad de Medida"
								label="Unidad de Medida"
								required
								fullWidth
								error={!!errors.unidad}
								helperText={errors?.unidad?.message}
								variant="outlined"
								InputLabelProps={{
									shrink: true,
								}}
							/>
						)}
					/>

					<TextField
						name="numPartida"
						placeholder="Número de partida"
						className="mt-8 mb-16 mx-12 w-1/3"
						label="Partida"
						variant="outlined"
						fullWidth
						value={numPartida}
						onBlur={() => {
							actualizar(numPartida, 'numPartida');
						}}
						onChange={e => {
							setNumPartida(e.target.value);
						}}
						error={!!errors.numPartida}
						helperText={errors?.numPartida?.message}
						required
						InputLabelProps={{
							shrink: true,
						}}
					/>

					<TextField
						name="cantidadRollo"
						type="number"
						placeholder="Cantidad de rollos"
						className="mt-8 mb-16 mx-12 w-1/3"
						label="Cantidad de Rollos"
						variant="outlined"
						fullWidth
						value={cantRollos}
						onBlur={() => {
							actualizar(cantRollos, 'cantidadRollo');
						}}
						onChange={e => {
							setcantRollos(e.target.value);
						}}
						error={!!errors.numPartida}
						helperText={errors?.numPartida?.message}
						required
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</div>
			</div>

			<div style={{ backgroundColor: '#F5FBFA', marginRight: '20px', borderRadius: '50px' }}>
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
		</div>
	);
};

export default TipoIngresoForm;

/* eslint-disable no-restricted-syntax */
import { Controller, useFormContext } from 'react-hook-form';
import FuseUtils from '@fuse/utils';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import debounce from 'lodash.debounce';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { toast } from 'react-toastify';
/* eslint-disable import/prefer-default-export */
const { Autocomplete, TextField, IconButton, InputAdornment } = require('@mui/material');
const { limitCombo, offsetCombo } = require('constants/constantes');
const { useState, useEffect } = require('react');
const { default: httpClient } = require('utils/Api');

export const TelaComplementoForm = ({ disabled }) => {
	const methods = useFormContext();
	const { control, formState, watch } = methods;
	const { errors } = formState;

	const telaPrincipal = watch('telaPrincipal');

	return (
		<div key={FuseUtils.generateGUID()}>
			<hr />
			<div className="mx-6 mb-16 mt-16 text-base">Tela Complemento</div>
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
									disabled={disabled}
									colores={
										telaPrincipal?.colores
											? telaPrincipal.colores.map(e => ({
													...e,
													label: e.label || e.descripcion,
											  }))
											: []
									}
								/>
							);
						});
					}

					if (!disabled)
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
															coloresRelacionados: [],
															tela: null,
															tipo: '',
															ubicacion: '',
															consumo: 0,
															unidadMedida: null,
														},
												  ]
												: [
														{
															id: FuseUtils.generateGUID(),
															colores: null,
															coloresRelacionados: [],
															tela: null,
															tipo: '',
															ubicacion: '',
															unidadMedida: null,
														},
												  ]
										);
									}}
									disabled={disabled}
								>
									<h5 style={{ color: 'white', fontWeight: 'bold' }}>Agregar Tela Complemento</h5>
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
	const { errors, data, valInicial, colores, onChange } = props;

	const [consumo, setConsumo] = useState(data.consumo);
	const [telasTemporal, setTelasTemporal] = useState(null);
	const [unidadTemporal, setUnidadTemporal] = useState(null);

	const [dataColores, setDataColores] = useState([]);
	const [dataTelas, setDataTelas] = useState([]);

	const [telasSearchText, setTelasSearchText] = useState('');
	const [coloresSearchText, setColoresSearchText] = useState('');

	useEffect(() => {
		traerColores();
		traerTelas();
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

	const opcionesTelas = dataTelas.map(tela => ({
		...tela,
		label: `${tela.codigo} / ${tela.nombre}`,
	}));

	const opcionesColores = dataColores.map(color => ({
		...color,
		label: `${color.descripcion}`,
	}));

	const opcionesUnidades = [];

	let telaComplemento = null;
	let unidad = null;
	let coloresComplemento = null;
	let color = [];
	const [ubicacion, setUbicacion] = useState(data.ubicacion);

	if (data?.tela) {
		telaComplemento = {
			...data.tela,
			label: `${data.tela.codigo} / ${data.tela.nombre}`,
		};
		opcionesUnidades.push({
			id: 4,
			nombre: 'GRAMOS',
			label: 'GRAMOS',
			prefijo: 'GR',
		});
		opcionesUnidades.push({
			...data?.tela.unidadMedida,
			label: data?.tela.unidadMedida.nombre,
		});
		if (opcionesUnidades.findIndex(und => und.id === data?.tela.unidadMedidaSecundaria.id) === -1)
			opcionesUnidades.push({
				...data?.tela.unidadMedidaSecundaria,
				label: data?.tela.unidadMedidaSecundaria.nombre,
			});
	}
	if (data?.colores) {
		if (data.colores.length > 0) {
			coloresComplemento = {
				...data.colores[0],
				label: `${data.colores[0].descripcion}` ?? '',
			};
		} else {
			coloresComplemento = {
				...data.colores,
				label: `${data.colores.descripcion}` ?? '',
			};
		}
	}
	let inputPropsConsumo = { min: 0, step: 0.001 };
	if (data?.unidadMedida) {
		unidad = {
			...data.unidadMedida,
			label: data.unidadMedida.nombre,
		};
		if (data.unidadMedida.id === 4) {
			inputPropsConsumo = { min: 0, step: 1 };
		}
		if (data.unidadMedida.id === 5) {
			inputPropsConsumo = { min: 0, step: 1 };
		}
	}
	if (data?.coloresRelacionados) {
		color = data.coloresRelacionados.map(c => ({
			...c,
			label: c.label || c.descripcion,
		}));
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

	const actualizarConsumo = consumoVal => {
		if (unidad) {
			let cantidad;
			if (unidad.id === 4 || unidad.id === 5) {
				cantidad = parseInt(consumoVal || 0, 10);
			} else {
				cantidad = (+consumoVal || 0).toFixed(3);
			}
			actualizar(cantidad, 'consumo');
		} else {
			toast.error('Debe seleccionar una unidad de consumo');
		}
	};

	return (
		<div
			className="flex flex-row"
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
				className="flex flex-col sm:mr-4"
				style={{
					alignItems: 'center',
					width: '100%',
				}}
			>
				<div
					className="flex flex-row"
					style={{
						alignItems: 'center',
						width: '100%',
					}}
				>
					<Autocomplete
						/* key="tela" */
						disabled={props.disabled}
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
						// multiple
						// freeSolo
						/* key="colores" */
						disabled={props.disabled}
						className="mt-8 mb-16 mx-12"
						isOptionEqualToValue={(op, val) => op.id === val.id}
						options={opcionesColores || []}
						value={coloresComplemento}
						fullWidth
						filterOptions={(options, state) => options}
						onInputChange={(event, newInputValue) => {
							setColoresSearchText(newInputValue);
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
						/* key="unidadMedida" */
						disabled={props.disabled || opcionesUnidades.length === 0}
						className="mt-8 mb-16 mx-12"
						isOptionEqualToValue={(op, val) => op.id === val.id}
						options={opcionesUnidades || []}
						value={unidadTemporal || unidad}
						fullWidth
						filterOptions={(options, state) => options}
						onInputChange={(event, newInputValue) => {
							setUnidadTemporal({ ...unidad, label: newInputValue });
						}}
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
							setUnidadTemporal(null);
							onChange([...valInicial]);
						}}
						renderInput={params => (
							<TextField
								{...params}
								placeholder="Seleccione la unidad"
								label="Unidad de consumo"
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
				</div>
				<div
					className="flex flex-row"
					style={{
						alignItems: 'center',
						width: '100%',
					}}
				>
					<TextField
						disabled={props.disabled}
						placeholder="Consumo"
						className="mt-8 mb-16 mx-12"
						label="Consumo Teórico"
						variant="outlined"
						fullWidth
						type="number"
						value={consumo}
						onBlur={() => {
							actualizarConsumo(consumo);
						}}
						onChange={newValue => {
							setConsumo(Number(newValue.target.value));
						}}
						error={!!errors.consumo}
						helperText={errors?.consumo?.message}
						InputLabelProps={{
							shrink: true,
						}}
						InputProps={{
							// endAdornment: <InputAdornment position="end">g</InputAdornment>,
							inputProps: inputPropsConsumo,
						}}
					/>

					<TextField
						disabled={props.disabled}
						placeholder="Ingrese la ubicación"
						className="mt-8 mb-16 mx-12"
						label="Ubicación"
						variant="outlined"
						fullWidth
						type="text"
						value={ubicacion}
						onBlur={() => {
							actualizar(ubicacion, 'ubicacion');
						}}
						onChange={newValue => {
							setUbicacion(newValue.target.value);
							// for (const key in valInicial) {
							// 	if (Object.hasOwnProperty.call(valInicial, key)) {
							// 		const element = valInicial[key];
							// 		if (element.id === data.id) {
							// 			element.ubicacion = newValue.target.value;
							// 		}
							// 	}
							// }
							// setTelasTemporal(null);
							// onChange([...valInicial]);
						}}
						error={!!errors.ubicacion}
						helperText={errors?.ubicacion?.message}
						InputLabelProps={{
							shrink: true,
						}}
					/>

					<Autocomplete
						multiple
						freeSolo
						disabled={props.disabled}
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
										element.coloresRelacionados = newValue;
									}
								}
							}
							onChange([...valInicial]);
						}}
						renderInput={params => (
							<TextField
								{...params}
								placeholder={color.length > 0 ? 'Seleccione un color' : 'TODOS'}
								label="Colores Relacionados"
								required
								fullWidth
								error={!!errors.colores}
								helperText={errors?.colores?.message}
								variant="outlined"
								InputLabelProps={{
									shrink: true,
								}}
							/>
						)}
					/>
				</div>
			</div>
			<div
				style={{ backgroundColor: '#F5FBFA', /* marginBottom: '100px',  */ borderRadius: '50px' }}
			>
				<IconButton
					aria-label="delete"
					color="error"
					disabled={props.disabled}
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

import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import { Controller, useFormContext } from 'react-hook-form';
import { Autocomplete, IconButton, TextField } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FuseUtils from '@fuse/utils/FuseUtils';
import { limitCombo, offsetCombo } from 'constants/constantes';
import httpClient from 'utils/Api';

function AgregarTelas({ currentMoneda }) {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	return (
		<div className="mx-10">
			<div className="mx-6 mb-16 mt-16 text-base">Tela</div>
			<Controller
				name="telasLibres"
				control={control}
				render={({ field: { onChange, value } }) => {
					let val = [];
					let totalImporteX = 0;
					let valorVenta = 0;
					let igv = 0;

					if (value) {
						value.forEach(element => {
							if (element.totalImporte && typeof element.totalImporte !== 'string') {
								valorVenta += element.totalImporte;
							} else if (typeof element.totalImporte === 'string') {
								valorVenta += parseFloat(element.totalImporte);
							}
						});

						totalImporteX = valorVenta * 1.18;
						igv = totalImporteX - valorVenta;

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
														valorUnitario: 0,
														descuento: 0,
														precioUnitario: 0,
														totalImporte: 0,
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
														valorUnitario: 0,
														descuento: 0,
														precioUnitario: 0,
														totalImporte: 0,
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

					if (totalImporteX > 0) {
						val.push(
							<div
								style={{
									width: '100%',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									gap: '10px',
									marginTop: '20px',
									marginRight: '20px',
									marginBottom: '100px',
								}}
							>
								<div
									style={{
										width: '100%',
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'end',
										gap: '10px',
									}}
								>
									<div style={{ width: '200px' }}>VALOR VENTA</div>
									<div>
										{currentMoneda?.key === 'SOLES' ? 'S/ ' : '$ '}
										{(typeof valorVenta === 'string' ? parseFloat(valorVenta) : valorVenta).toFixed(
											2
										)}
									</div>
								</div>

								<div
									style={{
										width: '100%',
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'end',
										gap: '10px',
									}}
								>
									<div style={{ width: '200px' }}>IGV (18.00%)</div>
									<div>
										{currentMoneda?.key === 'SOLES' ? 'S/ ' : '$ '}
										{(typeof igv === 'string' ? parseFloat(igv) : igv).toFixed(2)}
									</div>
								</div>

								<div
									style={{
										width: '100%',
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'end',
										gap: '10px',
									}}
								>
									<div style={{ width: '200px' }}>TOTAL IMPORTE</div>
									<div>
										{currentMoneda?.key === 'SOLES' ? 'S/ ' : '$ '}
										{(typeof totalImporteX === 'string'
											? parseFloat(totalImporteX)
											: totalImporteX
										).toFixed(2)}
									</div>
								</div>
							</div>
						);
					}
					return val;
				}}
			/>
		</div>
	);
}

const FormData = props => {
	const { errors, data, valInicial, onChange } = props;

	const [telasTemporal, setTelasTemporal] = useState(null);
	const [coloresTemporal, setColoresTemporal] = useState(null);
	const [unidadTemporal, setUnidadTemporal] = useState(null);

	const [dataColores, setDataColores] = useState([]);
	const [dataTelas, setDataTelas] = useState([]);

	const [coloresSearchText, setColoresSearchText] = useState([]);
	const [telasSearchText, setTelasSearchText] = useState([]);

	const [cantidad, setCantidad] = useState(data.cantidad || 0);
	const [valorUnitario, setValorUnitario] = useState(data.valorUnitario || 0);
	const [descuento, setDescuento] = useState(data.descuento || 0);

	const { precioUnitario, totalImporte } = data;

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
		label: tela.nombre,
	}));

	const opcionesColores = dataColores.map(color => ({
		...color,
		label: color.descripcion,
	}));

	const opcionesUnidades = [];

	let telaComplemento = null;
	let coloresComplemento = null;
	let unidadComplemento = null;

	if (data?.tela) {
		telaComplemento = {
			...data.tela,
			label: data.tela.nombre,
		};
		if (opcionesUnidades.findIndex(e => e.id === data.tela.unidadMedida.id) === -1) {
			opcionesUnidades.push({
				...data.tela.unidadMedida,
				label: data.tela.unidadMedida.nombre,
			});
		}
		if (opcionesUnidades.findIndex(e => e.id === data.tela.unidadMedidaSecundaria.id) === -1) {
			opcionesUnidades.push({
				...data.tela.unidadMedidaSecundaria,
				label: data.tela.unidadMedidaSecundaria.nombre,
			});
		}
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

	const actualizar = (nnn, titulo) => {
		// eslint-disable-next-line no-restricted-syntax
		for (const key in valInicial) {
			if (Object.hasOwnProperty.call(valInicial, key)) {
				const element = valInicial[key];
				if (element.id === data.id) {
					element[titulo] = nnn;
				}
				if (element.descuento === 0) {
					element.precioUnitario = element.valorUnitario;
				} else {
					element.precioUnitario =
						element.valorUnitario - element.valorUnitario * (element.descuento / 100);
				}
				if (
					element.cantidad &&
					(element.precioUnitario !== null || element.precioUnitario !== '')
				) {
					element.totalImporte = element.precioUnitario * element.cantidad;
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

					<TextField
						name="cantidad"
						type="number"
						placeholder="Cantidad"
						className="mt-8 mb-16 mx-12 w-1/3"
						label="Cantidad"
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
						disabled={opcionesUnidades.length === 0}
						value={unidadTemporal || unidadComplemento}
						fullWidth
						filterOptions={(options, state) => options}
						onInputChange={(event, newInputValue) => {
							// traerUnidades(newInputValue);
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
						name="valorUnitario"
						type="number"
						placeholder="Valor Unitario"
						className="mt-8 mb-16 mx-12 w-1/3"
						label="Valor Unitario"
						variant="outlined"
						fullWidth
						value={valorUnitario}
						onBlur={() => {
							actualizar(valorUnitario, 'valorUnitario');
						}}
						onChange={e => {
							setValorUnitario(e.target.value);
						}}
						error={!!errors.valorUnitario}
						helperText={errors?.valorUnitario?.message}
						required
						InputLabelProps={{
							shrink: true,
						}}
					/>
					<TextField
						name="descuento"
						type="number"
						placeholder="% Descuento"
						className="mt-8 mb-16 mx-12 w-1/3"
						label="% Descuento"
						variant="outlined"
						fullWidth
						value={descuento}
						onBlur={() => {
							actualizar(descuento, 'descuento');
						}}
						onChange={e => {
							setDescuento(e.target.value);
						}}
						error={!!errors.descuento}
						helperText={errors?.descuento?.message}
						required
						InputLabelProps={{
							shrink: true,
						}}
					/>
					<TextField
						name="precioUnitario"
						type="number"
						placeholder="Precio Unitario"
						className="mt-8 mb-16 mx-12 w-1/3"
						label="Precio Unitario"
						disabled
						variant="outlined"
						fullWidth
						value={precioUnitario}
						error={!!errors.precioUnitario}
						helperText={errors?.precioUnitario?.message}
						required
						InputLabelProps={{
							shrink: true,
						}}
					/>
					<TextField
						name="totalImporte"
						type="number"
						placeholder="Total Importe"
						className="mt-8 mb-16 mx-12 w-1/3"
						label="Total Importe"
						disabled
						variant="outlined"
						fullWidth
						value={totalImporte}
						error={!!errors.totalImporte}
						helperText={errors?.totalImporte?.message}
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

export default AgregarTelas;

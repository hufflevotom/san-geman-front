import { useEffect, useState } from 'react';
import { Autocomplete, Switch, TextField } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import debounce from 'lodash.debounce';
import { limitCombo, offsetCombo } from 'constants/constantes';
import { Controller, useFormContext } from 'react-hook-form';
import httpClient from 'utils/Api';

const FamiliaAvios = ({ generar }) => {
	const methods = useFormContext();
	const { control, formState, getValues } = methods;
	const dataForm = getValues();
	const { errors } = formState;

	const [dataFamiliasAvios, setDataFamiliasAvios] = useState([]);
	const [dataColores, setDataColores] = useState([]);
	const [colorTemporal, setColorTemporal] = useState(null);
	const [dataTallas, setDataTallas] = useState([]);
	const [tallasTemporal, setTallasTemporal] = useState([]);

	const [coloresSearchText, setColoresSearchText] = useState('');
	const [familiasAviosSearchText, setFamiliasAviosSearchText] = useState('');
	const [tallasSearchText, setTallasSearchText] = useState('');

	useEffect(() => {
		traerFamiliasAvios();
		traerTallas();
		traerColores();
	}, []);

	const traerColores = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `maestro/color?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataColores(data);
	};

	const debouncedGetColores = debounce(() => {
		traerColores(coloresSearchText);
	}, 500);

	useEffect(() => {
		debouncedGetColores(); // Llamar a la versión debounced de fetchData
		return debouncedGetColores.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [coloresSearchText]);

	const traerFamiliasAvios = async busqueda => {
		let text = '';
		if (busqueda) {
			text = busqueda.trim();
		}

		const url = `maestro/familia-avios?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${text}`;
		const response = await httpClient.get(url);
		const data = await response.data.body[0].filter(e => e.id !== 1);
		setDataFamiliasAvios(data);
	};

	const debouncedGetFamiliasAvios = debounce(() => {
		traerFamiliasAvios(familiasAviosSearchText);
	}, 500);

	useEffect(() => {
		debouncedGetFamiliasAvios(); // Llamar a la versión debounced de fetchData
		return debouncedGetFamiliasAvios.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [familiasAviosSearchText]);

	const traerTallas = async busqueda => {
		let text = '';
		if (busqueda) {
			text = busqueda.trim();
		}

		const url = `maestro/tallas?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${text}`;
		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataTallas(data);
	};

	const debouncedGetTallas = debounce(() => {
		traerTallas(tallasSearchText);
	}, 500);

	useEffect(() => {
		debouncedGetTallas(); // Llamar a la versión debounced de fetchData
		return debouncedGetTallas.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [tallasSearchText]);

	const opcionesFamiliasTela = dataFamiliasAvios.map(tela => ({
		...tela,
		label: tela.descripcion,
	}));

	const opcionesTalla = dataTallas.map(talla => ({
		...talla,
		label: talla.talla,
	}));

	const opcionesColores = dataColores.map(color => ({
		...color,
		label: `${color.descripcion}`,
	}));

	const opcionesTipo = [
		{ id: 1, value: 'AVIOS DE COSTURA', label: 'AVIOS DE COSTURA' },
		{ id: 2, value: 'AVIOS DE ACABADO', label: 'AVIOS DE ACABADO' },
	];

	return (
		<>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="tipo"
					control={control}
					render={({ field: { onChange, value } }) => {
						const data = value
							? {
									...value,
									label: value?.value ? value.value : value,
							  }
							: null;

						return (
							<Autocomplete
								className="mt-8 mb-16 mx-12"
								// freeSolo
								isOptionEqualToValue={(op, val) => op.label === val.label}
								options={opcionesTipo || []}
								value={data}
								filterOptions={(options, state) => {
									return options;
								}}
								fullWidth
								onChange={(event, newValue) => {
									if (newValue) {
										const { label, ...valor } = newValue;
										onChange(valor);
									}
								}}
								renderInput={params => (
									<TextField
										{...params}
										placeholder="Seleccione el tipo"
										label="Tipo de Avio"
										error={!!errors.banco}
										helperText={errors?.banco?.message}
										variant="outlined"
										fullWidth
										InputLabelProps={{
											shrink: true,
										}}
									/>
								)}
							/>
						);
					}}
				/>

				{!dataForm.hilos && (
					<Controller
						name="familiaAvios"
						control={control}
						render={({ field: { onChange, value } }) => {
							const unidad = value
								? {
										...value,
										label: value?.descripcion,
								  }
								: null;
							return (
								<Autocomplete
									// freeSolo
									className="mt-8 mb-16 mx-12"
									// eslint-disable-next-line radix
									disabled={parseInt(dataForm?.id) > 0}
									fullWidth
									isOptionEqualToValue={(op, val) => op.id === val.id}
									options={opcionesFamiliasTela || []}
									value={unidad}
									onInputChange={(event, newInputValue) => {
										setFamiliasAviosSearchText(newInputValue);
									}}
									onChange={(event, newValue) => {
										if (newValue) {
											const { label, ...valor } = newValue;
											onChange(valor);
										} else {
											onChange(null);
										}
									}}
									renderInput={params => (
										<TextField
											{...params}
											placeholder="Seleccione la Familia"
											label="Familia Avios"
											error={!!errors.familiaAvios}
											helperText={errors?.familiaAvios?.message}
											variant="outlined"
											InputLabelProps={{
												shrink: true,
											}}
										/>
									)}
								/>
							);
						}}
					/>
				)}

				{dataForm.hilos && (
					<Controller
						name="codigoSec"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								className="mt-8 mb-16 mx-12"
								error={!!errors.codigoSec}
								required
								helperText={errors?.codigoSec?.message}
								id="codigoSec"
								label="Código"
								variant="outlined"
								fullWidth
							/>
						)}
					/>
				)}

				{dataForm.hilos && (
					<Controller
						name="marcaHilo"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								className="mt-8 mb-16 mx-12"
								error={!!errors.marcaHilo}
								required
								helperText={errors?.marcaHilo?.message}
								id="marcaHilo"
								label="Marca"
								variant="outlined"
								fullWidth
							/>
						)}
					/>
				)}

				{dataForm.hilos && (
					<Controller
						name="color"
						control={control}
						render={({ field: { onChange, value } }) => {
							const unidad = value
								? {
										...value,
										label: `${value.descripcion}`,
								  }
								: null;
							return (
								<Autocomplete
									className="mt-8 mb-16 mx-12 sm:w-full"
									// freeSolo
									fullWidth
									isOptionEqualToValue={(op, val) => op.id === val.id}
									options={opcionesColores || []}
									value={unidad}
									filterOptions={(options, state) => {
										return options;
									}}
									onInputChange={(event, newInputValue) => {
										setColoresSearchText(newInputValue);
										setColorTemporal({ ...unidad, label: newInputValue });
									}}
									onChange={(event, newValue) => {
										if (newValue) {
											const { label, ...valor } = newValue;

											onChange(valor);
											setColorTemporal(null);
										} else {
											onChange(null);
										}
									}}
									renderInput={params => (
										<TextField
											{...params}
											placeholder="Seleccione el color"
											label="Color"
											error={!!errors.color}
											helperText={errors?.color?.message}
											variant="outlined"
											InputLabelProps={{
												shrink: true,
											}}
										/>
									)}
								/>
							);
						}}
					/>
				)}
				{generar !== true && (
					<Controller
						name="talla"
						control={control}
						render={({ field: { onChange, value } }) => {
							const talla = value
								? {
										...value,
										label: `${value.talla}`,
								  }
								: null;
							return (
								<Autocomplete
									className="mt-8 mb-16 mx-12 sm:w-full"
									// freeSolo
									fullWidth
									isOptionEqualToValue={(op, val) => op.id === val.id}
									options={opcionesTalla || []}
									value={talla}
									filterOptions={(options, state) => {
										return options;
									}}
									onInputChange={(event, newInputValue) => {
										setTallasSearchText(newInputValue);
										setTallasTemporal({ ...talla, label: newInputValue });
									}}
									onChange={(event, newValue) => {
										if (newValue) {
											const { label, ...valor } = newValue;

											onChange(valor);
											setTallasTemporal(null);
										} else {
											onChange(null);
										}
									}}
									renderInput={params => (
										<TextField
											{...params}
											placeholder="Todas las tallas"
											label="Talla"
											error={!!errors.talla}
											helperText={errors?.talla?.message}
											variant="outlined"
											InputLabelProps={{
												shrink: true,
											}}
										/>
									)}
								/>
							);
						}}
					/>
				)}
			</div>

			{(dataForm.tipo?.value === 'AVIOS DE COSTURA' || dataForm.tipo === 'AVIOS DE COSTURA') && (
				<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">
					<Controller
						name="hilos"
						control={control}
						render={({ field: { onChange, value } }) => {
							return (
								<FormControlLabel
									className="mt-8 mb-16 mx-12"
									control={
										<Switch
											color="info"
											checked={value}
											onChange={e => {
												onChange(e.target.checked);
											}}
											inputProps={{ 'aria-label': 'controlled' }}
										/>
									}
									label="Agregar Hilo"
								/>
							);
						}}
					/>
				</div>
			)}

			{(dataForm.tipo?.value === 'AVIOS DE ACABADO' || dataForm.tipo === 'AVIOS DE ACABADO') &&
				dataForm?.familiaAvios?.id === 8 && (
					<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">
						<Controller
							name="calcularCajas"
							control={control}
							render={({ field: { onChange, value } }) => {
								return (
									<FormControlLabel
										className="mt-8 mb-16 mx-12"
										control={
											<Switch
												color="info"
												checked={value}
												onChange={e => {
													onChange(e.target.checked);
												}}
												inputProps={{ 'aria-label': 'controlled' }}
											/>
										}
										label="Calcular Cajas"
									/>
								);
							}}
						/>
					</div>
				)}
		</>
	);
};

export default FamiliaAvios;

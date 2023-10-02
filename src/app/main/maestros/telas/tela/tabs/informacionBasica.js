import { Autocomplete } from '@mui/material';
import debounce from 'lodash.debounce';
import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';
import { limitCombo, offsetCombo } from 'constants/constantes';
import { useEffect, useState } from 'react';
import httpClient from 'utils/Api';
import TitulacionTab from './titulacion';

function InformacionBasica(props) {
	const methods = useFormContext();
	const { control, formState, getValues } = methods;
	const { errors } = formState;
	const [dataUnidades, setDataUnidades] = useState([]);
	const [dataUnidadesSecundarias, setDataUnidadesSecundarias] = useState([]);
	const [unidadTemporal, setUnidadTemporal] = useState(null);
	const [unidadSecundariaTemporal, setUnidadSecundariaTemporal] = useState(null);

	const [unidadesSearchText, setUnidadesSearchText] = useState('');
	const [unidades2SearchText, setUnidades2SearchText] = useState('');

	const getValor = getValues();

	useEffect(() => {
		traerUnidades();
		traerUnidadesSecundarias();
	}, []);

	const traerUnidades = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `configuraciones/unidad-media?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataUnidades(data);
	};

	const debouncedGetUnidades = debounce(() => {
		traerUnidades(unidadesSearchText);
	}, 500);

	useEffect(() => {
		debouncedGetUnidades(); // Llamar a la versión debounced de fetchData
		return debouncedGetUnidades.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [unidadesSearchText]);

	const traerUnidadesSecundarias = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `configuraciones/unidad-media?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataUnidadesSecundarias(data);
	};

	const debouncedGetUnidades2 = debounce(() => {
		traerUnidadesSecundarias(unidades2SearchText);
	}, 500);

	useEffect(() => {
		debouncedGetUnidades2(); // Llamar a la versión debounced de fetchData
		return debouncedGetUnidades2.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [unidades2SearchText]);

	const opcionesUnidades = dataUnidades.map(unidad => ({
		...unidad,
		label: unidad.nombre,
	}));

	const opcionesUnidadesSecundarias = dataUnidadesSecundarias.map(unidadSecundaria => ({
		...unidadSecundaria,
		label: unidadSecundaria.nombre,
	}));

	const opcionesTipoTela = [
		{
			value: 'SOLIDO',
			label: 'S-SOLIDO',
		},
		{
			value: 'LISTADO',
			label: 'L-LISTADO',
		},
		{
			value: 'JACQUARD',
			label: 'J-JACQUARD',
		},
	];

	const opcionesTelaListado = [
		{
			value: 'FEED',
			label: 'FEED',
		},
		{
			value: 'AUTOMÁTICO',
			label: 'AUTOMÁTICO',
		},
		{
			value: 'INGENIERÍA',
			label: 'INGENIERÍA',
		},
	];

	return (
		<div>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="tipoTela"
					control={control}
					render={({ field: { onChange, value } }) => {
						const data = value
							? {
									...value,
									label: value.value ? value.value : value,
							  }
							: null;

						return (
							<Autocomplete
								className="mt-8 mb-16 mx-12"
								disabled={getValor.estado !== 'desarrollo'}
								// freeSolo
								isOptionEqualToValue={(op, val) => op.id === val.id}
								options={opcionesTipoTela || []}
								value={data}
								filterOptions={(options, state) => {
									return options;
								}}
								fullWidth
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
										error={!!errors.tipoTela}
										required
										helperText={errors?.tipoTela?.message}
										label="Tipo de Tela"
										id="tipoTela"
										variant="outlined"
										fullWidth
									/>
								)}
							/>
						);
					}}
				/>

				{getValor?.tipoTela?.value === 'LISTADO' && (
					<Controller
						name="tipoListado"
						control={control}
						render={({ field: { onChange, value } }) => {
							const data = value
								? {
										...value,
										label: value.value ? value.value : value,
								  }
								: null;

							return (
								<Autocomplete
									className="mt-8 mb-16 mx-12"
									disabled={getValor.estado !== 'desarrollo'}
									// freeSolo
									isOptionEqualToValue={(op, val) => op.id === val.id}
									options={opcionesTelaListado || []}
									value={data}
									filterOptions={(options, state) => {
										return options;
									}}
									fullWidth
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
											error={!!errors.tipoTelaListado}
											required
											helperText={errors?.tipoTelaListado?.message}
											label="Tipo de Listado"
											id="tipoTelaListado"
											variant="outlined"
											fullWidth
										/>
									)}
								/>
							);
						}}
					/>
				)}

				{getValor?.tipoTela === 'LISTADO' && (
					<Controller
						name="tipoListado"
						control={control}
						render={({ field: { onChange, value } }) => {
							const data = value
								? {
										...value,
										label: value.value ? value.value : value,
								  }
								: null;

							return (
								<Autocomplete
									className="mt-8 mb-16 mx-12"
									disabled={getValor.estado !== 'desarrollo'}
									// freeSolo
									isOptionEqualToValue={(op, val) => op.id === val.id}
									options={opcionesTelaListado || []}
									value={data}
									filterOptions={(options, state) => {
										return options;
									}}
									fullWidth
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
											error={!!errors.tipoTelaListado}
											required
											helperText={errors?.tipoTelaListado?.message}
											label="Tipo de Listado"
											id="tipoTelaListado"
											variant="outlined"
											fullWidth
										/>
									)}
								/>
							);
						}}
					/>
				)}
			</div>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="codReferencia"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							disabled={getValor.estado !== 'desarrollo'}
							className="mt-8 mb-16 mx-12 sm:w-full"
							error={!!errors.codReferencia}
							required
							helperText={errors?.codReferencia?.message}
							id="codReferencia"
							label="Codigo de Referencia"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				{/* <Controller
					name="composicion"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							disabled={getValor.estado !== 'desarrollo'}
							className="mt-8 mb-16 mx-12 sm:w-full"
							error={!!errors.composicion}
							required
							helperText={errors?.composicion?.message}
							id="composicion"
							label="Composición de Tela"
							variant="outlined"
							fullWidth
						/>
					)}
				/> */}
				<Controller
					name="unidadMedida"
					control={control}
					render={({ field: { onChange, value } }) => {
						const unidad = value
							? {
									...value,
									label: value.nombre,
							  }
							: null;
						return (
							<Autocomplete
								className="mt-8 mb-16 mx-12 sm:w-full"
								// freeSolo
								fullWidth
								isOptionEqualToValue={(op, val) => op.id === val.id}
								options={opcionesUnidades || []}
								value={unidad}
								filterOptions={(options, state) => {
									return options;
								}}
								onInputChange={(event, newInputValue) => {
									setUnidadesSearchText(newInputValue);
									setUnidadTemporal({ ...unidad, label: newInputValue });
								}}
								onChange={(event, newValue) => {
									if (newValue) {
										const { label, ...valor } = newValue;

										onChange(valor);
										setUnidadTemporal(null);
									} else {
										onChange(null);
									}
								}}
								renderInput={params => (
									<TextField
										{...params}
										required
										disabled={getValor.estado !== 'desarrollo'}
										placeholder="Seleccione la Unidad"
										label="Unidad"
										error={!!errors.unidadMedida}
										helperText={errors?.unidadMedida?.message}
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
				<Controller
					name="unidadMedidaSecundaria"
					control={control}
					render={({ field: { onChange, value } }) => {
						const unidadSecundaria = value
							? {
									...value,
									label: value.nombre,
							  }
							: null;
						return (
							<Autocomplete
								className="mt-8 mb-16 mx-12 sm:w-full"
								// freeSolo
								fullWidth
								isOptionEqualToValue={(op, val) => op.id === val.id}
								options={opcionesUnidadesSecundarias || []}
								value={unidadSecundaria}
								filterOptions={(options, state) => {
									return options;
								}}
								onInputChange={(event, newInputValue) => {
									setUnidades2SearchText(newInputValue);
									setUnidadSecundariaTemporal({ ...unidadSecundaria, label: newInputValue });
								}}
								onChange={(event, newValue) => {
									if (newValue) {
										const { label, ...valor } = newValue;

										onChange(valor);
										setUnidadSecundariaTemporal(null);
									} else {
										onChange(null);
									}
								}}
								renderInput={params => (
									<TextField
										{...params}
										required
										disabled={getValor.estado !== 'desarrollo'}
										placeholder="Seleccione la Unidad Secundaria"
										label="Unidad Secundaria"
										error={!!errors.unidadMedidaSecundaria}
										helperText={errors?.unidadMedidaSecundaria?.message}
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
			</div>
			<div>
				<div className="mx-6 mb-16 mt-16 text-base">Titulación</div>
				<TitulacionTab />
			</div>
			<div className="mx-6 mb-16 mt-16 text-base">Calidad Textil</div>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="densidad"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							disabled={getValor.estado !== 'desarrollo'}
							className="mt-8 mb-16 mx-12"
							error={!!errors.densidad}
							required
							type="number"
							InputProps={{
								inputProps: { min: 0 },
							}}
							helperText={errors?.densidad?.message}
							id="densidad"
							label="Densidad"
							variant="outlined"
							fullWidth
						/>
					)}
				/>

				<Controller
					name="ancho"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							disabled={getValor.estado !== 'desarrollo'}
							className="mt-8 mb-16 mx-12 sm:w-full"
							error={!!errors.ancho}
							required
							type="number"
							InputProps={{
								inputProps: { min: 0 },
							}}
							helperText={errors?.ancho?.message}
							id="ancho"
							label="Ancho"
							variant="outlined"
							fullWidth
						/>
					)}
				/>

				<Controller
					name="acabado"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							disabled={getValor.estado !== 'desarrollo'}
							className="mt-8 mb-16 mx-12 sm:w-full"
							error={!!errors.acabado}
							required
							helperText={errors?.acabado?.message}
							id="acabado"
							label="Acabado"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="encogimientoLargo"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							disabled={getValor.estado !== 'desarrollo'}
							className="mt-8 mb-16 mx-12 sm:w-full"
							error={!!errors.encogimientoLargo}
							required
							type="number"
							InputProps={{
								inputProps: { min: 0 },
							}}
							helperText={errors?.encogimientoLargo?.message}
							id="encogimientoLargo"
							label="Encogimiento Largo"
							variant="outlined"
							fullWidth
						/>
					)}
				/>

				<Controller
					name="encogimientoAncho"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							disabled={getValor.estado !== 'desarrollo'}
							className="mt-8 mb-16 mx-12 sm:w-full"
							error={!!errors.encogimientoAncho}
							required
							type="number"
							InputProps={{
								inputProps: { min: 0 },
							}}
							helperText={errors?.encogimientoAncho?.message}
							id="encogimientoAncho"
							label="Encogimiento Ancho"
							variant="outlined"
							fullWidth
						/>
					)}
				/>

				<Controller
					name="revirado"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							disabled={getValor.estado !== 'desarrollo'}
							className="mt-8 mb-16 mx-12 sm:w-full"
							error={!!errors.revirado}
							required
							type="number"
							InputProps={{
								inputProps: { min: 0 },
							}}
							helperText={errors?.revirado?.message}
							id="revirado"
							label="Revirado Estandar"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
		</div>
	);
}

export default InformacionBasica;

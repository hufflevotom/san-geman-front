import { Autocomplete } from '@mui/material';
import debounce from 'lodash.debounce';
import TextField from '@mui/material/TextField';
import { limitCombo, offsetCombo } from 'constants/constantes';
import { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import httpClient from 'utils/Api';

function InformacionBasica(props) {
	const methods = useFormContext();
	const { control, formState, getValues } = methods;
	const { errors } = formState;

	const [dataUnidades, setDataUnidades] = useState([]);
	const [unidadTemporal, setUnidadTemporal] = useState(null);
	const [dataUnidadesSecundarias, setDataUnidadesSecundarias] = useState([]);
	const [unidadSecundariaTemporal, setUnidadSecundariaTemporal] = useState(null);
	const [dataUnidadesCompra, setDataUnidadesCompra] = useState([]);
	const [unidadCompraTemporal, setUnidadCompraTemporal] = useState(null);

	const [unidadesSearchText, setUnidadesSearchText] = useState('');
	const [unidades2SearchText, setUnidades2SearchText] = useState('');
	const [unidadesCSearchText, setUnidadesCSearchText] = useState('');

	useEffect(() => {
		traerUnidades();
		traerUnidadesSecundarias();
		traerUnidadesCompras();
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

	const debouncedTraerUnidades = debounce(() => {
		traerUnidades(unidadesSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerUnidades(); // Llamar a la versión debounced de fetchData
		return debouncedTraerUnidades.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
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

	const debouncedTraerUnidades2 = debounce(() => {
		traerUnidadesSecundarias(unidades2SearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerUnidades2(); // Llamar a la versión debounced de fetchData
		return debouncedTraerUnidades2.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [unidades2SearchText]);

	const traerUnidadesCompras = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `configuraciones/unidad-media?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataUnidadesCompra(data);
	};

	const debouncedTraerUnidadesC = debounce(() => {
		traerUnidadesCompras(unidadesCSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerUnidadesC(); // Llamar a la versión debounced de fetchData
		return debouncedTraerUnidadesC.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [unidadesCSearchText]);

	const opcionesUnidades = dataUnidades.map(unidad => ({
		...unidad,
		label: unidad.nombre,
	}));

	const opcionesUnidadesSecundarias = dataUnidadesSecundarias.map(unidad => ({
		...unidad,
		label: unidad.nombre,
	}));

	const opcionesUnidadesCompras = dataUnidadesCompra.map(unidad => ({
		...unidad,
		label: unidad.nombre,
	}));

	return (
		<div>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4" style={{ alignItems: 'center' }}>
				<Controller
					name="nombre"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.nombre}
							required
							helperText={errors?.nombre?.message}
							id="nombre"
							label="Nombre"
							variant="outlined"
							fullWidth
						/>
					)}
				/>

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
										placeholder="Seleccione la Unidad"
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
				<Controller
					name="unidadMedidaCompra"
					control={control}
					render={({ field: { onChange, value } }) => {
						const unidadCompra = value
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
								options={opcionesUnidadesCompras || []}
								value={unidadCompra}
								filterOptions={(options, state) => {
									return options;
								}}
								onInputChange={(event, newInputValue) => {
									setUnidadesCSearchText(newInputValue);
									setUnidadCompraTemporal({ ...unidadCompra, label: newInputValue });
								}}
								onChange={(event, newValue) => {
									if (newValue) {
										const { label, ...valor } = newValue;

										onChange(valor);
										setUnidadCompraTemporal(null);
									} else {
										onChange(null);
									}
								}}
								renderInput={params => (
									<TextField
										{...params}
										placeholder="Seleccione la Unidad"
										label="Unidad de Compra"
										error={!!errors.unidadMedidaCompra}
										helperText={errors?.unidadMedidaCompra?.message}
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
		</div>
	);
}

export default InformacionBasica;

import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import debounce from 'lodash.debounce';
import { Autocomplete, TextField } from '@mui/material';
import httpClient from 'utils/Api';
import { limitCombo, offsetCombo } from 'constants/constantes';

function Equivalente() {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	const [dataUnidades, setDataUnidades] = useState([]);

	const [unidadesSearchText, setUnidadesSearchText] = useState('');

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

	const opcionesUnidades = dataUnidades.map(unidad => ({
		...unidad,
		label: unidad.nombre,
	}));

	useEffect(() => {
		traerUnidades();
	}, []);
	return (
		<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
			<Controller
				name="unidad"
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
							fullWidth
							isOptionEqualToValue={(op, val) => op.id === val.id}
							options={opcionesUnidades || []}
							value={unidad}
							filterOptions={(options, state) => {
								return options;
							}}
							onInputChange={(event, newInputValue) => {
								traerUnidades(newInputValue);
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
				name="valor"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						type="number"
						InputProps={{
							inputProps: { min: 0 },
						}}
						className="mt-8 mb-16 mx-4 mx-12"
						error={!!errors.equivalente}
						helperText={errors?.equivalente?.message}
						label="Equivalente"
						id="equivalente"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
		</div>
	);
}

export default Equivalente;

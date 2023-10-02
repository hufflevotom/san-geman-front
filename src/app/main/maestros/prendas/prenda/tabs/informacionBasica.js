import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import debounce from 'lodash.debounce';
import { useFormContext, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import httpClient from 'utils/Api';
import { limitCombo, offsetCombo } from 'constants/constantes';

function InformacionBasica(props) {
	const methods = useFormContext();
	const { control, formState, setValue } = methods;
	const { errors } = formState;

	const [dataUnidades, setDataUnidades] = useState([]);
	const [unidadesSearchText, setUnidadesSearchText] = useState('');

	useEffect(() => {
		traerUnidades();
	}, []);

	const traerUnidades = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `configuraciones/unidad-media?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setValue('unidadMedida', data.find(op => op.prefijo === 'UND') || null);
		setDataUnidades(data);
	};

	const debouncedGetUnidades = debounce(() => {
		traerUnidades(unidadesSearchText);
	}, 500);

	useEffect(() => {
		debouncedGetUnidades(); // Llamar a la versión debounced de fetchData
		return debouncedGetUnidades.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [unidadesSearchText]);

	const opcionesUnidades = dataUnidades.map(unidad => ({
		...unidad,
		label: unidad.nombre,
	}));

	return (
		<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
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
						label="Nombre"
						id="nombre"
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
							className="mt-8 mb-16 mx-12"
							disabled
							fullWidth
							isOptionEqualToValue={(op, val) => op.id === val.id}
							options={opcionesUnidades || []}
							value={unidad}
							filterOptions={(options, state) => {
								return options;
							}}
							onInputChange={(event, newInputValue) => {
								setUnidadesSearchText(newInputValue);
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
		</div>
	);
}

export default InformacionBasica;

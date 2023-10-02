import { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import debounce from 'lodash.debounce';
import { limitCombo, offsetCombo } from 'constants/constantes';
import { Controller, useFormContext } from 'react-hook-form';
import httpClient from 'utils/Api';

const Tallas = () => {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;
	const [dataTallas, setDataTallas] = useState([]);

	const [tallasSearchText, setTallasSearchText] = useState('');

	useEffect(() => {
		traerTallas();
	}, []);

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

	const opcionesTalla = dataTallas.map(talla => ({
		...talla,
		label: talla.talla,
	}));

	return (
		<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
			<Controller
				name="tallas"
				control={control}
				render={({ field: { onChange, value } }) => {
					let talla = [];
					if (value) {
						talla = value.map(t => ({ ...t, label: t.talla }));
					}
					return (
						<Autocomplete
							className="mt-8 mb-16 mx-12 sm:w-full"
							multiple
							freeSolo
							fullWidth
							isOptionEqualToValue={(op, val) => op.id === val.id}
							options={opcionesTalla || []}
							value={talla}
							filterOptions={(options, state) => {
								return options;
							}}
							onInputChange={(event, newInputValue) => {
								setTallasSearchText(newInputValue);
							}}
							onChange={(event, newValue) => {
								if (newValue) {
									onChange(newValue);
								} else {
									onChange(null);
								}
							}}
							renderInput={params => (
								<TextField
									{...params}
									placeholder="Seleccione las tallas"
									label="Tallas"
									required
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
		</div>
	);
};

export default Tallas;

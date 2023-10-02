import { limitCombo, offsetCombo } from 'constants/constantes';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import httpClient from 'utils/Api';
import debounce from 'lodash.debounce';

/* eslint-disable import/prefer-default-export */
const { TextField, MenuItem, Icon, IconButton, Autocomplete } = require('@mui/material');

export const LavanderiaForm = ({ disabled }) => {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	const [opcionesLavados, setOpcionesLavados] = useState([]);

	const [lavadosSearchText, setLavadosSearchText] = useState('');

	const traerLavados = async texto => {
		let url = `maestro/lavados?limit=${limitCombo}&offset=${offsetCombo}`;
		if (texto) {
			url += `&busqueda=${texto}`;
		}
		const response = await httpClient.get(url);
		const dataResponse = await response.data.body[0];
		const data = dataResponse.map(item => ({ ...item, label: item.descripcion }));
		setOpcionesLavados(data);
	};

	const debouncedTraerLavados = debounce(() => {
		traerLavados(lavadosSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerLavados(); // Llamar a la versión debounced de fetchData
		return debouncedTraerLavados.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [lavadosSearchText]);

	useEffect(() => {
		traerLavados();
	}, []);

	return (
		<>
			<hr />
			<div className="mx-6 mb-8 mt-16 text-base">Lavanderia</div>
			<Controller
				name="lavados"
				control={control}
				render={({ field: { onChange, value } }) => {
					const lavados = value || [];
					return (
						<Autocomplete
							multiple
							freeSolo
							disabled={disabled}
							className="mt-8 mb-16 mx-12"
							isOptionEqualToValue={(op, val) => op.id === val.id}
							options={opcionesLavados || []}
							value={lavados}
							fullWidth
							filterOptions={(options, state) => options}
							onInputChange={(event, newInputValue) => {
								setLavadosSearchText(newInputValue);
							}}
							onChange={(event, newValue) => {
								onChange(newValue);
							}}
							renderInput={params => (
								<TextField
									{...params}
									placeholder="Seleccione la lavanderia"
									label="Lavanderia"
									required
									fullWidth
									error={!!errors.lavados}
									helperText={errors?.lavados?.message}
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
		</>
	);
};

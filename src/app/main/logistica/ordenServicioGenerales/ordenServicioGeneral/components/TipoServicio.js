import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

function TipoServicio({ current, setCurrent, disabled }) {
	const opciones = [
		{ id: 'EX', key: 'EX', label: 'Externo' },
		{ id: 'IN', key: 'IN', label: 'Interno' },
	];

	const [value, setValue] = useState(null);

	useEffect(() => {
		if (current) {
			const currentValue = opciones.find(
				e => e.key === (typeof current === 'string' ? current : current.key)
			);
			setValue(currentValue);
		}
	}, [current]);

	return (
		<Autocomplete
			className="mt-8 mb-16 mx-12"
			isOptionEqualToValue={(opc, v) => opc.key === v.key}
			options={opciones}
			value={value}
			fullWidth
			disabled={disabled}
			filterOptions={(options, state) => {
				return options;
			}}
			onChange={(event, newValue) => {
				if (newValue?.id) {
					setValue(newValue);
					setCurrent(newValue);
				}
			}}
			renderInput={params => (
				<TextField
					{...params}
					placeholder="Seleccione el tipo de servicio"
					label="Tipo de servicio"
					required
					autoFocus
					variant="outlined"
					InputLabelProps={{
						shrink: true,
					}}
					fullWidth
				/>
			)}
		/>
	);
}

export default TipoServicio;

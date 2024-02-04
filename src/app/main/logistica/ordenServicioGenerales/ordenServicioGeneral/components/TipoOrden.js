import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

function TipoOrden({ opciones, current, setCurrent, disabled }) {
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
					placeholder="Seleccione la ruta"
					label="Ruta"
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

export default TipoOrden;

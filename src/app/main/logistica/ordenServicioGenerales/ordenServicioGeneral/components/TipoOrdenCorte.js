import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

const TipoOrdenCorte = ({ current, setCurrent, reset, currentProduccion, disabled }) => {
	const opciones = [
		{ id: 'PIEZAS', key: 'PIEZAS', label: 'PIEZAS' },
		{ id: 'PAÑOS', key: 'PAÑOS', label: 'PAÑOS' },
	];

	const [value, setValue] = useState(null);

	useEffect(() => {
		if (current) {
			const currentValue = opciones.find(e => e.key === current.key);
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
			disabled={!currentProduccion || disabled}
			filterOptions={(options, state) => {
				return options;
			}}
			onChange={(event, newValue) => {
				if (newValue?.id) {
					setValue(newValue);
					setCurrent(newValue);
				} else {
					reset();
				}
			}}
			renderInput={params => (
				<TextField
					{...params}
					placeholder="Seleccione el tipo de orden de corte"
					label="Tipo de orden"
					required
					variant="outlined"
					InputLabelProps={{
						shrink: true,
					}}
					fullWidth
				/>
			)}
		/>
	);
};

export default TipoOrdenCorte;

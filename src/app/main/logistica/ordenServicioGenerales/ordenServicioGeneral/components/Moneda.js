import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

const Moneda = ({ currentMoneda, setCurrentMoneda, resetMoneda, currentProveedor, disabled }) => {
	const opciones = [
		{ id: 'SOLES', key: 'SOLES', label: 'SOLES' },
		{ id: 'DOLARES', key: 'DOLARES', label: 'DOLARES' },
	];

	const [value, setValue] = useState(null);

	useEffect(() => {
		if (currentMoneda) {
			const currentValue = opciones.find(
				e => e.key === (typeof currentMoneda === 'string' ? currentMoneda : currentMoneda.key)
			);
			setValue(currentValue);
		}
	}, [currentMoneda]);

	return (
		<Autocomplete
			className="mt-8 mb-16 mx-12"
			isOptionEqualToValue={(opc, v) => opc.key === v.key}
			options={opciones}
			value={value}
			fullWidth
			disabled={!currentProveedor || disabled}
			filterOptions={(options, state) => {
				return options;
			}}
			// onInputChange={(event, newInputValue) => {
			// 	getProveedores(newInputValue);
			// }}
			onChange={(event, newValue) => {
				if (newValue?.id) {
					setValue(newValue);
					setCurrentMoneda(newValue);
				} else {
					resetMoneda();
				}
			}}
			renderInput={params => (
				<TextField
					{...params}
					placeholder="Seleccione una moneda"
					label="Moneda"
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

export default Moneda;

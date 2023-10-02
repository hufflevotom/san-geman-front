import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

const opciones = [
	{ id: 'SOLES', key: 'SOLES', label: 'SOLES' },
	{ id: 'DOLARES', key: 'DOLARES', label: 'DOLARES' },
];

const Moneda = ({
	currentMoneda,
	setCurrentMoneda,
	resetMoneda,
	currentProveedor,
	disabled,
	tipo,
}) => {
	const [value, setValue] = useState(null);

	useEffect(() => {
		if (currentMoneda) {
			const currentValue = opciones.find(
				e => e.id === (typeof currentMoneda === 'string' ? currentMoneda : currentMoneda.id)
			);
			setValue(currentValue);
		}
	}, [currentMoneda]);

	return (
		<Autocomplete
			className="mt-8 mb-16 mx-12"
			isOptionEqualToValue={(opc, v) => opc?.id === v?.id}
			options={opciones}
			value={value}
			fullWidth
			disabled={!currentProveedor || disabled || tipo !== 'nuevo'}
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
					// setValue2('moneda', newValue.id);
				} else {
					resetMoneda();
					// setValue2('moneda', '');
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

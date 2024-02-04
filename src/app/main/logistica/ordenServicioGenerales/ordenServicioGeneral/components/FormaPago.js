import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

function FormaPago({
	getFormaPagos,
	uniqueFormasPago,
	currentFormaPago,
	setCurrentFormaPago,
	resetFormaPago,
	currentProveedor,
	disabled,
}) {
	const opciones = uniqueFormasPago.map(e => ({
		...e,
		label: `${e.descripcion}`,
		key: e.id,
	}));

	const [value, setValue] = useState(null);

	useEffect(() => {
		if (currentFormaPago) {
			const currentValue = { key: currentFormaPago.id, label: currentFormaPago.descripcion };
			setValue(currentValue);
		}
	}, [currentFormaPago]);

	return (
		<Autocomplete
			className="mt-8 mb-16 mx-12"
			isOptionEqualToValue={(opc, v) => opc.id === v.id}
			options={opciones}
			value={value}
			fullWidth
			disabled={!currentProveedor || disabled}
			filterOptions={(options, state) => {
				return options;
			}}
			onInputChange={(event, newInputValue) => {
				getFormaPagos(newInputValue);
			}}
			onChange={(event, newValue) => {
				if (newValue?.id) {
					setValue(newValue);
					setCurrentFormaPago(newValue);
				} else {
					resetFormaPago();
				}
			}}
			renderInput={params => (
				<TextField
					{...params}
					placeholder="Seleccione una forma de pago"
					label="Forma de pago"
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
}

export default FormaPago;

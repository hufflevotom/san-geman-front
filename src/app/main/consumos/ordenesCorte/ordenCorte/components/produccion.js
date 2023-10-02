import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

const Produccion = ({
	currentProduccion,
	getProducciones,
	producciones,
	getProduccion,
	resetProduccion,
	disabled,
	action,
}) => {
	const opcionesProducciones = producciones.map(produccion => ({
		...produccion,
		label: `${produccion.codigo}`,
		key: produccion.id,
	}));

	const [value, setValue] = useState({ key: '', label: '' });

	useEffect(() => {
		const currentValue = currentProduccion
			? { key: currentProduccion.id, label: currentProduccion.codigo }
			: { key: '', label: '' };
		setValue(currentValue);
	}, [currentProduccion]);

	return (
		<>
			<Autocomplete
				className="mt-8 mb-16 mx-12"
				isOptionEqualToValue={(opc, v) => opc.id === v.id}
				options={opcionesProducciones}
				value={value}
				fullWidth
				disabled={disabled || action}
				filterOptions={(options, state) => {
					return options;
				}}
				onInputChange={(event, newInputValue) => {
					getProducciones(newInputValue);
				}}
				onChange={(event, newValue) => {
					if (newValue?.id) {
						getProduccion(newValue.id);
					} else {
						resetProduccion();
					}
				}}
				renderInput={params => (
					<TextField
						{...params}
						placeholder="Seleccione una produccion"
						label="Producción"
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
		</>
	);
};

export default Produccion;

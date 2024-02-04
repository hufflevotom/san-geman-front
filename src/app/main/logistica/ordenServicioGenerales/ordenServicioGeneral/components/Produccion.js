import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

const Produccion = ({
	getProducciones,
	producciones,
	setCurrentProduccion,
	currentProduccion,
	resetProduccion,
	disabled,
}) => {
	const opcionesProducciones = producciones.map(produccion => ({
		...produccion,
		label: `${produccion.codigo}`,
		key: produccion.id,
	}));

	const [value, setValue] = useState(null);

	useEffect(() => {
		if (currentProduccion) {
			const currentValue = { key: currentProduccion.id, label: currentProduccion.codigo };
			setValue(currentValue);
		}
	}, [currentProduccion]);

	return (
		<>
			<Autocomplete
				className="mt-8 mb-16 mx-12"
				isOptionEqualToValue={(opc, v) => opc.id === v.id}
				options={opcionesProducciones}
				value={value}
				fullWidth
				disabled={disabled}
				filterOptions={(options, state) => {
					return options;
				}}
				onInputChange={(event, newInputValue) => {
					getProducciones(newInputValue);
				}}
				onChange={(event, newValue) => {
					if (newValue?.id) {
						setValue(newValue);
						setCurrentProduccion(newValue);
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

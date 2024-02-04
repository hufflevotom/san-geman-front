import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, TextField } from '@mui/material';

const Estilos = ({ opciones, setValue, value, reset, disabled }) => {
	const [localValue, setLocalValue] = useState(null);

	useEffect(() => {
		if (value) {
			const currentValue = { key: value.id, label: value.label, ...value };
			setLocalValue(currentValue);
		}
	}, [value]);

	return (
		<Autocomplete
			className="mt-8 mb-16 mx-12"
			isOptionEqualToValue={(opc, v) => opc.id === v.id}
			options={opciones}
			value={localValue}
			fullWidth
			disabled={disabled}
			filterOptions={(options, state) => {
				return options;
			}}
			onChange={(event, newValue) => {
				if (newValue?.id) {
					setLocalValue(newValue);
					setValue(newValue);
				} else {
					reset();
				}
			}}
			renderInput={params => (
				<TextField
					{...params}
					placeholder="Seleccione un estilo"
					label="Estilo"
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

Estilos.propTypes = {
	opciones: PropTypes.array,
	setValue: PropTypes.func,
	value: PropTypes.string,
	reset: PropTypes.func,
	disabled: PropTypes.bool,
};

export default Estilos;

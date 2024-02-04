import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const opciones = [
	{ id: 'CONOP', key: 'CONOP', label: 'Orden de Servicio con Orden de Producción' },
	{ id: 'SINOP', key: 'SINOP', label: 'Orden de Servicio Libre' },
];

const TipoProduccion = ({ current, setCurrent, disabled }) => {
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
					placeholder="Seleccione el tipo de orden de servicio"
					label="Tipo de orden de servicio"
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
};

TipoProduccion.propTypes = {
	current: PropTypes.any,
	setCurrent: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
};

export default TipoProduccion;

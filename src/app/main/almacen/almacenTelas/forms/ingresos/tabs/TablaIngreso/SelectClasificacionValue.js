/* eslint-disable no-unneeded-ternary */
import { Autocomplete, TextField } from '@mui/material';
import { useState } from 'react';

const SelectClasificacionValue = ({
	label,
	dataSeleccionada,
	row,
	onChangeTable,
	dataKey,
	disabled,
}) => {
	const [valor, setValor] = useState(row.clasificacion || { id: 1, label: 'Tela OK' });

	return (
		<Autocomplete
			disabled={disabled}
			isOptionEqualToValue={(op, val) => op.id === val.id}
			options={[
				{ id: 1, label: 'Tela OK' },
				{ id: 2, label: 'Tela Observada' },
				{ id: 3, label: 'Tela en Paños' },
				{ id: 4, label: 'Merma' },
				{ id: 5, label: 'Retazos' },
			]}
			value={valor || { id: 1, label: 'Tela OK' }}
			fullWidth
			filterOptions={(options, state) => options}
			onInputChange={(event, newInputValue) => {
				console.log(newInputValue);
				if (!newInputValue || newInputValue !== '') {
					setValor({ id: 1, label: 'Tela OK' });
				} else {
					setValor({ ...valor, label: newInputValue });
				}
			}}
			onChange={(event, newValue) => {
				console.log(newValue);
				const valueSelected = newValue ? newValue : { id: 1, label: 'Tela OK' };
				dataSeleccionada.forEach(element => {
					if (element.id === row.id) {
						element.clasificacion = valueSelected;
					}
				});
				onChangeTable(dataSeleccionada);
			}}
			renderInput={params => (
				<TextField
					{...params}
					placeholder="Seleccione la clasificacion"
					label={label}
					required
					fullWidth
					variant="outlined"
					InputLabelProps={{
						shrink: true,
					}}
				/>
			)}
		/>
	);
};

export default SelectClasificacionValue;

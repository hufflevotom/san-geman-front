import { TextField } from '@mui/material';
import { useState } from 'react';

const TextFieldValueTable = ({
	label,
	dataSeleccionada,
	row,
	onChangeTable,
	dataKey,
	disabled,
	InputProps,
}) => {
	const [valor, setValor] = useState(row[dataKey] || 0);

	return (
		<TextField
			disabled={disabled}
			value={valor}
			onChange={e => {
				setValor(e.target.value);
			}}
			onBlur={() => {
				dataSeleccionada.forEach(element => {
					if (element.id === row.id) {
						element[dataKey] = valor;
					}
				});
				onChangeTable(dataSeleccionada);
			}}
			fullWidth
			label={label}
			variant="outlined"
			InputProps={InputProps}
		/>
	);
};

export default TextFieldValueTable;

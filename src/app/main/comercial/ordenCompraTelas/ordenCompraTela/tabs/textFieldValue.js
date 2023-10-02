import { TextField } from '@mui/material';
import { useState } from 'react';

const TextFieldValue = ({ label, dataSeleccionada, row, onChangeDataTextField, dataKey }) => {
	const [valuee, setValuee] = useState(row[dataKey] || 0);

	return (
		<TextField
			type="number"
			value={valuee}
			onChange={e => {
				setValuee(e.target.value);
			}}
			InputProps={{
				inputProps: { min: 0 },
			}}
			onBlur={() => {
				dataSeleccionada.forEach(element => {
					if (element.id === row.id) {
						element[dataKey] = parseFloat(valuee);
						if (element.descuento === 0) {
							element.precioUnitario = element.valorUnitario;
						} else {
							element.precioUnitario =
								element.valorUnitario - element.valorUnitario * (element.descuento / 100);
						}

						if (
							element.cantidad &&
							(element.precioUnitario !== null || element.precioUnitario !== '')
						) {
							element.totalImporte = element.precioUnitario * element.cantidad;
						}
					}
				});

				onChangeDataTextField(dataSeleccionada);
			}}
			style={{ width: '90px' }}
			id="outlined-basic"
			label={label}
			variant="outlined"
		/>
	);
};

export default TextFieldValue;

/* eslint-disable prefer-destructuring */
import { TextField } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';

const TextFieldValue = ({ label, type, dataSeleccionada, row, onChangeDataTextField, dataKey }) => {
	const [valuee, setValuee] = useState(row[dataKey] || 0);

	// convert valuee '1.00' to number 1
	let valueeNumber = valuee;
	if (dataKey === 'cantidad') {
		if (valuee) {
			valueeNumber = valuee;
			console.log('valueeNumber', valueeNumber);
		}
	}

	return (
		<TextField
			value={valueeNumber}
			onChange={e => {
				setValuee(e.target.value);
			}}
			InputProps={{
				inputProps: { min: 0 },
			}}
			onBlur={() => {
				dataSeleccionada.forEach(element => {
					if (element.id === row.id) {
						element[dataKey] = valueeNumber;

						if (element.cantidad !== '' && element.precioUnitario !== '') {
							if (
								parseFloat(element.precioUnitario) >
								(element.precioMaximo > 0 ? element.precioMaximo : element.precioMaximoUSD)
							) {
								toast.error(
									element.precioMaximo === 0 && element.precioMaximoUSD === 0
										? 'No se registró una cotizacion de costo para este avío'
										: `El precio unitario de este avío no puede ser mayor a ${
												element.precioMaximo || element.precioMaximoUSD
										  }`,
									{
										position: 'top-right',
										autoClose: 5000,
										hideProgressBar: false,
										closeOnClick: true,
										pauseOnHover: true,
										draggable: true,
										progress: undefined,
										theme: 'colored',
									}
								);
								setValuee(0);
							} else {
								const elementPrecioUnitario = parseFloat(element.precioUnitario);
								const elementCantidad = parseInt(element.cantidad, 10);
								// double 2 digitos
								const resp = elementPrecioUnitario * elementCantidad;
								element.totalImporte = resp;
							}
						} else {
							element.totalImporte = 0;
						}
					}
				});

				onChangeDataTextField(dataSeleccionada);
			}}
			style={{ width: '90px' }}
			id="outlined-basic"
			label={label}
			type={type || 'text'}
			variant="outlined"
		/>
	);
};

export default TextFieldValue;

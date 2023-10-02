/* eslint-disable dot-notation */
import { InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';

const InputMonto = ({ index, value, currency, name, data, setData, disabled }) => {
	const [valueState, setValueState] = useState(value);

	return !disabled ? (
		<TextField
			type="number"
			value={valueState}
			InputProps={{
				inputProps: { min: 0, step: 0.001 },
				startAdornment: (
					<InputAdornment position="start">{currency === 'PEN' ? 'S/ ' : '$ '}</InputAdornment>
				),
			}}
			onChange={e => {
				setValueState(Number(e.target.value));
			}}
			disabled={data[index][`${name}${currency === 'PEN' ? 'USD' : 'PEN'}`] > 0 || disabled}
			onBlur={() => {
				const cambio = structuredClone(data);
				cambio[index][`${name}${currency}`] = (+valueState).toFixed(3);
				console.log('HV.Blur', cambio);
				setData([...cambio]);
			}}
			style={{ width: '100%', height: '100%', margin: 0 }}
			required
			variant="outlined"
		/>
	) : (
		value
	);
};

export default InputMonto;

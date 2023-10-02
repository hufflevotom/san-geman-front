import { TextField } from '@mui/material';
import { useState } from 'react';

const TextFieldValue = ({ porcentaje = false, i, k, index, value, data, setData, disabled }) => {
	const [valueState, setValueState] = useState(value);

	return porcentaje ? (
		<TextField
			type="number"
			InputProps={{
				inputProps: { min: 0 },
			}}
			value={valueState}
			onChange={e => {
				setValueState(Number(e.target.value));
			}}
			disabled={disabled}
			onBlur={() => {
				const cambio = data;
				cambio[k][index].ordenCortePañoCantidades.cantidadesCorte[i] = valueState;
				setData([...cambio]);
			}}
			style={{ width: '70px' }}
			required
			variant="outlined"
		/>
	) : (
		value
	);
};

export default TextFieldValue;

import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

function Color({ currentColor }) {
	const [value, setValue] = useState({ id: '', label: '' });

	useEffect(() => {
		const currentValue = currentColor
			? { id: currentColor.id, label: `${currentColor.descripcion}` }
			: { id: '', label: '' };
		setValue(currentValue);
	}, [currentColor]);

	return (
		<Autocomplete
			key="color"
			disabled
			className="mt-8 mb-16 mx-12"
			isOptionEqualToValue={(op, v) => op.id === v.id}
			options={[]}
			value={value}
			fullWidth
			filterOptions={(options, state) => options}
			renderInput={params => (
				<TextField
					{...params}
					placeholder="Seleccione el color"
					label="Color"
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
}

export default Color;

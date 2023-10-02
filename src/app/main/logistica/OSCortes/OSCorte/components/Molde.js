import { TextField } from '@mui/material';
import React from 'react';

const Molde = ({ currentMolde, setCurrentMolde, disabled }) => {
	return (
		<TextField
			className="mt-8 mb-16 mx-12"
			required
			value={currentMolde}
			onChange={e => setCurrentMolde(e.target.value)}
			label="Molde"
			placeholder="Ingrese el molde"
			id="molde"
			variant="outlined"
			fullWidth
			disabled={disabled}
			InputLabelProps={{ shrink: true }}
			autoComplete="off"
			// error={!!errors.molde}
			// helperText={errors?.molde?.message}
		/>
	);
};

export default Molde;

/* eslint-disable spaced-comment */
import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

const Prenda = ({ currentTipoPrenda, setCurrentTipoPrenda }) => {
	const [value, setValue] = useState({ id: '', label: '' });

	useEffect(() => {
		const currentValue = currentTipoPrenda
			? {
					id: currentTipoPrenda.id,
					label: `${currentTipoPrenda.codigo} / ${currentTipoPrenda.nombre}`,
			  }
			: { id: '', label: '' };
		setValue(currentValue);
	}, [currentTipoPrenda]);

	return (
		<>
			<Autocomplete
				disabled
				className="mt-8 mb-16 mx-12"
				isOptionEqualToValue={(opc, val) => opc.id === val.id}
				options={[]}
				value={value}
				fullWidth
				filterOptions={(options, state) => {
					return options;
				}}
				onChange={(event, newValue) => {
					if (newValue) {
						setCurrentTipoPrenda(newValue);
					} else {
						setCurrentTipoPrenda(null);
					}
				}}
				renderInput={params => (
					<TextField
						{...params}
						placeholder="Seleccione un tipo de prenda"
						label="Tipo de prenda"
						required
						variant="outlined"
						InputLabelProps={{
							shrink: true,
						}}
						fullWidth
					/>
				)}
			/>
		</>
	);
};

export default Prenda;

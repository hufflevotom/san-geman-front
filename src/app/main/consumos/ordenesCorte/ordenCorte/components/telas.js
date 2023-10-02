import { Autocomplete, Chip, TextField } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';

const Telas = ({
	productosTela,
	currentTelas,
	setCurrentTelas,
	resetTelas,
	currentPartida,
	disabled,
	currentEstilos,
}) => {
	const opcionesTelas = productosTela.map(t => ({
		...t,
		key: t.id,
		label: `${t.tela.nombre}`,
	}));

	const [value, setValue] = useState([]);

	useEffect(() => {
		const currentValue = currentTelas.map(t => ({
			...t,
			id: t.id,
			key: t.id,
			label: `${t.tela.nombre}`,
		}));

		setValue(currentValue);
	}, [currentTelas]);

	return (
		<Autocomplete
			multiple
			disabled={currentPartida.length === 0 || disabled || currentEstilos.length > 0}
			key="telas"
			className="mt-8 mb-16 mx-12"
			isOptionEqualToValue={(op, val) => op.id === val.id}
			options={opcionesTelas || []}
			value={value}
			renderOption={(props, option) => {
				return (
					<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
						{option.calidadTextil ? (
							<CheckCircleIcon color="success" style={{ marginRight: 10 }} />
						) : (
							<WarningIcon color="warning" style={{ marginRight: 10 }} />
						)}
						{option.label}
					</Box>
				);
			}}
			renderTags={(valueTag, getTagProps) => {
				return valueTag.map((option, index) => {
					return (
						<Chip
							key={index}
							label={option.label}
							style={{ backgroundColor: option.tipo === 'P' ? '#FFB52C' : '#EBEBEB' }}
							{...getTagProps({ index })}
						/>
					);
				});
			}}
			getOptionDisabled={option => option.calidadTextil === null}
			fullWidth
			filterOptions={(options, state) => options}
			onInputChange={(event, newInputValue) => {}}
			onChange={(event, newValue) => {
				if (newValue.length > 0) {
					console.info('Form.Telas:', newValue);
					setCurrentTelas(newValue);
				} else {
					resetTelas();
				}
			}}
			renderInput={params => (
				<TextField
					{...params}
					placeholder="Seleccione las telas"
					label="Telas"
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

export default Telas;

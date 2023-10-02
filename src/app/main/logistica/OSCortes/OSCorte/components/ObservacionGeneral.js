import { TextField } from '@mui/material';

const ObservacionGeneral = ({
	currentObservacionGeneral,
	setCurrentObservacionGeneral,
	disabled,
}) => {
	return (
		<TextField
			className="mt-8 mb-16 mx-12"
			value={currentObservacionGeneral}
			onChange={e => setCurrentObservacionGeneral(e.target.value)}
			label="Observaciones"
			placeholder="Ingrese las observaciones"
			id="observaciones"
			variant="outlined"
			fullWidth
			disabled={disabled}
			InputLabelProps={{ shrink: true }}
			autoComplete="off"
		/>
	);
};

export default ObservacionGeneral;

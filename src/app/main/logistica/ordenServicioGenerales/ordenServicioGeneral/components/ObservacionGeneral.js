import { TextareaAutosize } from '@mui/material';

const ObservacionGeneral = ({
	currentObservacionGeneral,
	setCurrentObservacionGeneral,
	disabled,
}) => {
	return (
		<TextareaAutosize
			required
			value={currentObservacionGeneral}
			label="Observaciones"
			id="detalles"
			variant="outlined"
			onChange={e => setCurrentObservacionGeneral(e.target.value)}
			disabled={disabled}
			aria-label="minimum height"
			minRows={3}
			placeholder="Observaciones"
			style={{
				width: '100%',
				padding: '15px',
				margin: '10px',
				border: '1px solid #ced4da',
				borderRadius: '4px',
			}}
		/>
	);
};

export default ObservacionGeneral;

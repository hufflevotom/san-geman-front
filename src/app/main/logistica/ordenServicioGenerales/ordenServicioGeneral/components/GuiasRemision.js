import { TextField } from '@mui/material';

const GuiasRemision = ({ currentGuiasRemision, setCurrentGuiasRemision, disabled }) => {
	return (
		<TextField
			className="mt-8 mb-16 mx-12"
			required
			value={currentGuiasRemision}
			onChange={e => setCurrentGuiasRemision(e.target.value)}
			label="Guias de Remisión"
			placeholder="Ingrese los números de guias de remisión"
			id="guiasRemision"
			variant="outlined"
			fullWidth
			disabled={disabled}
			InputLabelProps={{ shrink: true }}
			autoComplete="off"
		/>
	);
};

export default GuiasRemision;

import { TextField } from '@mui/material';

const LugarEntrega = ({ currentLugarEntrega, setCurrentLugarEntrega, disabled }) => {
	return (
		<TextField
			className="mt-8 mb-16 mx-12"
			value={currentLugarEntrega}
			onChange={e => setCurrentLugarEntrega(e.target.value)}
			label="Lugar de entrega"
			placeholder="Ingrese el lugar de entrega"
			id="lugarEntrega"
			variant="outlined"
			fullWidth
			disabled={disabled}
			InputLabelProps={{ shrink: true }}
			autoComplete="off"
		/>
	);
};

export default LugarEntrega;

import { Stack, Switch, Typography } from '@mui/material';

const CheckPanios = ({ currentCheckPanios, setCurrentCheckPanios, disabled }) => {
	return (
		<Stack
			direction="row"
			spacing={1}
			alignItems="center"
			style={{ width: '100%', marginLeft: '20px' }}
		>
			<Typography>¿Corte en paños?</Typography>
			<Switch
				checked={currentCheckPanios}
				onChange={a => {
					setCurrentCheckPanios(a.target.checked);
				}}
				color="secondary"
				fullWidth
				disabled={disabled}
			/>
		</Stack>
	);
};

export default CheckPanios;

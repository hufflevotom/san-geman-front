import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';

function Observaciones() {
	const {
		control,
		formState: { errors },
	} = useFormContext();

	return (
		<Controller
			name="observaciones"
			control={control}
			render={({ field: { onChange, value } }) => {
				let val = '';
				if (value) {
					val = value;
				}
				return (
					<TextField
						className="mt-8 mb-16 mx-12"
						error={!!errors.observaciones}
						value={val}
						onChange={e => {
							onChange(e);
						}}
						helperText={errors?.observaciones?.message}
						label="Observaciones"
						id="observaciones"
						variant="outlined"
						fullWidth
					/>
				);
			}}
		/>
	);
}

export default Observaciones;

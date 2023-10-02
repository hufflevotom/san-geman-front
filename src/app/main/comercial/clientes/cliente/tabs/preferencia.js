import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';

function Preferencia(props) {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	return (
		<>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="porcentajeError"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.porcentajeError}
							required
							type="number"
							InputProps={{
								inputProps: { min: 0 },
							}}
							helperText={errors?.porcentajeError?.message}
							id="porcentajeError"
							label="Porcentaje"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
		</>
	);
}

export default Preferencia;

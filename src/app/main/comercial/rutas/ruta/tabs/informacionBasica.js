import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';

function InformacionBasica(props) {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	return (
		<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
			<Controller
				name="descripcion"
				control={control}
				rules={{ required: true, message: 'Ingrese la descripción' }}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16 mx-12"
						error={!!errors.descripcion}
						required
						helperText={errors?.descripcion?.message}
						label="Descripcion"
						id="descripcion"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
		</div>
	);
}

export default InformacionBasica;

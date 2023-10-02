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
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16 mx-4 mx-12"
						error={!!errors.descripcion}
						required
						helperText={errors?.descripcion?.message}
						label="Descripción"
						autoFocus
						id="descripcion"
						variant="outlined"
						fullWidth
					/>
				)}
			/>

			<Controller
				name="dias"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16 mx-4 mx-12"
						error={!!errors.dias}
						required
						helperText={errors?.dias?.message}
						label="Días"
						id="dias"
						type="number"
						InputProps={{
							inputProps: { min: 0 },
						}}
						variant="outlined"
						fullWidth
					/>
				)}
			/>
		</div>
	);
}

export default InformacionBasica;

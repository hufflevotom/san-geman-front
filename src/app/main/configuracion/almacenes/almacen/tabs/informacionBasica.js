import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';

function InformacionBasica(props) {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	return (
		<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
			<Controller
				name="codigo"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16 mx-4 mx-12"
						error={!!errors.codigo}
						required
						helperText={errors?.codigo?.message}
						label="Codigo"
						id="codigo"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
			<Controller
				name="nombre"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16 mx-4 mx-12"
						error={!!errors.nombre}
						required
						helperText={errors?.nombre?.message}
						label="Nombre"
						autoFocus
						id="nombre"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
		</div>
	);
}

export default InformacionBasica;

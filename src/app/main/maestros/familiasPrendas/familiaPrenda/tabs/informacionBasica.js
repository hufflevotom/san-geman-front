import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';

function InformacionBasica(props) {
	const { tipo } = props;
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	return (
		<div>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="descripcion"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.nombre}
							required
							helperText={errors?.nombre?.message}
							label="Descripción"
							autoFocus
							id="descripcion"
							variant="outlined"
							fullWidth
						/>
					)}
				/>

				<Controller
					name="prefijo"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.ruc}
							required
							helperText={errors?.ruc?.message}
							id="prefijo"
							label="Prefijo"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			{/* <Controller
				name="correlativo"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						disabled
						type="number"
						className="mt-8 mb-16"
						error={!!errors.ruc}
						required
						helperText={errors?.ruc?.message}
						id="correlativo"
						label="Correlativo"
						variant="outlined"
						fullWidth
					/>
				)}
			/> */}
		</div>
	);
}

export default InformacionBasica;

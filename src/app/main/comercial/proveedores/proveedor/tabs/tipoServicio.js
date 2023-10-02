import { TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

const TipoServicio = () => {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	return (
		<Controller
			name="tipoServicio"
			control={control}
			render={({ field: { onChange, value } }) => {
				return (
					<TextField
						className="mt-8 mb-16 mx-12"
						placeholder="Ingrese el tipo de servicio"
						label="Tipo de Servicio"
						required
						value={value}
						onChange={onChange}
						error={!!errors.tipoServicio}
						helperText={errors?.tipoServicio?.message}
						variant="outlined"
						InputLabelProps={{
							shrink: true,
						}}
						fullWidth
					/>
				);
			}}
		/>
	);
};

export default TipoServicio;

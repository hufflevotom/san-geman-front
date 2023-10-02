import { MenuItem } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';

function InformacionBasica(props) {
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
							error={!!errors.descripcion}
							required
							helperText={errors?.descripcion?.message}
							label="Descripcion"
							autoFocus
							id="descripcion"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="unidadProceso"
					control={control}
					render={({ field: { value, onChange } }) => (
						<TextField
							key="unidadProceso"
							name="unidadProceso"
							select
							className="mt-8 mb-16 mx-12"
							label="Unidad de proceso"
							variant="outlined"
							fullWidth
							value={value}
							onChange={newValue => {
								onChange(newValue.target.value);
							}}
						>
							<MenuItem value="KG" key="KG">
								KILOGRAMOS
							</MenuItem>
							<MenuItem value="UND" key="UND">
								UNIDAD
							</MenuItem>
						</TextField>
					)}
				/>
			</div>
		</div>
	);
}

export default InformacionBasica;

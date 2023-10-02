import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';

function Contacto({ getUbigeos, ubigeos }) {
	const methods = useFormContext();
	const { control, formState, getValues } = methods;
	const { errors } = formState;

	const { tipo } = getValues();

	return (
		<>
			{tipo === 'N' ? (
				<>
					<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
						<Controller
							name="direccion"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mt-8 mb-16 mx-12"
									error={!!errors.direccion}
									required
									helperText={errors?.direccion?.message}
									id="direccion"
									label="Dirección"
									variant="outlined"
									fullWidth
								/>
							)}
						/>
						<Controller
							name="ubigeo"
							control={control}
							render={({ field: { onChange, value } }) => {
								const ubigeo = value
									? {
											...value,
											key: value.codigo,
											label: value.distrito,
									  }
									: null;

								return (
									<Autocomplete
										className="mt-8 mb-16 mx-12"
										// freeSolo
										isOptionEqualToValue={(op, val) => op.id === val.id}
										options={ubigeos || []}
										value={ubigeo}
										filterOptions={(options, state) => {
											return options;
										}}
										onInputChange={(event, newInputValue) => {
											getUbigeos(newInputValue);
										}}
										fullWidth
										onChange={(event, newValue) => {
											if (newValue) {
												const { label, ...valor } = newValue;
												onChange(valor);
											} else {
												onChange(null);
											}
										}}
										renderInput={params => (
											<TextField
												{...params}
												placeholder="Seleccione el ubigeo"
												label="Ubigeo"
												required
												error={!!errors.ubigeo}
												helperText={errors?.ubigeo?.message}
												variant="outlined"
												InputLabelProps={{
													shrink: true,
												}}
												fullWidth
											/>
										)}
									/>
								);
							}}
						/>
					</div>
					<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
						<Controller
							name="celular"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mt-8 mb-16 mx-12"
									error={!!errors.telefono}
									required
									helperText={errors?.telefono?.message}
									id="celular"
									label="Celular"
									variant="outlined"
									fullWidth
								/>
							)}
						/>

						<Controller
							name="correo"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mt-8 mb-16 mx-12"
									error={!!errors.email}
									required
									helperText={errors?.email?.message}
									id="correo"
									label="Correo"
									variant="outlined"
									fullWidth
								/>
							)}
						/>
					</div>
				</>
			) : (
				<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
					<Controller
						name="personaContacto"
						control={control}
						rules={{ required: true, message: 'Ingrese la persona de contacto' }}
						render={({ field }) => (
							<TextField
								{...field}
								className="mt-8 mb-16 mx-12"
								error={!!errors.personaContacto}
								required
								helperText={errors?.personaContacto?.message}
								label="Persona de Contacto"
								id="personaContacto"
								variant="outlined"
								fullWidth
							/>
						)}
					/>

					<Controller
						name="celular"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								className="mt-8 mb-16 mx-12"
								error={!!errors.celular}
								required
								helperText={errors?.celular?.message}
								id="celular"
								label="Celular"
								variant="outlined"
								fullWidth
							/>
						)}
					/>
				</div>
			)}
		</>
	);
}

export default Contacto;

import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';
import { Autocomplete, FormControlLabel, Switch } from '@mui/material';
import { useEffect, useState } from 'react';
import httpClient from 'utils/Api';
import { limitCombo, offsetCombo } from 'constants/constantes';
import { toast } from 'react-toastify';

function InformacionBasica(props) {
	const methods = useFormContext();
	const { control, formState, watch } = methods;
	const { errors } = formState;

	const [dataRoles, setDataRoles] = useState([]);
	const [rolesTemporal, setRolesTemporal] = useState(null);
	const [isActivePin, setIsActivePin] = useState(false);

	const choferValue = watch('chofer');
	const role = watch('role');

	useEffect(() => {
		traerRoles();
	}, []);

	useEffect(() => {
		if (role) {
			let activePin = false;

			const permisosPin = [
				'anularIngresoAlmacenAvios',
				'anularIngresoAlmacenTelas',
				'anularSalidaAlmacenAvios',
				'anularSalidaAlmacenTelas',
			];

			role.modulos.forEach(modulo => {
				if (permisosPin.includes(modulo.nombre)) {
					activePin = true;
				}
			});

			setIsActivePin(activePin);
		}
	}, [role]);

	const traerRoles = async busqueda => {
		let texto = '';
		if (busqueda) {
			texto = busqueda.trim();
		}
		const url = `auth/roles?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${texto}`;
		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataRoles(data);
	};

	const opcionesRoles = dataRoles.map(rol => ({
		...rol,
		label: rol.nombre,
	}));

	return (
		<>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="nombre"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
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

				<Controller
					name="apellido"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.apellido}
							required
							helperText={errors?.apellido?.message}
							label="Apellido"
							id="apellido"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>

			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="celular"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							type="number"
							InputProps={{
								inputProps: { min: 0 },
							}}
							className="mt-8 mb-16 mx-12"
							error={!!errors.celular}
							helperText={errors?.celular?.message}
							label="Celular"
							id="celular"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="chofer"
					control={control}
					render={({ field: { onChange, value } }) => {
						return (
							<FormControlLabel
								className="mt-8 mb-16 mx-12"
								label="Chofer"
								fullWidth
								required
								control={
									<Switch
										color="info"
										checked={value}
										onChange={onChange}
										inputProps={{ 'aria-label': 'controlled' }}
										fullWidth
										required
									/>
								}
							/>
						);
					}}
				/>
				{!choferValue && (
					<Controller
						name="role"
						control={control}
						render={({ field: { onChange, value } }) => {
							const unidad = value
								? {
										...value,
										label: value.nombre,
								  }
								: null;
							return (
								<Autocomplete
									// freeSolo
									className="mt-8 mb-16 mx-12"
									fullWidth
									isOptionEqualToValue={(op, val) => op.id === val.id}
									options={opcionesRoles || []}
									value={unidad}
									filterOptions={(options, state) => {
										return options;
									}}
									onInputChange={(event, newInputValue) => {
										traerRoles(newInputValue);
										setRolesTemporal({ ...unidad, label: newInputValue });
									}}
									onChange={(event, newValue) => {
										if (newValue) {
											const { label, ...valor } = newValue;
											onChange(valor);
											setRolesTemporal(null);
										} else {
											onChange(null);
										}
									}}
									renderInput={params => (
										<TextField
											{...params}
											placeholder="Seleccione el Rol"
											label="Rol"
											error={!!errors.role}
											helperText={errors?.role?.message}
											variant="outlined"
											InputLabelProps={{
												shrink: true,
											}}
										/>
									)}
								/>
							);
						}}
					/>
				)}
			</div>
			{choferValue && (
				<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
					<Controller
						name="dni"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								className="mt-8 mb-16 mx-12"
								error={!!errors.nombre}
								required
								helperText={errors?.dni?.message}
								label="DNI"
								autoFocus
								id="dni"
								variant="outlined"
								fullWidth
							/>
						)}
					/>

					<Controller
						name="licencia"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								className="mt-8 mb-16 mx-12"
								error={!!errors.apellido}
								required
								helperText={errors?.licencia?.message}
								label="Licencia"
								id="licencia"
								variant="outlined"
								fullWidth
							/>
						)}
					/>
				</div>
			)}
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="email"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.email}
							required
							helperText={errors?.email?.message}
							label="Correo"
							id="email"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="password"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							type="password"
							className="mt-8 mb-16 mx-12"
							error={!!errors.password}
							required
							helperText={errors?.password?.message}
							label="Contraseña"
							id="password"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				{isActivePin && (
					<Controller
						name="pin"
						control={control}
						render={({ field: { onChange, ...properties } }) => (
							<TextField
								{...properties}
								type="password"
								className="mt-8 mb-16 mx-12"
								error={!!errors.pin}
								required
								helperText={errors?.pin?.message}
								label="Pin de Seguridad"
								id="pin"
								variant="outlined"
								fullWidth
								onChange={e => {
									const regexp = /^[0-9\b]+$/;
									if (e.target.value !== '' && !regexp.test(e.target.value)) {
										toast.error('El pin debe ser numérico');
										return;
									}
									if (e.target.value.length <= 6) {
										onChange(e.target.value);
									} else {
										toast.error('El pin debe tener 6 digitos');
									}
								}}
							/>
						)}
					/>
				)}
			</div>
		</>
	);
}

export default InformacionBasica;

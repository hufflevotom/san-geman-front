import { useEffect, useState } from 'react';
import { Autocomplete, MenuItem } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { getDatosSunat } from 'app/services/services';

function InformacionBasica({ getUbigeos, ubigeos }) {
	const methods = useFormContext();
	const { control, formState, setValue } = methods;
	const { errors } = formState;

	const [tipo, setTipo] = useState(false);

	const proveedor = useSelector(({ comercial }) => comercial.proveedor);

	const obtenerDatosSunat = async ruc => {
		const resp = await getDatosSunat(ruc);
		if (resp.success) {
			if (
				resp.data.direccion_completa.toString().trim() !== '-' &&
				resp.data.direccion_completa.toString().trim() !== ''
			) {
				setValue('direccion', resp.data.direccion_completa);
			}
			if (resp.data.ubigeo.toString().trim() !== '-' && resp.data.ubigeo.toString().trim() !== '') {
				await getUbigeos(resp.data.ubigeo);
				setValue('ubigeo', {
					codigo: resp.data.ubigeo,
					distrito: resp.data.ubigeo,
					key: resp.data.ubigeo,
					label: `${resp.data.departamento}-${resp.data.provincia}-${resp.data.distrito}`,
				});
			}
			if (tipo) {
				setValue('razonSocial', resp.data.nombre_o_razon_social);
			} else {
				const arrNombres = resp.data.nombre_o_razon_social.split(' ');
				const apellidoPaterno = arrNombres[0];
				const apellidoMaterno = arrNombres[1];
				const nombres = arrNombres.slice(2).join(' ');
				setValue('apellidoPaterno', apellidoPaterno);
				setValue('apellidoMaterno', apellidoMaterno);
				setValue('nombres', nombres);
			}
		}
	};

	useEffect(() => {
		if (proveedor?.tipo === 'N') {
			setTipo(false);
		} else {
			setTipo(true);
		}
	}, [proveedor]);

	useEffect(() => {
		getUbigeos();
	}, []);

	return (
		<>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="tipo"
					control={control}
					render={({ field: { onChange, value } }) => {
						let abc = 'N';

						if (value) {
							abc = value;
						}
						return (
							<TextField
								select
								className="mt-8 mb-16 mx-12"
								error={!!errors.tipo}
								required
								helperText={errors?.tipo?.message}
								label="Tipo de Persona"
								id="tipo"
								variant="outlined"
								fullWidth
								value={abc}
								onChange={e => {
									onChange(e.target.value);
									if (e.target.value === 'N') {
										setTipo(false);
									} else {
										setTipo(true);
									}
								}}
							>
								<MenuItem value="N">Persona Natural</MenuItem>
								<MenuItem value="J">Persona Jurídica</MenuItem>
							</TextField>
						);
					}}
				/>
			</div>

			{/* PERSONA JURIDICA  */}

			<div
				style={{ display: !tipo ? 'none' : 'flex' }}
				className="flex flex-col sm:flex-row mr-24 sm:mr-4"
			>
				<Controller
					name="ruc"
					control={control}
					rules={{
						required: 'Ingrese el número de RUC',
						maxLength: {
							value: 11,
							message: 'El RUC debe tener 11 dígitos',
						},
						minLength: {
							value: 11,
							message: 'El RUC debe tener 11 dígitos',
						},
					}}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.ruc}
							required
							helperText={errors?.ruc?.message}
							id="ruc"
							label="RUC"
							variant="outlined"
							fullWidth
							onChange={e => {
								if (e.target.value.length === 11) {
									obtenerDatosSunat(e.target.value);
								}
								field.onChange(e);
							}}
						/>
					)}
				/>
				<Controller
					name="razonSocial"
					control={control}
					rules={{ required: true, message: 'Ingrese la razón social' }}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.razonSocial}
							required
							helperText={errors?.razonSocial?.message}
							label="Razón Social"
							id="razonSocial"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<div
				style={{ display: !tipo ? 'none' : 'flex' }}
				className="flex flex-col sm:flex-row mr-24 sm:mr-4"
			>
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
			<div
				style={{ display: !tipo ? 'none' : 'flex' }}
				className="flex flex-col sm:flex-row mr-24 sm:mr-4"
			>
				<Controller
					name="telefono"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.telefono}
							required
							helperText={errors?.telefono?.message}
							id="telefono"
							label="Telefono"
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

			<div
				style={{ display: tipo ? 'none' : 'flex' }}
				className="flex flex-col sm:flex-row mr-24 sm:mr-4"
			>
				<Controller
					name="nroDocumento"
					control={control}
					rules={{
						required: 'Ingrese el número de documento',
						maxLength: {
							value: 8,
							message: 'El número debe tener 8 dígitos',
						},
						minLength: {
							value: 8,
							message: 'El número debe tener 8 dígitos',
						},
					}}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.nroDocumento}
							required
							helperText={errors?.nroDocumento?.message}
							id="nroDocumento"
							label="Documento de identidad"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="ruc"
					control={control}
					rules={{
						required: 'Ingrese el número de RUC',
						maxLength: {
							value: 11,
							message: 'El RUC debe tener 11 dígitos',
						},
						minLength: {
							value: 11,
							message: 'El RUC debe tener 11 dígitos',
						},
					}}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.ruc}
							required
							helperText={errors?.ruc?.message}
							id="ruc"
							label="RUC"
							variant="outlined"
							fullWidth
							onChange={e => {
								if (e.target.value.length === 11) {
									obtenerDatosSunat(e.target.value);
								}
								field.onChange(e);
							}}
						/>
					)}
				/>
			</div>
			<div
				style={{ display: tipo ? 'none' : 'flex' }}
				className="flex flex-col sm:flex-row mr-24 sm:mr-4"
			>
				<Controller
					name="apellidoPaterno"
					control={control}
					rules={{ required: true, message: 'Ingrese el apellido paterno' }}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.apellidoPaterno}
							required
							helperText={errors?.apellidoPaterno?.message}
							label="Apellido Paterno"
							id="apellidoPaterno"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="apellidoMaterno"
					control={control}
					rules={{ required: true, message: 'Ingrese el apellido materno' }}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.apellidoMaterno}
							required
							helperText={errors?.apellidoMaterno?.message}
							label="Apellido Materno"
							id="apellidoMaterno"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="nombres"
					control={control}
					rules={{ required: true, message: 'Ingrese los nombres' }}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.nombres}
							required
							helperText={errors?.nombres?.message}
							label="Nombre(s)"
							id="nombres"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="rubro"
					control={control}
					rules={{ required: true, message: 'Ingrese el Rubro' }}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.rubro}
							helperText={errors?.rubro?.message}
							label="Rubro"
							id="rubro"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="observacion"
					control={control}
					rules={{ required: true, message: 'Ingrese las Observaciones' }}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.observacion}
							helperText={errors?.observacion?.message}
							label="Observaciones"
							id="observacion"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
		</>
	);
}

export default InformacionBasica;

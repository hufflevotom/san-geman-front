/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';
import { Autocomplete, MenuItem } from '@mui/material';
import { useSelector } from 'react-redux';
import { getDatosSunat } from 'app/services/services';

function InformacionBasica({ ubigeos, setUbigeosSearchText }) {
	const methods = useFormContext();
	const { control, formState, setValue } = methods;
	const { errors } = formState;

	const [tipo, setTipo] = useState(false);
	const [tipoCliente, setTipoCliente] = useState(false);
	const [extranjero, setExtranjero] = useState('DNI');

	const cliente = useSelector(({ comercial }) => comercial.cliente);

	const obtenerDatosSunat = async ruc => {
		if (!tipoCliente) {
			const resp = await getDatosSunat(ruc);
			if (resp.success) {
				if (
					resp.data.direccion_completa.toString().trim() !== '-' &&
					resp.data.direccion_completa.toString().trim() !== ''
				) {
					setValue('direccion', resp.data.direccion_completa);
				}
				if (
					resp.data.ubigeo.toString().trim() !== '-' &&
					resp.data.ubigeo.toString().trim() !== ''
				) {
					await setUbigeosSearchText(resp.data.ubigeo);
					setValue('ubigeo', {
						codigo: resp.data.ubigeo,
						distrito: resp.data.ubigeo,
						key: resp.data.ubigeo,
						label: `${resp.data.departamento}-${resp.data.provincia}-${resp.data.distrito}`,
					});
				}
				if (tipo) {
					setValue('razónSocial', resp.data.nombre_o_razon_social);
				} else {
					const arrNombres = resp.data.nombre_o_razon_social.split(' ');
					const apellidoPaterno = arrNombres[0];
					const apellidoMaterno = arrNombres[1];
					const nombres = arrNombres.slice(2).join(' ');
					setValue('natApellidoPaterno', apellidoPaterno);
					setValue('natApellidoMaterno', apellidoMaterno);
					setValue('natNombres', nombres);
				}
			}
		}
	};

	useEffect(() => {
		if (cliente?.tipo === 'N') {
			setTipo(false);
		} else {
			setTipo(true);
		}
		if (cliente?.tipoCliente === 'N') {
			setTipoCliente(false);
		} else {
			setTipoCliente(true);
		}
		setExtranjero(cliente?.natTipoDocumento);
	}, [cliente]);

	useEffect(() => {
		setUbigeosSearchText();
	}, []);

	return (
		<div>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4" style={{ marginBottom: 20 }}>
				<Controller
					name="tipoCliente"
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
								error={!!errors.tipoCliente}
								required
								helperText={errors?.tipoCliente?.message}
								label="Tipo de Cliente"
								id="tipoCliente"
								variant="outlined"
								fullWidth
								value={abc}
								onChange={e => {
									onChange(e.target.value);
									if (e.target.value === 'N') {
										setTipoCliente(false);
									} else {
										setTipoCliente(true);
									}
								}}
							>
								<MenuItem value="N">Nacional</MenuItem>
								<MenuItem value="E">Extranjero</MenuItem>
							</TextField>
						);
					}}
				/>
			</div>

			<div
				style={{ display: tipoCliente ? 'flex' : 'none' }}
				className="flex flex-col sm:flex-row mr-24 sm:mr-4"
			>
				<Controller
					name="pais"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-16 mx-12"
							error={!!errors.pais}
							required
							helperText={errors?.telepaisfono?.message}
							label="País"
							id="pais"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>

			<div
				style={{ display: !tipoCliente ? 'flex' : 'none' }}
				className="flex flex-col sm:flex-row mr-24 sm:mr-4"
			>
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

			<div
				style={{ display: !tipo ? 'none' : !tipoCliente ? 'flex' : 'none' }}
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
					name="razónSocial"
					control={control}
					rules={{ required: true, message: 'Ingrese la razón social' }}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.razónSocial}
							required
							helperText={errors?.razónSocial?.message}
							label="Razón Social"
							id="razónSocial"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>

			<div
				style={{ display: !tipo ? 'none' : !tipoCliente ? 'flex' : 'none' }}
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
							label="Direcciòn"
							id="direccion"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="ubigeo"
					control={control}
					render={({ field: { onChange, value } }) => {
						console.log(value);
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
								isOptionEqualToValue={(op, val) => op.id === val.id}
								options={ubigeos || []}
								value={ubigeo}
								filterOptions={(options, state) => {
									return options;
								}}
								onInputChange={(event, newInputValue) => {
									setUbigeosSearchText(newInputValue);
								}}
								fullWidth
								onChange={(event, newValue) => {
									if (newValue) {
										onChange(newValue);
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
				<Controller
					name="celularContacto"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.celularContacto}
							required
							helperText={errors?.celularContacto?.message}
							label="Número de teléfono"
							id="celularContacto"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				{/* <Controller
					name="correo"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.correo}
							helperText={errors?.correo?.message}
							label="Correo"
							id="correo"
							variant="outlined"
							fullWidth
						/>
					)}
				/> */}
			</div>

			<div
				style={{ width: '100%', display: tipo ? 'none' : !tipoCliente ? 'flex' : 'none' }}
				className="flex flex-col sm:flex-row mr-24 sm:mr-4"
			>
				<Controller
					name="natTipoDocumento"
					control={control}
					render={({ field: { onChange, value } }) => {
						let abc = 'DNI';

						if (value) {
							abc = value;
						}
						return (
							<TextField
								select
								className="mt-8 mb-16 mx-12"
								error={!!errors.natTipoDocumento}
								required
								helperText={errors?.natTipoDocumento?.message}
								label="Tipo de Documento"
								id="natTipoDocumento"
								variant="outlined"
								fullWidth
								value={abc}
								onChange={e => {
									onChange(e.target.value);
									setExtranjero(e.target.value);
								}}
							>
								<MenuItem value="DNI">DNI</MenuItem>
								<MenuItem value="RUC">RUC</MenuItem>
								<MenuItem value="OTRO">Otro</MenuItem>
							</TextField>
						);
					}}
				/>
				<div
					// eslint-disable-next-line no-nested-ternary
					style={{ width: '100%', display: extranjero === 'RUC' ? 'none' : 'flex' }}
				>
					<Controller
						name="natNroDocumento"
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
								error={!!errors.natNroDocumento}
								required
								helperText={errors?.natNroDocumento?.message}
								id="natNroDocumento"
								label="Documento de identidad"
								variant="outlined"
								fullWidth
							/>
						)}
					/>
				</div>
				<div
					// eslint-disable-next-line no-nested-ternary
					style={{ width: '100%', display: extranjero === 'RUC' ? 'flex' : 'none' }}
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
				</div>
			</div>
			<div
				// eslint-disable-next-line no-nested-ternary
				style={{
					display: tipo ? 'none' : extranjero === 'OTROS' ? 'none' : !tipoCliente ? 'flex' : 'none',
				}}
				className="flex flex-col sm:flex-row mr-24 sm:mr-4"
			>
				<Controller
					name="natApellidoPaterno"
					control={control}
					rules={{ required: true, message: 'Ingrese el apellido paterno' }}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.natApellidoPaterno}
							required
							helperText={errors?.natApellidoPaterno?.message}
							label="Apellido Paterno"
							id="natApellidoPaterno"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="natApellidoMaterno"
					control={control}
					rules={{ required: true, message: 'Ingrese el apellido materno' }}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.natApellidoMaterno}
							required
							helperText={errors?.natApellidoMaterno?.message}
							label="Apellido Materno"
							id="natApellidoMaterno"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="natNombres"
					control={control}
					rules={{ required: true, message: 'Ingrese los nombres' }}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.natNombres}
							required
							helperText={errors?.natNombres?.message}
							label="Nombre(s)"
							id="natNombres"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<div
				style={{ width: '100%', display: tipo ? 'none' : tipoCliente ? 'flex' : 'none' }}
				className="flex flex-col sm:flex-row mr-24 sm:mr-4"
			>
				<Controller
					name="natTipoDocumento"
					control={control}
					render={({ field: { onChange, value } }) => (
						<TextField
							select
							className="mt-8 mb-16 mx-12"
							error={!!errors.natTipoDocumento}
							required
							helperText={errors?.natTipoDocumento?.message}
							label="Tipo de Documento"
							id="natTipoDocumento"
							variant="outlined"
							fullWidth
							defaultValue="TAXID"
							onChange={e => {
								onChange(e.target.value);
								setExtranjero(e.target.value);
							}}
						>
							{/* <MenuItem value="DNI">DNI</MenuItem>
							<MenuItem value="RUC">RUC</MenuItem> */}
							<MenuItem value="TAXID">TAX ID</MenuItem>
						</TextField>
					)}
				/>
				<Controller
					name="natNroDocumento"
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
							error={!!errors.natNroDocumento}
							required
							helperText={errors?.natNroDocumento?.message}
							id="natNroDocumento"
							label="#TAX ID"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<div
				// eslint-disable-next-line no-nested-ternary
				style={{ display: tipo ? 'none' : tipoCliente ? 'flex' : 'none' }}
				className="flex flex-col sm:flex-row mr-24 sm:mr-4"
			>
				<Controller
					name="razónSocial"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.razónSocial}
							helperText={errors?.razónSocial?.message}
							label="Nombre o Razón Social"
							id="razónSocial"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="nombreComercial"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.nombreComercial}
							helperText={errors?.nombreComercial?.message}
							label="Nombre Comercial"
							id="nombreComercial"
							variant="outlined"
							fullWidth
						/>
					)}
				/>

				<Controller
					name="codigo"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.codigo}
							helperText={errors?.codigo?.message}
							label="Código Único Cliente"
							id="codigo"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
		</div>
	);
}

export default InformacionBasica;

import { Controller, useFormContext } from 'react-hook-form';
import { baseUrl } from 'utils/Api';
import FuseUtils from '@fuse/utils';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useState } from 'react';

/* eslint-disable import/prefer-default-export */
const { TextField, MenuItem, Icon, IconButton, Autocomplete } = require('@mui/material');

export const BordadoForm = ({ disabled, bordados }) => {
	const methods = useFormContext();
	const { control, formState, watch } = methods;
	const { errors } = formState;

	const telaPrincipal = watch('telaPrincipal');

	let colores = [];
	if (telaPrincipal && telaPrincipal.colores)
		colores = telaPrincipal.colores.map(e => ({
			...e,
			label: e.label || e.descripcion,
		}));

	return (
		<>
			<hr />
			<div className="mx-6 mb-8 mt-16 text-base">Bordados</div>
			<Controller
				name="bordados"
				control={control}
				render={({ field: { onChange, value } }) => {
					let val = [];
					if (value) {
						val = value.map(alt => {
							return (
								<FormData
									key={FuseUtils.generateGUID()}
									control={control}
									errors={errors}
									data={alt}
									onChange={onChange}
									valInicial={value}
									colores={colores}
									disabled={disabled}
									bordados={bordados}
								/>
							);
						});
					}

					if (!disabled)
						val.push(
							<div key={FuseUtils.generateGUID()}>
								<IconButton
									className="w-full h-fit py-14 flex items-center justify-center rounded-8 overflow-hidden cursor-pointer shadow hover:shadow-md"
									aria-label="add"
									size="medium"
									color="primary"
									style={{
										height: '46px',
										marginLeft: '20px',
										marginRight: '40px',
										// backgroundColor: '#ccf0df',
										backgroundColor: 'rgb(2 136 209)',
									}}
									onClick={() => {
										onChange(
											value
												? [
														...value,
														{
															id: FuseUtils.generateGUID(),
															tipo: '',
															nombre: '',
															descripcion: '',
															nroPuntadas: '',
															urlImagen: '',
															color: null,
														},
												  ]
												: [
														{
															id: FuseUtils.generateGUID(),
															tipo: '',
															nombre: '',
															descripcion: '',
															nroPuntadas: '',
															urlImagen: '',
															color: null,
														},
												  ]
										);
									}}
									disabled={disabled}
								>
									<h5 style={{ color: 'white', fontWeight: 'bold' }}>Agregar bordado</h5>
									&nbsp;
									<AddCircleOutlineIcon style={{ fontSize: '30px', color: 'white' }} />
								</IconButton>
							</div>
						);
					return val;
				}}
			/>
		</>
	);
};

const FormData = ({ errors, data, onChange, valInicial, colores, disabled, bordados }) => {
	const [nombre, setNombre] = useState(data.nombre);
	const [hilo, setHilo] = useState(data.hilo);
	const [colorHilo, setColorHilo] = useState(data.colorHilo);
	const [descripcion, setDescripcion] = useState(data.descripcion);
	const [npuntadas, setNpuntadas] = useState(data.nroPuntadas);

	const actualizar = (nnn, titulo) => {
		// eslint-disable-next-line no-restricted-syntax
		for (const key in valInicial) {
			if (Object.hasOwnProperty.call(valInicial, key)) {
				const element = valInicial[key];
				if (element.id === data.id) {
					element[titulo] = nnn;
				}
			}
		}
		onChange([...valInicial]);
	};

	return (
		<div
			className="flex flex-row"
			style={{
				alignItems: 'center',
				width: '100%',
				margin: 0,
				padding: 0,
				marginLeft: '12px',
				marginBottom: '12px',
			}}
		>
			<div
				className="flex flex-col sm:mr-4"
				style={{
					alignItems: 'center',
					width: '100%',
				}}
			>
				<div
					className="flex flex-row"
					style={{
						alignItems: 'center',
						width: '100%',
					}}
				>
					<TextField
						select
						disabled={disabled}
						className="mt-8 mb-16 mx-12"
						label="Ubicacion"
						id="tipo_bordado"
						variant="outlined"
						fullWidth
						value={data.tipo}
						onChange={newValue => {
							// eslint-disable-next-line no-restricted-syntax
							for (const key in valInicial) {
								if (Object.hasOwnProperty.call(valInicial, key)) {
									const element = valInicial[key];
									if (element.id === data.id) {
										element.tipo = newValue.target.value;
									}
								}
							}
							onChange([...valInicial]);
						}}
					>
						{bordados.map(option => (
							<MenuItem value={option.value} key={option.value}>
								{option.label}
							</MenuItem>
						))}
						{/* <MenuItem value="Otros">Otros</MenuItem> */}
					</TextField>

					<TextField
						disabled={disabled}
						placeholder="Ingrese el nombre"
						className="mt-8 mb-16 mx-12"
						label="Nombre"
						variant="outlined"
						fullWidth
						value={nombre}
						onBlur={() => {
							actualizar(nombre, 'nombre');
						}}
						onChange={newValue => {
							setNombre(newValue.target.value);
						}}
						error={!!errors.bordados}
						helperText={errors?.bordados?.message}
						InputLabelProps={{
							shrink: true,
						}}
					/>
					<TextField
						disabled={disabled}
						placeholder="Ingrese el tipo"
						className="mt-8 mb-16 mx-12"
						label="Tipo de Bordado"
						variant="outlined"
						fullWidth
						value={descripcion}
						onBlur={() => {
							actualizar(descripcion, 'descripcion');
						}}
						onChange={newValue => {
							setDescripcion(newValue.target.value);
						}}
						error={!!errors.bordados}
						helperText={errors?.bordados?.message}
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</div>
				<div
					className="flex flex-row"
					style={{
						alignItems: 'center',
						width: '100%',
					}}
				>
					<TextField
						disabled={disabled}
						placeholder="Ingrese el código"
						className="mt-8 mb-16 mx-12"
						label="Código de hilo"
						variant="outlined"
						fullWidth
						value={hilo}
						onBlur={() => {
							actualizar(hilo, 'hilo');
						}}
						onChange={newValue => {
							setHilo(newValue.target.value);
						}}
						error={!!errors.hilo}
						helperText={errors?.hilo?.message}
						InputLabelProps={{
							shrink: true,
						}}
					/>

					<TextField
						disabled={disabled}
						placeholder="Ingrese el color"
						className="mt-8 mb-16 mx-12"
						label="Color del Hilo"
						variant="outlined"
						fullWidth
						value={colorHilo}
						onBlur={() => {
							actualizar(colorHilo, 'colorHilo');
						}}
						onChange={newValue => {
							setColorHilo(newValue.target.value);
						}}
						error={!!errors.colorHilo}
						helperText={errors?.colorHilo?.message}
						InputLabelProps={{
							shrink: true,
						}}
					/>

					<TextField
						disabled={disabled}
						placeholder="Ingrese el Nº de puntadas"
						className="mt-8 mb-16 mx-12"
						label="Nº de Puntadas"
						type="number"
						InputProps={{
							inputProps: { min: 0 },
						}}
						variant="outlined"
						fullWidth
						value={npuntadas}
						onBlur={() => {
							actualizar(npuntadas, 'nroPuntadas');
						}}
						onChange={newValue => {
							setNpuntadas(newValue.target.value);
						}}
						error={!!errors.bordados}
						helperText={errors?.bordados?.message}
						InputLabelProps={{
							shrink: true,
						}}
					/>

					<Autocomplete
						disabled={disabled}
						className="mt-8 mb-16 mx-12"
						isOptionEqualToValue={(op, val) => op.id === val.id}
						options={colores}
						fullWidth
						value={data.color}
						filterOptions={(options, state) => options}
						onChange={(event, newValue) => {
							// eslint-disable-next-line no-restricted-syntax
							for (const key in valInicial) {
								if (Object.hasOwnProperty.call(valInicial, key)) {
									const element = valInicial[key];
									if (element.id === data.id) {
										element.color = newValue;
									}
								}
							}
							onChange([...valInicial]);
						}}
						renderInput={params => (
							<TextField
								{...params}
								placeholder="Color"
								label="Color"
								required
								fullWidth
								error={!!errors.colores}
								helperText={errors?.colores?.message}
								variant="outlined"
								InputLabelProps={{
									shrink: true,
								}}
							/>
						)}
					/>
				</div>
			</div>
			<label
				htmlFor={data.id + data.nombre + data.tipo + data.descripcion}
				className="productImageUpload flex items-center justify-center relative w-1/5 h-auto py-14 rounded-16 mx-12 overflow-hidden cursor-pointer shadow hover:shadow-lg"
			>
				<input
					disabled={disabled}
					accept="image/*"
					className="hidden"
					id={data.id + data.nombre + data.tipo + data.descripcion}
					type="file"
					onChange={e => {
						const file = e.target.files[0];

						// eslint-disable-next-line no-restricted-syntax
						for (const key in valInicial) {
							if (Object.hasOwnProperty.call(valInicial, key)) {
								const element = valInicial[key];
								if (element.id === data.id) {
									element.file = file;
								}
							}
						}
						onChange([...valInicial]);
					}}
				/>

				{data.file ? (
					<div
						style={{
							height: '120px',
							objectFit: 'contain',
							borderRadius: '50px',
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<img
							className="w-full block rounded"
							src={URL.createObjectURL(data.file)}
							alt={data.nombre}
						/>
					</div>
				) : (
					<div
						style={{
							height: '120px',
							objectFit: 'contain',
							borderRadius: '50px',
							display: 'flex',
							alignItems: 'center',
						}}
					>
						{data.urlImagen ? (
							<img
								className="w-full block rounded"
								src={baseUrl + data.urlImagen}
								alt={data.nombre}
							/>
						) : (
							<Icon fontSize="large" color="action">
								cloud_upload
							</Icon>
						)}
					</div>
				)}
			</label>
			<div
				style={{ backgroundColor: '#F5FBFA', /* marginBottom: '100px',  */ borderRadius: '50px' }}
			>
				<IconButton
					disabled={disabled}
					aria-label="delete"
					color="error"
					onClick={() => {
						// eslint-disable-next-line no-restricted-syntax
						for (const key in valInicial) {
							if (Object.hasOwnProperty.call(valInicial, key)) {
								const element = valInicial[key];
								if (element.id === data.id) {
									valInicial.splice(key, 1);
								}
							}
						}
						onChange([...valInicial]);
					}}
				>
					<DeleteForeverIcon />
				</IconButton>
			</div>
		</div>
	);
};

import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

function InformacionBasicaTab(props) {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	const [gamaTemporal, setGamaTemporal] = useState(null);

	const opcionesGama = [
		{
			key: 1,
			value: 'CLARO',
			label: 'CLARO',
		},
		{
			key: 2,
			value: 'ESPECIAL',
			label: 'ESPECIAL',
		},
		{
			key: 3,
			value: 'MEDIO',
			label: 'MEDIO',
		},
		{
			key: 4,
			value: 'OSCURO',
			label: 'OSCURO',
		},
		{
			key: 5,
			value: 'PPT',
			label: 'PPT',
		},
		{
			key: 6,
			value: 'NINGUNO',
			label: 'NINGUNO',
		},
	];

	const opcionesTipoDesarrollo = [
		{
			key: 1,
			value: 'HILO',
			label: 'HILO COLOR',
		},
		{
			key: 2,
			value: 'TELA',
			label: 'TELA CRUDA',
		},
		{
			key: 3,
			value: 'TELA LISTADA',
			label: 'TELA LISTADA',
		},
	];

	return (
		<>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="descripcion"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16  mx-12"
							error={!!errors.descripcion}
							required
							helperText={errors?.descripcion?.message}
							id="descripcion"
							label="Nombre"
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
							className="mt-8 mb-16  mx-12"
							error={!!errors.codigo}
							required
							helperText={errors?.codigo?.message}
							label="Código"
							id="codigo"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="pantone"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16  mx-12"
							error={!!errors.pantone}
							helperText={errors?.pantone?.message}
							label="Pantone"
							id="pantone"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>

			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="gama"
					control={control}
					render={({ field: { onChange, value } }) => {
						const data = value
							? {
									...value,
									label: value.value ? value.value : value,
							  }
							: null;

						return (
							<Autocomplete
								className="mt-8 mb-16 mx-12"
								// freeSolo
								isOptionEqualToValue={(op, val) => op.id === val.id}
								options={opcionesGama || []}
								value={data}
								filterOptions={(options, state) => {
									return options;
								}}
								fullWidth
								onChange={(event, newValue) => {
									if (newValue) {
										const { label, ...valor } = newValue;
										onChange(valor);
										setGamaTemporal(null);
									} else {
										onChange(null);
									}
								}}
								renderInput={params => (
									<TextField
										{...params}
										error={!!errors.gama}
										required
										helperText={errors?.gama?.message}
										label="Gama"
										id="gama"
										variant="outlined"
										fullWidth
									/>
								)}
							/>
						);
					}}
				/>

				<Controller
					name="tipoDesarrollo"
					control={control}
					render={({ field: { onChange, value } }) => {
						const data = value
							? {
									...value,
									label: value.value ? value.value : value,
							  }
							: null;

						return (
							<Autocomplete
								className="mt-8 mb-16 mx-12"
								// freeSolo
								isOptionEqualToValue={(op, val) => op.id === val.id}
								options={opcionesTipoDesarrollo || []}
								value={data}
								filterOptions={(options, state) => {
									return options;
								}}
								fullWidth
								onChange={(event, newValue) => {
									if (newValue) {
										const { label, ...valor } = newValue;
										onChange(valor);
										setGamaTemporal(null);
									} else {
										onChange(null);
									}
								}}
								renderInput={params => (
									<TextField
										{...params}
										error={!!errors.tipoDesarrollo}
										required
										helperText={errors?.tipoDesarrollo?.message}
										label="Tipo de Desarrollo"
										id="tipoDesarrollo"
										variant="outlined"
										fullWidth
									/>
								)}
							/>
						);
					}}
				/>
			</div>
		</>
	);
}

export default InformacionBasicaTab;

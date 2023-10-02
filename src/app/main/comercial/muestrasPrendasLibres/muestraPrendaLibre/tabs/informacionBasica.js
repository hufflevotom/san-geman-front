/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import debounce from 'lodash.debounce';
import { TextareaAutosize } from '@mui/base';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import esLocale from 'date-fns/locale/es';

import httpClient from 'utils/Api';
import { limitCombo, offsetCombo } from 'constants/constantes';

import TabClientes from './clientes';

const year = new Date().getFullYear();

const opcionesTipoTela = [
	{
		value: 'SOLIDO',
		label: 'S-SOLIDO',
	},
	{
		value: 'LISTADO',
		label: 'L-LISTADO',
	},
	{
		value: 'JACQUARD',
		label: 'J-JACQUARD',
	},
];

function InformacionBasica({ setCodigo, disabled }) {
	const {
		control,
		formState: { errors },
		getValues,
	} = useFormContext();

	const values = getValues();

	const [id, setId] = useState(0);
	const [dataColores, setDataColores] = useState([]);

	const [colorSearchText, setColorSearchText] = useState('');

	const traerColores = async busqueda => {
		let texto = '';
		if (busqueda) {
			texto = busqueda;
		}
		const url = `maestro/color?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${texto}`;

		const response = await httpClient.get(url);
		const dataResponse = await response.data.body[0];
		setDataColores(
			dataResponse.map(color => ({
				...color,
				label: `${color.descripcion}`,
			}))
		);
	};

	const debouncedTraerColores = debounce(() => {
		traerColores(colorSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerColores(); // Llamar a la versión debounced de fetchData
		return debouncedTraerColores.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [colorSearchText]);

	useEffect(async () => {
		const url = `comercial/muestras-prendas-libres/correlativo/`;
		const response = await httpClient.get(url + year);
		const dataId = await response.data.body;
		if (dataId) {
			if (values.id) {
				setId(values.correlativo);
				setCodigo(values.codigo);
			} else {
				setId(dataId);
				setCodigo(`OMPL ${year.toString().substring(2, 4)}-${dataId.toString().padStart(5, '0')}`);
			}
		}
	}, []);

	return (
		<>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="codigo"
					control={control}
					render={({ field: { value } }) => {
						let val = `OMPL ${year.toString().substring(2, 4)}-${id.toString().padStart(5, '0')}`;
						if (value) {
							val = value;
						}
						return (
							<TextField
								className="mt-8 mb-16 mx-12"
								required
								disabled
								value={val}
								label="Codigo"
								id="codigo"
								variant="outlined"
								fullWidth
							/>
						);
					}}
				/>

				<TabClientes disabled={disabled} />

				<Controller
					name="fechaDespacho"
					control={control}
					render={({ field: { onChange, value } }) => (
						<LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
							<DatePicker
								label="Fecha de Despacho"
								id="fechaDespacho"
								variant="outlined"
								openTo="month"
								views={['year', 'month', 'day']}
								value={value}
								onChange={newValue => {
									onChange(newValue);
								}}
								renderInput={params => (
									<TextField
										{...params}
										disabled={disabled}
										className="mt-8 mb-16 mx-12"
										fullWidth
										error={!!errors.codigo}
									/>
								)}
							/>
						</LocalizationProvider>
					)}
				/>
			</div>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="cantidadPrendasSolicitadas"
					control={control}
					render={({ field }) => {
						return (
							<TextField
								{...field}
								type="number"
								className="mt-8 mb-16 mx-12"
								label="Cantidad de Prendas"
								id="cantidadPrendasSolicitadas"
								variant="outlined"
								fullWidth
								disabled={disabled}
							/>
						);
					}}
				/>
				<Controller
					name="tallasPrendasSolicitadas"
					control={control}
					render={({ field }) => {
						return (
							<TextField
								{...field}
								className="mt-8 mb-16 mx-12"
								label="Tallas de Prendas"
								id="tallasPrendasSolicitadas"
								variant="outlined"
								fullWidth
								disabled={disabled}
							/>
						);
					}}
				/>
				<Controller
					name="ruta"
					control={control}
					render={({ field }) => {
						return (
							<TextField
								{...field}
								className="mt-8 mb-16 mx-12"
								label="Ruta"
								id="ruta"
								variant="outlined"
								fullWidth
								disabled={disabled}
							/>
						);
					}}
				/>
			</div>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="nombreEstilo"
					control={control}
					render={({ field }) => {
						return (
							<TextField
								{...field}
								className="mt-8 mb-16 mx-12"
								label="Nombre de Estilo"
								id="nombreEstilo"
								variant="outlined"
								fullWidth
								disabled={disabled}
							/>
						);
					}}
				/>
				<Controller
					name="tipoTela"
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
								disabled={disabled}
								isOptionEqualToValue={(op, val) => op.id === val.id}
								options={opcionesTipoTela || []}
								value={data}
								filterOptions={(options, state) => {
									return options;
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
										error={!!errors.tipoTela}
										helperText={errors?.tipoTela?.message}
										label="Tipo de Tela"
										id="tipoTela"
										variant="outlined"
										fullWidth
									/>
								)}
							/>
						);
					}}
				/>
				<Controller
					name="color"
					control={control}
					render={({ field: { onChange, value } }) => {
						const data = value
							? {
									...value,
									label: value.descripcion || value,
							  }
							: null;

						return (
							<Autocomplete
								disabled={disabled}
								className="mt-8 mb-16 mx-12"
								isOptionEqualToValue={(op, val) => op.id === val.id}
								options={dataColores || []}
								value={data}
								fullWidth
								filterOptions={(options, state) => options}
								onInputChange={(event, newInputValue) => {
									setColorSearchText(newInputValue);
								}}
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
										placeholder="Seleccione el color"
										label="Color"
										required
										fullWidth
										error={!!errors.color}
										helperText={errors?.color?.message}
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
			</div>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="detalles"
					control={control}
					render={({ field: { value, onChange } }) => {
						let val = ``;
						if (value) {
							val = value;
						}
						return (
							<TextareaAutosize
								required
								value={val}
								label="Detalles"
								id="detalles"
								variant="outlined"
								onChange={e => {
									onChange(e.target.value);
								}}
								disabled={disabled}
								aria-label="minimum height"
								minRows={3}
								placeholder="Detalles"
								style={{
									width: '100%',
									padding: '15px',
									margin: '10px',
									border: '1px solid #ced4da',
									borderRadius: '4px',
								}}
							/>
						);
					}}
				/>
			</div>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="preguntas"
					control={control}
					render={({ field: { value, onChange } }) => {
						let val = ``;
						if (value) {
							val = value;
						}
						return (
							<TextareaAutosize
								required
								value={val}
								label="Preguntas y respuestas"
								id="preguntas"
								variant="outlined"
								onChange={e => {
									onChange(e.target.value);
								}}
								// disabled={disabled}
								aria-label="minimum height"
								minRows={3}
								placeholder="Preguntas y respuestas"
								style={{
									width: '100%',
									padding: '15px',
									margin: '10px',
									border: '1px solid #ced4da',
									borderRadius: '4px',
								}}
							/>
						);
					}}
				/>
			</div>
		</>
	);
}

export default InformacionBasica;

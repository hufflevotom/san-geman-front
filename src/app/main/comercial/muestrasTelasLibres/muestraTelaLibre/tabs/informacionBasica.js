/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import { TextareaAutosize } from '@mui/base';
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import esLocale from 'date-fns/locale/es';

import httpClient from 'utils/Api';

import TabClientes from './clientes';

function InformacionBasica({ setCodigo, disabled }) {
	const methods = useFormContext();
	const { control, formState, getValues } = methods;
	const { errors } = formState;

	const values = getValues();

	const [id, setId] = useState(0);

	const year = new Date().getFullYear();

	useEffect(async () => {
		const url = `comercial/muestras-telas-libres/correlativo/`;
		const response = await httpClient.get(url + year);
		const dataId = await response.data.body;
		if (dataId) {
			if (values.id) {
				setId(values.correlativo);
				setCodigo(values.codigo);
			} else {
				setId(dataId);
				setCodigo(`OMTL ${year.toString().substring(2, 4)}-${dataId.toString().padStart(5, '0')}`);
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
						let val = `OMTL ${year.toString().substring(2, 4)}-${id.toString().padStart(5, '0')}`;
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
								autoFocus
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
		</>
	);
}

export default InformacionBasica;

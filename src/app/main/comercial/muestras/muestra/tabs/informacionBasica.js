/* eslint-disable react-hooks/exhaustive-deps */
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import esLocale from 'date-fns/locale/es';

import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import httpClient from 'utils/Api';
import TabClientes from './clientes';

function InformacionBasica({ setCodigo }) {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	const [id, setId] = useState(0);

	const year = new Date().getFullYear();

	useEffect(async () => {
		const url = `comercial/muestras/correlativo/`;
		const response = await httpClient.get(url + year);
		const dataId = await response.data.body;
		setId(dataId);
		setCodigo(`OM ${year.toString().substring(2, 4)}-${dataId.toString().padStart(5, '0')}`);
	}, []);

	return (
		<>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="codigo"
					control={control}
					render={({ field: { value } }) => {
						let val = `OM ${year.toString().substring(2, 4)}-${id.toString().padStart(5, '0')}`;
						if (value) {
							val = value;
						}
						return (
							<TextField
								className="mt-8 mb-16 mx-12"
								error={!!errors.codigo}
								required
								disabled
								value={val}
								helperText={errors?.codigo?.message}
								label="Codigo"
								autoFocus
								id="codigo"
								variant="outlined"
								fullWidth
							/>
						);
					}}
				/>
				<TabClientes />

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
								// inputFormat="dd/MM/yyyy"
								value={value}
								onChange={newValue => {
									onChange(newValue);
								}}
								renderInput={params => (
									<TextField
										{...params}
										className="mt-8 mb-16 mx-12"
										fullWidth
										error={!!errors.fechaDespacho}
										helperText={errors?.fechaDespacho?.message}
									/>
								)}
							/>
						</LocalizationProvider>
					)}
				/>
			</div>
		</>
	);
}

export default InformacionBasica;

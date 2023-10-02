import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { TextField } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import React from 'react';
import esLocale from 'date-fns/locale/es';

const Fecha = () => {
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
			<DatePicker
				label="Fecha"
				id="fecha"
				variant="outlined"
				openTo="month"
				views={['year', 'month', 'day']}
				// inputFormat="dd/MM/yyyy"
				// value={value}
				onChange={newValue => {}}
				renderInput={params => (
					<TextField
						{...params}
						className="mt-8 mb-16 mx-12"
						fullWidth
						// error={!!errors.fecha}
						// helperText={errors?.fecha?.message}
					/>
				)}
			/>
		</LocalizationProvider>
	);
};

export default Fecha;

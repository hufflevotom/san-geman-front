import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { TextField } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import esLocale from 'date-fns/locale/es';

const Fecha = ({ value, setValue, name, disabled, entrega = false }) => {
	const options = {
		required: true,
		label: name,
		placeholder: 'dd/mm/yyyy',
		id: name,
		variant: 'outlined',
		openTo: 'day',
		views: ['year', 'month', 'day'],
		inputFormat: 'dd/MM/yyyy',
		minDate: entrega ? new Date(new Date().getTime() + 24 * 60 * 60 * 1000) : null,
		renderInput: params => <TextField {...params} className="mt-8 mb-16 mx-12" fullWidth />,
	};
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
			<DatePicker
				{...options}
				disabled={disabled}
				value={value}
				onChange={newValue => {
					setValue(newValue);
				}}
			/>
		</LocalizationProvider>
	);
};

export default Fecha;

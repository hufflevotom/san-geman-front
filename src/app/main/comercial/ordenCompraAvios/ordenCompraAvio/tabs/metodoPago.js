import { Autocomplete, TextField } from '@mui/material';
import debounce from 'lodash.debounce';
import { limitCombo, offsetCombo } from 'constants/constantes';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import httpClient from 'utils/Api';

const MetodoPago = props => {
	// const { preferenciaPago } = props;
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	const [dataMetodoPago, setDataMetodoPago] = useState([]);
	const [metodoPagoSearchText, setMetodoPagoSearchText] = useState('');

	useEffect(() => {
		getMetodosPago();
	}, []);

	const getMetodosPago = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `configuraciones/forma-pagos?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataMetodoPago(data);
	};

	const debouncedGetMetodosPago = debounce(() => {
		getMetodosPago(metodoPagoSearchText);
	}, 500);

	useEffect(() => {
		debouncedGetMetodosPago(); // Llamar a la versión debounced de fetchData
		return debouncedGetMetodosPago.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [metodoPagoSearchText]);

	const opcionesMetodoPago = dataMetodoPago.map(metodoPago => ({
		...metodoPago,
		label: metodoPago.descripcion,
	}));

	return (
		<Controller
			name="formaPago"
			control={control}
			render={({ field: { onChange, value } }) => {
				console.log('Value forma pago: ', value);

				const pago = value
					? {
							...value,
							label: value.descripcion,
					  }
					: null;

				return (
					<Autocomplete
						className="mt-8 mb-16 mx-12"
						// freeSolo
						isOptionEqualToValue={(op, val) => op.id === val.id}
						options={opcionesMetodoPago || []}
						value={pago}
						filterOptions={(options, state) => {
							return options;
						}}
						onInputChange={(event, newInputValue) => {
							setMetodoPagoSearchText(newInputValue);
							// setMetodoPagoTemporal({ ...pago, label: newInputValue });
						}}
						fullWidth
						onChange={(event, newValue) => {
							if (newValue) {
								const { label, ...valor } = newValue;
								onChange(valor);
								// setMetodoPagoTemporal(null);
							} else {
								onChange(null);
							}
						}}
						renderInput={params => (
							<TextField
								{...params}
								placeholder="Seleccione el Método de Pago"
								label="Método de Pago"
								required
								error={!!errors.formaPago}
								helperText={errors?.formaPago?.message}
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
	);
};

export default MetodoPago;

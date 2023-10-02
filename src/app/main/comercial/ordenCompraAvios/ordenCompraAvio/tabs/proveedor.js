import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import debounce from 'lodash.debounce';
import { useFormContext, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import httpClient from 'utils/Api';
import { limitCombo, offsetCombo } from 'constants/constantes';

function Proveedor(props) {
	const methods = useFormContext();
	const { control, formState, setValue } = methods;
	const { errors } = formState;

	const [dataProveedores, setDataUnidades] = useState([]);

	const [proveedorSearchText, setProveedorSearchText] = useState('');

	useEffect(() => {
		traerProveedores();
	}, []);

	const traerProveedores = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `comercial/proveedores?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataUnidades(data);
	};

	const debouncedTraerProveedores = debounce(() => {
		traerProveedores(proveedorSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerProveedores(); // Llamar a la versión debounced de fetchData
		return debouncedTraerProveedores.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [proveedorSearchText]);

	const opciones = dataProveedores.map(proveedor => ({
		...proveedor,
		label: `${
			proveedor.tipo === 'N'
				? `${proveedor.apellidoPaterno} ${proveedor.apellidoMaterno}, ${proveedor.nombres}`
				: proveedor.razonSocial
		}`,
	}));

	return (
		<>
			<Controller
				name="proveedor"
				control={control}
				render={({ field: { onChange, value } }) => {
					const proveedor = value
						? {
								...value,
								label: `${
									value.tipo === 'N'
										? `${value.apellidoPaterno} ${value.apellidoMaterno}, ${value.nombres}`
										: value.razonSocial
								}`,
						  }
						: null;
					return (
						<Autocomplete
							className="mt-8 mb-16 mx-12"
							// freeSolo
							isOptionEqualToValue={(op, val) => op.id === val.id}
							options={opciones || []}
							value={proveedor}
							filterOptions={(options, state) => {
								return options;
							}}
							onInputChange={(event, newInputValue) => {
								setProveedorSearchText(newInputValue);
								// setProveedorTemporal({ ...proveedor, label: newInputValue });
							}}
							fullWidth
							onChange={(event, newValue) => {
								if (newValue) {
									const { label, ...valor } = newValue;
									onChange(valor);

									setValue('formaPago', valor.formaPago);
								} else {
									onChange(null);
								}
							}}
							renderInput={params => (
								<TextField
									{...params}
									placeholder="Seleccione el proveedor"
									label="Proveedor"
									error={!!errors.proveedor}
									helperText={errors?.proveedor?.message}
									variant="outlined"
									fullWidth
									InputLabelProps={{
										shrink: true,
									}}
								/>
							)}
						/>
					);
				}}
			/>
		</>
	);
}

export default Proveedor;

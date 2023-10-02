/* eslint-disable no-nested-ternary */
import { Autocomplete } from '@mui/material';
import debounce from 'lodash.debounce';
import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import httpClient from 'utils/Api';
import { limitCombo, offsetCombo } from 'constants/constantes';

function ClienteTab(props) {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	const [opcionesMarca, setOpcionesMarca] = useState([]);
	const [dataClientes, setDataClientes] = useState([]);

	const [clienteSearchText, setClienteSearchText] = useState('');

	useEffect(() => {
		traerClientes();
	}, []);

	const traerClientes = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `comercial/clientes?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataClientes(data);
	};

	const debouncedGetClientes = debounce(() => {
		traerClientes(clienteSearchText);
	}, 500);

	useEffect(() => {
		debouncedGetClientes(); // Llamar a la versión debounced de fetchData
		return debouncedGetClientes.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [clienteSearchText]);

	const opciones = dataClientes.map(cliente => ({
		...cliente,
		label:
			cliente.tipoCliente === 'N'
				? cliente.tipo === 'N'
					? `${cliente.natApellidoPaterno} ${cliente.natApellidoMaterno} ${cliente.natNombres}`
					: cliente.razónSocial
				: cliente.razónSocial,
	}));

	return (
		<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
			<Controller
				name="cliente"
				control={control}
				render={({ field: { onChange, value } }) => {
					const cliente = value
						? {
								...value,
								label:
									value.tipoCliente === 'N'
										? value.tipo === 'N'
											? `${value.natApellidoPaterno} ${value.natApellidoMaterno} ${value.natNombres}`
											: value.razónSocial
										: value.razónSocial,
						  }
						: null;
					return (
						<Autocomplete
							className="mt-8 mb-16 mx-12"
							isOptionEqualToValue={(op, val) => op.id === val.id}
							options={opciones || []}
							value={cliente}
							filterOptions={(options, state) => {
								return options;
							}}
							onInputChange={(event, newInputValue) => {
								setClienteSearchText(newInputValue);
							}}
							fullWidth
							onChange={(event, newValue) => {
								if (newValue) {
									const { label, ...valor } = newValue;
									const arrayMarcas = [];
									valor.marcas.forEach(marca => {
										arrayMarcas.push({ ...marca, label: marca.marca });
									});
									setOpcionesMarca(arrayMarcas);
									onChange(valor);
								} else {
									onChange(null);
								}
							}}
							renderInput={params => (
								<TextField
									{...params}
									placeholder="Seleccione el cliente"
									label="Cliente"
									error={!!errors.cliente}
									helperText={errors?.cliente?.message}
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
			<Controller
				name="marca"
				control={control}
				render={({ field: { onChange, value } }) => {
					const marca = value
						? {
								...value,
								label: value.marca,
						  }
						: null;
					return (
						<Autocomplete
							className="mt-8 mb-16 mx-12"
							isOptionEqualToValue={(op, val) => op.id === val.id}
							options={opcionesMarca}
							value={marca}
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
									placeholder="Seleccione la marca"
									label="Marca"
									error={!!errors.marca}
									helperText={errors?.marca?.message}
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
		</div>
	);
}

export default ClienteTab;

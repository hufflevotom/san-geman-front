import { Autocomplete, TextField } from '@mui/material';
import { limitCombo, offsetCombo } from 'constants/constantes';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import debounce from 'lodash.debounce';
import httpClient from 'utils/Api';

const TabClientes = () => {
	const methods = useFormContext();
	const { control, formState, getValues } = methods;
	const { errors } = formState;

	const [opcionesMarca, setOpcionesMarca] = useState([]);
	const [dataClientes, setDataClientes] = useState([]);
	const [clienteTemporal, setClienteTemporal] = useState(null);
	const [clienteSearchText, setClienteSearchText] = useState('');

	useEffect(() => {
		getClientes();
	}, []);

	const getValue = getValues();

	const getClientes = async busqueda => {
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
		getClientes(clienteSearchText);
	}, 500);

	useEffect(() => {
		debouncedGetClientes(); // Llamar a la versión debounced de fetchData
		return debouncedGetClientes.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [clienteSearchText]);

	const opcionesClientes = dataClientes.map(cliente => ({
		...cliente,
		label:
			// eslint-disable-next-line no-nested-ternary
			cliente.tipoCliente === 'N'
				? cliente.tipo === 'J'
					? `${cliente.ruc} - ${cliente.razónSocial}`
					: `${cliente.natNroDocumento} - ${cliente.natNombres} ${cliente.natApellidoPaterno}`
				: `${cliente.natNroDocumento} - ${cliente.razónSocial}`,
	}));

	return (
		<>
			<Controller
				name="cliente"
				control={control}
				render={({ field: { onChange, value } }) => {
					const cliente = value
						? {
								...value,
								label:
									// eslint-disable-next-line no-nested-ternary
									value.tipoCliente === 'N'
										? value.tipo === 'J'
											? `${value.ruc} - ${value.razónSocial}`
											: `${value.natNroDocumento} - ${value.natNombres} ${value.natApellidoPaterno}`
										: `${value.natNroDocumento} - ${value.razónSocial}`,
						  }
						: null;

					return (
						<Autocomplete
							disabled={getValue.dataEstilos.length > 0}
							className="mt-8 mb-16 mx-12"
							// freeSolo
							isOptionEqualToValue={(op, val) => op.id === val.id}
							options={opcionesClientes || []}
							value={cliente}
							filterOptions={(options, state) => {
								return options;
							}}
							onInputChange={(event, newInputValue) => {
								setClienteSearchText(newInputValue);
								setClienteTemporal({ ...cliente, label: newInputValue });
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
									setClienteTemporal(null);
								} else {
									onChange(null);
								}
							}}
							renderInput={params => (
								<TextField
									{...params}
									placeholder="Seleccione al Cliente"
									label="Cliente"
									required
									error={!!errors.cliente}
									helperText={errors?.cliente?.message}
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
		</>
	);
};

export default TabClientes;

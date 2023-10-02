/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import debounce from 'lodash.debounce';
import { Autocomplete, TextField } from '@mui/material';

import httpClient from 'utils/Api';
import { limitCombo, offsetCombo } from 'constants/constantes';

const TabClientes = ({ disabled }) => {
	const methods = useFormContext();
	const { control, formState, getValues } = methods;

	const [opcionesMarca, setOpcionesMarca] = useState([]);
	const [dataClientes, setDataClientes] = useState([]);
	const [clienteTemporal, setClienteTemporal] = useState(null);

	const [clienteSearchText, setClienteSearchText] = useState('');

	useEffect(() => {
		getClientes();
	}, []);

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
			cliente.tipoCliente === 'N'
				? cliente.tipo === 'J'
					? `${cliente.razónSocial}`
					: `${cliente.natNombres} ${cliente.natApellidoPaterno}`
				: `${cliente.razónSocial}`,
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
									value.tipoCliente === 'N'
										? value.tipo === 'J'
											? `${value.razónSocial}`
											: `${value.natNombres} ${value.natApellidoPaterno}`
										: `${value.razónSocial}`,
						  }
						: null;

					return (
						<Autocomplete
							className="mt-8 mb-16 mx-12"
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
							disabled={disabled}
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
							disabled={disabled}
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

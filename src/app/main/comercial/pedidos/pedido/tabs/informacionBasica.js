import { Autocomplete } from '@mui/material';
import debounce from 'lodash.debounce';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { limitCombo, offsetCombo } from 'constants/constantes';
import httpClient from 'utils/Api';
import { useSelector } from 'react-redux';

function InformacionBasica(props) {
	const methods = useFormContext();
	const { control, formState, getValues, watch } = methods;
	const { errors } = formState;
	const pedido = useSelector(({ comercial }) => comercial.pedido);

	const [loadCliente, setLoadCliente] = useState(false);

	const [clienteTemporal, setClienteTemporal] = useState(null);
	const [marcaTemporal, setMarcaTemporal] = useState(null);
	const [incotermsTemporal, setIncotermsTemporal] = useState(null);
	const [modoEnvioTemporal, setModoEnvioTemporal] = useState(null);

	const [opcionesMarca, setOpcionesMarca] = useState([]);
	const [dataCliente, setDataCliente] = useState([]);
	const [opcionesClientes, setOpcionesClientes] = useState([]);
	const [po, setPo] = useState();
	const [temporada, setTemporada] = useState();

	const [clienteSearchText, setClienteSearchText] = useState('');

	const clienteInput = watch('cliente');

	useEffect(() => {
		getClientes();
	}, []);

	const getValor = getValues();

	const getClientes = async busqueda => {
		setLoadCliente(true);
		setDataCliente([]);
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `comercial/clientes?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataCliente(data);
	};

	const debouncedGetClientes = debounce(() => {
		getClientes(clienteSearchText);
	}, 500);

	useEffect(() => {
		debouncedGetClientes(); // Llamar a la versión debounced de fetchData
		return debouncedGetClientes.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [clienteSearchText]);

	useEffect(() => {
		const opcArr = dataCliente.map(cliente => {
			return {
				...cliente,
				label:
					// eslint-disable-next-line no-nested-ternary
					cliente.tipoCliente === 'N'
						? cliente.tipo === 'J'
							? `${cliente.razónSocial}`
							: `${cliente.natNombres} ${cliente.natApellidoPaterno}`
						: `${cliente.razónSocial}`,
			};
		});
		setOpcionesClientes(opcArr);
		setLoadCliente(false);
	}, [dataCliente]);

	const opcionesIncoterms = [
		{
			label: 'FOB',
			nombre: 'FOB',
			id: 1,
		},
		{
			label: 'FCA',
			nombre: 'FCA',
			id: 2,
		},
		{
			label: 'LDP',
			nombre: 'LDP',
			id: 3,
		},
	];

	const opcionesShipModes = [
		{
			label: 'SEA',
			nombre: 'SEA',
			id: 1,
		},
		{
			label: 'AIR',
			nombre: 'AIR',
			id: 2,
		},
	];

	return (
		<div>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
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
												? `${value.razónSocial}`
												: `${value.natNombres} ${value.natApellidoPaterno}`
											: `${value.razónSocial}`,
							  }
							: null;

						return (
							<Autocomplete
								disabled={getValor?.dataEstilos?.estilos.length > 0}
								className="mt-8 mb-16 mx-12"
								isOptionEqualToValue={(op, val) => op.id === val.id}
								options={opcionesClientes || []}
								fullWidth
								loading={loadCliente}
								filterOptions={(options, state) => options}
								onInputChange={(event, newInputValue) => {
									setClienteSearchText(newInputValue);
									setClienteTemporal({ ...cliente, label: newInputValue });
								}}
								value={clienteTemporal || cliente}
								onBlur={() => {
									if (!clienteTemporal) return;
									const arrayMarcas = [];
									clienteTemporal.marcas.forEach(marca => {
										arrayMarcas.push({ ...marca, label: marca.marca });
									});
									setOpcionesMarca(arrayMarcas);
									onChange(clienteTemporal);
								}}
								onChange={(event, newValue) => {
									if (newValue) {
										setClienteTemporal(newValue);
									}
								}}
								renderInput={params => (
									<TextField
										{...params}
										placeholder="Seleccione el cliente"
										label="Cliente"
										required
										error={!!errors.cliente_id}
										helperText={errors?.cliente_id?.message}
										variant="outlined"
										InputLabelProps={{
											shrink: true,
										}}
										fullWidth
										autoFocus
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
								value={marcaTemporal || marca}
								filterOptions={(options, state) => {
									return options;
								}}
								fullWidth
								onBlur={() => {
									if (!marcaTemporal) return;
									onChange(marcaTemporal);
								}}
								onChange={(event, newValue) => {
									if (newValue) {
										setMarcaTemporal(newValue);
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
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="po"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							disabled={pedido?.asignado}
							className="mt-8 mb-16 mx-12"
							error={!!errors.po}
							required
							helperText={errors?.po?.message}
							value={po || field.value}
							onBlur={() => {
								field.onChange(po);
							}}
							onChange={event => {
								setPo(event.target.value);
							}}
							label="PO"
							id="po"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			{clienteInput && clienteInput.tipoCliente !== 'N' && (
				<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
					<Controller
						name="incoterms"
						control={control}
						render={({ field: { onChange: onChangeInco, value } }) => {
							const incoterms = value
								? {
										...value,
										label: value.nombre ? value.nombre : value,
								  }
								: null;
							return (
								<Autocomplete
									disabled={pedido?.asignado}
									className="mt-8 mb-16 mx-12"
									isOptionEqualToValue={(op, val) => op.nombre === val.label}
									options={opcionesIncoterms}
									value={incotermsTemporal || incoterms}
									fullWidth
									onBlur={() => {
										onChangeInco(incotermsTemporal);
									}}
									onChange={(event, newValue) => {
										setIncotermsTemporal(newValue);
									}}
									renderInput={params => (
										<TextField
											{...params}
											placeholder="Seleccione incoterms"
											label="Incoterms"
											required
											error={!!errors.inco_terms}
											helperText={errors?.inco_terms?.message}
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
						name="shipMode"
						control={control}
						render={({ field: { onChange: onChangeShip, value } }) => {
							const shipMode = value
								? {
										...value,
										label: value.nombre ? value.nombre : value,
								  }
								: null;
							return (
								<Autocomplete
									disabled={pedido?.asignado}
									className="mt-8 mb-16 mx-12"
									isOptionEqualToValue={(op, val) => op.nombre === val.label}
									options={opcionesShipModes}
									value={modoEnvioTemporal || shipMode}
									fullWidth
									onBlur={() => {
										onChangeShip(modoEnvioTemporal);
									}}
									onChange={(event, newValue) => {
										setModoEnvioTemporal(newValue);
									}}
									renderInput={params => (
										<TextField
											{...params}
											placeholder="Seleccione Modo de Envío"
											label="Modo de Envío"
											required
											error={!!errors.ship_mode}
											helperText={errors?.ship_mode?.message}
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
						name="temporada"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								disabled={pedido?.asignado}
								className="mt-8 mb-16 mx-12"
								error={!!errors.temporada}
								required
								helperText={errors?.temporada?.message}
								value={temporada || field.value}
								onBlur={() => {
									field.onChange(temporada);
								}}
								onChange={event => {
									setTemporada(event.target.value);
								}}
								id="temporada"
								label="Temporada"
								variant="outlined"
								fullWidth
							/>
						)}
					/>
				</div>
			)}
		</div>
	);
}

export default InformacionBasica;

import { useFormContext, Controller } from 'react-hook-form';
import debounce from 'lodash.debounce';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextField from '@mui/material/TextField';
import { Autocomplete } from '@mui/material';

import esLocale from 'date-fns/locale/es';
import { useEffect, useState } from 'react';
import httpClient from 'utils/Api';
import { limitCombo, offsetCombo } from 'constants/constantes';

import TipoIngresoForm from './TipoIngreso';
import TipoIngresoOrdenForm from './TipoIngresoOrden';

function InformacionBasica() {
	const methods = useFormContext();

	const { control, formState, getValues, watch } = methods;
	const { errors } = formState;

	const [dataProveedores, setDataUnidades] = useState([]);
	const [dataProduccion, setDataProduccion] = useState([]);
	const [existe, setExiste] = useState(false);
	const [ordenP, setOrdenP] = useState(false);

	const [proveedoresSearchText, setProveedoresSearchText] = useState('');
	const [ordenProduccionSearchText, setOrdenProduccionSearchText] = useState('');

	const [idNota, setIdNota] = useState(null);
	const getData = getValues();

	const tipoComprobanteValue = watch('tipoComprobante');

	useEffect(() => {
		if (getData.id) {
			setIdNota(getData.nNota);
		} else {
			traerIdNota();
		}
		traerProveedores();
		traerOrdenesProduccion();
	}, []);

	useEffect(() => {
		if (getData.id) {
			setExiste(true);
		} else {
			setExiste(false);
		}
	}, [getData]);

	const traerIdNota = async () => {
		const url = `almacen-tela/ingreso/generateNota`;
		const response = await httpClient.get(url);
		const data = await response.data.body;
		setIdNota(data.nota);
	};

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
		traerProveedores(proveedoresSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerProveedores(); // Llamar a la versión debounced de fetchData
		return debouncedTraerProveedores.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [proveedoresSearchText]);

	const traerOrdenesProduccion = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `comercial/producciones?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataProduccion(data);
	};

	const debouncedTraerOrdenesProduccion = debounce(() => {
		traerOrdenesProduccion(ordenProduccionSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerOrdenesProduccion(); // Llamar a la versión debounced de fetchData
		return debouncedTraerOrdenesProduccion.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [ordenProduccionSearchText]);

	const opciones = dataProveedores.map(proveedor => ({
		...proveedor,
		label: proveedor.tipo === 'N' ? proveedor.nombres : proveedor.razonSocial,
	}));

	const opcionesProduccion = dataProduccion.map(prod => ({
		...prod,
		label: prod.codigo,
	}));

	const opcionesComprobante = [
		{ id: 1, label: 'Boleta de Venta', value: 'Boleta de Venta' },
		{ id: 2, label: 'Factura', value: 'Factura' },
		{ id: 3, label: 'Guia de Remision-Remitente', value: 'Guia de Remision-Remitente' },
		// { id: 4, label: 'Nota de Crédito', value: 'Nota de Crédito' },
		// { id: 5, label: 'Nota de Débito', value: 'Nota de Débito' },
		{ id: 6, label: 'Otros', value: 'Otros' },
	];

	const opcionesOperacion = [
		{ id: 1, label: 'Ingreso Libre - Inventario', value: 'Ingreso Libre - Inventario' },
		{ id: 1, label: 'Ingreso Libre', value: 'Ingreso Libre' },
		{ id: 2, label: 'Ingreso con Orden de Compra', value: 'Ingreso con Orden de Compra' },
		{
			id: 3,
			label: 'Ingreso con Orden de Producción (OP)',
			value: 'Ingreso con Orden de Producción (OP)',
		},
	];

	return (
		<>
			<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">{idNota}</div>

			<br />

			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="tipoOperacion"
					control={control}
					render={({ field: { onChange, value } }) => {
						const tipoOperacion = value
							? {
									...value,
									label: value.id ? value.value : value,
							  }
							: null;

						return (
							<Autocomplete
								className="mt-8 mb-16 mx-12"
								// freeSolo
								disabled={existe}
								isOptionEqualToValue={(op, val) => op.label === val.label}
								options={opcionesOperacion || []}
								value={tipoOperacion}
								filterOptions={(options, state) => {
									return options;
								}}
								fullWidth
								onChange={(event, newValue) => {
									if (newValue) {
										const { label, ...valor } = newValue;
										onChange(valor);
										setOrdenP(newValue.id === 3);
									} else {
										onChange(null);
									}
								}}
								renderInput={params => (
									<TextField
										{...params}
										placeholder="Seleccione el Tipo de Operación"
										label="Tipo de Operación"
										error={!!errors.tipoOperacion}
										helperText={errors?.tipoOperacion?.message}
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
				{getData.tipoOperacion?.value === 'Ingreso Libre - Inventario' ||
				getData.tipoOperacion === 'Ingreso Libre - Inventario' ? null : (
					<Controller
						name="tipoComprobante"
						control={control}
						render={({ field: { onChange, value } }) => {
							const tipoComprobante = value
								? {
										...value,
										label: value.id ? value.value : value,
								  }
								: null;

							return (
								<Autocomplete
									className="mt-8 mb-16 mx-12"
									// freeSolo
									/* disabled={existe} */
									isOptionEqualToValue={(op, val) => op.label === val.label}
									options={opcionesComprobante || []}
									value={tipoComprobante}
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
											placeholder="Seleccione el Tipo de Comprobante"
											label="Tipo de Comprobante"
											error={!!errors.tipoComprobante}
											helperText={errors?.tipoComprobante?.message}
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
				)}

				<Controller
					name="fechaRegistro"
					control={control}
					render={({ field: { onChange, value } }) => (
						<LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
							<DatePicker
								/* disabled={existe} */
								disabled
								label="Fecha de Registro"
								id="fechaRegistro"
								variant="outlined"
								openTo="month"
								views={['year', 'month', 'day']}
								// inputFormat="dd/MM/yyyy"
								value={new Date()}
								onChange={newValue => {
									onChange(newValue);
								}}
								renderInput={params => (
									<TextField
										{...params}
										className="mt-8 mb-16 mx-12"
										fullWidth
										error={!!errors.fechaRegistro}
										helperText={errors?.fechaRegistro?.message}
									/>
								)}
							/>
						</LocalizationProvider>
					)}
				/>
			</div>

			{tipoComprobanteValue && tipoComprobanteValue.value === 'Otros' && (
				<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
					<Controller
						name="otroComprobante"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								/* disabled={existe} */
								className="mt-8 mb-16 mx-12"
								error={!!errors.otroComprobante}
								required
								helperText={errors?.otroComprobante?.message}
								id="otroComprobante"
								label="Tipo de comprobante"
								variant="outlined"
								fullWidth
							/>
						)}
					/>
				</div>
			)}
			{getData.tipoOperacion?.value === 'Ingreso Libre - Inventario' ||
			getData.tipoOperacion === 'Ingreso Libre - Inventario' ? null : (
				<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
					<Controller
						name="nroSerie"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								/* disabled={existe} */
								className="mt-8 mb-16 mx-12"
								error={!!errors.nroSerie}
								required
								helperText={errors?.nroSerie?.message}
								id="nroSerie"
								label="Número de Serie"
								variant="outlined"
								fullWidth
							/>
						)}
					/>

					<Controller
						name="nroDocumento"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								/* disabled={existe} */
								className="mt-8 mb-16 mx-12"
								error={!!errors.nroDocumento}
								required
								helperText={errors?.nroDocumento?.message}
								label="N° Documento de Referencia"
								id="nroDocumento"
								variant="outlined"
								fullWidth
							/>
						)}
					/>

					<Controller
						name="fechaDocumento"
						control={control}
						render={({ field: { onChange, value } }) => (
							<LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
								<DatePicker
									/* disabled={existe} */
									label="Fecha de Documento de Referencia"
									id="fechaDocumento"
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
											error={!!errors.fechaDocumentoReferencia}
											helperText={errors?.fechaDocumentoReferencia?.message}
										/>
									)}
								/>
							</LocalizationProvider>
						)}
					/>
				</div>
			)}

			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="observacion"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							/* disabled={existe} */
							className="mt-8 mb-16 mx-12"
							error={!!errors.observacion}
							required
							helperText={errors?.observacion?.message}
							id="observacion"
							label="Observación"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<>
				{(getData.tipoOperacion?.value === 'Ingreso Libre' ||
					getData.tipoOperacion === 'Ingreso Libre' ||
					getData.tipoOperacion?.value === 'Ingreso Libre - Inventario' ||
					getData.tipoOperacion === 'Ingreso Libre - Inventario' ||
					getData.tipoOperacion?.value === 'Ingreso con Orden de Producción (OP)' ||
					getData.tipoOperacion === 'Ingreso con Orden de Producción (OP)') && (
					<div>
						<Controller
							name="proveedor"
							control={control}
							render={({ field: { onChange, value } }) => {
								/* if(getData.) */

								const proveedor = value
									? {
											...value,
											label: value.tipo === 'N' ? value.nombres : value.razonSocial,
									  }
									: null;
								return (
									<Autocomplete
										className="mt-8 mb-16 mx-12"
										// multiple
										// freeSolo
										disabled={getData.tipoOperacion?.id === 2}
										isOptionEqualToValue={(op, val) => op.id === val.id}
										options={opciones || []}
										value={proveedor}
										filterOptions={(options, state) => {
											return options;
										}}
										onInputChange={(event, newInputValue) => {
											setProveedoresSearchText(newInputValue);
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

						{ordenP ? (
							<Controller
								name="ordenProduccion"
								control={control}
								render={({ field: { onChange, value } }) => {
									const ordenProduccion = value
										? {
												...value,
												label: value.codigo,
										  }
										: null;
									return (
										<Autocomplete
											className="mt-12 mb-16 mx-12"
											// multiple
											// freeSolo
											disabled={getData.tipoOperacion?.id === 2}
											isOptionEqualToValue={(opp, val) => opp.id === val.id}
											options={opcionesProduccion || []}
											value={ordenProduccion}
											filterOptions={(options, state) => {
												return options;
											}}
											onInputChange={(event, newInputValue) => {
												setOrdenProduccionSearchText(newInputValue);
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
													placeholder="Seleccione la orden de producción"
													label="Orden de producción (OP)"
													error={!!errors.ordenProduccion}
													helperText={errors?.ordenProduccion?.message}
													variant="outlined"
													fullWidth
													required
													InputLabelProps={{
														shrink: true,
													}}
												/>
											)}
										/>
									);
								}}
							/>
						) : null}

						<TipoIngresoForm />
					</div>
				)}
				{(getData?.tipoOperacion?.value === 'Ingreso con Orden de Compra' ||
					getData.tipoOperacion === 'Ingreso con Orden de Compra') && (
					<TipoIngresoOrdenForm existe={existe} />
				)}
			</>
		</>
	);
}

export default InformacionBasica;

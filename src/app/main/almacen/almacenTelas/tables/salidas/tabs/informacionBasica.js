import { useFormContext, Controller } from 'react-hook-form';

import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextField from '@mui/material/TextField';
import { Autocomplete } from '@mui/material';

import esLocale from 'date-fns/locale/es';
import { useEffect, useState } from 'react';
import httpClient from 'utils/Api';
import { limitCombo, offsetCombo } from 'constants/constantes';

import TipoSalidaForm from './TipoSalida';
import TipoSalidaOrdenForm from './TipoSalidaOrden';

function InformacionBasica() {
	const methods = useFormContext();

	const { control, formState, getValues, watch } = methods;
	const { errors } = formState;

	const [dataProveedores, setDataUnidades] = useState([]);
	const [existe, setExiste] = useState(false);
	const [proveedorTemporal, setProveedorTemporal] = useState(null);

	const [idNota, setIdNota] = useState(null);
	const getData = getValues();

	const tipoComprobanteValue = watch('tipoComprobante');

	useEffect(() => {
		traerIdNota();
		traerProveedores();
	}, []);

	useEffect(() => {
		if (getData.id) {
			setExiste(true);
			setIdNota(getData.id);
		} else {
			setExiste(false);
		}
	}, [getData]);

	const traerIdNota = async () => {
		const url = `almacen-tela/salida/getUltimoId`;
		const response = await httpClient.get(url);
		const data = await response.data.body;
		if (getData.id) {
			setIdNota(getData.id);
		} else {
			setIdNota(data);
		}
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

	const opciones = dataProveedores.map(proveedor => ({
		...proveedor,
		label: proveedor.tipo === 'N' ? proveedor.nombres : proveedor.razonSocial,
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
		{ id: 1, label: 'Salida Libre', value: 'Salida Libre' },
		{ id: 2, label: 'Salida con Orden de Servicio', value: 'Salida con Orden de Servicio' },
	];

	return (
		<>
			{/* <div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">{`NT-${(idNota + 1)
				.toString()
				.padStart(5, '0')}`}</div>

			<br /> */}

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
								// disabled={existe}
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

				{/* <Controller
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
				/> */}

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

			{/* <div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="nroSerie"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
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
			</div> */}
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
				{(getData.tipoOperacion?.value === 'Salida Libre' ||
					getData.tipoOperacion === 'Salida Libre') && (
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
											traerProveedores(newInputValue);
											setProveedorTemporal({ ...proveedor, label: newInputValue });
										}}
										fullWidth
										onChange={(event, newValue) => {
											if (newValue) {
												const { label, ...valor } = newValue;
												onChange(valor);
												setProveedorTemporal(null);
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

						<TipoSalidaForm />
					</div>
				)}
				{(getData?.tipoOperacion?.value === 'Salida con Orden de Servicio' ||
					getData.tipoOperacion === 'Salida con Orden de Servicio') && (
					<TipoSalidaOrdenForm existe={existe} />
				)}
			</>
		</>
	);
}

export default InformacionBasica;

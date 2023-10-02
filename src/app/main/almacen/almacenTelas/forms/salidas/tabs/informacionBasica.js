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
import { getProduccionesService } from 'app/main/consumos/ordenesCorte/ordenCorte/services';

import TipoSalidaForm from './TipoSalida';
import TipoSalidaOrdenForm from './TipoSalidaOrden';

function InformacionBasica() {
	const methods = useFormContext();

	const { control, formState, getValues, watch, setValue } = methods;
	const { errors } = formState;

	const [opcionesProducciones, setOpcionesProducciones] = useState([]);
	const [dataMuestra, setDataMuestra] = useState([]);
	const [existe, setExiste] = useState(false);
	const [tipoOrdenSalidaTemporal, setTipoOrdenSalidaTemporal] = useState(null);

	const [muestraSearchText, setMuestraSearchText] = useState(null);
	const [produccionesSearchText, setProduccionesSearchText] = useState(null);

	const [idNota, setIdNota] = useState(null);
	const getData = getValues();

	const tipoComprobanteValue = watch('tipoComprobante');
	const tipoOrdenSalida = watch('tipoOrdenSalida');

	useEffect(() => {
		if (getData.id) {
			setIdNota(getData.nNota);
		} else {
			traerIdNota();
		}
	}, []);

	useEffect(() => {
		if (getData.id) {
			setExiste(true);
		} else {
			setExiste(false);
		}
	}, [getData]);

	const traerIdNota = async () => {
		const url = `almacen-tela/salida/generateNota`;
		const response = await httpClient.get(url);
		const data = await response.data.body;
		setIdNota(data.nota);
	};

	const traerMuestra = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `comercial/muestras?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		const opciones = data.map(prod => ({
			...prod,
			label: prod.codigo,
			key: prod.id,
		}));
		setDataMuestra(opciones);
	};

	const debouncedTraerMuestra = debounce(() => {
		traerMuestra(muestraSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerMuestra(); // Llamar a la versión debounced de fetchData
		return debouncedTraerMuestra.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [muestraSearchText]);

	const getProducciones = async busqueda => {
		const data = await getProduccionesService(busqueda);
		const opciones = data.map(produccion => ({
			...produccion,
			label: `${produccion.codigo}`,
			key: produccion.id,
		}));
		setOpcionesProducciones(opciones);
	};

	const debouncedGetProducciones = debounce(() => {
		getProducciones(produccionesSearchText);
	}, 500);

	useEffect(() => {
		debouncedGetProducciones(); // Llamar a la versión debounced de fetchData
		return debouncedGetProducciones.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [produccionesSearchText]);

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
		{ id: 2, label: 'Salida Libre con OP/OM', value: 'Salida Libre con OP/OM' },
		{ id: 3, label: 'Salida con Orden de Servicio', value: 'Salida con Orden de Servicio' },
	];

	useEffect(() => {
		if (tipoOrdenSalida) {
			setValue('ordenProduccion', null);
			setValue('ordenMuestra', null);
			getProducciones();
			traerMuestra();
		}
	}, [tipoOrdenSalida]);

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
					getData.tipoOperacion === 'Salida Libre' ||
					getData.tipoOperacion?.value === 'Salida Libre con OP/OM' ||
					getData.tipoOperacion === 'Salida Libre con OP/OM') && (
					<div>
						{(getData.tipoOperacion?.value === 'Salida Libre con OP/OM' ||
							getData.tipoOperacion === 'Salida Libre con OP/OM') && (
							<>
								<Controller
									name="tipoOrdenSalida"
									control={control}
									render={({ field: { onChange, value } }) => {
										console.log(value);
										const tipoOrdenSalidaValue = value
											? {
													...value,
													label: value.label,
											  }
											: null;
										return (
											<Autocomplete
												className="mt-8 mb-16 mx-12"
												// multiple
												// freeSolo
												isOptionEqualToValue={(op, val) => op.id === val.id}
												options={[
													{ id: 1, label: 'Orden de Producción' },
													{ id: 2, label: 'Orden de Muestra' },
												]}
												value={tipoOrdenSalidaValue}
												filterOptions={(options, state) => {
													return options;
												}}
												onInputChange={(event, newInputValue) => {
													setTipoOrdenSalidaTemporal({
														...tipoOrdenSalidaValue,
														label: newInputValue,
													});
												}}
												fullWidth
												onChange={(event, newValue) => {
													if (newValue) {
														onChange(newValue);
														setTipoOrdenSalidaTemporal(null);
													} else {
														onChange(null);
													}
												}}
												renderInput={params => (
													<TextField
														{...params}
														placeholder="Seleccione el tipo de Orden"
														label="Tipo de Orden"
														error={!!errors.tipoOrden}
														helperText={errors?.tipoOrden?.message}
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
								{tipoOrdenSalida?.id === 1 ? (
									<Controller
										name="ordenProduccion"
										control={control}
										render={({ field: { onChange, value } }) => {
											const op = value
												? {
														...value,
														label: `${value.codigo}`,
														key: value.id,
												  }
												: null;
											return (
												<Autocomplete
													className="mt-8 mb-16 mx-12"
													// multiple
													// freeSolo
													disabled={!tipoOrdenSalida}
													isOptionEqualToValue={(opt, val) => opt.id === val.id}
													options={opcionesProducciones || []}
													value={op}
													filterOptions={(options, state) => {
														return options;
													}}
													onInputChange={(event, newInputValue) => {
														getProducciones(newInputValue);
													}}
													fullWidth
													onChange={(event, newValue) => {
														if (newValue) {
															onChange(newValue);
														} else {
															onChange(null);
														}
													}}
													renderInput={params => (
														<TextField
															{...params}
															placeholder="Seleccione la orden de producción"
															label="Orden de Producción"
															error={!!errors.op}
															helperText={errors?.op?.message}
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
								) : (
									<Controller
										name="ordenMuestra"
										control={control}
										render={({ field: { onChange, value } }) => {
											const muestra = value
												? {
														...value,
														label: value.codigo,
														key: value.id,
												  }
												: null;

											return (
												<Autocomplete
													disabled={!tipoOrdenSalida}
													className="mt-8 mb-16 mx-12"
													// freeSolo
													isOptionEqualToValue={(op, val) => op.id === val.id}
													options={dataMuestra || []}
													value={muestra}
													filterOptions={(options, state) => {
														return options;
													}}
													onInputChange={(event, newInputValue) => {
														traerMuestra(newInputValue);
													}}
													fullWidth
													onChange={(event, newValue) => {
														if (newValue) {
															onChange(newValue);
														} else {
															onChange(null);
														}
													}}
													renderInput={params => (
														<TextField
															{...params}
															placeholder="Seleccione la orden de muestra"
															label="Orden de Muestra"
															error={!!errors.ordenMuestra}
															helperText={errors?.ordenMuestra?.message}
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
							</>
						)}

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

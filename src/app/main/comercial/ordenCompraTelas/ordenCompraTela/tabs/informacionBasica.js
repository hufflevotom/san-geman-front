/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import esLocale from 'date-fns/locale/es';

import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';
import httpClient from 'utils/Api';

import Proveedor from './proveedor';
import ModalTable from './modalTable';
import TipoOrdenCompra from './tipoOrdenCompra';

import Produccion from './produccion';
import Muestra from './muestra';
import Moneda from './moneda';
import FormaPago from './formaPago';
import AgregarTelas from './agregarTelas';
import ProduccionesIgnoradas from './produccionesIgnoradas';

function InformacionBasica({
	routeParams,
	setCodigo,
	getProveedores,
	proveedores,
	currentProveedor,
	setCurrentProveedor,
	resetProveedor,
	disabled,
	currentMoneda,
	setCurrentMoneda,
	resetMoneda,
	getFormaPagos,
	uniqueFormasPago,
	currentFormaPago,
	setCurrentFormaPago,
	resetFormaPago,
	tipo,
	partidas,
	setPartidas,
	produccionesIgnoradas,
	setProduccionesIgnoradas,
}) {
	const methods = useFormContext();

	const [modalOpen, setModalOpen] = useState(false);
	const [dataModal, setDataModal] = useState([]);
	const [dataSeleccionada, setDataSeleccionada] = useState([]);
	const [selectProduccion, setSelectProduccion] = useState(null);
	const [libre, setLibre] = useState(false);

	const { control, formState, getValues } = methods;
	const { errors } = formState;

	const dataForm = getValues();

	const [id, setId] = useState(0);

	const year = new Date().getFullYear();

	useEffect(async () => {
		if (routeParams.id === 'nuevo') {
			const url = `comercial/compra-telas/correlativo/`;
			const response = await httpClient.get(url + year);
			const dataId = await response.data.body;
			setId(dataId);
			setCodigo(`OCT ${year.toString().substring(2, 4)}-${dataId.toString().padStart(5, '0')}`);
		}
	}, []);

	const opcionesTipo = [
		{
			value: 'normal',
			label: 'Compra con Orden de Producción',
		},
		{
			value: 'libre',
			label: 'Compra Libre',
		},
	];

	return (
		<>
			{tipo !== 'nuevo' ? null : (
				<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
					<Controller
						name="tipoOperacion"
						control={control}
						render={({ field: { onChange, value } }) => {
							const ordenCompra = value
								? {
										...value,
										label: value.label ? value.label : value.value ? value.value : value,
								  }
								: {
										value: 'normal',
										label: 'Compra con Orden de Producción',
								  };
							return (
								<Autocomplete
									className="mt-8 mb-16 mx-12"
									// freeSolo
									disabled={tipo !== 'nuevo'}
									isOptionEqualToValue={(op, val) => op.id === val.id}
									options={opcionesTipo}
									value={ordenCompra}
									fullWidth
									onChange={(event, newValue) => {
										if (newValue) {
											setLibre(newValue.value === 'libre');
											onChange(newValue);
										} else {
											onChange(null);
										}
									}}
									renderInput={params => (
										<TextField
											{...params}
											placeholder="Seleccione el Tipo"
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
				</div>
			)}
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="codigo"
					control={control}
					render={({ field: { value } }) => {
						let val = `OCT ${year.toString().substring(2, 4)}-${id.toString().padStart(5, '0')}`;
						if (value) {
							val = value;
						}
						return (
							<TextField
								className="mt-8 mb-16 mx-12"
								error={!!errors.codigo}
								required
								disabled
								value={val}
								helperText={errors?.codigo?.message}
								label="Codigo"
								autoFocus
								id="codigo"
								variant="outlined"
								fullWidth
							/>
						);
					}}
				/>
				<TipoOrdenCompra tipo={tipo} />
				<Controller
					name="fechaEntrega"
					control={control}
					render={({ field: { onChange, value } }) => (
						<LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
							<DatePicker
								label="Fecha de Entrega"
								id="fechaEntrega"
								variant="outlined"
								openTo="month"
								views={['year', 'month', 'day']}
								// inputFormat="dd/MM/yyyy"
								value={value}
								onChange={newValue => {
									onChange(newValue);
								}}
								maxDate={
									selectProduccion
										? selectProduccion?.fechaDespacho
											? new Date(selectProduccion.fechaDespacho)
											: new Date()
										: null
								}
								disabled={tipo !== 'nuevo'}
								renderInput={params => (
									<TextField
										{...params}
										className="mt-8 mb-16 mx-12"
										fullWidth
										error={!!errors.fechaEntrega}
										helperText={errors?.fechaEntrega?.message}
									/>
								)}
							/>
						</LocalizationProvider>
					)}
				/>
			</div>

			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Proveedor
					getProveedores={getProveedores}
					proveedores={proveedores}
					currentProveedor={currentProveedor}
					setCurrentProveedor={setCurrentProveedor}
					resetProveedor={resetProveedor}
					disabled={disabled}
					tipo={tipo}
				/>
				<Moneda
					currentMoneda={currentMoneda}
					setCurrentMoneda={setCurrentMoneda}
					resetMoneda={resetMoneda}
					currentProveedor={currentProveedor}
					disabled={disabled}
					tipo={tipo}
				/>
				<FormaPago
					getFormaPagos={getFormaPagos}
					uniqueFormasPago={uniqueFormasPago}
					currentFormaPago={currentFormaPago}
					setCurrentFormaPago={setCurrentFormaPago}
					resetFormaPago={resetFormaPago}
					currentProveedor={currentProveedor}
					disabled={disabled}
					tipo={tipo}
				/>
			</div>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="observaciones"
					control={control}
					render={({ field }) => {
						return (
							<TextField
								{...field}
								className="mt-8 mb-16 mx-12"
								error={!!errors.observaciones}
								helperText={errors?.observaciones?.message}
								label="Observaciones"
								autoFocus
								id="observaciones"
								variant="outlined"
								fullWidth
							/>
						);
					}}
				/>
			</div>

			{(dataForm.tipo?.value === 'PRODUCCION' || dataForm?.tipo === 'PRODUCCION') && (
				<Produccion
					currentProveedor={currentProveedor}
					control={control}
					dataSeleccionada={dataSeleccionada}
					setModalOpen={setModalOpen}
					setDataModal={setDataModal}
					errors={errors}
					currentMoneda={currentMoneda}
					setSelectProduccion={setSelectProduccion}
					libre={libre}
				/>
			)}

			{(dataForm.tipo?.value === 'MUESTRA' || dataForm?.tipo === 'MUESTRA') && (
				<Muestra
					control={control}
					dataSeleccionada={dataSeleccionada}
					setModalOpen={setModalOpen}
					setDataModal={setDataModal}
					errors={errors}
					currentMoneda={currentMoneda}
					libre={libre}
				/>
			)}

			{produccionesIgnoradas.length > 0 ? (
				<ProduccionesIgnoradas partidas={partidas} produccionesIgnoradas={produccionesIgnoradas} />
			) : null}

			{libre ? <AgregarTelas currentMoneda={currentMoneda} /> : null}

			{modalOpen && (
				<ModalTable
					modalOpen={modalOpen}
					setModalOpen={setModalOpen}
					data={dataModal}
					setDataSeleccionada={setDataSeleccionada}
					partidas={partidas}
					setPartidas={setPartidas}
					setProduccionesIgnoradas={setProduccionesIgnoradas}
				/>
			)}
		</>
	);
}

export default InformacionBasica;

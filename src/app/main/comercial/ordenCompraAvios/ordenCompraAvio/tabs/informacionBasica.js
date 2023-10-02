/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Autocomplete } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import esLocale from 'date-fns/locale/es';

import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';
import httpClient from 'utils/Api';

import Proveedor from './proveedor';
import MetodoPago from './metodoPago';
import Produccion from './produccion';
import ModalTableAvio from './modalTable';
import AgregarAvios from './agregarAvios';

function InformacionBasica({ tipo, setCodigo }) {
	const methods = useFormContext();
	const ordenCompraAvio = useSelector(({ comercial }) => comercial.ordenCompraAvio);
	const [modalOpen, setModalOpen] = useState(false);
	const [dataModal, setDataModal] = useState([]);
	const [dataSeleccionada, setDataSeleccionada] = useState([]);
	const [selectProduccion, setSelectProduccion] = useState(null);
	const [libre, setLibre] = useState(false);

	const { control, formState, getValues, watch } = methods;
	const { errors } = formState;

	const dataForm = getValues();

	const opcionesCurrency = [
		{
			value: 'SOLES',
			label: 'SOLES',
		},
		{
			value: 'DOLARES',
			label: 'DOLARES',
		},
	];

	const [id, setId] = useState(0);

	const year = new Date().getFullYear();

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

	useEffect(async () => {
		if (tipo === 'nuevo') {
			const url = `comercial/compra-avios/correlativo/`;
			const response = await httpClient.get(url + year);
			const dataId = await response.data.body;
			setId(dataId);
			setCodigo(`OCA ${year.toString().substring(2, 4)}-${dataId.toString().padStart(5, '0')}`);
		} else {
			setId(tipo);
			setCodigo(ordenCompraAvio.codigo);
		}
	}, []);

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
						let val = `OCA ${year.toString().substring(2, 4)}-${id.toString().padStart(5, '0')}`;
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
								id="codigo"
								variant="outlined"
								fullWidth
							/>
						);
					}}
				/>
				{/* <Controller
					name="fechaEmision"
					control={control}
					render={({ field: { onChange, value } }) => (
						<LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
							<DatePicker
								// disabled
								label="Fecha de Emisión"
								id="fechaEmision"
								variant="outlined"
								openTo="month"
								views={['year', 'month', 'day']}
								// inputFormat="dd/MM/yyyy"
								// value={new Date()}
								value={value}
								onChange={newValue => {
									onChange(newValue);
								}}
								renderInput={params => (
									<TextField
										{...params}
										className="mt-8 mb-16 mx-12"
										fullWidth
										error={!!errors.fechaEmision}
										helperText={errors?.fechaEmision?.message}
									/>
								)}
							/>
						</LocalizationProvider>
					)}
				/> */}
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
										? selectProduccion.fechaDespacho
											? new Date(selectProduccion.fechaDespacho)
											: new Date()
										: null
								}
								// disabled={!selectProduccion}
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
				<Proveedor />
				<Controller
					name="moneda"
					control={control}
					render={({ field: { onChange, value } }) => {
						const data = value
							? {
									...value,
									label: value.value ? value.value : value,
									// label: opcionesCurrency.find(e => e.value === value).label,
							  }
							: null;

						return (
							<Autocomplete
								className="mt-8 mb-16 mx-12"
								// freeSolo
								isOptionEqualToValue={(op, val) => op.id === val.id}
								options={opcionesCurrency}
								value={data}
								fullWidth
								onChange={(event, newValue) => {
									if (newValue) {
										const { label, ...valor } = newValue;
										onChange(valor.value);
									} else {
										onChange(null);
									}
								}}
								renderInput={params => (
									<TextField
										{...params}
										placeholder="Seleccione el tipo de moneda"
										label="Moneda"
										error={!!errors.moneda}
										helperText={errors?.moneda?.message}
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
				<MetodoPago />
			</div>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="lugarEntrega"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.lugarEntrega}
							required
							helperText={errors?.lugarEntrega?.message}
							label="Lugar de entrega"
							id="lugarEntrega"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="observacion"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-12"
							error={!!errors.observacion}
							// required
							helperText={errors?.observacion?.message}
							label="Observaciones"
							id="observacion"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<Produccion
				control={control}
				dataSeleccionada={dataSeleccionada}
				setSelectProduccion={setSelectProduccion}
				setModalOpen={setModalOpen}
				setDataModal={setDataModal}
				errors={errors}
				libre={libre}
			/>

			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4" style={{ display: 'none' }}>
				<Controller
					name="fechaEmision"
					control={control}
					render={({ field: { onChange, value } }) => (
						<LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
							<DatePicker
								label="Fecha de Emisión"
								id="fechaEmision"
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
										error={!!errors.fechaEmision}
										helperText={errors?.fechaEmision?.message}
									/>
								)}
							/>
						</LocalizationProvider>
					)}
				/>

				<Controller
					name="fechaAnulacion"
					control={control}
					render={({ field: { onChange, value } }) => (
						<LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
							<DatePicker
								label="Fecha de Anulación"
								id="fechaAnulacion"
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
										error={!!errors.fechaAnulacion}
										helperText={errors?.fechaAnulacion?.message}
									/>
								)}
							/>
						</LocalizationProvider>
					)}
				/>
			</div>

			{libre ? <AgregarAvios /> : null}

			{modalOpen && (
				<ModalTableAvio
					modalOpen={modalOpen}
					setModalOpen={setModalOpen}
					data={dataModal}
					setDataSeleccionada={setDataSeleccionada}
				/>
			)}
		</>
	);
}

export default InformacionBasica;

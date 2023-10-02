/* eslint-disable array-callback-return */
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Autocomplete, TextField } from '@mui/material';

import { limitCombo, offsetCombo } from 'constants/constantes';
import httpClient from 'utils/Api';
import TablaSalida from './TablaSalida/TablaSalida';
import ModalTable from './modalTable';

const TipoSalidaOrdenForm = ({ existe }) => {
	const methods = useFormContext();

	const [modalOpen, setModalOpen] = useState(false);
	const [dataModal, setDataModal] = useState([]);
	const [dataSeleccionada, setDataSeleccionada] = useState([]);

	const [dataOrdenServicioCorte, setDataOrdenServicioCorte] = useState([]);

	const { control, formState, getValues } = methods;
	const { errors } = formState;

	useEffect(() => {
		traerOrdenDeServicioCorte();
	}, []);

	const traerOrdenDeServicioCorte = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `logistica/orden-servicio-corte?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataOrdenServicioCorte(data);
	};

	const opciones = dataOrdenServicioCorte.map(prod => ({
		...prod,
		label: prod.codigo,
	}));

	const getData = getValues();
	const [dataKTM, setDataKTM] = useState([]);
	const [arrayRep, setArrayRep] = useState([]);

	useEffect(() => {
		if (getData?.detalleTabla?.length) {
			getData?.detalleTabla.map(detalle => {
				setDataKTM(d => [...d, detalle]);
			});
		}
	}, []);

	useEffect(() => {
		if (dataKTM.length > 0) {
			const filteredArray = dataKTM.filter((ele, pos) => dataKTM.indexOf(ele) === pos);
			setArrayRep(filteredArray);
		}
	}, [dataKTM]);

	return (
		<>
			<Controller
				name="ordenServicioCorte"
				control={control}
				render={({ field: { onChange, value } }) => {
					let data;
					const ordenServicioCorte = value
						? {
								...value,
								label: value.codigo,
						  }
						: null;

					if (dataSeleccionada.length > 0) {
						data = <TablaSalida dataSeleccionada={dataSeleccionada} />;
					}

					if (getData?.detallesProductosSalidasAlmacenesTelas?.length > 0) {
						data = <TablaSalida dataSeleccionada={arrayRep} />;
					}

					return (
						<>
							<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
								<Autocomplete
									// disabled={ordenServicioCorte?.detalleOrdenComprasTelas?.length > 0}
									disabled={existe}
									className="mt-8 mb-16 mx-12"
									// freeSolo
									isOptionEqualToValue={(op, val) => op.id === val.id}
									options={opciones || []}
									value={ordenServicioCorte}
									filterOptions={(options, state) => {
										return options;
									}}
									onInputChange={(event, newInputValue) => {
										traerOrdenDeServicioCorte(newInputValue);
									}}
									fullWidth
									onChange={(event, newValue) => {
										if (newValue) {
											const { label, ...valor } = newValue;
											onChange(valor);

											setModalOpen(true);
											setDataModal(valor);
										} else {
											onChange(null);
											setModalOpen(false);
										}
									}}
									renderInput={params => (
										<TextField
											{...params}
											placeholder="Seleccione la orden de servicio de corte"
											label="Orden de Servicio de Corte"
											error={!!errors.ordenCompra}
											helperText={errors?.ordenCompra?.message}
											variant="outlined"
											fullWidth
											InputLabelProps={{
												shrink: true,
											}}
										/>
									)}
								/>
							</div>

							<div className="sm:flex-row mr-24 sm:mr-4">{data}</div>
						</>
					);
				}}
			/>

			{modalOpen && (
				<ModalTable
					modalOpen={modalOpen}
					setModalOpen={setModalOpen}
					data={dataModal}
					setDataSeleccionada={setDataSeleccionada}
				/>
			)}
		</>
	);
};

export default TipoSalidaOrdenForm;

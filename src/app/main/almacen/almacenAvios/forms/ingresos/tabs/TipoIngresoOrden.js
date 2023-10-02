import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Autocomplete, TextField } from '@mui/material';

import { limitCombo, offsetCombo } from 'constants/constantes';
import httpClient from 'utils/Api';
import TablaIngreso from './TablaIngreso/TablaIngreso';
import ModalTable from './modalTable';

const TipoIngresoOrdenForm = ({ existe }) => {
	const methods = useFormContext();

	const [modalOpen, setModalOpen] = useState(false);
	const [dataModal, setDataModal] = useState([]);
	const [dataSeleccionada, setDataSeleccionada] = useState([]);

	const [ordeCompraTemporal, setOrdenCompraTemporal] = useState(null);
	const [dataOrdenCompraAvios, setDataOrdenCompraAvios] = useState([]);

	const { control, formState, getValues } = methods;
	const { errors } = formState;

	useEffect(() => {
		traerOrdenDeComprasAvios();
	}, []);

	const traerOrdenDeComprasAvios = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `comercial/compra-avios?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataOrdenCompraAvios(data);
	};

	const opciones = dataOrdenCompraAvios.map(prod => ({
		...prod,
		label: prod.codigo,
	}));

	const getData = getValues();
	const [dataKTM, setDataKTM] = useState([]);
	const [arrayRep, setArrayRep] = useState([]);
	console.log('DETALEEE GET 1: ', getData);

	useEffect(() => {
		let data;
		if (getData?.detallesProductosIngresosAlmacenesAvios?.length) {
			// eslint-disable-next-line array-callback-return
			getData?.ordenCompra?.detalleOrdenComprasAvios?.map(detalle => {
				// eslint-disable-next-line array-callback-return
				getData?.detallesProductosIngresosAlmacenesAvios.map(detalleIngreso => {
					if (detalle.producto.avio.id === detalleIngreso.producto.avio.id) {
						console.log('PASÓ', detalle);
						console.log('PASÓ', detalleIngreso);
						detalleIngreso.cantidad = detalle.cantidad;
						// detalleIngreso.numeroPartida = detalleIngreso.producto.partida;
						detalleIngreso.nuevaCantidadPrincipal = detalleIngreso.cantidadPrincipal;
						detalleIngreso.nuevaCantidadSecundaria = detalleIngreso.cantidadSecundaria;
						// detalleIngreso.cantidadRollo = detalleIngreso.cantidadRollos;

						// guardar el array DetalleIngreso en el state
						// eslint-disable-next-line no-shadow
						setDataKTM(dataKTM => [...dataKTM, detalleIngreso]);
					}
				});
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
			<>
				<Controller
					name="ordenCompra"
					control={control}
					render={({ field: { onChange, value } }) => {
						let data;
						const ordenCompra = value
							? {
									...value,
									label: value.codigo,
							  }
							: null;

						console.log('Orden compra seleccionada: ', ordenCompra);

						if (dataSeleccionada.length > 0) {
							data = <TablaIngreso dataSeleccionada={dataSeleccionada} />;
						}

						if (getData?.detallesProductosIngresosAlmacenesAvios?.length > 0) {
							data = <TablaIngreso dataSeleccionada={arrayRep} />;
						}

						return (
							<>
								<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
									<Autocomplete
										// disabled={ordenCompra?.detalleOrdenComprasAvios?.length > 0}
										disabled={existe}
										className="mt-8 mb-16 mx-12"
										// freeSolo
										isOptionEqualToValue={(op, val) => op.id === val.id}
										options={opciones || []}
										value={ordenCompra}
										filterOptions={(options, state) => {
											return options;
										}}
										onInputChange={(event, newInputValue) => {
											traerOrdenDeComprasAvios(newInputValue);
											setOrdenCompraTemporal({ ...ordenCompra, label: newInputValue });
										}}
										fullWidth
										onChange={(event, newValue) => {
											if (newValue) {
												const { label, ...valor } = newValue;
												onChange(valor);
												setOrdenCompraTemporal(null);
												// ///////////////////
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
												placeholder="Seleccione el orden de compra de avios"
												label="Orden de Compra Avios"
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

								{/* // {ordenCompra?.detalleOrdenComprasAvios?.length > 0 && (
							// 	<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
							// 		<TextField
							// 			className="mt-8 mb-16 mx-12"
							// 			disabled
							// 			// value={getData.ordenCompra?.proveedor.razonSocial}
							// 			value={
							// 				// eslint-disable-next-line no-nested-ternary
							// 				getData.ordenCompra?.proveedor.tipo === 'J'
							// 					? `${getData.ordenCompra?.proveedor.ruc}  - ${getData.ordenCompra?.proveedor.razonSocial} `
							// 					: `${getData.ordenCompra?.proveedor.ruc}  - ${getData.ordenCompra?.proveedor.apellidoPaterno} ${getData.ordenCompra?.proveedor.apellidoMaterno} ${getData.ordenCompra?.proveedor.nombres}`
							// 			}
							// 			label="Proveedor"
							// 			variant="outlined"
							// 			fullWidth
							// 			InputLabelProps={{
							// 				shrink: true,
							// 			}}
							// 		/>

							// 		<TextField
							// 			className="mt-8 mb-16 mx-12"
							// 			disabled
							// 			// value={getData.ordenCompra?.produccion.cliente.razónSocial}
							// 			value={
							// 				// eslint-disable-next-line no-nested-ternary
							// 				getData.ordenCompra?.produccion.cliente.tipoCliente === 'N'
							// 					? getData.ordenCompra?.produccion.cliente.tipo === 'J'
							// 						? `${getData.ordenCompra?.produccion.cliente.ruc} - ${getData.ordenCompra?.produccion.cliente.razónSocial}`
							// 						: `${getData.ordenCompra?.produccion.cliente.natNroDocumento} - ${getData.ordenCompra?.produccion.cliente.natNombres} ${getData.ordenCompra?.produccion.cliente.natApellidoPaterno}`
							// 					: `${getData.ordenCompra?.produccion.cliente.natNroDocumento} - ${getData.ordenCompra?.produccion.cliente.razónSocial}`
							// 			}
							// 			label="Cliente"
							// 			variant="outlined"
							// 			fullWidth
							// 			InputLabelProps={{
							// 				shrink: true,
							// 			}}
							// 		/>
							// 	</div>
							// )} */}

								<div className="sm:flex-row mr-24 sm:mr-4">{data}</div>
							</>
						);
					}}
				/>

				{/* <Controller
					name="produccion"
					control={control}
					render={({ field: { onChange, value } }) => {
						console.log('VALORRRRRRRRRRRRR 1: ', value);
						console.log('VALORRRRRRRRRRRRR 2 : ', ordenCompraRedux);

						let data;
						const produccion = value
							? {
									...value,
									label: value.codigo,
							  }
							: null;

						if (dataSeleccionada.length > 0) {
							data = <ProduccionTable dataSeleccionada={dataSeleccionada} />;
						}

						if (ordenCompraRedux?.detalleOrdenComprasAvios?.length > 0) {
							data = <ProduccionTable />;
						}

						return (
							<>
								<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
									<Autocomplete
										disabled={ordenCompraRedux?.detalleOrdenComprasAvios?.length > 0}
										className="mt-8 mb-16 mx-12"
										freeSolo
										isOptionEqualToValue={(op, val) => op.id === val.id}
										options={opciones || []}
										value={produccionTemporal || produccion}
										filterOptions={(options, state) => {
											return options;
										}}
										onInputChange={(event, newInputValue) => {
											traerOrdenDeComprasAvios(newInputValue);
											setProduccionTemporal({ ...produccion, label: newInputValue });
										}}
										fullWidth
										onChange={(event, newValue) => {
											if (newValue) {
												const { label, ...valor } = newValue;
												onChange(valor);
												setProduccionTemporal(null);
												/// //////////////////////////////////////////
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
												placeholder="Seleccione la producción"
												label="Producción"
												error={!!errors.produccionId}
												helperText={errors?.produccionId?.message}
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
				/> */}
			</>

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

export default TipoIngresoOrdenForm;

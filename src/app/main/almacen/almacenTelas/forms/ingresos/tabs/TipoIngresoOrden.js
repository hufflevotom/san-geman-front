import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Autocomplete, TextField } from '@mui/material';

import { limitCombo, offsetCombo } from 'constants/constantes';
import { useSelector } from 'react-redux';
import httpClient from 'utils/Api';
import ProduccionTable from 'app/main/comercial/ordenCompraTelas/ordenCompraTela/tabs/produccionTable';
import TablaIngreso from './TablaIngreso/TablaIngreso';
import ModalTable from './modalTable';

const TipoIngresoOrdenForm = ({ existe }) => {
	const methods = useFormContext();

	const [modalOpen, setModalOpen] = useState(false);
	const [dataModal, setDataModal] = useState([]);
	const [dataSeleccionada, setDataSeleccionada] = useState([]);

	const [ordeCompraTemporal, setOrdenCompraTemporal] = useState(null);
	const [dataOrdenCompraTelas, setDataOrdenCompraTelas] = useState([]);

	const { control, formState, getValues } = methods;
	const { errors } = formState;

	useEffect(() => {
		traerOrdenDeComprasTelas();
	}, []);

	const traerOrdenDeComprasTelas = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `comercial/compra-telas?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataOrdenCompraTelas(data);
	};

	const opciones = dataOrdenCompraTelas.map(prod => ({
		...prod,
		label: prod.codigo,
	}));

	const getData = getValues();
	const [dataKTM, setDataKTM] = useState([]);
	const [arrayRep, setArrayRep] = useState([]);
	console.log('DETALEEE GET 1: ', getData);

	useEffect(() => {
		let data;
		if (getData?.detallesProductosIngresosAlmacenesTelas?.length) {
			// eslint-disable-next-line array-callback-return
			getData?.ordenCompra?.detalleOrdenComprasTelas?.map(detalle => {
				// eslint-disable-next-line array-callback-return
				getData?.detallesProductosIngresosAlmacenesTelas.map(detalleIngreso => {
					if (detalle.producto.tela.id === detalleIngreso.producto.tela.id) {
						console.log('PASÓ', detalle);
						console.log('PASÓ', detalleIngreso);
						detalleIngreso.cantidad = detalle.cantidad;
						detalleIngreso.numeroPartida = detalleIngreso.producto.partida;
						detalleIngreso.nuevaCantidadKg = detalleIngreso.cantidadKilos;
						detalleIngreso.nuevaCantidadMts = detalleIngreso.cantidadMetros;
						detalleIngreso.cantidadRollo = detalleIngreso.cantidadRollos;
						detalleIngreso.clasificacion = { id: 1, label: 'Tela OK' };
						// guardar el array DetalleIngreso en el state
						setDataKTM(KTM => [...KTM, detalleIngreso]);
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

						if (getData?.detallesProductosIngresosAlmacenesTelas?.length > 0) {
							data = <TablaIngreso dataSeleccionada={arrayRep} />;
						}

						return (
							<>
								<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
									<Autocomplete
										// disabled={ordenCompra?.detalleOrdenComprasTelas?.length > 0}
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
											traerOrdenDeComprasTelas(newInputValue);
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
												placeholder="Seleccione el orden de compra de telas"
												label="Orden de Compra Telas"
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

								{/* // {ordenCompra?.detalleOrdenComprasTelas?.length > 0 && (
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

						if (ordenCompraRedux?.detalleOrdenComprasTelas?.length > 0) {
							data = <ProduccionTable />;
						}

						return (
							<>
								<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
									<Autocomplete
										disabled={ordenCompraRedux?.detalleOrdenComprasTelas?.length > 0}
										className="mt-8 mb-16 mx-12"
										freeSolo
										isOptionEqualToValue={(op, val) => op.id === val.id}
										options={opciones || []}
										value={produccionTemporal || produccion}
										filterOptions={(options, state) => {
											return options;
										}}
										onInputChange={(event, newInputValue) => {
											traerOrdenDeComprasTelas(newInputValue);
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

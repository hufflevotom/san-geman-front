/* eslint-disable func-names */
import { Autocomplete, LinearProgress, TextField } from '@mui/material';
import { Box } from '@mui/system';
import debounce from 'lodash.debounce';
import { limitCombo, offsetCombo } from 'constants/constantes';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import httpClient from 'utils/Api';
import ResumenAvios from './resumenAvios';
import TablaPedido from './tablaPedido';

const TabPedidos = () => {
	const methods = useFormContext();
	const { control, formState, getValues, setValue } = methods;
	const { errors } = formState;

	const { cliente } = getValues();
	const [dataPedidos, setDataPedidos] = useState([]);

	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);

	const [pedidoSearchText, setPedidoSearchText] = useState('');

	const routeParams = useParams();

	useEffect(() => {
		if (cliente) {
			getPedidos('', cliente.id);
		}
	}, [cliente]);

	const getPedidos = async (busqueda, id) => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `comercial/pedidos/cliente/${id}?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;
		const response = await httpClient.get(url);
		const body = await response.data.body[0];
		setDataPedidos(body);
	};

	const debouncedGetPedido = debounce(() => {
		if (cliente?.id) getPedidos(pedidoSearchText, cliente.id);
	}, 500);

	useEffect(() => {
		debouncedGetPedido(); // Llamar a la versión debounced de fetchData
		return debouncedGetPedido.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [pedidoSearchText, cliente]);

	const opcionesPedidos = dataPedidos.map(pedido => ({
		...pedido,
		label: pedido.po,
	}));

	const dataRedux = useSelector(state => state.comercial.produccion);

	useEffect(() => {
		if (dataRedux?.pedidos) {
			setData(dataRedux?.pedidos);
		}
	}, [dataRedux]);

	return (
		<>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="dataEstilos"
					control={control}
					render={({ field: { onChange, value } }) => {
						const pedidos = value
							? value.map(pedido => ({
									...pedido,
									label: pedido.po,
							  }))
							: [];

						return (
							<>
								<Autocomplete
									disabled={!cliente || routeParams.id !== 'nuevo'}
									className="mt-8 mb-16 mx-12"
									multiple
									freeSolo
									isOptionEqualToValue={(op, val) => op.id === val.id}
									options={pedidos.length === 0 ? opcionesPedidos : []}
									value={cliente ? pedidos : []}
									fullWidth
									filterOptions={(options, state) => {
										return options;
									}}
									onInputChange={(event, newInputValue) => {
										setPedidoSearchText(newInputValue, cliente.id);
									}}
									onChange={async (event, newValue) => {
										onChange(newValue);
										if (newValue) {
											setLoading(true);
											const valueLength = newValue.length;
											if (newValue.length > data.length) {
												const response = await httpClient.get(
													`comercial/pedidos/${newValue[valueLength - 1].id}`
												);

												const res = await response.data.body;

												setData([...data, res]);

												setValue('respEstiloPedido', [...data, res]);
											} else if (newValue.length < data.length) {
												// Eliminar el ultimo registro de la data
												setData(data.slice(0, valueLength));
											}
										}
										setLoading(false);
									}}
									renderInput={params => (
										<TextField
											{...params}
											placeholder={pedidos.length === 0 ? 'Seleccione los Pedidos' : ''}
											label="Pedidos"
											required
											helperText={
												// eslint-disable-next-line no-nested-ternary
												!cliente
													? 'Selecciona un cliente y luego los pedidos'
													: !opcionesPedidos.length && !pedidos.length
													? 'No hay pedidos para este cliente'
													: 'Selecciona los pedidos'
											}
											error={!!errors.pedidos}
											// helperText={errors?.pedidos?.message}
											variant="outlined"
											InputLabelProps={{
												shrink: true,
											}}
											fullWidth
										/>
									)}
								/>
							</>
						);
					}}
				/>
			</div>

			{loading ? (
				<div
					className="flex flex-col sm:flex-row mr-24 sm:mr-4"
					style={{ justifyContent: 'center' }}
				>
					<Box sx={{ width: '100%' }} className="mt-8 mb-16 mx-12">
						<LinearProgress />
					</Box>
				</div>
			) : (
				data?.map((val, index) => {
					const qty = val.cantidades
						.filter(cantidad => cantidad.cantidad > 0)
						.map(cantidad => cantidad.color.id);
					return (
						<div key={index} style={{ marginBottom: '40px' }}>
							<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">{val.po}</div>
							{val.estilos
								.sort(function (a, b) {
									if (a.estilo.toLowerCase() < b.estilo.toLowerCase()) {
										return -1;
									}
									if (a.estilo.toLowerCase() > b.estilo.toLowerCase()) {
										return 1;
									}
									return 0;
								})
								.map((estilo, i) => {
									estilo.telasEstilos.forEach(t => {
										const colores = [];
										t.colores.forEach(c => {
											if (qty.includes(c.id)) colores.push(c);
										});
										t.colores = colores.sort(function (a, b) {
											if (a.descripcion.toLowerCase() < b.descripcion.toLowerCase()) {
												return -1;
											}
											if (a.descripcion.toLowerCase() > b.descripcion.toLowerCase()) {
												return 1;
											}
											return 0;
										});
									});
									return <TablaPedido key={i} estilo={estilo} valueDataEstilo={val} />;
								})}
							{val.resumenAvios && (
								<ResumenAvios
									avios={val.resumenAvios.sort(function (a, b) {
										if (a.avios?.nombre.toLowerCase() < b.avios?.nombre.toLowerCase()) {
											return -1;
										}
										if (a.avios?.nombre.toLowerCase() > b.avios?.nombre.toLowerCase()) {
											return 1;
										}
										return 0;
									})}
								/>
							)}
						</div>
					);
				})
			)}
		</>
	);
};

export default TabPedidos;

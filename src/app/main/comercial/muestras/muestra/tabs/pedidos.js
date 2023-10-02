import { Autocomplete, LinearProgress, TextField } from '@mui/material';
import { Box } from '@mui/system';
import debounce from 'lodash.debounce';
import { limitCombo, offsetCombo } from 'constants/constantes';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import httpClient from 'utils/Api';
import TablaPedido from './tablaPedido';

const TabPedidos = () => {
	const methods = useFormContext();
	const { control, formState, getValues } = methods;
	const { errors } = formState;

	const { cliente } = getValues();
	const [dataPedidos, setDataPedidos] = useState([]);

	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);

	const [pedidoSearchText, setPedidoSearchText] = useState('');

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

	const debouncedGetPedidos = debounce(() => {
		getPedidos(pedidoSearchText, cliente.id);
	}, 500);

	useEffect(() => {
		debouncedGetPedidos(); // Llamar a la versión debounced de fetchData
		return debouncedGetPedidos.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [pedidoSearchText]);

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
									disabled={!cliente}
									className="mt-8 mb-16 mx-12"
									multiple
									freeSolo
									isOptionEqualToValue={(op, val) => op.id === val.id}
									options={opcionesPedidos}
									value={cliente ? pedidos : []}
									fullWidth
									filterOptions={(options, state) => {
										return options;
									}}
									onInputChange={(event, newInputValue) => {
										pedidoSearchText(newInputValue);
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
											placeholder="Seleccione los Pedidos"
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
					return (
						<div key={index} style={{ marginBottom: '40px' }}>
							<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">{val.po}</div>
							{val.estilos.map((estilo, i) => {
								return <TablaPedido key={i} estilo={estilo} valueDataEstilo={val} />;
							})}
						</div>
					);
				})
			)}
		</>
	);
};

export default TabPedidos;

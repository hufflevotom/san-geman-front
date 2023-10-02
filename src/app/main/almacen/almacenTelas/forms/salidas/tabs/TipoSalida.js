import { Controller, useFormContext } from 'react-hook-form';
import FuseUtils from '@fuse/utils';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce';

const { Autocomplete, TextField, IconButton, InputAdornment } = require('@mui/material');
const { limitCombo, offsetCombo } = require('constants/constantes');
const { useState, useEffect } = require('react');
const { default: httpClient } = require('utils/Api');

const TipoSalidaForm = () => {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	return (
		<div key={FuseUtils.generateGUID()}>
			<hr />
			<div className="mx-6 mb-16 mt-16 text-base">Tela</div>
			<Controller
				name="telasComplemento"
				control={control}
				render={({ field: { onChange, value } }) => {
					let val = [];

					if (value) {
						val = value.map(alt => {
							return (
								<FormData
									key={alt.id}
									errors={errors}
									data={alt}
									onChange={onChange}
									valInicial={value}
								/>
							);
						});
					}

					val.push(
						<div key={FuseUtils.generateGUID()}>
							<IconButton
								className="w-full h-fit py-14 flex items-center justify-center rounded-8 overflow-hidden cursor-pointer shadow hover:shadow-md"
								aria-label="add"
								size="medium"
								style={{
									height: '46px',
									marginLeft: '20px',
									marginRight: '40px',
									// backgroundColor: '#ccf0df',
									backgroundColor: 'rgb(2 136 209)',
								}}
								// color="primary"
								onClick={() => {
									onChange(
										value
											? [
													...value,
													{
														id: FuseUtils.generateGUID(),
														productoTela: null,
														cantidad: '',
														cantidadRollo: '',
														cantidadRolloRestante: '',
													},
											  ]
											: [
													{
														id: FuseUtils.generateGUID(),
														productoTela: null,
														cantidad: '',
														cantidadRollo: '',
														cantidadRolloRestante: '',
													},
											  ]
									);
								}}
							>
								<h5 style={{ color: 'white', fontWeight: 'bold' }}>Agregar Tela</h5>
								&nbsp;
								<AddCircleOutlineIcon style={{ fontSize: '30px', color: 'white' }} />
							</IconButton>
						</div>
					);
					return val;
				}}
			/>
		</div>
	);
};

const FormData = props => {
	const { data, valInicial, onChange } = props;

	const [stock, setStock] = useState(data.stock || 0);
	const [productoTelaTemporal, setProductoTelaTemporal] = useState(null);
	const [productoPartidaTemporal, setProductoPartidaTemporal] = useState(null);

	const [productoTelaSearchText, setProductoTelaSearchText] = useState('');
	const [productosPartidaSearchText, setProductosPartidaSearchText] = useState('');
	const [stockSearchText, setStockSearchText] = useState(null);

	const [dataProductosTelas, setDataProductosTelas] = useState([]);
	const [dataProductos, setDataProductos] = useState([]);

	const [cantidad, setCantidad] = useState(data.cantidad);
	const [cantRollos, setcantRollos] = useState(data.cantidadRollo);
	const [cantRollosRestantes, setcantRollosRestantes] = useState(data.cantidadRolloRestante);

	useEffect(() => {
		traerProductosTela();
	}, []);

	const traerProductosTela = async busqueda => {
		let texto = '';
		if (busqueda) {
			texto = busqueda;
		}
		const url = `producto-tela/productos/partida?limit=${30}&offset=${0}&busqueda=${texto}`;

		const response = await httpClient.get(url);
		const dataResponse = await response.data.body.filter(x => x !== '');
		setDataProductosTelas(dataResponse);
	};

	const debouncedTraerProductosTela = debounce(() => {
		traerProductosTela(productoTelaSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerProductosTela(); // Llamar a la versión debounced de fetchData
		return debouncedTraerProductosTela.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [productoTelaSearchText]);

	const traerProductosPartida = async busqueda => {
		let texto = '';
		if (busqueda) {
			texto = busqueda;
		}
		const url = `producto-tela/productos/byPartida/${texto}`;

		const response = await httpClient.get(url);
		const dataResponse = await response.data.body[0];
		setDataProductos(dataResponse);
	};

	const debouncedTraerProductosPartida = debounce(() => {
		traerProductosPartida(productosPartidaSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerProductosPartida(); // Llamar a la versión debounced de fetchData
		return debouncedTraerProductosPartida.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [productosPartidaSearchText]);

	const traerStock = async telaProducto => {
		if (telaProducto) {
			const url = `almacen-tela/kardex/kardexTela/${telaProducto.id}`;
			const response = await httpClient.get(url);
			const dataResponse = await response.data.body;
			setStock(parseFloat(dataResponse.cantidad));
		}
	};

	const debouncedTraerStock = debounce(() => {
		traerStock(stockSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerStock(); // Llamar a la versión debounced de fetchData
		return debouncedTraerStock.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [stockSearchText]);

	const opcionesProductosPartidas = [];
	(dataProductosTelas || []).forEach((tela, i) => {
		if (opcionesProductosPartidas.find(x => x.partida === tela) !== undefined) return;
		opcionesProductosPartidas.push({
			partida: tela,
			key: i,
			label: `${tela}`,
		});
	});

	let productoTela = null;
	let partida = null;
	let stockVal = null;
	let clasificacion = null;

	if (data?.partida) partida = data.partida;

	const opcionesProductosTelas = [];
	dataProductos.forEach(tela => {
		if (opcionesProductosTelas.find(x => x.id === tela.id) !== undefined) return;
		opcionesProductosTelas.push({
			...tela,
			label: `${tela.tela.nombre} - ${tela.color.descripcion}`,
		});
	});

	if (data?.productoTela) {
		productoTela = {
			...data.productoTela,
			label: `${data.productoTela.tela?.nombre} - ${data.productoTela.color?.descripcion}`,
		};
		clasificacion = data.productoTela.clasificacion;
	}

	if (data?.stock) {
		stockVal = data?.stock;
	}

	const actualizar = (nnn, titulo) => {
		// eslint-disable-next-line no-restricted-syntax
		for (const key in valInicial) {
			if (Object.hasOwnProperty.call(valInicial, key)) {
				const element = valInicial[key];
				if (element.id === data.id) {
					element[titulo] = nnn;
					element.stock = stock;
				}
			}
		}
		onChange([...valInicial]);
	};

	useEffect(() => {
		if (partida && partida.partida) {
			traerProductosPartida(partida.partida);
		}
	}, [partida]);

	return (
		<div
			className="flex flex-col sm:flex-row  sm:mr-4"
			style={{
				alignItems: 'center',
				width: '100%',
				margin: 0,
				padding: 0,
				marginLeft: '12px',
				marginBottom: '20px',
			}}
		>
			<Autocomplete
				isOptionEqualToValue={(op, val) => op.id === val.id}
				options={opcionesProductosPartidas || []}
				value={productoPartidaTemporal || partida}
				style={{ width: '15%', margin: '0 10px' }}
				filterOptions={(options, state) => options}
				onInputChange={(event, newInputValue) => {
					setProductoTelaSearchText(newInputValue);
					setProductoPartidaTemporal({ ...partida, label: newInputValue });
				}}
				onChange={(event, newValue) => {
					// eslint-disable-next-line no-restricted-syntax
					for (const key in valInicial) {
						if (Object.hasOwnProperty.call(valInicial, key)) {
							const element = valInicial[key];
							if (element.id === data.id) {
								element.partida = newValue;
								// const filtroTelas = dataProductos.filter(e => e.partida === newValue.partida);
								// filtroTelas.forEach(tela => {
								// 	if (opcionesProductosTelas.find(x => x.id === tela.id) !== undefined) return;
								// 	opcionesProductosTelas.push({
								// 		...tela,
								// 		label: `${tela.tela.nombre} - ${tela.color.descripcion}`,
								// 	});
								// });
								// element.dataProductos = filtroTelas;
							}
						}
					}
					setProductoPartidaTemporal(null);
					onChange([...valInicial]);
				}}
				renderInput={params => (
					<TextField
						{...params}
						placeholder="Seleccione la partida"
						label="Partida"
						required
						variant="outlined"
						InputLabelProps={{
							shrink: true,
						}}
					/>
				)}
			/>
			<Autocomplete
				isOptionEqualToValue={(op, val) => op.id === val.id}
				options={opcionesProductosTelas || []}
				value={productoTelaTemporal || productoTela}
				disabled={partida === null}
				style={{ width: '35%', margin: '0 10px' }}
				filterOptions={(options, state) => options}
				onInputChange={(event, newInputValue) => {
					setProductosPartidaSearchText(partida ? partida.partida : null);
					setProductoTelaTemporal({ ...productoTela, label: newInputValue });
					if (newInputValue && newInputValue !== '') {
						setStockSearchText(productoTela);
					}
				}}
				onChange={(event, newValue) => {
					// eslint-disable-next-line no-restricted-syntax
					for (const key in valInicial) {
						if (Object.hasOwnProperty.call(valInicial, key)) {
							const element = valInicial[key];
							if (element.id === data.id) {
								element.productoTela = newValue;
								element.stock = stock;
							}
						}
					}
					setProductoTelaTemporal(null);
					onChange([...valInicial]);
				}}
				renderInput={params => (
					<TextField
						{...params}
						placeholder="Seleccione el producto"
						label="Producto Tela"
						required
						variant="outlined"
						InputLabelProps={{
							shrink: true,
						}}
					/>
				)}
			/>
			<TextField
				name="stock"
				placeholder="Stock"
				label="Stock"
				variant="outlined"
				style={{ width: '10%', margin: '0 10px' }}
				value={stock || stockVal}
				InputLabelProps={{
					shrink: true,
				}}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							{data.productoTela?.unidadMedida?.prefijo}
						</InputAdornment>
					),
				}}
				disabled
			/>
			<TextField
				name="clasificacion"
				placeholder="Clasificacion"
				label="Clasificacion"
				variant="outlined"
				style={{ width: '13%', margin: '0 10px' }}
				value={clasificacion}
				InputLabelProps={{
					shrink: true,
				}}
				disabled
			/>

			<TextField
				name="cantidad"
				type="number"
				placeholder="Ingresa la cantidad"
				label="Cantidad de Salida"
				variant="outlined"
				style={{ width: '15%', margin: '0 10px' }}
				value={cantidad}
				onBlur={() => {
					actualizar(cantidad, 'cantidad');
				}}
				onChange={e => {
					console.log(stock);
					const total = stock || stockVal;
					if (parseFloat(e.target.value) <= total && parseFloat(e.target.value) > 0)
						setCantidad(e.target.value);
					else {
						setCantidad();
						toast.error('La cantidad no puede ser mayor al stock o menor a 0');
					}
				}}
				required
				InputLabelProps={{
					shrink: true,
				}}
			/>

			<TextField
				name="cantidadRollo"
				type="number"
				placeholder="Ingresa la cantidad de rollos"
				label="Cantidad en Rollos"
				variant="outlined"
				style={{ width: '15%', margin: '0 10px' }}
				value={cantRollos}
				onBlur={() => {
					actualizar(cantRollos, 'cantidadRollo');
				}}
				onChange={e => {
					setcantRollos(e.target.value);
				}}
				required
				InputLabelProps={{
					shrink: true,
				}}
			/>
			<TextField
				name="cantidadRolloRestante"
				type="number"
				placeholder="Ingresa la cantidad de rollos restantes"
				label="Rollos Restantes"
				variant="outlined"
				style={{ width: '15%', margin: '0 10px' }}
				value={cantRollosRestantes}
				onBlur={() => {
					actualizar(cantRollosRestantes, 'cantidadRolloRestante');
				}}
				onChange={e => {
					setcantRollosRestantes(e.target.value);
				}}
				required
				InputLabelProps={{
					shrink: true,
				}}
			/>

			<div
				style={{ backgroundColor: '#F5FBFA', /* marginBottom: '100px',  */ borderRadius: '50px' }}
			>
				<IconButton
					aria-label="delete"
					color="error"
					onClick={() => {
						// eslint-disable-next-line no-restricted-syntax
						for (const key in valInicial) {
							if (Object.hasOwnProperty.call(valInicial, key)) {
								const element = valInicial[key];
								if (element.id === data.id) {
									valInicial.splice(key, 1);
								}
							}
						}
						onChange([...valInicial]);
					}}
				>
					<DeleteForeverIcon />
				</IconButton>
			</div>
		</div>
	);
};

export default TipoSalidaForm;

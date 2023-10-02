import { Controller, useFormContext } from 'react-hook-form';
import FuseUtils from '@fuse/utils';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const { Autocomplete, TextField, IconButton } = require('@mui/material');
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

	const [productoTelaTemporal, setProductoTelaTemporal] = useState(null);

	const [dataProductosTelas, setDataProductosTelas] = useState([]);

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
		const url = `producto-tela?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${texto}`;

		const response = await httpClient.get(url);
		const dataResponse = await response.data.body[0];
		setDataProductosTelas(dataResponse);
	};

	const opcionesProductosTelas = dataProductosTelas.map(tela => ({
		...tela,
		label: `${tela.tela.nombre} - ${tela.color.descripcion}`,
	}));

	let productoTela = null;
	let partida = null;
	let stock = 0;

	if (data?.productoTela) {
		productoTela = {
			...data.productoTela,
			label: `${data.productoTela.tela?.nombre} - ${data.productoTela.color?.descripcion}`,
		};
		partida = data.productoTela?.partida;
		stock = `${data.productoTela?.detallesProductosIngresosAlmacenesTelas?.reduce(
			(a, b) => a + b.cantidad,
			0
		)} ${data.productoTela?.unidadMedida?.prefijo}`;
	}

	const actualizar = (nnn, titulo) => {
		// eslint-disable-next-line no-restricted-syntax
		for (const key in valInicial) {
			if (Object.hasOwnProperty.call(valInicial, key)) {
				const element = valInicial[key];
				if (element.id === data.id) {
					element[titulo] = nnn;
				}
			}
		}
		onChange([...valInicial]);
	};

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
				options={opcionesProductosTelas || []}
				value={productoTelaTemporal || productoTela}
				style={{ width: '35%', margin: '0 10px' }}
				filterOptions={(options, state) => options}
				onInputChange={(event, newInputValue) => {
					traerProductosTela(newInputValue);
					setProductoTelaTemporal({ ...productoTela, label: newInputValue });
				}}
				onChange={(event, newValue) => {
					// eslint-disable-next-line no-restricted-syntax
					for (const key in valInicial) {
						if (Object.hasOwnProperty.call(valInicial, key)) {
							const element = valInicial[key];
							if (element.id === data.id) {
								element.productoTela = newValue;
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
				name="partida"
				placeholder="Partida"
				label="Partida"
				variant="outlined"
				style={{ width: '10%', margin: '0 10px' }}
				value={partida}
				InputLabelProps={{
					shrink: true,
				}}
				disabled
			/>
			<TextField
				name="stock"
				placeholder="Stock"
				label="Stock"
				variant="outlined"
				style={{ width: '10%', margin: '0 10px' }}
				value={stock}
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
					setCantidad(e.target.value);
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
				label="Cantidad de Rollos"
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
				label="Cantidad de Rollos Restantes"
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

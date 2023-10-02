import { Controller, useFormContext } from 'react-hook-form';
import FuseUtils from '@fuse/utils';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce';

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
			<div className="mx-6 mb-16 mt-16 text-base">Avío</div>
			<Controller
				name="avios"
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
														avio: null,
														cantidad: '',
													},
											  ]
											: [
													{
														id: FuseUtils.generateGUID(),
														productoTela: null,
														cantidad: '',
													},
											  ]
									);
								}}
							>
								<h5 style={{ color: 'white', fontWeight: 'bold' }}>Agregar Avío</h5>
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

	const [aviosSearchText, setAviosSearchText] = useState('');

	const [dataProductosTelas, setDataProductosTelas] = useState([]);

	const [cantidad, setCantidad] = useState(data.cantidad);

	useEffect(() => {
		traerAvios();
	}, []);

	const traerAvios = async busqueda => {
		let texto = '';
		if (busqueda) {
			texto = busqueda;
		}
		const url = `almacen-avio/kardex?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${texto}`;

		const response = await httpClient.get(url);
		const dataResponse = await response.data.body[0];
		setDataProductosTelas(dataResponse);
	};

	const debouncedTraerAvios = debounce(() => {
		traerAvios(aviosSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerAvios(); // Llamar a la versión debounced de fetchData
		return debouncedTraerAvios.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [aviosSearchText]);

	const opcionesProductosTelas = dataProductosTelas.map(dataKardexAvio => ({
		...dataKardexAvio,
		label:
			dataKardexAvio.producto.avio.familiaAvios?.id === 1
				? `${dataKardexAvio.producto.avio.nombre} - ${dataKardexAvio.producto.avio.codigoSec} - ${
						dataKardexAvio.producto.avio.marcaHilo
				  } - ${dataKardexAvio.producto.avio.color?.descripcion}${
						dataKardexAvio.producto.avio.talla
							? ` - Talla: ${dataKardexAvio.producto.avio.talla.prefijo}`
							: ''
				  }`
				: `${dataKardexAvio.producto.avio.nombre}${
						dataKardexAvio.producto.avio.talla
							? ` - Talla: ${dataKardexAvio.producto.avio.talla.prefijo}`
							: ''
				  }`,
	}));

	let avio = null;
	let stock = 0;

	if (data?.avio) {
		avio = {
			...data.avio,
			label:
				data.avio.producto.avio.familiaAvios?.id === 1
					? `${data.avio.producto.avio.nombre} - ${data.avio.producto.avio.codigoSec} - ${
							data.avio.producto.avio.marcaHilo
					  } - ${data.avio.producto.avio.color?.descripcion}${
							data.avio.producto.avio.talla
								? ` - Talla: ${data.avio.producto.avio.talla.prefijo}`
								: ''
					  }`
					: `${data.avio.producto.avio.nombre}${
							data.avio.producto.avio.talla
								? ` - Talla: ${data.avio.producto.avio.talla.prefijo}`
								: ''
					  }`,
		};
		stock = `${parseFloat(data.avio?.cantidad)} ${data.avio?.unidad?.prefijo}`;
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
				value={productoTelaTemporal || avio}
				style={{ width: '60%', margin: '0 10px' }}
				filterOptions={(options, state) => options}
				onInputChange={(event, newInputValue) => {
					setAviosSearchText(newInputValue);
					setProductoTelaTemporal({ ...avio, label: newInputValue });
				}}
				onChange={(event, newValue) => {
					// eslint-disable-next-line no-restricted-syntax
					for (const key in valInicial) {
						if (Object.hasOwnProperty.call(valInicial, key)) {
							const element = valInicial[key];
							if (element.id === data.id) {
								element.avio = newValue;
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
						label="Avio"
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
				style={{ width: '20%', margin: '0 10px' }}
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
				style={{ width: '20%', margin: '0 10px' }}
				value={cantidad}
				onBlur={() => {
					actualizar(cantidad, 'cantidad');
				}}
				onChange={e => {
					if (e.target.value <= parseFloat(data.avio?.cantidad) && parseFloat(e.target.value) > 0)
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

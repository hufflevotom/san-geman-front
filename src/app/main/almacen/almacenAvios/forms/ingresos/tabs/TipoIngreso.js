import { Controller, useFormContext } from 'react-hook-form';
import FuseUtils from '@fuse/utils';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import debounce from 'lodash.debounce';

const { Autocomplete, TextField, IconButton } = require('@mui/material');
const { limitCombo, offsetCombo } = require('constants/constantes');
const { useState, useEffect } = require('react');
const { default: httpClient } = require('utils/Api');

const TipoIngresoForm = () => {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	return (
		<div key={FuseUtils.generateGUID()}>
			<hr />
			<div className="mx-6 mb-16 mt-16 text-base">Avio</div>
			<Controller
				name="aviosComplemento"
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
									backgroundColor: 'rgb(2 136 209)',
								}}
								onClick={() => {
									onChange(
										value
											? [
													...value,
													{
														id: FuseUtils.generateGUID(),
														avio: null,
														unidad: null,
														cantidad: '',
														ubicacion: '',
													},
											  ]
											: [
													{
														id: FuseUtils.generateGUID(),
														avio: null,
														unidad: null,
														cantidad: '',
														ubicacion: '',
													},
											  ]
									);
								}}
							>
								<h5 style={{ color: 'white', fontWeight: 'bold' }}>Agregar Avio</h5>
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
	const { errors, data, valInicial, onChange } = props;

	const [dataAvios, setDataAvios] = useState([]);

	const [aviosSearchText, setAviosSearchText] = useState('');

	const [cantidad, setCantidad] = useState(data.cantidad);
	const [unidad, setUnidad] = useState(data.unidad);
	const [ubicacion, setUbicacion] = useState(data.ubicacion);

	useEffect(() => {
		traerAvios();
	}, []);

	const traerAvios = async busqueda => {
		let texto = '';
		if (busqueda) {
			texto = busqueda;
		}
		const url = `maestro/avios?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${texto}`;

		const response = await httpClient.get(url);
		const dataResponse = await response.data.body[0];
		setDataAvios(dataResponse);
	};

	const debouncedTraerAvios = debounce(() => {
		traerAvios(aviosSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerAvios(); // Llamar a la versión debounced de fetchData
		return debouncedTraerAvios.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [aviosSearchText]);

	const opcionesAvios = dataAvios.map(avio => ({
		...avio,
		label:
			avio.familiaAvios?.id === 1
				? `${avio.nombre} - ${avio.codigoSec} - ${avio.marcaHilo} - ${avio.color?.descripcion}${
						avio.talla ? ` - Talla: ${avio.talla.prefijo}` : ''
				  }`
				: `${avio.nombre}${avio.talla ? ` - Talla: ${avio.talla.prefijo}` : ''}`,
	}));

	const opcionesUnidades = [];

	let avioComplemento = null;

	if (data?.avio) {
		if (data.avio.unidadMedida)
			if (opcionesUnidades.findIndex(u => u.id === data.avio.unidadMedida.id) === -1)
				opcionesUnidades.push({ ...data.avio.unidadMedida, label: data.avio.unidadMedida.nombre });

		if (data.avio.unidadMedidaCompra)
			if (opcionesUnidades.findIndex(u => u.id === data.avio.unidadMedidaCompra.id) === -1)
				opcionesUnidades.push({
					...data.avio.unidadMedidaCompra,
					label: data.avio.unidadMedidaCompra.nombre,
				});

		if (data.avio.unidadMedidaSecundaria)
			if (opcionesUnidades.findIndex(u => u.id === data.avio.unidadMedidaSecundaria.id) === -1)
				opcionesUnidades.push({
					...data.avio.unidadMedidaSecundaria,
					label: data.avio.unidadMedidaSecundaria.nombre,
				});

		avioComplemento = {
			...data.avio,
			label:
				data.avio.familiaAvios?.id === 1
					? `${data.avio.nombre} - ${data.avio.codigoSec} - ${data.avio.marcaHilo} - ${
							data.avio.color?.descripcion
					  }${data.avio.talla ? ` - Talla: ${data.avio.talla.prefijo}` : ''}`
					: `${data.avio.nombre}${data.avio.talla ? ` - Talla: ${data.avio.talla.prefijo}` : ''}`,
		};
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
				marginBottom: '12px',
			}}
		>
			<Autocomplete
				className="mt-8 mb-16 mx-12"
				isOptionEqualToValue={(op, val) => op.id === val.id}
				options={opcionesAvios || []}
				value={avioComplemento}
				fullWidth
				filterOptions={(options, state) => options}
				onInputChange={(event, newInputValue) => {
					setAviosSearchText(newInputValue);
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
					onChange([...valInicial]);
				}}
				renderInput={params => (
					<TextField
						{...params}
						placeholder="Seleccione la avio"
						label="Avio"
						required
						fullWidth
						error={!!errors.aviosEstilos}
						helperText={errors?.aviosEstilos?.message}
						variant="outlined"
						InputLabelProps={{
							shrink: true,
						}}
					/>
				)}
			/>

			<TextField
				name="cantidad"
				placeholder="Ingrese la cantidad Principal"
				className="mt-8 mb-16 mx-12"
				label={`Cantidad Principal (${data.avio?.unidadMedida.prefijo ?? ''})`}
				variant="outlined"
				fullWidth
				value={cantidad}
				onBlur={() => {
					actualizar(cantidad, 'cantidad');
				}}
				onChange={e => {
					setCantidad(e.target.value);
				}}
				error={!!errors.cantidad}
				helperText={errors?.cantidad?.message}
				required
				InputLabelProps={{
					shrink: true,
				}}
			/>

			<Autocomplete
				className="mt-8 mb-16 mx-12"
				isOptionEqualToValue={(op, val) => op.id === val.id}
				options={opcionesUnidades || []}
				value={unidad}
				disabled={!avioComplemento}
				fullWidth
				filterOptions={(options, state) => options}
				onInputChange={(event, newInputValue) => {
					setUnidad({ ...unidad, label: newInputValue });
				}}
				onChange={(event, newValue) => {
					// eslint-disable-next-line no-restricted-syntax
					for (const key in valInicial) {
						if (Object.hasOwnProperty.call(valInicial, key)) {
							const element = valInicial[key];
							if (element.id === data.id) {
								element.unidad = newValue;
							}
						}
					}
					setUnidad(null);
					onChange([...valInicial]);
				}}
				renderInput={params => (
					<TextField
						{...params}
						placeholder="Seleccione la unidad de Medida"
						label="Unidad de Medida"
						required
						fullWidth
						error={!!errors.unidad}
						helperText={errors?.unidad?.message}
						variant="outlined"
						InputLabelProps={{
							shrink: true,
						}}
					/>
				)}
			/>

			<TextField
				name="ubicacion"
				placeholder="Ingrese la ubicación"
				className="mt-8 mb-16 mx-12"
				label="Ubicación"
				variant="outlined"
				fullWidth
				value={ubicacion}
				onBlur={() => {
					actualizar(ubicacion, 'ubicacion');
				}}
				onChange={e => {
					setUbicacion(e.target.value);
				}}
				error={!!errors.ubicacion}
				helperText={errors?.ubicacion?.message}
				required
				InputLabelProps={{
					shrink: true,
				}}
			/>

			<div style={{ backgroundColor: '#F5FBFA', borderRadius: '50px' }}>
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

export default TipoIngresoForm;

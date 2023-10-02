import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import { Controller, useFormContext } from 'react-hook-form';
import { Autocomplete, IconButton, TextField } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FuseUtils from '@fuse/utils/FuseUtils';
import { limitCombo, offsetCombo } from 'constants/constantes';
import httpClient from 'utils/Api';

function AgregarAvios() {
	const methods = useFormContext();
	const { control, formState, watch } = methods;
	const { errors } = formState;

	const currentMoneda = watch('moneda');

	return (
		<div className="mx-10">
			<div className="mx-6 mb-16 mt-16 text-base">Avíos</div>
			<Controller
				name="aviosLibres"
				control={control}
				render={({ field: { onChange, value } }) => {
					let val = [];
					let totalImporteX = 0;
					let valorVenta = 0;
					let igv = 0;

					if (value) {
						value.forEach(element => {
							if (element.totalImporte && typeof element.totalImporte !== 'string') {
								valorVenta += element.totalImporte;
							} else if (typeof element.totalImporte === 'string') {
								valorVenta += parseFloat(element.totalImporte);
							}
						});

						totalImporteX = valorVenta * 1.18;
						igv = totalImporteX - valorVenta;

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
						<div key={FuseUtils.generateGUID()} style={{ marginRight: '25px' }}>
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
														cantidad: 0,
														precioUnitario: 0,
														totalImporte: 0,
													},
											  ]
											: [
													{
														id: FuseUtils.generateGUID(),
														avio: null,
														cantidad: 0,
														precioUnitario: 0,
														totalImporte: 0,
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

					if (totalImporteX > 0) {
						val.push(
							<div
								style={{
									width: '100%',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									gap: '10px',
									marginTop: '20px',
									marginRight: '20px',
									marginBottom: '100px',
								}}
							>
								<div
									style={{
										width: '100%',
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'end',
										gap: '10px',
									}}
								>
									<div style={{ width: '200px' }}>VALOR VENTA</div>
									<div>
										{currentMoneda === 'SOLES' ? 'S/ ' : '$ '}
										{(typeof valorVenta === 'string' ? parseFloat(valorVenta) : valorVenta).toFixed(
											2
										)}
									</div>
								</div>

								<div
									style={{
										width: '100%',
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'end',
										gap: '10px',
									}}
								>
									<div style={{ width: '200px' }}>IGV (18.00%)</div>
									<div>
										{currentMoneda === 'SOLES' ? 'S/ ' : '$ '}
										{(typeof igv === 'string' ? parseFloat(igv) : igv).toFixed(2)}
									</div>
								</div>

								<div
									style={{
										width: '100%',
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'end',
										gap: '10px',
									}}
								>
									<div style={{ width: '200px' }}>TOTAL IMPORTE</div>
									<div>
										{currentMoneda === 'SOLES' ? 'S/ ' : '$ '}
										{(typeof totalImporteX === 'string'
											? parseFloat(totalImporteX)
											: totalImporteX
										).toFixed(2)}
									</div>
								</div>
							</div>
						);
					}
					return val;
				}}
			/>
		</div>
	);
}

const FormData = props => {
	const { errors, data, valInicial, onChange } = props;

	const [aviosTemporal, setAviosTemporal] = useState(null);
	const [unidadTemporal, setUnidadTemporal] = useState(null);

	const [aviosSearchText, setAviosSearchText] = useState('');

	const [dataAvios, setDataAvios] = useState([]);

	const [cantidad, setCantidad] = useState(data.cantidad || 0);
	const [precioUnitario, setPrecioUnitario] = useState(data.precioUnitario || 0);

	const { totalImporte } = data;

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
	let unidadComplemento = null;

	if (data?.avio) {
		avioComplemento = {
			...data.avio,
			label:
				data.avio.familiaAvios?.id === 1
					? `${data.avio.nombre} - ${data.avio.codigoSec} - ${data.avio.marcaHilo} - ${
							data.avio.color?.descripcion
					  }${data.avio.talla ? ` - Talla: ${data.avio.talla.prefijo}` : ''}`
					: `${data.avio.nombre}${data.avio.talla ? ` - Talla: ${data.avio.talla.prefijo}` : ''}`,
		};
		// if (data.avio.unidadMedida)
		// 	if (opcionesUnidades.findIndex(u => u.id === data.avio.unidadMedida.id) === -1)
		// 		opcionesUnidades.push({ ...data.avio.unidadMedida, label: data.avio.unidadMedida.nombre });

		if (data.avio.unidadMedidaCompra)
			if (opcionesUnidades.findIndex(u => u.id === data.avio.unidadMedidaCompra.id) === -1)
				opcionesUnidades.push({
					...data.avio.unidadMedidaCompra,
					label: data.avio.unidadMedidaCompra.nombre,
				});

		// if (data.avio.unidadMedidaSecundaria)
		// 	if (opcionesUnidades.findIndex(u => u.id === data.avio.unidadMedidaSecundaria.id) === -1)
		// 		opcionesUnidades.push({
		// 			...data.avio.unidadMedidaSecundaria,
		// 			label: data.avio.unidadMedidaSecundaria.nombre,
		// 		});
	}

	if (data?.unidad) {
		unidadComplemento = {
			...data.unidad,
			label: data.unidad.nombre,
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
				if (
					element.cantidad &&
					(element.precioUnitario !== null || element.precioUnitario !== '')
				) {
					element.totalImporte = element.precioUnitario * element.cantidad;
				}
			}
		}
		onChange([...valInicial]);
	};

	return (
		<div
			className="flex flex-col sm:flex-row mr-12"
			style={{
				alignItems: 'center',
				width: '100%',
				margin: 0,
				padding: 0,
				marginRight: '12px',
				marginBottom: '12px',
			}}
		>
			<div
				className="flex flex-col"
				style={{
					alignItems: 'center',
					width: '100%',
					margin: 0,
					padding: 0,
					marginLeft: '12px',
					marginBottom: '12px',
				}}
			>
				<div
					className="flex flex-col sm:flex-row"
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
						value={aviosTemporal || avioComplemento}
						fullWidth
						filterOptions={(options, state) => options}
						onInputChange={(event, newInputValue) => {
							setAviosSearchText(newInputValue);
							setAviosTemporal({ ...avioComplemento, label: newInputValue });
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
							setAviosTemporal(null);
							onChange([...valInicial]);
						}}
						renderInput={params => (
							<TextField
								{...params}
								placeholder="Seleccione el avío"
								label="Avío"
								required
								fullWidth
								error={!!errors.avio}
								helperText={errors?.avio?.message}
								variant="outlined"
								InputLabelProps={{
									shrink: true,
								}}
							/>
						)}
					/>

					<TextField
						name="cantidad"
						type="number"
						placeholder="Cantidad"
						className="mt-8 mb-16 mx-12 w-1/3"
						label="Cantidad"
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
						className="mt-8 mb-16 mx-12 w-2/4"
						isOptionEqualToValue={(op, val) => op.id === val.id}
						options={opcionesUnidades || []}
						disabled={opcionesUnidades.length === 0}
						value={unidadTemporal || unidadComplemento}
						fullWidth
						filterOptions={(options, state) => options}
						onInputChange={(event, newInputValue) => {
							// traerUnidades(newInputValue);
							setUnidadTemporal({ ...unidadComplemento, label: newInputValue });
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
							setUnidadTemporal(null);
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
						name="precioUnitario"
						type="number"
						placeholder="Valor Unitario"
						className="mt-8 mb-16 mx-12 w-1/3"
						label="Valor Unitario"
						variant="outlined"
						fullWidth
						value={precioUnitario}
						onBlur={() => {
							actualizar(precioUnitario, 'precioUnitario');
						}}
						onChange={e => {
							setPrecioUnitario(e.target.value);
						}}
						error={!!errors.precioUnitario}
						helperText={errors?.precioUnitario?.message}
						required
						InputLabelProps={{
							shrink: true,
						}}
					/>
					<TextField
						name="totalImporte"
						type="number"
						placeholder="Total Importe"
						className="mt-8 mb-16 mx-12 w-1/3"
						label="Total Importe"
						disabled
						variant="outlined"
						fullWidth
						value={totalImporte}
						error={!!errors.totalImporte}
						helperText={errors?.totalImporte?.message}
						required
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</div>
			</div>

			<div style={{ backgroundColor: '#F5FBFA', marginRight: '20px', borderRadius: '50px' }}>
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

export default AgregarAvios;

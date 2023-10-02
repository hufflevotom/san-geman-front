/* eslint-disable no-restricted-syntax */
import { Autocomplete, IconButton } from '@mui/material';
import debounce from 'lodash.debounce';
import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FuseUtils from '@fuse/utils';
import { useEffect, useState } from 'react';
import httpClient from 'utils/Api';
import { limitCombo, offsetCombo } from 'constants/constantes';

function TitulacionTab(props) {
	const methods = useFormContext();
	const { control, formState, getValues } = methods;
	const { errors } = formState;

	const getValor = getValues();

	return (
		<div
			className="flex flex-col sm:flex-col mr-24 sm:mr-4"
			style={{ overflowY: 'scroll', flexWrap: 'wrap' }}
			key={FuseUtils.generateGUID()}
		>
			<Controller
				name="titulacionJson"
				control={control}
				render={({ field: { onChange, value } }) => {
					let val = [];
					if (value) {
						val = value.map(alt => {
							return (
								<Alt
									getValor={getValor}
									key={alt.id}
									control={control}
									errors={errors}
									data={alt}
									onChange={onChange}
									valInicial={value}
								/>
							);
						});
					}

					val.push(
						<div
							key={FuseUtils.generateGUID()}
							style={{
								width: '100%',
								alignContent: 'center',
								alignItems: 'center',
								display: 'flex',
								justifyContent: 'center',
								fontSize: '14px',
							}}
						>
							<IconButton
								className="w-full h-fit py-14 flex items-center justify-center rounded-8 overflow-hidden cursor-pointer shadow hover:shadow-md"
								disabled={value?.length >= 4 || getValor.estado !== 'desarrollo'}
								// disabled={getValor.estado !== 'desarrollo'}
								aria-label="add"
								size="medium"
								color="primary"
								style={{ fontSize: '14px' }}
								onClick={() => {
									onChange(
										value
											? [
													...value,
													{
														id: FuseUtils.generateGUID(),
														titulacion: '',
														material: '',
														porcentaje: 0,
													},
											  ]
											: [
													{
														id: FuseUtils.generateGUID(),
														titulacion: '',
														material: '',
														porcentaje: 0,
													},
											  ]
									);
								}}
							>
								Agregar Titulación <AddBoxIcon style={{ fontSize: '30px' }} />
							</IconButton>
						</div>
					);
					return val;
				}}
			/>
		</div>
	);
}

const Alt = props => {
	const { control, errors, data, onChange, valInicial, getValor } = props;

	const [titulacion, setTitulacion] = useState(data.titulacion);
	const [material, setMaterial] = useState(data.material);
	const [porcentaje, setPorcentaje] = useState(data.porcentaje);

	const actualizar = (nnn, titulo) => {
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

	const [dataTitulacion, setDataTitulacion] = useState([]);

	const [titulacionSearchText, setTitulacionSearchText] = useState('');

	const traerTitulacion = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `maestro/titulacion?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const dd = await response.data.body[0];
		setDataTitulacion(dd);
	};

	const debouncedGetTitulacion = debounce(() => {
		traerTitulacion(titulacionSearchText);
	}, 500);

	useEffect(() => {
		debouncedGetTitulacion(); // Llamar a la versión debounced de fetchData
		return debouncedGetTitulacion.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [titulacionSearchText]);

	useEffect(() => {
		traerTitulacion();
	}, []);

	const opcionesTitulaciones = dataTitulacion.map(unidad => ({
		...unidad,
		label: unidad.nombre,
	}));

	return (
		<div
			className="flex flex-col sm:flex-row gap-20 sm:mr-4"
			style={{
				alignItems: 'center',
				margin: 0,
				marginTop: '10px',
				padding: 0,
				marginLeft: '7px',
				marginBottom: '7px',
			}}
		>
			{/* <TextField
				style={{ margin: 0, padding: 0 }}
				placeholder="Ingrese la titulacion"
				label="Titulos del Hilo"
				variant="outlined"
				disabled={getValor.estado !== 'desarrollo'}
				fullWidth
				value={titulacion}
				onBlur={() => {
					actualizar(titulacion, 'titulacion');
				}}
				onChange={e => {
					setTitulacion(e.target.value);
				}}
				error={!!errors.titulacion}
				helperText={errors?.titulacion?.message}
				InputLabelProps={{
					shrink: true,
				}}
			/> */}
			<Autocomplete
				className="mt-8 mb-16 mx-12"
				// freeSolo
				/* disabled={existe} */
				isOptionEqualToValue={(op, val) => op.label === val.label}
				options={opcionesTitulaciones || []}
				value={titulacion}
				filterOptions={(options, state) => {
					return options;
				}}
				fullWidth
				onInputChange={(event, newInputValue) => {
					setTitulacionSearchText(newInputValue);
					// setUnidadTemporal({ ...unidad, label: newInputValue });
				}}
				onChange={(event, newValue) => {
					if (newValue) {
						const { label, ...valor } = newValue;

						actualizar(label, 'titulacion');
					} else {
						// actualizar(null, 'titulacion');
					}
				}}
				renderInput={params => (
					<TextField
						{...params}
						style={{ margin: 0, padding: 0 }}
						placeholder="Ingrese la titulacion"
						label="Titulos del Hilo"
						error={!!errors.titulacion}
						helperText={errors?.titulacion?.message}
						variant="outlined"
						fullWidth
						InputLabelProps={{
							shrink: true,
						}}
					/>
				)}
			/>
			<TextField
				style={{ margin: 0, padding: 0 }}
				placeholder="Porcentaje"
				className="mt-8 mb-16 mx-12"
				label="Porcentaje"
				variant="outlined"
				fullWidth
				type="number"
				InputProps={{
					inputProps: { min: 0 },
				}}
				value={porcentaje}
				onBlur={() => {
					actualizar(porcentaje, 'porcentaje');
				}}
				onChange={e => {
					setPorcentaje(e.target.value);
				}}
				error={!!errors.porcentaje}
				helperText={errors?.porcentaje?.message}
				InputLabelProps={{
					shrink: true,
				}}
			/>
			<TextField
				style={{ margin: 0, padding: 0 }}
				placeholder="Ingrese el material"
				label="Material"
				variant="outlined"
				disabled={getValor.estado !== 'desarrollo'}
				fullWidth
				value={material}
				onBlur={() => {
					actualizar(material, 'material');
				}}
				onChange={e => {
					setMaterial(e.target.value);
				}}
				error={!!errors.material}
				helperText={errors?.material?.message}
				InputLabelProps={{
					shrink: true,
				}}
			/>
			<div
				style={{
					backgroundColor: '#F5FBFA',
					/* marginBottom: '100px',  */ borderRadius: '50px',
				}}
			>
				<IconButton
					aria-label="delete"
					color="error"
					// disabled={estilo.asignado}
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

export default TitulacionTab;

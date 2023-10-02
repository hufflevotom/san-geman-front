import FuseUtils from '@fuse/utils/FuseUtils';
import debounce from 'lodash.debounce';
import { Autocomplete, IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { limitCombo, offsetCombo } from 'constants/constantes';
import httpClient from 'utils/Api';

function DireccionesAlternativas(props) {
	const methods = useFormContext();
	const { control, formState, getValues } = methods;
	const { errors } = formState;

	const data = getValues();

	return (
		<div className="flex flex-col sm:flex-col mr-24 sm:mr-4 pr-16 sm:pr-24">
			<Controller
				name="direccionesAlternativas"
				control={control}
				render={({ field: { onChange, value } }) => {
					let val = [];
					if (value) {
						val = value?.map(alt => {
							return (
								<FormData
									key={FuseUtils.generateGUID()}
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
						<div key={FuseUtils.generateGUID()}>
							<IconButton
								className="w-full h-fit py-14 flex items-center justify-center rounded-8 overflow-hidden cursor-pointer shadow hover:shadow-md"
								aria-label="add"
								size="medium"
								color="primary"
								style={{
									height: '46px',
									marginLeft: '20px',
									marginRight: '40px',
									backgroundColor: '#FFB52C',
									color: 'white',
								}}
								onClick={() => {
									onChange(
										value
											? [
													...value,
													{
														id: FuseUtils.generateGUID(),
														direccion: '',
														ubigeo: '',
													},
											  ]
											: [
													{
														id: FuseUtils.generateGUID(),
														direccion: '',
														ubigeo: '',
													},
											  ]
									);
								}}
							>
								<h5>Agregar</h5>
								{/* &nbsp;
							<AddCircleOutlineIcon style={{ fontSize: '30px', color: 'black' }} /> */}
							</IconButton>
						</div>
					);
					return val;
				}}
			/>
		</div>
	);
}
function FormData(props) {
	const { errors, data, onChange, valInicial } = props;

	const [ubigeos, setUbigeos] = useState([]);

	const [ubigeosSearchText, setUbigeosSearchText] = useState('');

	const getUbigeos = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `ubigeo?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const bdata = await response.data.body[0];
		setUbigeos(bdata.map(ubigeo => ({ ...ubigeo, label: ubigeo.distrito, key: ubigeo.codigo })));
	};

	const debouncedTraerUbigeos = debounce(() => {
		getUbigeos(ubigeosSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerUbigeos(); // Llamar a la versión debounced de fetchData
		return debouncedTraerUbigeos.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [ubigeosSearchText]);

	const [direccion, setDireccion] = useState(data.direccion);
	const [ubigeo, setUbigeo] = useState(data.ubigeo);

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
		<div className="flex flex-row justify-between mb-10">
			<div className="flex flex-col w-11/12">
				<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
					<TextField
						className="mt-8 mb-16 mx-12"
						error={!!errors.direccion}
						helperText={errors?.direccion?.message}
						id="direccion"
						label="Dirección"
						variant="outlined"
						fullWidth
						value={direccion}
						onBlur={() => {
							actualizar(direccion, 'direccion');
						}}
						onChange={newValue => {
							setDireccion(newValue.target.value);
						}}
					/>

					<Autocomplete
						className="mt-8 mb-16 mx-12"
						isOptionEqualToValue={(op, val) => op.label === val.label}
						options={ubigeos || []}
						value={ubigeo}
						filterOptions={(options, state) => {
							return options;
						}}
						onInputChange={(event, newInputValue) => {
							setUbigeosSearchText(newInputValue);
						}}
						fullWidth
						onChange={(event, newValue) => {
							if (newValue) {
								setUbigeo(newValue);
							}
						}}
						onBlur={() => {
							actualizar(ubigeo, 'ubigeo');
						}}
						renderInput={params => (
							<TextField
								{...params}
								placeholder="Seleccione el ubigeo"
								label="Ubigeo"
								error={!!errors.ubigeo}
								helperText={errors?.ubigeo?.message}
								variant="outlined"
								fullWidth
								InputLabelProps={{
									shrink: true,
								}}
							/>
						)}
					/>
				</div>
			</div>
			<div className="flex flex-row justify-center items-center w-1/12 h-full">
				<div
					style={{
						backgroundColor: '#F5FBFA',
						borderRadius: '50px',
						width: '35px',
						height: '35px',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
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
		</div>
	);
}

export default DireccionesAlternativas;

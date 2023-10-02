import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import debounce from 'lodash.debounce';
import { useFormContext, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { limitCombo, offsetCombo } from 'constants/constantes';
import httpClient from 'utils/Api';

function TabFamilia(props) {
	const { tipo } = props;

	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;
	const [dataPrendas, setDataPrendas] = useState([]);
	const [prendaTemporal, setPrendaTemporal] = useState(null);

	const [familiasPrendaSearchText, setFamiliasPrendaSearchText] = useState('');

	useEffect(() => {
		traerFamiliasPrenda();
	}, []);

	const traerFamiliasPrenda = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}

		const url = `maestro/familia-prenda?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataPrendas(data);
	};

	const debouncedGetFamiliasPrenda = debounce(() => {
		traerFamiliasPrenda(familiasPrendaSearchText);
	}, 500);

	useEffect(() => {
		debouncedGetFamiliasPrenda(); // Llamar a la versión debounced de fetchData
		return debouncedGetFamiliasPrenda.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [familiasPrendaSearchText]);

	const opcionesFamiliasPrendas = dataPrendas.map(prenda => ({
		...prenda,
		label: prenda.descripcion,
	}));

	return (
		<div>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="familiaPrenda"
					control={control}
					render={({ field: { onChange, value } }) => {
						const unidad = value
							? {
									...value,
									label: value.descripcion,
							  }
							: null;
						return (
							<Autocomplete
								disabled={tipo !== 'nuevo'}
								// freeSolo
								className="mt-8 mb-16 mx-12"
								fullWidth
								isOptionEqualToValue={(op, val) => op.id === val.id}
								options={opcionesFamiliasPrendas || []}
								value={unidad}
								filterOptions={(options, state) => {
									return options;
								}}
								onInputChange={(event, newInputValue) => {
									setFamiliasPrendaSearchText(newInputValue);
									setPrendaTemporal({ ...unidad, label: newInputValue });
								}}
								onChange={(event, newValue) => {
									if (newValue) {
										const { label, ...valor } = newValue;
										onChange(valor);
										setPrendaTemporal(null);
									} else {
										onChange(null);
									}
								}}
								renderInput={params => (
									<TextField
										{...params}
										placeholder="Seleccione la Familia"
										label="Familia Prenda"
										error={!!errors.familiaPrenda}
										helperText={errors?.familiaPrenda?.message}
										variant="outlined"
										InputLabelProps={{
											shrink: true,
										}}
									/>
								)}
							/>
						);
					}}
				/>
			</div>
		</div>
	);
}

export default TabFamilia;

import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';
import debounce from 'lodash.debounce';
import { useSelector } from 'react-redux';
import { Autocomplete, InputAdornment } from '@mui/material';
import { useEffect, useState } from 'react';
import httpClient from 'utils/Api';
import { limitCombo, offsetCombo } from 'constants/constantes';

function InformacionBasica(props) {
	const { tipo } = props;

	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	const [familiaSeleccionada, setFamiliaSeleccionada] = useState('');
	const [dataFamiliasTela, setDataFamiliasTela] = useState([]);
	const [familiasTelaTemporal, setFamiliasTelaTemporal] = useState(null);

	const [familiasTelaSearchText, setFamiliasTelaSearchText] = useState('');

	useEffect(() => {
		traerFamiliasTela();
	}, []);

	const traerFamiliasTela = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `maestro/familia-tela?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataFamiliasTela(data);
	};

	const debouncedGetFamiliasTela = debounce(() => {
		traerFamiliasTela(familiasTelaSearchText);
	}, 500);

	useEffect(() => {
		debouncedGetFamiliasTela(); // Llamar a la versión debounced de fetchData
		return debouncedGetFamiliasTela.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [familiasTelaSearchText]);

	const subfamilia = useSelector(({ maestros }) => maestros.subfamilia);

	const opcionesFamiliasTela = dataFamiliasTela.map(tela => ({
		...tela,
		label: tela.descripcion,
	}));

	return (
		<div>
			<div className="flex -mx-4">
				<Controller
					name="familiaTela"
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
								className="mt-8 mb-16 mx-4"
								fullWidth
								isOptionEqualToValue={(op, val) => op.id === val.id}
								options={opcionesFamiliasTela || []}
								value={unidad}
								onInputChange={(event, newInputValue) => {
									setFamiliasTelaSearchText(newInputValue);
									setFamiliasTelaTemporal({ ...unidad, label: newInputValue });
								}}
								onChange={(event, newValue) => {
									if (newValue) {
										setFamiliaSeleccionada(newValue.descripcion);
										const { label, ...valor } = newValue;
										onChange(valor);
										setFamiliasTelaTemporal(null);
									} else {
										onChange(null);
									}
								}}
								renderInput={params => (
									<TextField
										{...params}
										placeholder="Seleccione la Familia"
										label="Familia Tela"
										error={!!errors.familia}
										helperText={errors?.familia?.message}
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
				<Controller
					name="nombre"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							value={field.value}
							className="mt-8 mb-16 mx-4"
							error={!!errors.nombre}
							required
							helperText={errors?.nombre?.message}
							label="Nombre"
							id="nombre"
							variant="outlined"
							fullWidth
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										{tipo !== 'nuevo' ? subfamilia?.familiaTela?.descripcion : familiaSeleccionada}
									</InputAdornment>
								),
							}}
						/>
					)}
				/>
			</div>
		</div>
	);
}

export default InformacionBasica;

import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import httpClient from 'utils/Api';
import { limitCombo, offsetCombo } from 'constants/constantes';

function TabFamilia(props) {
	const { tipo } = props;
	const methods = useFormContext();
	const { control, formState, getValues } = methods;
	const { errors } = formState;

	const [dataFamiliasTela, setDataFamiliasTela] = useState([]);

	const [familiasTelaSearchText, setFamiliasTelaSearchText] = useState('');

	const getValor = getValues();

	useEffect(() => {
		traerFamiliasTela();
	}, []);

	const traerFamiliasTela = async busqueda => {
		let text = '';
		if (busqueda) {
			text = busqueda.trim();
		}

		const url = `maestro/familia-tela?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${text}`;
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

	const opcionesFamiliasTela = dataFamiliasTela.map(tela => ({
		...tela,
		label: tela.descripcion,
	}));

	const [opcionesSubFamilias, setOpcionesSubFamilias] = useState([]);
	const tela = useSelector(({ maestros }) => maestros.tela);

	console.log('dataFamiliasTela: ', dataFamiliasTela);

	useEffect(() => {
		if (tipo !== 'nuevo') {
			console.log('TIPO 1: ', tipo);

			if (dataFamiliasTela.length > 0) {
				const telaFiltrada = dataFamiliasTela.filter(a => a.id === tela.familia.id);
				console.log('TIPO 2: ', telaFiltrada);
				console.log('TIPO 3: ', tela);

				setOpcionesSubFamilias(
					telaFiltrada[0]?.subFamilias.map(ba => ({
						...ba,
						label: ba.nombre,
					}))
				);
			}
		}
	}, [tipo, dataFamiliasTela]);

	return (
		<div>
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="familia"
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
								// disabled={getValor.estado !== 'desarrollo' || tipo !== 'nuevo'}
								// freeSolo
								className="mt-8 mb-16 mx-12"
								fullWidth
								isOptionEqualToValue={(op, val) => op.id === val.id}
								options={opcionesFamiliasTela || []}
								value={unidad}
								onChange={(event, newValue) => {
									if (newValue) {
										// eslint-disable-next-line array-callback-return
										const aux = newValue.subFamilias.map(subfamilia => {
											return {
												...subfamilia,
												label: subfamilia.nombre,
											};
										});
										setOpcionesSubFamilias(aux);
										const { label, ...valor } = newValue;
										onChange(valor);
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
					name="subFamilia"
					control={control}
					render={({ field: { onChange, value } }) => {
						const unidad = value
							? {
									...value,
									label: value.nombre,
							  }
							: null;
						return (
							<Autocomplete
								// freeSolo
								disabled={getValor.estado !== 'desarrollo'}
								className="mt-8 mb-16 mx-12"
								fullWidth
								isOptionEqualToValue={(op, val) => op.id === val.id}
								options={opcionesSubFamilias || []}
								value={unidad}
								onChange={(event, newValue) => {
									if (newValue) {
										const { label, ...valor } = newValue;
										onChange(valor);
									} else {
										onChange(null);
									}
								}}
								renderInput={params => (
									<TextField
										{...params}
										placeholder="Seleccione la SubFamilia"
										label="Sub Familia"
										error={!!errors.subFamilia}
										helperText={errors?.subFamilia?.message}
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
			<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="descripcionComercial"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							disabled={getValor.estado !== 'desarrollo'}
							className="mt-8 mb-16 mx-12 sm:w-full"
							error={!!errors.descripcionComercial}
							required
							helperText={errors?.descripcionComercial?.message}
							id="descripcionComercial"
							label="Descripción Comercial"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
		</div>
	);
}

export default TabFamilia;

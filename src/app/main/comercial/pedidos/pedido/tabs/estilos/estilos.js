/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
import { Autocomplete, TextField } from '@mui/material';
import debounce from 'lodash.debounce';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Controller, useFormContext } from 'react-hook-form';
import httpClient from 'utils/Api';
import { limitCombo, offsetCombo } from 'constants/constantes';
import TablaEstilo from './tablaEstilo';

const Estilos = () => {
	const methods = useFormContext();
	const { control, formState, getValues, watch } = methods;
	const { errors } = formState;

	const clienteInput = watch('cliente');
	const tabla = watch('dataEstilos');

	const [dataEstilos, setDataEstilos] = useState([]);

	const [estiloSearchText, setEstiloSearchText] = useState('');

	const routeParams = useParams();

	const getEstilos = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `comercial/estilos?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}&clienteId=${clienteInput.id}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		// ! Cambia el array de avios de los colores a color
		// const array = [];
		// data.forEach(e => {
		// 	const estiloAvios = [];
		// 	e.estiloAvios.forEach(el => {
		// 		el.colores.length > 0
		// 			? e.telasEstilos.find(t => t.tipo === 'P').colores.length === el.colores.length
		// 				? estiloAvios.push({
		// 						...el,
		// 						color: null,
		// 				  })
		// 				: el.colores.forEach(elem => {
		// 						estiloAvios.push({
		// 							...el,
		// 							color: elem,
		// 						});
		// 				  })
		// 			: estiloAvios.push({
		// 					...el,
		// 					color: null,
		// 			  });
		// 	});
		// 	e.estiloAvios = estiloAvios;
		// 	array.push(e);
		// });
		setDataEstilos(data);
	};

	const debouncedGetEstilos = debounce(() => {
		getEstilos(estiloSearchText);
	}, 500);

	useEffect(() => {
		debouncedGetEstilos(); // Llamar a la versión debounced de fetchData
		return debouncedGetEstilos.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [estiloSearchText]);

	const opcionesEstilos = dataEstilos.map(estilo => ({
		...estilo,
		label: `${estilo.estilo} -/- ${estilo.nombre}`,
	}));

	useEffect(() => {
		if (clienteInput) getEstilos();
	}, [clienteInput]);

	return (
		<>
			<div className="sm:flex-row mr-24 sm:mr-4">
				<Controller
					name="dataEstilos"
					control={control}
					render={({ field: { onChange: onChangeDataEstilo, value: valueDataEstilo } }) => {
						const { cliente } = getValues();

						const estilos = valueDataEstilo?.estilos
							? valueDataEstilo.estilos.map(val => ({
									...val,
									label: `${val.estilo} -/- ${val.nombre}`,
							  }))
							: [];

						return (
							<>
								<Autocomplete
									multiple
									freeSolo
									disabled={!cliente || routeParams.id !== 'nuevo'}
									className="mt-8 mb-16 mx-12"
									isOptionEqualToValue={(op, val) => op.id === val.id}
									options={opcionesEstilos}
									value={estilos}
									fullWidth
									filterOptions={(options, state) => {
										return options;
									}}
									onInputChange={(event, newInputValue) => {
										setEstiloSearchText(newInputValue);
									}}
									onChange={(event, newValue) => {
										valueDataEstilo.estilos = newValue;
										onChangeDataEstilo(valueDataEstilo);
									}}
									renderInput={params => (
										<TextField
											{...params}
											placeholder="Seleccione el estilo"
											label="Estilo"
											required
											error={!!errors.estilo_id}
											helperText={!cliente ? 'Selecciona un cliente y luego los estilos' : ''}
											// helperText={errors?.estilo_id?.message}
											variant="outlined"
											InputLabelProps={{
												shrink: true,
											}}
											fullWidth
										/>
									)}
								/>
							</>
						);
					}}
				/>
				{tabla?.estilos?.map((estilo, index) => (
					<TablaEstilo
						key={`${index}TablaTallasCantidades`}
						estilo={estilo}
						valueDataEstilo={tabla}
					/>
				))}
			</div>
		</>
	);
};

export default Estilos;

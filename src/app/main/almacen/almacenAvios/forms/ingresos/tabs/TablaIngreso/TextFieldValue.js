import { Autocomplete, TextField } from '@mui/material';
import { limitCombo, offsetCombo } from 'constants/constantes';
import { useEffect, useState } from 'react';
import httpClient from 'utils/Api';

const TextFieldValueTable = ({
	label,
	dataSeleccionada,
	row,
	onChangeTable,
	dataKey,
	disabled,
}) => {
	const [valor, setValor] = useState(
		dataKey === 'P' ? row.nuevaCantidadPrincipal : row.nuevaCantidadSecundaria || 0
	);
	const [valorUnidad, setValorUnidad] = useState(
		dataKey === 'P' ? row.nuevaUnidadPrincipal : row.nuevaUnidadSecundaria || null
	);
	const [dataUnidades, setDataUnidades] = useState([]);

	const traerUnidades = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `configuraciones/unidad-media?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		const arrayFiltrado = [];
		arrayFiltrado.push(data.filter(unidad => unidad.id === row.producto.avio.unidadMedida.id)[0]);
		arrayFiltrado.push(
			data.filter(unidad => unidad.id === row.producto.avio.unidadMedidaSecundaria.id)[0]
		);
		setDataUnidades(
			arrayFiltrado.map(unidad => ({
				...unidad,
				label: unidad.nombre,
			}))
		);
	};

	useEffect(() => {
		traerUnidades();
	}, []);

	return (
		<div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
			<TextField
				style={{ width: '35%' }}
				type="number"
				InputProps={{
					inputProps: { min: 0 },
				}}
				disabled={disabled}
				value={valor}
				onChange={e => {
					setValor(e.target.value);
				}}
				onBlur={() => {
					console.log('dataSeleccionada', dataSeleccionada);
					dataSeleccionada.forEach(element => {
						if (element.id === row.id) {
							if (dataKey === 'P') {
								element.nuevaCantidadPrincipal = valor;
							} else {
								element.nuevaCantidadSecundaria = valor;
							}
						}
					});
					onChangeTable(dataSeleccionada);
				}}
				// fullWidth
				label={label}
				variant="outlined"
			/>
			<Autocomplete
				// className="mt-8 mb-16 mx-12 sm:w-full".
				style={{ width: '65%' }}
				// freeSolo
				// fullWidth
				isOptionEqualToValue={(op, val) => op.id === val.id}
				options={dataUnidades || []}
				value={valorUnidad}
				filterOptions={(options, state) => {
					return options;
				}}
				onInputChange={(event, newInputValue) => {
					traerUnidades(newInputValue);
				}}
				onChange={(event, newValue) => {
					if (newValue) {
						const { ...unidadValor } = newValue;
						console.log('dataSeleccionada', dataSeleccionada);
						dataSeleccionada.forEach(element => {
							if (element.id === row.id) {
								if (dataKey === 'P') {
									element.nuevaUnidadPrincipal = unidadValor;
								} else {
									element.nuevaUnidadSecundaria = unidadValor;
								}
							}
						});
						onChangeTable(dataSeleccionada);
						setValorUnidad(unidadValor);
					} else {
						onChangeTable(null);
					}
				}}
				renderInput={params => (
					<TextField
						{...params}
						placeholder="Seleccione la Unidad"
						label="Unidad"
						variant="outlined"
						InputLabelProps={{
							shrink: true,
						}}
					/>
				)}
			/>
		</div>
	);
};

export default TextFieldValueTable;

import { Autocomplete, TextField } from '@mui/material';
import { limitCombo, offsetCombo } from 'constants/constantes';
import { useEffect, useState } from 'react';
import httpClient from 'utils/Api';

const TextFieldUnidadValueTable = ({ dataSeleccionada, row, onChangeTable, disabled }) => {
	const [valorUnidad, setValorUnidad] = useState(
		row.unidad ? { ...row.unidad, label: row.unidad.prefijo } : null
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

		if (row.unidadMedida) {
			arrayFiltrado.push(data.filter(unidad => unidad.id === row.unidadMedida.id)[0]);
			arrayFiltrado.push(data.filter(unidad => unidad.id === row.unidadMedidaSecundaria.id)[0]);
		}
		setDataUnidades(
			arrayFiltrado.map(unidad => ({
				...unidad,
				label: unidad.prefijo,
			}))
		);
	};

	useEffect(() => {
		traerUnidades();
	}, []);

	return (
		<div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
			<Autocomplete
				style={{ width: '100%' }}
				disabled={disabled}
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
						dataSeleccionada.forEach(element => {
							if (element.id === row.id) {
								element.unidad = unidadValor;
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

export default TextFieldUnidadValueTable;

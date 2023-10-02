import { Autocomplete, TextField } from '@mui/material';
import { limitCombo, offsetCombo } from 'constants/constantes';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import httpClient from 'utils/Api';

const TextFieldUnidadValueTable = ({ dataSeleccionada, row, onChangeTable }) => {
	const routeParams = useParams();

	console.log('row', row);
	const [valorUnidad, setValorUnidad] = useState(
		(row.unidad && { ...row.unidad, label: row.unidad.nombre, value: row.unidad.id }) ||
			(row.unidadMedidaCompra && {
				...row.unidadMedidaCompra,
				label: row.unidadMedidaCompra.nombre,
				value: row.unidadMedidaCompra.id,
			}) ||
			null
	);

	console.log('valorUnidad', valorUnidad);
	const [dataUnidades, setDataUnidades] = useState([]);

	const traerUnidades = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `configuraciones/unidad-media?limit=${200}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		console.log('response', response);
		const data = await response.data.body[0];
		let arrayFiltrado = [];
		arrayFiltrado.push(data.filter(unidad => unidad.id === row.unidadMedida.id)[0]);
		arrayFiltrado.push(data.filter(unidad => unidad.id === row.unidadMedidaSecundaria.id)[0]);
		arrayFiltrado.push(data.filter(unidad => unidad.id === row.unidadMedidaCompra.id)[0]);
		console.log('arrayFiltrado', arrayFiltrado);

		// eliminar duplicados
		arrayFiltrado = arrayFiltrado.filter(
			(unidad, index, self) => index === self.findIndex(t => t.id === unidad.id)
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

	console.log('params', routeParams.id);

	return (
		<div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
			<Autocomplete
				disabled={routeParams.id !== 'nuevo'}
				style={{ width: '100%' }}
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

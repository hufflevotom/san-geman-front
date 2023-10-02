import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import httpClient from 'utils/Api';
import { limitCombo, offsetCombo } from 'constants/constantes';

function TipoOrdenCompra({ tipo }) {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	const [dataProveedores, setDataUnidades] = useState([]);
	const [proveedorTemporal, setProveedorTemporal] = useState(null);

	useEffect(() => {
		traerProveedores();
	}, []);

	const traerProveedores = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `comercial/proveedores?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataUnidades(data);
	};

	const opcionesTipo = [
		{
			value: 'PRODUCCION',
			label: 'PRODUCCIÓN',
		},
		{
			value: 'MUESTRA',
			label: 'MUESTRA',
		},
	];

	return (
		<>
			<Controller
				name="tipo"
				control={control}
				render={({ field: { onChange, value } }) => {
					const ordenCompra = value
						? {
								...value,
								label: value.value ? value.value : value,
						  }
						: null;
					return (
						<Autocomplete
							className="mt-8 mb-16 mx-12"
							// freeSolo
							disabled={tipo !== 'nuevo'}
							isOptionEqualToValue={(op, val) => op.id === val.id}
							options={opcionesTipo}
							value={ordenCompra}
							fullWidth
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
									placeholder="Seleccione el Tipo"
									label="Tipo de Orden de Compra"
									error={!!errors.tipoOrdenCompra}
									helperText={errors?.tipoOrdenCompra?.message}
									variant="outlined"
									fullWidth
									InputLabelProps={{
										shrink: true,
									}}
								/>
							)}
						/>
					);
				}}
			/>
		</>
	);
}

export default TipoOrdenCompra;

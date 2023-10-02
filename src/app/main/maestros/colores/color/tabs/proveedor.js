import { Autocomplete } from '@mui/material';
import debounce from 'lodash.debounce';
import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import httpClient from 'utils/Api';
import { limitCombo, offsetCombo } from 'constants/constantes';

function ProveedorTab(props) {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	const [dataProveedores, setDataUnidades] = useState([]);
	const [proveedorTemporal, setProveedorTemporal] = useState(null);

	const [proveedoresSearchText, setProveedoresSearchText] = useState('');

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

	const debouncedGetProveedores = debounce(() => {
		traerProveedores(proveedoresSearchText);
	}, 500);

	useEffect(() => {
		debouncedGetProveedores(); // Llamar a la versión debounced de fetchData
		return debouncedGetProveedores.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [proveedoresSearchText]);

	const opciones = dataProveedores.map(proveedor => ({
		...proveedor,
		label:
			proveedor.tipo === 'N'
				? `${proveedor.nombres} ${proveedor.apellidoMaterno} ${proveedor.apellidoPaterno}`
				: proveedor.razonSocial,
	}));

	return (
		<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
			<Controller
				name="proveedor"
				control={control}
				render={({ field: { onChange, value } }) => {
					const proveedor = value
						? {
								...value,
								label: value.tipo === 'N' ? value.nombres : value.razonSocial,
						  }
						: null;
					return (
						<Autocomplete
							className="mt-8 mb-16 mx-12"
							// multiple
							// freeSolo
							isOptionEqualToValue={(op, val) => op.id === val.id}
							options={opciones || []}
							value={proveedor}
							filterOptions={(options, state) => {
								return options;
							}}
							onInputChange={(event, newInputValue) => {
								setProveedoresSearchText(newInputValue);
								setProveedorTemporal({ ...proveedor, label: newInputValue });
							}}
							fullWidth
							onChange={(event, newValue) => {
								if (newValue) {
									const { label, ...valor } = newValue;
									onChange(valor);
									setProveedorTemporal(null);
								} else {
									onChange(null);
								}
							}}
							renderInput={params => (
								<TextField
									{...params}
									placeholder="Seleccione el proveedor"
									label="Proveedor"
									error={!!errors.proveedor}
									helperText={errors?.proveedor?.message}
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
		</div>
	);
}

export default ProveedorTab;

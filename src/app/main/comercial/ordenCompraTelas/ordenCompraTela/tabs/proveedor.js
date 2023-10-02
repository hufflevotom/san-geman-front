import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';

function Proveedor({
	getProveedores,
	proveedores,
	currentProveedor,
	setCurrentProveedor,
	resetProveedor,
	disabled,
	tipo,
}) {
	const opcionesProveedores = proveedores.map(e => ({
		...e,
		label: `${
			e.tipo === 'N' ? `${e.apellidoPaterno} ${e.apellidoMaterno}, ${e.nombres}` : e.razonSocial
		}`,
		key: e.id,
	}));

	const [value, setValue] = useState(null);

	useEffect(() => {
		if (currentProveedor) {
			const currentValue = {
				key: currentProveedor.id,
				label: `${
					currentProveedor.tipo === 'N'
						? `${currentProveedor.apellidoPaterno} ${currentProveedor.apellidoMaterno}, ${currentProveedor.nombres}`
						: currentProveedor.razonSocial
				}`,
			};
			setValue(currentValue);
		}
	}, [currentProveedor]);

	return (
		<Autocomplete
			className="mt-8 mb-16 mx-12"
			isOptionEqualToValue={(opc, v) => opc.id === v.id}
			options={opcionesProveedores}
			value={value}
			fullWidth
			disabled={disabled || tipo !== 'nuevo'}
			filterOptions={(options, state) => {
				return options;
			}}
			onInputChange={(event, newInputValue) => {
				getProveedores(newInputValue);
			}}
			onChange={(event, newValue) => {
				if (newValue?.id) {
					setValue(newValue);
					setCurrentProveedor(newValue);
				} else {
					resetProveedor();
				}
			}}
			renderInput={params => (
				<TextField
					{...params}
					placeholder="Seleccione un proveedor"
					label="Proveedor"
					required
					variant="outlined"
					InputLabelProps={{
						shrink: true,
					}}
					fullWidth
				/>
			)}
		/>
	);
}

export default Proveedor;

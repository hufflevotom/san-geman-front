import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

const Proveedor = ({
	getProveedores,
	proveedores,
	currentProveedor,
	setCurrentProveedor,
	resetProveedor,
	disabled,
}) => {
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
			disabled={disabled}
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
};

export default Proveedor;

/* eslint-disable no-lonely-if */
/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable spaced-comment */
import { useState } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import InputSelect from 'app/main/logistica/controlFacturas/controlFactura/components/inputSelect';
import InputNumber from 'app/main/logistica/controlFacturas/controlFactura/components/inputNumber';
import { Autocomplete, IconButton, TextField } from '@mui/material';

const Cantidades = ({ onChange, items, row, currentTipoServicio, colores }) => {
	const [currentColor, setCurrentColor] = useState(row.color);
	const [currentCantidad, setCurrentCantidad] = useState(row.cantidad);
	const [currentPrecioUnitario, setCurrentPrecioUnitario] = useState(row.precioUnitario);
	const [currentIgv, setCurrentIgv] = useState(row.igv);

	const actualizar = (val, key) => {
		const itemsCopy = structuredClone(items);
		itemsCopy.forEach(item => {
			if (item.id === row.id) {
				item[key] = val;
				item.igv = (item.cantidad * item.precioUnitario * 0.18).toFixed(2);
			}
		});

		onChange(itemsCopy);
	};

	return (
		<div
			className="flex flex-row"
			style={{
				alignItems: 'center',
				width: 'calc(100%-30px)',
				margin: 0,
				padding: 0,
				marginLeft: '12px',
				marginRight: '12px',
				marginBottom: '12px',
			}}
		>
			<Autocomplete
				className="mt-8 mb-16 mx-12"
				isOptionEqualToValue={(opc, v) => opc.key === v.key}
				options={colores}
				value={currentColor}
				fullWidth
				filterOptions={(options, state) => {
					return options;
				}}
				onChange={(event, newValue) => {
					if (newValue?.id) {
						actualizar(newValue, 'color');
						setCurrentColor(newValue);
					}
				}}
				renderInput={params => (
					<TextField
						{...params}
						placeholder="Seleccione el color"
						label="Color"
						variant="outlined"
						InputLabelProps={{
							shrink: true,
						}}
						fullWidth
					/>
				)}
			/>
			<InputSelect
				label="Unidad"
				options={[
					{
						label: 'UNIDAD',
						key: 'NIU',
						id: 'NIU',
					},
					{
						label: 'KILOGRAMO',
						key: 'KGM',
						id: 'KGM',
					},
					{
						label: 'METRO',
						key: 'MTR',
						id: 'MTR',
					},
				]}
				value={row.unidadMedida}
				onChange={(e, newValue) => actualizar(newValue, 'unidadMedida')}
			/>
			<InputNumber
				label="Cantidad"
				value={currentCantidad}
				onBlur={event => {
					actualizar(event.target.value, 'cantidad');
				}}
				onChange={event => {
					const subTotal = currentPrecioUnitario * currentCantidad;
					setCurrentIgv((subTotal * 0.18).toFixed(2));
					setCurrentCantidad(event.target.value);
				}}
			/>
			<InputNumber
				label="Precio Unitario"
				value={currentPrecioUnitario}
				onBlur={event => {
					actualizar(event.target.value, 'precioUnitario');
				}}
				onChange={event => {
					const subTotal = currentPrecioUnitario * currentCantidad;
					setCurrentIgv((subTotal * 0.18).toFixed(2));
					setCurrentPrecioUnitario(event.target.value);
				}}
			/>
			{currentTipoServicio?.id !== 'IN' && (
				<InputNumber
					label="IGV"
					value={currentIgv}
					onBlur={event => {
						actualizar(event.target.value, 'igv');
					}}
					onChange={event => {
						setCurrentIgv(event.target.value);
					}}
					disabled
				/>
			)}
			<div
				style={{ backgroundColor: '#F5FBFA', /* marginBottom: '100px',  */ borderRadius: '50px' }}
			>
				<IconButton
					aria-label="delete"
					color="error"
					onClick={() => {
						const itemsCopy = structuredClone(items);
						const itemsDelete = itemsCopy.filter(item => item.id !== row.id);
						onChange(itemsDelete);
					}}
				>
					<DeleteForeverIcon />
				</IconButton>
			</div>
		</div>
	);
};

export default Cantidades;

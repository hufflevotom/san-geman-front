import { useState } from 'react';

import { TextField } from '@mui/material';

function Costos({ index, cantidad, j, data, setData, currentTipoServicio, disabled }) {
	const [valCosto, setValCosto] = useState(cantidad.costo || 0);
	const [valSubtotal, setValSubtotal] = useState(cantidad.subTotal || 0);
	const [valIGV, setValIGV] = useState(cantidad.igv || 0);

	const actualizarFila = (value, keyname) => {
		const dd = [...data];
		dd[j].cantidades[index][keyname] = value;
		const subTotal =
			cantidad.ordenCortePañoCantidades.cantidadesCorte.reduce((a, b) => a + b, 0) * valCosto;
		dd[j].cantidades[index].igv = subTotal * 0.18;
		dd[j].cantidades[index].subTotal = subTotal;
		setValIGV(dd[j].cantidades[index].igv);
		setValSubtotal(dd[j].cantidades[index].subTotal);
		//
		setData(dd);
	};

	return (
		<div
			className="mt-8 mb-16 mx-12"
			style={{
				display: 'flex',
				flexDirection: 'row',
				gap: '20px',
				alignItems: 'center',
				width: '100%',
				marginRigth: '20px',
			}}
		>
			<TextField
				id="costo"
				key={`costo${index}`}
				name="costo"
				placeholder="Precio Unitario"
				label="Precio Unitario"
				variant="outlined"
				fullWidth
				disabled={disabled}
				value={valCosto}
				type="number"
				InputProps={{
					inputProps: { min: 0 },
				}}
				onBlur={() => {
					actualizarFila(valCosto, 'costo');
				}}
				onChange={event => {
					setValCosto(event.target.value);
				}}
			/>
			<TextField
				id="subTotal"
				key={`subTotal${index}`}
				name="subTotal"
				placeholder="Precio Total"
				label="Precio Total"
				variant="outlined"
				fullWidth
				disabled
				value={valSubtotal}
				type="number"
				InputProps={{
					inputProps: { min: 0 },
				}}
			/>
			{currentTipoServicio.id !== 'IN' && (
				<TextField
					id="igv"
					key={`igv${index}`}
					name="igv"
					placeholder="IGV"
					label="IGV"
					variant="outlined"
					fullWidth
					disabled
					value={valIGV}
					type="number"
					InputProps={{
						inputProps: { min: 0 },
					}}
				/>
			)}
		</div>
	);
}

export default Costos;

/* eslint-disable no-nested-ternary */
import { Autocomplete, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';

const Partidas = ({
	currentPartida,
	setCurrentPartida,
	setCurrentColor,
	uniquePartidas,
	getProductosTelas,
	resetPartida,
	currentProduccion,
	currentColor,
	disabled,
	action,
}) => {
	const opcionesPartidas = uniquePartidas.map(partida => ({
		...partida,
		label: partida.partida,
		key: partida.partida,
	}));

	const [value, setValue] = useState([]);

	useEffect(() => {
		const currentValue = currentPartida.map(partida => ({
			...partida,
			id: partida.id,
			label: partida.partida,
		}));

		setValue(currentValue);
	}, [currentPartida]);

	return (
		<>
			<Autocomplete
				multiple
				disabled={!currentProduccion || disabled || action}
				className="mt-8 mb-16 mx-12"
				isOptionEqualToValue={(opc, val) => opc.id === val.id}
				options={opcionesPartidas}
				value={value}
				fullWidth
				renderOption={(props, option) => {
					return (
						<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
							{option.label}
							{option.origen === 1 ? '' : option.origen === -1 ? ' (No pertenece)' : ' (Asignado)'}
						</Box>
					);
				}}
				getOptionDisabled={option =>
					currentColor ? option?.color?.id !== currentColor?.id : false
				}
				filterOptions={(options, state) => {
					return options;
				}}
				onInputChange={(event, newInputValue) => {
					getProductosTelas(newInputValue);
				}}
				onChange={(event, newValue) => {
					if (newValue?.length > 0) {
						setCurrentPartida(newValue);
						setCurrentColor(newValue[0].color);
					} else {
						resetPartida();
					}
				}}
				renderInput={params => (
					<TextField
						{...params}
						placeholder="Seleccione una partida"
						label="Partida"
						required
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
};

export default Partidas;

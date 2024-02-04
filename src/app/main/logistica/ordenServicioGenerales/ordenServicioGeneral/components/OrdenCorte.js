import { Autocomplete, Box, Chip, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

const OrdenCorte = ({
	getOrdenesCorte,
	uniqueOrdenesCorte,
	currentOrdenesCorte,
	setCurrentOrdenesCorte,
	resetOrdenCorte,
	currentProduccion,
	disabled,
	corte,
	setCorte,
}) => {
	const opcionesOrdenesCorte = uniqueOrdenesCorte.map(ordenesCorte => ({
		...ordenesCorte,
		label: ordenesCorte.codigo,
		key: ordenesCorte.id,
	}));

	const [value, setValue] = useState([]);

	useEffect(() => {
		if (currentOrdenesCorte && currentOrdenesCorte.length > 0) {
			const currentValue = currentOrdenesCorte.map(e => ({
				...e,
				id: e.id,
				label: `${e.codigo}`,
			}));
			setValue(currentValue);
		}
	}, [currentOrdenesCorte]);

	return (
		<>
			<Autocomplete
				multiple
				key="ordenesCorte"
				disabled={!currentProduccion || disabled}
				className="mt-8 mb-16 mx-12"
				isOptionEqualToValue={(opc, val) => opc.id === val.id}
				options={opcionesOrdenesCorte || []}
				value={value}
				fullWidth
				filterOptions={(options, state) => {
					return options;
				}}
				onInputChange={(event, newInputValue) => {
					getOrdenesCorte(newInputValue);
				}}
				onChange={(event, newValue) => {
					if (newValue?.length > 0) {
						setValue(newValue);
						setCurrentOrdenesCorte(newValue);
						setCorte(!newValue[0].ordenesCorte[0].panios);
					} else {
						resetOrdenCorte();
						setCorte();
					}
				}}
				getOptionDisabled={option => option.ordenesCorte[0].panios === corte}
				renderOption={(props, option) => {
					return (
						<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
							{option.label}
							{
								option.ordenesCorte[0].panios && (
									<Chip
										label="Corte de paños"
										color="success"
										size="small"
										variant="outlined"
										style={{ marginLeft: 10 }}
									/>
								)
								// : (
								// 	<Chip
								// 		label="Sin corte de paños"
								// 		color="warning"
								// 		variant="outlined"
								// 		style={{ marginLeft: 10 }}
								// 	/>
								// )
							}
						</Box>
					);
				}}
				renderTags={(valueTag, getTagProps) => {
					return valueTag.map((option, index) => {
						return (
							<Chip
								key={index}
								label={option.label}
								color={option.ordenesCorte[0].panios ? 'success' : 'default'}
								size="small"
								variant="outlined"
								// style={{ backgroundColor: option.ordenesCorte[0].panios ? '#FFB52C' : '#EBEBEB' }}
								{...getTagProps({ index })}
							/>
						);
					});
				}}
				renderInput={params => (
					<TextField
						{...params}
						placeholder="Seleccione una orden de corte"
						label="Ordenes de corte"
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

export default OrdenCorte;

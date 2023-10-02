import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

const Estilos = ({
	currentEstilos,
	setCurrentEstilos,
	setCurrentTipoPrenda,
	estilos,
	resetEstilos,
	currentTelas,
	currentColor,
	crearTablaTizados,
	filterTelaPrincipal,
	disabled,
	action,
}) => {
	const [value, setValue] = useState([]);
	const [opcionesEstilos, setOpcionesEstilos] = useState([]);

	useEffect(() => {
		const filtroEstilos = [];

		estilos.forEach(e => {
			currentTelas.forEach(t => {
				if (e.telasEstilos.find(te => te.tela.id === t.tela.id)) {
					filtroEstilos.push({
						...e,
						key: e.id,
						label: `${e.estilo}`,
					});
				}
			});
		});

		const idEstilos = [];
		const opTemp = [];
		filtroEstilos.forEach(estilo => {
			if (!idEstilos.includes(estilo.id)) {
				idEstilos.push(estilo.id);
				if (currentEstilos.length > 0) {
					if (currentEstilos[0].prenda.id === estilo.prenda.id) {
						estilo.acc = false;
					} else {
						estilo.acc = true;
					}
				}

				opTemp.push(estilo);
			}
		});

		setOpcionesEstilos(opTemp);
	}, [currentTelas, currentEstilos]);

	useEffect(() => {
		const currentValue = currentEstilos.map(e => ({
			...e,
			id: e.id,
			label: `${e.estilo}`,
		}));

		setValue(currentValue);
	}, [currentEstilos]);

	return (
		<Autocomplete
			multiple
			key="estilos"
			disabled={opcionesEstilos.length === 0 || disabled || action}
			className="mt-8 mb-16 mx-12"
			isOptionEqualToValue={(op, val) => op.id === val.id}
			options={opcionesEstilos || []}
			value={value}
			fullWidth
			filterOptions={(options, state) => options}
			getOptionDisabled={option => option.acc || false}
			onChange={(event, newValue) => {
				if (newValue.length > 0) {
					setCurrentEstilos(newValue);
					console.info('Form.Estilos: ', newValue);
					crearTablaTizados(newValue, currentTelas, currentColor);
					filterTelaPrincipal(newValue);
					console.info('Form.TipoPrenda: ', newValue[0].prenda);
					setCurrentTipoPrenda(newValue[0].prenda);
				} else {
					resetEstilos();
				}
			}}
			renderInput={params => (
				<TextField
					{...params}
					placeholder="Seleccione los estilos"
					label="Estilos"
					required
					fullWidth
					variant="outlined"
					InputLabelProps={{
						shrink: true,
					}}
				/>
			)}
		/>
	);
};

export default Estilos;

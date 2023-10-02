/* eslint-disable no-nested-ternary */
import { Autocomplete, TableCell, TextField } from '@mui/material';
import { limitCombo, offsetCombo } from 'constants/constantes';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import httpClient from 'utils/Api';

const TableCabecera = ({ vall, valueDataEstilo, disable }) => {
	const [dataTallas, setDataTallas] = useState([]);
	const getTallas = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `maestro/tallas?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataTallas(data);
	};

	const opcionesTallas = dataTallas.map(talla => ({
		...talla,
		label: talla.prefijo || talla.talla,
	}));
	const methods = useFormContext();
	const { setValue } = methods;
	const valorTalla = vall
		? vall.talla
			? { ...vall.talla, label: vall.talla.prefijo }
			: null
		: null;
	const pedido = useSelector(({ comercial }) => comercial.pedido);

	useEffect(() => {
		getTallas();
	}, []);

	return (
		<TableCell
			align="center"
			style={{
				width: '100px',
				border: '1px solid rgb(255 255 255)',
				borderBottomColor: 'rgb(224 224 224)',
				borderLeftColor: 'rgb(233 233 233)',
				borderRightColor: 'rgb(233 233 233)',
			}}
		>
			{!disable ? (
				<Autocomplete
					disabled={pedido?.asignado}
					isOptionEqualToValue={(op, val) => op.id === val.id}
					options={opcionesTallas}
					value={valorTalla}
					onInputChange={(event, newValue) => {
						getTallas(newValue);
					}}
					onChange={(event, newValue) => {
						if (
							valueDataEstilo.cantidades.find(
								element =>
									element.talla?.id === newValue?.id && element.estilo.id === vall?.estilo.id
							)
						) {
							toast.warning('Este estilo ya tiene la talla seleccionada');
							return;
						}
						const cantidadesArr = [];
						const cantidadesPorcentajeArr = [];
						let concidencia = false;

						valueDataEstilo.cantidades.forEach(element => {
							let talla = element.talla || null;
							if (element.estilo.id === vall?.estilo.id) {
								if (element.talla && vall?.talla) {
									if (element.talla.id === vall?.talla.id) {
										concidencia = true;
										talla = newValue;
									}
								} else if (!element.talla) {
									talla = newValue;
								}
							}
							cantidadesArr.push({ ...element, talla });
						});

						valueDataEstilo.cantidadesPorcentaje.forEach(element => {
							let talla = element.talla || null;
							if (element.estilo.id === vall.estilo.id) {
								if (element.talla && vall.talla) {
									if (element.talla.id === vall.talla.id) {
										concidencia = true;
										talla = newValue;
									}
								} else if (!element.talla) {
									talla = newValue;
								}
							}
							cantidadesPorcentajeArr.push({ ...element, talla });
						});

						setValue('dataEstilos', {
							...valueDataEstilo,
							cantidades: cantidadesArr,
							cantidadesPorcentaje: cantidadesPorcentajeArr,
						});
					}}
					fullWidth
					renderInput={params => (
						<>
							<div className="inline-flex">
								<TextField
									{...params}
									placeholder="Talla"
									label="Talla"
									style={{ width: '100px' }}
									required
									variant="outlined"
									InputLabelProps={{
										shrink: true,
									}}
								/>
							</div>
						</>
					)}
				/>
			) : (
				<div>{valorTalla ? valorTalla.prefijo : ''}</div>
			)}
		</TableCell>
	);
};

export default TableCabecera;

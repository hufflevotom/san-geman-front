import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const TextFieldValue = ({
	indice,
	cantidadInicial,
	valueDataEstilo,
	porcentaje = false,
	desactivado = false,
}) => {
	const methods = useFormContext();
	const { setValue } = methods;
	const [cantidad, setCantidad] = useState();

	useEffect(() => {
		if (porcentaje) {
			valueDataEstilo.cantidadesPorcentaje.forEach(element => {
				if (
					element.color.id === cantidadInicial.color.id &&
					element.orden === cantidadInicial.orden &&
					element.estilo.id === cantidadInicial.estilo.id
				) {
					setCantidad(element.cantidad);
				}
			});
		} else {
			valueDataEstilo.cantidades.forEach(element => {
				if (element.id === cantidadInicial.id) {
					setCantidad(element.cantidad);
				}
			});
		}
	}, [cantidadInicial]);

	return !porcentaje ? (
		<TextField
			disabled={desactivado}
			key={indice}
			type="number"
			InputProps={{
				inputProps: { min: 0 },
			}}
			value={cantidad}
			onChange={e => {
				setCantidad(parseInt(e.target.value, 10).toString());
			}}
			onBlur={() => {
				const cantidadesArr = [];
				const cantidadesPorcentajeArr = [];

				valueDataEstilo.cantidades.forEach(element => {
					let qty = element.cantidad || 0;
					if (element.id === cantidadInicial.id) {
						valueDataEstilo.cantidadesPorcentaje.forEach(elementPorcentaje => {
							let cantidadPor = elementPorcentaje.cantidad || 0;
							if (
								elementPorcentaje.color.id === cantidadInicial.color.id &&
								elementPorcentaje.orden === cantidadInicial.orden &&
								elementPorcentaje.estilo.id === cantidadInicial.estilo.id
							) {
								let aaa = parseInt(cantidad, 10) * (elementPorcentaje.porcentaje / 100 + 1);
								aaa = Math.round(aaa * 1e12) / 1e12;
								if (aaa % 1 !== 0) {
									cantidadPor = parseInt(aaa, 10) + 1;
								} else {
									cantidadPor = parseInt(aaa, 10);
								}
							}
							cantidadesPorcentajeArr.push({ ...elementPorcentaje, cantidad: cantidadPor });
						});
						qty = parseInt(cantidad, 10);
					}
					cantidadesArr.push({ ...element, cantidad: qty });
				});

				setValue('dataEstilos', {
					...valueDataEstilo,
					cantidades: cantidadesArr,
					cantidadesPorcentaje: cantidadesPorcentajeArr,
				});
			}}
			style={{ width: '100px' }}
			required
			variant="outlined"
		/>
	) : (
		<TextField
			disabled={desactivado}
			key={indice}
			type="number"
			InputProps={{
				inputProps: { min: 0 },
			}}
			value={cantidad}
			onChange={e => {
				setCantidad(parseInt(e.target.value, 10).toString());
			}}
			onBlur={() => {
				const cantidadesPorcentajeArr = [];

				valueDataEstilo.cantidadesPorcentaje.forEach(element => {
					let qty = element.cantidad || 0;
					if (element.id === cantidadInicial.id) {
						qty = parseInt(cantidad, 10);
					}
					cantidadesPorcentajeArr.push({ ...element, cantidad: qty });
				});

				setValue('dataEstilos', {
					...valueDataEstilo,
					cantidadesPorcentaje: cantidadesPorcentajeArr,
				});
			}}
			style={{ width: '100px' }}
			required
			variant="outlined"
		/>
	);
};

export default TextFieldValue;

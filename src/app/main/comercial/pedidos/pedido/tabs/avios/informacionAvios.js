/* eslint-disable no-case-declarations */
/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import { setDataAvios } from 'app/main/comercial/store/pedido/resumenPedidoSlice';
import { Controller, useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { dataAvios } from './constante';

const InformacionAvios = () => {
	const methods = useFormContext();
	const { control, watch } = methods;
	const data = watch('dataEstilos');

	const dispatch = useDispatch();

	const cambiarSilica = ({ arrAvios, cantidadAlX, avio }) => {
		//* Calcula las unidades y cantidad de silica por caja
		let unidadesNuevas = 0;
		let cantidadNueva = 0;
		const cajas = arrAvios.filter(a => a.avios.familiaAvios.id === 8 && a.avios.calcularCajas);
		let totalCajas = cajas.reduce((a, b) => a + b.cantidad * cantidadAlX, 0);
		const decimales = totalCajas % 1;
		if (decimales > 0) {
			totalCajas += 1 - decimales;
		}
		if (totalCajas > 0) {
			cantidadNueva = totalCajas;
			unidadesNuevas = totalCajas * avio.cantidadUnidad;
		}
		return { unidadesNuevas, cantidadNueva };
	};

	const cambiarSticker = ({ arrAvios, cantidadAlX, avio }) => {
		let unidadesNuevas = 0;
		let cantidadNueva = 0;
		if (avio.cantidad && avio.cantidad > 0) {
			//* Si el avio tiene cantidad, son cantidades por prenda
			cantidadNueva = cantidadAlX;
			unidadesNuevas = cantidadAlX * avio.cantidad;
		} else {
			//* Si el avio tiene cantidadUnidad, son cantidades por caja
			const cajas = arrAvios.filter(a => a.avios.familiaAvios.id === 8 && a.avios.calcularCajas);
			let totalCajas = cajas.reduce((a, b) => a + b.cantidad * cantidadAlX, 0);
			const decimales = totalCajas % 1;
			if (decimales > 0) {
				totalCajas += 1 - decimales;
			}
			if (totalCajas > 0) {
				cantidadNueva = totalCajas;
				unidadesNuevas = totalCajas * avio.cantidadUnidad;
			}
		}
		return { unidadesNuevas, cantidadNueva };
	};

	return (
		<div>
			<Controller
				name="aviosPo"
				control={control}
				render={({ field: { onChange, value } }) => {
					// Guardar la data de aviosPo
					/* onChange([...value]);
					 */
					const aviosPo = data?.estilos?.map(estilo => {
						const arrayFilas = [];
						const dataFilas = [];

						estilo.estiloAvios.forEach(e => {
							let cantidadAlX = 0;
							let unidadesTotal = 0;

							data.cantidadesPorcentaje
								.filter(c => c.estilo.estilo === estilo.estilo)
								.forEach(cantidad => {
									if (e.colores.length > 0 && e.avios.talla) {
										e.colores.forEach(color => {
											if (
												color.id === cantidad.color.id &&
												cantidad.talla &&
												cantidad.talla.id === e.avios.talla.id
											) {
												cantidadAlX += cantidad.cantidad;
											}
										});
									} else if (e.colores.length > 0) {
										e.colores.forEach(color => {
											if (color.id === cantidad.color.id) {
												cantidadAlX += cantidad.cantidad;
											}
										});
									} else if (e.avios.talla) {
										if (cantidad.talla && cantidad.talla.id === e.avios.talla.id)
											cantidadAlX += cantidad.cantidad;
									} else {
										cantidadAlX += cantidad.cantidad;
									}
								});

							if (e.avios.hilos) {
								unidadesTotal = (parseFloat(e.cantidad) / 5000) * cantidadAlX;
							} else if (e.avios?.familiaAvios?.id === 8) {
								unidadesTotal = parseFloat(e.cantidad) * cantidadAlX;
							} else if (e.avios?.familiaAvios?.id === 9) {
								unidadesTotal = parseFloat(e.cantidad) * cantidadAlX;
							} else {
								unidadesTotal = e?.cantidadUnidad
									? e.cantidadUnidad * cantidadAlX
									: e.cantidad * cantidadAlX;
							}

							const decimalesTotal = unidadesTotal.toString().split('.')[1];
							unidadesTotal =
								decimalesTotal && parseInt(decimalesTotal, 10) > 0
									? parseInt(unidadesTotal.toString().split('.')[0], 10) + 1
									: unidadesTotal;

							if (cantidadAlX > 0) {
								if (e.avios.familiaAvios.id === 13 || e.avios.familiaAvios.id === 7) {
									if (e.avios.familiaAvios.id === 13) {
										const silica = cambiarSilica({
											arrAvios: estilo.estiloAvios,
											cantidadAlX,
											avio: e,
										});
										unidadesTotal = silica.unidadesNuevas;
										cantidadAlX = silica.cantidadNueva;
									}
									if (e.avios.familiaAvios.id === 7) {
										const sticker = cambiarSticker({
											arrAvios: estilo.estiloAvios,
											cantidadAlX,
											avio: e,
										});
										unidadesTotal = sticker.unidadesNuevas;
										cantidadAlX = sticker.cantidadNueva;
									}
								}

								arrayFilas.push(
									<Fila
										unidadesTotal={unidadesTotal}
										cantidadAlX={cantidadAlX}
										e={e}
										colores={e.colores.length === data.cantidadesPorcentaje.length ? [] : e.colores}
									/>
								);

								dataFilas.push({
									cantidad: e.avios.hilos ? parseFloat((e.cantidad / 5000).toFixed(2)) : e.cantidad,
									cantidadPorcentaje: cantidadAlX,
									unidad: unidadesTotal,
									unidadMedidaId: e.unidadMedida?.id,
									estiloId: estilo.id,
									avioId: e.avios.id,
									coloresId: e.colores.map(c => c.id),
									avioNombre: `${
										e.avios.familiaAvios?.id === 1
											? `${e.avios.nombre} - ${e.avios.codigoSec} - ${e.avios.marcaHilo} - ${
													e.avios.color?.descripcion
											  }${e.avios.talla ? ` - Talla: ${e.avios.talla.prefijo}` : ''}`
											: `${e.avios.nombre}${
													e.avios.talla ? ` - Talla: ${e.avios.talla.prefijo}` : ''
											  }`
									}`,
								});
							}
						});

						dataAvios[estilo.estilo] = [...dataFilas];
						dispatch(setDataAvios({ ...dataAvios }));

						return (
							<>
								<div key={estilo.id}>
									<h3>Estilo: {estilo.estilo}</h3>
									<TableContainer component={Paper} style={{ marginTop: 20 }}>
										<Table aria-label="simple table">
											<TableHead>
												<TableRow>
													<TableCell
														style={{
															maxWidth: '160px',
														}}
														rowSpan={3}
														colSpan={1}
														width={200}
														align="center"
													>
														AVIOS
													</TableCell>
													<TableCell
														style={{
															maxWidth: '160px',
														}}
														rowSpan={3}
														colSpan={1}
														width={200}
														align="center"
													>
														CANT X UNIDAD
													</TableCell>

													<TableCell
														style={{
															maxWidth: '160px',
														}}
														rowSpan={3}
														colSpan={1}
														width={200}
														align="center"
													>
														CANTIDAD AL 10X %
													</TableCell>

													<TableCell
														style={{
															maxWidth: '160px',
														}}
														rowSpan={3}
														colSpan={1}
														width={200}
														align="center"
													>
														COLORES
													</TableCell>
													<TableCell
														style={{
															maxWidth: '160px',
														}}
														rowSpan={3}
														colSpan={1}
														width={200}
														align="center"
													>
														UNIDADES TOTALES
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>{arrayFilas}</TableBody>
										</Table>
									</TableContainer>
									<br />
									<br />
								</div>
							</>
						);
					});

					return aviosPo;
				}}
			/>
		</div>
	);
};

const Fila = ({ cantidadAlX, unidadesTotal, e, colores }) => {
	return (
		<TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
			<TableCell
				scope="row"
				align="center"
				style={{
					border: '1px solid rgb(255 255 255)',
					borderBottomColor: 'rgb(224 224 224)',
					borderRightColor: 'rgb(233 233 233)',
				}}
			>
				{`${
					e.avios.familiaAvios?.id === 1
						? `${e.avios.nombre} - ${e.avios.codigoSec} - ${e.avios.marcaHilo} - ${
								e.avios.color?.descripcion
						  }${e.avios.talla ? ` - Talla: ${e.avios.talla.prefijo}` : ''}`
						: `${e.avios.nombre}${e.avios.talla ? ` - Talla: ${e.avios.talla.prefijo}` : ''}`
				}`}
			</TableCell>
			<TableCell
				scope="row"
				align="center"
				style={{
					border: '1px solid rgb(255 255 255)',
					borderBottomColor: 'rgb(224 224 224)',
					borderRightColor: 'rgb(233 233 233)',
				}}
			>
				{e.avios.hilos
					? (parseFloat(e.cantidad) / 5000).toFixed(4)
					: e.avios?.familiaAvios?.id === 8
					? parseFloat(e.cantidad).toFixed(4)
					: e.avios?.familiaAvios?.id === 9
					? parseFloat(e.cantidad).toFixed(4)
					: e?.cantidadUnidad
					? e.cantidadUnidad
					: e.cantidad}
			</TableCell>

			<TableCell
				scope="row"
				align="center"
				style={{
					border: '1px solid rgb(255 255 255)',
					borderBottomColor: 'rgb(224 224 224)',
					borderRightColor: 'rgb(233 233 233)',
				}}
			>
				{cantidadAlX}
			</TableCell>
			<TableCell
				scope="row"
				align="center"
				style={{
					border: '1px solid rgb(255 255 255)',
					borderBottomColor: 'rgb(224 224 224)',
					borderRightColor: 'rgb(233 233 233)',
				}}
			>
				{(colores.length !== 0 ? colores : [{ descripcion: 'Todos' }]).map((color, index) =>
					index === 0 ? `${color.descripcion}` : `, ${color.descripcion}`
				)}
			</TableCell>
			<TableCell
				scope="row"
				align="center"
				style={{
					border: '1px solid rgb(255 255 255)',
					borderBottomColor: 'rgb(224 224 224)',
					borderRightColor: 'rgb(233 233 233)',
				}}
			>
				{unidadesTotal}
			</TableCell>
		</TableRow>
	);
};

export default InformacionAvios;

import { useEffect, useState } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { Container, Draggable } from 'react-smooth-dnd';
import { arrayMoveImmutable } from 'array-move';
import { useSelector } from 'react-redux';

function OrdenTallas(props) {
	const methods = useFormContext();
	const { control, watch, setValue } = methods;

	const [checked, setChecked] = useState([]);

	const data = watch('dataEstilos');

	const guardar = (newChecked, onChange) => {
		newChecked.forEach((a, i) => {
			a.orden = i;
			delete a.activo;
		});
		const array = [];
		if (newChecked.length > 0) {
			newChecked.forEach(talla => {
				const tallaObj = {
					id: talla.id,
					idRegistro: talla.idRegistro,
					label: talla.label,
					orden: talla.orden,
					talla,
				};

				array.push(tallaObj);
			});

			onChange(array);
		}
	};

	const obtenerTallas = () => {
		console.log('HV.obtener', data);
		const tallasArr = [];
		const tallasVal = [];
		data?.cantidadesPorcentaje?.forEach(cantidad => {
			if (!tallasVal.includes(cantidad.talla?.id)) {
				tallasVal.push(cantidad.talla?.id);
				tallasArr.push({
					id: cantidad?.talla?.id,
					idRegistro: cantidad?.talla?.id,
					label: cantidad.talla?.talla,
					orden: tallasArr.length,
					talla: cantidad.talla,
				});
			}
		});
		setChecked(tallasArr.sort((a, b) => a.orden - b.orden));
		setValue(
			'ordenTallas1',
			tallasArr.sort((a, b) => a.orden - b.orden)
		);
	};

	useEffect(() => {
		obtenerTallas();
	}, [data]);

	const pedido = useSelector(state => state.comercial.pedido);
	console.log('HV.pedido', pedido);

	useEffect(() => {
		if (pedido) {
			const newOrden = [];
			const tallasArr = [];
			const tallasVal = [];

			if (pedido.cantidadesPorcentaje && pedido.cantidadesPorcentaje.length > 0) {
				pedido?.cantidadesPorcentaje?.forEach(cantidad => {
					if (!tallasVal.includes(cantidad.talla?.id)) {
						tallasVal.push(cantidad.talla?.id);
						tallasArr.push({
							id: cantidad?.talla?.id,
							idRegistro: cantidad?.talla?.id,
							label: cantidad.talla?.talla,
							talla: cantidad.talla,
						});
					}
				});
			}

			if (pedido.ordenTallas && pedido.ordenTallas.length > 0) {
				tallasArr.forEach(talla => {
					newOrden.push({
						...talla,
						orden: pedido.ordenTallas?.find(ot => ot.talla.id === talla.id)?.orden,
					});
				});
			} else {
				tallasArr.forEach((talla, i) => {
					newOrden.push({
						...talla,
						orden: i,
					});
				});
			}

			const tallasOrdenadas = newOrden.sort((a, b) => a.orden - b.orden);

			setChecked(tallasOrdenadas);
			setValue('ordenTallas1', tallasOrdenadas);
		}
	}, [pedido]);

	return (
		<div>
			<Controller
				name="ordenTallas1"
				control={control}
				render={({ field: { onChange, value: vvvvv } }) => {
					return (
						<div className="flex flex-col sm:flex-row mr-40 sm:mr-4 ml-16">
							<div className="pb-40" style={{ width: '100%' }}>
								<div style={{ padding: '0 0 10px 20px' }}>Arrastre y ordene las tallas</div>
								<List sx={{ marginLeft: '10px' }}>
									<Container
										dragHandleSelector=".drag-handle"
										lockAxis="y"
										onDrop={({ removedIndex, addedIndex }) => {
											if (!pedido?.asignado) {
												const ordenado = it => arrayMoveImmutable(it, removedIndex, addedIndex);
												setChecked(ordenado);
												guardar(arrayMoveImmutable(checked, removedIndex, addedIndex), onChange);
											}
										}}
									>
										{checked.length > 0 &&
											checked.map(({ id, label }, index) => (
												<Draggable
													key={id}
													className="shadow-md shadow-slate-500"
													style={{ margin: '10px', borderRadius: '10px' }}
												>
													<ListItem className="drag-handle">
														<div style={{ paddingRight: '25px' }}>N° {index + 1}</div>
														<ListItemText primary={label} />
													</ListItem>
												</Draggable>
											))}
									</Container>
								</List>
							</div>
						</div>
					);
				}}
			/>
		</div>
	);
}

export default OrdenTallas;

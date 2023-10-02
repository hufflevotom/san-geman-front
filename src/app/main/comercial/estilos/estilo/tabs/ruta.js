import {
	Checkbox,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { limitCombo, offsetCombo } from 'constants/constantes';
import httpClient from 'utils/Api';
import { Container, Draggable } from 'react-smooth-dnd';
import { arrayMoveImmutable } from 'array-move';
import { useSelector } from 'react-redux';

function Ruta({ disabled }) {
	const methods = useFormContext();
	const { control, formState } = methods;

	const [dataRutas, setDataRutas] = useState([]);

	const [checked, setChecked] = React.useState([]);

	const guardar = (newChecked, onChange) => {
		newChecked.forEach((a, i) => {
			a.orden = i;
			delete a.activo;
		});
		const array = [];
		if (newChecked.length > 0) {
			newChecked.forEach(ruta => {
				const rutasEstilos = {
					ruta,
					orden: ruta.orden,
					id: ruta.idRegistro,
				};

				array.push(rutasEstilos);
			});

			onChange(array);
		}
	};

	const handleToggle = (value, onChange) => () => {
		if (disabled) return;
		const idChecked = checked.find(a => a.id === value.id);
		const newChecked = [...checked];

		if (idChecked) {
			const currentIndex = checked.indexOf(idChecked);
			newChecked.splice(currentIndex, 1);
		} else {
			newChecked.push(value);
		}

		// newChecked.forEach((a, i) => {
		// 	a.orden = i;
		// 	delete a.activo;
		// });

		setChecked(newChecked);
		guardar(newChecked, onChange);
	};

	useEffect(() => {
		traerRutas();
	}, []);

	const traerRutas = async busqueda => {
		let b = '';
		if (busqueda) {
			b = busqueda.trim();
		}
		const url = `comercial/rutas?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${b}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataRutas(data);
	};

	const rutEstilos = useSelector(state => state.comercial);

	useEffect(() => {
		if (rutEstilos.estilo) {
			let newEstilos = [];
			if (rutEstilos.estilo.rutasEstilos && rutEstilos.estilo.rutasEstilos.length > 0) {
				newEstilos = [...rutEstilos.estilo?.rutasEstilos];
			}
			const rutEstilosOrdenado = newEstilos.sort((a, b) => a.orden - b.orden);
			const vv = rutEstilosOrdenado.map(rut => {
				const { activo, ...aaaa } = rut;
				return { ...aaaa.ruta, orden: rut.orden, idRegistro: aaaa.id };
			});

			setChecked(vv);
		}
	}, [rutEstilos]);

	return (
		<div>
			<Controller
				name="rutasEstilos"
				control={control}
				render={({ field: { onChange, value: vvvvv } }) => {
					// ordenar por id

					return (
						<div className="flex flex-col sm:flex-row mr-40 sm:mr-4 ml-16">
							<div className="pb-40" style={{ width: '100%' }}>
								<div style={{ padding: '0 0 10px 0' }}>
									Selecciona las rutas que tomará el estilo:
								</div>
								<List sx={{ width: '100%', marginRight: '10px', borderRight: '2px solid #e8e8e8' }}>
									{/* <ListItem>
										<ListItemText>Acciones</ListItemText>
									</ListItem> */}
									{dataRutas.map(value => {
										const labelId = `checkbox-list-label-${value.id}`;
										const idChecked = checked.find(a => a.id === value.id);
										return (
											<ListItem key={value.id} disablePadding>
												<ListItemButton
													disabled={disabled}
													role={undefined}
													onClick={handleToggle(value, onChange)}
													dense
												>
													<ListItemIcon>
														<Checkbox
															disabled={disabled}
															edge="start"
															checked={!!idChecked}
															tabIndex={-1}
															disableRipple
															inputProps={{ 'aria-labelledby': labelId }}
														/>
													</ListItemIcon>
													<ListItemText id={labelId} primary={value.descripcion} />
												</ListItemButton>
											</ListItem>
										);
									})}
								</List>
							</div>
							<div className="pb-40" style={{ width: '100%' }}>
								<div style={{ padding: '0 0 10px 20px' }}>Arrastre y ordene las ruta</div>
								{checked.length > 0 ? (
									<List sx={{ marginLeft: '10px' }}>
										<Container
											dragHandleSelector=".drag-handle"
											lockAxis="y"
											onDrop={({ removedIndex, addedIndex }) => {
												if (!disabled) {
													const ordenado = it => arrayMoveImmutable(it, removedIndex, addedIndex);
													setChecked(ordenado);
													guardar(arrayMoveImmutable(checked, removedIndex, addedIndex), onChange);
												}
											}}
											disabled={disabled}
										>
											{checked.length > 0 &&
												checked.map(({ id, descripcion }, index) => (
													<Draggable
														key={id}
														className="shadow-md shadow-slate-500"
														style={{ margin: '10px', borderRadius: '10px' }}
														disabled={disabled}
													>
														<ListItem className="drag-handle">
															<div style={{ paddingRight: '25px' }}>N° {index + 1}</div>
															<ListItemText primary={descripcion} />
														</ListItem>
													</Draggable>
												))}
										</Container>
									</List>
								) : (
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											flexDirection: 'column',
											margin: '50px',
										}}
									>
										<div
											style={{
												fontSize: '18px',
												color: 'gray',
												width: '250px',
												textAlign: 'center',
												paddingBottom: '10px',
											}}
										>
											Selecciona una acción de la lista para editar la ruta
										</div>
										<img
											src={require('./assets/83473-route-line.gif')}
											alt="route-line icon animated"
											style={{ width: '50px' }}
										/>
									</div>
								)}
							</div>
						</div>
					);
				}}
			/>
		</div>
	);
}

export default Ruta;

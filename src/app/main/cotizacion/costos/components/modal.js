/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-throw-literal */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import showToast from 'utils/Toast';

import InputMonto from './inputMonto';
import { createCosto, updateCosto } from '../../store/costos/costoSlice';
import { getCostos } from '../../store/costos/costosSlice';

function ModalCostos({ visible, setVisible, dataModal, tipo, setLoading }) {
	const dispatch = useDispatch();

	const [rutas, setRutas] = useState([]);

	const saveCostos = async () => {
		showToast(
			{
				promesa: guardarCostos,
				parametros: [],
			},
			'save',
			'Costos'
		);
	};

	const isValidForm = (inPEN, inUSD, exPEN, exUSD) => {
		//* Transforma a numeros ya que algunos pueden ser string al venir de la base de datos
		const montoInPEN = typeof inPEN === 'string' ? parseFloat(inPEN) : inPEN;
		const montoInUSD = typeof inUSD === 'string' ? parseFloat(inUSD) : inUSD;
		const montoExPEN = typeof exPEN === 'string' ? parseFloat(exPEN) : exPEN;
		const montoExUSD = typeof exUSD === 'string' ? parseFloat(exUSD) : exUSD;
		//* Valida que al menos uno de los montos sea mayor a 0 tanto en interno como en externo,
		//* en caso de que no sea válido devuelve true
		const boolInterno =
			(!montoInPEN && !montoInUSD) ||
			(montoInPEN === 0 && montoInUSD === 0) ||
			(montoInPEN < 0 && montoInUSD < 0);
		const boolExterno =
			(!montoExPEN && !montoExUSD) ||
			(montoExPEN === 0 && montoExUSD === 0) ||
			(montoExPEN < 0 && montoExUSD < 0);
		return boolInterno && boolExterno;
	};

	//* La funcion devuelve 0 si no tiene costos, 1 si es incompleto y 2 si es completo
	const validRutas = ({ rutasArr }) => {
		let flagValido = false;
		let flagEstado = false;
		const arrValido = [];
		rutasArr.forEach(item => {
			const valid = isValidForm(item.montoInPEN, item.montoInUSD, item.montoExPEN, item.montoExUSD);
			if (!valid) {
				flagValido = true;
				arrValido.push(item);
			}
		});
		if (flagValido) {
			flagEstado = arrValido.length === rutasArr.length;
		}
		return flagValido ? (flagEstado ? 2 : 1) : 0;
	};

	const guardarCostos = async () => {
		try {
			let error = {};

			const rutasCostos = [];

			if (!rutas || rutas.length === 0) {
				throw { payload: { message: 'Debe registrar al menos un monto de cada ruta' } };
			} else {
				rutas.forEach((item, index) => {
					// if (item.ruta.id !== 1) {
					// 	if (isValidForm(item.montoInPEN, item.montoInUSD, item.montoExPEN, item.montoExUSD)) {
					// 		throw { payload: { message: 'Debe registrar al menos un monto de cada ruta' } };
					// 	}
					// }
					rutasCostos.push({
						rutaId: item.lavado ? 4 : item.ruta.id,
						lavadoId: item.lavado ? item.lavado.id : null,
						montoInPEN: item.montoInPEN,
						montoInUSD: item.montoInUSD,
						montoExPEN: item.montoExPEN,
						montoExUSD: item.montoExUSD,
					});
				});
			}

			//! Guarda el mismo valor de los montos para la ruta 1 si existe la ruta 2
			rutasCostos.forEach(item => {
				if (item.rutaId === 2) {
					const ruta1 = rutasCostos.find(e => e.rutaId === 1);
					if (ruta1) {
						ruta1.montoInPEN = item.montoInPEN;
						ruta1.montoInUSD = item.montoInUSD;
						ruta1.montoExPEN = item.montoExPEN;
						ruta1.montoExUSD = item.montoExUSD;
					}
				}
			});

			const flagEstado = validRutas({ rutasArr: rutasCostos });
			if (flagEstado === 0) {
				throw { payload: { message: 'Debe registrar al menos un monto de una ruta' } };
			}

			const body = {
				id: dataModal.costo ? dataModal.costo.id : null,
				estiloId: dataModal.id,
				estado: flagEstado === 1 ? 'INCOMPLETO' : 'COMPLETO',
				rutasCostos,
			};

			if (tipo === 'CE') {
				error = await dispatch(createCosto(body));
				if (error.error) throw error;
			} else {
				error = await dispatch(updateCosto(body));
				if (error.error) throw error;
			}

			dispatch(
				getCostos({
					offset: 0,
					limit: 10,
					busqueda: null,
					tipoBusqueda: 'nuevaBusqueda',
				})
			).then(() => setLoading(false));

			setVisible(false);
			return error;
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const obtenerRutas = ({ data }) => {
		const arrayRutas = [];
		if (data.costo?.rutasCostos || data.rutasEstilos) {
			const rutasArr = data.costo ? data.costo.rutasCostos : data.rutasEstilos;

			console.log(rutasArr);
			rutasArr
				.filter(a => a.ruta.id !== 3)
				.forEach(e => {
					arrayRutas.push({
						...e,
						montoInPEN: e.montoInPEN || 0,
						montoInUSD: e.montoInUSD || 0,
						montoExPEN: e.montoExPEN || 0,
						montoExUSD: e.montoExUSD || 0,
						flagTipo: 'R',
					});
				});
			console.log(data);
			if (data.costo === null) {
				if (data.lavados.length > 0) {
					data.lavados.forEach(lavado => {
						arrayRutas.push({
							lavado: {
								id: lavado.id,
								descripcion: lavado.descripcion,
								unidadProceso: lavado.unidadProceso,
							},
							ruta: { id: 4 },
							montoInPEN: lavado.montoInPEN || 0,
							montoInUSD: lavado.montoInUSD || 0,
							montoExPEN: lavado.montoExPEN || 0,
							montoExUSD: lavado.montoExUSD || 0,
							flagTipo: 'L',
						});
					});
				}
			}
		}
		setRutas(arrayRutas);
	};

	useEffect(() => {
		obtenerRutas({ data: dataModal });
	}, [dataModal]);

	console.log(rutas);

	return (
		<Dialog
			open={visible}
			onClose={() => setVisible(false)}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			PaperProps={{
				sx: {
					width: '100%',
					maxWidth: '820px !important',
				},
			}}
		>
			<DialogTitle id="alert-dialog-title">
				{dataModal.estilo} / {dataModal.nombre}
			</DialogTitle>
			<DialogContent
				style={{
					width: '100%',
				}}
			>
				<div
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'start',
						justifyContent: 'space-between',
					}}
				>
					<div>Tipo de Prenda: {dataModal.prenda?.nombre}</div>
				</div>
				{rutas.length > 0 ? (
					<table cellPadding="10px">
						<thead style={{ marginBottom: '10px', padding: '5px', borderBottom: '1px solid #ccc' }}>
							<tr>
								<th rowSpan={2}>Ruta</th>
								<th colSpan={4}>Precio por unidad</th>
							</tr>
							<tr>
								<th colSpan={2} style={{ backgroundColor: '#ebebeb' }}>
									Servicio Externo
								</th>
								<th colSpan={2} style={{ backgroundColor: '#f5f5f5' }}>
									Servicio Interno
								</th>
							</tr>
						</thead>
						<tbody style={{ width: '100%' }}>
							{rutas.length > 0 &&
								rutas.map((ruta, index) => {
									let descripcion = '';
									if (ruta.lavado) {
										descripcion = `LAVADO ${ruta.lavado?.descripcion} (${
											ruta.lavado?.unidadProceso || '-'
										})`;
									} else if (ruta.ruta?.id === 2) {
										if (rutas.findIndex(item => item.ruta?.id === 1) !== -1) {
											descripcion = 'CORTE EN PIEZAS Y PAÑOS';
										} else {
											descripcion = ruta.ruta?.descripcion;
										}
									} else {
										descripcion = ruta.ruta?.descripcion;
									}
									if (ruta.ruta?.id !== 1 && (ruta.lavado ? true : ruta.ruta?.id !== 4)) {
										return (
											<tr key={index} style={{ marginTop: '10px' }}>
												<td style={{ width: '35%' }}>{descripcion}</td>
												<td style={{ backgroundColor: '#ebebeb' }}>
													<InputMonto
														index={index}
														value={ruta.montoInPEN}
														currency="PEN"
														name="montoIn"
														data={rutas}
														setData={setRutas}
														disabled={ruta.disabled}
													/>
												</td>
												<td style={{ backgroundColor: '#ebebeb' }}>
													<InputMonto
														index={index}
														value={ruta.montoInUSD}
														currency="USD"
														name="montoIn"
														data={rutas}
														setData={setRutas}
														disabled={ruta.disabled}
													/>
												</td>
												<td style={{ backgroundColor: '#f5f5f5' }}>
													<InputMonto
														index={index}
														value={ruta.montoExPEN}
														currency="PEN"
														name="montoEx"
														data={rutas}
														setData={setRutas}
														disabled={ruta.disabled}
													/>
												</td>
												<td style={{ backgroundColor: '#f5f5f5' }}>
													<InputMonto
														index={index}
														value={ruta.montoExUSD}
														currency="USD"
														name="montoEx"
														data={rutas}
														setData={setRutas}
														disabled={ruta.disabled}
													/>
												</td>
											</tr>
										);
									}
									return null;
								})}
						</tbody>
					</table>
				) : (
					<div style={{ textAlign: 'center' }}>No existen rutas registradas</div>
				)}
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => {
						setVisible(false);
					}}
				>
					Cerrar
				</Button>
				<Button
					onClick={() => {
						saveCostos();
					}}
				>
					{dataModal.costo ? 'Editar' : 'Registrar'}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ModalCostos;

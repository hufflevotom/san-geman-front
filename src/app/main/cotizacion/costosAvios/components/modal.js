/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-throw-literal */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import showToast from 'utils/Toast';
import httpClient from 'utils/Api';

import { createCostoAvios, updateCostoAvios } from '../../store/costos-avios/costoAviosSlice';
import { getCostosAvios } from '../../store/costos-avios/costosAviosSlice';

import InputMonto from './inputMonto';

function ModalCostos({ visible, setVisible, dataModal, tipo, setLoading }) {
	const dispatch = useDispatch();

	const [load, setLoad] = useState(true);
	const [dataSource, setDataSource] = useState([]);

	const getData = async id => {
		try {
			const array = [];
			const unique = [];
			const avios = [];
			const {
				data: { body },
			} = await httpClient.get(`comercial/producciones/${id}`);
			body.pedidos.forEach(pedido => {
				pedido.resumenAvios.forEach(avio => {
					array.push(avio.avios);
				});
			});
			array.forEach(avio => {
				if (unique.findIndex(f => f.id === avio.id) === -1) {
					unique.push(avio);
				}
			});
			unique.forEach(avio => {
				avios.push({
					...avio,
				});
			});
			setLoad(false);
			setDataSource(avios.map(avio => ({ avios: avio, montoPEN: 0, montoUSD: 0 })));
		} catch (error) {
			console.error(error);
		}
	};

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

	const isValidForm = (inPEN, inUSD) => {
		//* Transforma a numeros ya que algunos pueden ser string al venir de la base de datos
		const montoPEN = typeof inPEN === 'string' ? parseFloat(inPEN) : inPEN;
		const montoUSD = typeof inUSD === 'string' ? parseFloat(inUSD) : inUSD;
		//* Valida que al menos uno de los montos sea mayor a 0 tanto en interno como en externo,
		//* en caso de que no sea válido devuelve true
		const bool =
			!montoPEN || montoPEN === 0 || montoPEN < 0 || !montoUSD || montoUSD === 0 || montoUSD < 0;
		return bool;
	};

	//* La funcion devuelve 0 si no tiene costos, 1 si es incompleto y 2 si es completo
	const validDetalles = ({ detallesArr }) => {
		let flagValido = false;
		let flagEstado = false;
		const arrValido = [];
		detallesArr.forEach(item => {
			// const valid = isValidForm(item.precioMaximo, item.precioMaximoUSD);
			// if (!valid) {
			flagValido = true;
			arrValido.push(item);
			// }
		});
		if (flagValido) {
			flagEstado = arrValido.length === detallesArr.length;
		}
		return flagValido ? (flagEstado ? 2 : 1) : 0;
	};

	const guardarCostos = async () => {
		try {
			let error = {};

			const detalles = [];

			if (!dataSource || dataSource.length === 0) {
				throw { payload: { message: 'Debe registrar el monto de cada avío' } };
			} else {
				dataSource.forEach((item, index) => {
					// if (isValidForm(item.montoPEN)) {
					// 	throw { payload: { message: 'Debe registrar el monto de cada avío' } };
					// }
					detalles.push({
						aviosId: item.avios.id,
						precioMaximo: item.montoPEN,
						precioMaximoUSD: item.montoUSD,
					});
				});
			}

			const flagEstado = validDetalles({ detallesArr: detalles });
			if (flagEstado === 0) {
				throw { payload: { message: 'Debe registrar al menos un monto' } };
			}

			const body = {
				id: dataModal.costoAvio ? dataModal.costoAvio.id : null,
				produccionId: dataModal.id,
				estado: flagEstado === 1 ? 'INCOMPLETO' : 'COMPLETO',
				detalles,
			};

			if (tipo === 'CE') {
				error = await dispatch(createCostoAvios(body));
				if (error.error) throw error;
			} else {
				error = await dispatch(updateCostoAvios(body));
				if (error.error) throw error;
			}

			dispatch(
				getCostosAvios({
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

	useEffect(() => {
		if (dataModal.costoAvio) {
			setDataSource(
				dataModal.costoAvio?.detalles.map(detalle => ({
					...detalle,
					montoPEN: detalle.precioMaximo,
					montoUSD: detalle.precioMaximoUSD,
				}))
			);
			setLoad(false);
		} else {
			getData(dataModal.id);
		}
	}, [dataModal]);

	return (
		<Dialog
			open={visible}
			onClose={() => setVisible(false)}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			PaperProps={{
				sx: {
					width: '100%',
					maxWidth: '950px!important',
				},
			}}
		>
			<DialogTitle id="alert-dialog-title">{dataModal.codigo}</DialogTitle>
			<DialogContent
				style={{
					width: '100%',
				}}
			>
				{load ? (
					<div>
						<div className="flex justify-center items-center">
							<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
						</div>
					</div>
				) : dataSource.length === 0 ? (
					<div className="flex justify-center items-center">No tiene avíos registrados</div>
				) : (
					<table cellPadding="10px">
						<thead style={{ marginBottom: '10px', padding: '5px', borderBottom: '1px solid #ccc' }}>
							<tr>
								<th>Código</th>
								<th>Avio</th>
								<th>Unidad de medida</th>
								<th colSpan={2}>Precio máximo</th>
							</tr>
						</thead>
						<tbody style={{ width: '100%' }}>
							{dataSource.length > 0 &&
								dataSource.map((row, index) => {
									return (
										<tr key={index} style={{ marginTop: '10px' }}>
											<td style={{ width: '15%' }}>{row.avios.codigo}</td>
											<td style={{ width: '45%' }}>{`${row.avios?.nombre} ${
												row.avios?.hilos
													? `- ${row.avios?.codigoSec} - ${row.avios?.marcaHilo} - ${row.avios?.color?.descripcion}`
													: ''
											}`}</td>
											<td
												style={{ width: '10%' }}
											>{`${row.avios?.unidadMedidaCompra?.prefijo}`}</td>
											<td style={{ backgroundColor: '#ebebeb' }}>
												<InputMonto
													index={index}
													value={row.montoPEN}
													currency="PEN"
													name="monto"
													data={dataSource}
													setData={setDataSource}
													disabled={row.disabled}
												/>
											</td>
											<td style={{ backgroundColor: '#ebebeb' }}>
												<InputMonto
													index={index}
													value={row.montoUSD}
													currency="USD"
													name="monto"
													data={dataSource}
													setData={setDataSource}
													disabled={row.disabled}
												/>
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				)}
			</DialogContent>
			<DialogActions>
				<p style={{ color: 'red', paddingRight: '50px' }}>*Solo 3 decimales</p>
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

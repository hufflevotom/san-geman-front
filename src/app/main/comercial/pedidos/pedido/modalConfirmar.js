/* eslint-disable no-throw-literal */
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import showToast from 'utils/Toast';
import { createPedido, updatePedido } from '../../store/pedido/pedidoSlice';
import { setPedidoLoading } from '../../store/pedido/helpers';

function ModalConfirmar({ visible, setVisible, tipo }) {
	const dispatch = useDispatch();
	const methods = useFormContext();
	const navigate = useNavigate();

	const selector = useSelector(state => state.comercial.infoPedido);

	const { getValues } = methods;

	async function handleSavePedido() {
		showToast(
			{
				promesa: savePedido,
				parametros: [],
			},
			'save',
			'pedido'
		);
	}

	async function savePedido() {
		try {
			let error = {};
			if (tipo === 'nuevo') {
				const data = getValues();

				const arrayCantidades = [];
				const arrayCantidadesPorcentaje = [];
				const arrayTotalCantidades = [];

				if (!data.cliente || data.cliente === null) {
					throw { payload: { message: 'El cliente es requerido' } };
				}

				if (!data.marca || data.marca === null) {
					throw { payload: { message: 'La marca es requerida' } };
				}

				if (data.cliente.tipoCliente !== 'N') {
					if (
						!data.incoterms ||
						data.incoterms === null ||
						!data.shipMode ||
						data.shipMode === null
					) {
						throw { payload: { message: 'La complete todos los campos' } };
					}
				}

				data.incoterms = data.incoterms?.nombre;
				data.shipMode = data.shipMode?.nombre;
				data.clienteId = data.cliente?.id;
				data.marcaId = data.marca?.id;
				data.estilosId = data.dataEstilos.estilos.map(estilo => estilo.id);
				// Formateando data arrays
				if (data.dataEstilos.cantidades.length > 0) {
					// eslint-disable-next-line array-callback-return
					data.dataEstilos.cantidades.map(c => {
						const arr = data.dataEstilos.cantidades.filter(
							f => f.color.id === c.color.id && f.estilo.id === c.estilo.id
						);
						const total = arr.reduce((prev, acc) => prev + acc.cantidad, 0);
						if (total > 0 && c.talla) {
							arrayCantidades.push({
								tallaId: c.talla.id,
								cantidad: c.cantidad,
								orden: c.orden,
								colorId: c.color.id,
								estiloId: c.estilo.id,
							});
						}
					});
				}

				if (data.dataEstilos.cantidadesPorcentaje.length > 0) {
					// eslint-disable-next-line array-callback-return
					data.dataEstilos.cantidadesPorcentaje.map(cp => {
						const arr = data.dataEstilos.cantidadesPorcentaje.filter(
							f => f.color.id === cp.color.id && f.estilo.id === cp.estilo.id
						);
						const total = arr.reduce((prev, acc) => prev + acc.cantidad, 0);
						if (total > 0 && cp.talla) {
							arrayCantidadesPorcentaje.push({
								cantidad: cp.cantidad,
								orden: cp.orden,
								colorId: cp.color.id,
								estiloId: cp.estilo.id,
								porcentaje: cp.porcentaje,
								tallaId: cp.talla.id,
							});
						}
					});
				}

				data.cantidades1 = arrayCantidades;
				data.cantidadesPorcentaje1 = arrayCantidadesPorcentaje;

				// for arrEstilo y arrayColores
				const arrayColoresId = [];
				const arrayEstilosId = [];

				arrayCantidades.forEach(c => {
					if (!arrayColoresId.includes(c.colorId)) {
						arrayColoresId.push(c.colorId);
					}

					if (!arrayEstilosId.includes(c.estiloId)) {
						arrayEstilosId.push(c.estiloId);
					}
				});

				arrayEstilosId.forEach(estiloId => {
					arrayColoresId.forEach(colorId => {
						let sumaTotalCantidad = 0;
						arrayCantidades.forEach(cant => {
							if (cant.colorId === colorId && cant.estiloId === estiloId) {
								sumaTotalCantidad += cant.cantidad;
							}
						});

						let sumaTotalCantidadPorcentaje = 0;
						arrayCantidadesPorcentaje.forEach(cant => {
							if (cant.colorId === colorId && cant.estiloId === estiloId) {
								sumaTotalCantidadPorcentaje += cant.cantidad;
							}
						});

						if (sumaTotalCantidad > 0 && sumaTotalCantidadPorcentaje > 0) {
							arrayTotalCantidades.push({
								totalCantidad: sumaTotalCantidad,
								totalCantidadPorcentaje: sumaTotalCantidadPorcentaje,
								colorId,
								estiloId,
							});
						}
					});
				});

				if (selector.dataAvios) {
					const arrayAvios = [];
					// eslint-disable-next-line no-restricted-syntax
					for (const key in selector.dataAvios) {
						if (Object.hasOwnProperty.call(selector.dataAvios, key)) {
							const element = selector.dataAvios[key];
							arrayAvios.push(...element);
						}
					}

					data.aviosPo = arrayAvios;
				}

				data.resumenAvios = selector.dataAviosResumen;
				data.totalCantidades1 = arrayTotalCantidades;

				// if (data.ordenTallas1 && data.ordenTallas1.length > 0) {
				data.ordenTallas = (data.ordenTallas1 || []).map(t => ({
					orden: t.orden,
					tallaId: t.talla.id,
				}));
				// }
				console.log('Guardar:', data);
				dispatch(setPedidoLoading(true));

				error = await dispatch(createPedido(data));
				if (error.error) throw error;
			} else {
				const data = getValues();

				console.log('HV.data', data);

				const arrayCantidades = [];
				const arrayCantidadesPorcentaje = [];
				const arrayTotalCantidades = [];

				data.incoterms = data.incoterms?.nombre ? data.incoterms?.nombre : data.incoterms;
				data.shipMode = data.shipMode?.nombre ? data.shipMode?.nombre : data.shipMode;
				data.clienteId = data.cliente.id;
				data.marcaId = data.marca.id;
				data.estilosId = data.dataEstilos.estilos.map(estilo => estilo.id);

				// Formateando data arrays
				if (data.dataEstilos.cantidades.length > 0) {
					// eslint-disable-next-line array-callback-return
					data.dataEstilos.cantidades.map(c => {
						const arr = data.dataEstilos.cantidades.filter(
							f => f.color.id === c.color.id && f.estilo.id === c.estilo.id
						);
						const total = arr.reduce((prev, acc) => prev + acc.cantidad, 0);
						if (total > 0 && c.talla) {
							arrayCantidades.push({
								// id: typeof c.id !== 'string' ? c.id : null,
								tallaId: c.talla.id,
								cantidad: c.cantidad,
								orden: c.orden,
								colorId: c.color.id,
								estiloId: c.estilo.id,
							});
						}
					});
				}

				if (data.dataEstilos.cantidadesPorcentaje.length > 0) {
					// eslint-disable-next-line array-callback-return
					data.dataEstilos.cantidadesPorcentaje.map(cp => {
						const arr = data.dataEstilos.cantidadesPorcentaje.filter(
							f => f.color.id === cp.color.id && f.estilo.id === cp.estilo.id
						);
						const total = arr.reduce((prev, acc) => prev + acc.cantidad, 0);
						if (total > 0 && cp.talla) {
							arrayCantidadesPorcentaje.push({
								// id: typeof cp.id !== 'string' ? cp.id : null,
								tallaId: cp.talla.id,
								cantidad: cp.cantidad,
								orden: cp.orden,
								colorId: cp.color.id,
								estiloId: cp.estilo.id,
								porcentaje: cp.porcentaje,
							});
						}
					});
				}

				data.cantidades1 = arrayCantidades;
				data.cantidadesPorcentaje1 = arrayCantidadesPorcentaje;

				// for arrEstilo y arrayColores
				const arrayColoresId = [];
				const arrayEstilosId = [];

				arrayCantidades.forEach(c => {
					if (!arrayColoresId.includes(c.colorId)) {
						arrayColoresId.push(c.colorId);
					}

					if (!arrayEstilosId.includes(c.estiloId)) {
						arrayEstilosId.push(c.estiloId);
					}
				});

				arrayEstilosId.forEach(estiloId => {
					arrayColoresId.forEach(colorId => {
						let sumaTotalCantidad = 0;
						arrayCantidades.forEach(cant => {
							if (cant.colorId === colorId && cant.estiloId === estiloId) {
								sumaTotalCantidad += cant.cantidad;
							}
						});

						let sumaTotalCantidadPorcentaje = 0;
						arrayCantidadesPorcentaje.forEach(cant => {
							if (cant.colorId === colorId && cant.estiloId === estiloId) {
								sumaTotalCantidadPorcentaje += cant.cantidad;
							}
						});

						if (sumaTotalCantidad > 0 && sumaTotalCantidadPorcentaje > 0) {
							arrayTotalCantidades.push({
								totalCantidad: sumaTotalCantidad,
								totalCantidadPorcentaje: sumaTotalCantidadPorcentaje,
								colorId,
								estiloId,
							});
						}
					});
				});

				if (selector.dataAvios) {
					const arrayAvios = [];
					// eslint-disable-next-line no-restricted-syntax
					for (const key in selector.dataAvios) {
						if (Object.hasOwnProperty.call(selector.dataAvios, key)) {
							const element = selector.dataAvios[key];
							console.log('ELEMENTO HEADER: ', element);

							arrayAvios.push(...element);
						}
					}

					data.aviosPo = arrayAvios;
				}

				data.resumenAvios = selector.dataAviosResumen;
				data.totalCantidades1 = arrayTotalCantidades;

				// if (data.ordenTallas1 && data.ordenTallas1.length > 0) {
				data.ordenTallas = (data.ordenTallas1 || [])
					.filter(ot => !!ot.talla)
					.map(t => ({
						orden: t.orden,
						tallaId: t.talla.id,
					}));
				// }

				console.log('Guardar:', data);
				dispatch(setPedidoLoading(true));
				error = await dispatch(updatePedido(data));
				if (error.error) throw error;
			}
			navigate(`/comercial/pedidos`);
			return error;
		} catch (error) {
			console.log('Error:', error);
			throw error;
		}
	}

	return (
		<Dialog
			open={visible}
			onClose={() => setVisible(false)}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">¿Está seguro de grabar la información?</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					Recuerde revisar la información antes de guardar
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => {
						setVisible(false);
					}}
				>
					No
				</Button>
				<Button onClick={handleSavePedido} autoFocus>
					Si
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ModalConfirmar;

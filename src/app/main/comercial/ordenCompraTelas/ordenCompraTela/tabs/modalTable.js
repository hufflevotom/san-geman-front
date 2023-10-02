/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import httpClient from 'utils/Api';
import { ClickAwayListener } from '@mui/base';
import {
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormLabel,
	Tooltip,
	tooltipClasses,
} from '@mui/material';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import obtenerColorCliente from 'utils/obtenerColorCliente';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 1200,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

const HtmlTooltip = styled(({ className, ...props }) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: '#f5f5f9',
		color: 'rgba(0, 0, 0, 0.87)',
		maxWidth: 220,
		border: '1px solid #dadde9',
	},
}));

const SelectOpAsignada = ({ kardex, partidas, setPartidas }) => {
	return (
		<FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
			<FormLabel component="legend">Seleccione las partidas</FormLabel>
			<FormGroup>
				{kardex.map((k, i) => (
					<FormControlLabel
						control={
							<Checkbox
								checked={partidas.findIndex(p => p.id === k.id) !== -1}
								onChange={() =>
									setPartidas(partida => {
										if (partida.findIndex(p => p.id === k.id) !== -1) {
											return partida.filter(p => p.id !== k.id);
										}
										return [...partida, { ...k }];
									})
								}
								name={k.id}
							/>
						}
						label={`${k.producto.partida} (${k.cantidad} ${k.unidad.prefijo})`}
					/>
				))}
			</FormGroup>
		</FormControl>
	);
};

const agregarTelasPrincipales = (pedidos, coloresCliente) => {
	const array = [];

	pedidos.map(pedido => {
		pedido.estilos.map(estilo => {
			const coloresPermitidos = [];
			pedido.cantidadesPorcentaje
				.filter(cantidad => cantidad.cantidad > 0 && cantidad.estilo.id === estilo.id)
				.forEach(cantidad => {
					if (coloresPermitidos.findIndex(color => color.id === cantidad.color.id) === -1)
						coloresPermitidos.push(cantidad.color);
				});
			estilo.telasEstilos.map(tela => {
				if (tela.tipo === 'P') {
					tela.colores.map(colorTela => {
						// * Agrega el color si está en la lista de colores de la cantidad
						if (
							coloresPermitidos.findIndex(colorPermitido => colorPermitido.id === colorTela.id) !==
							-1
						) {
							array.push({
								...tela.tela,
								id: `${tela.tela.codigo}-${colorTela.codigo}`,
								telaId: tela.tela.id,
								tela: tela.tela.nombre,
								colorId: colorTela.id,
								color: colorTela.descripcion,
								colorCliente: obtenerColorCliente(colorTela, coloresCliente),
								// * Consumo de Gramos a Kilo Gramos
								cantidad: tela.unidadMedida
									? tela.unidadMedida.id === 4
										? tela.consumo / 1000
										: tela.consumo
									: tela.consumo / 1000,
								consumo: tela.unidadMedida
									? tela.unidadMedida.id === 4
										? tela.consumo / 1000
										: tela.consumo
									: tela.consumo / 1000,
								estiloId: estilo.id,
								umId: tela.unidadMedida
									? tela.unidadMedida.id === 4
										? 1
										: tela.unidadMedida.id
									: 1,
								um: tela.unidadMedida
									? tela.unidadMedida.id === 4
										? 'KG'
										: tela.unidadMedida.prefijo
									: 'KG',
								valorUnitario: 0,
								descuento: 0,
								precioUnitario: 0,
								totalImporte: 0,
								unidad: {
									id: tela.unidadMedida
										? tela.unidadMedida.id === 4
											? 1
											: tela.unidadMedida.id
										: 1,
									nombre: tela.unidadMedida
										? tela.unidadMedida.id === 4
											? 'KILOGRAMOS'
											: tela.unidadMedida.nombre
										: 'KILOGRAMOS',
									prefijo: tela.unidadMedida
										? tela.unidadMedida.id === 4
											? 'KG'
											: tela.unidadMedida.prefijo
										: 'KG',
								},
								tipo: 'P',
							});
						}
					});
				}
			});
		});
	});

	//* Calculo de cantidades
	const cantidades = calcularCantidadesPrincipales(pedidos, array);

	return cantidades;
};

const agregarTelasComplemento = (pedidos, coloresCliente) => {
	const arrTelas = [];

	pedidos.forEach(pedido => {
		const coloresArr = pedido.cantidadesPorcentaje.map(qty => qty.color);

		pedido.estilos.forEach(estilo => {
			estilo.telasEstilos.forEach(tela => {
				if (tela.tipo !== 'P') {
					tela.colores.forEach(color => {
						if (coloresArr.findIndex(c => c.id === color.id) === -1) return;
						const relacionados = JSON.parse(tela.coloresRelacionados);
						const coloresFound = [];
						coloresArr.forEach(cr => {
							if (relacionados.findIndex(r => r === cr.id) !== -1) {
								if (coloresFound.findIndex(cf => cf.id === cr.id) === -1) coloresFound.push(cr);
							}
						});
						arrTelas.push({
							...tela.tela,
							id: `${tela.tela.codigo}-${color.codigo}`,
							telaId: tela.tela.id,
							tela: tela.tela.nombre,
							colorId: color.id,
							color: color.descripcion,
							colorCliente: obtenerColorCliente(color, coloresCliente, estilo),
							// * Consumo de Gramos a Kilo Gramos
							cantidad: tela.unidadMedida
								? tela.unidadMedida.id === 4
									? tela.consumo / 1000
									: tela.consumo
								: tela.consumo / 1000,
							consumo: tela.unidadMedida
								? tela.unidadMedida.id === 4
									? tela.consumo / 1000
									: tela.consumo
								: tela.consumo / 1000,
							estiloId: estilo.id,
							umId: tela.unidadMedida ? (tela.unidadMedida.id === 4 ? 1 : tela.unidadMedida.id) : 1,
							um: tela.unidadMedida
								? tela.unidadMedida.id === 4
									? 'KG'
									: tela.unidadMedida.prefijo
								: 'KG',
							valorUnitario: 0,
							descuento: 0,
							precioUnitario: 0,
							totalImporte: 0,
							unidad: {
								id: tela.unidadMedida ? (tela.unidadMedida.id === 4 ? 1 : tela.unidadMedida.id) : 1,
								nombre: tela.unidadMedida
									? tela.unidadMedida.id === 4
										? 'KILOGRAMOS'
										: tela.unidadMedida.nombre
									: 'KILOGRAMOS',
								prefijo: tela.unidadMedida
									? tela.unidadMedida.id === 4
										? 'KG'
										: tela.unidadMedida.prefijo
									: 'KG',
							},
							coloresRelacionados: coloresFound,
							tipo: 'C',
						});
					});
				}
			});
		});
	});

	//* Calculo de cantidades de telas complementarias
	const cantidadesComplemento = calcularCantidadesComplemento(pedidos, arrTelas);

	return cantidadesComplemento;
};

const calcularCantidadesPrincipales = (pedidos, array) => {
	const newArr = [];
	array.forEach(element => {
		let qty = 0;
		if (element.tipo === 'P') {
			qty = pedidos[0].totalCantidades.reduce(
				(acc, curr) =>
					acc +
					(element.estiloId === curr.estilo.id && element.colorId === curr.color.id
						? parseFloat(curr.totalCantidadPorcentaje)
						: 0),
				0
			);
		}
		newArr.push({ ...element, cantidad: qty * element.consumo, totalCantidades: qty });
	});
	return newArr;
};

const calcularCantidadesComplemento = (pedidos, array) => {
	const newArr = [];
	array.forEach(element => {
		let qty = 0;
		if (element.tipo !== 'P') {
			//* Se toma el total de la cantidad si no tiene colores relacionados
			if (element.coloresRelacionados?.length === 0) {
				qty = pedidos[0].totalCantidades.reduce(
					(acc, curr) =>
						acc +
						(element.estiloId === curr.estilo.id ? parseFloat(curr.totalCantidadPorcentaje) : 0),
					0
				);
			} else {
				//* Se suman los totales de cantidades si tiene colores relacionados
				pedidos[0].totalCantidades.forEach(curr => {
					if (
						element.coloresRelacionados?.findIndex(
							cr => element.estiloId === curr.estilo.id && cr.id === curr.color.id
						) !== -1
					)
						qty += parseFloat(curr.totalCantidadPorcentaje);
				});
			}
		}
		newArr.push({ ...element, cantidad: qty * element.consumo, totalCantidades: qty });
	});

	return newArr;
};

const sumarDataRepetida = cantidades => {
	const arrayUnique = [];
	const arrayTemp = [];
	cantidades.forEach(element => {
		if (arrayTemp.includes(element.id)) {
			arrayUnique.forEach(elementUnique => {
				if (elementUnique.id === element.id) {
					elementUnique.cantidad += element.cantidad;
				}
			});
		} else {
			arrayTemp.push(element.id);
			arrayUnique.push(element);
		}
	});
	return arrayUnique;
};

const traerStockAlmacen = async array => {
	const arrayStock = [];

	const response = await httpClient.post(`almacen-tela/kardex/existenciaTelaColor`, {
		productos: array.map(e => ({ idTela: e.telaId, idColor: e.colorId, idUnidad: e.umId })),
	});
	const dataBody = await response.data.body;
	array.forEach(element => {
		const arrUnidades = [];
		const stockAlmacen = [];
		const stock = dataBody.find(e => e.idTela === element.telaId && e.idColor === element.colorId);
		stock.kardex.forEach(kardex => {
			if (!arrUnidades.includes(kardex.unidad.id)) arrUnidades.push(kardex.unidad.id);
		});
		arrUnidades.forEach(unidad => {
			const arrKardex = stock.kardex.filter(kardex => kardex.unidad.id === unidad);
			let total = 0;
			arrKardex.forEach(kardex => {
				total += parseFloat(kardex.cantidad);
			});
			if (total > 0) {
				stockAlmacen.push({
					id: unidad,
					nombre: arrKardex[0].unidad.nombre,
					prefijo: arrKardex[0].unidad.prefijo,
					cantidad: total,
				});
			}
		});
		arrayStock.push({
			...element,
			kardex: stock.kardex.filter(kardex => kardex.cantidad > 0),
			stockAlmacen,
			cantidadAnterior: element.cantidad,
		});
	});

	return arrayStock;
};

const restarOrdenesAsignaciones = async (array, op) => {
	const arrayResta = [];
	const response = await httpClient.get(`comercial/registros-op/produccion/${op}`);
	const dataBody = await response.data.body;

	// * Restar asignaciones
	dataBody.produccion?.productosTela.forEach(element => {
		array.forEach(elementArray => {
			if (elementArray.telaId === element.tela.id && elementArray.colorId === element.color.id) {
				elementArray.cantidad -= element.kardexTelas.reduce(
					(k, l) => k + parseFloat(l.cantidad),
					0
				);
			}
		});
	});

	//* Restar ordenes anteriores
	dataBody.produccion?.ordenCompraTelas.forEach(element => {
		if (element.activo) {
			element.detalleOrdenComprasTelas.forEach(elementDetalle => {
				array.forEach(elementArray => {
					if (
						elementArray.telaId === elementDetalle.producto.tela.id &&
						elementArray.colorId === elementDetalle.producto.color.id
					) {
						elementArray.cantidad -= parseFloat(elementDetalle.cantidad);
					}
				});
			});
		}
	});

	//* Quitar los elementos que quedaron en 0 o menores
	array.forEach(element => {
		if (parseFloat(element.cantidad.toFixed(2)) > 0) arrayResta.push(element);
	});

	return arrayResta;
};

export default function ModalTable({
	modalOpen,
	setModalOpen,
	data,
	setDataSeleccionada,
	partidas,
	setPartidas,
	setProduccionesIgnoradas,
}) {
	const [isLoading, setIsLoading] = useState(false);
	const [openDetails, setOpenDetails] = useState(null);
	const [produccion, setProduccion] = useState([]);
	const [temporalSeleccionado, setTemporalSeleccionado] = useState([]);

	const columns = [
		// { field: 'id', headerName: 'Codigo', flex: 0.5, minWidth: 120 },
		{ field: 'tela', headerName: 'Tela', minWidth: 290, flex: 1 },
		{ field: 'color', headerName: 'Color', flex: 1, minWidth: 120 },
		{ field: 'colorCliente', headerName: 'Color Cliente', flex: 1, minWidth: 120 },
		{
			field: 'cantidad',
			headerName: 'Cantidad',
			flex: 1,
			minWidth: 80,
			renderCell: params => {
				// const decimales = params.value % 1;
				// if (decimales > 0) {
				// 	params.value += 1 - decimales;
				// }
				return <span>{`${parseFloat(params.row.cantidad).toFixed(2)} ${params.row.um}`}</span>;
			},
		},
		{
			field: 'stockAlmacen',
			headerName: 'En Stock',
			flex: 1,
			minWidth: 200,
			renderCell: params => {
				const partidasSeleccionadas = partidas.filter(
					p => params.row.kardex?.findIndex(k => k.id === p.id) !== -1
				);

				return params.row.kardex?.length > 0 ? (
					<div
						style={{
							width: '100%',
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'end',
							gap: '10px',
						}}
					>
						<span style={{ color: '#6E173D' }}>
							{params.value.map(
								(e, i) =>
									`${i > 0 ? ', ' : ''}${e.cantidad.toFixed(2)} ${e.prefijo}${
										partidasSeleccionadas.length > 0
											? ` - (${partidasSeleccionadas
													.reduce(
														(a, b) => a + (b.unidad.id === e.id ? parseFloat(b.cantidad) : 0),
														0
													)
													.toFixed(2)})`
											: ''
									}`
							)}
						</span>
						<ClickAwayListener onClickAway={() => setOpenDetails(null)}>
							<HtmlTooltip
								PopperProps={{
									disablePortal: true,
								}}
								onClose={() => setOpenDetails(null)}
								open={openDetails === params.row.id}
								disableFocusListener
								disableHoverListener
								disableTouchListener
								placement="left-end"
								title={
									<SelectOpAsignada
										kardex={params.row.kardex}
										partidas={partidas}
										setPartidas={setPartidas}
									/>
								}
							>
								<Button
									color="primary"
									onClick={() => setOpenDetails(openDetails !== null ? null : params.row.id)}
								>
									<RemoveRedEyeIcon />
								</Button>
							</HtmlTooltip>
						</ClickAwayListener>
					</div>
				) : null;
			},
		},
	];

	const traerProducciones = async id => {
		setIsLoading(true);
		try {
			const response = await httpClient.get(`comercial/producciones/${id}`);
			const { pedidos, coloresCliente } = await response.data.body;

			//* Agrega las telas principales
			const telasPrincipales = agregarTelasPrincipales(pedidos, coloresCliente);

			//* Agrega las telas complemento
			const telasComplementos = agregarTelasComplemento(pedidos, coloresCliente);

			//* Sumar data repetida del array
			const arrayUnique = sumarDataRepetida([...telasPrincipales, ...telasComplementos]);

			const arrStock = await toast.promise(
				() => traerStockAlmacen(arrayUnique),
				{
					pending: 'Obteniendo stock de almacén...',
					success: 'Stock obtenido',
					error: 'Error al obtener stock de almacén',
				},
				{ theme: 'colored' }
			);

			const arrResta = await toast.promise(
				() => restarOrdenesAsignaciones(arrStock, id),
				{
					pending: 'Restando ordenes y asignaciones...',
					success: 'Cantidad actualizada',
					error: 'Error al restar la cantidad',
				},
				{ theme: 'colored' }
			);

			setProduccion(arrResta);
			setIsLoading(false);
		} catch (error) {
			console.error(error);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (data) {
			toast.promise(
				() => traerProducciones(data.id),
				{
					pending: 'Obteniendo datos de la producción...',
					success: 'Producción encontrada',
					error: 'Error al buscar la producción',
				},
				{ theme: 'colored' }
			);
		}
	}, [data]);

	return (
		<div>
			<Modal
				width={900}
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={modalOpen}
				// onClose={() => setModalOpen(false)}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={modalOpen}>
					<Box sx={style}>
						<Typography id="transition-modal-title" variant="h6" component="h2">
							{data.codigo ?? 'Titulo'}
						</Typography>
						<div style={{ height: 600, width: '100%' }}>
							<DataGrid
								loading={isLoading}
								rows={produccion}
								columns={columns}
								pageSize={10}
								rowsPerPageOptions={[5]}
								checkboxSelection
								disableRowSelectionOnClick
								onSelectionModelChange={row => {
									const selectedIDs = new Set(row);
									const selectedRowData = produccion.filter(prod =>
										selectedIDs.has(prod.id.toString())
									);
									const telasSeleccionadas = [];
									selectedRowData.forEach(rrow => {
										const partidasSeleccionadas = partidas.filter(
											p => rrow.kardex.findIndex(k => k.id === p.id) !== -1
										);
										const totalSeleccionado = partidasSeleccionadas.reduce(
											(a, b) => a + parseFloat(b.cantidad),
											0
										);
										telasSeleccionadas.push({
											...rrow,
											cantidad: parseFloat(rrow.cantidadAnterior - totalSeleccionado).toFixed(2),
										});
									});
									setTemporalSeleccionado(telasSeleccionadas);
								}}
								isRowSelectable={params => {
									const partidasSeleccionadas = partidas.filter(
										p => params.row.kardex.findIndex(k => k.id === p.id) !== -1
									);
									const totalSeleccionado = partidasSeleccionadas.reduce(
										(a, b) => a + parseFloat(b.cantidad),
										0
									);
									if (totalSeleccionado > 0) {
										setProduccionesIgnoradas(e => {
											if (e.findIndex(i => i.id === params.row.id) === -1) {
												return [...e, params.row];
											}
											return e;
										});
									} else {
										setProduccionesIgnoradas(e => {
											if (e.findIndex(i => i.id === params.row.id) !== -1) {
												return [...e.filter(i => i.id !== params.row.id)];
											}
											return e;
										});
									}
									return params.row.cantidad > totalSeleccionado;
								}}
							/>
						</div>

						<div style={{ textAlign: 'end', marginTop: '15px' }}>
							<Button
								disabled={temporalSeleccionado.length === 0 && partidas.length === 0}
								variant="contained"
								size="large"
								onClick={() => {
									setModalOpen(false);
									setDataSeleccionada(temporalSeleccionado);
								}}
							>
								Seleccionar
							</Button>
							&nbsp;
							<Button
								variant="contained"
								size="large"
								onClick={() => {
									setModalOpen(false);
									setDataSeleccionada([]);
								}}
							>
								Cerrar
							</Button>
						</div>
					</Box>
				</Fade>
			</Modal>
		</div>
	);
}

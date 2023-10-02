/* eslint-disable no-nested-ternary */

import Moment from 'moment';
import 'moment/locale/es';
import debounce from 'lodash.debounce';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import {
	getKardex,
	selectKardex,
} from 'app/main/almacen/store/almacenTela/kardex/kardexTelasSlice';

import { Avatar, Button, ButtonUnstyled, TableHead, Tooltip } from '@mui/material';
import httpClient, { baseUrl } from 'utils/Api';
import { MODULOS } from 'constants/constantes';
import Lightbox from 'react-awesome-lightbox';
import 'react-awesome-lightbox/build/style.css';
import KardexTableHead from './kardexTableHead';

function KardexTable({
	setOpenModal,
	setDataModal,
	setOpenModalColor,
	setDataModalColor,
	setOpenModalAsignacion,
	setDataModalAsignacion,
}) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const kardex = useSelector(selectKardex);
	const totalKardex = useSelector(({ almacen }) => almacen.kardex.total);
	const searchText = useSelector(({ almacen }) => almacen.kardex.searchText);
	const rolActual = useSelector(({ auth }) => auth.user.role);
	const modulos = useSelector(
		({ auth }) => auth.roles[0].find(rol => rol.id === rolActual.id).modulos
	);
	const edicionColorKardex =
		modulos.findIndex(modulo => modulo.nombre === MODULOS.edicionColorKardex) !== -1;
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(kardex);
	const [dataTotalKardex, setDataTotalKardex] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null,
	});

	const [busquedaTemp, setBusqeudaTemp] = useState('');

	const [imagenActiva, setImagenActiva] = useState('');

	const debouncedFetchData = debounce(() => {
		setLoading(true);
		let tipoBusqueda = 'agregar';
		if (busquedaTemp !== searchText) {
			setBusqeudaTemp(searchText);
			tipoBusqueda = 'nuevaBusqueda';
			setPage(0);
		}

		dispatch(
			getKardex({
				offset: page * rowsPerPage,
				limit: rowsPerPage,
				busqueda: searchText,
				tipoBusqueda,
			})
		).then(() => setLoading(false));
	}, 500);

	useEffect(() => {
		debouncedFetchData(); // Llamar a la versión debounced de fetchData
		return debouncedFetchData.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [dispatch, page, rowsPerPage, searchText]);

	function handleRequestSort(event, property) {
		const id = property;
		let direction = 'desc';

		if (order.id === property && order.direction === 'desc') {
			direction = 'asc';
		}

		setOrder({
			direction,
			id,
		});
	}

	function handleSelectAllClick(event) {
		if (event.target.checked) {
			setSelected(data.map(n => n.id));
			return;
		}
		setSelected([]);
	}

	function handleDeselect() {
		setSelected([]);
	}

	function handleClick(item) {
		/* navigate(`/comercial/clientes/${item.id}`); */
	}

	function handleCheck(event, id) {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}

		setSelected(newSelected);
	}

	function handleChangePage(event, value) {
		setPage(value);
	}

	function handleChangeRowsPerPage(event) {
		setRowsPerPage(event.target.value);
	}

	const obtenerAllKardex = async () => {
		try {
			const response = await httpClient.get('almacen-tela/kardex/all');
			setDataTotalKardex(response.data.body[0]);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		setData(kardex);
	}, [kardex]);

	useEffect(() => {
		obtenerAllKardex();
	}, []);

	if (loading) {
		return <FuseLoading />;
	}

	if (data.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No hay Kardex!
				</Typography>
			</motion.div>
		);
	}

	const formatDate = date => {
		const fecha = Moment(date).locale('es');
		return fecha.format('DD/MM/YYYY');
	};

	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: '90%',
		height: '90%',
		bgcolor: 'background.paper',
		borderRadius: 3,
		overflowY: 'scroll',
		p: 4,
	};
	const constPading = 8;
	const border = 1;

	const rows = [
		{
			id: 'Producto',
			align: 'left',
			disablePadding: false,
			label: 'Producto',
			sort: true,
		},
		{
			id: 'Color',
			align: 'left',
			disablePadding: false,
			label: 'Color',
			sort: true,
		},
		{
			id: 'ColorCliente',
			align: 'left',
			disablePadding: false,
			label: 'Color Cliente',
			sort: true,
		},
		{
			id: 'Nro de Partida',
			align: 'center',
			disablePadding: false,
			label: 'Nro de Partida',
			sort: true,
		},
		{
			id: 'Cantidad',
			align: 'center',
			disablePadding: false,
			label: 'Cantidad',
			sort: true,
		},
		{
			id: 'Rollos',
			align: 'center',
			disablePadding: false,
			label: 'Rollos',
			sort: true,
		},
		{
			id: 'Ubicacion',
			align: 'center',
			disablePadding: false,
			label: 'Ubicación',
			sort: true,
		},
		{
			id: 'Clasificacion',
			align: 'left',
			disablePadding: false,
			label: 'Clasificación',
			sort: true,
		},
		{
			id: 'OP',
			align: 'left',
			disablePadding: false,
			label: 'OP',
			sort: true,
		},
		{
			id: 'OPASIGNADA',
			align: 'left',
			disablePadding: false,
			label: 'OP Asignada',
			sort: true,
		},
	];

	return (
		<div className="w-full flex flex-col">
			<div style={{ display: 'none' }}>
				<Table
					id="tabla-kardex"
					style={{
						borderWidth: border,
						borderColor: 'black',
					}}
				>
					<TableHead>
						<TableRow className="h-48 sm:h-64">
							{rows.map(row => {
								return (
									<TableCell
										key={row.id}
										style={{
											borderWidth: border,
											borderColor: 'black',
											padding: constPading,
										}}
										align="center"
									>
										{row.label}
									</TableCell>
								);
							}, this)}
						</TableRow>
					</TableHead>
					<TableBody>
						{dataTotalKardex.map(n => {
							const listaOps = [];
							if (n.producto?.detallesProductosIngresosAlmacenesTelas?.length > 0)
								n.producto?.detallesProductosIngresosAlmacenesTelas.forEach(op => {
									if (
										op.registroIngresoAlmacenTela?.tipoOperacion ===
										'Ingreso con Orden de Producción (OP)'
									) {
										if (op.registroIngresoAlmacenTela?.produccion)
											listaOps.push(op.registroIngresoAlmacenTela?.produccion.codigo);
									} else if (op.registroIngresoAlmacenTela?.ordenCompra?.produccion)
										listaOps.push(op.registroIngresoAlmacenTela?.ordenCompra?.produccion.codigo);
								});

							if (listaOps.length === 0) {
								listaOps.push('Sin OP');
							}

							return (
								<TableRow key={n.id}>
									<TableCell
										align="center"
										style={{
											borderWidth: border,
											borderColor: 'black',
											padding: constPading,
											width: '30px',
										}}
									>
										{n.producto?.tela?.nombre}
									</TableCell>
									<TableCell
										align="center"
										style={{
											borderWidth: border,
											borderColor: 'black',
											padding: constPading,
											width: '30px',
										}}
									>
										{n.producto?.color.descripcion}
									</TableCell>
									<TableCell
										align="center"
										style={{
											borderWidth: border,
											borderColor: 'black',
											padding: constPading,
											width: '30px',
										}}
									>
										{n.producto?.colorCliente}
									</TableCell>
									<TableCell
										align="center"
										style={{
											borderWidth: border,
											borderColor: 'black',
											padding: constPading,
											width: '30px',
										}}
									>
										{n.producto?.partida}
									</TableCell>
									<TableCell
										align="center"
										style={{
											borderWidth: border,
											borderColor: 'black',
											padding: constPading,
											width: '30px',
										}}
									>
										{`${n.cantidad} ${n.unidad?.prefijo}`}
									</TableCell>
									<TableCell
										align="center"
										style={{
											borderWidth: border,
											borderColor: 'black',
											padding: constPading,
											width: '30px',
										}}
									>
										{n?.rollos}
									</TableCell>
									<TableCell
										className="p-4 md:p-16 max-w-52 truncate min-w-48"
										component="th"
										scope="row"
									>
										{n.ubicacion || 'Sin ubicación'}
									</TableCell>
									<TableCell
										align="center"
										style={{
											borderWidth: border,
											borderColor: 'black',
											padding: constPading,
											width: '30px',
										}}
									>
										{n.producto?.clasificacion}
									</TableCell>
									<TableCell
										align="center"
										style={{
											borderWidth: border,
											borderColor: 'black',
											padding: constPading,
											width: '30px',
										}}
									>
										<ol style={{ width: '90px' }}>
											{n.producto?.detallesProductosIngresosAlmacenesTelas?.length > 0 ? (
												listaOps.map(op => <li>{op}</li>)
											) : (
												<li>Sin OP</li>
											)}
										</ol>
									</TableCell>
									<TableCell
										align="center"
										style={{
											borderWidth: border,
											borderColor: 'black',
											padding: constPading,
											width: '30px',
										}}
									>
										<ol style={{ width: '90px' }}>
											{n.producto?.produccionAsignada ? (
												<li>{n.producto?.produccionAsignada?.codigo}</li>
											) : (
												<li>Sin asignación</li>
											)}
										</ol>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
					<KardexTableHead
						page={page}
						rowsPerPage={rowsPerPage}
						selectedProductIds={selected}
						order={order}
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={data.length}
						onMenuItemClick={handleDeselect}
					/>

					<TableBody>
						{_.orderBy(
							data,
							[
								o => {
									switch (order.id) {
										case 'categories': {
											return o.categories[0];
										}
										default: {
											return o[order.id];
										}
									}
								},
							],
							[order.direction]
						)
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map(n => {
								console.log('Neeeee: ', n);
								const isSelected = selected.indexOf(n.id) !== -1;
								const listaOps = [];
								if (n.producto?.detallesProductosIngresosAlmacenesTelas?.length > 0)
									n.producto?.detallesProductosIngresosAlmacenesTelas.forEach(op => {
										if (
											op.registroIngresoAlmacenTela?.tipoOperacion ===
											'Ingreso con Orden de Producción (OP)'
										) {
											if (op.registroIngresoAlmacenTela?.produccion)
												listaOps.push(op.registroIngresoAlmacenTela?.produccion.codigo);
										} else if (op.registroIngresoAlmacenTela?.ordenCompra?.produccion)
											listaOps.push(op.registroIngresoAlmacenTela?.ordenCompra?.produccion.codigo);
									});

								if (listaOps.length === 0) {
									listaOps.push('Sin OP');
								}

								return (
									<TableRow
										className="h-72 cursor-pointer"
										hover
										role="checkbox"
										aria-checked={isSelected}
										tabIndex={-1}
										key={n.id}
										selected={isSelected}
										onClick={event => handleClick(n)}
									>
										<TableCell className="w-8 md:w-8 text-center" padding="none" />

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.producto?.tela?.nombre}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											<div
												style={{
													display: 'flex',
													flexDirection: 'row',
													alignItems: 'center',
												}}
											>
												<div>
													<Avatar
														variant="rounded"
														src={baseUrl + n.producto?.color?.alternativas[0]?.imagenUrl}
														sx={{ width: 56, height: 56 }}
														onClick={() => {
															if (n.producto?.color?.alternativas[0]?.imagenUrl) {
																setImagenActiva(
																	baseUrl + n.producto?.color?.alternativas[0]?.imagenUrl
																);
															}
														}}
													/>
												</div>
												&nbsp; &nbsp;
												<div>{n.producto?.color.descripcion}</div>
											</div>
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
											{n.producto?.colorCliente || '-'}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
											{n.producto?.partida}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
											{`${n.cantidad} ${n.unidad?.prefijo}`}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
											{n?.rollos}
										</TableCell>
										<TableCell
											className="p-4 md:p-16 max-w-52 truncate min-w-48"
											component="th"
											scope="row"
										>
											<Tooltip
												title={n.ubicacion || 'Sin ubicación'}
												placement="left-start"
												className="truncate"
											>
												<ButtonUnstyled variant="text" size="small" className="truncate">
													{n.ubicacion || 'Sin ubicación'}
												</ButtonUnstyled>
											</Tooltip>
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.producto?.clasificacion}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											<ol style={{ width: '90px' }}>
												{n.producto?.detallesProductosIngresosAlmacenesTelas?.length > 0 ? (
													listaOps.map(op => <li>{op}</li>)
												) : (
													<li>Sin OP</li>
												)}
											</ol>
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											<ol style={{ width: '90px' }}>
												{n.producto?.produccionAsignada ? (
													<li>{n.producto?.produccionAsignada?.codigo}</li>
												) : (
													<li>Sin asignación</li>
												)}
											</ol>
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											<div
												style={{
													width: '100%',
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'center',
													justifyContent: 'center',
													gap: '10px',
												}}
											>
												<Button
													variant="contained"
													size="small"
													color="primary"
													onClick={() => {
														setOpenModal(true);
														setDataModal({ data: n, page, rowsPerPage, searchText });
													}}
												>
													Cambiar Ubicación
												</Button>
												{edicionColorKardex && (
													<Button
														variant="contained"
														size="small"
														color="primary"
														onClick={() => {
															setOpenModalColor(true);
															setDataModalColor({ data: n, page, rowsPerPage, searchText });
														}}
													>
														Cambiar Color
													</Button>
												)}
												<Button
													variant="contained"
													size="small"
													color="primary"
													onClick={() => {
														setOpenModalAsignacion(true);
														setDataModalAsignacion({ data: n, page, rowsPerPage, searchText });
													}}
												>
													Cambiar Asignación
												</Button>
											</div>
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</FuseScrollbars>

			<TablePagination
				className="flex-shrink-0 border-t-1"
				component="div"
				count={totalKardex}
				rowsPerPage={rowsPerPage}
				page={page}
				backIconButtonProps={{
					'aria-label': 'Previous Page',
				}}
				nextIconButtonProps={{
					'aria-label': 'Next Page',
				}}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>

			{imagenActiva !== '' ? (
				<Lightbox
					showTitle={false}
					onClose={() => setImagenActiva('')}
					image={imagenActiva}
					title="Imagen"
				/>
			) : null}
		</div>
	);
}

export default withRouter(KardexTable);

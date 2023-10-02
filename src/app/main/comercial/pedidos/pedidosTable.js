/* eslint-disable no-nested-ternary */
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
import PreviewIcon from '@mui/icons-material/Preview';
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, IconButton, Tooltip } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import { formatDate } from 'utils/Format';
import showToast from 'utils/Toast';
import { MODULOS } from 'constants/constantes';
import { ModalConfirmDelete } from 'app/shared-components/ModalConfirmDelete';
import { getPedidos, removePedidos, selectPedidos } from '../store/pedido/pedidosSlice';
import PedidosTableHead from './pedidosTableHeader';
import ModalPedidos from './modalPedidos';
import ModalAgregarAvios from './modalAgregarAvios';

function PedidosTable() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const pedidos = useSelector(selectPedidos);
	const totalPedidos = useSelector(({ comercial }) => comercial.pedidos.total);
	const rolActual = useSelector(({ auth }) => auth.user.role);
	const modulos = useSelector(
		({ auth }) => auth.roles[0].find(rol => rol.id === rolActual.id).modulos
	);
	const searchText = useSelector(({ comercial }) => comercial.pedidos.searchText);

	const agregarAvioEstiloAsignado =
		modulos.findIndex(modulo => modulo.nombre === MODULOS.agregarAvioEstiloAsignado) !== -1;
	const editarPedidoAsignado =
		modulos.findIndex(modulo => modulo.nombre === MODULOS.editarPedidoAsignado) !== -1;

	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(pedidos);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null,
	});

	const [visible, setVisible] = useState(false);
	const [dataModal, setDataModal] = useState(null);
	const [busquedaTemp, setBusqeudaTemp] = useState('');
	const [visibleAgregarAvios, setVisibleAgregarAvios] = useState(false);
	const [idPedido, setIdPedido] = useState(null);

	const [openModalDelete, setOpenModalDelete] = useState(false);
	const [itemDelete, setItemDelete] = useState(null);

	const debouncedFetchData = debounce(() => {
		setLoading(true);
		let tipoBusqueda = 'agregar';
		if (busquedaTemp !== searchText) {
			setBusqeudaTemp(searchText);
			tipoBusqueda = 'nuevaBusqueda';
			setPage(0);
		}

		dispatch(
			getPedidos({
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

	useEffect(() => {
		setData(pedidos);
	}, [pedidos]);

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
		navigate(`/comercial/pedidos/${item.id}`);
	}

	const onClickAgregarAvio = item => {
		setVisibleAgregarAvios(true);
		setIdPedido(item.id);
	};

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
					No hay pedidos!
				</Typography>
			</motion.div>
		);
	}

	const onClickEditar = item => {
		navigate(`/comercial/pedidos/${item.id}`);
	};

	const onClickEliminar = item => {
		setOpenModalDelete(true);
		setItemDelete(item);
	};

	async function eliminar(item) {
		try {
			const error = await dispatch(
				removePedidos({
					ids: [item.id],
					offset: page * rowsPerPage,
					limit: rowsPerPage,
				})
			);
			if (error.error) throw error;
			return error;
		} catch (error) {
			console.log('Error:', error);
			throw error;
		}
	}

	const onClickVer = row => {
		setDataModal(row);
		setVisible(true);
	};

	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
					<PedidosTableHead
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
								console.log('LISTA DE LA TABLA: ', n);

								const isSelected = selected.indexOf(n.id) !== -1;
								return (
									<TableRow className="h-72 cursor-pointer" hover tabIndex={-1} key={n.id}>
										<TableCell className="w-40 md:w-64 text-center" padding="none" />

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.fullCorrelativo}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.po}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{formatDate(n.created_at)}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.marca?.marca}
										</TableCell>

										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											style={{ color: n.activo ? 'green' : 'red' }}
										>
											{n.activo ? 'Activo' : 'Anulado'}
										</TableCell>

										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											style={{ textAlign: 'end' }}
										>
											{!n.activo ? (
												'-'
											) : n.asignado ? (
												<>
													{agregarAvioEstiloAsignado && (
														<>
															<Button
																variant="contained"
																color="secondary"
																size="small"
																onClick={() => onClickAgregarAvio(n)}
															>
																Agregar Avíos
															</Button>
															&nbsp; &nbsp;
														</>
													)}
													{editarPedidoAsignado && (
														<>
															<Button
																variant="contained"
																color="success"
																size="small"
																onClick={() => onClickEditar(n)}
															>
																Editar asignado
															</Button>
															&nbsp; &nbsp;
														</>
													)}
													<Tooltip title="Visualizar">
														<IconButton
															// startIcon={}
															// variant="contained"
															color="success"
															size="small"
															onClick={() => onClickVer(n)}
														>
															<PreviewIcon />
														</IconButton>
													</Tooltip>
												</>
											) : (
												<>
													<Button
														startIcon={<EditIcon />}
														variant="contained"
														color="success"
														size="small"
														onClick={() => onClickEditar(n)}
													>
														Editar
													</Button>
													&nbsp; &nbsp;
													<Button
														startIcon={<DeleteIcon />}
														variant="contained"
														color="error"
														size="small"
														onClick={() => onClickEliminar(n)}
													>
														Eliminar
													</Button>
												</>
											)}
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
				count={totalPedidos}
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
			{visible && <ModalPedidos visible={visible} setVisible={setVisible} data={dataModal} />}
			{visibleAgregarAvios && (
				<ModalAgregarAvios
					visible={visibleAgregarAvios}
					setVisible={setVisibleAgregarAvios}
					idPedido={idPedido}
					page={page}
					rowsPerPage={rowsPerPage}
					searchText={searchText}
				/>
			)}
			{openModalDelete && (
				<ModalConfirmDelete
					visible={openModalDelete}
					setVisible={setOpenModalDelete}
					callback={() => {
						showToast(
							{
								promesa: eliminar,
								parametros: [itemDelete],
							},
							'delete',
							'pedido'
						);
						setOpenModalDelete(false);
					}}
					register={itemDelete?.fullCorrelativo || itemDelete?.po || null}
				/>
			)}
		</div>
	);
}

export default withRouter(PedidosTable);

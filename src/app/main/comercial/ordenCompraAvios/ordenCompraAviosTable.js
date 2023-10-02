import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import debounce from 'lodash.debounce';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { IconButton } from '@mui/material';
import Moment from 'moment';
import 'moment/locale/es';
import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import { ModalConfirmDelete } from 'app/shared-components/ModalConfirmDelete';
import showToast from 'utils/Toast';
import {
	getOCAvios,
	removeOCAvios,
	selectOCAvios,
} from '../store/ordenCompraAvio/ordenCompraAviosSlice';
import OrdenCompraAviosTableHead from './ordenCompraAviosTableHeader';
import ModalDetallesOCA from './ordenCompraModal';

const formatDate = date => {
	const fecha = Moment(date).locale('es');
	console.log(fecha);
	return fecha.format('DD [de] MMMM [del] YYYY');
};

function OrdenCompraAviosTable(props) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const ordenCompraAvios = useSelector(selectOCAvios);
	const totalOrdenCompraAvios = useSelector(({ comercial }) => comercial.ordenCompraAvios.total);
	const searchText = useSelector(({ comercial }) => comercial.ordenCompraAvios.searchText);

	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(ordenCompraAvios);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null,
	});

	const [busquedaTemp, setBusquedaTemp] = useState('');

	const [openModal, setOpenModal] = useState(false);
	const [dataModal, setDataModal] = useState(null);

	const [openModalDelete, setOpenModalDelete] = useState(false);
	const [itemDelete, setItemDelete] = useState(null);

	const debouncedFetchData = debounce(() => {
		setLoading(true);
		let tipoBusqueda = 'agregar';
		if (busquedaTemp !== searchText) {
			setBusquedaTemp(searchText);
			tipoBusqueda = 'nuevaBusqueda';
			setPage(0);
		}

		dispatch(
			getOCAvios({
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
		setData(ordenCompraAvios);
	}, [ordenCompraAvios]);

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
		navigate(`/comercial/orden-compra-avios/${item.id}`);
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
					No hay ordenCompraAvios!
				</Typography>
			</motion.div>
		);
	}

	const onClickEditar = item => {
		navigate(`/comercial/orden-compra-avios/${item.id}`);
	};

	const onClickEliminar = item => {
		setOpenModalDelete(true);
		setItemDelete(item);
	};

	async function eliminar(item) {
		try {
			const error = await dispatch(
				removeOCAvios({
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

	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
					<OrdenCompraAviosTableHead
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
								console.log('Lista de Orden de Compra Avios: ', n);
								const isSelected = selected.indexOf(n.id) !== -1;
								return (
									<TableRow className="h-72 cursor-pointer" hover tabIndex={-1} key={n.id}>
										<TableCell className="w-40 md:w-64 text-center" padding="none">
											{/* 	<Checkbox
												checked={isSelected}
												onClick={event => event.stopPropagation()}
												onChange={event => handleCheck(event, n.id)}
											/> */}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.codigo}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{formatDate(n.fechaEmision)}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{formatDate(n.fechaEntrega)}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.proveedor.tipo === 'N' ? n.proveedor.nombres : n.proveedor.razonSocial}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.moneda}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.produccion ? n.produccion.codigo : '-'}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.estado ? 'ABIERTO' : 'CERRADO'}
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
											style={{ textAlign: 'end', width: '220px' }}
										>
											{!n.activo ? (
												'-'
											) : (
												<>
													<div
														style={{
															width: '100%',
															display: 'flex',
															flexDirection: 'row',
															alignItems: 'center',
															justifyContent: 'space-between',
														}}
													>
														<IconButton
															size="small"
															color="primary"
															onClick={() => {
																setOpenModal(true);
																setDataModal(n);
															}}
														>
															<RemoveRedEyeIcon />
														</IconButton>
														<IconButton
															size="small"
															color="success"
															onClick={() => onClickEditar(n)}
														>
															<EditIcon />
														</IconButton>
														<IconButton
															size="small"
															color="error"
															onClick={() => onClickEliminar(n)}
														>
															<DeleteIcon />
														</IconButton>
													</div>
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
				count={totalOrdenCompraAvios}
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
			{openModal && (
				<ModalDetallesOCA openModal={openModal} setOpenModal={setOpenModal} dataModal={dataModal} />
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
							'orden compra de avio'
						);
						setOpenModalDelete(false);
					}}
					register={itemDelete?.codigo || null}
				/>
			)}
		</div>
	);
}

export default withRouter(OrdenCompraAviosTable);

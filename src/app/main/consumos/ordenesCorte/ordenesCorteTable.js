/* eslint-disable no-nested-ternary */
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
// import Icon from '@mui/material/Icon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import EditIcon from '@mui/icons-material/Edit';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { IconButton } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';

import { ModalConfirmDelete } from 'app/shared-components/ModalConfirmDelete';
import showToast from 'utils/Toast';
import OrdenesCorteTableHead from './ordenesCorteTableHeader';
import {
	getOrdenesCorte,
	removeOrdenesCorte,
	selectOrdenesCorte,
} from '../store/orden-corte/ordenesCorteSlice';
import ModalDetalles from './modalDetalles';
import ModalDetallesOC from './ordenesCorteModal';

function OrdenesCorteTable(props) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const ordenesCorte = useSelector(selectOrdenesCorte);
	const totalOrdenesCorte = useSelector(({ consumos }) => consumos.ordenesCorte.total);
	const searchText = useSelector(({ consumos }) => consumos.ordenesCorte.searchText);

	const [loading, setLoading] = useState(true);
	const [visibleModal, setVisibleModal] = useState(false);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(ordenesCorte);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null,
	});

	const [busquedaTemp, setBusquedaTemp] = useState('');

	const [openModalDelete, setOpenModalDelete] = useState(false);
	const [itemDelete, setItemDelete] = useState(null);

	const [openModal, setOpenModal] = useState(false);
	const [dataModal, setDataModal] = useState();

	const debouncedFetchData = debounce(() => {
		setLoading(true);
		let tipoBusqueda = 'agregar';
		if (busquedaTemp !== searchText) {
			setBusquedaTemp(searchText);
			tipoBusqueda = 'nuevaBusqueda';
			setPage(0);
		}

		dispatch(
			getOrdenesCorte({
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
		setData(ordenesCorte);
	}, [ordenesCorte]);

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
		navigate(`/consumos/ordenes-corte/${item.id}`);
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
					No hay ordenes de corte!
				</Typography>
			</motion.div>
		);
	}

	const onClickDetalles = item => {
		setVisibleModal(true);
		setDataModal(item);
		// navigate(`/consumos-modelaje/ordenes-corte/${item.id}`);
	};

	const onClickEliminar = item => {
		setOpenModalDelete(true);
		setItemDelete(item);
	};

	async function eliminar(item) {
		try {
			const error = await dispatch(
				removeOrdenesCorte({
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
					<OrdenesCorteTableHead
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
								const isSelected = selected.indexOf(n.id) !== -1;
								const producciones = [];
								const marcas = [];
								const colores = [];

								n.ordenesCorte.forEach(orden => {
									if (producciones.indexOf(orden.produccion.nombre) === -1) {
										producciones.push(orden.produccion.codigo);
										marcas.push(orden.produccion.marca.marca);
										colores.push(orden.color.descripcion);
									}
								});

								const produccionesUnicas = producciones.filter(
									(produccion, index) => producciones.indexOf(produccion) === index
								);
								const marcasUnicas = marcas.filter(
									(marca, index) => marcas.indexOf(marca) === index
								);
								const coloresUnicos = colores.filter(
									(color, index) => colores.indexOf(color) === index
								);

								return (
									<TableRow
										className="h-72 cursor-pointer"
										hover
										/* role="checkbox"
										aria-checked={isSelected} */
										tabIndex={-1}
										key={n.id}
										/* selected={isSelected}
										onClick={event => handleClick(n)} */
									>
										<TableCell className="w-40 md:w-64 text-center" padding="none">
											{/* 	<Checkbox
												checked={isSelected}
												onClick={event => event.stopPropagation()}
												onChange={event => handleCheck(event, n.id)}
											/> */}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{`${n.codigo.toString().padStart(6, '0')}`}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{produccionesUnicas.map((item, index) => (
												<div key={index}>
													<div>{item}</div>
												</div>
											))}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{marcasUnicas.map((item, index) => (
												<div key={index}>
													<div>{item}</div>
												</div>
											))}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{coloresUnicos.map((item, index) => (
												<div key={index}>
													<div>{item}</div>
												</div>
											))}
										</TableCell>
										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											style={{ textAlign: 'end' }}
										>
											{n.ordenesCorte && n.ordenesCorte.length > 1 ? (
												<IconButton
													size="small"
													color="primary"
													onClick={() => {
														onClickDetalles(n);
													}}
												>
													<AccountTreeIcon />
												</IconButton>
											) : (
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
														onClick={() =>
															navigate(`/consumos-modelaje/ordenes-corte/${n.id}?action=ET`)
														}
													>
														<EditIcon />
													</IconButton>
												</div>
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
				count={totalOrdenesCorte}
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
			{visibleModal && (
				<ModalDetalles visible={visibleModal} setVisible={setVisibleModal} dataModal={dataModal} />
			)}
			{openModal && (
				<ModalDetallesOC openModal={openModal} setOpenModal={setOpenModal} dataModal={dataModal} />
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
							'orden corte'
						);
						setOpenModalDelete(false);
					}}
				/>
			)}
		</div>
	);
}

export default withRouter(OrdenesCorteTable);

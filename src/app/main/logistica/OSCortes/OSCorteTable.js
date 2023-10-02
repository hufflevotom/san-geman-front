/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import moment from 'moment';
import debounce from 'lodash.debounce';
import { motion } from 'framer-motion';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';

import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';

import { ModalConfirmDelete } from 'app/shared-components/ModalConfirmDelete';
import showToast from 'utils/Toast';
import OrdenesCorteTableHead from './OSCorteTableHeader';
import { getOSCortes, removeOSCortes, selectOSCortes } from '../store/os-corte/oSCortesSlice';

function OrdenesServicioTable(props) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const oSCortes = useSelector(selectOSCortes);
	const totalOrdenesCorte = useSelector(({ logistica }) => logistica.oSCortes.total);
	const searchText = useSelector(({ logistica }) => logistica.oSCortes.searchText);

	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(oSCortes);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null,
	});

	const [busquedaTemp, setBusquedaTemp] = useState('');

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
			getOSCortes({
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
		setData(oSCortes);
	}, [oSCortes]);

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
		navigate(`/logistica/ordenes-servicio-corte/${item.id}`);
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

	const onClickEditar = item => {
		navigate(`/logistica/ordenes-servicio-corte/${item.id}`);
	};

	const onClickEliminar = item => {
		setOpenModalDelete(true);
		setItemDelete(item);
	};

	async function eliminar(item) {
		try {
			const error = await dispatch(
				removeOSCortes({
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
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.codigo}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.produccion.codigo}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.proveedor && n.proveedor.tipo === 'J'
												? n.proveedor.tipo === 'J'
													? n.proveedor.razonSocial
													: `${n.proveedor.apellidoPaterno} ${n.proveedor.apellidoMaterno} ${n.proveedor.nombres}`
												: `${n.proveedor.apellidoPaterno} ${n.proveedor.apellidoMaterno} ${n.proveedor.nombres}`}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{moment(n.fechaEntrega).format('DD/MM/YYYY')}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{moment(n.fechaEmision).format('DD/MM/YYYY')}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											S/ {n.total}
										</TableCell>
										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											style={{ textAlign: 'end' }}
										>
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
					register={itemDelete?.codigo || null}
				/>
			)}
		</div>
	);
}

export default withRouter(OrdenesServicioTable);

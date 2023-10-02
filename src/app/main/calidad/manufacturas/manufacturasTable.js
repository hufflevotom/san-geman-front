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
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import showToast from 'utils/Toast';
import {
	getManufacturas,
	removeManufacturas,
	selectManufacturas,
} from '../store/manufactura/manufacturasSlice';
import ManufacturasTableHead from './manufacturasTableHeader';

function ManufacturasTable() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const manufacturas = useSelector(selectManufacturas);
	const totalManufacturas = useSelector(({ calidad }) => calidad.manufacturas.total);
	const searchText = useSelector(({ calidad }) => calidad.manufacturas.searchText);

	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(manufacturas);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null,
	});

	const [busquedaTemp, setBusqeudaTemp] = useState('');

	const debouncedFetchData = debounce(() => {
		setLoading(true);
		let tipoBusqueda = 'agregar';
		if (busquedaTemp !== searchText) {
			setBusqeudaTemp(searchText);
			tipoBusqueda = 'nuevaBusqueda';
			setPage(0);
		}

		dispatch(
			getManufacturas({
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
		setData(manufacturas);
	}, [manufacturas]);

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
		navigate(`/calidad/manufacturas/${item.id}`);
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
					No hay manufacturas!
				</Typography>
			</motion.div>
		);
	}

	const onClickEditar = item => {
		navigate(`/calidad/manufacturas/${item.id}`);
	};

	const onClickEliminar = item => {
		showToast(
			{
				promesa: eliminar,
				parametros: [item],
			},
			'delete',
			'manufactura'
		);
	};

	async function eliminar(item) {
		try {
			const error = await dispatch(
				removeManufacturas({
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
					<ManufacturasTableHead
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
										/* 	selected={isSelected}
										onClick={event => handleClick(n)} */
									>
										<TableCell className="w-40 md:w-64 text-center" padding="none">
											{/* <Checkbox
												checked={isSelected}
												onClick={event => event.stopPropagation()}
												onChange={event => handleCheck(event, n.id)}
											/> */}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.tipo === 'N'
												? n.natTipoDocumento === 'RUC'
													? `RUC: ${n.ruc}`
													: `DOC: ${n.natNroDocumento}`
												: `RUC: ${n.ruc}`}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.tipoManufactura === 'N'
												? n.tipo === 'N'
													? `${n.natApellidoPaterno} ${n.natApellidoMaterno} ${n.natNombres}`
													: n.razónSocial
												: n.razónSocial}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
											{`${n.porcentajeError}%`}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.tipoManufactura === 'N'
												? n.tipo === 'N'
													? 'Nacional / Persona Natural'
													: 'Nacional / Persona Jurídica'
												: 'Extranjero'}
										</TableCell>
										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											style={{ textAlign: 'end', width: '220px' }}
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
				count={totalManufacturas}
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
		</div>
	);
}

export default withRouter(ManufacturasTable);

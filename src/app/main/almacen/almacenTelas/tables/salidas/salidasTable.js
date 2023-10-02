/* eslint-disable no-nested-ternary */
import Moment from 'moment';
import 'moment/locale/es';
import debounce from 'lodash.debounce';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import { Button, IconButton } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import {
	getSalidas,
	selectSalidas,
} from 'app/main/almacen/store/almacenTela/salidas/salidasTelasSlice';
import SalidasTableHead from './salidasTableHead';

function SalidasTable({ setOpenModal, setDataModal, setOpenAnular, setCallBackAuth }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const salidas = useSelector(selectSalidas);
	const totalSalidas = useSelector(({ almacen }) => almacen.salidas.total);
	const searchText = useSelector(({ almacen }) => almacen.salidas.searchText);

	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(salidas);
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
			getSalidas({
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
		setData(salidas);
	}, [salidas]);

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

	const onClickEditar = item => {
		navigate(`/almacen/telas/salida/${item.id}`);
	};

	const onClickAnular = item => {
		setOpenAnular(true);
		setDataModal(item);
		setCallBackAuth(item.id);
	};

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
					No hay Salidas!
				</Typography>
			</motion.div>
		);
	}

	const formatDate = date => {
		const fecha = Moment(date).locale('es');
		console.log(fecha);
		return fecha.format('DD [de] MMMM [del] YYYY');
	};

	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
					<SalidasTableHead
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
								let totalCantidad = 0;

								n.detallesProductosSalidasAlmacenesTelas?.forEach((detalle, index) => {
									totalCantidad += detalle.cantidad;
								});

								const isSelected = selected.indexOf(n.id) !== -1;
								return (
									<TableRow
										style={n.anulado ? { backgroundColor: '#ffd5d5' } : {}}
										className="h-72 cursor-pointer"
										hover
										role="checkbox"
										aria-checked={isSelected}
										tabIndex={-1}
										key={n.id}
										selected={isSelected}
										onClick={event => handleClick(n)}
									>
										<TableCell padding="none" className="w-8 md:w-8 text-center z-99" />

										<TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
											{n.nNota}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
											{formatDate(n.fechaRegistro || n.created_at)}
										</TableCell>
										{/* <TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
											KILOGRAMOS
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
											{totalCantidad}
										</TableCell> */}
										<TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
											<div
												style={{
													width: '100%',
													display: 'flex',
													flexDirection: 'row',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												<Button
													startIcon={<RemoveRedEyeIcon />}
													variant="contained"
													size="small"
													color="primary"
													onClick={() => {
														setOpenModal(true);
														setDataModal(n);
													}}
												>
													Ver
												</Button>
												{/* <Button
												startIcon={<EditIcon />}
												variant="contained"
												color="success"
												size="small"
												onClick={() => onClickEditar(n)}
											>
												Editar
											</Button> */}
												<IconButton
													style={n.anulado ? { display: 'none' } : {}}
													color="error"
													size="small"
													onClick={() => onClickAnular(n)}
												>
													<RemoveCircleIcon />
												</IconButton>
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
				count={totalSalidas}
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

export default withRouter(SalidasTable);

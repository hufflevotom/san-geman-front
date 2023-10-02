/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import _ from '@lodash';
import { motion } from 'framer-motion';
import Moment from 'moment';
import 'moment/locale/es';

import { Button } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import FuseScrollbars from '@fuse/core/FuseScrollbars';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';

import {
	getReporteOp,
	resetTabla,
	selectReporteOpAvios,
} from 'app/main/almacen/store/almacenAvio/reporteOp/reporteOpAviosSlice';

import ReporteOpTableHead from './reporteOpTableHead';

function ReporteOpTable(props) {
	const { setOpenModal, setDataModal } = props;

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const model = useSelector(selectReporteOpAvios);
	const total = useSelector(({ almacen }) => almacen.reporteOpAvio.total);
	const searchText = useSelector(({ almacen }) => almacen.reporteOpAvio.searchText);

	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(model);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState({
		direction: 'asc',
		id: 'Nota',
	});

	const [busquedaTemp, setBusqeudaTemp] = useState('');

	useEffect(() => {
		return () => {
			dispatch(resetTabla());
		};
	}, []);

	const debouncedFetchData = debounce(() => {
		setLoading(true);
		let tipoBusqueda = 'agregar';
		if (busquedaTemp !== searchText) {
			setBusqeudaTemp(searchText);
			tipoBusqueda = 'nuevaBusqueda';
			setPage(0);
		}

		dispatch(
			getReporteOp({
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
		setData(model);
	}, [model]);

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
					No hay Ordenes de produccion!
				</Typography>
			</motion.div>
		);
	}

	const formatDate = date => {
		const fecha = Moment(date).locale('es');
		return fecha.format('DD/MM/YYYY');
	};

	return (
		<>
			<div className="w-full flex flex-col">
				<FuseScrollbars className="flex-grow overflow-x-auto">
					<Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
						<ReporteOpTableHead
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
									return (
										<TableRow
											style={n.anulado ? { backgroundColor: '#ffd5d5' } : {}}
											className="h-72 cursor-pointer"
											hover
											tabIndex={-1}
											key={n.id}
										>
											<TableCell className="w-40 md:w-64 text-center" padding="none" />
											<TableCell className="p-4 md:p-16" component="th" scope="row">
												{n.codigo}
											</TableCell>
											<TableCell className="p-4 md:p-16" component="th" scope="row">
												{formatDate(n.fechaDespacho)}
											</TableCell>

											<TableCell
												className="p-4 md:p-16"
												component="th"
												scope="row"
												style={{ textAlign: 'end' }}
											>
												<Button
													startIcon={<RemoveRedEyeIcon />}
													variant="contained"
													size="small"
													color="primary"
													onClick={() => {
														setOpenModal(true);
														setDataModal({
															id: n.id,
															tipo: 'ingresos',
														});
													}}
												>
													Ingresos
												</Button>
												{/* &nbsp; &nbsp;
												<Button
													startIcon={<RemoveRedEyeIcon />}
													variant="contained"
													size="small"
													color="secondary"
													onClick={() => {
														setOpenModal(true);
														setDataModal({
															id: n.id,
															tipo: 'salidas',
														});
													}}
												>
													Salidas
												</Button> */}
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
					count={total}
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
		</>
	);
}

export default withRouter(ReporteOpTable);

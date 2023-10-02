/* eslint-disable no-nested-ternary */
import 'moment/locale/es';

import FuseScrollbars from '@fuse/core/FuseScrollbars';

import _ from '@lodash';
import { Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import { formatDate } from 'utils/Format';
import {
	getSalidasMixtas,
	resetTabla,
	selectSalidasMixtas,
} from 'app/main/almacen/store/guias/salidasMixtas/salidasMixtasSlice';
import SalidasTableHead from './salidasTableHeader';

function SalidasTable(props) {
	const { setOpenModal, setDataModal } = props;

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const salidas = useSelector(selectSalidasMixtas);
	const totalIngresos = useSelector(({ almacen }) => almacen.salidasMixtas.total);
	const searchText = useSelector(({ almacen }) => almacen.salidasMixtas.searchText);

	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(salidas);
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

	useEffect(() => {
		let tipoBusqueda = 'agregar';
		if (busquedaTemp !== searchText) {
			setBusqeudaTemp(searchText);
			tipoBusqueda = 'nuevaBusqueda';
			setPage(0);
		}

		dispatch(
			getSalidasMixtas({
				offset: page * rowsPerPage,
				limit: rowsPerPage,
				busqueda: searchText,
				tipoBusqueda,
			})
		).then(() => setLoading(false));
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
					No hay Ingresos!
				</Typography>
			</motion.div>
		);
	}

	const onClickEditar = item => {
		navigate(`/almacen/avios/salidas/${item.id}`);
	};

	return (
		<>
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
									const isSelected = selected.indexOf(n.id) !== -1;
									return (
										<TableRow
											style={n.anulado ? { backgroundColor: '#ffd5d5' } : {}}
											className="h-72 cursor-pointer"
											hover
											tabIndex={-1}
											key={n.id}
										>
											<TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
												{n.nNota}
											</TableCell>

											<TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
												{formatDate(n.fechaRegistro || n.created_at)}
											</TableCell>

											<TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
												{n.guiaTela === null ? (
													<div
														style={{
															display: 'flex',
															flexDirection: 'row',
															gap: '10px',
														}}
													>
														<WarningIcon color="warning" /> Pendiente
													</div>
												) : (
													<div
														style={{
															display: 'flex',
															flexDirection: 'row',
															gap: '10px',
														}}
													>
														<CheckCircleIcon color="success" /> Despachado
													</div>
												)}
											</TableCell>

											<TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
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
					count={totalIngresos}
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

export default withRouter(SalidasTable);

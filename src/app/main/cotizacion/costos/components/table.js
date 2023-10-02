/* eslint-disable no-nested-ternary */
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import debounce from 'lodash.debounce';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import EditIcon from '@mui/icons-material/Edit';
import { Button, TableHead, TableSortLabel, Tooltip } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import { getCostos, selectCostos } from '../../store/costos/costosSlice';
import ModalCostos from './modal';

const rows = [
	{
		id: 'estilo',
		align: 'left',
		disablePadding: false,
		label: 'Estilo',
		sort: true,
	},
	{
		id: 'nombre',
		align: 'left',
		disablePadding: false,
		label: 'Nombre',
		sort: true,
	},
	{
		id: 'estado',
		align: 'left',
		disablePadding: false,
		label: 'Estado',
		sort: true,
	},
	{
		id: '',
		disablePadding: false,
		label: '',
		sort: true,
	},
];

function CostosTable(props) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const model = useSelector(selectCostos);
	const total = useSelector(({ cotizacion }) => cotizacion.costos.total);
	const searchText = useSelector(({ cotizacion }) => cotizacion.costos.searchText);

	const [loading, setLoading] = useState(true);
	const [tipoModal, setTipoModal] = useState('SW');
	const [visibleModal, setVisibleModal] = useState(false);
	const [dataModal, setDataModal] = useState();
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(model);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null,
	});

	const [busquedaTemp, setBusquedaTemp] = useState('');

	const debouncedFetchData = debounce(() => {
		setLoading(true);
		let tipoBusqueda = 'agregar';
		if (busquedaTemp !== searchText) {
			setBusquedaTemp(searchText);
			tipoBusqueda = 'nuevaBusqueda';
			setPage(0);
		}

		dispatch(
			getCostos({
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

	const onClickDetalles = (item, tipo) => {
		setVisibleModal(true);
		setDataModal(item);
		setTipoModal(tipo);
	};

	const createSortHandler = property => event => {
		handleRequestSort(event, property);
	};

	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
					<TableHead>
						<TableRow className="h-48 sm:h-64">
							<TableCell className="p-4 md:p-16" component="th" scope="row">
								{/* {n.estilo} */}
							</TableCell>
							{rows.map(row => {
								return (
									<TableCell
										className="p-4 md:p-16"
										key={row.id}
										align={row.align}
										padding={row.disablePadding ? 'none' : 'normal'}
										sortDirection={order.id === row.id ? order.direction : false}
										width={row.width}
									>
										{row.sort && (
											<Tooltip
												title="Sort"
												placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
												enterDelay={300}
											>
												<TableSortLabel
													active={order.id === row.id}
													direction={order.direction}
													onClick={createSortHandler(row.id)}
													className="font-semibold"
												>
													{row.label}
												</TableSortLabel>
											</Tooltip>
										)}
									</TableCell>
								);
							}, this)}
							<TableCell className="p-4 md:p-16" component="th" scope="row">
								{/* {n.estilo} */}
							</TableCell>
						</TableRow>
					</TableHead>

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
								const estado = 'Pendiente';
								return (
									<TableRow className="h-72 cursor-pointer" hover tabIndex={-1} key={n.id}>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{/* {n.estilo} */}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.estilo}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.nombre}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.costo === null ? (
												<div
													style={{
														display: 'flex',
														flexDirection: 'row',
														gap: '10px',
													}}
												>
													<ErrorIcon color="error" /> Pendiente
												</div>
											) : n.costo.estado === 'INCOMPLETO' ? (
												<div
													style={{
														display: 'flex',
														flexDirection: 'row',
														gap: '10px',
													}}
												>
													<WarningIcon color="warning" /> Incompleto
												</div>
											) : (
												<div
													style={{
														display: 'flex',
														flexDirection: 'row',
														gap: '10px',
													}}
												>
													<CheckCircleIcon color="success" /> Completado
												</div>
											)}
										</TableCell>
										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											style={{ textAlign: 'end' }}
										>
											<Button
												startIcon={n.costo === null ? null : <EditIcon />}
												variant="contained"
												color={n.costo === null ? 'secondary' : 'success'}
												size="small"
												onClick={() => onClickDetalles(n, n.costo === null ? 'CE' : 'ET')}
											>
												{n.costo === null ? 'Registrar' : 'Editar'}
											</Button>
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{/* {n.estilo} */}
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
			{visibleModal && (
				<ModalCostos
					visible={visibleModal}
					setVisible={setVisibleModal}
					dataModal={dataModal}
					tipo={tipoModal}
					setLoading={setLoading}
				/>
			)}
		</div>
	);
}

export default withRouter(CostosTable);

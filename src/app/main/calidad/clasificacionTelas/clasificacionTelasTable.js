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

import { Avatar, Button, ButtonUnstyled, Tooltip } from '@mui/material';
import { baseUrl } from 'utils/Api';
import Lightbox from 'react-awesome-lightbox';
import 'react-awesome-lightbox/build/style.css';
import ClasificacionTelasTableHead from './clasificacionTelasTableHeader';
import ModalCambioClasificacion from './modalCambioClasificacion';

function ClasificacionTelasTable() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const kardex = useSelector(selectKardex);
	const totalKardex = useSelector(({ almacen }) => almacen.kardex.total);
	const searchText = useSelector(({ almacen }) => almacen.kardex.searchText);

	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(kardex);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null,
	});

	const [busquedaTemp, setBusqeudaTemp] = useState('');

	const [imagenActiva, setImagenActiva] = useState('');

	const [openModal, setOpenModal] = useState(false);
	const [dataModal, setDataModal] = useState();

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

	useEffect(() => {
		setData(kardex);
	}, [kardex]);

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
		console.log(fecha);
		// return fecha.format('DD [de] MMMM [del] YYYY');
		return fecha.format('DD/MM/YYYY');
	};

	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
					<ClasificacionTelasTableHead
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
										<TableCell className="p-4 md:p-16" component="th" scope="row" />
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
											<Button
												variant="contained"
												size="small"
												color="primary"
												onClick={() => {
													setOpenModal(true);
													setDataModal({ data: n, page, rowsPerPage, searchText });
												}}
											>
												Cambiar Clasificacion
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
			{openModal && (
				<ModalCambioClasificacion
					openModal={openModal}
					setOpenModal={setOpenModal}
					dataModal={dataModal}
				/>
			)}
		</div>
	);
}

export default withRouter(ClasificacionTelasTable);

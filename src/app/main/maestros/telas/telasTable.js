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
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import Construction from '@mui/icons-material/Construction';
import ArrowCircleUp from '@mui/icons-material/ArrowCircleUp';
import { Backdrop, Button, Modal, Tooltip } from '@mui/material';
import { Box } from '@mui/system';

import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import showToast from 'utils/Toast';
import { ModalConfirmDelete } from 'app/shared-components/ModalConfirmDelete';
import { getTelas, removeTelas, selectTelas, estadoTela } from '../store/tela/telasSlice';
import TelasTableHead from './telasTableHeader';

function TelasTable(props) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const telas = useSelector(selectTelas);
	const totalTelas = useSelector(({ maestros }) => maestros.telas.total);
	const searchText = useSelector(({ maestros }) => maestros.telas.searchText);

	const [estadoProd, setEstadoProd] = useState(false);
	const [estadoDev, setEstadoDev] = useState(false);
	const [idTemporal, setIdTemporal] = useState(0);

	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(telas);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState({
		direction: 'asc',
		id: 'nombre',
	});

	const [openModalDelete, setOpenModalDelete] = useState(false);
	const [itemDelete, setItemDelete] = useState(null);

	const styleModal = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		// width: 1300,
		bgcolor: 'background.paper',
		border: '2px solid #ccc',
		borderRadius: '10px',
		boxShadow: 24,
		p: 4,
	};

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
			getTelas({
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
		setData(telas);
	}, [telas]);

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
		navigate(`/maestros/telas/${item.id}`);
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
					No hay telas!
				</Typography>
			</motion.div>
		);
	}

	const onClickEditar = item => {
		navigate(`/maestros/telas/${item.id}`);
	};

	const onClickEliminar = item => {
		setOpenModalDelete(true);
		setItemDelete(item);
	};

	const cambioEstado = (tipo, dat) => {
		if (tipo === 'produccion') {
			setEstadoProd(true);
		} else {
			setEstadoDev(true);
		}
		setIdTemporal(dat.id);
	};

	async function eliminar(item) {
		try {
			const error = await dispatch(
				removeTelas({
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
					<TelasTableHead
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
								console.log('LISTA DE TELAS: ', n);

								const isSelected = selected.indexOf(n.id) !== -1;
								return (
									<TableRow
										className="h-72 cursor-pointer"
										hover /* 
										role="checkbox"
										aria-checked={isSelected} */
										tabIndex={-1}
										key={n.id} /* 
										selected={isSelected}
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
											{n.codigo}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.nombre}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.descripcionComercial}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.densidad}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.ancho}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.acabado}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.codReferencia}
										</TableCell>

										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											style={{ textAlign: 'end' }}
										>
											{n.estado === 'desarrollo' ? (
												<Tooltip title="Editar">
													<Button
														// startIcon={}
														variant="contained"
														color="success"
														size="small"
														onClick={() => onClickEditar(n)}
													>
														<EditIcon />
													</Button>
												</Tooltip>
											) : (
												<Tooltip title="Visualizar">
													<Button
														// startIcon={}
														variant="contained"
														size="small"
														color="primary"
														onClick={() => onClickEditar(n)}
													>
														<RemoveRedEyeIcon />
													</Button>
												</Tooltip>
											)}
											&nbsp; &nbsp;
											<Tooltip title="Eliminar">
												<Button
													// startIcon={}
													variant="contained"
													color="error"
													size="small"
													onClick={() => onClickEliminar(n)}
												>
													<DeleteIcon />
												</Button>
											</Tooltip>
											&nbsp; &nbsp;
											{n.estado === 'desarrollo' ? (
												<Tooltip title="Modo Producción">
													<Button
														variant="contained"
														color="info"
														size="small"
														onClick={() => cambioEstado('produccion', n)}
													>
														<ArrowCircleUp />
													</Button>
												</Tooltip>
											) : (
												<Tooltip title="Modo Desarrollo">
													<Button
														variant="contained"
														color="inherit"
														size="small"
														onClick={() => cambioEstado('dev', n)}
													>
														<Construction />
													</Button>
												</Tooltip>
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
				count={totalTelas}
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
			<Modal
				open={estadoProd}
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Box sx={styleModal}>
					<div>
						Esta seguro que desea enviar la tela a <strong>PRODUCCIÓN</strong>?
					</div>
					<br />
					<div style={{ textAlign: 'end' }}>
						<Button
							variant="contained"
							size="medium"
							color="info"
							onClick={() => {
								dispatch(estadoTela({ id: idTemporal, estado: 'produccion' }));
								setEstadoProd(false);
							}}
						>
							Aceptar
						</Button>
						&nbsp; &nbsp;
						<Button variant="contained" size="medium" onClick={() => setEstadoProd(false)}>
							Cancelar
						</Button>
					</div>
				</Box>
			</Modal>
			<Modal
				open={estadoDev}
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Box sx={styleModal}>
					<div>
						Esta seguro que desea enviar la tela a <strong>DESARROLLO</strong>?
					</div>
					<br />
					<div style={{ textAlign: 'end' }}>
						<Button
							variant="contained"
							size="medium"
							color="info"
							onClick={() => {
								dispatch(estadoTela({ id: idTemporal, estado: 'desarrollo' }));
								setEstadoDev(false);
							}}
						>
							Aceptar
						</Button>
						&nbsp; &nbsp;
						<Button variant="contained" size="medium" onClick={() => setEstadoDev(false)}>
							Cancelar
						</Button>
					</div>
				</Box>
			</Modal>

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
							'tela'
						);
						setOpenModalDelete(false);
					}}
					register={itemDelete?.codigo || null}
				/>
			)}
		</div>
	);
}

export default withRouter(TelasTable);

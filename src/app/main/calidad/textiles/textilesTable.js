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
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { Button, IconButton, Link, Tooltip } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { baseUrl } from 'utils/Api';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import showToast from 'utils/Toast';
import { getTextiles, removeTextiles, selectTextiles } from '../store/textil/textilesSlice';
import TextilesTableHead from './textilesTableHeader';
import ModalDetalles from './modalDetalles';

function TextilesTable() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const textiles = useSelector(selectTextiles);
	const totalTextiles = useSelector(({ calidad }) => calidad.textiles.total);
	const searchText = useSelector(({ calidad }) => calidad.textiles.searchText);

	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(textiles);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null,
	});

	const [busquedaTemp, setBusqeudaTemp] = useState('');

	const [visible, setVisible] = useState(false);
	const [dataModal, setDataModal] = useState(null);

	const debouncedFetchData = debounce(() => {
		setLoading(true);
		let tipoBusqueda = 'agregar';
		if (busquedaTemp !== searchText) {
			setBusqeudaTemp(searchText);
			tipoBusqueda = 'nuevaBusqueda';
			setPage(0);
		}

		dispatch(
			getTextiles({
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
		setData(textiles);
	}, [textiles]);

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
		navigate(`/calidad/textil/${item.id}`);
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
					No hay textiles!
				</Typography>
			</motion.div>
		);
	}

	const onClickEditar = item => {
		navigate(`/calidad/textil/${item.partida}?codigo=${btoa(item.codigo)}`);
	};

	const onClickVer = row => {
		setDataModal(row);
		setVisible(true);
	};

	const onClickEliminar = item => {
		showToast(
			{
				promesa: eliminar,
				parametros: [item],
			},
			'delete',
			'textil'
		);
	};

	async function eliminar(item) {
		try {
			const error = await dispatch(
				removeTextiles({
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
					<TextilesTableHead
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

										{/* <TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.codigo}
										</TableCell> */}

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.partida}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.tela?.nombre}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.color?.descripcion}
										</TableCell>

										{/* <TableCell className="p-4 md:p-16" component="th" scope="row"> */}
										{/* {`NT-${n.id.toString().padStart(5, '0')}`} */}
										{/* {`NT-${n.detallesProductosIngresosAlmacenesTelas[0]?.registroIngresoAlmacenTela?.id
												.toString()
												.padStart(5, '0')}`} */}
										{/* </TableCell> */}

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.calidadTextil === null ? (
												<WarningIcon color="warning" />
											) : (
												<CheckCircleIcon color="success" />
											)}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.detallesProductosIngresosAlmacenesTelas[0]?.registroIngresoAlmacenTela
												?.ordenCompra?.produccion?.cliente?.tipoCliente === 'N'
												? n.detallesProductosIngresosAlmacenesTelas[0]?.registroIngresoAlmacenTela
														?.ordenCompra?.produccion?.cliente?.tipo === 'J'
													? `${n.detallesProductosIngresosAlmacenesTelas[0]?.registroIngresoAlmacenTela?.ordenCompra?.produccion?.cliente?.razónSocial}`
													: `${n.detallesProductosIngresosAlmacenesTelas[0]?.registroIngresoAlmacenTela?.ordenCompra?.produccion?.cliente?.natNombres} ${n.detallesProductosIngresosAlmacenesTelas[0]?.registroIngresoAlmacenTela?.ordenCompra?.produccion?.cliente?.natApellidoPaterno}`
												: `${
														n.detallesProductosIngresosAlmacenesTelas[0]?.registroIngresoAlmacenTela
															?.ordenCompra?.produccion?.cliente?.razónSocial || 'No tiene cliente'
												  }`}
										</TableCell>

										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											style={{ textAlign: 'center', width: '150px' }}
										>
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
													disabled={!n.calidadTextil?.documentoUrl}
													size="small"
													color="primary"
													component={Link}
													href={`${baseUrl}control-calidad/documento/${n.calidadTextil?.id}`}
												>
													<DownloadIcon />
												</IconButton>
												&nbsp; &nbsp;
												<Tooltip title="Visualizar">
													<IconButton
														disabled={n.calidadTextil === null}
														color="success"
														size="small"
														onClick={() => onClickVer(n)}
													>
														<PreviewIcon />
													</IconButton>
												</Tooltip>
												&nbsp; &nbsp;
												<Button
													startIcon={n.calidadTextil === null ? null : <EditIcon />}
													variant="contained"
													color={n.calidadTextil === null ? 'secondary' : 'success'}
													size="small"
													onClick={() => onClickEditar(n)}
												>
													{n.calidadTextil === null ? 'Registrar' : 'Editar'}
												</Button>
												{/* &nbsp; &nbsp;
											<Button
												startIcon={<DeleteIcon />}
												variant="contained"
												color="error"
												size="small"
												onClick={() => onClickEliminar(n)}
											>
												Eliminar
											</Button> */}
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
				count={totalTextiles}
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

			{visible && <ModalDetalles visible={visible} setVisible={setVisible} data={dataModal} />}
		</div>
	);
}

export default withRouter(TextilesTable);

/* eslint-disable dot-notation */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
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
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseUtils from '@fuse/utils';

import showToast from 'utils/Toast';
import { getNotificaciones } from '../store/notificacion/notificacionesSlice';
import { selectRoles, getRoles, removeRoles } from '../store/rol/rolesSlice';
import NotificacionesTableHead from './notificacionesTableHeader';

function NotificacionesTable(props) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const roles = useSelector(selectRoles);
	const totalRoles = useSelector(({ usuarios }) => usuarios.roles.total);
	const searchText = useSelector(({ usuarios }) => usuarios.roles.searchText);

	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(roles);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null,
	});

	const [busquedaTemp, setBusqeudaTemp] = useState('');

	const notificacionesTotal = useSelector(({ usuarios }) => usuarios.notificaciones.entities);
	const notificaciones = {};
	if (notificacionesTotal) {
		for (const key in notificacionesTotal) {
			const notificacion = notificacionesTotal[key];
			if (Array.isArray(notificaciones[notificacion.grupo])) {
				notificaciones[notificacion.grupo].push(notificacion);
			} else {
				notificaciones[notificacion.grupo] = [notificacion];
			}
		}
	}

	const debouncedFetchData = debounce(() => {
		setLoading(true);
		let tipoBusqueda = 'agregar';
		if (busquedaTemp !== searchText) {
			setBusqeudaTemp(searchText);
			tipoBusqueda = 'nuevaBusqueda';
			setPage(0);
		}
		dispatch(getNotificaciones());
		dispatch(
			getRoles({
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
		setData(roles);
	}, [roles]);

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
		navigate(`/notificaciones/${item.id}`);
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
					No hay Notificaciones!
				</Typography>
			</motion.div>
		);
	}

	const onClickEditar = item => {
		navigate(`/notificaciones/${item.id}`);
	};

	const onClickEliminar = item => {
		showToast(
			{
				promesa: eliminar,
				parametros: [item],
			},
			'delete',
			'notificacion'
		);
	};

	async function eliminar(item) {
		try {
			const error = await dispatch(
				removeRoles({
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
					<NotificacionesTableHead
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
								const opciones = {};

								// eslint-disable-next-line no-restricted-syntax
								for (const key in notificaciones) {
									if (Object.hasOwnProperty.call(notificaciones, key)) {
										const moduloDic = notificaciones[key];
										const opcion = moduloDic.filter(element => {
											return n.notificaciones.find(element2 => element2.nombre === element.nombre);
										});
										const abc = [];
										opcion.forEach(element => {
											const modulo = n.notificaciones.find(
												element3 => element3.nombre === element.nombre
											);
											const op = { ...modulo, label: element.nombre, id: modulo.id };
											abc.push(op);
										});
										opciones[key] = abc;
									}
								}
								const grupoModulos = [];
								// eslint-disable-next-line no-restricted-syntax
								for (const key in opciones) {
									if (Object.hasOwnProperty.call(opciones, key)) {
										const element = opciones[key];
										grupoModulos.push({
											label: key,
											options: element,
										});
									}
								}

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
										<TableCell className="w-40 md:w-64 text-center" padding="none">
											{/* <Checkbox
												checked={isSelected}
												onClick={event => event.stopPropagation()}
												onChange={event => handleCheck(event, n.id)}
											/> */}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.nombre}
										</TableCell>

										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											style={{
												display: 'flex',
												flexDirection: 'row',
												width: '100%',
											}}
										>
											{grupoModulos.map((element, index) => {
												return (
													<div
														key={index}
														style={{
															display: 'flex',
															flexDirection: ' column',
															width: '100%',
														}}
													>
														<div style={{ textTransform: 'capitalize' }}>{element.label}</div>

														{element.options.length > 0 ? (
															element.options.map(m => (
																<div key={FuseUtils.generateGUID()}>
																	<Typography variant="body2" color="textSecondary">
																		<li>{m.label}</li>
																	</Typography>
																</div>
															))
														) : (
															<Typography variant="body2" color="textSecondary">
																No cuenta con este módulo
															</Typography>
														)}
													</div>
												);
											})}
										</TableCell>
										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											style={{ textAlign: 'start', width: '150px' }}
										>
											<Button
												startIcon={n.notificaciones?.length > 0 ? <EditIcon /> : null}
												variant="contained"
												color={n.notificaciones?.length > 0 ? 'success' : 'secondary'}
												size="small"
												onClick={() => onClickEditar(n)}
											>
												{n.notificaciones?.length > 0 ? 'Editar' : 'Registrar'}
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
				count={totalRoles}
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

export default withRouter(NotificacionesTable);

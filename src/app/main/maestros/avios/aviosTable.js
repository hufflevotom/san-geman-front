/* eslint-disable no-nested-ternary */
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
import Lightbox from 'react-awesome-lightbox';
import 'react-awesome-lightbox/build/style.css';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Button } from '@mui/material';
import { baseUrl } from 'utils/Api';

import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import { ModalConfirmDelete } from 'app/shared-components/ModalConfirmDelete';
import showToast from 'utils/Toast';
import {
	getAvios,
	getAviosHilos,
	removeAvios,
	resetTabla,
	selectAvios,
} from '../store/avios/aviosSlice';
import AviosTableHeader from './aviosTableHeader';

function AviosTable({ checked }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const avios = useSelector(selectAvios);
	const totalAvios = useSelector(({ maestros }) => maestros.avios.total);
	const searchText = useSelector(({ maestros }) => maestros.avios.searchText);
	const [imagenActiva, setImagenActiva] = useState('');
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(avios);
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
		if (checked) {
			dispatch(
				getAviosHilos({
					offset: page * rowsPerPage,
					limit: rowsPerPage,
					busqueda: searchText,
					tipoBusqueda,
				})
			).then(() => setLoading(false));
		} else {
			dispatch(
				getAvios({
					offset: page * rowsPerPage,
					limit: rowsPerPage,
					busqueda: searchText,
					tipoBusqueda,
				})
			).then(() => setLoading(false));
		}
	}, 500);

	useEffect(() => {
		debouncedFetchData(); // Llamar a la versión debounced de fetchData
		return debouncedFetchData.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [dispatch, page, rowsPerPage, searchText]);

	useEffect(() => {
		setLoading(true);
		if (checked) {
			dispatch(resetTabla());
			dispatch(
				getAviosHilos({
					limit: 10,
					offset: 0,
					busqueda: '',
					tipoBusqueda: 'nuevaBusqueda',
				})
			).then(() => setLoading(false));
		} else {
			dispatch(resetTabla());
			dispatch(
				getAvios({
					limit: 10,
					offset: 0,
					busqueda: '',
					tipoBusqueda: 'nuevaBusqueda',
				})
			).then(() => setLoading(false));
		}
	}, [checked]);

	useEffect(() => {
		setData(avios);
	}, [avios]);

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
		navigate(`/maestros/familias-avios/${item.id}`);
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
					No hay avios!
				</Typography>
			</motion.div>
		);
	}

	const onClickEditar = item => {
		navigate(`/maestros/avios/${item.id}`);
	};

	const onClickEliminar = item => {
		setOpenModalDelete(true);
		setItemDelete(item);
	};

	async function eliminar(item) {
		try {
			const error = await dispatch(
				removeAvios({
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
					<AviosTableHeader
						page={page}
						rowsPerPage={rowsPerPage}
						selectedProductIds={selected}
						order={order}
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={data.length}
						onMenuItemClick={handleDeselect}
						checked={checked}
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
										<TableCell className="w-40 md:w-64 text-center" padding="none" />

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
														src={baseUrl + n.imagenUrl}
														sx={{ width: 56, height: 56 }}
														onClick={() => {
															if (n.imagenUrl) {
																setImagenActiva(baseUrl + n.imagenUrl);
															}
														}}
													/>
												</div>
												&nbsp; &nbsp;
												<div>{n.estilo}</div>
											</div>
										</TableCell>
										{checked ? (
											<>
												<TableCell className="p-4 md:p-16" component="th" scope="row">
													{n.codigo}
												</TableCell>
												<TableCell className="p-4 md:p-16" component="th" scope="row">
													{n.codigoSec}
												</TableCell>
												<TableCell className="p-4 md:p-16" component="th" scope="row">
													{n.nombre}
												</TableCell>
												<TableCell className="p-4 md:p-16" component="th" scope="row">
													{n.unidadMedida.prefijo}
												</TableCell>
												<TableCell className="p-4 md:p-16" component="th" scope="row">
													{n.marcaHilo}
												</TableCell>
												<TableCell className="p-4 md:p-16" component="th" scope="row">
													{n.color?.descripcion}
												</TableCell>
											</>
										) : (
											<>
												<TableCell className="p-4 md:p-16" component="th" scope="row">
													{n.tipo}
												</TableCell>
												<TableCell className="p-4 md:p-16" component="th" scope="row">
													{n.codigo}
												</TableCell>
												<TableCell className="p-4 md:p-16" component="th" scope="row">
													{n.familiaAvios?.id === 1
														? `${n.nombre} - ${n.codigoSec} - ${n.marcaHilo} - ${
																n.color?.descripcion
														  }${n.talla ? ` - Talla: ${n.talla.prefijo}` : ''}`
														: `${n.nombre}${n.talla ? ` - Talla: ${n.talla.prefijo}` : ''}`}
												</TableCell>
												<TableCell className="p-4 md:p-16" component="th" scope="row">
													{n.familiaAvios.descripcion}
												</TableCell>
												<TableCell className="p-4 md:p-16" component="th" scope="row">
													{n.unidadMedida.prefijo}
												</TableCell>
												<TableCell className="p-4 md:p-16" component="th" scope="row">
													{n.marca?.marca}
												</TableCell>
											</>
										)}
										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											style={{ textAlign: 'center' }}
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
				count={totalAvios}
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
					title="Image Title"
				/>
			) : null}

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
							'avios'
						);
						setOpenModalDelete(false);
					}}
					register={itemDelete?.ruc || itemDelete?.natNroDocumento || null}
				/>
			)}
		</div>
	);
}

export default withRouter(AviosTable);

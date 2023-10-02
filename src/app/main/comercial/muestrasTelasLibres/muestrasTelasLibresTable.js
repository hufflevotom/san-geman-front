/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import _ from '@lodash';
import { motion } from 'framer-motion';
import debounce from 'lodash.debounce';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';

import FuseScrollbars from '@fuse/core/FuseScrollbars';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';

import showToast from 'utils/Toast';
import { formatDate } from 'utils/Format';
import { ModalConfirmDelete } from 'app/shared-components/ModalConfirmDelete';

import MuestrasTelasLibresTableHead from './muestrasTelasLibresTableHeader';

import {
	cambiarEstadoMuestraTela,
	getMuestrasTelasLibres,
	removeMuestrasTelasLibres,
	selectMuestrasTelasLibres,
} from '../store/muestraTelaLibre/muestrasTelasLibresSlice';
import ModalConfirmarEstado from './modalConfirmarEstado';

function MuestrasTelasLibresTable(props) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const muestrasTelasLibres = useSelector(selectMuestrasTelasLibres);
	const usuarioId = useSelector(({ auth }) => auth.user.id);
	const rolActual = useSelector(({ auth }) => auth.user.role);
	const modulos = useSelector(
		({ auth }) => auth.roles[0].find(rol => rol.id === rolActual.id).modulos
	);
	const totalMuestras = useSelector(({ comercial }) => comercial.muestrasTelasLibres.total);
	const searchText = useSelector(({ comercial }) => comercial.muestrasTelasLibres.searchText);

	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(muestrasTelasLibres);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null,
	});
	const [busquedaTemp, setBusquedaTemp] = useState('');
	const [selectedMuestra, setSelectedMuestra] = useState();
	const [modalEstado, setModalEstado] = useState(false);
	const [openModalDelete, setOpenModalDelete] = useState(false);
	const [itemDelete, setItemDelete] = useState(null);

	const SIGUIENTE_ESTADO = {
		PENDIENTE: 'EN PROCESO',
		'EN PROCESO': 'FINALIZADO',
	};

	const cambiaEstado =
		modulos.findIndex(modulo => modulo.nombre === 'encargadoMuestraTelaLibre') !== -1;

	const debouncedFetchData = debounce(() => {
		setLoading(true);
		let tipoBusqueda = 'agregar';
		if (busquedaTemp !== searchText) {
			setBusquedaTemp(searchText);
			tipoBusqueda = 'nuevaBusqueda';
			setPage(0);
		}

		dispatch(
			getMuestrasTelasLibres({
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
		setData(muestrasTelasLibres);
	}, [muestrasTelasLibres]);

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
					No hay muestras de telas libres!
				</Typography>
			</motion.div>
		);
	}

	const cambiarEstado = muestra => {
		showToast(
			{
				promesa: changeState,
				parametros: [muestra],
			},
			'update',
			'Estado Muestra de Tela Libre'
		);
	};

	const onClickEditar = item => {
		navigate(`/comercial/muestrasTelasLibres/${item.id}?action=ET`);
	};

	const onClickVisualizar = item => {
		navigate(`/comercial/muestrasTelasLibres/${item.id}?action=SW`);
	};

	const onClickEliminar = item => {
		setOpenModalDelete(true);
		setItemDelete(item);
	};

	const onClickIniciar = value => {
		setModalEstado(true);
		setSelectedMuestra(value);
	};

	async function eliminar(item) {
		try {
			const error = await dispatch(
				removeMuestrasTelasLibres({
					ids: [item.id],
					offset: page * rowsPerPage,
					limit: rowsPerPage,
				})
			);
			if (error.error) throw error;
			return error;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async function changeState({ id, state }) {
		try {
			const error = await dispatch(
				cambiarEstadoMuestraTela({
					id: [id],
					state: SIGUIENTE_ESTADO[state],
				})
			);

			if (error.error) throw error;

			let tipoBusqueda = 'agregar';
			if (busquedaTemp !== searchText) {
				setBusquedaTemp(searchText);
				tipoBusqueda = 'nuevaBusqueda';
				setPage(0);
			}

			dispatch(
				getMuestrasTelasLibres({
					offset: page * rowsPerPage,
					limit: rowsPerPage,
					busqueda: searchText,
					tipoBusqueda,
				})
			).then(() => setLoading(false));
			setModalEstado(false);

			return error;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
					<MuestrasTelasLibresTableHead
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
						{_.orderBy(data, [o => o[order.id]], [order.direction])
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map(n => {
								const isSelected = selected.indexOf(n.id) !== -1;
								return (
									<TableRow className="h-72 cursor-pointer" hover tabIndex={-1} key={n.id}>
										<TableCell className="w-40 md:w-64 text-center" padding="none" />
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.codigo}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{formatDate(n.fechaDespacho)}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.marca.marca}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.estado === 'PENDIENTE' ? (
												<div
													style={{
														display: 'flex',
														flexDirection: 'row',
														gap: '10px',
													}}
												>
													<ErrorIcon color="error" /> Pendiente
												</div>
											) : n.estado === 'EN PROCESO' ? (
												<div
													style={{
														display: 'flex',
														flexDirection: 'row',
														gap: '10px',
													}}
												>
													<WarningIcon color="warning" /> En Proceso
												</div>
											) : (
												<div
													style={{
														display: 'flex',
														flexDirection: 'row',
														gap: '10px',
													}}
												>
													<CheckCircleIcon color="success" /> Finalizado
												</div>
											)}
										</TableCell>
										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											style={{ color: n.activo ? 'green' : 'red' }}
										>
											{n.activo ? 'Activo' : 'Anulado'}
										</TableCell>
										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											style={{ textAlign: 'end' }}
										>
											{!n.activo ? (
												'-'
											) : (
												<>
													<Button
														variant="contained"
														color="primary"
														size="small"
														onClick={() => onClickVisualizar(n)}
													>
														Visualizar
													</Button>
													&nbsp; &nbsp;
													{n.estado === 'PENDIENTE' && n.usuarioId === usuarioId && (
														<>
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
														</>
													)}
													&nbsp; &nbsp;
													{cambiaEstado && n.estado !== 'FINALIZADO' && (
														<Button
															variant="contained"
															color="secondary"
															size="small"
															onClick={() => onClickIniciar(n)}
														>
															Cambiar Estado
														</Button>
													)}
												</>
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
				count={totalMuestras}
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
			{modalEstado && (
				<ModalConfirmarEstado
					openModal={modalEstado}
					setOpenModal={setModalEstado}
					estado={selectedMuestra}
					arrEstados={SIGUIENTE_ESTADO}
					confirmar={cambiarEstado}
				/>
			)}
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
							'Muestra de Tela Libre'
						);
						setOpenModalDelete(false);
					}}
					register={itemDelete?.codigo || null}
				/>
			)}
		</div>
	);
}

export default withRouter(MuestrasTelasLibresTable);

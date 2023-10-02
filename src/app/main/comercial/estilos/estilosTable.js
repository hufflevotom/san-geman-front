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
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DownloadIcon from '@mui/icons-material/Download';

import { Avatar, Button, Link } from '@mui/material';
import { baseUrl } from 'utils/Api';
import Lightbox from 'react-awesome-lightbox';
import 'react-awesome-lightbox/build/style.css';

import { MODULOS } from 'constants/constantes';
import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import showToast from 'utils/Toast';
import { ModalConfirmDelete } from 'app/shared-components/ModalConfirmDelete';
import { getEstilos, removeEstilos, selectEstilos } from '../store/estilo/estilosSlice';
import EstilosTableHead from './estilosTableHeader';

function EstilosTable() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const estilos = useSelector(selectEstilos);
	const totalEstilos = useSelector(({ comercial }) => comercial.estilos.total);
	const rolActual = useSelector(({ auth }) => auth.user.role);
	const modulos = useSelector(
		({ auth }) => auth.roles[0].find(rol => rol.id === rolActual.id).modulos
	);
	const searchText = useSelector(({ comercial }) => comercial.estilos.searchText);

	const edicionEstilosAsignados =
		modulos.findIndex(modulo => modulo.nombre === MODULOS.edicionEstilosAsignados) !== -1;

	const [imagenActiva, setImagenActiva] = useState('');
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(estilos);
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
		dispatch(
			getEstilos({
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
		setData(estilos);
	}, [estilos]);

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

	const onClickEditar = item => {
		navigate(`/comercial/estilos/${item.id}`);
	};

	const onClickEditarAsignados = item => {
		navigate(`/comercial/estilos/${item.id}?action=edit`);
	};

	const onClickEliminar = item => {
		setOpenModalDelete(true);
		setItemDelete(item);
	};

	async function eliminar(item) {
		try {
			const error = await dispatch(
				removeEstilos({
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
					No hay estilos!
				</Typography>
			</motion.div>
		);
	}

	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
					<EstilosTableHead
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
								console.log(n);
								return (
									<TableRow className="h-72 cursor-pointer" hover tabIndex={-1} key={n.id}>
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
														src={baseUrl + n.imagenEstiloUrl}
														sx={{ width: 56, height: 56 }}
														onClick={() => {
															if (n.imagenEstiloUrl) {
																setImagenActiva(baseUrl + n.imagenEstiloUrl);
															}
														}}
													/>
												</div>
												&nbsp; &nbsp;
												<div>{n.estilo}</div>
											</div>
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											<div>
												{n.prenda.codigo} - {n.prenda.nombre}
											</div>
										</TableCell>

										<TableCell className="p-4 md:p-16 w-1/3" component="th" scope="row">
											<div>
												{n.telasEstilos.length > 0 &&
													n.telasEstilos.map((item, index) => {
														return (
															<Typography key={index} style={{ textTransform: 'capitalize' }}>
																{item.tipo === 'P' && `${item.tela.nombre}`}
															</Typography>
														);
													})}
											</div>
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											<div>{n.marca?.marca}</div>
										</TableCell>

										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											style={{ textAlign: 'center', width: '220px' }}
										>
											{n.fichaTecnicaUrl ? (
												<Button
													startIcon={<DownloadIcon />}
													variant="contained"
													size="small"
													component={Link}
													target="_blank"
													rel="noopener noreferrer"
													href={`${baseUrl}comercial/estilos/fichaTecnica/${n.id}`}
													color="secondary"
												>
													F. Técnica
												</Button>
											) : null}
											{n.asignado ? (
												<>
													{edicionEstilosAsignados && (
														<Button
															startIcon={<EditIcon />}
															variant="contained"
															color="success"
															size="small"
															onClick={() => onClickEditarAsignados(n)}
														>
															Editar
														</Button>
													)}
													&nbsp; &nbsp;
													<Button
														startIcon={<RemoveRedEyeIcon />}
														variant="contained"
														size="small"
														color="primary"
														onClick={() => onClickEditar(n)}
													>
														Visualizar
													</Button>
												</>
											) : (
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
				count={totalEstilos}
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
							'estilo'
						);
						setOpenModalDelete(false);
					}}
					register={itemDelete?.estilo || null}
				/>
			)}
		</div>
	);
}

export default withRouter(EstilosTable);

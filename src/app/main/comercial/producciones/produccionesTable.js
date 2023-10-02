import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import _ from '@lodash';
import { motion } from 'framer-motion';
import Lightbox from 'react-awesome-lightbox';
import 'react-awesome-lightbox/build/style.css';

import { Box } from '@mui/system';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PreviewIcon from '@mui/icons-material/Preview';
import { Backdrop, Button, IconButton, Modal, Tooltip } from '@mui/material';

import FuseScrollbars from '@fuse/core/FuseScrollbars';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';

import showToast from 'utils/Toast';
import { formatDate } from 'utils/Format';
import { ModalConfirmDelete } from 'app/shared-components/ModalConfirmDelete';

import {
	estadoProduccion,
	getProducciones,
	removeProducciones,
	selectProducciones,
} from '../store/produccion/produccionesSlice';

import ProduccionesTableHead from './produccionesTableHeader';
import ModalProducciones from './modalProducciones';
import ModalAviosDeProduccion from './modalAviosDeProduccion';

function ProduccionesTable(props) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const producciones = useSelector(selectProducciones);
	const totalProducciones = useSelector(({ comercial }) => comercial.producciones.total);
	const searchText = useSelector(({ comercial }) => comercial.producciones.searchText);

	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(producciones);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null,
	});
	const [visible, setVisible] = useState(false);
	const [visibleAvio, setVisibleAvio] = useState(false);
	const [dataModal, setDataModal] = useState(null);

	const [busquedaTemp, setBusquedaTemp] = useState('');
	const [imagenActiva, setImagenActiva] = useState('');

	const [estado, setEstado] = useState(false);
	const [idTemporal, setIdTemporal] = useState(0);

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

	const debouncedFetchData = debounce(() => {
		setLoading(true);
		let tipoBusqueda = 'agregar';
		if (busquedaTemp !== searchText) {
			setBusquedaTemp(searchText);
			tipoBusqueda = 'nuevaBusqueda';
			setPage(0);
		}

		dispatch(
			getProducciones({
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
		setData(producciones);
	}, [producciones]);

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
		navigate(`/comercial/producciones/${item.id}`);
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
					No hay producciones!
				</Typography>
			</motion.div>
		);
	}

	const onClickEditar = item => {
		navigate(`/comercial/producciones/${item.id}`);
	};

	const onClickEliminar = item => {
		setOpenModalDelete(true);
		setItemDelete(item);
	};

	async function eliminar(item) {
		try {
			const error = await dispatch(
				removeProducciones({
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

	const cambioEstado = dat => {
		setEstado(true);
		setIdTemporal(dat.id);
	};

	const onClickVer = row => {
		setDataModal(row);
		setVisible(true);
	};

	const onClickVerAvio = row => {
		setDataModal(row);
		setVisibleAvio(true);
	};

	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
					<ProduccionesTableHead
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
											{n.codigo}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{formatDate(n.created_at)}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{formatDate(n.fechaDespacho)}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.marca?.marca || '-'}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{formatDate(n.updated_at)}
										</TableCell>
										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											style={{ color: n.activo ? 'green' : 'red' }}
										>
											{n.activo ? 'Activo' : 'Anulado'}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.usuario ? `${n.usuario?.nombre} ${n.usuario?.apellido}` : '-'}
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
													<Tooltip title="Visualizar Producción">
														<IconButton
															// startIcon={}
															// variant="contained"
															color="success"
															size="small"
															onClick={() => onClickVer(n)}
														>
															<PreviewIcon />
														</IconButton>
													</Tooltip>
													&nbsp; &nbsp;
													<Tooltip title="Visualizar Avíos">
														<IconButton
															// startIcon={}
															// variant="contained"
															color="info"
															size="small"
															onClick={() => onClickVerAvio(n)}
														>
															<PreviewIcon />
														</IconButton>
													</Tooltip>
													&nbsp; &nbsp;
													<Tooltip title="Editar">
														<IconButton
															// startIcon={}
															// variant="contained"
															color="success"
															size="small"
															onClick={() => onClickEditar(n)}
														>
															<EditIcon />
														</IconButton>
													</Tooltip>
													&nbsp; &nbsp;
													<Tooltip title={!n.visible ? 'Visualizar' : 'Ocultar'}>
														<IconButton
															// startIcon={}
															// variant="contained"
															size="small"
															color={!n.visible ? 'primary' : 'secondary'}
															onClick={() => cambioEstado(n)}
														>
															{!n.visible ? <RemoveRedEyeIcon /> : <VisibilityOffIcon />}
														</IconButton>
													</Tooltip>
													&nbsp; &nbsp;
													<Tooltip title="Eliminar">
														<IconButton
															// startIcon={}
															// variant="contained"
															color="error"
															size="small"
															onClick={() => onClickEliminar(n)}
														>
															<DeleteIcon />
														</IconButton>
													</Tooltip>
												</>
											)}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</FuseScrollbars>
			<Modal
				open={estado}
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Box sx={styleModal}>
					<div>Esta seguro que desea cambiar la visibilidad de esta producción?</div>
					<br />
					<div style={{ textAlign: 'end' }}>
						<Button
							variant="contained"
							size="medium"
							color="info"
							onClick={() => {
								dispatch(estadoProduccion({ id: idTemporal }));
								setEstado(false);
							}}
						>
							Aceptar
						</Button>
						&nbsp; &nbsp;
						<Button variant="contained" size="medium" onClick={() => setEstado(false)}>
							Cancelar
						</Button>
					</div>
				</Box>
			</Modal>
			<TablePagination
				className="flex-shrink-0 border-t-1"
				component="div"
				count={totalProducciones}
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
					onClose={() => {
						setImagenActiva('');
						setVisibleAvio(true);
					}}
					image={imagenActiva}
					title="Imagen Avío"
				/>
			) : null}
			{visible && <ModalProducciones visible={visible} setVisible={setVisible} data={dataModal} />}
			{visibleAvio && (
				<ModalAviosDeProduccion
					visible={visibleAvio}
					setVisible={setVisibleAvio}
					data={dataModal}
					imagenActiva={imagenActiva}
					setImagenActiva={setImagenActiva}
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
							'producción'
						);
						setOpenModalDelete(false);
					}}
					register={itemDelete?.codigo || null}
				/>
			)}
		</div>
	);
}

export default withRouter(ProduccionesTable);

/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import debounce from 'lodash.debounce';
import { motion } from 'framer-motion';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';

import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';

import { ModalConfirmDelete } from 'app/shared-components/ModalConfirmDelete';
import showToast from 'utils/Toast';
import { CustomTableHeader } from 'app/UI';
import {
	getDesarrollosColoresHilo,
	removeDesarrollosColoresHilo,
	selectDesarrollosColoresHilo,
} from '../store/desarrolloColorHilo/desarrollosColoresHiloSlice';

const columns = [
	{
		id: 'codigo',
		align: 'left',
		disablePadding: false,
		label: 'Codigo',
		sort: true,
	},
	{
		id: 'pantone',
		align: 'left',
		disablePadding: false,
		label: 'Pantone',
		sort: true,
	},
	{
		id: 'colorSG',
		align: 'left',
		disablePadding: false,
		label: 'Color SG',
		sort: true,
	},
	{
		id: 'cliente',
		align: 'left',
		disablePadding: false,
		label: 'Cliente',
		sort: true,
	},
	{
		id: 'marca',
		align: 'left',
		disablePadding: false,
		label: 'Marca',
		sort: true,
	},
	{
		id: 'proveedor',
		align: 'left',
		disablePadding: false,
		label: 'Proveedor',
		sort: true,
	},
	{
		id: '',
		disablePadding: false,
		label: '',
		sort: true,
	},
];

function Tabla(props) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const dataModel = useSelector(selectDesarrollosColoresHilo);
	const total = useSelector(({ comercial }) => comercial.desarrollosColoresHilo.total);
	const searchText = useSelector(({ comercial }) => comercial.desarrollosColoresHilo.searchText);

	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(dataModel);
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
			getDesarrollosColoresHilo({
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
		setData(dataModel);
	}, [dataModel]);

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
		navigate(`/comercial/desarrollo-color-hilo/${item.id}`);
	};

	const onClickEliminar = item => {
		setOpenModalDelete(true);
		setItemDelete(item);
	};

	async function eliminar(item) {
		try {
			const error = await dispatch(
				removeDesarrollosColoresHilo({
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
					No hay desarrollos de colores para hilos!
				</Typography>
			</motion.div>
		);
	}

	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
					<CustomTableHeader
						page={page}
						rowsPerPage={rowsPerPage}
						selectedProductIds={selected}
						order={order}
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={data.length}
						onMenuItemClick={handleDeselect}
						columns={columns}
					/>

					<TableBody>
						{_.orderBy(data, [o => o[order.id]], [order.direction])
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map(n => {
								return (
									<TableRow className="h-72 cursor-pointer" hover tabIndex={-1} key={n.id}>
										<TableCell className="p-4 md:p-16" component="th" scope="row" />
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.codigo}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.pantone || '-'}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.colorSG || '-'}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.cliente.tipoCliente === 'N'
												? n.cliente.tipo === 'N'
													? `${n.cliente.natApellidoPaterno} ${n.cliente.natApellidoMaterno} ${n.cliente.natNombres}`
													: n.cliente.razónSocial
												: n.cliente.razónSocial}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.marca.marca || '-'}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.proveedor?.tipo === 'N'
												? `${n.proveedor?.apellidoPaterno} ${n.proveedor?.apellidoMaterno}, ${n.proveedor?.nombres}`
												: n.proveedor?.razonSocial}
										</TableCell>
										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											style={{ textAlign: 'end' }}
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
							'Desarrollo de Color de Hilo'
						);
						setOpenModalDelete(false);
					}}
					register={itemDelete?.codigo || null}
				/>
			)}
		</div>
	);
}

export default withRouter(Tabla);

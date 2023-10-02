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

import moment from 'moment';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';

import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';

import { baseFacturacionUrl } from 'utils/Api';
import showToast from 'utils/Toast';
import {
	getGuiaRemisiones,
	removeGuiaRemisiones,
	selectGuiasRemision,
} from '../store/guiaRemision/guiasRemisionSlice';
import GuiasRemisionTableHead from './guiasRemisionTableHeader';

function GuiasRemisionTable({ rowsPerPage, setRowsPerPage }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const dataModel = useSelector(selectGuiasRemision);
	const total = useSelector(({ logistica }) => logistica.guiasRemision.total);
	const searchText = useSelector(({ logistica }) => logistica.guiasRemision.searchText);

	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(dataModel);
	const [page, setPage] = useState(0);
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
			getGuiaRemisiones({
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
		navigate(`/logistica/control-factura/${item.id}`);
	};

	const onClickEliminar = item => {
		showToast(
			{
				promesa: eliminar,
				parametros: [item],
			},
			'delete',
			'orden corte'
		);
	};

	const descargar = async url => {
		const link = document.createElement('a');
		link.setAttribute('href', `${baseFacturacionUrl}api/getFile?nombreFile=${url}`);
		link.setAttribute('download', url);
		document.body.appendChild(link);
		link.dispatchEvent(
			new MouseEvent('click', {
				bubbles: true,
				cancelable: true,
				view: window,
			})
		);
		document.body.removeChild(link);
	};

	async function eliminar(item) {
		try {
			const error = await dispatch(
				removeGuiaRemisiones({
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
					No hay guias!
				</Typography>
			</motion.div>
		);
	}

	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
					<GuiasRemisionTableHead
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
								const urlDocumento = n.comprobantesSunat.sort((a, b) => b.id - a.id)[0].pdf;
								const esCliente = n.clienteId !== null;
								return (
									<TableRow className="h-72 cursor-pointer" hover tabIndex={-1} key={n.id}>
										<TableCell className="p-4 md:p-16" component="th" scope="row" />
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.serie}-{n.correlativo}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{moment(n.created_at).format('DD/MM/YYYY')}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{esCliente
												? n.cliente.tipoCliente === 'N'
													? n.cliente.tipo === 'N'
														? `${n.cliente.natApellidoPaterno} ${n.cliente.natApellidoMaterno} ${n.cliente.natNombres}`
														: n.cliente.razónSocial
													: n.cliente.razónSocial
												: n.proveedor?.tipo === 'N'
												? `${n.proveedor?.nombres}  ${n.proveedor?.apellidoPaterno} ${n.proveedor?.apellidoMaterno}`
												: n.proveedor?.razonSocial}
										</TableCell>
										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{n.observaciones || '-'}
										</TableCell>
										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											style={{ textAlign: 'end' }}
										>
											<Button
												variant="contained"
												size="small"
												color="primary"
												href={`${baseFacturacionUrl}files/${urlDocumento}`}
												target="_blank"
												rel="noopener noreferrer"
												download
											>
												PDF
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
		</div>
	);
}

export default withRouter(GuiasRemisionTable);

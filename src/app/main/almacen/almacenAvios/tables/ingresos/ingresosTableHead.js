/* eslint-disable spaced-comment */
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import TableHead from '@mui/material/TableHead';

const rows = [
	{
		id: 'Nota',
		align: 'center',
		disablePadding: false,
		label: 'Nota',
		sort: true,
	},

	{
		id: 'O/C',
		align: 'left',
		disablePadding: false,
		label: 'O/C',
		sort: true,
	},
	{
		id: 'Documento de referencia',
		align: 'left',
		disablePadding: false,
		label: 'Documento de referencia',
		sort: true,
	},
	{
		id: 'Fecha de Ingreso',
		align: 'center',
		disablePadding: false,
		label: 'Fecha de Ingreso',
		sort: true,
	},
	{
		id: 'OP',
		align: 'left',
		disablePadding: false,
		label: 'OP',
		sort: true,
	},
	{
		id: 'Marca',
		align: 'left',
		disablePadding: false,
		label: 'Marca',
		sort: true,
	},
	{
		id: 'Proveedor',
		align: 'left',
		disablePadding: false,
		label: 'Proveedor',
		sort: true,
	},
	// {
	// 	id: 'Cantidad Secundaria',
	// 	align: 'center',
	// 	disablePadding: false,
	// 	label: 'Cantidad Secundaria',
	// 	sort: true,
	// },
	{
		id: 'Detalles ',
		align: 'center',
		disablePadding: false,
		label: 'Detalles',
		sort: true,
	},
	{
		id: ' ',
		disablePadding: false,
		label: '',
		sort: true,
	},
	// {
	// 	id: ' ',
	// 	disablePadding: false,
	// 	label: '',
	// 	sort: true,
	// },
];

function IngresosTableHead(props) {
	const { selectedProductIds: selectedEmpresasIds, rowsPerPage, page } = props;
	const numSelected = selectedEmpresasIds.length;

	const [selectedProductsMenu, setSelectedProductsMenu] = useState(null);

	const dispatch = useDispatch();

	const createSortHandler = property => event => {
		props.onRequestSort(event, property);
	};

	function openSelectedProductsMenu(event) {
		setSelectedProductsMenu(event.currentTarget);
	}

	function closeSelectedProductsMenu() {
		setSelectedProductsMenu(null);
	}

	return (
		<TableHead>
			<TableRow className="h-48 sm:h-64">
				{/*<TableCell padding="none" className="w-40 md:w-64 text-center z-99">
					 <Checkbox
						indeterminate={numSelected > 0 && numSelected < props.rowCount}
						checked={props.rowCount !== 0 && numSelected === props.rowCount}
						onChange={props.onSelectAllClick}
					/> 
				 {numSelected > 0 && (
						<Box
							className="flex items-center justify-center absolute w-64 top-0 ltr:left-0 rtl:right-0 mx-56 h-64 z-10 border-b-1"
							sx={{
								background: theme => theme.palette.background.paper,
							}}
						>
							<IconButton
								aria-owns={selectedProductsMenu ? 'selectedProductsMenu' : null}
								aria-haspopup="true"
								onClick={openSelectedProductsMenu}
								size="large"
							>
								<Icon>more_horiz</Icon>
							</IconButton>
							<Menu
								id="selectedProductsMenu"
								anchorEl={selectedProductsMenu}
								open={Boolean(selectedProductsMenu)}
								onClose={closeSelectedProductsMenu}
							>
								<MenuList>
									<MenuItem
										onClick={() => {
											dispatch(
												removeClientes({
													ids: selectedEmpresasIds,
													offset: page * rowsPerPage,
													limit: rowsPerPage,
												})
											);
											props.onMenuItemClick();
											closeSelectedProductsMenu();
										}}
									>
										<ListItemIcon className="min-w-40">
											<Icon>delete</Icon>
										</ListItemIcon>
										<ListItemText primary="Eliminar" />
									</MenuItem>
								</MenuList>
							</Menu>
						</Box>
					)} 
				</TableCell>*/}
				{rows.map(row => {
					return (
						<TableCell
							className="p-4 md:p-16"
							key={row.id}
							align={row.align}
							padding={row.disablePadding ? 'none' : 'normal'}
							sortDirection={props.order.id === row.id ? props.order.direction : false}
						>
							{row.sort && (
								<Tooltip
									title="Sort"
									placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
									enterDelay={300}
								>
									<TableSortLabel
										active={props.order.id === row.id}
										direction={props.order.direction}
										onClick={createSortHandler(row.id)}
										className="font-semibold"
									>
										{row.label}
									</TableSortLabel>
								</Tooltip>
							)}
						</TableCell>
					);
				}, this)}
			</TableRow>
		</TableHead>
	);
}

export default IngresosTableHead;

import Checkbox from '@mui/material/Checkbox';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box } from '@mui/system';
import TableHead from '@mui/material/TableHead';
import { removeMetodosPago } from '../store/metodoPago/metodosPagoSlice';

const rows = [
	{
		id: 'descripcion',
		align: 'left',
		disablePadding: false,
		label: 'Descripción',
		sort: true,
	},
	{
		id: 'dias',
		align: 'left',
		disablePadding: false,
		label: 'Días',
		sort: true,
	},
	{
		id: '',
		disablePadding: false,
		label: '',
		sort: true,
	},
];

function MetodosPagoTableHead(props) {
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
				<TableCell padding="none" className="w-40 md:w-64 text-center z-99">
					{/* <Checkbox
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
												removeMetodosPago({
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
					)} */}
				</TableCell>
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

export default MetodosPagoTableHead;

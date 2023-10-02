import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import TableHead from '@mui/material/TableHead';

const rows = [
	{
		id: 'produccion',
		align: 'left',
		disablePadding: false,
		label: 'Producción',
		sort: true,
	},
	{
		id: 'Porcentaje de Ordenes Compra de Telas',
		align: 'center',
		disablePadding: false,
		label: 'Porcentaje de Ordenes Compra de Telas',
		sort: true,
	},
	{
		id: 'Porcentaje de Ingresos de Telas',
		align: 'center',
		disablePadding: false,
		label: 'Porcentaje de Ingresos de Telas',
		sort: true,
	},
	// {
	// 	id: 'estado',
	// 	align: 'center',
	// 	disablePadding: false,
	// 	label: 'Estado',
	// 	sort: true,
	// 	// width: '250px',
	// },
	{
		id: '',
		disablePadding: false,
		label: '',
		sort: true,
	},
];

function ListaTableHeader(props) {
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
				<TableCell className="p-4 md:p-16" component="th" scope="row" align="center" />
				{rows.map(row => {
					return (
						<TableCell
							className="p-4 md:p-16"
							key={row.id}
							align={row.align}
							padding={row.disablePadding ? 'none' : 'normal'}
							sortDirection={props.order.id === row.id ? props.order.direction : false}
							width={row.width}
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

export default ListaTableHeader;

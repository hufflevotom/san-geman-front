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
		align: 'left',
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
		id: 'Fecha de Ingreso',
		align: 'left',
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
		id: 'serieReferencia',
		align: 'left',
		disablePadding: false,
		label: 'Serie - Referencia',
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
		id: 'Detalles ',
		align: 'right',
		disablePadding: false,
		label: 'Detalles',
		sort: true,
		width: '180px',
	},
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
				<TableCell padding="none" className="w-8 md:w-8 text-center z-99" />
				{rows.map(row => {
					return (
						<TableCell
							className="p-4 md:p-16"
							key={row.id}
							align={row.align}
							padding={row.disablePadding ? 'none' : 'normal'}
							sortDirection={props.order.id === row.id ? props.order.direction : false}
							width={row.width ? row.width : ''}
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

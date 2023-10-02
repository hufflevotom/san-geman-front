import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import TableHead from '@mui/material/TableHead';

const rows = [
	{
		id: 'Producto',
		align: 'left',
		disablePadding: false,
		label: 'Producto',
		sort: true,
	},
	{
		id: 'Color',
		align: 'left',
		disablePadding: false,
		label: 'Color',
		sort: true,
	},
	{
		id: 'ColorCliente',
		align: 'left',
		disablePadding: false,
		label: 'Color Cliente',
		sort: true,
	},
	{
		id: 'Nro de Partida',
		align: 'center',
		disablePadding: false,
		label: 'Nro de Partida',
		sort: true,
	},
	{
		id: 'Cantidad',
		align: 'center',
		disablePadding: false,
		label: 'Cantidad',
		sort: true,
	},
	{
		id: 'Rollos',
		align: 'center',
		disablePadding: false,
		label: 'Rollos',
		sort: true,
	},
	{
		id: 'Ubicacion',
		align: 'center',
		disablePadding: false,
		label: 'Ubicación',
		sort: true,
	},
	{
		id: 'Clasificacion',
		align: 'left',
		disablePadding: false,
		label: 'Clasificación',
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
		id: 'OPASIGNADA',
		align: 'left',
		disablePadding: false,
		label: 'OP Asignada',
		sort: true,
	},
	{
		id: 'Accion',
		align: 'left',
		disablePadding: false,
		label: 'Acción',
		sort: true,
	},
];

function KardexTableHead(props) {
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

export default KardexTableHead;

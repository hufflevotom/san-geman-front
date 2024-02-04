import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import TableHead from '@mui/material/TableHead';

const rows = [
	{
		id: 'tipoOrden',
		align: 'left',
		disablePadding: false,
		label: 'Tipo de Orden',
		sort: true,
	},
	{
		id: 'codigo',
		align: 'left',
		disablePadding: false,
		label: 'Codigo',
		sort: true,
	},
	{
		id: 'produccion',
		align: 'left',
		disablePadding: false,
		label: 'Producción',
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
		id: 'fechaEntrega',
		align: 'left',
		disablePadding: false,
		label: 'Fecha de entrega',
		sort: true,
	},
	{
		id: 'fechaEmision',
		align: 'left',
		disablePadding: false,
		label: 'Fecha de emisión',
		sort: true,
	},
	{
		id: 'total',
		align: 'left',
		disablePadding: false,
		label: 'Total',
		sort: true,
	},
	{
		id: '',
		disablePadding: false,
		label: '',
		sort: true,
	},
];

function OrdenServicioGeneralesTableHead(props) {
	const createSortHandler = property => event => {
		props.onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow className="h-48 sm:h-64">
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

export default OrdenServicioGeneralesTableHead;

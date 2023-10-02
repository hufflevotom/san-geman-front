import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import TableHead from '@mui/material/TableHead';

const rows = [
	{
		id: 'Comprobante',
		align: 'left',
		disablePadding: false,
		label: 'Comprobante',
		sort: true,
	},
	{
		id: 'Fecha',
		align: 'left',
		disablePadding: false,
		label: 'Fecha',
		sort: true,
	},
	{
		id: 'Destinatario',
		align: 'left',
		disablePadding: false,
		label: 'Destinatario',
		sort: true,
	},
	{
		id: 'Observaciones',
		align: 'left',
		disablePadding: false,
		label: 'Observaciones',
		sort: true,
	},
	{
		id: '',
		disablePadding: false,
		label: '',
		sort: true,
	},
];

function GuiasRemisionTableHead(props) {
	const { selectedProductIds: selectedEmpresasIds } = props;

	const createSortHandler = property => event => {
		props.onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow className="h-48 sm:h-64">
				<TableCell className="p-4 md:p-16" />
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

export default GuiasRemisionTableHead;

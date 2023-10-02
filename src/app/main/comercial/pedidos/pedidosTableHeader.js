import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import TableHead from '@mui/material/TableHead';

const rows = [
	{
		id: 'codigo',
		align: 'left',
		disablePadding: false,
		label: 'Código',
		sort: true,
	},
	{
		id: 'Pedido',
		align: 'left',
		disablePadding: false,
		label: 'Pedido',
		sort: true,
	},
	// {
	// 	id: 'Incoterms',
	// 	align: 'left',
	// 	disablePadding: false,
	// 	label: 'Incoterms',
	// 	sort: true,
	// },
	// {
	// 	id: 'Modo de envío',
	// 	align: 'left',
	// 	disablePadding: false,
	// 	label: 'Modo de envío',
	// 	sort: true,
	// },
	{
		id: 'fechaRegistro',
		align: 'left',
		disablePadding: false,
		label: 'Fecha Registro',
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
		id: 'estado',
		align: 'left',
		disablePadding: false,
		label: 'Estado',
		sort: true,
	},
	{
		id: '',
		disablePadding: false,
		label: '',
		sort: true,
	},
];

function PedidosTableHead(props) {
	const { selectedProductIds: selectedEmpresasIds, rowsPerPage, page } = props;

	const createSortHandler = property => event => {
		props.onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow className="h-48 sm:h-64">
				<TableCell padding="none" className="w-40 md:w-64 text-center z-99" />
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

export default PedidosTableHead;

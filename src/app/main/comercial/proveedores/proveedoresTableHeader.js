import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import TableHead from '@mui/material/TableHead';

const rows = [
	{
		id: 'razonsocial',
		align: 'left',
		disablePadding: false,
		label: 'Razón Social / Nombre',
		sort: true,
	},
	{
		id: 'direcfiscal',
		align: 'left',
		disablePadding: false,
		label: 'Dirección Fiscal',
		sort: true,
	},
	{
		id: 'ruc',
		align: 'left',
		disablePadding: false,
		label: 'RUC / Nro Documento',
		sort: true,
	},
	{
		id: 'tipoPersona',
		align: 'left',
		disablePadding: false,
		label: 'Tipo Persona',
		sort: true,
	},
	{
		id: 'celular',
		align: 'left',
		disablePadding: false,
		label: 'Celular',
		sort: true,
	},
	{
		id: 'tipoServicio',
		align: 'left',
		disablePadding: false,
		label: 'Tipo de Servicio',
		sort: true,
	},
	{
		id: 'correo',
		align: 'left',
		disablePadding: false,
		label: 'Correo',
		sort: true,
	},
	{
		id: '',
		disablePadding: false,
		label: '',
		sort: true,
	},
];

function ProveedoresTableHead(props) {
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

export default ProveedoresTableHead;

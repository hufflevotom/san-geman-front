import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import TableHead from '@mui/material/TableHead';

function AviosTableHeader(props) {
	const { selectedProductIds: selectedEmpresasIds, rowsPerPage, page, checked } = props;
	const numSelected = selectedEmpresasIds.length;

	const [selectedProductsMenu, setSelectedProductsMenu] = useState(null);

	const dispatch = useDispatch();

	const rows = checked
		? [
				{
					id: 'img',
					align: 'left',
					disablePadding: false,
					label: 'Imagen',
					sort: true,
				},
				{
					id: 'codigo',
					align: 'left',
					disablePadding: false,
					label: 'Código',
					sort: true,
				},
				{
					id: 'codigoHilo',
					align: 'left',
					disablePadding: false,
					label: 'Código de Hilo',
					sort: true,
				},
				{
					id: 'nombre',
					align: 'left',
					disablePadding: false,
					label: 'Nombre',
					sort: true,
				},
				{
					id: 'unidadMedida',
					align: 'left',
					disablePadding: false,
					label: 'Unidad de Medida',
					sort: true,
					width: '150px',
				},
				{
					id: 'marcaHilo',
					align: 'left',
					disablePadding: false,
					label: 'Marca Hilo',
					sort: true,
				},
				{
					id: 'colorHilo',
					align: 'left',
					disablePadding: false,
					label: 'Color',
					sort: true,
				},
				{
					id: '',
					align: 'right',
					disablePadding: true,
					label: '',
					sort: true,
				},
		  ]
		: [
				{
					id: 'img',
					align: 'left',
					disablePadding: false,
					label: 'Imagen',
					sort: true,
				},
				{
					id: 'tipo',
					align: 'left',
					disablePadding: false,
					label: 'Tipo',
					sort: true,
				},
				{
					id: 'codigo',
					align: 'left',
					disablePadding: false,
					label: 'Código',
					sort: true,
				},
				{
					id: 'nombre',
					align: 'left',
					disablePadding: false,
					label: 'Nombre',
					sort: true,
				},
				{
					id: 'familiaAvios',
					align: 'left',
					disablePadding: false,
					label: 'Familia Avios',
					sort: true,
				},
				{
					id: 'unidadMedida',
					align: 'left',
					disablePadding: false,
					label: 'Unidad de Medida',
					sort: true,
					width: '150px',
				},
				{
					id: 'marca',
					align: 'left',
					disablePadding: false,
					label: 'Marca',
					sort: true,
				},
				{
					id: '',
					align: 'right',
					disablePadding: true,
					label: '',
					sort: true,
				},
		  ];

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
				<TableCell padding="none" className="w-40 md:w-64 text-center z-99" />
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

export default AviosTableHeader;

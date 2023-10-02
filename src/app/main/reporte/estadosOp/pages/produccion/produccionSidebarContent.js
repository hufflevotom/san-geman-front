import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import RouteIcon from '@mui/icons-material/Route';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout';

import Paper from '@mui/material/Paper';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

const StyledListItem = styled(ListItem)(({ theme }) => ({
	color: 'inherit!important',
	textDecoration: 'none!important',
	height: 40,
	width: '100%',
	borderRadius: 6,
	paddingLeft: 12,
	paddingRight: 12,
	marginBottom: 4,
	'&.active': {
		backgroundColor:
			theme.palette.mode === 'light'
				? 'rgba(0, 0, 0, .05)!important'
				: 'rgba(255, 255, 255, .1)!important',
		pointerEvents: 'none',
		'& .list-item-icon': {
			color: 'inherit',
		},
	},
	'& .list-item-icon': {
		fontSize: 16,
		width: 16,
		height: 16,
		marginRight: 16,
	},
}));

function ProduccionSidebarContent(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();

	return (
		<div className="p-0 lg:p-24 lg:ltr:pr-4 lg:rtl:pl-4">
			<Paper
				component={motion.div}
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
				className="rounded-0 shadow-none lg:rounded-16 lg:shadow"
			>
				<List className="pt-12 px-12">
					<StyledListItem
						button
						component={NavLinkAdapter}
						to={`/reporte/estados-op/${routeParams.id}/ordenCompra`}
						activeClassName="active"
					>
						<ReceiptLongIcon fontSize="small" className="list-item-icon text-16" color="action" />
						<ListItemText className="truncate" primary="Ordenes de Compra" disableTypography />
					</StyledListItem>
					<StyledListItem
						button
						component={NavLinkAdapter}
						to={`/reporte/estados-op/${routeParams.id}/ruta`}
						activeClassName="active"
					>
						<RouteIcon fontSize="small" className="list-item-icon text-16" color="action" />
						<ListItemText className="truncate" primary="Ruta" disableTypography />
					</StyledListItem>
				</List>
			</Paper>
		</div>
	);
}

export default ProduccionSidebarContent;

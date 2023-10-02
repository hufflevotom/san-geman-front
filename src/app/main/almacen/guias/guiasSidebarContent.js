import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid4x4Icon from '@mui/icons-material/Grid4x4';
import LoginIcon from '@mui/icons-material/Login';
import Paper from '@mui/material/Paper';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';

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

function GuiasSidebarContent(props) {
	// const user = useSelector(({ contactsApp }) => contactsApp.user);

	const dispatch = useDispatch();

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
						to="/almacen/guias/salidas"
						activeClassName="active"
					>
						<LoginIcon fontSize="small" className="list-item-icon text-16" color="action" />
						<ListItemText className="truncate" primary="Salidas de Telas" disableTypography />
					</StyledListItem>
					<StyledListItem
						button
						component={NavLinkAdapter}
						to="/almacen/guias/guias"
						activeClassName="active"
					>
						<Grid4x4Icon fontSize="small" className="list-item-icon text-16" color="action" />
						<ListItemText className="truncate" primary="Guías de Telas" disableTypography />
					</StyledListItem>
				</List>
			</Paper>
		</div>
	);
}

export default GuiasSidebarContent;

import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useRef } from 'react';
import { styled } from '@mui/material/styles';
import AlmacenAviosSidebarContent from './almacenAviosSidebarContent';
import AlmacenAviosHeader from './almacenAviosHeader';
import AlmacenAviosList from './tables/almacenAviosList';
import reducer from '../../../store';
//! Borrar la siguiente importación provoca un bug
import './forms/almacenAvio';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		minHeight: 72,
		height: 72,
		[theme.breakpoints.up('lg')]: {
			minHeight: 136,
			height: 136,
		},
	},
	'& .FusePageSimple-wrapper': {
		minHeight: 0,
	},
	'& .FusePageSimple-contentWrapper': {
		padding: 0,
		[theme.breakpoints.up('sm')]: {
			padding: 24,
			height: '100%',
		},
	},
	'& .FusePageSimple-content': {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
	},
	'& .FusePageSimple-sidebar': {
		width: 256,
		border: 0,
	},
}));

function AlmacenAvios(props) {
	const pageLayout = useRef(null);

	return (
		<>
			<Root
				header={<AlmacenAviosHeader pageLayout={pageLayout} />}
				content={<AlmacenAviosList />}
				leftSidebarContent={<AlmacenAviosSidebarContent />}
				sidebarInner
				ref={pageLayout}
				innerScroll
			/>
		</>
	);
}

export default withReducer('almacen', reducer)(AlmacenAvios);

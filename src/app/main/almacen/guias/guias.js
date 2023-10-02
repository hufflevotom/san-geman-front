import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import reducer from '../../../store';
import GuiasHeader from './guiasHeader';
import GuiasSidebarContent from './guiasSidebarContent';
import GuiasList from './tables/guiasList';
import GuiasModal from './guiasModal';

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

function Guias(props) {
	const pageLayout = useRef(null);
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<>
			<Root
				header={<GuiasHeader pageLayout={pageLayout} setModalOpen={setModalOpen} />}
				content={<GuiasList modalOpen={modalOpen} setModalOpen={setModalOpen} />}
				leftSidebarContent={<GuiasSidebarContent />}
				sidebarInner
				ref={pageLayout}
				innerScroll
			/>
		</>
	);
}

export default withReducer('guias', reducer)(Guias);

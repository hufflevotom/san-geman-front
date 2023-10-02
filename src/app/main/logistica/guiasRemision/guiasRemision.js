import { useState } from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import { styled } from '@mui/material/styles';
import reducer from '../store';
import GuiasRemisionHeader from './guiasRemisionHeader';
import GuiasRemisionTable from './guiasRemisionTable';

const Root = styled(FusePageCarded)(({ theme }) => ({
	'& .FusePageCarded-header': {
		minHeight: 72,
		height: 72,
		[theme.breakpoints.up('sm')]: {
			alignItems: 'center',
			minHeight: 136,
			height: 136,
		},
	},
	'& .FusePageCarded-content': {
		display: 'flex',
	},
	'& .FusePageCarded-contentCard': {
		overflow: 'hidden',
	},
}));

function GuiasRemision() {
	const [rowsPerPage, setRowsPerPage] = useState(10);

	return (
		<Root
			header={<GuiasRemisionHeader rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />}
			content={<GuiasRemisionTable rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />}
			innerScroll
		/>
	);
}

export default withReducer('logistica', reducer)(GuiasRemision);

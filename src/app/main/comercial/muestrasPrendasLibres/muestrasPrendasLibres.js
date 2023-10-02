import { styled } from '@mui/material/styles';

import FusePageCarded from '@fuse/core/FusePageCarded';

import withReducer from 'app/store/withReducer';
import reducer from '../store';

import MuestrasPrendasLibresHeader from './muestrasPrendasLibresHeader';
import MuestrasPrendasLibresTable from './muestrasPrendasLibresTable';

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

function MuestrasPrendasLibres() {
	return (
		<Root
			header={<MuestrasPrendasLibresHeader />}
			content={<MuestrasPrendasLibresTable />}
			innerScroll
		/>
	);
}

export default withReducer('comercial', reducer)(MuestrasPrendasLibres);

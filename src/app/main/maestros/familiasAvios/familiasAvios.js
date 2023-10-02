import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import { styled } from '@mui/material/styles';
import reducer from '../store';
import FamiliasAviosHeader from './familiasAviosHeader';
import FamiliasAviosTable from './familiasAviosTable';

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

function FamiliasAvios() {
	return <Root header={<FamiliasAviosHeader />} content={<FamiliasAviosTable />} innerScroll />;
}

export default withReducer('maestros', reducer)(FamiliasAvios);

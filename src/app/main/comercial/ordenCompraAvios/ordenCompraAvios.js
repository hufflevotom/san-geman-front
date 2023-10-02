import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';
import reducer from 'app/fuse-layouts/shared-components/quickPanel/store';
import withReducer from 'app/store/withReducer';
import OrdenCompraAviosHeader from './ordenCompraAviosHeader';
import OrdenCompraAviosTable from './ordenCompraAviosTable';

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

const OrdenCompraAvios = () => {
	return (
		<Root header={<OrdenCompraAviosHeader />} content={<OrdenCompraAviosTable />} innerScroll />
	);
};

export default withReducer('comercial', reducer)(OrdenCompraAvios);

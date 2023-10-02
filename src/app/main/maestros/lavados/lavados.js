import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import { styled } from '@mui/material/styles';
import maestroReducer from '../store';
import LavadosHeader from './lavadosHeader';
import LavadosTable from './lavadosTable';

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

function Lavados() {
	return <Root header={<LavadosHeader />} content={<LavadosTable />} innerScroll />;
}

export default withReducer('maestros', maestroReducer)(Lavados);

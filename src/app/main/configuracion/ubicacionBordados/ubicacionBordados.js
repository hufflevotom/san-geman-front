import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import { styled } from '@mui/material/styles';
import reducer from '../store';

import UbicacionBordadosHeader from './ubicacionBordadosHeader';
import UbicacionBordadosTable from './ubicacionBordadosTable';

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

function UbicacionBordados() {
	return (
		<Root header={<UbicacionBordadosHeader />} content={<UbicacionBordadosTable />} innerScroll />
	);
}

export default withReducer('configuraciones', reducer)(UbicacionBordados);

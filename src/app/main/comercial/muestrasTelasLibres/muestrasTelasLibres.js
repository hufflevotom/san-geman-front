import { styled } from '@mui/material/styles';

import FusePageCarded from '@fuse/core/FusePageCarded';

import withReducer from 'app/store/withReducer';
import reducer from '../store';

import MuestrasTelasLibresHeader from './muestrasTelasLibresHeader';
import MuestrasTelasLibresTable from './muestrasTelasLibresTable';

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

function MuestrasTelasLibres() {
	return (
		<Root
			header={<MuestrasTelasLibresHeader />}
			content={<MuestrasTelasLibresTable />}
			innerScroll
		/>
	);
}

export default withReducer('comercial', reducer)(MuestrasTelasLibres);

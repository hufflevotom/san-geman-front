import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getProveedores } from 'app/main/comercial/store/proveedor/proveedoresSlice';
import maestroReducer from '../store';
import ColoresHeader from './coloresHeader';
import ColoresTable from './coloresTable';

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

function Colores() {
	return <Root header={<ColoresHeader />} content={<ColoresTable />} innerScroll />;
}

export default withReducer('maestros', maestroReducer)(Colores);

import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import { getModulos } from 'app/store/generales/modulosSlice';
import FamiliasPrendasHeader from './familiasPrendasHeader';
import reducer from '../store';
import FamiliasPrendasTable from './familiasPrendasTable';
// import EmpresasTable from './familiasPrendasTable';

// import ProductsHeader from './ProductsHeader';
// import ProductsTable from './ProductsTable';

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

function FamiliasPrendas() {
	const dispatch = useDispatch();
	useEffect(() => {
		// dispatch(getModulos());
	}, [dispatch]);

	return <Root header={<FamiliasPrendasHeader />} content={<FamiliasPrendasTable />} innerScroll />;
}

export default withReducer('maestros', reducer)(FamiliasPrendas);

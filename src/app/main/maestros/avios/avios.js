import { useState } from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import { styled } from '@mui/material/styles';
import reducer from '../store';
import AviosHeader from './aviosHeader';
import AviosTable from './aviosTable';

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

function Avios() {
	const [checked, setChecked] = useState(false);

	return (
		<Root
			header={<AviosHeader checked={checked} setChecked={setChecked} />}
			content={<AviosTable checked={checked} />}
			innerScroll
		/>
	);
}

export default withReducer('maestros', reducer)(Avios);

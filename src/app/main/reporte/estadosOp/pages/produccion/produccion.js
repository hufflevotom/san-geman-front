import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import httpClient from 'utils/Api';
import ProduccionSidebarContent from './produccionSidebarContent';
import ProduccionHeader from './produccionHeader';
import ProduccionList from './produccionList';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		minHeight: 72,
		height: 72,
		[theme.breakpoints.up('lg')]: {
			minHeight: 136,
			height: 136,
		},
	},
	'& .FusePageSimple-wrapper': {
		minHeight: 0,
	},
	'& .FusePageSimple-contentWrapper': {
		padding: 0,
		[theme.breakpoints.up('sm')]: {
			padding: 24,
			height: '100%',
		},
	},
	'& .FusePageSimple-content': {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
	},
	'& .FusePageSimple-sidebar': {
		width: 256,
		border: 0,
	},
}));

function Produccion(props) {
	const routeParams = useParams();
	const [produccion, setProduccion] = useState();
	const [loading, setLoading] = useState(false);
	const pageLayout = useRef(null);

	const getProduccion = async id => {
		try {
			setLoading(true);
			const response = await httpClient.get(`comercial/registros-op/${id}`);
			const data = await response.data.body;
			setLoading(false);
			setProduccion(data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (routeParams.id) getProduccion(routeParams.id);
	}, []);

	return (
		<>
			<Root
				header={<ProduccionHeader pageLayout={pageLayout} produccion={produccion} />}
				content={<ProduccionList data={produccion} loading={loading} />}
				leftSidebarContent={<ProduccionSidebarContent />}
				sidebarInner
				ref={pageLayout}
				innerScroll
			/>
		</>
	);
}

export default Produccion;

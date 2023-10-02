/* eslint-disable no-throw-literal */
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';
import withReducer from 'app/store/withReducer';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDeepCompareEffect } from '@fuse/hooks';
import { Button, Tabs, Typography, Tab } from '@mui/material';
import showToast from 'utils/Toast';
import _ from '@lodash';
import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'framer-motion';
import reducer from '../../store';
import InformacionBasica from './tabs/informacionBasica';
import {
	createPedido,
	getPedidoId,
	newPedido,
	resetPedido,
	updatePedido,
} from '../../store/pedido/pedidoSlice';
import PedidoHeader from './pedidoHeader';
import Estilos from './tabs/estilos/estilos';
import InformacionAvios from './tabs/avios/informacionAvios';
import ResumenAvios from './tabs/avios/resumenAvios';
import { setPedidoLoading } from '../../store/pedido/helpers';
import OrdenTallas from './tabs/ordenTallas/ordenTallas';
import ModalConfirmar from './modalConfirmar';

const Root = styled(FusePageCarded)(({ theme }) => ({
	'& .FusePageCarded-header': {
		minHeight: 72,
		height: 72,
		alignItems: 'center',
		[theme.breakpoints.up('sm')]: {
			minHeight: 136,
			height: 136,
		},
	},
}));

const schema = yup.object().shape({
	po: yup
		.string()
		.required('El nombre del pedido es requerido')
		.min(2, 'El nombre del pedido debe tener al menos 2 caracteres'),
});

const Pedido = () => {
	const dispatch = useDispatch();

	const pedido = useSelector(({ comercial }) => comercial.pedido);
	const { loading } = useSelector(({ comercial }) => comercial.helpers);

	const routeParams = useParams();
	const navigate = useNavigate();
	const [tabValue, setTabValue] = useState(0);
	const [noExistePedido, setNoExistePedido] = useState(false);
	const [modalConfirmar, setModalConfirmar] = useState(false);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: yupResolver(schema),
	});
	const { reset, watch, getValues } = methods;
	const form = watch();

	useDeepCompareEffect(() => {
		function updatePedidoState() {
			const { id } = routeParams;
			if (id === 'nuevo') {
				dispatch(newPedido());
			} else {
				dispatch(getPedidoId(id)).then(action => {
					if (!action.payload) {
						setNoExistePedido(true);
					}
				});
			}
		}

		updatePedidoState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!pedido) {
			return;
		}
		reset(pedido);
	}, [pedido, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetPedido());
			dispatch(setPedidoLoading(false));
			setNoExistePedido(false);
		};
	}, [dispatch]);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (noExistePedido) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontro el pedido!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/comercial/pedidos"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (
		_.isEmpty(form) ||
		(pedido && parseInt(routeParams.id, 10) !== pedido.id && routeParams.id !== 'nuevo')
	) {
		return <FuseLoading />;
	}

	if (loading) {
		return <FuseLoading texto="Guardando.." />;
	}
	return (
		<FormProvider {...methods}>
			<Root
				header={
					<PedidoHeader
						handleSavePedido={() => {
							setModalConfirmar(true);
						}}
					/>
				}
				contentToolbar={
					<Tabs
						value={tabValue}
						onChange={handleTabChange}
						indicatorColor="primary"
						textColor="primary"
						variant="scrollable"
						scrollButtons="auto"
						classes={{ root: 'w-full h-64' }}
					>
						<Tab className="h-64" label="Detalles" />
						<Tab className="h-64" label="Avios" />
						<Tab className="h-64" label="Ordenar tallas" />
					</Tabs>
				}
				content={
					<div className="p-16 sm:p-24 ">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Detalles</div>
							<InformacionBasica />
							<div className="mx-6 mb-16 mt-16 text-base">Estilos</div>
							<Estilos />
						</div>

						<div className={tabValue !== 1 ? 'hidden' : ''}>
							<InformacionAvios />
							<br />
							<ResumenAvios />
						</div>

						<div className={tabValue !== 2 ? 'hidden' : ''}>
							<OrdenTallas />
						</div>

						{modalConfirmar && (
							<ModalConfirmar
								visible={modalConfirmar}
								setVisible={setModalConfirmar}
								tipo={routeParams.id}
							/>
						)}
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
};

export default withReducer('comercial', reducer)(Pedido);

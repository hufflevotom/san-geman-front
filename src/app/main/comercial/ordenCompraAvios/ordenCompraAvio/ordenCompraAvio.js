import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';
import withReducer from 'app/store/withReducer';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDeepCompareEffect } from '@fuse/hooks';
import { Button, Typography } from '@mui/material';
import _ from '@lodash';
import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'framer-motion';

import {
	getOCAvioId,
	newOCAvio,
	resetOCAvio,
} from '../../store/ordenCompraAvio/ordenCompraAvioSlice';

import reducer from '../../store';
import OrdenCompraAvioHeader from './ordenCompraAvioHeader';
import InformacionBasica from './tabs/informacionBasica';

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

// Validaciones de los campos, que sea exacto al name de los inputs.
const schema = yup.object().shape({
	// codigo: yup.string().required('El código es requerido'), // OK
	lugarEntrega: yup.string().required('El lugar de entrega es requerido'), // OK
	observacion: yup.string(), // OK
	// fechaEmision: yup.date().required('La fecha de emisión es requerida'), // OK
	moneda: yup.string().required('La Moneda es requerida').nullable(), // OK
	proveedor: yup.object().required('El Proveedor es requerido').nullable(),
	formaPago: yup.object().required('La Forma de pago es requerida').nullable(), // ok
	// produccion: yup.object().required('La Orden de Producción es requerida').nullable(), // OK
});

const OrdenCompraAvio = () => {
	const dispatch = useDispatch();

	// Seleccionar el id de la orden de compra
	const ordenCompraAvio = useSelector(({ comercial }) => comercial.ordenCompraAvio);
	// Obtener parametros de la ruta
	const routeParams = useParams();
	// Estado para cambiar el tab
	const [tabValue, setTabValue] = useState(0);
	const [codigo, setCodigo] = useState('');
	// Estado para validar si existe la data o no
	const [noExisteOrdenCompraAvio, setNoExisteOrdenCompraAvio] = useState(false);
	// Metodod para mostrar la validacion del form
	const methods = useForm({
		mode: 'all',
		resolver: yupResolver(schema),
	});

	// Metodos del form -> methods
	const { reset, watch, control, onChange, formState } = methods;

	// Observador para el form
	const form = watch();

	// Se ejecuta la primera vez que se carga la pagina
	useDeepCompareEffect(() => {
		function updateOrdenCompraAvioState() {
			// Obtener el id de los parametros
			const { id } = routeParams;
			// Si el id es nuevo, se dispara una accion para crear
			if (id === 'nuevo') {
				dispatch(newOCAvio());
			} else {
				// Se dispara una accion para obtener id y mostrarlo en el form
				dispatch(getOCAvioId(id)).then(action => {
					if (!action.payload) {
						// Si no hay data se setea la data a true
						setNoExisteOrdenCompraAvio(true);
					}
				});
			}
		}

		updateOrdenCompraAvioState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!ordenCompraAvio) {
			return;
		}

		reset(ordenCompraAvio);
	}, [ordenCompraAvio, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetOCAvio());
			setNoExisteOrdenCompraAvio(false);
		};
	}, [dispatch]);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (noExisteOrdenCompraAvio) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontro el Orden de Compra de Avios!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/comercial/orden-compra-avios"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (
		_.isEmpty(form) ||
		(ordenCompraAvio &&
			parseInt(routeParams.id, 10) !== ordenCompraAvio.id &&
			routeParams.id !== 'nuevo')
	) {
		return <FuseLoading />;
	}
	return (
		<FormProvider {...methods}>
			<Root
				header={<OrdenCompraAvioHeader tipo={routeParams.id} codigo={codigo} />}
				content={
					<div className="p-16 sm:p-24 ">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							{/* <InformacionPdf /> */}
							<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Detalles</div>
							<InformacionBasica tipo={routeParams.id} setCodigo={setCodigo} />
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
};

export default withReducer('comercial', reducer)(OrdenCompraAvio);

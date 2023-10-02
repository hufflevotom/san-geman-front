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
import { Button, Tabs, Typography, Tab } from '@mui/material';
import _ from '@lodash';
import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'framer-motion';
import { getProveedores } from 'app/main/comercial/store/proveedor/proveedoresSlice';
import reducer from '../../store';
import InformacionBasicaTab from './tabs/informacionBasica';
import { getColorId, newColor, resetColor } from '../../store/color/colorSlice';
import ColorHeader from './colorHeader';
import ProveedorTab from './tabs/proveedor';
import AlternativasTab from './tabs/alternativas';
import ClienteTab from './tabs/cliente';
import ImagenesTab from './tabs/imagenes';

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

/* const schema = yup.object().shape({
	descripcion: yup
		.string()
		.required('Descripción es requerido')
		.min(3, 'Descripción debe tener al menos 3 caracteres'),
	codigo: yup
		.string()
		.required('Código es requerido')
		.min(2, 'Código debe tener al menos 2 caracteres'),
	proveedor: yup.object().required('Proveedor es requerido').nullable(),
	pantone: yup.string().required('El pantone es requerido'),
});
 */
const Color = () => {
	const dispatch = useDispatch();
	const color = useSelector(({ maestros }) => maestros.color);

	const routeParams = useParams();
	const [noExisteColor, setNoExisteColor] = useState(false);
	const methods = useForm({
		mode: 'all',
		// defaultValues: {},
		// resolver: yupResolver(schema),
	});
	const { reset, watch, control, onChange, formState } = methods;
	const form = watch();

	useDeepCompareEffect(() => {
		function updateColorState() {
			const { id } = routeParams;

			if (id === 'nuevo') {
				dispatch(newColor());
			} else {
				dispatch(getColorId(id)).then(action => {
					if (!action.payload) {
						setNoExisteColor(true);
					}
				});
			}
		}

		updateColorState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!color) {
			return;
		}

		reset(color);
	}, [color, reset]);

	useEffect(() => {
		return () => {
			dispatch(resetColor());
			setNoExisteColor(false);
		};
	}, [dispatch]);

	if (noExisteColor) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontro el color!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/maestros/colores"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (
		_.isEmpty(form) ||
		(color && parseInt(routeParams.id, 10) !== color.id && routeParams.id !== 'nuevo')
	) {
		return <FuseLoading />;
	}
	return (
		<FormProvider {...methods}>
			<Root
				header={<ColorHeader tipo={routeParams.id} />}
				content={
					<div className="p-16 sm:p-24 ">
						<div>
							<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Detalles</div>
							<InformacionBasicaTab />
							<div className="mx-6 mb-16 mt-16 text-base">Alternativa aprobada</div>
							<AlternativasTab />
							<div className="mx-6 mb-16 mt-16 text-base">Proveedor</div>
							<ProveedorTab />
							<div className="mx-6 mb-16 mt-16 text-base">Cliente</div>
							<ClienteTab />
							<div className="mx-6 mb-16 mt-16 text-base">Imágenes</div>
							<ImagenesTab />
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
};

export default withReducer('maestros', reducer)(Color);

/* eslint-disable no-restricted-syntax */
import FusePageCarded from '@fuse/core/FusePageCarded';
import debounce from 'lodash.debounce';
import { styled } from '@mui/material/styles';
import withReducer from 'app/store/withReducer';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import { Button, Icon, Typography } from '@mui/material';
import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'framer-motion';
import httpClient, { baseUrl } from 'utils/Api';
import showToast from 'utils/Toast';
import reducer from '../../store';

import ControlFacturaHeader from './controlFacturaHeader';
import InputString from './components/inputString';
import InputNumber from './components/inputNumber';
import InputSelect from './components/inputSelect';
import {
	getControlFacturaId,
	newControlFactura,
	resetControlFactura,
} from '../../store/controlFactura/controlFacturaSlice';
import { getProduccionesService } from '../../OSCortes/OSCorte/services';
import InputSwitch from './components/inputSwitch';

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

const monedaOptions = [
	{
		id: 'SOLES',
		key: 'SOLES',
		label: 'SOLES',
	},
	{
		id: 'DOLARES',
		key: 'DOLARES',
		label: 'DOLARES',
	},
];
const ControlFactura = () => {
	const dispatch = useDispatch();
	const routeParams = useParams();

	const model = useSelector(({ logistica }) => logistica.model);

	const [disabled, setDisabled] = useState(false);
	const [noExiste, setNoExiste] = useState(false);

	const [currentSerie, setCurrentSerie] = useState('');
	const [currentNumero, setCurrentNumero] = useState('');
	const [currentMoneda, setCurrentMoneda] = useState(null);
	const [currentProduccion, setCurrentProduccion] = useState(null);
	const [currentPagado, setCurrentPagado] = useState(false);
	const [currentObservaciones, setCurrentObservaciones] = useState('');
	const [currentIgvTotal, setCurrentIgvTotal] = useState(0);
	const [currentSubTotal, setCurrentSubTotal] = useState(0);
	const [currentTotal, setCurrentTotal] = useState(0);
	const [imagenDocumento, setImagenDocumento] = useState();

	const [producciones, setProducciones] = useState([]);

	const [ordenProduccionSearchText, setOrdenProduccionSearchText] = useState('');

	const getProducciones = async busqueda => {
		const data = await getProduccionesService(busqueda);
		if (data) setProducciones(data);
	};

	const debouncedTraerOrdenesProduccion = debounce(() => {
		getProducciones(ordenProduccionSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerOrdenesProduccion(); // Llamar a la versión debounced de fetchData
		return debouncedTraerOrdenesProduccion.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [ordenProduccionSearchText]);

	const obtenerData = async id => {
		setDisabled(true);
		await showToast(
			{
				promesa: async () => {
					const {
						data: { statusCode, body },
					} = await httpClient.get(`logistica/control-factura/${id}`);
					if (statusCode === 200) {
						await getProducciones(body.produccion.codigo);
						//* Seteamos los datos de la serie
						setCurrentSerie(body.serie);
						//* Seteamos los datos del numero
						setCurrentNumero(body.numero);
						//* Seteamos los datos de las observaciones
						setCurrentObservaciones(body.observaciones);
						//* Seteamos los datos de la produccion
						setCurrentProduccion({
							...body.produccion,
							key: body.produccion.codigo,
							label: body.produccion.codigo,
						});
						//* Seteamos los datos de la moneda
						setCurrentMoneda({
							id: body.moneda,
							key: body.moneda,
							label: body.moneda,
						});
						//* Seteamos el flag pagado
						setCurrentPagado(body.pagado);
						//* Seteamos los datos del igvTotal
						setCurrentIgvTotal(parseFloat(body.igvTotal));
						//* Seteamos los datos del subTotal
						setCurrentSubTotal(parseFloat(body.subTotal));
						//* Seteamos los datos del total
						setCurrentTotal(parseFloat(body.total));
						//* Seteamos la imagen del documento
						setImagenDocumento(body.imagenDocumento);
					}
					setDisabled(false);
					return { payload: { message: 'Factura encontrada' } };
				},
				parametros: [],
			},
			'buscar',
			'Factura'
		);
	};

	useEffect(() => {
		if (routeParams.id === 'nuevo') {
			getProducciones();
		}
	}, []);

	useDeepCompareEffect(() => {
		function updateFamiliaState() {
			if (routeParams.id === 'nuevo') {
				dispatch(newControlFactura());
			} else {
				dispatch(getControlFacturaId(routeParams.id)).then(action => {
					if (!action.payload) {
						setNoExiste(true);
					}
				});
				obtenerData(routeParams.id);
			}
		}

		updateFamiliaState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		return () => {
			dispatch(resetControlFactura());
			setNoExiste(false);
		};
	}, [dispatch]);

	if (noExiste) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					No se encontro la factura!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/logistica/control-factura"
					color="inherit"
				>
					Regresar
				</Button>
			</motion.div>
		);
	}

	if (model && parseInt(routeParams.id, 10) !== model.id && routeParams.id !== 'nuevo') {
		return <FuseLoading />;
	}

	return (
		<Root
			header={
				<ControlFacturaHeader
					tipo={routeParams.id}
					data={{
						currentProduccion,
						currentSerie,
						currentNumero,
						currentPagado,
						currentMoneda,
						currentIgvTotal,
						currentSubTotal,
						currentTotal,
						currentObservaciones,
						imagenDocumento,
					}}
				/>
			}
			content={
				<div className="p-16 sm:p-24 ">
					<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Detalles</div>
					<div>
						<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
							<InputSelect
								label="Produccion"
								onSearch={setOrdenProduccionSearchText}
								options={producciones.map(produccion => ({
									...produccion,
									key: produccion.codigo,
									label: produccion.codigo,
								}))}
								value={currentProduccion}
								onChange={(e, newValue) => setCurrentProduccion(newValue)}
								disabled={disabled}
							/>
							<InputString
								label="Serie"
								value={currentSerie}
								onChange={event => {
									setCurrentSerie(event.target.value);
								}}
								disabled={disabled}
							/>
							<InputString
								label="Numero"
								value={currentNumero}
								onChange={event => {
									setCurrentNumero(event.target.value);
								}}
								disabled={disabled}
							/>
							<InputSwitch
								label="Pagado"
								value={currentPagado}
								onChange={event => {
									setCurrentPagado(event.target.checked);
								}}
								disabled={disabled}
							/>
						</div>
						<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
							<InputSelect
								label="Moneda"
								options={monedaOptions}
								value={currentMoneda}
								onChange={(e, newValue) => setCurrentMoneda(newValue)}
								disabled={disabled}
							/>
							<InputNumber
								label="IgvTotal"
								value={currentIgvTotal}
								onChange={event => {
									setCurrentIgvTotal(event.target.value);
								}}
								disabled={disabled}
							/>
							<InputNumber
								label="SubTotal"
								value={currentSubTotal}
								onChange={event => {
									setCurrentSubTotal(event.target.value);
								}}
								disabled={disabled}
							/>
							<InputNumber
								label="Total"
								value={currentTotal}
								onChange={event => {
									setCurrentTotal(event.target.value);
								}}
								disabled={disabled}
							/>
						</div>
						<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
							<InputString
								label="Observaciones"
								value={currentObservaciones}
								onChange={event => {
									setCurrentObservaciones(event.target.value);
								}}
								disabled={disabled}
							/>
						</div>
					</div>
					{currentPagado && (
						<>
							<div className="mx-6 mb-16 mt-12 sm:mt-4 text-base">Imagen factura</div>
							<div>
								<label
									style={{ width: '100%' }}
									htmlFor={1}
									className="productImageUpload flex items-center justify-center relative w-100 h-100 rounded-16 mx-12 overflow-hidden cursor-pointer hover:shadow-lg shadow"
								>
									<input
										accept="image/*"
										className="hidden"
										id={1}
										type="file"
										onChange={e => {
											if (e) {
												const data = e.target.files[0];
												const obj = {
													file: data,
												};
												setImagenDocumento(obj);
											} else {
												setImagenDocumento(null);
											}
										}}
									/>

									{imagenDocumento ? (
										<div style={{ width: '100%' }}>
											{imagenDocumento.file ? (
												<img
													className="w-full block rounded"
													src={URL.createObjectURL(imagenDocumento.file)}
													alt={imagenDocumento.file}
												/>
											) : (
												<img
													className="w-full block rounded"
													src={baseUrl + imagenDocumento}
													alt={imagenDocumento}
												/>
											)}
										</div>
									) : (
										<div style={{ width: '100%', textAlign: 'center' }}>
											<Icon fontSize="large" color="action">
												cloud_upload
											</Icon>
										</div>
									)}
								</label>
							</div>
						</>
					)}
				</div>
			}
			innerScroll
		/>
	);
};

export default withReducer('logistica', reducer)(ControlFactura);

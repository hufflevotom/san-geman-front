/* eslint-disable no-nested-ternary */
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ModalConfirmPin } from 'app/shared-components/ModalConfirmPin';
import showToast from 'utils/Toast';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import IngresosTable from './ingresos/ingresosTable';
import SalidasTable from './salidas/salidasTable';
import KardexTable from './kardex/kardexTable';
import ModalDetalles from './modalDetalles';
import ModalDetallesSalida from './modalDetallesSalida';
import ReporteOpTable from './reporteOp/reporteOpTable';
import ModalDetallesReporte from './modalDetallesReporte';
import ModalCambioUbicacion from './modalCambioUbicacion';
import { anularIngreso } from '../../store/almacenAvio/ingresos/ingresosAviosSlice';
import { anularSalidaAvio } from '../../store/almacenAvio/salidas/salidasAviosSlice';

function AlmacenAviosList(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();
	const [openModal, setOpenModal] = useState(false);
	const [dataModal, setDataModal] = useState(null);
	const [openModalSalida, setOpenModalSalida] = useState(false);
	const [dataModalSalida, setDataModalSalida] = useState(null);
	const [dataModalReporte, setDataModalReporte] = useState(null);
	const [openModalReporte, setOpenModalReporte] = useState(false);
	const [openModalUbicacion, setOpenModalUbicacion] = useState(false);
	const [dataModalUbicacion, setDataModalUbicacion] = useState(null);
	const [openAnular, setOpenAnular] = useState(false);
	const [callBackAuth, setCallBackAuth] = useState(null);
	const [idAnular, setIdAnular] = useState(null);

	return (
		<>
			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
				className="flex flex-auto w-full max-h-full"
			>
				{routeParams.tipo === 'ingresos' ? (
					<IngresosTable
						setOpenModal={setOpenModal}
						setDataModal={setDataModal}
						setOpenAnular={setOpenAnular}
						setCallBackAuth={id => {
							setIdAnular(id);
							setCallBackAuth('Ingresos');
						}}
					/>
				) : routeParams.tipo === 'salidas' ? (
					<SalidasTable
						setOpenModal={setOpenModalSalida}
						setDataModal={setDataModalSalida}
						setOpenAnular={setOpenAnular}
						setCallBackAuth={id => {
							setIdAnular(id);
							setCallBackAuth('Salidas');
						}}
					/>
				) : routeParams.tipo === 'kardex' ? (
					<KardexTable setOpenModal={setOpenModalUbicacion} setDataModal={setDataModalUbicacion} />
				) : routeParams.tipo === 'reporteOp' ? (
					<ReporteOpTable setOpenModal={setOpenModalReporte} setDataModal={setDataModalReporte} />
				) : null}
			</motion.div>
			{openModal && (
				<ModalDetalles openModal={openModal} setOpenModal={setOpenModal} dataModal={dataModal} />
			)}
			{openModalSalida && (
				<ModalDetallesSalida
					openModal={openModalSalida}
					setOpenModal={setOpenModalSalida}
					dataModal={dataModalSalida}
				/>
			)}
			{openModalUbicacion && (
				<ModalCambioUbicacion
					openModal={openModalUbicacion}
					setOpenModal={setOpenModalUbicacion}
					dataModal={dataModalUbicacion}
				/>
			)}
			{openModalReporte && (
				<ModalDetallesReporte
					openModal={openModalReporte}
					setOpenModal={setOpenModalReporte}
					dataModal={dataModalReporte}
				/>
			)}
			{openAnular && (
				<ModalConfirmPin
					visible={openAnular}
					setVisible={setOpenAnular}
					callback={user => {
						if (callBackAuth === 'Ingresos') {
							let activePin = false;

							const permisosPin = ['anularIngresoAlmacenAvios'];

							user.role.modulos.forEach(modulo => {
								if (permisosPin.includes(modulo.nombre)) {
									activePin = true;
								}
							});

							if (activePin) {
								showToast(
									{
										promesa: async n => {
											const error = await dispatch(
												anularIngreso({
													id: idAnular,
													offset: 0,
													limit: 10,
												})
											);
											if (error.error) throw error;
											return error;
										},
										parametros: [dataModal],
									},
									'delete',
									'almacen avio'
								);
							} else {
								toast.error('No tienes permisos para anular este registro.');
							}
						} else {
							let activePin = false;

							const permisosPin = ['anularSalidaAlmacenAvios'];

							user.role.modulos.forEach(modulo => {
								if (permisosPin.includes(modulo.nombre)) {
									activePin = true;
								}
							});

							if (activePin) {
								showToast(
									{
										promesa: async n => {
											const error = await dispatch(
												anularSalidaAvio({
													id: idAnular,
													offset: 0,
													limit: 10,
												})
											);
											if (error.error) throw error;
											return error;
										},
										parametros: [dataModalSalida],
									},
									'delete',
									'almacen avio'
								);
							} else {
								toast.error('No tienes permisos para anular este registro.');
							}
						}
					}}
					okTitle="Anular"
					message="Ingrese las credenciales de un usuario con permiso para anular el registro."
					cancelTitle="Cancelar"
				/>
			)}
		</>
	);
}

export default AlmacenAviosList;

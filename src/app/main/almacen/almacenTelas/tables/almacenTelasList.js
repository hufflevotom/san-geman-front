/* eslint-disable no-nested-ternary */
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ModalConfirmPin } from 'app/shared-components/ModalConfirmPin';
import showToast from 'utils/Toast';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import IngresosTable from './ingresos/ingresosTable';
import SalidasTable from './salidas/salidasTable';
import KardexTable from './kardex/kardexTable';
import ModalDetalles from './modalDetalles';
import ModalDetallesSalida from './modalDetallesSalida';
import ModalCambioUbicacion from './modalCambioUbicacion';
import ReporteOpTable from './reporteOp/reporteOpTable';
import ModalDetallesReporte from './modalDetallesReporte';
import ModalAsignacionOp from './modalAsignacion';
import ModalCambioColor from './modalCambioColor';
import { anularSalidaTela } from '../../store/almacenTela/salidas/salidasTelasSlice';
import { anularIngreso } from '../../store/almacenTela/ingresos/ingresosTelasSlice';

function AlmacenTelasList(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();
	const [openModal, setOpenModal] = useState(false);
	const [dataModal, setDataModal] = useState(null);
	const [openModalSalida, setOpenModalSalida] = useState(false);
	const [dataModalSalida, setDataModalSalida] = useState(null);
	const [openModalUbicacion, setOpenModalUbicacion] = useState(false);
	const [dataModalUbicacion, setDataModalUbicacion] = useState(null);
	const [openModalColor, setOpenModalColor] = useState(false);
	const [dataModalColor, setDataModalColor] = useState(null);
	const [dataModalReporte, setDataModalReporte] = useState(null);
	const [openModalReporte, setOpenModalReporte] = useState(false);
	const [dataModalAsignacion, setDataModalAsignacion] = useState(null);
	const [openModalAsignacion, setOpenModalAsignacion] = useState(false);
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
				{routeParams.tipo === 'ingreso' ? (
					<IngresosTable
						setOpenModal={setOpenModal}
						setDataModal={setDataModal}
						setOpenAnular={setOpenAnular}
						setCallBackAuth={id => {
							setIdAnular(id);
							setCallBackAuth('Ingresos');
						}}
					/>
				) : routeParams.tipo === 'salida' ? (
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
					<KardexTable
						setOpenModal={setOpenModalUbicacion}
						setDataModal={setDataModalUbicacion}
						setOpenModalColor={setOpenModalColor}
						setDataModalColor={setDataModalColor}
						setOpenModalAsignacion={setOpenModalAsignacion}
						setDataModalAsignacion={setDataModalAsignacion}
					/>
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
			{openModalColor && (
				<ModalCambioColor
					openModal={openModalColor}
					setOpenModal={setOpenModalColor}
					dataModal={dataModalColor}
				/>
			)}
			{openModalAsignacion && (
				<ModalAsignacionOp
					openModal={openModalAsignacion}
					setOpenModal={setOpenModalAsignacion}
					dataModal={dataModalAsignacion}
				/>
			)}
			{openModalReporte && (
				<ModalDetallesReporte
					openModal={openModalReporte}
					setOpenModal={setOpenModalReporte}
					dataModal={dataModalReporte}
					setOpenModalIngreso={setOpenModal}
					setOpenModalSalida={setOpenModalSalida}
					setDataModalIngreso={setDataModal}
					setDataModalSalida={setDataModalSalida}
				/>
			)}
			{openAnular && (
				<ModalConfirmPin
					visible={openAnular}
					setVisible={setOpenAnular}
					callback={user => {
						if (callBackAuth === 'Ingresos') {
							let activePin = false;

							const permisosPin = ['anularIngresoAlmacenTelas'];

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
									'almacen tela'
								);
							} else {
								toast.error('No tienes permisos para anular este registro.');
							}
						} else {
							let activePin = false;

							const permisosPin = ['anularSalidaAlmacenTelas'];

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
												anularSalidaTela({
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
									'almacen tela'
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

export default AlmacenTelasList;

/* eslint-disable no-nested-ternary */
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import GuiasModal from '../guiasModal';
import GuiasTable from './guias/guiasTable';
import ModalDetallesSalida from './modalDetallesSalida';
import ModalDocumentoSalida from './modalDocumentoGuia';
import SalidasTable from './salidas/salidasTable';

function GuiasList(props) {
	const routeParams = useParams();
	const [openModal, setOpenModal] = useState(false);
	const [dataModal, setDataModal] = useState(null);
	const [openModalSalida, setOpenModalSalida] = useState(false);
	const [dataModalSalida, setDataModalSalida] = useState(null);

	return (
		<>
			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
				className="flex flex-auto w-full max-h-full"
			>
				{routeParams.tipo === 'guias' ? (
					<GuiasTable setOpenModal={setOpenModal} setDataModal={setDataModal} />
				) : routeParams.tipo === 'salidas' ? (
					<SalidasTable setOpenModal={setOpenModalSalida} setDataModal={setDataModalSalida} />
				) : null}
			</motion.div>
			{openModal && (
				<ModalDocumentoSalida
					openModal={openModal}
					setOpenModal={setOpenModal}
					dataModal={dataModal}
				/>
			)}
			{openModalSalida && (
				<ModalDetallesSalida
					openModal={openModalSalida}
					setOpenModal={setOpenModalSalida}
					dataModal={dataModalSalida}
				/>
			)}
			{props.modalOpen && (
				<GuiasModal openModal={props.modalOpen} setOpenModal={props.setModalOpen} />
			)}
		</>
	);
}

export default GuiasList;

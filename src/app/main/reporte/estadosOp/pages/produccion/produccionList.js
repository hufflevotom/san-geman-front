/* eslint-disable no-nested-ternary */
import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OrdenesCompraTable, RutaTable } from './components';

function ProduccionList({ data, loading }) {
	const routeParams = useParams();
	const [ordenesCompra, setOrdenesCompra] = useState([]);
	const [estilos, setEstilos] = useState([]);

	const filterOrdenesCompra = produccion => {
		const arrayOrdenesCompra = [];
		produccion.produccion.ordenCompraTelas.forEach(element => {
			const arrayIngresos = [];
			produccion.registrosIngresoAlmacenTela.forEach(ingreso => {
				if (ingreso.ordenCompra.id === element.id) {
					arrayIngresos.push(ingreso);
				}
			});
			arrayOrdenesCompra.push({
				...element,
				indicadorTipo: 'T',
				registrosIngresoAlmacenTela: arrayIngresos,
			});
		});
		produccion.produccion.ordenCompraAvios.forEach(element => {
			const arrayIngresos = [];
			produccion.registrosIngresoAlmacenAvio.forEach(ingreso => {
				if (ingreso.ordenCompra.id === element.id) {
					arrayIngresos.push(ingreso);
				}
			});
			arrayOrdenesCompra.push({
				...element,
				indicadorTipo: 'A',
				registrosIngresoAlmacenAvio: arrayIngresos,
			});
		});
		setOrdenesCompra(arrayOrdenesCompra);
	};

	const filterEstilos = produccion => {
		const arrayEstilos = [];
		produccion.produccion.pedidos.forEach(element => {
			element.estilos.forEach(estilo => {
				if (arrayEstilos.findIndex(e => e.id === estilo.id) === -1) {
					arrayEstilos.push(estilo);
				}
			});
		});
		setEstilos(arrayEstilos);
	};

	useEffect(() => {
		if (data) {
			filterOrdenesCompra(data);
			filterEstilos(data);
		}
	}, [data]);

	return (
		<>
			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
				className="flex flex-auto w-full max-h-full"
			>
				{loading ? (
					<FuseLoading />
				) : routeParams.tipo === 'ordenCompra' ? (
					<OrdenesCompraTable ordenesCompra={ordenesCompra} />
				) : routeParams.tipo === 'ruta' ? (
					<RutaTable estilos={estilos} />
				) : null}
			</motion.div>
		</>
	);
}

export default ProduccionList;

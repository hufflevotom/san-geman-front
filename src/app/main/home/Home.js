import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import HomeHeader from './HomeHeader';
import Number from './widgets/Number';
import PieChart from './widgets/PieChart';
import StockList from './widgets/StockList';
import {
	getCantidadAvios,
	getControlCalidad,
	getStockAvios,
	getTipoClientes,
	getTotalAvios,
	getTotalProductos,
} from './dashboard.service';

const Root = styled(FusePageSimple)({
	'& .FusePageSimple-header': {},
	'& .FusePageSimple-toolbar': {},
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {},
});

const container = {
	show: {
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

const cantidadStock = 200;
const options = {
	chart: {
		height: '100%',
		type: 'donut',
	},
	legend: {
		show: false,
		position: 'bottom',
		horizontalAlign: 'left',
		itemMargin: { horizontal: 10, vertical: 10 },
		formatter(val, opts) {
			return [val, ' - ', opts.w.globals.series[opts.seriesIndex]];
		},
	},
	dataLabels: { enabled: false },
	stroke: { width: 1 },
	fill: { opacity: 1 },
	theme: { monochrome: { enabled: true, shadeTo: 'light', shadeIntensity: 0.65 } },
	states: { hover: { filter: { type: 'darken' } } },
	plotOptions: {
		pie: {
			customScale: 0.9,
			donut: {
				size: '70%',
			},
		},
	},
};

function HomePage(props) {
	const pageLayout = useRef(null);

	const [widgets, setWidgets] = useState({
		numeros: [],
		graficoCircular: [],
		lista: [],
	});

	const traerDatos = async () => {
		//* Numeros
		const numeros = [];
		const controlCalidad = await getControlCalidad();
		numeros.push({
			title: 'Control de Calidad',
			data: { count: controlCalidad.data.body, name: 'Pendientes' },
			color: 'red',
		});
		const totalTelas = await getTotalProductos();
		numeros.push({
			title: 'Total de Telas',
			data: { count: totalTelas.data.body, name: 'En Almacén' },
			color: 'cyan',
		});
		const totalAvios = await getTotalAvios();
		numeros.push({
			title: 'Total de Avios',
			data: { count: totalAvios.data.body, name: 'En Almacén' },
			color: 'green',
		});
		numeros.push({
			title: 'Total de Ordenes de compra',
			data: { count: 68, name: 'Realizados' },
			color: 'orange',
		});
		//* Grafico circular
		const graficoCircular = [];
		const tipoClientes = await getTipoClientes();
		graficoCircular.push({
			title: 'Clientes',
			series: [
				parseFloat(tipoClientes.data.body.nacionales),
				parseFloat(tipoClientes.data.body.extranjeros),
			],
			total:
				parseFloat(tipoClientes.data.body.nacionales) +
				parseFloat(tipoClientes.data.body.extranjeros),
			labels: ['Nacionales', 'Extranjeros'],
			options: {
				...options,
				labels: ['Nacionales', 'Extranjeros'],
				theme: { palette: 'palette7' },
			},
		});
		// const cantidadAvios = await getCantidadAvios(3);
		// const dataAvios = {
		// 	series: [],
		// 	labels: [],
		// };
		// cantidadAvios.data.body[0].forEach(avio => {
		// 	dataAvios.series.push(avio.cantidadPrincipal);
		// 	dataAvios.labels.push(`${avio.codigo} / ${avio.producto.avio.nombre}`);
		// });
		// graficoCircular.push({
		// 	title: 'Avios',
		// 	series: dataAvios.series.concat(
		// 		cantidadAvios.data.body[1] -
		// 			dataAvios.series.reduce((accumulator, curr) => accumulator + curr)
		// 	),
		// 	total: cantidadAvios.data.body[1],
		// 	labels: dataAvios.labels.concat('Otros'),
		// 	options: {
		// 		...options,
		// 		labels: dataAvios.labels.concat('Otros'),
		// 		theme: { palette: 'palette6' },
		// 	},
		// });
		//* Lista
		// const lista = [];
		// const stockAvios = await getStockAvios(cantidadStock);
		// stockAvios.data.body.forEach(avio => {
		// 	lista.push({
		// 		title: `${avio.codigo} / ${avio.producto.avio.nombre}`,
		// 		stock: avio.cantidadPrincipal,
		// 	});
		// });
		setWidgets({
			...widgets,
			numeros,
			// lista,
			graficoCircular,
		});
	};

	useEffect(() => {
		traerDatos();
	}, []);

	return (
		<Root
			header={<HomeHeader pageLayout={pageLayout} />}
			content={
				<div
					style={{ display: 'flex', flexDirection: 'column' }}
					className="p-12 lg:ltr:pr-0 lg:rtl:pl-0"
				>
					<motion.div
						className="flex flex-wrap"
						variants={container}
						initial="hidden"
						animate="show"
					>
						{widgets &&
							widgets.numeros &&
							widgets.numeros.map((widget, index) => (
								<motion.div
									variants={item}
									className="widget flex w-full sm:w-1/4 md:w-1/4 p-12"
									key={`widget-${index}`}
								>
									<Number data={widget} />
								</motion.div>
							))}
					</motion.div>
					<motion.div
						className="flex flex-wrap"
						variants={container}
						initial="hidden"
						animate="show"
					>
						{widgets &&
							widgets.graficoCircular &&
							widgets.graficoCircular.map((widget, index) => (
								<div className="w-full sm:w-1/2 md:w-1/3" key={`widget-circular-${index}`}>
									<motion.div variants={item} className="widget w-full p-16">
										<PieChart data={widget} title={widget.title} />
									</motion.div>
								</div>
							))}
						{/* {widgets && widgets.lista.length > 0 && (
							<div className="w-full sm:w-1/2 md:w-1/3">
								<motion.div variants={item} className="widget w-full p-16">
									<StockList data={widgets.lista} />
								</motion.div>
							</div>
						)} */}
					</motion.div>
				</div>
			}
		/>
	);
}

export default HomePage;

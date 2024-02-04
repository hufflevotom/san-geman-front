import { modulosDiccionario, rutasDiccionario } from 'app/auth/authRoles';
import { MODULOS, produccion } from 'constants/constantes';

const navigationConfig = [
	{
		id: 'inicio',
		title: 'Inicio',
		type: 'item',
		icon: 'home',
		url: '/inicio',
	},
	{
		id: 'maestros',
		title: 'Maestros',
		translate: 'Maestros',
		type: 'group',
		icon: 'bubble_chart',
		auth: [],
		children: [
			{
				id: 'maestros-avios',
				title: 'Maestro de Avios',
				type: 'collapse',
				icon: 'architecture',
				auth: [],
				children: [
					{
						id: MODULOS.familiasAvios,
						title: modulosDiccionario.maestrosAvios[0].titulo,
						type: 'item',
						icon: 'architecture',
						url: rutasDiccionario.familiasAvios[0],
					},
					{
						id: MODULOS.avios,
						title: modulosDiccionario.maestrosAvios[1].titulo,
						type: 'item',
						icon: 'architecture',
						url: rutasDiccionario.avios[0],
					},
				],
			},
			{
				id: 'maestros-telas',
				title: 'Maestro de Telas',
				type: 'collapse',
				icon: 'texture',
				auth: [],
				children: [
					{
						id: MODULOS.familiasTela,
						title: modulosDiccionario.maestrosTelas[1].titulo,
						type: 'item',
						icon: 'texture',
						url: rutasDiccionario.familiasTela[0],
					},
					{
						id: MODULOS.subFamilias,
						title: modulosDiccionario.maestrosTelas[4].titulo,
						type: 'item',
						icon: 'group_work',
						url: rutasDiccionario.subFamilias[0],
					},
					{
						id: MODULOS.telas,
						title: modulosDiccionario.maestrosTelas[3].titulo,
						type: 'item',
						icon: 'texture',
						url: rutasDiccionario.telas[0],
					},
					{
						id: MODULOS.titulaciones,
						title: modulosDiccionario.maestrosTelas[7].titulo,
						type: 'item',
						icon: 'list_alt',
						url: rutasDiccionario.titulaciones[0],
					},
					{
						id: MODULOS.colores,
						title: modulosDiccionario.maestrosTelas[5].titulo,
						type: 'item',
						icon: 'color_lens',
						url: rutasDiccionario.colores[0],
					},
				],
			},
			{
				id: 'maestros-prendas',
				title: 'Maestro de Prendas',
				type: 'collapse',
				icon: 'checkroom',
				auth: [],
				children: [
					{
						id: MODULOS.familiasPrenda,
						title: modulosDiccionario.maestrosTelas[0].titulo,
						type: 'item',
						icon: 'checkroom',
						url: rutasDiccionario.familiasPrenda[0],
					},

					{
						id: MODULOS.prendas,
						title: modulosDiccionario.maestrosTelas[2].titulo,
						type: 'item',
						icon: 'checkroom',
						url: rutasDiccionario.prendas[0],
					},
				],
			},
			{
				id: MODULOS.tallas,
				title: modulosDiccionario.maestrosTelas[6].titulo,
				type: 'item',
				icon: 'format_size',
				url: rutasDiccionario.tallas[0],
			},
			{
				id: MODULOS.lavados,
				title: modulosDiccionario.maestrosTelas[8].titulo,
				type: 'item',
				// icon: 'format_size',
				icon: 'local_laundry_service',
				url: rutasDiccionario.lavados[0],
			},
		],
	},

	{
		id: 'almacen',
		title: 'Almacen',
		translate: 'Almacen',
		type: 'group',
		auth: [],
		icon: 'business',
		children: [
			{
				id: MODULOS.almacenTelas,
				title: modulosDiccionario.almacen[0].titulo,
				type: 'item',
				icon: 'texture',
				url: rutasDiccionario.almacenTelas[0],
			},
			{
				id: MODULOS.almacenAvios,
				title: modulosDiccionario.almacen[1].titulo,
				type: 'item',
				icon: 'architecture',
				url: rutasDiccionario.almacenAvios[0],
			},
			{
				id: MODULOS.guias,
				title: modulosDiccionario.almacen[2].titulo,
				type: 'item',
				icon: 'receipt',
				url: rutasDiccionario.guias[0],
			},
		],
	},

	{
		id: 'calidad',
		title: 'Control de Calidad',
		type: 'group',
		icon: 'verified',
		auth: [],
		children: [
			{
				id: MODULOS.ctextil,
				title: modulosDiccionario.calidad[0].titulo,
				type: 'item',
				icon: 'texture',
				url: rutasDiccionario.ctextil[0],
			},

			{
				id: MODULOS.cmanufactura,
				title: modulosDiccionario.calidad[1].titulo,
				type: 'item',
				icon: 'checkroom',
				url: rutasDiccionario.cmanufactura[0],
				produccion,
			},

			{
				id: MODULOS.clasificacionTela,
				title: modulosDiccionario.calidad[2].titulo,
				type: 'item',
				icon: 'settings',
				url: rutasDiccionario.clasificacionTela[0],
			},
		],
	},

	{
		id: 'comercial',
		title: 'Comercial',
		translate: 'Comercial',
		type: 'group',
		icon: 'storefront',
		auth: [],
		children: [
			{
				id: MODULOS.proveedores,
				title: modulosDiccionario.comercial[0].titulo,
				type: 'item',
				icon: 'contacts',
				url: rutasDiccionario.proveedores[0],
			},

			{
				id: MODULOS.clientes,
				title: modulosDiccionario.comercial[1].titulo,
				type: 'item',
				icon: 'people',
				url: rutasDiccionario.clientes[0],
			},
			{
				id: MODULOS.rutas,
				title: modulosDiccionario.comercial[2].titulo,
				type: 'item',
				icon: 'swap_calls',
				url: rutasDiccionario.rutas[0],
				produccion,
			},
			{
				id: MODULOS.estilos,
				title: modulosDiccionario.comercial[3].titulo,
				type: 'item',
				icon: 'content_cut',
				url: rutasDiccionario.estilos[0],
			},

			{
				id: MODULOS.pedidos,
				title: modulosDiccionario.comercial[4].titulo,
				type: 'item',
				icon: 'receipt_long',
				url: rutasDiccionario.pedidos[0],
			},

			{
				id: MODULOS.producciones,
				title: modulosDiccionario.comercial[5].titulo,
				type: 'item',
				icon: 'pending_actions',
				url: rutasDiccionario.producciones[0],
			},

			{
				id: MODULOS.muestras,
				title: modulosDiccionario.comercial[6].titulo,
				type: 'item',
				icon: 'pending_actions',
				url: rutasDiccionario.muestras[0],
			},

			{
				id: MODULOS.muestrasTelasLibres,
				title: modulosDiccionario.comercial[9].titulo,
				type: 'item',
				icon: 'pending_actions',
				url: rutasDiccionario.muestrasTelasLibres[0],
			},

			{
				id: MODULOS.muestrasPrendasLibres,
				title: modulosDiccionario.comercial[10].titulo,
				type: 'item',
				icon: 'pending_actions',
				url: rutasDiccionario.muestrasPrendasLibres[0],
			},

			{
				id: MODULOS.ordenCompraTelas,
				title: modulosDiccionario.comercial[7].titulo,
				type: 'item',
				icon: 'texture',
				url: rutasDiccionario.ordenCompraTelas[0],
			},

			{
				id: MODULOS.ordenCompraAvios,
				title: modulosDiccionario.comercial[8].titulo,
				type: 'item',
				icon: 'architecture',
				url: rutasDiccionario.ordenCompraAvios[0],
			},
			{
				id: MODULOS.desarrollosColoresTela,
				title: modulosDiccionario.comercial[11].titulo,
				type: 'item',
				icon: 'architecture',
				url: rutasDiccionario.desarrollosColoresTela[0],
			},
			{
				id: MODULOS.desarrollosColoresHilo,
				title: modulosDiccionario.comercial[12].titulo,
				type: 'item',
				icon: 'architecture',
				url: rutasDiccionario.desarrollosColoresHilo[0],
			},
		],
	},

	{
		id: 'cotizacion',
		title: 'Cotizacion',
		type: 'group',
		icon: 'monetization_on',
		auth: [],
		children: [
			{
				id: 'cotizacion-costos',
				title: 'Costos',
				type: 'collapse',
				icon: 'receipt-tax',
				auth: [],
				children: [
					{
						id: MODULOS.costos,
						title: modulosDiccionario.cotizacion[0].titulo,
						type: 'item',
						icon: 'alt_route',
						url: rutasDiccionario.costos[0],
					},
					{
						id: MODULOS.costosAvios,
						title: modulosDiccionario.cotizacion[1].titulo,
						type: 'item',
						icon: 'architecture',
						url: rutasDiccionario.costosAvios[0],
					},
				],
			},
		],
	},

	{
		id: 'consumos',
		title: 'Consumos y Modelaje',
		type: 'group',
		icon: 'content_cut',
		auth: [],
		children: [
			{
				id: MODULOS.ocorte,
				title: modulosDiccionario.consumos[0].titulo,
				type: 'item',
				icon: 'content_cut',
				url: rutasDiccionario.ocorte[0],
			},
		],
	},

	{
		id: 'logistica',
		title: 'Logistica',
		type: 'group',
		icon: 'assignment',
		auth: [],
		children: [
			{
				id: 'ordenes-servicio',
				title: 'Órdenes de Servicio',
				type: 'collapse',
				icon: 'file_copy',
				auth: [],
				children: [
					{
						id: MODULOS.ordenServicioGeneral,
						title: modulosDiccionario.logistica[4].titulo,
						type: 'item',
						icon: 'assignment',
						url: rutasDiccionario.ordenServicioGeneral[0],
					},
					{
						id: MODULOS.oscorte,
						title: modulosDiccionario.logistica[0].titulo,
						type: 'item',
						icon: 'content_cut',
						url: rutasDiccionario.oscorte[0],
					},
				],
			},
			{
				id: MODULOS.controlFactura,
				title: modulosDiccionario.logistica[1].titulo,
				type: 'item',
				icon: 'receipt_long',
				url: rutasDiccionario.controlFactura[0],
			},
			{
				id: MODULOS.guiaRemision,
				title: modulosDiccionario.logistica[2].titulo,
				type: 'item',
				icon: 'receipt_long',
				url: rutasDiccionario.guiaRemision[0],
			},
			{
				id: MODULOS.vehiculo,
				title: modulosDiccionario.logistica[3].titulo,
				type: 'item',
				icon: 'local_shipping',
				url: rutasDiccionario.vehiculo[0],
			},
		],
	},

	{
		id: 'reporte',
		title: 'Reporte',
		type: 'group',
		icon: 'desktop_windows',
		auth: [],
		children: [
			{
				id: MODULOS.estadoOp,
				title: modulosDiccionario.reporte[0].titulo,
				type: 'item',
				icon: 'pending_actions',
				url: rutasDiccionario.estadoOp[0],
			},
		],
	},

	{
		id: 'usuarios',
		title: 'Usuarios',
		type: 'group',
		icon: 'account_circle',
		auth: [],
		children: [
			{
				id: MODULOS.usuarios,
				title: modulosDiccionario.usuarios[0].titulo,
				type: 'item',
				icon: 'account_circle',
				url: rutasDiccionario.usuarios[0],
			},
			{
				id: MODULOS.roles,
				title: modulosDiccionario.usuarios[1].titulo,
				type: 'item',
				icon: 'accessibility',
				url: rutasDiccionario.roles[0],
			},
			{
				id: MODULOS.notificaciones,
				title: modulosDiccionario.usuarios[2].titulo,
				type: 'item',
				icon: 'notifications',
				url: rutasDiccionario.notificaciones[0],
			},
		],
	},

	{
		id: 'configuracion',
		title: 'Configuracion',
		translate: 'Configuracion',
		type: 'group',
		auth: [],
		icon: 'settings',
		children: [
			// {
			// 	id: 'almacenes',
			// 	title: modulosDiccionario.configuracion[0].titulo,
			// 	type: 'item',
			// 	icon: 'business',
			// 	url: rutasDiccionario.almacenes[0],
			// },
			{
				id: MODULOS.unidades,
				title: modulosDiccionario.configuracion[1].titulo,
				type: 'item',
				icon: 'speed',
				url: rutasDiccionario.unidades[0],
			},
			{
				id: MODULOS.metodosPago,
				title: modulosDiccionario.configuracion[2].titulo,
				type: 'item',
				icon: 'payment',
				url: rutasDiccionario.metodosPago[0],
			},
			{
				id: MODULOS.ubicacionEstampados,
				title: modulosDiccionario.configuracion[3].titulo,
				type: 'item',
				icon: 'settings',
				url: rutasDiccionario.ubicacionEstampados[0],
			},
			{
				id: MODULOS.ubicacionBordados,
				title: modulosDiccionario.configuracion[4].titulo,
				type: 'item',
				icon: 'settings',
				url: rutasDiccionario.ubicacionBordados[0],
			},
		],
	},
];

export default navigationConfig;

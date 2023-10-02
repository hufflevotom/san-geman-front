import { MODULOS } from 'constants/constantes';

/**
 * Authorization Roles
 */
const authRoles = {
	admin: ['admin'],
	staff: ['admin', 'staff'],
	user: ['admin', 'staff', 'user'],
	onlyGuest: [],
};

export const rutasDiccionario = {
	// INICIO
	inicio: ['/inicio'],
	// MAESTROS DE TELAS
	familiasPrenda: ['/maestros/familias-prendas', '/maestros/familias-prendas/:id'],
	familiasTela: ['/maestros/familias-telas', '/maestros/familias-telas/:id'],
	prendas: ['/maestros/prendas', '/maestros/prendas/:id'],
	telas: ['/maestros/telas', '/maestros/telas/:id'],
	titulaciones: ['/maestros/titulaciones', '/maestros/titulaciones/:id'],
	colores: ['/maestros/colores', '/maestros/colores/:id'],
	subFamilias: ['/maestros/subfamilias', '/maestros/subfamilias/:id'],
	tallas: ['/maestros/tallas', '/maestros/tallas/:id'],
	lavados: ['/maestros/lavados', '/maestros/lavados/:id'],
	// MAESTROS DE AVIOS
	familiasAvios: ['/maestros/familias-avios', '/maestros/familias-avios/:id'],
	avios: ['/maestros/avios', '/maestros/avios/:id'],
	// COMERCIAL
	clientes: ['/comercial/clientes', '/comercial/clientes/:id'],
	proveedores: ['/comercial/proveedores', '/comercial/proveedores/:id'],
	estilos: ['/comercial/estilos', '/comercial/estilos/:id'],
	rutas: ['/comercial/rutas', '/comercial/rutas/:id'],
	pedidos: ['/comercial/pedidos', '/comercial/pedidos/:id'],
	producciones: ['/comercial/producciones', '/comercial/producciones/:id'],
	muestras: ['/comercial/muestras', '/comercial/muestras/:id'],
	muestrasTelasLibres: ['/comercial/muestrasTelasLibres', '/comercial/muestrasTelasLibres/:id'],
	muestrasPrendasLibres: [
		'/comercial/muestrasPrendasLibres',
		'/comercial/muestrasPrendasLibres/:id',
	],
	ordenCompraTelas: ['/comercial/orden-compra-telas', '/comercial/orden-compra-telas/:id'],
	ordenCompraAvios: ['/comercial/orden-compra-avios', '/comercial/orden-compra-avios/:id'],
	// USUARIOS
	usuarios: ['/usuarios', '/usuarios/:id'],
	roles: ['/roles', '/roles/:id'],
	notificaciones: ['/notificaciones', '/notificaciones/:id'],
	// CONFIGURACIONES
	almacenes: ['/configuracion/almacenes', '/configuracion/almacenes/:id'],
	unidades: ['/configuracion/unidades', '/configuracion/unidades/:id'],
	metodosPago: ['/configuracion/metodos-pago', '/configuracion/metodos-pago/:id'],
	ubicacionEstampados: ['/configuracion/ubicacion-estampados', '/configuracion/ubicacion-estampados/:id'],
	// ALMACEN
	almacenTelas: ['/almacen/telas', '/almacen/telas/:tipo', '/almacen/telas/:tipo/:id'],
	almacenAvios: ['/almacen/avios', '/almacen/avios/:tipo', '/almacen/avios/:tipo/:id'],
	guias: ['/almacen/guias', '/almacen/guias/:tipo', '/almacen/guias/:tipo/:id'],
	// CALIDAD
	ctextil: ['/calidad/textil', '/calidad/textil/:id'],
	cmanufactura: ['/calidad/manufactura', '/calidad/manufactura/:id'],
	clasificacionTela: ['/calidad/clasificacion'],
	// CONSUMOS Y MODELAJE
	ocorte: ['/consumos-modelaje/ordenes-corte', '/consumos-modelaje/ordenes-corte/:id'],
	// LOGISTICA
	oscorte: ['/logistica/ordenes-servicio-corte', '/logistica/ordenes-servicio-corte/:id'],
	controlFactura: ['/logistica/control-factura', '/logistica/control-factura/:id'],
	guiaRemision: ['/logistica/guia-remision', '/logistica/guia-remision/:id'],
	vehiculo: ['/logistica/vehiculo', '/logistica/vehiculo/:id'],
	// REPORTE
	estadoOp: ['/reporte/estados-op', '/reporte/estados-op/:id/:tipo'],
	// COTIZACION
	costos: ['/cotizacion/costos'],
	costosAvios: ['/cotizacion/costos-avios'],
};

export const modulosDiccionario = {
	maestrosTelas: [
		{ modulo: MODULOS.familiasPrenda, titulo: 'Familia de Prendas' },
		{ modulo: MODULOS.familiasTela, titulo: 'Familia de Telas' },
		{ modulo: MODULOS.prendas, titulo: 'Lista de Prendas' },
		{ modulo: MODULOS.telas, titulo: 'Lista de Telas' },
		{ modulo: MODULOS.subFamilias, titulo: 'SubFamilia de Telas' },
		{ modulo: MODULOS.colores, titulo: 'Lista de Colores' },
		{ modulo: MODULOS.tallas, titulo: 'Lista de Tallas' },
		{ modulo: MODULOS.titulaciones, titulo: 'Titulaciones' },
		{ modulo: MODULOS.lavados, titulo: 'Lavados' },
	],
	maestrosAvios: [
		{ modulo: MODULOS.familiasAvios, titulo: 'Familia de Avíos' },
		{ modulo: MODULOS.avios, titulo: 'Lista de Avíos' },
	],
	comercial: [
		{ modulo: MODULOS.proveedores, titulo: 'Proveedores' },
		{ modulo: MODULOS.clientes, titulo: 'Clientes' },
		{ modulo: MODULOS.rutas, titulo: 'Rutas' },
		{ modulo: MODULOS.estilos, titulo: 'Estilos' },
		{ modulo: MODULOS.pedidos, titulo: 'Pedidos (PO)' },
		{ modulo: MODULOS.producciones, titulo: 'Órdenes de Producción (OP)' },
		{ modulo: MODULOS.muestras, titulo: 'Órdenes de Muestra (OM)' },
		{ modulo: MODULOS.ordenCompraTelas, titulo: 'Órdenes de Compra de Telas' },
		{ modulo: MODULOS.ordenCompraAvios, titulo: 'Órdenes de Compra de Avios' },
		{ modulo: MODULOS.muestrasTelasLibres, titulo: 'O.M. de Telas Libres (OMTL)' },
		{ modulo: MODULOS.muestrasPrendasLibres, titulo: 'O.M. de Prendas Libres (OMPL)' },
	],
	usuarios: [
		{ modulo: MODULOS.usuarios, titulo: 'Usuarios' },
		{ modulo: MODULOS.roles, titulo: 'Roles' },
		{ modulo: MODULOS.notificaciones, titulo: 'Notificaciones' },
	],
	configuracion: [
		{ modulo: MODULOS.almacenes, titulo: 'Almacenes' },
		{ modulo: MODULOS.unidades, titulo: 'Unidades de Medida' },
		{ modulo: MODULOS.metodosPago, titulo: 'Métodos de Pago' },
		{ modulo: MODULOS.ubicacionEstampados, titulo: 'Ubicación de estampados' },
	],
	almacen: [
		{ modulo: MODULOS.almacenTelas, titulo: 'Almacen de Telas' },
		{ modulo: MODULOS.almacenAvios, titulo: 'Almacen de Avios' },
		{ modulo: MODULOS.guias, titulo: 'Guías de Telas' },
	],
	calidad: [
		{ modulo: MODULOS.ctextil, titulo: 'Calidad Textil' },
		{ modulo: MODULOS.cmanufactura, titulo: 'Calidad de Manufactura' },
		{ modulo: MODULOS.clasificacionTela, titulo: 'Clasificación de Telas' },
	],
	consumos: [{ modulo: MODULOS.ocorte, titulo: 'Órden de Corte' }],
	logistica: [
		{ modulo: MODULOS.oscorte, titulo: 'Órden de Servicio de Corte' },
		{ modulo: MODULOS.controlFactura, titulo: 'Control de Facturas' },
		{ modulo: MODULOS.guiaRemision, titulo: 'Guías de Remisión' },
		{ modulo: MODULOS.vehiculo, titulo: 'Vehículos' },
	],
	reporte: [{ modulo: MODULOS.estadoOp, titulo: 'Estado OP' }],
	cotizacion: [
		{ modulo: MODULOS.costos, titulo: 'Rutas/Procesos' },
		{ modulo: MODULOS.costosAvios, titulo: 'Avíos' },
	],
	otrosPermisos: [
		{ modulo: MODULOS.anularIngresoAlmacenAvios, titulo: 'Anular Ingreso de Almacen de Avios' },
		{ modulo: MODULOS.anularIngresoAlmacenTelas, titulo: 'Anular Ingreso de Almacen de Telas' },
		{ modulo: MODULOS.anularSalidaAlmacenAvios, titulo: 'Anular Salida de Almacen de Avios' },
		{ modulo: MODULOS.anularSalidaAlmacenTelas, titulo: 'Anular Salida de Almacen de Telas' },
		{ modulo: MODULOS.encargadoMuestraTelaLibre, titulo: 'Encargado de Muestras de Telas Libres' },
		{
			modulo: MODULOS.encargadoMuestraPrendaLibre,
			titulo: 'Encargado de Muestras de Prendas Libres',
		},
		{ modulo: MODULOS.edicionEstilosAsignados, titulo: 'Edición de estilos asignados' },
		{ modulo: MODULOS.edicionColorKardex, titulo: 'Edición de color para un producto tela' },
		{ modulo: MODULOS.agregarAvioEstiloAsignado, titulo: 'Agregar avíos a una producción' },
		{ modulo: MODULOS.editarPedidoAsignado, titulo: 'Editar un pedido asignado' },
	],
};

export default authRoles;

export const offsetCombo = 0;
export const limitCombo = 20;

export const produccion = true;

export const procesosId = {
	cortePanos: 1,
	corteTizado: 2,
};

export const bloqueoFamiliaAvios = [
	1, //* HILO
	8, //* CAJA
	9, //* BOLSA
	13, //* SILICA
	7, //* STICKER
];

export const ACCIONES = Object.freeze({
	CREAR: Symbol('Crear'),
	EDITAR: Symbol('Editar'),
	VISUALIZAR: Symbol('Ver'),
	NUEVO: Symbol('Nueva Version'),
	EDITAR_ASIGNADOS: Symbol('Editar Asignados'),
});

export const MODULOS = Object.freeze({
	// * Modulos
	almacenAvios: 'almacenAvios',
	almacenes: 'almacenes',
	almacenTelas: 'almacenTelas',
	avios: 'avios',
	clasificacionTela: 'clasificacionTela',
	clientes: 'clientes',
	cmanufactura: 'cmanufactura',
	colores: 'colores',
	controlFactura: 'controlFactura',
	costos: 'costos',
	costosAvios: 'costosAvios',
	ctextil: 'ctextil',
	desarrollosColoresTela: 'desarrollosColoresTela',
	desarrollosColoresHilo: 'desarrollosColoresHilo',
	estadoOp: 'estadoOp',
	estilos: 'estilos',
	familiasAvios: 'familiasAvios',
	familiasPrenda: 'familiasPrenda',
	familiasTela: 'familiasTela',
	guias: 'guias',
	guiaRemision: 'guiaRemision',
	lavados: 'lavados',
	metodosPago: 'metodosPago',
	muestras: 'muestras',
	muestrasPrendasLibres: 'muestrasPrendasLibres',
	muestrasTelasLibres: 'muestrasTelasLibres',
	notificaciones: 'notificaciones',
	ocorte: 'ocorte',
	ordenCompraAvios: 'ordenCompraAvios',
	ordenCompraTelas: 'ordenCompraTelas',
	ordenServicioGeneral: 'ordenServicioGeneral',
	oscorte: 'oscorte',
	pedidos: 'pedidos',
	prendas: 'prendas',
	producciones: 'producciones',
	proveedores: 'proveedores',
	roles: 'roles',
	rutas: 'rutas',
	subFamilias: 'subFamilias',
	tallas: 'tallas',
	telas: 'telas',
	titulaciones: 'titulaciones',
	ubicacionBordados: 'ubicacionBordados',
	ubicacionEstampados: 'ubicacionEstampados',
	unidades: 'unidades',
	usuarios: 'usuarios',
	vehiculo: 'vehiculo',

	// * Permisos
	agregarAvioEstiloAsignado: 'agregarAvioEstiloAsignado',
	anularIngresoAlmacenAvios: 'anularIngresoAlmacenAvios',
	anularIngresoAlmacenTelas: 'anularIngresoAlmacenTelas',
	anularSalidaAlmacenAvios: 'anularSalidaAlmacenAvios',
	anularSalidaAlmacenTelas: 'anularSalidaAlmacenTelas',
	edicionColorKardex: 'edicionColorKardex',
	edicionEstilosAsignados: 'edicionEstilosAsignados',
	editarPedidoAsignado: 'editarPedidoAsignado',
	encargadoMuestraPrendaLibre: 'encargadoMuestraPrendaLibre',
	encargadoMuestraTelaLibre: 'encargadoMuestraTelaLibre',
});

export const DataEmpresa = {
	ruc: '20548370206',
	razon_social: 'CONFECCIONES SAN GERMAN S.A.C.',
	nombre_comercial: '-',
	ubigeo: '150137',
	departamento: 'LIMA',
	provincia: 'LIMA',
	distrito: 'SANTA ANITA',
	urbanizacion: 'LA PORTADA DE CERES',
	direccion:
		'MZA. B LOTE. 25 URB. LA PORTADA DE CERES (SEXTO PISO AL COSTADO DEL HOSTAL TAURO) LIMA - LIMA - SANTA ANITA',
};

export const motivosTraslado = [
	{ label: 'Venta', key: 'Venta con entrega a terceros' },
	{ label: 'Compra', key: 'Compra' },
	{
		label: 'Traslado entre establecimientos de la misma empresa',
		key: 'Traslado entre establecimientos de la misma empresa',
	},
	{ label: 'Consignación', key: 'Consignación' },
	{ label: 'Devolución', key: 'Devolución' },
	{ label: 'Recojo de bienes transformados', key: 'Recojo de bienes transformados' },
	{ label: 'Importación', key: 'Importación' },
	{ label: 'Exportación', key: 'Exportación' },
	{
		label: 'Venta sujeta a confirmación del comprador',
		key: 'Venta sujeta a confirmación del comprador',
	},
	{
		label: 'Traslado de bienes para transformación',
		key: 'Traslado de bienes para transformación',
	},
	{
		label: 'Traslado emisor itinerante de comprobantes de pago',
		key: 'Traslado emisor itinerante de comprobantes de pago',
	},
	{
		label: 'Otros (no especificados en los anteriores)',
		key: 'Otros (no especificados en los anteriores)',
	},
];

export const unidadesSunat = [
	{
		label: 'UNIDAD',
		key: 'NIU',
	},
	{
		label: 'KILOGRAMO',
		key: 'KGM',
	},
	{
		label: 'TONELADA',
		key: 'TNE',
	},
	{
		label: 'PAQUETE',
		key: 'PK',
	},
	{
		label: 'CAJA',
		key: 'BX',
	},
	{
		label: 'LITRO',
		key: 'LTR',
	},
	{
		label: 'CILINDRO',
		key: 'CY',
	},
	{
		label: 'METRO',
		key: 'MTR',
	},
	{
		label: 'BOLSA',
		key: 'BG',
	},
	{
		label: 'BALDE',
		key: 'BJ',
	},
	{
		label: 'JUEGO',
		key: 'SET',
	},
	{
		label: 'MILLARES',
		key: 'MIL',
	},
	{
		label: 'GALONES',
		key: 'GLL',
	},
	{
		label: 'PAR',
		key: 'PR',
	},
	{
		label: 'KIT',
		key: 'KT',
	},
	{
		label: 'METRO CUADRADO',
		key: 'MTK',
	},
	{
		label: 'METRO CUBICO',
		key: 'MTQ',
	},
	{
		label: 'TONELADAS',
		key: 'TNE',
	},
	{
		label: 'BOTELLAS',
		key: 'BO',
	},
	{
		label: 'CIENTO DE UNIDADES',
		key: 'CEN',
	},
	{
		label: 'DOCENA',
		key: 'DZN',
	},
	{
		label: 'LIBRAS',
		key: 'LBR',
	},
	{
		label: 'ROLLO',
		key: 'RO',
	},
];

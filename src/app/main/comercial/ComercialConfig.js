import ClientesConfig from './clientes/clientesConfig';
import EstilosConfig from './estilos/estilosConfig';
import MuestrasConfig from './muestras/muestrasConfig';
import MuestrasTelasLibresConfig from './muestrasTelasLibres/muestrasTelasLibresConfig';
import MuestrasPrendasLibresConfig from './muestrasPrendasLibres/muestrasPrendasLibresConfig';
import OrdenCompraAviosConfig from './ordenCompraAvios/ordenCompraAviosConfig';
import OrdenCompraTelasConfig from './ordenCompraTelas/ordenCompraTelasConfig';
import PedidosConfig from './pedidos/pedidosConfig';
import ProduccionesConfig from './producciones/produccionesConfig';
import ProveedoresConfig from './proveedores/proveedoresConfig';
import RutasConfig from './rutas/rutasConfig';
import DesarrolloColoresTelaConfig from './desarrollosColoresTela/desarrollosColoresTelaConfig';
import DesarrolloColoresHiloConfig from './desarrollosColoresHilo/desarrollosColoresHiloConfig';

const ComercialConfig = [
	ProveedoresConfig,
	ClientesConfig,
	EstilosConfig,
	OrdenCompraTelasConfig,
	PedidosConfig,
	ProduccionesConfig,
	MuestrasConfig,
	MuestrasTelasLibresConfig,
	MuestrasPrendasLibresConfig,
	RutasConfig,
	OrdenCompraAviosConfig,
	DesarrolloColoresTelaConfig,
	DesarrolloColoresHiloConfig,
];

export default ComercialConfig;

import { Navigate } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import Error404Page from 'app/main/404/Error404Page';
import MaestroConfig from 'app/main/maestros/MaestroConfig';
import ConfiguracionConfig from 'app/main/configuracion/ConfiguracionConfig';
import LoginConfig from 'app/main/login/LoginConfig';
import ComercialConfig from 'app/main/comercial/ComercialConfig';
import AlmacenConfig from 'app/main/almacen/AlmacenConfig';
import UserConfig from 'app/main/usuarios/UsuariosConfig';
import HomeConfig from 'app/main/home/HomeConfig';
import CalidadConfig from 'app/main/calidad/CalidadConfig';
import ConsumosConfig from 'app/main/consumos/ConsumosConfig';
import CotizacionConfig from 'app/main/cotizacion/CotizacionConfig';
import LogisticaConfig from 'app/main/logistica/LogisticaConfig';
import ReporteConfig from 'app/main/reporte/ReporteConfig';

const routeConfigs = [
	HomeConfig,
	...MaestroConfig,
	...AlmacenConfig,
	...CalidadConfig,
	...ComercialConfig,
	...ConfiguracionConfig,
	...ConsumosConfig,
	...CotizacionConfig,
	...UserConfig,
	...LogisticaConfig,
	...ReporteConfig,
	LoginConfig,
];

const routes = [
	// if you want to make whole app auth protected by default change defaultAuth for example:
	// ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
	// The individual route configs which has auth option won't be overridden.
	...FuseUtils.generateRoutesFromConfigs(routeConfigs),
	{
		path: '/',
		element: <Navigate to="inicio" />,
	},
	{
		path: 'loading',
		element: <FuseLoading />,
	},
	{
		path: '404',
		settings: {
			layout: {
				config: {
					navbar: {
						display: false,
					},
					toolbar: {
						display: false,
					},
					footer: {
						display: false,
					},
					leftSidePanel: {
						display: false,
					},
					rightSidePanel: {
						display: false,
					},
				},
			},
		},
		element: <Error404Page />,
	},
	{
		path: '*',
		settings: {
			layout: {
				config: {
					navbar: {
						display: false,
					},
					toolbar: {
						display: false,
					},
					footer: {
						display: false,
					},
					leftSidePanel: {
						display: false,
					},
					rightSidePanel: {
						display: false,
					},
				},
			},
		},
		element: <Error404Page />,
	},
];
export default routes;

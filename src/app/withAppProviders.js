// import createGenerateClassName from '@mui/styles/createGenerateClassName';
// import jssPreset from '@mui/styles/jssPreset';
// import { create } from 'jss';
// import jssExtend from 'jss-plugin-extend';
// import rtl from 'jss-rtl';
import Provider from 'react-redux/es/components/Provider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { StyledEngineProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import httpClient from 'utils/Api';
import AppContext from './AppContext';
import routes from './fuse-configs/routesConfig';
import store from './store';
import { rutasDiccionario } from './auth/authRoles';

const withAppProviders = Component => props => {
	const WrapperComponent = () => {
		const [data, setData] = useState(null);

		useEffect(() => {
			traerData();
		}, []);

		const traerData = async () => {
			try {
				const response = await httpClient.get('auth/roles?limit=1000&offset=0');
				setData(response.data.body[0]);
			} catch (error) {
				setData(123);
				console.log(error);
			}
		};

		const newRoutes = routes;

		if (data !== null && data !== 123) {
			data.forEach(rol => {
				// eslint-disable-next-line no-restricted-syntax
				for (const ruta of newRoutes) {
					if (rutasDiccionario.inicio.includes(ruta.path)) {
						if (ruta.auth) {
							ruta.auth = [...ruta.auth, rol.nombre];
						} else {
							ruta.auth = [rol.nombre];
						}
					}
				}

				const rutasModulo = rol.modulos.map(modulo => rutasDiccionario[modulo.nombre]);

				rutasModulo.forEach(rutaModulo => {
					// eslint-disable-next-line no-restricted-syntax
					for (const ruta of newRoutes) {
						if (rutaModulo?.includes(ruta.path)) {
							if (ruta.auth) {
								ruta.auth = [...ruta.auth, rol.nombre];
							} else {
								ruta.auth = [rol.nombre];
							}
						}
					}
				});
			});

			// eslint-disable-next-line no-restricted-syntax
			for (const ruta of newRoutes) {
				if (ruta.auth === null) {
					ruta.auth = ['norole'];
				}
			}
		}

		if (data === 123) {
			// eslint-disable-next-line no-restricted-syntax
			for (const ruta of newRoutes) {
				if (ruta.auth === null) {
					ruta.auth = ['norole'];
				}
			}
		}

		// console.log(newRoutes);

		return (
			<AppContext.Provider
				value={{
					routes: newRoutes,
				}}
			>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Provider store={store}>
						<StyledEngineProvider injectFirst>
							<Component {...props} />
						</StyledEngineProvider>
					</Provider>
				</LocalizationProvider>
			</AppContext.Provider>
		);
	};

	return WrapperComponent;
};

export default withAppProviders;

import BrowserRouter from '@fuse/core/BrowserRouter';
import FuseAuthorization from '@fuse/core/FuseAuthorization';
import FuseLayout from '@fuse/core/FuseLayout';
import FuseTheme from '@fuse/core/FuseTheme';
import { SnackbarProvider } from 'notistack';
import { useSelector, useDispatch } from 'react-redux';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { selectCurrLangDir } from 'app/store/i18nSlice';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import withAppProviders from './withAppProviders';
import { Auth } from './auth';
import { getRoles } from './auth/store/rolesSlice';

import {
	selectNavigationAll,
	selectNavigationItemById,
	setNavigation,
	updateNavigationItem,
} from './store/fuse/navigationSlice';
import store from './store';
import { rutasDiccionario } from './auth/authRoles';

// import axios from 'axios';
/**
 * Axios HTTP Request defaults
 */
// axios.defaults.baseURL = "";
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

const emotionCacheOptions = {
	rtl: {
		key: 'muirtl',
		stylisPlugins: [rtlPlugin],
		insertionPoint: document.getElementById('emotion-insertion-point'),
	},
	ltr: {
		key: 'muiltr',
		stylisPlugins: [],
		insertionPoint: document.getElementById('emotion-insertion-point'),
	},
};

const App = () => {
	const [data, setData] = useState(null);

	const langDirection = useSelector(selectCurrLangDir);

	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getRoles()).then(a => {
			setData(a);
			const dataNavegacion = selectNavigationAll(store.getState());

			const dataRoles = a.payload;

			const newNavigation = [];
			dataNavegacion.forEach(item => {
				if (!item.produccion) {
					const newChildren = [];
					item.children?.forEach(item2 => {
						if (!item2.produccion) {
							dataRoles[0].forEach(rol => {
								rol.modulos.forEach(modulo => {
									if (item2.id === modulo.nombre) {
										if (item2.auth) {
											item2 = { ...item2, auth: [...item2.auth, rol.nombre] };
										} else {
											item2 = { ...item2, auth: [rol.nombre] };
										}
									}
								});
							});
							if (item2.children?.length > 0) {
								const newChildren2 = [];
								item2.children.forEach(item3 => {
									if (!item3.produccion) {
										dataRoles[0].forEach(rol => {
											rol.modulos.forEach(modulo => {
												if (item3.id === modulo.nombre) {
													if (item3.auth) {
														item3 = { ...item3, auth: [...item3.auth, rol.nombre] };
													} else {
														item3 = { ...item3, auth: [rol.nombre] };
													}
												}
											});
										});
										if (!item3.auth) {
											item3 = { ...item3, auth: ['norole'] };
										}
										newChildren2.push(item3);
									}
								});
								item2 = { ...item2, children: newChildren2 };
							}
							if (!item2.auth) {
								item2 = { ...item2, auth: ['norole'] };
							}
							newChildren.push(item2);
						}
					});
					newNavigation.push({ ...item, children: newChildren });
				}
			});

			dispatch(setNavigation(newNavigation));
		});
	}, [dispatch]);

	return data ? (
		<CacheProvider value={createCache(emotionCacheOptions[langDirection])}>
			<Auth>
				<BrowserRouter>
					<FuseAuthorization>
						<FuseTheme>
							<SnackbarProvider
								maxSnack={5}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'right',
								}}
								classes={{
									containerRoot: 'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99',
								}}
							>
								<FuseLayout />
								<ToastContainer />
							</SnackbarProvider>
						</FuseTheme>
					</FuseAuthorization>
				</BrowserRouter>
			</Auth>
		</CacheProvider>
	) : (
		<div>Cargando...</div>
	);
};

export default withAppProviders(App)();

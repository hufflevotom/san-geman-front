/* eslint-disable no-nested-ternary */
import Hidden from '@mui/material/Hidden';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import Grid4x4Icon from '@mui/icons-material/Grid4x4';
import LogoutIcon from '@mui/icons-material/Logout';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { setGuiasSearchText } from '../store/guias/guias/guiasSlice';
import { setSalidasMixtasSearchText } from '../store/guias/salidasMixtas/salidasMixtasSlice';

function GuiasHeader(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();
	const searchText = useSelector(({ almacen }) =>
		routeParams.tipo === 'salidas' ? almacen.salidasMixtas.searchText : almacen.guias.searchText
	);
	const mainTheme = useSelector(selectMainTheme);

	return (
		<div className="flex flex-1 items-center justify-between p-4 sm:p-24">
			<div className="flex shrink items-center sm:w-256">
				<Hidden lgUp>
					<IconButton
						onClick={ev => {
							props.pageLayout.current.toggleLeftSidebar();
						}}
						aria-label="open left sidebar"
						size="large"
					>
						<Icon>menu</Icon>
					</IconButton>
				</Hidden>

				<div className="flex items-center">
					{routeParams.tipo === 'salidas' ? (
						<LogoutIcon fontSize="large" />
					) : (
						<Grid4x4Icon fontSize="large" />
					)}
					<Typography
						component={motion.span}
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.2 } }}
						delay={300}
						className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
					>
						{routeParams.tipo === 'salidas' ? 'Salidas de Telas' : 'Guías de Telas'}
					</Typography>
				</div>
			</div>

			<div className="flex flex-1 items-center justify-center px-12">
				<ThemeProvider theme={mainTheme}>
					<Paper
						component={motion.div}
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
						className="flex items-center w-full max-w-512 px-8 py-4 rounded-16 shadow"
					>
						<Icon color="action">search</Icon>

						<Input
							placeholder="Buscar"
							className="flex flex-1 mx-8"
							disableUnderline
							fullWidth
							value={searchText}
							inputProps={{
								'aria-label': 'Buscar',
							}}
							onChange={ev => {
								if (routeParams.tipo === 'salidas') {
									dispatch(setSalidasMixtasSearchText(ev));
								} else {
									dispatch(setGuiasSearchText(ev));
								}
							}}
						/>
					</Paper>
				</ThemeProvider>
			</div>
			{routeParams.tipo === 'guias' && (
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
				>
					<Button
						// component={Link}
						// to="/almacen/guias/guias/nuevo"
						className="whitespace-nowrap"
						variant="contained"
						color="secondary"
						onClick={() => props.setModalOpen(true)}
					>
						<span className="hidden sm:flex">Registrar Guía</span>
						<span className="flex sm:hidden">Nuevo</span>
					</Button>
				</motion.div>
			)}
		</div>
	);
}

export default GuiasHeader;

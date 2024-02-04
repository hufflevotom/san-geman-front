import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { setOrdenServicioGeneralesSearchText } from '../store/ordenServicioGeneral/ordenServicioGeneralesSlice';

function OrdenServicioGeneralesHeader(props) {
	const dispatch = useDispatch();
	const searchText = useSelector(({ logistica }) => logistica.ordenServicioGenerales.searchText);

	const mainTheme = useSelector(selectMainTheme);

	return (
		<div className="flex flex-1 w-full items-center justify-between">
			<div className="flex items-center">
				<AssignmentIcon fontSize="large" />
				<Typography
					component={motion.span}
					initial={{ x: -20 }}
					animate={{ x: 0, transition: { delay: 0.2 } }}
					delay={300}
					className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
				>
					Órdenes de Servicio General
				</Typography>
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
								dispatch(setOrdenServicioGeneralesSearchText(ev));
							}}
						/>
					</Paper>
				</ThemeProvider>
			</div>
			<motion.div
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
			>
				<Button
					component={Link}
					to="/logistica/ordenes-servicio-general/nuevo"
					className="whitespace-nowrap"
					variant="contained"
					color="secondary"
				>
					<span className="hidden sm:flex">Agregar orden de servicio general</span>
					<span className="flex sm:hidden">Nuevo</span>
				</Button>
			</motion.div>
		</div>
	);
}

export default OrdenServicioGeneralesHeader;

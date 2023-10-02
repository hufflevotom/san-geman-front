/* eslint-disable no-nested-ternary */
import Hidden from '@mui/material/Hidden';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import Grid4x4Icon from '@mui/icons-material/Grid4x4';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { utils, writeFile } from 'xlsx';
import { useParams, Link } from 'react-router-dom';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { setSalidasSearchText } from '../store/almacenTela/salidas/salidasTelasSlice';
import { setIngresosTelasSearchText } from '../store/almacenTela/ingresos/ingresosTelasSlice';
import { setKardexSearchText } from '../store/almacenAvio/kardex/kardexAviosSlice';
import { setReporteOpTelasSearchText } from '../store/almacenTela/reporteOp/reporteOpTelasSlice';

function AlmacenTelasHeader(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();
	const searchText = useSelector(({ almacen }) =>
		routeParams.tipo === 'ingreso'
			? almacen.ingresos.searchText
			: routeParams.tipo === 'salida'
			? almacen.salidas.searchText
			: routeParams.tipo === 'kardex'
			? almacen.kardex.searchText
			: almacen.reporteOp.searchText
	);
	const mainTheme = useSelector(selectMainTheme);

	const exportarExcel = () => {
		//* Crear un libro de trabajo de Excel
		const wb = utils.book_new();

		//* Obtener la tabla
		const tabla = document.getElementById('tabla-kardex');

		//* Crear una hoja de cálculo
		const ws = utils.table_to_sheet(tabla);

		//* Añadir la hoja de cálculo al libro de trabajo
		utils.book_append_sheet(wb, ws, 'Telas');

		//* Guardar el archivo
		writeFile(wb, 'Almacén de Telas.xlsx');
	};

	return (
		<div className="flex flex-1 items-center justify-between p-4 sm:p-24">
			<div className="flex shrink items-center sm:w-224">
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
					<Grid4x4Icon fontSize="large" />
					<Typography
						component={motion.span}
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.2 } }}
						delay={300}
						className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
					>
						Telas
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
								if (routeParams.tipo === 'ingreso') {
									dispatch(setIngresosTelasSearchText(ev));
								} else if (routeParams.tipo === 'salida') {
									dispatch(setSalidasSearchText(ev));
								} else if (routeParams.tipo === 'kardex') {
									dispatch(setKardexSearchText(ev));
								} else {
									dispatch(setReporteOpTelasSearchText(ev));
								}
							}}
						/>
					</Paper>
				</ThemeProvider>
			</div>
			{routeParams.tipo !== 'kardex' && routeParams.tipo !== 'reporteOp' && (
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
				>
					<Button
						component={Link}
						to={`/almacen/telas/${routeParams.tipo}/nuevo`}
						className="whitespace-nowrap"
						variant="contained"
						color="secondary"
					>
						<span className="hidden sm:flex">Registrar {routeParams.tipo}</span>
						<span className="flex sm:hidden">Nuevo</span>
					</Button>
				</motion.div>
			)}
			{routeParams.tipo === 'kardex' && (
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
				>
					<Button
						onClick={exportarExcel}
						variant="contained"
						color="success"
						style={{ color: 'white' }}
					>
						Exportar
					</Button>
				</motion.div>
			)}
		</div>
	);
}

export default AlmacenTelasHeader;

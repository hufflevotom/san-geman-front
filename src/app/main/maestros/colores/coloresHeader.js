import Button from '@mui/material/Button';
import { FormControlLabel, Switch } from '@mui/material';
import { useEffect, useState } from 'react';
import Icon from '@mui/material/Icon';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import {
	setColoresSearchText,
	resetTabla,
	getColoresTemporales,
	getColores,
} from '../store/color/colorsSlice';

function ColoresHeader(props) {
	const [checked, setChecked] = useState(false);

	const dispatch = useDispatch();
	const searchText = useSelector(({ maestros }) => maestros.colores.searchText);
	const mainTheme = useSelector(selectMainTheme);

	const obj = {
		limit: 10,
		offset: 0,
		busqueda: '',
		tipoBusqueda: 'nuevaBusqueda',
	};

	useEffect(() => {
		if (checked) {
			dispatch(resetTabla());
			dispatch(getColoresTemporales(obj));
		} else {
			dispatch(resetTabla());
			dispatch(getColores(obj));
		}
	}, [checked]);

	return (
		<div className="flex flex-1 w-full items-center justify-between">
			<div className="flex items-center">
				<ColorLensIcon fontSize="large" />
				<Typography
					component={motion.span}
					initial={{ x: -20 }}
					animate={{ x: 0, transition: { delay: 0.2 } }}
					delay={300}
					className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
				>
					Colores
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
								dispatch(setColoresSearchText(ev));
							}}
						/>
					</Paper>
				</ThemeProvider>
			</div>
			<motion.div
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
			>
				<FormControlLabel
					control={
						<Switch
							checked={checked}
							onChange={() => {
								setChecked(!checked);
							}}
							name="gilad"
						/>
					}
					label="Lista de Colores Temporales"
				/>
				<Button
					component={Link}
					to="/maestros/colores/nuevo"
					className="whitespace-nowrap"
					variant="contained"
					color="secondary"
				>
					<span className="hidden sm:flex">Agregar Color</span>
					<span className="flex sm:hidden">Nuevo</span>
				</Button>
			</motion.div>
		</div>
	);
}

export default ColoresHeader;

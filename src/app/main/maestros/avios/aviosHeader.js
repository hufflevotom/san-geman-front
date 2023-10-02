import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FormControlLabel, Switch, Button, Icon, Input, Paper, Typography } from '@mui/material';
import Grid4x4Icon from '@mui/icons-material/Grid4x4';
import { ThemeProvider } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { setAviosSearchText } from '../store/avios/aviosSlice';

function AviosHeader({ checked, setChecked }) {
	const dispatch = useDispatch();
	const searchText = useSelector(({ maestros }) => maestros.avios.searchText);

	const mainTheme = useSelector(selectMainTheme);

	return (
		<div className="flex flex-1 w-full items-center justify-between">
			<div className="flex items-center">
				{/* <Icon
					component={motion.span}
					initial={{ scale: 0 }}
					animate={{ scale: 1, transition: { delay: 0.2 } }}
					className="text-24 md:text-32"
				>
					business
				</Icon> */}
				<Grid4x4Icon fontSize="large" />
				<Typography
					component={motion.span}
					initial={{ x: -20 }}
					animate={{ x: 0, transition: { delay: 0.2 } }}
					delay={300}
					className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
				>
					Avios
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
								dispatch(setAviosSearchText(ev));
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
							name="hilos"
						/>
					}
					label="Hilos"
				/>
				<Button
					component={Link}
					to="/maestros/avios/nuevo?action=GT"
					className="whitespace-nowrap"
					variant="contained"
					color="secondary"
				>
					<span className="hidden sm:flex">Generar</span>
					<span className="flex sm:hidden">Multiple</span>
				</Button>
				<Button
					component={Link}
					to="/maestros/avios/nuevo"
					className="whitespace-nowrap"
					variant="contained"
					color="secondary"
					style={{ marginLeft: '10px' }}
				>
					<span className="hidden sm:flex">Agregar avios</span>
					<span className="flex sm:hidden">Nuevo</span>
				</Button>
			</motion.div>
		</div>
	);
}

export default AviosHeader;

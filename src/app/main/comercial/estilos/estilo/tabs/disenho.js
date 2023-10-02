import { Autocomplete, FormControlLabel, InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import debounce from 'lodash.debounce';
import Switch from '@mui/material/Switch';

import Grid from '@mui/material/Grid';

import httpClient from 'utils/Api';
import { ACCIONES, limitCombo, offsetCombo } from 'constants/constantes';
import { useSelector } from 'react-redux';
import { TelaComplementoForm } from './formularios/TelaComplemento';
import { EstampadoForm } from './formularios/Estampado';
import { BordadoForm } from './formularios/Bordado';
import { LavanderiaForm } from './formularios/Lavanderia';
import { ImagenesReferencialesForm } from './formularios/ImagenesReferenciales';

function Disenho({ disabled, accion }) {
	const [telaComplemento, setTelaComplemento] = useState(false);
	const [estampado, setEstampado] = useState(false);
	const [bordado, setBordado] = useState(false);
	const [lavanderia, setLavanderia] = useState(false);
	const [imagenReferencial, setImagenReferencial] = useState(false);

	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	const estilo = useSelector(({ comercial }) => comercial.estilo);

	const [dataColores, setDataColores] = useState([]);
	const [dataTelas, setDataTelas] = useState([]);

	const [coloresTemporal, setColoresTemporal] = useState(null);
	const [telasTemporal, setTelasTemporal] = useState(null);

	const [telasSearchText, setTelasSearchText] = useState('');
	const [coloresSearchText, setColoresSearchText] = useState('');

	useEffect(() => {
		if (estilo) {
			if (estilo.estampados?.length > 0) {
				setEstampado(true);
			} else {
				setEstampado(false);
			}

			if (estilo.bordados?.length > 0) {
				setBordado(true);
			} else {
				setBordado(false);
			}

			if (estilo.telasComplemento?.length > 0) {
				setTelaComplemento(true);
			} else {
				setTelaComplemento(false);
			}

			if (estilo.lavados?.length > 0) {
				setLavanderia(true);
			} else {
				setLavanderia(false);
			}

			if (estilo.imagenesReferenciales?.length > 0) {
				setImagenReferencial(true);
			} else {
				setImagenReferencial(false);
			}
		}
	}, [estilo]);

	useEffect(() => {
		traerColores();
		traerTelas();
	}, []);

	const traerColores = async busqueda => {
		let texto = '';
		if (busqueda) {
			texto = busqueda;
		}
		const url = `maestro/color?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${texto}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataColores(data);
	};

	const debouncedTraerColores = debounce(() => {
		traerColores(coloresSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerColores(); // Llamar a la versión debounced de fetchData
		return debouncedTraerColores.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [coloresSearchText]);

	const traerTelas = async busqueda => {
		let texto = '';
		if (busqueda) {
			texto = busqueda;
		}
		const url = `maestro/tela?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${texto}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataTelas(data);
	};

	const debouncedTraerTelas = debounce(() => {
		traerTelas(telasSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerTelas(); // Llamar a la versión debounced de fetchData
		return debouncedTraerTelas.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [telasSearchText]);

	const opcionesTelas = dataTelas.map(tela => ({
		...tela,
		label: `${tela.codigo} / ${tela.nombre}`,
	}));

	const opcionesColores = dataColores.map(color => {
		return {
			...color,
			label: `${color.descripcion}`,
		};
	});

	return (
		<>
			<div>
				<Controller
					name="telaPrincipal"
					control={control}
					render={({ field: { onChange, value } }) => {
						let telaPrincipal = null;
						let coloresPrincipal = [];
						let consumo = 0;

						if (value?.tela) {
							telaPrincipal = {
								...value.tela,
								label: `${value.tela.codigo} / ${value.tela.nombre}`,
							};
						}

						if (value?.colores) {
							coloresPrincipal = value.colores.map(color => ({
								...color,
								label: color.color ? `${color.color.descripcion}` : `${color.descripcion}`,
							}));
						}

						if (value?.consumo) {
							consumo = value.consumo;
						}

						return (
							<>
								<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
									<Autocomplete
										disabled={disabled || accion === ACCIONES.EDITAR_ASIGNADOS}
										key="tela"
										className="mt-8 mb-16 mx-12"
										isOptionEqualToValue={(op, val) => op.id === val.id}
										options={opcionesTelas || []}
										value={telasTemporal || telaPrincipal}
										fullWidth
										filterOptions={(options, state) => options}
										onInputChange={(event, newInputValue) => {
											setTelasSearchText(newInputValue);
											setTelasTemporal({ ...telaPrincipal, label: newInputValue });
										}}
										onChange={(event, newValue) => {
											if (newValue) {
												const { label, ...valor } = newValue;
												onChange({ ...value, tela: valor });
											} else {
												onChange({ ...value, tela: null });
											}
											setTelasTemporal(null);
										}}
										renderInput={params => (
											<TextField
												{...params}
												placeholder="Seleccione la tela"
												label="Tela"
												required
												fullWidth
												error={!!errors.telasEstilos}
												helperText={errors?.telasEstilos?.message}
												variant="outlined"
												InputLabelProps={{
													shrink: true,
												}}
											/>
										)}
									/>
									<Autocomplete
										key="colores"
										multiple
										freeSolo
										disabled={disabled || accion === ACCIONES.EDITAR_ASIGNADOS}
										className="mt-8 mb-16 mx-12"
										isOptionEqualToValue={(op, val) => op.id === val.id}
										options={opcionesColores || []}
										value={coloresPrincipal}
										fullWidth
										filterOptions={(options, state) => options}
										onInputChange={(event, newInputValue) => {
											setColoresSearchText(newInputValue);
											// setColoresTemporal({ ...coloresPrincipal, label: newInputValue });
										}}
										onChange={(event, newValue) => {
											if (value) {
												value.colores = newValue;
												onChange(value);
												setColoresTemporal(null);
											}
										}}
										renderInput={params => (
											<TextField
												{...params}
												placeholder="Seleccione los colores"
												label="Colores o Combinación"
												required
												fullWidth
												error={!!errors.telasEstilos}
												helperText={errors?.telasEstilos?.message}
												variant="outlined"
												InputLabelProps={{
													shrink: true,
												}}
											/>
										)}
									/>
									<TextField
										disabled={disabled || accion === ACCIONES.EDITAR_ASIGNADOS}
										placeholder="Consumo"
										className="mt-8 mb-16 mx-12"
										label="Consumo Teórico"
										variant="outlined"
										fullWidth
										type="number"
										value={consumo}
										InputProps={{
											endAdornment: <InputAdornment position="end">g</InputAdornment>,
											inputProps: { min: 0 },
										}}
										onChange={newValue => {
											value.consumo = parseFloat(newValue.target.value);
											onChange(value);
										}}
										error={!!errors.consumo}
										helperText={errors?.consumo?.message}
										InputLabelProps={{
											shrink: true,
										}}
									/>
								</div>
							</>
						);
					}}
				/>
			</div>
			<>
				{/* <Checkbox
								checked={telaComplemento}
								onChange={e => {
									setTelaComplemento(!telaComplemento);
								}}
								inputProps={{ 'aria-label': 'controlled' }}
							/> */}

				<div className="mx-6 mb-16 mt-16 text-base">Opcionales</div>
				<Grid container spacing={2} style={{ textAlign: 'center' }}>
					<Grid item xs={3}>
						<Controller
							name="banderaTelaComplemento"
							control={control}
							render={({ field: { onChange, value } }) => {
								return (
									<FormControlLabel
										disabled={disabled || accion === ACCIONES.EDITAR_ASIGNADOS}
										className="mt-8 mb-16 mx-12"
										control={
											<Switch
												color="info"
												checked={value}
												onChange={e => {
													onChange(e.target.checked);
													setTelaComplemento(e.target.checked);
												}}
												inputProps={{ 'aria-label': 'controlled' }}
											/>
										}
										label="Tela Complemento"
									/>
								);
							}}
						/>
					</Grid>
					<Grid item xs={2}>
						<Controller
							name="banderaEstampado"
							control={control}
							render={({ field: { onChange, value } }) => {
								return (
									<FormControlLabel
										disabled={disabled}
										className="mt-8 mb-16 mx-12"
										control={
											<Switch
												color="info"
												checked={value}
												onChange={e => {
													onChange(e.target.checked);
													setEstampado(e.target.checked);
												}}
												inputProps={{ 'aria-label': 'controlled' }}
											/>
										}
										label="Estampados"
									/>
								);
							}}
						/>
					</Grid>
					<Grid item xs={2}>
						<Controller
							name="banderaBordados"
							control={control}
							render={({ field: { onChange, value } }) => {
								return (
									<FormControlLabel
										disabled={disabled}
										className="mt-8 mb-16 mx-12"
										control={
											<Switch
												color="info"
												checked={value}
												onChange={e => {
													onChange(e.target.checked);
													setBordado(e.target.checked);
												}}
												inputProps={{ 'aria-label': 'controlled' }}
											/>
										}
										label="Bordados"
									/>
								);
							}}
						/>
					</Grid>
					<Grid item xs={3}>
						<Controller
							name="banderaLavanderia"
							control={control}
							render={({ field: { onChange, value } }) => {
								console.log('banderaLavanderia: ', value);

								return (
									<FormControlLabel
										disabled={disabled}
										className="mt-8 mb-16 mx-12"
										control={
											<Switch
												color="info"
												checked={value}
												onChange={e => {
													onChange(e.target.checked);
													setLavanderia(e.target.checked);
												}}
												inputProps={{ 'aria-label': 'controlled' }}
											/>
										}
										label="Lavanderia"
									/>
								);
							}}
						/>
					</Grid>
					<Grid item xs={2}>
						<Controller
							name="banderaImagenReferencial"
							control={control}
							render={({ field: { onChange, value } }) => {
								return (
									<FormControlLabel
										disabled={disabled}
										className="mt-8 mb-16 mx-12"
										control={
											<Switch
												color="info"
												checked={value}
												onChange={e => {
													onChange(e.target.checked);
													setImagenReferencial(e.target.checked);
												}}
												inputProps={{ 'aria-label': 'controlled' }}
											/>
										}
										label="Imágenes Referenciales"
									/>
								);
							}}
						/>
					</Grid>
				</Grid>
			</>
			<div className="flex flex-col sm:flex-col mr-24 sm:mr-4">
				<div
					style={{ display: !telaComplemento ? 'none' : 'flex' }}
					className="flex flex-col sm:flex-col mr-24 sm:mr-4 pr-16 sm:pr-24"
				>
					<TelaComplementoForm disabled={disabled || accion === ACCIONES.EDITAR_ASIGNADOS} />
				</div>
			</div>
			<br />
			<div className="flex flex-col sm:flex-col mr-24 sm:mr-4">
				<div
					style={{ display: !estampado ? 'none' : 'flex' }}
					className="flex flex-col sm:flex-col mr-24 sm:mr-4 pr-16 sm:pr-24"
				>
					<EstampadoForm disabled={disabled} />
				</div>
			</div>
			<br />
			<div className="flex flex-col sm:flex-col mr-24 sm:mr-4">
				<div
					style={{ display: !bordado ? 'none' : 'flex' }}
					className="flex flex-col sm:flex-col mr-24 sm:mr-4 pr-16 sm:pr-24"
				>
					<BordadoForm disabled={disabled} />
				</div>
			</div>
			<br />
			<div className="flex flex-col sm:flex-col mr-24 sm:mr-4 ">
				<div
					style={{ display: !lavanderia ? 'none' : 'flex' }}
					className="flex flex-col sm:flex-col mr-24 sm:mr-4 pr-16 sm:pr-24"
				>
					<LavanderiaForm disabled={disabled} />
				</div>
			</div>
			<br />
			<div className="flex flex-col sm:flex-col mr-24 sm:mr-4 ">
				<div
					style={{ display: !imagenReferencial ? 'none' : 'flex' }}
					className="flex flex-col sm:flex-col mr-24 sm:mr-4 pr-16 sm:pr-24"
				>
					<ImagenesReferencialesForm disabled={disabled} />
				</div>
			</div>
		</>
	);
}

export default Disenho;

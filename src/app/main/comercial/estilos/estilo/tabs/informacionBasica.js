import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';
import { orange } from '@mui/material/colors';
import debounce from 'lodash.debounce';
import { styled } from '@mui/material/styles';
import Icon from '@mui/material/Icon';
import { Autocomplete } from '@mui/material';
import { useEffect, useState } from 'react';
import { Worker } from '@react-pdf-viewer/core';
import httpClient, { baseUrl } from 'utils/Api';
import { ACCIONES, limitCombo, offsetCombo } from 'constants/constantes';
import Abc from './fichaTecnica';
import ClienteTab from './cliente';

function InformacionBasica({ subCodigo, tipo, disabled, accion }) {
	const methods = useFormContext();
	const { control, watch, setValue, getValues, formState } = methods;
	const { errors } = formState;

	const dependencia = watch('dependencia');

	const [dataPrendas, setDataPrendas] = useState([]);
	const [prendasSearchText, setPrendasSearchText] = useState('');
	const [prendaTemporal, setPrendaTemporal] = useState(null);

	useEffect(() => {
		traerListaPrendas();
	}, []);

	const traerListaPrendas = async busqueda => {
		let text = '';
		if (busqueda) {
			text = busqueda.trim();
		}

		const url = `maestro/prenda?limit=${limitCombo}&offset=${offsetCombo}&busqueda=${text}`;
		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setDataPrendas(data);
	};

	const debouncedTraerListaPrendas = debounce(() => {
		traerListaPrendas(prendasSearchText);
	}, 500);

	useEffect(() => {
		debouncedTraerListaPrendas(); // Llamar a la versión debounced de fetchData
		return debouncedTraerListaPrendas.cancel; // Cancelar la llamada si cambia el texto o se desmonta el componente
	}, [prendasSearchText]);

	const opcionesPrendas = dataPrendas.map(prenda => ({
		...prenda,
		label: `${prenda.codigo} - ${prenda.nombre}`,
	}));

	return (
		<>
			<Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
				<div className="flex flex-col sm:flex-row mr-24 sm:mr-4 " style={{ alignItems: 'center' }}>
					<Root>
						<div
							className="flex justify-center sm:justify-start flex-wrap mx-16"
							style={{ width: '120px', height: '120px' }}
						>
							<Controller
								name="imagenEstiloUrl"
								control={control}
								render={({ field: { onChange, value } }) => {
									return (
										<label
											style={{ width: '100%' }}
											htmlFor={1}
											className={`productImageUpload flex items-center justify-center relative w-100 h-100 rounded-16 mx-12 overflow-hidden ${
												accion !== ACCIONES.VISUALIZAR && 'cursor-pointer hover:shadow-lg'
											} shadow`}
										>
											<input
												disabled={accion === ACCIONES.VISUALIZAR}
												accept="image/*"
												className="hidden"
												id={1}
												type="file"
												onChange={e => {
													if (accion === ACCIONES.VISUALIZAR) return;
													if (e) {
														const data = e.target.files[0];
														const obj = {
															file: data,
														};
														onChange(obj);
													} else {
														onChange(null);
													}
												}}
											/>

											{value ? (
												<div style={{ width: '100%' }}>
													{value.file ? (
														<img
															className="w-full block rounded"
															src={URL.createObjectURL(value.file)}
															alt={value.file}
														/>
													) : (
														<img
															className="w-full block rounded"
															src={baseUrl + value}
															alt={value}
														/>
													)}
												</div>
											) : (
												<div style={{ width: '100%', textAlign: 'center' }}>
													<Icon fontSize="large" color="action">
														cloud_upload
													</Icon>
												</div>
											)}
										</label>
									);
								}}
							/>
						</div>
					</Root>

					<Controller
						name="estilo"
						control={control}
						render={({ field }) => {
							const val = field.value;
							return (
								<TextField
									{...field}
									value={subCodigo ? `${dependencia}-${subCodigo}` : val}
									disabled={disabled}
									className="mt-8 mb-16 mx-12"
									error={!!errors.estilo}
									required
									helperText={errors?.estilo?.message}
									label="Estilo"
									autoFocus
									id="estilo"
									variant="outlined"
									fullWidth
								/>
							);
						}}
					/>

					<Controller
						name="prenda"
						control={control}
						render={({ field: { onChange, value } }) => {
							const prendas = value
								? {
										...value,
										label: `${value.codigo} - ${value.nombre}`,
								  }
								: null;

							return (
								<Autocomplete
									disabled={disabled}
									className="mt-8 mb-16 mx-12"
									isOptionEqualToValue={(op, val) => op.id === val.id}
									fullWidth
									options={opcionesPrendas || []}
									value={prendaTemporal || prendas}
									filterOptions={(options, state) => {
										return options;
									}}
									onInputChange={(event, newInputValue) => {
										setPrendasSearchText(newInputValue);
										setPrendaTemporal({ ...prendas, label: newInputValue });
									}}
									onChange={(event, newValue) => {
										if (newValue) {
											const { label, ...valor } = newValue;
											onChange(valor);
											setPrendaTemporal(null);
										} else {
											onChange(null);
										}
									}}
									renderInput={params => (
										<TextField
											{...params}
											placeholder="Seleccione el tipo de prenda"
											label="Tipo de Prenda"
											required
											error={!!errors.prenda}
											helperText={errors?.prenda?.message}
											variant="outlined"
											InputLabelProps={{
												shrink: true,
											}}
										/>
									)}
								/>
							);
						}}
					/>

					<Controller
						name="nombre"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								disabled={disabled}
								className="mt-8 mb-16 mx-12"
								error={!!errors.nombre}
								required
								helperText={errors?.nombre?.message}
								label="Nombre del Estilo"
								autoFocus
								id="nombre"
								variant="outlined"
								fullWidth
							/>
						)}
					/>
				</div>
				<ClienteTab disabled={disabled} />
				<br />
				<div className="flex flex-col sm:flex-col mr-24 sm:mr-4 ml-16 ">
					<Controller
						name="fichaTecnicaUrl"
						control={control}
						render={({ field: { onChange, value } }) => {
							let url = '';
							if (value?.file) {
								url = URL.createObjectURL(value.file);
							} else {
								url = baseUrl + value;
							}
							return (
								<>
									<label
										style={{ marginBottom: 20 }}
										htmlFor="button-file"
										className={`w-full h-fit py-14 flex items-center justify-center rounded-8 overflow-hidden ${
											accion !== ACCIONES.VISUALIZAR && 'cursor-pointer hover:shadow-md'
										} shadow `}
									>
										<input
											disabled={accion === ACCIONES.VISUALIZAR}
											accept=".pdf"
											className="hidden"
											id="button-file"
											type="file"
											onChange={async e => {
												if (accion === ACCIONES.VISUALIZAR) return;
												const data = e.target.files[0];
												if (data) {
													const obj = {
														file: data,
													};
													onChange(obj);
												} else {
													onChange(null);
												}
											}}
										/>
										<div
											style={{
												display: 'flex',
												flexDirection: 'row',
												gap: '20px',
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<Icon fontSize="large" color="action">
												cloud_upload
											</Icon>
											Ficha Técnica
										</div>
									</label>
									{value ? <Abc url={url} /> : null}
								</>
							);
						}}
					/>
				</div>
			</Worker>
		</>
	);
}

const Root = styled('div')(({ theme }) => ({
	'& .productImageFeaturedStar': {
		position: 'absolute',
		top: 0,
		right: 0,
		color: orange[400],
		opacity: 0,
	},

	'& .productImageUpload': {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
	},

	'& .productImageItem': {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		'&:hover': {
			'& .productImageFeaturedStar': {
				opacity: 0.8,
			},
		},
		'&.featured': {
			pointerEvents: 'none',
			boxShadow: theme.shadows[3],
			'& .productImageFeaturedStar': {
				opacity: 1,
			},
			'&:hover .productImageFeaturedStar': {
				opacity: 1,
			},
		},
	},
}));

export default InformacionBasica;

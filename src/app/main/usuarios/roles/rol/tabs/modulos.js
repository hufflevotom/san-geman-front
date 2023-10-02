import { Autocomplete, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';

import { modulosDiccionario } from 'app/auth/authRoles';
import { useEffect, useState } from 'react';
import httpClient from 'utils/Api';
import { offsetCombo } from 'constants/constantes';

function ModulosTab(props) {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	const [modulosExistentes, setModulosExistentes] = useState([]);
	useEffect(() => {
		traerModulos();
	}, []);

	const traerModulos = async () => {
		const url = `modulos?limit=${100}&offset=${offsetCombo}`;

		const response = await httpClient.get(url);
		const data = await response.data.body[0];
		setModulosExistentes(data);
	};

	const opciones = {};

	// eslint-disable-next-line no-restricted-syntax
	for (const key in modulosDiccionario) {
		if (Object.hasOwnProperty.call(modulosDiccionario, key)) {
			const moduloDic = modulosDiccionario[key];
			const opcion = moduloDic.filter(element => {
				return modulosExistentes.find(element2 => element2.nombre === element.modulo);
			});

			const abc = [];
			opcion.forEach(element => {
				const modulo = modulosExistentes.find(element3 => element3.nombre === element.modulo);
				const op = { ...modulo, label: element.titulo, id: modulo.id };
				abc.push(op);
			});
			opciones[key] = abc;
		}
	}

	return (
		<Grid container spacing={2}>
			<Controller
				name="modulos"
				control={control}
				render={({ field: { onChange, value } }) => {
					const opcAPI = {};

					if (value) {
						// eslint-disable-next-line no-restricted-syntax
						for (const key in modulosDiccionario) {
							if (Object.hasOwnProperty.call(modulosDiccionario, key)) {
								const moduloDic = modulosDiccionario[key];
								const opcion = moduloDic.filter(element => {
									return value.find(element2 => element2.nombre === element.modulo);
								});

								const abc = [];
								opcion.forEach(element => {
									const modulo = value.find(element3 => element3.nombre === element.modulo);
									const op = { ...modulo, label: element.titulo, id: modulo.id };
									abc.push(op);
								});
								opcAPI[key] = abc;
							}
						}
					}

					const GrupoModulos = [];

					// eslint-disable-next-line no-restricted-syntax
					for (const key in opciones) {
						if (Object.hasOwnProperty.call(opciones, key)) {
							const element = opciones[key];
							const ddd = (
								<Grid item xs={12} md={6} lg={4}>
									<Autocomplete
										key={key}
										className="mt-8 mb-16 mx-12"
										multiple
										freeSolo
										isOptionEqualToValue={(op, val) => op.id === val.id}
										options={element}
										disableCloseOnSelect
										value={opcAPI[key]}
										fullWidth
										onChange={(event, newValue) => {
											if (newValue) {
												opcAPI[key] = newValue;
												const xxx = [];
												// eslint-disable-next-line no-restricted-syntax
												for (const keyOpc in opcAPI) {
													if (Object.hasOwnProperty.call(opcAPI, keyOpc)) {
														const elementOpc = opcAPI[keyOpc];
														xxx.push(...elementOpc);
													}
												}

												onChange(xxx);
											} else {
												onChange(null);
											}
										}}
										renderInput={params => (
											<TextField
												{...params}
												placeholder="Seleccione"
												label={key.toUpperCase()}
												error={!!errors.proveedor}
												helperText={errors?.proveedor?.message}
												variant="outlined"
												fullWidth
												InputLabelProps={{
													shrink: true,
												}}
											/>
										)}
									/>
								</Grid>
							);
							GrupoModulos.push(ddd);
						}
					}

					return GrupoModulos;
				}}
			/>
		</Grid>
	);
}

export default ModulosTab;

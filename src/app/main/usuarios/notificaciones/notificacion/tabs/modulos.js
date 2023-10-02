/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';

import { useEffect, useState } from 'react';
import httpClient from 'utils/Api';
import { limitCombo, offsetCombo } from 'constants/constantes';
import { useSelector } from 'react-redux';

function ModulosTab(props) {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;
	const modulosExistentes = useSelector(({ usuarios }) => usuarios.notificacion.notificaciones);

	const notificacionesTotal = useSelector(({ usuarios }) => usuarios.notificaciones.entities);
	const notificaciones = {};
	if (notificacionesTotal) {
		for (const key in notificacionesTotal) {
			const notificacion = notificacionesTotal[key];
			if (Array.isArray(notificaciones[notificacion.grupo])) {
				notificaciones[notificacion.grupo].push(notificacion);
			} else {
				notificaciones[notificacion.grupo] = [notificacion];
			}
		}
	}

	const opciones = {};

	for (const key in notificaciones) {
		if (Object.hasOwnProperty.call(notificaciones, key)) {
			const opcion = notificaciones[key];
			const abc = [];
			opcion.forEach(element => {
				const op = { nombre: element.nombre, label: element.nombre, id: element.id };
				abc.push(op);
			});
			opciones[key] = abc;
		}
	}

	return (
		<div className="flex flex-col sm:flex-row mr-24 sm:mr-4">
			<Controller
				name="notificaciones"
				control={control}
				render={({ field: { onChange, value } }) => {
					const opcAPI = {};
					console.log(value);
					if (value) {
						// eslint-disable-next-line no-restricted-syntax
						for (const key in notificaciones) {
							if (Object.hasOwnProperty.call(notificaciones, key)) {
								// const opcion = notificaciones[key];
								const moduloDic = notificaciones[key];
								const opcion = moduloDic.filter(element => {
									return value.find(element2 => element2.nombre === element.nombre);
								});
								const abc = [];
								opcion.forEach(element => {
									const modulo = value.find(element3 => element3.nombre === element.nombre);
									const op = { ...modulo, label: element.nombre, id: element.id };
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
											console.log(newValue);
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
											error={!!errors.notificacion}
											helperText={errors?.notificacion?.message}
											variant="outlined"
											fullWidth
											InputLabelProps={{
												shrink: true,
											}}
										/>
									)}
								/>
							);
							GrupoModulos.push(ddd);
						}
					}

					return GrupoModulos;
				}}
			/>
		</div>
	);
}

export default ModulosTab;

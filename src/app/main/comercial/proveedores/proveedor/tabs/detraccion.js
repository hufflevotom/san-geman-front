import { Autocomplete, Checkbox, FormControlLabel } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import FuseUtils from '@fuse/utils';
import { useFormContext, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';

function DetraccionProveedor(props) {
	const methods = useFormContext();
	const { control, formState, watch } = methods;
	const { errors } = formState;

	const detraccionVal = watch('detraccion');

	const [check, setCheck] = useState(false);
	const data = useSelector(state => state.comercial.proveedor);

	useEffect(() => {
		if (data?.detraccion) {
			setCheck(true);
		} else {
			setCheck(false);
		}
	}, [data]);

	const opcionesDetraccion = [
		{ id: 1, value: '4% TRANSPORTE', label: '4% TRANSPORTE' },
		{ id: 2, value: '10% SERVICIOS Y ACABADOS', label: '10% SERVICIOS Y ACABADOS' },
		{ id: 3, value: '12% LABORATORIO', label: '12% LABORATORIO' },
	];

	return (
		<>
			<div className="flex flex-col sm:flex-col mr-24 sm:mr-4">
				<div className="flex flex-col sm:flex-col mr-24 sm:mr-4 pr-16 sm:pr-24">
					<Controller
						name="detraccion"
						control={control}
						render={({ field: { onChange, value } }) => {
							const detraccion = value
								? {
										...value,
										label: value.value ? value.value : value,
								  }
								: null;

							return (
								<>
									<FormControlLabel
										className="mt-8 mb-16 mx-12"
										control={
											<Checkbox
												checked={check}
												onChange={e => {
													setCheck(!check);
													if (check) {
														onChange(null);
													} else {
														onChange(value);
													}
												}}
												inputProps={{ 'aria-label': 'controlled' }}
											/>
										}
										label="Agregar Detracción"
									/>

									<div style={{ display: !check ? 'none' : 'flex' }}>
										<Autocomplete
											key={FuseUtils.generateGUID()}
											className="mt-8 mb-16 mx-12"
											// freeSolo
											isOptionEqualToValue={(op, val) => op.id === val.id}
											options={opcionesDetraccion}
											value={detraccion}
											filterOptions={(options, state) => {
												return options;
											}}
											fullWidth
											onChange={(event, newValue) => {
												if (newValue) {
													const { label, ...valor } = newValue;
													onChange(valor);
												} else {
													onChange(null);
												}
											}}
											renderInput={params => (
												<TextField
													{...params}
													placeholder="Seleccione la detracción"
													label="Detracción"
													error={!!errors.detraccion}
													helperText={errors?.detraccion?.message}
													variant="outlined"
													fullWidth
													InputLabelProps={{
														shrink: true,
													}}
												/>
											)}
										/>
									</div>
								</>
							);
						}}
					/>
				</div>
				{detraccionVal !== null && (
					<div className="flex flex-col sm:flex-col mr-24 sm:mr-4 pr-16 sm:pr-24">
						<Controller
							name="nroCuentaDetraccion"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mt-8 mb-16 mx-12"
									error={!!errors.nroCuentaDetraccion}
									helperText={errors?.nroCuentaDetraccion?.message}
									id="nroCuentaDetraccion"
									label="Número de cuenta"
									variant="outlined"
									fullWidth
								/>
							)}
						/>
					</div>
				)}
			</div>
		</>
	);
}

export default DetraccionProveedor;

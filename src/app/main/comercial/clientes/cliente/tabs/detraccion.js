import { Checkbox, FormControlLabel, MenuItem } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';

function DetraccionCliente(props) {
	const methods = useFormContext();
	const { control, formState, watch } = methods;
	const { errors } = formState;

	const [check, setCheck] = useState(false);
	const data = useSelector(state => state.comercial.cliente);

	const tipoCliente = watch('tipoCliente');
	console.log(tipoCliente);

	useEffect(() => {
		if (data?.detraccion) {
			setCheck(true);
		} else {
			setCheck(false);
		}
	}, [data]);

	return (
		<>
			<div className="flex flex-col sm:flex-col mr-24 sm:mr-4">
				<FormControlLabel
					className="mt-8 mb-16 mx-12"
					control={
						<Checkbox
							checked={check}
							onChange={e => {
								setCheck(!check);
							}}
							inputProps={{ 'aria-label': 'controlled' }}
						/>
					}
					label="Agregar Detracción"
				/>
				<div
					style={{ display: !check ? 'none' : 'flex' }}
					className="flex flex-col sm:flex-col mr-24 sm:mr-4 pr-16 sm:pr-24"
				>
					<Controller
						name="detraccion"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								className="mt-8 mb-16 mx-12"
								error={!!errors.detraccion}
								type="number"
								InputProps={{
									inputProps: { min: 0 },
								}}
								helperText={errors?.detraccion?.message}
								id="detraccion"
								label="Detracción"
								variant="outlined"
								fullWidth
							/>
						)}
					/>
				</div>
				<div className="flex flex-col sm:flex-col mr-24 sm:mr-4">
					<Controller
						name="tipoMoneda"
						control={control}
						render={({ field: { onChange, value } }) => {
							let abc = 'Soles';

							if (value) {
								abc = value;
							}
							return (
								<TextField
									select
									className="mt-8 mb-16 mx-12"
									error={!!errors.tipoMoneda}
									required
									helperText={errors?.tipoMoneda?.message}
									label="Tipo Moneda"
									id="tipoMoneda"
									variant="outlined"
									fullWidth
									value={abc}
									onChange={e => {
										onChange(e.target.value);
										// if (e.target.value === 'N') {
										// 	setTipo(false);
										// } else {
										// 	setTipo(true);
										// }
									}}
								>
									<MenuItem value="Soles">Soles</MenuItem>
									<MenuItem value="Dolares">Dolares</MenuItem>
								</TextField>
							);
						}}
					/>
				</div>
				<div
					style={{ display: tipoCliente === 'E' ? 'flex' : 'none' }}
					className="flex flex-col sm:flex-col mr-24 sm:mr-4 pr-16 sm:pr-24"
				>
					<Controller
						name="observacion"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								className="mt-8 mb-16 mx-12"
								error={!!errors.observacion}
								required
								helperText={errors?.observacion?.message}
								label="Observación"
								id="observacion"
								variant="outlined"
								fullWidth
							/>
						)}
					/>
				</div>
			</div>
		</>
	);
}

export default DetraccionCliente;

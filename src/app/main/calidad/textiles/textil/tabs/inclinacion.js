/* eslint-disable no-restricted-globals */
/* eslint-disable no-nested-ternary */
import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';

function Inclinacion(props) {
	const methods = useFormContext();
	const { control, formState, watch } = methods;
	const { errors } = formState;

	const inclinacionAntesDerecho = watch('inclinacionAntesDerecho');
	const inclinacionAntesIzquierdo = watch('inclinacionAntesIzquierdo');

	const inclinacionDespuesDerecho = watch('inclinacionDespuesDerecho');
	const inclinacionDespuesIzquierdo = watch('inclinacionDespuesIzquierdo');

	return (
		<div>
			<div className="flex flex-col mr-24 sm:mr-4 p-24" style={{ marginBottom: 20 }}>
				<div className="flex flex-row w-full">
					<div className="w-1/2 flex justify-start items-center">Estandar</div>
					<Controller
						name="inclinacionEstandar"
						className="w-1/4"
						control={control}
						render={({ field: { onChange, value } }) => {
							let abc = 0;

							if (value) {
								abc = value;
							}
							return (
								<TextField
									type="number"
									InputProps={{
										inputProps: { min: 0 },
									}}
									className="mt-8 mb-16 mx-12"
									error={!!errors.inclinacionEstandar}
									required
									helperText={errors?.inclinacionEstandar?.message}
									label="Estandar"
									id="inclinacionEstandar"
									variant="outlined"
									fullWidth
									value={abc}
									onChange={e => {
										onChange(e.target.value);
									}}
								/>
							);
						}}
					/>
					<div className="w-full mt-8 mb-16 mx-12 flex justify-center items-center">{` `}</div>
					<div className="w-1/3 flex justify-center items-center">{` `}</div>
				</div>
				<div className="flex flex-row w-full">
					<div className="w-1/2 flex justify-start items-center">Antes del lavado</div>
					<Controller
						name="inclinacionAntesDerecho"
						className="w-1/4"
						control={control}
						render={({ field: { onChange, value } }) => {
							let abc = 0;

							if (value) {
								abc = value;
							}
							return (
								<TextField
									type="number"
									InputProps={{
										inputProps: { min: 0 },
									}}
									className="mt-8 mb-16 mx-12"
									error={!!errors.inclinacionAntesDerecho}
									required
									helperText={errors?.inclinacionAntesDerecho?.message}
									label="Derecho"
									id="inclinacionAntesDerecho"
									variant="outlined"
									fullWidth
									value={abc}
									onChange={e => {
										onChange(e.target.value);
									}}
								/>
							);
						}}
					/>
					<Controller
						name="inclinacionAntesIzquierdo"
						className="w-1/4"
						control={control}
						render={({ field: { onChange, value } }) => {
							let abc = 0;

							if (value) {
								abc = value;
							}
							return (
								<TextField
									type="number"
									InputProps={{
										inputProps: { min: 0 },
									}}
									className="mt-8 mb-16 mx-12"
									error={!!errors.inclinacionAntesIzquierdo}
									required
									helperText={errors?.inclinacionAntesIzquierdo?.message}
									label="Izquiero"
									id="inclinacionAntesIzquierdo"
									variant="outlined"
									fullWidth
									value={abc}
									onChange={e => {
										onChange(e.target.value);
									}}
								/>
							);
						}}
					/>
					<div className="w-1/3 flex justify-center items-center">{`Promedio: ${(isNaN(
						(parseFloat(inclinacionAntesDerecho) + parseFloat(inclinacionAntesIzquierdo)) / 2
					)
						? 0
						: (parseFloat(inclinacionAntesDerecho) + parseFloat(inclinacionAntesIzquierdo)) / 2
					).toFixed(2)}`}</div>
				</div>
				<div className="flex flex-row w-full">
					<div className="w-1/2 flex justify-start items-center">Después del lavado</div>
					<Controller
						name="inclinacionDespuesDerecho"
						className="w-1/4"
						control={control}
						render={({ field: { onChange, value } }) => {
							let abc = 0;

							if (value) {
								abc = value;
							}
							return (
								<TextField
									type="number"
									InputProps={{
										inputProps: { min: 0 },
									}}
									className="mt-8 mb-16 mx-12"
									error={!!errors.inclinacionDespuesDerecho}
									required
									helperText={errors?.inclinacionDespuesDerecho?.message}
									label="Derecho"
									id="inclinacionDespuesDerecho"
									variant="outlined"
									fullWidth
									value={abc}
									onChange={e => {
										onChange(e.target.value);
									}}
								/>
							);
						}}
					/>
					<Controller
						name="inclinacionDespuesIzquierdo"
						className="w-1/4"
						control={control}
						render={({ field: { onChange, value } }) => {
							let abc = 0;

							if (value) {
								abc = value;
							}
							return (
								<TextField
									InputProps={{
										inputProps: { min: 0 },
									}}
									type="number"
									className="mt-8 mb-16 mx-12"
									error={!!errors.inclinacionDespuesIzquierdo}
									required
									helperText={errors?.inclinacionDespuesIzquierdo?.message}
									label="Izquiero"
									id="inclinacionDespuesIzquierdo"
									variant="outlined"
									fullWidth
									value={abc}
									onChange={e => {
										onChange(e.target.value);
									}}
								/>
							);
						}}
					/>
					<div className="w-1/3 flex justify-center items-center">{`Promedio: ${(isNaN(
						(parseFloat(inclinacionDespuesDerecho) + parseFloat(inclinacionDespuesIzquierdo)) / 2
					)
						? 0
						: (parseFloat(inclinacionDespuesDerecho) + parseFloat(inclinacionDespuesIzquierdo)) / 2
					).toFixed(2)}`}</div>
				</div>
			</div>
		</div>
	);
}

export default Inclinacion;

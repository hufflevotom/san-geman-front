/* eslint-disable no-restricted-globals */
/* eslint-disable no-nested-ternary */
import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';

function Revirado(props) {
	const methods = useFormContext();
	const { control, formState, watch } = methods;
	const { errors } = formState;

	const reviradoDerecho = watch('reviradoDerecho');
	const reviradoIzquierdo = watch('reviradoIzquierdo');

	return (
		<div>
			<div className="flex flex-col mr-24 sm:mr-4 p-24" style={{ marginBottom: 20 }}>
				<div className="flex flex-row w-full">
					<div className="w-1/2 flex justify-start items-center">Estandar</div>
					<Controller
						name="reviradoEstandar"
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
									disabled
									className="mt-8 mb-16 mx-12"
									error={!!errors.reviradoEstandar}
									required
									helperText={errors?.reviradoEstandar?.message}
									label="Estandar"
									id="reviradoEstandar"
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
					<div className="w-1/2 flex justify-start items-center">Después del lavado</div>
					<Controller
						name="reviradoDerecho"
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
									error={!!errors.reviradoDerecho}
									required
									helperText={errors?.reviradoDerecho?.message}
									label="Derecho"
									id="reviradoDerecho"
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
						name="reviradoIzquierdo"
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
									error={!!errors.reviradoIzquierdo}
									required
									helperText={errors?.reviradoIzquierdo?.message}
									label="Izquiero"
									id="reviradoIzquierdo"
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
						(parseFloat(reviradoDerecho) + parseFloat(reviradoIzquierdo)) / 2
					)
						? 0
						: (parseFloat(reviradoDerecho) + parseFloat(reviradoIzquierdo)) / 2
					).toFixed(2)}`}</div>
				</div>
			</div>
		</div>
	);
}

export default Revirado;
